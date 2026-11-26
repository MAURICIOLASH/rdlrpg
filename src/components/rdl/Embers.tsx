import { useEffect, useState } from "react";

type E = { left: number; size: number; dur: number; delay: number; dx: number; fall: number; o: number };

/** Small fire sparks falling from above onto whatever sits below (the logo horns). */
export function Embers({ count = 18, className = "" }: { count?: number; className?: string }) {
  const [parts, setParts] = useState<E[]>([]);
  useEffect(() => {
    setParts(Array.from({ length: count }, () => ({
      left: 10 + Math.random() * 80,
      size: 1.5 + Math.random() * 2.5,
      dur: 2.5 + Math.random() * 3,
      delay: -Math.random() * 5,
      dx: (Math.random() - 0.5) * 40,
      fall: 90 + Math.random() * 120,
      o: 0.5 + Math.random() * 0.5,
    })));
  }, [count]);
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-x-0 top-0 h-1/2 ${className}`}>
      {parts.map((p, i) => (
        <span key={i} className="ember" style={{
          left: `${p.left}%`, width: p.size, height: p.size,
          animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s`,
          ["--dx" as string]: `${p.dx}px`, ["--fall" as string]: `${p.fall}px`, ["--o" as string]: p.o,
        }} />
      ))}
    </div>
  );
}
