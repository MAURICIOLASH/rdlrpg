import type { ReactNode } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

export function Field({ label, required, error, hint, children }: { label: string; required?: boolean; error?: string | undefined; hint?: string | undefined; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="block font-display text-xs font-semibold uppercase tracking-[0.2em] text-silver">
        {label} {required ? <span className="text-primary">*</span> : <span className="normal-case tracking-normal text-steel">(opcional)</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-steel">{hint}</p>}
      {error && <p role="alert" className="text-sm text-primary">⸸ {error}</p>}
    </div>
  );
}

export function Choices({ options, reg, cols = 2 }: { options: readonly string[]; reg: UseFormRegisterReturn; cols?: number }) {
  return (
    <div className={`grid gap-2 ${cols === 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"}`}>
      {options.map((o) => (
        <label key={o} className="choice flex items-center gap-3">
          <input type="radio" value={o} {...reg} className="sr-only" />
          <span aria-hidden className="size-2.5 rotate-45 border border-current" />
          {o}
        </label>
      ))}
    </div>
  );
}

export function Check({ reg, error, children }: { reg: UseFormRegisterReturn; error?: string | undefined; children: ReactNode }) {
  return (
    <div>
      <label className="choice flex items-start gap-3">
        <input type="checkbox" {...reg} className="mt-1 size-4 accent-current" />
        <span className="text-sm leading-relaxed">{children}</span>
      </label>
      {error && <p role="alert" className="mt-2 text-sm text-primary">⸸ {error}</p>}
    </div>
  );
}
