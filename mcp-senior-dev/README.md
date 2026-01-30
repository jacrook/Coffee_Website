# MCP Senior Dev

An MCP (Model Context Protocol) server that provides a "senior developer" debugging assistant powered by OpenAI's GPT models.

## Setup

1. **Install dependencies:**
   ```bash
   cd mcp-senior-dev
   npm install
   ```

2. **Set your OpenAI API key:**
   ```bash
   export OPENAI_API_KEY=your_api_key_here
   ```

3. **Configure with Claude Code (or other MCP client):**

   Add to your Claude Code settings or MCP client configuration:

   ```json
   {
     "mcpServers": {
       "senior-dev": {
         "command": "node",
         "args": ["/path/to/mcp-senior-dev/server.mjs"],
         "env": {
           "OPENAI_API_KEY": "your_api_key_here"
         }
       }
     }
   }
   ```

## Usage

The `consult` tool accepts the following parameters:

- **task** (required): The debugging task or problem description
- **symptoms** (optional): Error messages, failing tests, logs
- **whatTried** (optional): What you've already attempted
- **constraints** (optional): Any constraints like "no new dependencies"
- **repoRoot** (optional): Repository root path (defaults to cwd)
- **paths** (optional): Array of file paths to read from disk
- **code** (optional): Array of `{path, content}` objects with inline code
- **diff** (optional): Git diff or patch output
- **model** (optional): Override model (gpt-4o, gpt-4o-mini, o1-preview, etc.)
- **maxOutputTokens** (optional): Maximum tokens in response (default: 4000)

## Configuration

You can set these environment variables:

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `SENIOR_DEV_MODEL`: Default model to use (default: gpt-4o-mini)
- `SENIOR_DEV_MAX_OUTPUT`: Default max output tokens (default: 4000)
- `SENIOR_DEV_ROOT`: Default repository root path

## Supported Models

- `gpt-4o-mini` (default, fast and cost-effective)
- `gpt-4o` (more capable, slightly slower)
- `gpt-4-turbo` (legacy, still capable)
- `o1-preview` (strong reasoning, slower)
- `o1-mini` (faster reasoning model)

## Example Usage

```
Use the senior-dev.consult tool to analyze why my canvas texture SVG background
is not appearing on the brown background.

Paths: src/index.css, src/App.tsx
Symptoms: The SVG texture is not visible on the #2B2421 background
Constraints: Don't add new dependencies
```

## Output Format

The assistant returns markdown with:

1. What is happening (2-5 bullets)
2. Top hypotheses (ranked)
3. Next experiments (ordered)
4. Proposed code changes (unified diffs)
5. Test/verification plan
6. Missing facts (if blocked)

## Error Handling

The server will return helpful error messages if:

- `OPENAI_API_KEY` is not set
- The API call fails (with troubleshooting steps)
- File reads fail (shows error per file)

Secrets (API keys, tokens, PEM blocks) are automatically redacted from prompts.
