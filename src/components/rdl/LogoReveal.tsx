import { motion, useReducedMotion } from "framer-motion";
import { Logo } from "./Logo";
import { Embers } from "./Embers";

/**
 * Original logo with a staged entrance: the letters appear first, then the horns
 * rise into view from bottom to top. Fire sparks fall onto the horns.
 */
export function LogoReveal({ className = "", delay = 0, embers = 18 }: { className?: string; delay?: number; embers?: number }) {
  const reduce = useReducedMotion();
  const letters = { initial: { opacity: 0, filter: "blur(10px)" }, animate: { opacity: 1, filter: "blur(0px)" } };
  return (
    <div className="relative inline-block">
      <div aria-hidden className="fire-glow absolute -inset-x-10 -bottom-6 top-1/3 blur-2xl" />
      {/* Letters: the lower part of the image */}
      <motion.div {...(reduce ? {} : letters)} transition={{ duration: 1, delay }} style={{ clipPath: "inset(42% 0 0 0)" }} className="absolute inset-0">
        <Logo className={className} />
      </motion.div>
      {/* Full image (horns) revealed upward, gradually */}
      <motion.div
        initial={reduce ? false : { clipPath: "inset(42% 0 0 0)", opacity: 0 }}
        animate={{ clipPath: "inset(0% 0 0 0)", opacity: 1 }}
        transition={{ duration: 2.4, delay: delay + 0.8, ease: [0.3, 0.6, 0.2, 1] }}
        className="relative"
      >
        <Logo className={className} />
      </motion.div>
      {embers > 0 && !reduce && <Embers count={embers} className="-top-10" />}
    </div>
  );
}
