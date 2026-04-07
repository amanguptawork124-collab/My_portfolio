import { useEffect, useState } from "react";
import { motion } from "motion/react";

export default function Particles() {
  const [particles, setParticles] = useState<{ id: number; left: number; size: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    // Generate particle data client-side only to avoid hydration mismatch
    const generated = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // random % from left
      size: Math.random() * 3 + 1, // 1px to 4px
      duration: Math.random() * 15 + 10, // 10s to 25s
      delay: Math.random() * 5, // 0 to 5s stagger
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="fixed inset-0 z-[-10] pointer-events-none mix-blend-difference">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-slate-300 opacity-60"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
          }}
          initial={{ y: "110vh" }}
          animate={{ y: "-10vh" }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
