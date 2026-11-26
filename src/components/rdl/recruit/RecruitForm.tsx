import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState } from "react";
import { submitApplication } from "@/lib/applications.functions";
import { useSiteSettings } from "@/lib/use-site-settings";
import { useForm } from "react-hook-form";
import {
  applicationSchema, AVAILABILITY, CLASSES, PLAYTIME, SERVER, SOURCES, STEP_FIELDS, type Application,
} from "@/lib/recruitment";
import { Logo } from "../Logo";
import { Ornament } from "../Reveal";
import { Check, Choices, Field } from "./Fields";

const STEPS = ["Personagem", "Jogador", "Recrutamento", "Revisão"];

export function RecruitForm() {
  const [step, setStep] = useState(0);
  const [protocol, setProtocol] = useState<string | null>(null);
  const sending = useRef(false);
  const startedAt = useRef(Date.now());
  const honeypot = useRef<HTMLInputElement>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const submit = useServerFn(submitApplication);
  const { settings, loaded } = useSiteSettings();
  const classes = settings.classes.length ? settings.classes : CLASSES;
  const top = useRef<HTMLDivElement>(null);
  const { register, handleSubmit, trigger, watch, getValues, formState: { errors, isSubmitting } } = useForm<Application>({
    resolver: zodResolver(applicationSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    shouldUnregister: false,
    defaultValues: { servidor: SERVER, idade: "", contato: "", experiencia: "" } as Partial<Application>,
  });
  const outros = watch("outrosClas");

  const go = (n: number) => { setStep(n); top.current?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const next = async () => {
    const fields = STEP_FIELDS[step] ?? [];
    if (await trigger(fields, { shouldFocus: true })) go(step + 1);
  };
  const onSubmit = handleSubmit(async (data) => {
    if (sending.current || protocol) return;
    sending.current = true;
    setSubmitError(null);
    try {
      const res = await submit({ data: { form: data, website: honeypot.current?.value ?? "", startedAt: startedAt.current } });
      if (res.ok) { setProtocol(res.protocol); window.scrollTo({ top: 0, behavior: "smooth" }); }
      else setSubmitError(res.error);
    } catch {
      setSubmitError("Falha de conexão. Tente novamente.");
    } finally { sending.current = false; }
  });

  if (protocol) return <Confirmation protocol={protocol} />;
  if (loaded && !settings.recruitment_open) return (
    <div className="stone-texture metal-border mx-auto max-w-2xl p-10 text-center">
      <Logo className="mx-auto h-20 opacity-80" />
      <p className="mt-6 font-display text-lg font-bold tracking-[0.3em] text-primary">RECRUTAMENTO TEMPORARIAMENTE FECHADO</p>
      <p className="mt-4 text-foreground/75">No momento não estamos recebendo novas inscrições. Volte em breve.</p>
    </div>
  );
  const e = (k: keyof Application) => errors[k]?.message as string | undefined;

  return (
    <div ref={top} className="stone-texture metal-border mx-auto max-w-3xl scroll-mt-24 p-5 sm:p-10">
      <div className="text-center">
        <p className="font-display text-xs tracking-[0.4em] text-steel">INSCRIÇÃO OFICIAL</p>
        <h2 className="mt-3 font-gothic text-3xl text-metal sm:text-5xl">Ficha de Recrutamento</h2>
      </div>

      <Progress step={step} />

      <form onSubmit={onSubmit} noValidate>
        <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }} className="space-y-6">
            <h3 className="font-display text-sm font-bold tracking-[0.3em] text-primary">
              ETAPA 0{step + 1} — {STEPS[step]?.toUpperCase()}
            </h3>

            {step === 0 && (<>
              <Field label="Nick do personagem" required error={e("nick")}>
                <input className="field-dark" maxLength={30} aria-invalid={!!errors.nick} {...register("nick")} />
              </Field>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Classe" required error={e("classe")}>
                  <select className="field-dark" aria-invalid={!!errors.classe} defaultValue="" {...register("classe")}>
                    <option value="" disabled>Selecione…</option>
                    {classes.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Nível atual" required error={e("nivel")}>
                  <input className="field-dark" inputMode="numeric" maxLength={4} aria-invalid={!!errors.nivel} {...register("nivel")} />
                </Field>
              </div>
              <Field label="Servidor" required>
                <input className="field-dark" disabled value={SERVER} readOnly />
              </Field>
              <Field label="Tempo de jogo" required error={e("tempoJogo")}>
                <Choices options={PLAYTIME} reg={register("tempoJogo")} />
              </Field>
            </>)}

            {step === 1 && (<>
              <div className="grid gap-6 sm:grid-cols-[1fr_8rem]">
                <Field label="Nome ou apelido" required error={e("nome")}>
                  <input className="field-dark" maxLength={60} aria-invalid={!!errors.nome} {...register("nome")} />
                </Field>
                <Field label="Idade" error={e("idade")}>
                  <input className="field-dark" inputMode="numeric" maxLength={3} {...register("idade")} />
                </Field>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Discord" required error={e("discord")}>
                  <input className="field-dark" maxLength={40} placeholder="seu.usuario" aria-invalid={!!errors.discord} {...register("discord")} />
                </Field>
                <Field label="WhatsApp ou contato" error={e("contato")}>
                  <input className="field-dark" maxLength={60} {...register("contato")} />
                </Field>
              </div>
              <Field label="Disponibilidade" required error={e("disponibilidade")}>
                <Choices options={AVAILABILITY} reg={register("disponibilidade")} cols={3} />
              </Field>
              <Field label="Já participou de outros clãs?" required error={e("outrosClas")}>
                <Choices options={["Sim", "Não"]} reg={register("outrosClas")} />
              </Field>
              <AnimatePresence>
                {outros === "Sim" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                    <Field label="Conte um pouco sobre sua experiência em outros clãs" required error={e("experiencia")}>
                      <textarea rows={4} maxLength={800} className="field-dark" {...register("experiencia")} />
                    </Field>
                  </motion.div>
                )}
              </AnimatePresence>
            </>)}

            {step === 2 && (<>
              <Field label="Por que deseja entrar no RDL Infernais?" required error={e("motivo")} hint="Até 1000 caracteres.">
                <textarea rows={4} maxLength={1000} className="field-dark" aria-invalid={!!errors.motivo} {...register("motivo")} />
              </Field>
              <Field label="O que espera encontrar no clã?" required error={e("expectativa")} hint="Até 1000 caracteres.">
                <textarea rows={4} maxLength={1000} className="field-dark" aria-invalid={!!errors.expectativa} {...register("expectativa")} />
              </Field>
              <Field label="Está disposto a participar das atividades e eventos?" required error={e("participar")}>
                <Choices options={["Sim", "Não"]} reg={register("participar")} />
              </Field>
              <Field label="Como conheceu o RDL?" required error={e("origem")}>
                <Choices options={SOURCES} reg={register("origem")} />
              </Field>
              <Check reg={register("declaracao")} error={e("declaracao")}>
                Declaro que as informações fornecidas são verdadeiras e estou ciente das regras do RDL Infernais.
              </Check>
              <Check reg={register("privacidade")} error={e("privacidade")}>
                Li e aceito a <Link to="/privacidade" target="_blank" className="underline underline-offset-4 text-primary">política de privacidade</Link>.
              </Check>
            </>)}

            {step === 3 && <Review data={getValues()} onEdit={go} />}
          </motion.div>
        </AnimatePresence>

        {submitError && step === 3 && (
          <p role="alert" className="mt-8 border border-silver bg-secondary px-4 py-3 text-sm text-primary">⸸ {submitError}</p>
        )}
        <div className="mt-10 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
          <button type="button" onClick={() => go(step - 1)} disabled={step === 0 || isSubmitting}
            className="btn-ghost-metal px-6 py-3 text-xs disabled:invisible">Voltar</button>
          {step < 3 ? (
            <button key="next" type="button" onClick={next} className="btn-metal px-8 py-3 text-xs">Próxima Etapa</button>
          ) : (
            <button key="submit" type="submit" disabled={isSubmitting} className="btn-metal flex items-center justify-center gap-2 px-8 py-3 text-xs disabled:opacity-70">
              {isSubmitting ? <><Loader2 className="size-4 animate-spin" /> Enviando…</> : "Enviar Inscrição"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function Progress({ step }: { step: number }) {
  return (
    <div className="my-8">
      <div className="relative h-1 bg-secondary">
        <motion.div className="absolute inset-y-0 left-0 bg-silver" animate={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} transition={{ duration: 0.5 }} />
      </div>
      <ol className="mt-4 grid grid-cols-4 text-center">
        {STEPS.map((s, i) => (
          <li key={s} className={`font-display text-[8px] tracking-normal sm:text-xs sm:tracking-[0.15em] ${i <= step ? "text-primary" : "text-steel"}`}>
            <span className={`mx-auto mb-2 flex size-7 rotate-45 items-center justify-center border ${i <= step ? "border-silver bg-secondary" : "border-border"}`}>
              <span className="-rotate-45">{i + 1}</span>
            </span>
            {s.toUpperCase()}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Review({ data, onEdit }: { data: Application; onEdit: (n: number) => void }) {
  const groups: [string, number, [string, string | undefined][]][] = [
    ["Personagem", 0, [["Nick", data.nick], ["Classe", data.classe], ["Nível", data.nivel], ["Servidor", data.servidor], ["Tempo de jogo", data.tempoJogo]]],
    ["Jogador", 1, [["Nome", data.nome], ["Idade", data.idade], ["Discord", data.discord], ["Contato", data.contato], ["Disponibilidade", data.disponibilidade], ["Outros clãs", data.outrosClas], ...(data.outrosClas === "Sim" ? [["Experiência", data.experiencia] as [string, string]] : [])]],
    ["Recrutamento", 2, [["Motivo", data.motivo], ["Expectativa", data.expectativa], ["Participar de eventos", data.participar], ["Como conheceu", data.origem]]],
  ];
  return (
    <div className="space-y-6">
      <p className="text-sm text-foreground/75">Confira seus dados antes de enviar.</p>
      {groups.map(([title, n, rows]) => (
        <div key={title} className="border border-border bg-abyss/60 p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-display text-xs font-bold tracking-[0.25em] text-silver">{title.toUpperCase()}</h4>
            <button type="button" onClick={() => onEdit(n)} className="text-xs text-steel underline underline-offset-4 hover:text-primary">Editar</button>
          </div>
          <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[10rem_1fr]">
            {rows.map(([k, v]) => (<div key={k} className="contents"><dt className="text-xs uppercase tracking-wider text-steel">{k}</dt><dd className="break-words text-sm text-primary">{v || "—"}</dd></div>))}
          </dl>
        </div>
      ))}
    </div>
  );
}

function Confirmation({ protocol }: { protocol: string }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
      className="stone-texture metal-border mx-auto max-w-2xl p-8 text-center sm:p-12">
      <Logo className="mx-auto h-36 sm:h-48" />
      <h2 className="mt-6 font-display text-xl font-black tracking-[0.2em] text-primary sm:text-2xl">SUA SOLICITAÇÃO FOI REGISTRADA.</h2>
      <div className="my-6"><Ornament /></div>
      <p className="text-foreground/80">"Seu destino foi apresentado à liderança do RDL Infernais. Aguarde o contato dos responsáveis pelo recrutamento."</p>
      <div className="mx-auto mt-8 inline-block border border-silver px-6 py-4">
        <p className="font-display text-[10px] tracking-[0.3em] text-steel">PROTOCOLO</p>
        <p className="mt-1 font-display text-xl font-bold tracking-[0.2em] text-primary">{protocol}</p>
      </div>
      <p className="mt-4 text-xs text-steel">Guarde este número para identificar sua inscrição.</p>
    </motion.div>
  );
}
