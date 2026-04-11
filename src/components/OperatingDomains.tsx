import { useState, MouseEvent, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from "motion/react";
import { Plus, Minus, Cpu, Network, Code2, Workflow } from "lucide-react";

// Requirement: Colorful Tech Theme Gradients and SVG Patterns
const domains = [
  {
    id: 1,
    title: "AI Orchestration & Strategy",
    eyebrow: "Conceptual",
    shortText: "LLMs, RAG & Agents",
    description: "Deep conceptual clarity regarding LLMs, RAG architectures, and agentic workflows. Focused on deploying real-world automation systems versus surface-level AI wrappers.",
    icon: <Network className="text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" size={28} />,
    theme: "from-cyan-500/20 via-[#0a0a0a] to-[#050505]",
    glow: "shadow-cyan-500/20",
    pattern: (
      <svg className="absolute inset-0 w-full h-full opacity-[0.12]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-1" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyan-500" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-1)" />
      </svg>
    )
  },
  {
    id: 2,
    title: "Systems Architecture & Logic",
    eyebrow: "Foundational",
    shortText: "Structural Pattern Recognition",
    description: "Approaching development with a system-builder mindset. Prioritizing pattern recognition, algorithmic intent, and structural integrity over blind coding.",
    icon: <Cpu className="text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" size={28} />,
    theme: "from-purple-500/20 via-[#0a0a0a] to-[#050505]",
    glow: "shadow-purple-500/20",
    pattern: (
      <svg className="absolute inset-0 w-full h-full opacity-[0.1]" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 20 L20 0 M10 30 L30 10 M-10 10 L10 -10" stroke="currentColor" strokeWidth="1" fill="none" className="text-purple-500" />
        <circle cx="20" cy="20" r="1" fill="currentColor" className="text-purple-400" />
        <circle cx="10" cy="10" r="1" fill="currentColor" className="text-purple-400" />
      </svg>
    )
  },
  {
    id: 3,
    title: "Foundational Engineering",
    eyebrow: "Programming",
    shortText: "Python & C Core Logic",
    description: "Building robust software foundations utilizing Python and C, prioritizing control flow, data structure logic, and clean code principles.",
    icon: <Code2 className="text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" size={28} />,
    theme: "from-blue-500/20 via-[#0a0a0a] to-[#050505]",
    glow: "shadow-blue-500/20",
    pattern: (
      <svg className="absolute inset-0 w-full h-full opacity-[0.1]" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="none" />
        <path d="M10 0v100M30 0v100M50 0v100" stroke="currentColor" strokeWidth="0.5" className="text-blue-500" strokeDasharray="4 4" />
        <path d="M0 10h100M0 30h100M0 50h100" stroke="currentColor" strokeWidth="0.5" className="text-blue-500" strokeDasharray="4 4" />
      </svg>
    )
  },
  {
    id: 4,
    title: "Technical Translation",
    eyebrow: "Strategic",
    shortText: "Engineering to Business",
    description: "The ability to simplify highly complex infrastructure concepts into actionable business strategies, effectively bridging the gap between engineering and stakeholders.",
    icon: <Workflow className="text-pink-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" size={28} />,
    theme: "from-pink-500/20 via-[#0a0a0a] to-[#050505]",
    glow: "shadow-pink-500/20",
    pattern: (
      <svg className="absolute inset-0 w-full h-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="2" fill="currentColor" className="text-pink-500" />
        <circle cx="40" cy="40" r="2" fill="currentColor" className="text-pink-500" />
        <path d="M10 10 L40 40" stroke="currentColor" strokeWidth="0.5" className="text-pink-400" />
      </svg>
    )
  }
];

export default function OperatingDomains() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rafRef = useRef<number>(0);

  // rAF-throttled mouse handler for 60fps cap
  const handleMouseMove = useCallback(({ currentTarget, clientX, clientY }: MouseEvent) => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      const { left, top } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
      rafRef.current = 0;
    });
  }, [mouseX, mouseY]);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section 
      className="py-32 px-6 md:px-12 overflow-hidden bg-[#030303] relative"
      onMouseMove={handleMouseMove}
    >
      {/* Interactive Mouse Sparkle Grid & Glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 opacity-40 transition-opacity duration-500"
        style={{
          backgroundImage: 'radial-gradient(rgba(6, 182, 212, 0.4) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          WebkitMaskImage: useMotionTemplate`radial-gradient(250px circle at ${mouseX}px ${mouseY}px, black, transparent)`
        }}
      />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col mb-24 items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            What I Do
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl md:text-8xl tracking-tighter uppercase leading-[0.85] text-white"
          >
            Operating<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Domains</span>
          </motion.h2>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {domains.map((domain, index) => (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => toggleExpand(domain.id)}
              /* Requirement: Zero-Lag CSS Hover, Hardware Acceleration, and Colorful Theme */
              className={`relative cursor-pointer group bg-gradient-to-br ${domain.theme} border border-white/10 rounded-2xl 
                shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-500 flex flex-col overflow-hidden
                will-change-transform transform-gpu hover:scale-[1.02] hover:-translate-y-1 hover:border-white/30 
                hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)] hover:z-20`}
            >
              {/* Requirement: Tech-Related SVG Visuals (Zero Lag) */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                {domain.pattern}
              </div>

              {/* Edge Glow Effect via CSS */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-transparent to-white/5 pointer-events-none`} />

              <div className="p-8 relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-5">
                    <div className="mt-1 hidden sm:block transform group-hover:scale-110 transition-transform duration-300">
                      {domain.icon}
                    </div>
                    <div>
                      <h3 className="font-display text-white font-black text-2xl uppercase tracking-tight leading-tight mb-2 group-hover:text-white transition-colors duration-300">
                        {domain.title}
                      </h3>
                      <p className="font-mono text-cyan-400/90 text-[10px] tracking-widest uppercase">
                        // {domain.shortText}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white/5 text-white/50 text-[10px] px-3 py-1 rounded-full border border-white/10 font-mono uppercase tracking-widest shrink-0 ml-4 group-hover:border-white/20 group-hover:text-white/80 transition-colors duration-300 hidden sm:block">
                    {domain.eyebrow}
                  </div>
                </div>

                {/* Accordion */}
                <AnimatePresence>
                  {expandedId === domain.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pt-6 mt-4 border-t border-white/10">
                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-medium pr-12">
                          {domain.description}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Toggle Button */}
                <div className="absolute bottom-8 right-8 pointer-events-none">
                  <motion.div
                    animate={{ 
                      rotate: expandedId === domain.id ? 180 : 0,
                      backgroundColor: expandedId === domain.id ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.05)"
                    }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="flex justify-center items-center border border-white/10 text-white group-hover:border-white/40 group-hover:bg-white/10 rounded-full p-2 transition-all duration-300 shadow-xl"
                  >
                    {expandedId === domain.id ? (
                      <Minus size={18} />
                    ) : (
                      <Plus size={18} />
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}