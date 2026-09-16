"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

export function SubmitButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={`t-meta-lg min-h-[44px] bg-ink px-5 text-paper transition-colors hover:bg-accent hover:text-ink disabled:opacity-50 ${className}`}
    >
      {pending ? "SAVING…" : children}
    </button>
  );
}

// Two-step inline delete. No confirm() dialogs.
export function ConfirmDelete({ action, id, label = "DELETE" }: { action: (f: FormData) => void; id: number; label?: string }) {
  const [arm, setArm] = useState(false);
  if (!arm)
    return (
      <button type="button" onClick={() => setArm(true)} className="t-meta min-h-[32px] px-2 text-gray hover:text-red-700">
        {label}
      </button>
    );
  return (
    <form action={action} className="inline-flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <span className="t-meta text-red-700">SURE?</span>
      <button type="submit" className="t-meta min-h-[32px] bg-red-700 px-2 text-white">
        YES, DELETE
      </button>
      <button type="button" onClick={() => setArm(false)} className="t-meta min-h-[32px] px-2 text-gray">
        CANCEL
      </button>
    </form>
  );
}
