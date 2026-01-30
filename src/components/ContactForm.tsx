import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  message: z.string().min(10, "Message should be at least 10 characters"),
  // simple honeypot (spam): should stay empty
  company: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    // Honeypot hit → silently ignore
    if (values.company) return;

    // Formspree endpoint from env var
    const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;
    if (!endpoint) {
      throw new Error("Formspree endpoint not configured");
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ name: values.name, email: values.email, message: values.message }),
    });

    if (!res.ok) throw new Error("Failed to send");
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
      {isSubmitSuccessful && (
        <div className="contact-form-success">
          Message sent ✅ I'll get back to you soon.
        </div>
      )}

      <div className="contact-form-field">
        <label htmlFor="name" className="contact-form-label">
          Name
        </label>
        <input
          id="name"
          className="contact-form-input sharpie-border"
          {...register("name")}
          autoComplete="name"
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="contact-form-error" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="contact-form-field">
        <label htmlFor="email" className="contact-form-label">
          Email
        </label>
        <input
          id="email"
          className="contact-form-input sharpie-border"
          {...register("email")}
          autoComplete="email"
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="contact-form-error" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Honeypot field (hidden) */}
      <input
        id="company"
        tabIndex={-1}
        autoComplete="off"
        className="sr-only"
        {...register("company")}
      />

      <div className="contact-form-field">
        <label htmlFor="message" className="contact-form-label">
          Message
        </label>
        <textarea
          id="message"
          className="contact-form-textarea sharpie-border"
          {...register("message")}
          aria-invalid={!!errors.message}
        />
        {errors.message && (
          <p className="contact-form-error" role="alert">
            {errors.message.message}
          </p>
        )}
      </div>

      <button
        disabled={isSubmitting}
        className="contact-form-submit sharpie-border"
        type="submit"
      >
        {isSubmitting ? "Sending…" : "Send"}
      </button>

      <style>{`
        .contact-form {
          width: 100%;
          max-width: 500px;
        }

        /* Success message */
        .contact-form-success {
          margin-bottom: 1.5rem;
          padding: 1rem;
          border: 3px solid #000;
          background-color: #fff;
          font-family: "LetterboardWhite Pixillo", sans-serif;
          font-size: 1.125rem;
          color: #000;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        /* Form field container */
        .contact-form-field {
          margin-bottom: 1.25rem;
          text-align: left;
        }

        /* Labels - using letterboard font */
        .contact-form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-family: "LetterboardWhite Pixillo", sans-serif;
          font-size: clamp(1.125rem, 2vw, 1.375rem);
          font-weight: normal;
          color: #000;
          letter-spacing: 0.05em;
        }

        /* Shared input styles */
        .contact-form-input,
        .contact-form-textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          font-family: "Source Serif 4", ui-serif, Georgia, serif;
          font-size: 1rem;
          line-height: 1.5;
          color: #000;
          background-color: #fff;
          border: none;
          border-radius: 4px;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06),
                      0 1px 2px rgba(0, 0, 0, 0.05);
          transition: box-shadow 0.2s ease;
          -webkit-appearance: none;
          appearance: none;
        }

        .contact-form-textarea {
          min-height: 140px;
          resize: vertical;
        }

        /* Focus state - enhanced shadow */
        .contact-form-input:focus,
        .contact-form-textarea:focus {
          outline: none;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06),
                      0 0 0 3px rgba(0, 0, 0, 0.1),
                      0 4px 12px rgba(0, 0, 0, 0.15);
        }

        /* Error state styling */
        .contact-form-input[aria-invalid="true"],
        .contact-form-textarea[aria-invalid="true"] {
          box-shadow: inset 0 2px 4px rgba(220, 38, 38, 0.1),
                      0 0 0 2px rgba(220, 38, 38, 0.2);
        }

        .contact-form-input[aria-invalid="true"]:focus,
        .contact-form-textarea[aria-invalid="true"]:focus {
          box-shadow: inset 0 2px 4px rgba(220, 38, 38, 0.1),
                      0 0 0 3px rgba(220, 38, 38, 0.3),
                      0 4px 12px rgba(220, 38, 38, 0.2);
        }

        /* Error message */
        .contact-form-error {
          margin-top: 0.375rem;
          margin-bottom: 0;
          font-family: "Source Serif 4", ui-serif, Georgia, serif;
          font-size: 0.875rem;
          color: #dc2626;
          font-weight: 500;
        }

        /* Submit button */
        .contact-form-submit {
          width: 100%;
          padding: 0.875rem 1.5rem;
          font-family: "expositionmedium", cursive;
          font-size: 1.25rem;
          font-weight: normal;
          color: #000;
          background-color: rgba(255, 255, 255, 0.8);
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .contact-form-submit:hover:not(:disabled) {
          background-color: rgba(0, 0, 0, 0.05);
          transform: translateY(-1px);
        }

        .contact-form-submit:active:not(:disabled) {
          transform: translateY(0);
        }

        .contact-form-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Screen reader only */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        /* ========================================
           SHARPIE BORDER EFFECT
           ========================================
           Creates a hand-drawn, imperfect border
           using multiple rotated pseudo-elements
           to simulate sharpie marker tracing
           ======================================== */

        .sharpie-border {
          position: relative;
        }

        /* Base border - subtle, clean */
        .sharpie-border::before {
          content: "";
          position: absolute;
          inset: 0;
          border: 3px solid #000;
          border-radius: 4px;
          pointer-events: none;
          opacity: 0.7;
        }

        /* Hand-drawn effect - rotated pseudo-element */
        .sharpie-border::after {
          content: "";
          position: absolute;
          inset: -2px;
          border: 3px solid #000;
          border-radius: 4px;
          opacity: 0.3;
          transform: rotate(-0.5deg);
          pointer-events: none;
        }

        /* Additional wobble layers for more imperfection */
        .sharpie-border {
          box-shadow:
            /* Top wobble */
            0 -1px 0 0 rgba(0, 0, 0, 0.2),
            /* Bottom wobble */
            0 1px 0 0 rgba(0, 0, 0, 0.2),
            /* Subtle rotation shadow */
            1px 1px 2px rgba(0, 0, 0, 0.05);
        }

        /* Focus enhancement for sharpie border */
        .sharpie-border:focus::before,
        .sharpie-border:focus::after {
          border-color: #000;
          opacity: 1;
        }

        .sharpie-border:focus {
          box-shadow:
            0 -1px 0 0 rgba(0, 0, 0, 0.3),
            0 1px 0 0 rgba(0, 0, 0, 0.3),
            0 0 0 3px rgba(0, 0, 0, 0.1),
            0 4px 12px rgba(0, 0, 0, 0.15);
        }

        /* Error state for sharpie border */
        .sharpie-border[aria-invalid="true"]::before,
        .sharpie-border[aria-invalid="true"]::after {
          border-color: #dc2626;
          opacity: 1;
        }

        .sharpie-border[aria-invalid="true"] {
          box-shadow:
            0 -1px 0 0 rgba(220, 38, 38, 0.4),
            0 1px 0 0 rgba(220, 38, 38, 0.4),
            0 0 0 2px rgba(220, 38, 38, 0.2);
        }

        /* Submit button sharpie effect - slightly bolder */
        .contact-form-submit.sharpie-border::before {
          border-width: 4px;
          opacity: 0.9;
        }

        .contact-form-submit.sharpie-border::after {
          border-width: 3px;
          transform: rotate(0.3deg);
        }

        .contact-form-submit.sharpie-border:hover::before,
        .contact-form-submit.sharpie-border:hover::after {
          border-width: 4px;
          transform: rotate(-0.2deg);
        }
      `}</style>
    </form>
  );
}
