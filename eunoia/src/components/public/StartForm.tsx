"use client";

import { useActionState, useState } from "react";
import { createInquiry, type InquiryState } from "@/actions/inquiries";
import { PillButton } from "./Pill";

const IMPROVE = ["DATA", "REPORTING", "SEO", "WEBSITE", "MARKETING", "AUTOMATION", "AI", "OTHER"];
const NEED = ["ANALYSIS", "DASHBOARD", "SEO AUDIT", "BUILD", "AUTOMATION", "CONSULTATION", "OTHER"];
const STEPS = ["IMPROVE", "PROBLEM", "NEED", "DETAILS", "MESSAGE"];

// 5-step guided inquiry. All fields stay in one <form>; inactive steps are hidden, not unmounted.
export function StartForm() {
  const [state, action, pending] = useActionState<InquiryState, FormData>(createInquiry, { ok: false });
  const [step, setStep] = useState(0);
  const [improve, setImprove] = useState("");
  const [need, setNeed] = useState("");
  const err = state.errors ?? {};

  if (state.ok) {
    return (
      <div className="py-20" role="status" aria-live="polite">
        <p className="t-meta mb-6 text-accent">{"////// "}CONFIRMED</p>
        <p className="t-display text-[clamp(2.5rem,8vw,7rem)]">
          RECEIVED.
          <br />
          EUNΟIA HAS THE SIGNAL.
        </p>
        <p className="mt-8 max-w-xl text-lg text-gray">
          I read every inquiry personally and reply within two working days. Meanwhile, the Work and Lab pages show
          how I think.
        </p>
      </div>
    );
  }

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <form action={action} noValidate className="max-w-3xl">
      {/* progress */}
      <ol className="t-meta mb-12 flex flex-wrap gap-x-6 gap-y-2 text-gray" aria-label="Steps">
        {STEPS.map((s, i) => (
          <li key={s} aria-current={i === step ? "step" : undefined} className={i === step ? "text-paper" : ""}>
            <span className={i < step ? "text-accent" : ""}>0{i + 1}</span> {s}
          </li>
        ))}
      </ol>

      {/* honeypot */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* Step 1 */}
      <fieldset hidden={step !== 0} className="mb-10">
        <legend className="t-display mb-8 text-[clamp(1.8rem,5vw,4rem)]">WHAT ARE YOU TRYING TO IMPROVE?</legend>
        <Choices name="improve" options={IMPROVE} value={improve} onChange={setImprove} />
        <Err msg={err.improve} />
      </fieldset>

      {/* Step 2 */}
      <fieldset hidden={step !== 1} className="mb-10">
        <legend className="t-display mb-8 text-[clamp(1.8rem,5vw,4rem)]">WHAT IS THE PROBLEM?</legend>
        <label htmlFor="problem" className="t-meta mb-2 block text-gray">
          IN YOUR WORDS. NO JARGON NEEDED.
        </label>
        <textarea id="problem" name="problem" rows={5} className={ta} aria-describedby="problem-err" />
        <Err id="problem-err" msg={err.problem} />
      </fieldset>

      {/* Step 3 */}
      <fieldset hidden={step !== 2} className="mb-10">
        <legend className="t-display mb-8 text-[clamp(1.8rem,5vw,4rem)]">WHAT DO YOU NEED?</legend>
        <Choices name="need" options={NEED} value={need} onChange={setNeed} />
        <Err msg={err.need} />
      </fieldset>

      {/* Step 4 */}
      <fieldset hidden={step !== 3} className="mb-10">
        <legend className="t-display mb-8 text-[clamp(1.8rem,5vw,4rem)]">DETAILS</legend>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="BUDGET (OPTIONAL)" name="budget" placeholder="e.g. ₹50k–1L / $1–2k" />
          <Field label="TIMELINE (OPTIONAL)" name="timeline" placeholder="e.g. 4 weeks" />
          <Field label="COMPANY (OPTIONAL)" name="company" />
          <Field label="YOUR NAME" name="name" error={err.name} autoComplete="name" required />
          <Field label="EMAIL" name="email" type="email" error={err.email} autoComplete="email" required />
        </div>
      </fieldset>

      {/* Step 5 */}
      <fieldset hidden={step !== 4} className="mb-10">
        <legend className="t-display mb-8 text-[clamp(1.8rem,5vw,4rem)]">MESSAGE</legend>
        <label htmlFor="message" className="t-meta mb-2 block text-gray">
          ANYTHING ELSE — LINKS, CONTEXT, CONSTRAINTS.
        </label>
        <textarea id="message" name="message" rows={6} className={ta} aria-describedby="message-err" />
        <Err id="message-err" msg={err.message} />
        {Object.keys(err).length > 0 && (
          <p role="alert" className="t-meta mt-4 text-accent">
            SOME FIELDS NEED ATTENTION: {Object.keys(err).join(", ").toUpperCase()}. USE BACK TO FIX.
          </p>
        )}
      </fieldset>

      <div className="flex flex-wrap items-center gap-4 border-t border-line pt-8">
        {step > 0 && (
          <button type="button" onClick={back} className="t-meta-lg min-h-[44px] hover:text-accent">
            ← BACK
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <PillButton type="button" onClick={next}>
            NEXT
          </PillButton>
        ) : (
          <PillButton type="submit" disabled={pending} aria-busy={pending}>
            {pending ? "SENDING…" : "SEND THE SIGNAL"}
          </PillButton>
        )}
      </div>
    </form>
  );
}

const ta =
  "w-full border border-line bg-transparent p-4 text-lg text-paper placeholder:text-gray/60 focus:border-paper";

function Choices({
  name, options, value, onChange,
}: { name: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((o) => (
        <label
          key={o}
          className={`t-meta-lg inline-flex min-h-[48px] cursor-pointer items-center rounded-full border px-5 transition-colors ${
            value === o ? "border-accent bg-accent text-ink" : "border-line hover:border-paper"
          }`}
        >
          <input
            type="radio"
            name={name}
            value={o}
            checked={value === o}
            onChange={() => onChange(o)}
            className="sr-only"
          />
          {o}
        </label>
      ))}
    </div>
  );
}

function Field({
  label, name, error, type = "text", ...rest
}: { label: string; name: string; error?: string } & React.ComponentProps<"input">) {
  return (
    <div>
      <label htmlFor={name} className="t-meta mb-2 block text-gray">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-err` : undefined}
        className="min-h-[48px] w-full border border-line bg-transparent px-4 text-lg text-paper placeholder:text-gray/60 focus:border-paper"
        {...rest}
      />
      <Err id={`${name}-err`} msg={error} />
    </div>
  );
}

function Err({ msg, id }: { msg?: string; id?: string }) {
  if (!msg) return null;
  return (
    <p id={id} className="t-meta mt-2 text-accent" role="alert">
      {msg}
    </p>
  );
}
