import type { listApplications } from "@/lib/applications.functions";

export type AdminApp = Awaited<ReturnType<typeof listApplications>>[number];
export const STATUS_LABEL: Record<string, string> = { PENDING: "Pendente", APPROVED: "Aprovado", REJECTED: "Reprovado", CONTACT: "Em contato" };
export const STATUS_STYLE: Record<string, string> = {
  PENDING: "border-steel text-steel",
  APPROVED: "border-primary text-primary bg-primary/10",
  REJECTED: "border-border text-muted-foreground line-through",
  CONTACT: "border-silver text-silver",
};
export const fmtDate = (d: string) => new Date(d).toLocaleDateString("pt-BR");
export const fmtDateTime = (d: string) => new Date(d).toLocaleString("pt-BR");
