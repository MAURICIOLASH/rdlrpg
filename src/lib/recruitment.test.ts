import { describe, expect, it } from "vitest";
import { applicationSchema, step1 } from "./recruitment";

const base = {
  nick: "Ragnar", classe: "Knight", nivel: "120", servidor: "Zephira World", tempoJogo: "1 a 3 anos",
  nome: "Rag", idade: "", discord: "rag#1", contato: "", disponibilidade: "Noite", outrosClas: "Não", experiencia: "",
  motivo: "x", expectativa: "y", participar: "Sim", origem: "Discord", declaracao: true, privacidade: true,
};

describe("recrutamento", () => {
  it("aceita inscrição válida", () => expect(applicationSchema.safeParse(base).success).toBe(true));
  it("rejeita nível não inteiro", () => expect(step1.safeParse({ ...base, nivel: "1.5" }).success).toBe(false));
  it("rejeita nível zero", () => expect(step1.safeParse({ ...base, nivel: "0" }).success).toBe(false));
  it("exige experiência quando já participou de clãs", () =>
    expect(applicationSchema.safeParse({ ...base, outrosClas: "Sim" }).success).toBe(false));
  it("exige aceite da privacidade", () =>
    expect(applicationSchema.safeParse({ ...base, privacidade: false }).success).toBe(false));
});

import { makeProtocol, toApplicationRow } from "./recruitment";
describe("protocolo e mapeamento", () => {
  it("protocolo tem formato RDL-ANO-XXXXX-XXXXX e não repete", () => {
    const a = makeProtocol(new Date("2026-05-01")), b = makeProtocol(new Date("2026-05-01"));
    expect(a).toMatch(/^RDL-2026-[A-Z2-9]{5}-[A-Z2-9]{5}$/);
    expect(a).not.toBe(b);
  });
  it("converte nível e respostas Sim/Não", () => {
    const r = toApplicationRow({ ...base, outrosClas: "Não", participar: "Sim" } as never);
    expect(r.character_level).toBe(120);
    expect(r.event_participation).toBe(true);
    expect(r.previous_clan_details).toBeNull();
  });
});
