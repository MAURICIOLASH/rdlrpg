import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { LogoReveal } from "./LogoReveal";
import { Ash } from "./Ash";

export function Intro() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(true);
  useEffect(() => {
    if (sessionStorage.getItem("rdl-intro")) { setShow(false); return; }
    const t = setTimeout(() => { setShow(false); sessionStorage.setItem("rdl-intro", "1"); }, reduce ? 600 : 4200);
    return () => clearTimeout(t);
  }, [reduce]);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-abyss"
          exit={{ opacity: 0 }} transition={{ duration: 0.9 }}
          onClick={() => setShow(false)}
        >
          <Ash count={30} />
          <div aria-hidden className="fire-glow absolute inset-x-0 bottom-0 h-1/2" />
          <LogoReveal className="h-40 sm:h-56" embers={16} />
          <motion.h1
            className="mt-6 font-display text-xl sm:text-3xl font-bold tracking-[0.4em] text-primary"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.8 }}
          >
            RDL INFERNAIS
          </motion.h1>
          <motion.p
            className="mt-3 font-display text-xs sm:text-sm tracking-[0.35em] text-steel"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: 0.8 }}
          >
            PRISTON TALE — ZEPHIRA WORLD
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
