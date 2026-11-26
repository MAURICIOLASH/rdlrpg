import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Ornament() {
  return (
    <div aria-hidden className="flex items-center justify-center gap-3 text-steel">
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-steel" />
      <span className="rotate-45 size-2 border border-silver" />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-steel" />
    </div>
  );
}
