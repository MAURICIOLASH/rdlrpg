import { useEffect, useState } from "react";

type P = { left: number; size: number; dur: number; delay: number; dx: number; o: number };

export function Ash({ count = 40 }: { count?: number }) {
  const [parts, setParts] = useState<P[]>([]);
  useEffect(() => {
    setParts(
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        size: 1 + Math.random() * 3,
        dur: 12 + Math.random() * 18,
        delay: -Math.random() * 30,
        dx: (Math.random() - 0.5) * 160,
        o: 0.2 + Math.random() * 0.6,
      })),
    );
  }, [count]);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {parts.map((p, i) => (
        <span
          key={i}
          className="ash"
          style={{
            left: `${p.left}%`, width: p.size, height: p.size,
            animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s`,
            ["--dx" as string]: `${p.dx}px`, ["--o" as string]: p.o,
          }}
        />
      ))}
    </div>
  );
}
