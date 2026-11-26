import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Shield, Swords, Users, ChevronDown } from "lucide-react";
import castle from "@/assets/castle-fog.jpg";
import { Logo } from "./Logo";
import { Ash } from "./Ash";
import { Reveal, Ornament } from "./Reveal";
import { useSiteSettings } from "@/lib/use-site-settings";

export function RecruitStatus() {
  const { settings, loaded } = useSiteSettings();
  if (!loaded) return null;
  return (
    <p className={`inline-block border px-4 py-1.5 font-display text-[11px] font-bold tracking-[0.3em] ${settings.recruitment_open ? "border-silver text-silver" : "border-steel text-steel"}`}>
      {settings.recruitment_open ? "RECRUTAMENTO ABERTO" : "RECRUTAMENTO TEMPORARIAMENTE FECHADO"}
    </p>
  );
}

export function Hero() {
  const { settings } = useSiteSettings();
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 pt-16">
      <img src={castle} alt="" width={1920} height={1088} className="absolute inset-0 size-full object-cover opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-abyss/70 via-abyss/30 to-abyss" />
      <div className="smoke absolute -left-1/4 bottom-0 h-1/2 w-[150%]" />
      <Ash />
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, delay: 0.3 }}>
          <Logo className="mb-4 h-44 sm:h-60 md:h-72" />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.9 }}
          className="font-display text-3xl font-black tracking-[0.3em] text-primary sm:text-5xl">
          RDL INFERNAIS
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.9 }}
          className="mt-3 font-display text-xs tracking-[0.35em] text-steel sm:text-sm">
          PRISTON TALE — ZEPHIRA WORLD
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.9 }} className="mt-8 flex flex-col items-center">
          <Ornament />
          <p className="mt-6 font-display text-base font-bold tracking-[0.4em] text-silver sm:text-lg">{settings.home_motto}</p>
          <p className="mt-5 max-w-xl text-base italic text-foreground/80 sm:text-lg">
            "{settings.intro_text}"
          </p>
          <div className="mt-8"><RecruitStatus /></div>
          <Link to="/recrutamento" className="btn-metal mt-6 px-8 py-4 text-xs sm:text-sm">Solicitar Recrutamento</Link>
        </motion.div>
      </div>
      <ChevronDown className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-steel" aria-hidden />
    </section>
  );
}

const pillars = [
  { icon: Users, title: "União", text: "Crescemos e evoluímos juntos." },
  { icon: Shield, title: "Lealdade", text: "Respeito e compromisso com nossos integrantes." },
  { icon: Swords, title: "Guerra", text: "Dedicação e participação nas atividades do jogo." },
];

export function About() {
  const { settings } = useSiteSettings();
  return (
    <section className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <p className="font-display text-xs tracking-[0.4em] text-steel">O CLÃ</p>
          <h2 className="mt-4 font-gothic text-4xl text-metal sm:text-6xl">Mais que um clã. Uma legião.</h2>
          <div className="mt-6"><Ornament /></div>
          <p className="mx-auto mt-6 max-w-2xl text-foreground/80">
            {settings.about_text}
          </p>
        </Reveal>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.15}>
              <div className="group stone-texture metal-border relative h-full p-8 text-center transition-transform duration-500 hover:-translate-y-1">
                <span aria-hidden className="absolute left-2 top-2 size-3 border-l border-t border-steel" />
                <span aria-hidden className="absolute right-2 top-2 size-3 border-r border-t border-steel" />
                <span aria-hidden className="absolute bottom-2 left-2 size-3 border-b border-l border-steel" />
                <span aria-hidden className="absolute bottom-2 right-2 size-3 border-b border-r border-steel" />
                <div className="mx-auto flex size-16 rotate-45 items-center justify-center border border-steel bg-abyss transition-colors group-hover:border-silver">
                  <p.icon className="-rotate-45 text-silver" />
                </div>
                <h3 className="mt-8 font-display text-xl font-bold tracking-[0.3em] text-primary">{p.title.toUpperCase()}</h3>
                <p className="mt-3 text-foreground/75">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Recruit() {
  const { settings } = useSiteSettings();
  return (
    <section className="relative overflow-hidden border-y border-border px-4 py-24 sm:py-32">
      <img src={castle} alt="" loading="lazy" width={1920} height={1088} className="absolute inset-0 size-full object-cover opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-abyss via-abyss/60 to-abyss" />
      <div className="smoke absolute -right-1/4 top-1/4 h-1/2 w-[120%]" />
      <Reveal className="relative mx-auto max-w-3xl text-center">
        <Logo className="mx-auto h-20 opacity-90" />
        <h2 className="mt-6 font-gothic text-4xl text-metal sm:text-6xl">Sua jornada começa aqui.</h2>
        <div className="mt-6"><Ornament /></div>
        <p className="mt-6 text-lg text-foreground/80">
          "{settings.recruit_text}"
        </p>
        <div className="mt-8"><RecruitStatus /></div>
        <Link to="/recrutamento" className="btn-metal mt-6 inline-block px-8 py-4 text-xs sm:text-sm">Inscrever meu Personagem</Link>
      </Reveal>
    </section>
  );
}

export function Rules() {
  const { settings } = useSiteSettings();
  if (!settings.clan_rules.length) return null;
  return (
    <section className="px-4 pb-24">
      <Reveal className="stone-texture metal-border mx-auto max-w-3xl p-8">
        <h2 className="text-center font-display text-xl font-bold tracking-[0.3em] text-primary">REGRAS DO CLÃ</h2>
        <div className="mt-4"><Ornament /></div>
        <ol className="mt-6 space-y-3">
          {settings.clan_rules.map((r, i) => (
            <li key={i} className="flex gap-3 text-foreground/80"><span className="font-display font-bold text-silver">{i + 1}.</span><span>{r}</span></li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}
