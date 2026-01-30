// server.mjs
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import OpenAI from "openai";
import fs from "node:fs/promises";
import path from "node:path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM = `
You are a pragmatic “senior dev” debugging assistant.
Goal: propose the smallest set of high-confidence fixes and experiments.

Output format (markdown):
1) What I think is happening (2-5 bullets)
2) Top hypotheses (ranked, with quick rationale)
3) Next experiments (ordered, copy/paste commands if possible)
4) Proposed code changes (unified diffs when feasible)
5) Test/verification plan
6) If blocked: the 3 most important missing facts to ask for
`.trim();

function redactSecrets(s = "") {
  return String(s)
    // Common env assignments
    .replace(
      /(OPENAI_API_KEY|ANTHROPIC_API_KEY|CF_API_TOKEN|CLOUDFLARE_API_TOKEN|GITHUB_TOKEN|SLACK_BOT_TOKEN)\s*=\s*[^\s]+/g,
      "$1=<redacted>"
    )
    // Authorization headers
    .replace(/Bearer\s+[A-Za-z0-9_\-\.=]+/g, "Bearer <redacted>")
    // PEM blocks
    .replace(
      /-----BEGIN [^-]+-----[\s\S]*?-----END [^-]+-----/g,
      "<redacted pem>"
    );
}

function clip(s = "", max = 200_000) {
  const str = String(s);
  if (str.length <= max) return str;
  return str.slice(0, max) + `\n\n...<clipped ${str.length - max} chars>...`;
}

function safeJoin(root, p) {
  const resolvedRoot = path.resolve(root);
  const resolved = path.resolve(root, p);

  // Ensure resolved is inside resolvedRoot
  if (
    resolved !== resolvedRoot &&
    !resolved.startsWith(resolvedRoot + path.sep)
  ) {
    throw new Error(`Refusing to read outside repoRoot: ${p}`);
  }
  return resolved;
}

async function readFiles(root, pathsToRead = []) {
  const files = [];
  for (const p of pathsToRead) {
    try {
      const full = safeJoin(root, p);
      const buf = await fs.readFile(full);

      // Skip obvious binaries by presence of NUL
      if (buf.includes(0)) {
        files.push({ path: p, content: "<binary omitted>" });
        continue;
      }

      files.push({ path: p, content: clip(buf.toString("utf8")) });
    } catch (e) {
      files.push({
        path: p,
        content: `<failed to read: ${String(e?.message || e)}>`,
      });
    }
  }
  return files;
}

const server = new McpServer({ name: "senior-dev", version: "1.1.0" });

server.registerTool(
  "consult",
  {
    title: "Senior Dev Consult (GPT-4o-mini)",
    description:
      "Send debugging/task context + optional file paths; returns ranked fixes and diffs.",
    inputSchema: {
      task: z.string().min(1),
      symptoms: z.string().optional(), // errors, failing tests, logs
      whatTried: z.string().optional(),
      constraints: z.string().optional(), // "no deps", "must keep API stable", etc.
      repoRoot: z.string().optional(), // default: cwd (or env SENIOR_DEV_ROOT)
      paths: z.array(z.string()).optional(), // files to read from disk
      code: z
        .array(z.object({ path: z.string(), content: z.string() }))
        .optional(), // OR provide file contents directly
      diff: z.string().optional(), // git diff or patch
      model: z.string().optional(), // override model per call (gpt-4o, gpt-4o-mini, o1-preview, etc.)
      maxOutputTokens: z.number().int().positive().optional(),
    },
  },
  async (args) => {
    // Validate API key
    if (!process.env.OPENAI_API_KEY) {
      return {
        content: [{
          type: "text",
          text: "Error: OPENAI_API_KEY environment variable is not set. Please set it before using this tool."
        }]
      };
    }

    const root = args.repoRoot || process.env.SENIOR_DEV_ROOT || process.cwd();

    const fromDisk = args.paths?.length ? await readFiles(root, args.paths) : [];
    const provided = args.code || [];

    const payload = {
      task: args.task,
      symptoms: args.symptoms || "",
      whatTried: args.whatTried || "",
      constraints: args.constraints || "",
      diff: args.diff || "",
      files: [...fromDisk, ...provided],
    };

    const prompt =
      `TASK:\n${payload.task}\n\n` +
      `SYMPTOMS:\n${payload.symptoms}\n\n` +
      `WHAT I TRIED:\n${payload.whatTried}\n\n` +
      `CONSTRAINTS:\n${payload.constraints}\n\n` +
      (payload.diff ? `DIFF:\n${clip(payload.diff, 120_000)}\n\n` : "") +
      `FILES:\n` +
      payload.files
        .map((f) => `--- ${f.path} ---\n${clip(f.content, 120_000)}\n`)
        .join("\n");

    // Valid OpenAI models: gpt-4o, gpt-4o-mini, gpt-4-turbo, o1-preview, o1-mini
    const model =
      args.model ||
      process.env.SENIOR_DEV_MODEL ||
      "gpt-4o-mini";

    const maxTokens =
      args.maxOutputTokens ||
      Number(process.env.SENIOR_DEV_MAX_OUTPUT || 4000);

    try {
      const response = await openai.chat.completions.create({
        model,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: redactSecrets(prompt) }
        ],
        max_tokens: maxTokens,
      });

      const text = response.choices?.[0]?.message?.content || "(no response from model)";
      return { content: [{ type: "text", text }] };
    } catch (error) {
      // Provide detailed error information
      const errorMsg = `OpenAI API Error: ${error.message || error}`;
      console.error("MCP senior-dev error:", error);
      return {
        content: [{
          type: "text",
          text: `Error calling OpenAI API: ${errorMsg}\n\nPlease check:\n- OPENAI_API_KEY is set correctly\n- Model "${model}" is available\n- You have sufficient API quota`
        }]
      };
    }
  }
);

await server.connect(new StdioServerTransport());

