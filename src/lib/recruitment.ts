import { z } from "zod";

// Class list is meant to become admin-configurable; keep it in one place until then.
export const CLASSES = [
  "Fighter", "Mechanician", "Archer", "Pikeman", "Atalanta",
  "Knight", "Magician", "Priestess", "Assassin", "Shaman",
] as const;
export const SERVER = "Zephira World";
export const PLAYTIME = ["Menos de 6 meses", "6 meses a 1 ano", "1 a 3 anos", "Mais de 3 anos"] as const;
export const AVAILABILITY = ["Manhã", "Tarde", "Noite", "Madrugada", "Horários variados"] as const;
export const SOURCES = ["Indicação de um membro", "Dentro do jogo", "Discord", "Redes sociais", "Outros"] as const;

const req = (max: number, msg: string) => z.string().trim().min(1, msg).max(max, `Máximo de ${max} caracteres.`);
const opt = (max: number) => z.string().trim().max(max, `Máximo de ${max} caracteres.`);

export const step1 = z.object({
  nick: req(30, "Informe o nick do personagem."),
  classe: z.string().min(1, "Selecione a classe."),
  nivel: z.string().trim().min(1, "Informe o nível.").regex(/^[1-9]\d{0,3}$/, "O nível deve ser um número inteiro positivo."),
  servidor: z.literal(SERVER),
  tempoJogo: z.enum(PLAYTIME, { message: "Selecione o tempo de jogo." }),
});

export const step2 = z.object({
  nome: req(60, "Informe seu nome ou apelido."),
  idade: z.string().trim().refine((v) => v === "" || (/^\d{1,3}$/.test(v) && +v >= 1 && +v <= 120), "Idade inválida."),
  discord: req(40, "Informe seu Discord."),
  contato: opt(60),
  disponibilidade: z.enum(AVAILABILITY, { message: "Selecione sua disponibilidade." }),
  outrosClas: z.enum(["Sim", "Não"], { message: "Responda esta pergunta." }),
  experiencia: opt(800),
});

export const step3 = z.object({
  motivo: req(1000, "Conte por que deseja entrar no RDL Infernais."),
  expectativa: req(1000, "Conte o que espera encontrar no clã."),
  participar: z.enum(["Sim", "Não"], { message: "Responda esta pergunta." }),
  origem: z.enum(SOURCES, { message: "Selecione como conheceu o RDL." }),
  declaracao: z.literal(true, { message: "Você precisa confirmar a declaração." }),
  privacidade: z.literal(true, { message: "Você precisa aceitar a política de privacidade." }),
});

export const applicationSchema = step1.merge(step2).merge(step3).superRefine((d, ctx) => {
  if (d.outrosClas === "Sim" && d.experiencia.trim() === "")
    ctx.addIssue({ code: "custom", path: ["experiencia"], message: "Conte um pouco sobre sua experiência." });
});
export type Application = z.infer<typeof applicationSchema>;
export const STEP_FIELDS = [
  Object.keys(step1.shape),
  [...Object.keys(step2.shape)],
  Object.keys(step3.shape),
] as (keyof Application)[][];

export function makeProtocol(date = new Date()): string {
  const y = date.getFullYear();
  const rnd = Array.from(crypto.getRandomValues(new Uint8Array(4)), (b) => b.toString(36).padStart(2, "0")).join("").slice(0, 6).toUpperCase();
  return `RDL-${y}-${rnd}`;
}

// Placeholder until Lovable Cloud is connected: NOTHING is stored yet.
export async function submitApplication(_data: Application): Promise<{ protocol: string }> {
  await new Promise((r) => setTimeout(r, 1200));
  return { protocol: makeProtocol() };
}
