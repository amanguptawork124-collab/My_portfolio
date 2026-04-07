import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus } from "lucide-react";

const domains = [
  {
    id: 1,
    title: "AI Orchestration & Strategy",
    eyebrow: "Conceptual Architecture",
    shortText: "LLMs, RAG & Agents",
    description: "Deep conceptual clarity regarding LLMs, RAG architectures, and agentic workflows. Focused on deploying real-world automation systems versus surface-level AI wrappers.",
  },
  {
    id: 2,
    title: "Systems Architecture & Logic",
    eyebrow: "Foundational Engineering",
    shortText: "Structural Pattern Recognition",
    description: "Approaching development with a system-builder mindset. Prioritizing pattern recognition, algorithmic intent, and structural integrity over blind coding.",
  },
  {
    id: 3,
    title: "Foundational Engineering",
    eyebrow: "Programming Fundamentals",
    shortText: "Python & C Core Logic",
    description: "Building robust software foundations utilizing Python and C, prioritizing control flow, data structure logic, and clean code principles.",
  },
  {
    id: 4,
    title: "Technical Translation",
    eyebrow: "Strategic Communication",
    shortText: "Engineering to Business",
    description: "The ability to simplify highly complex infrastructure concepts into actionable business strategies, effectively bridging the gap between engineering and stakeholders.",
  }
];

export default function OperatingDomains() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="py-24 px-6 md:px-12 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start mb-20 gap-8">
          <div className="space-y-4">
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 0.4, x: 0 }}
              viewport={{ once: true }}
              className="text-xs font-bold uppercase tracking-[0.2em] block text-slate-900"
            >
              — What I Do
            </motion.span>
            <h2 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl break-words tracking-tighter uppercase leading-[0.8] text-slate-900">
              Operating<br />Domains
            </h2>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {domains.map((domain) => (
            <div
              key={domain.id}
              onClick={() => toggleExpand(domain.id)}
              className="relative cursor-pointer group bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden"
            >
              <div className="p-8 relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-display text-slate-900 font-semibold text-2xl uppercase leading-tight mb-2 transition-opacity group-hover:opacity-80">
                      {domain.title}
                    </h3>
                    <p className="font-sans font-medium text-slate-400 text-sm tracking-wide capitalize">
                      {domain.shortText}
                    </p>
                  </div>
                  <div className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full border border-slate-200 font-bold uppercase tracking-widest shrink-0 ml-4">
                    {domain.eyebrow.split(' ')[0]}
                  </div>
                </div>

                {/* Accordion */}
                <AnimatePresence>
                  {expandedId === domain.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pt-6 mt-4 border-t border-slate-200">
                        <p className="text-slate-600 text-base leading-relaxed">
                          {domain.description}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Toggle Button */}
                <div className="absolute bottom-6 right-6 transition-all duration-300">
                  <motion.div
                    animate={{ rotate: expandedId === domain.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-center items-center bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full p-2 transition-colors duration-200"
                  >
                    {expandedId === domain.id ? (
                      <Minus size={20} />
                    ) : (
                      <Plus size={20} />
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}