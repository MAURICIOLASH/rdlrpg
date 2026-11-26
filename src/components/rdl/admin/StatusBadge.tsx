import { STATUS_LABEL, STATUS_STYLE } from "./shared";
export function StatusBadge({ status }: { status: string }) {
  return <span className={`inline-block whitespace-nowrap border px-2.5 py-0.5 font-display text-[10px] tracking-[0.2em] ${STATUS_STYLE[status] ?? ""}`}>{(STATUS_LABEL[status] ?? status).toUpperCase()}</span>;
}
