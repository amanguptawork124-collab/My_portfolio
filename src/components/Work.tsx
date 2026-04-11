import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from "motion/react";
import { X, ArrowRight } from "lucide-react";

const projects = [
  {
    id: 1,
    tag: "FRONTEND & MOTION UI",
    tagColor: "bg-cyan-900/20 text-cyan-400 border-cyan-500/30",
    title: "Aman.OS (Interactive Portfolio)",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    description: "Engineered a high-performance personal digital identity utilizing React and Framer Motion. Focused on complex DOM manipulation, smooth scroll physics, and minimalist Apple-tier motion UI design."
  },
  {
    id: 2,
    tag: "FULL-STACK (WIP)",
    tagColor: "bg-purple-900/20 text-purple-400 border-purple-500/30",
    title: "Local Business Booking Interface",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    description: "Currently developing a friction-free appointment scheduling interface. Designing a lightweight, high-converting automated platform to optimize client acquisition and routing for service-based businesses."
  },
  {
    id: 3,
    tag: "CORE CSE LOGIC",
    tagColor: "bg-amber-900/20 text-amber-400 border-amber-500/30",
    title: "Algorithmic Problem Solving",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=800",
    description: "Building a robust backend core utilizing Python and C. Mastering data structures, complex control flow logic, and algorithmic efficiency to lay the groundwork for future machine learning and AI integrations."
  }
];

export default function Work() {
  const [activeProject, setActiveProject] = useState<typeof projects[0] | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rafRef = useRef<number>(0);

  // rAF-throttled mouse handler
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      const { left, top } = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - left);
      mouseY.set(e.clientY - top);
      rafRef.current = 0;
    });
  }, [mouseX, mouseY]);

  return (
    <section 
      id="work" 
      className="py-32 bg-[#000000] overflow-hidden relative"
      onMouseMove={handleMouseMove}
    >
      {/* Partition Glowing Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/80 to-transparent shadow-[0_0_30px_rgba(6,182,212,1)] z-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[1px] bg-cyan-300 blur-[2px] z-50" />

      {/* Interactive Mouse Sparkle Grid & Glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 opacity-40 transition-opacity duration-500"
        style={{
          backgroundImage: 'radial-gradient(rgba(6, 182, 212, 0.4) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          WebkitMaskImage: useMotionTemplate`radial-gradient(250px circle at ${mouseX}px ${mouseY}px, black, transparent)`
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-30 z-0 transition-opacity duration-500"
        style={{
          background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(6,182,212,0.15), transparent 80%)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="inline-flex max-w-max items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-6"
          >
            <span className="w-2 h-2 rounded-full border border-cyan-400" />
            Selected Builds
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-6xl md:text-8xl lg:text-9xl text-white uppercase tracking-tighter leading-[0.85] mb-6"
          >
            Featured<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Builds</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-xl font-light tracking-wide bg-black/40 p-4 rounded-xl border border-white/5 backdrop-blur-sm shadow-xl"
          >
            Current engineering builds, interface experiments, and core logic foundations.
          </motion.p>
        </div>

        {/* 3-Column Glassmorphism Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ delay: index * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setActiveProject(project)}
              className="group relative cursor-pointer bg-[#0a0a0a]/60 rounded-[2rem] border border-white/5 shadow-[0_15px_30px_rgba(0,0,0,0.8)] hover:border-cyan-500/30 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] hover:-translate-y-2 transition-all duration-500 overflow-hidden"
            >
              <div className="aspect-[4/5] overflow-hidden relative">
                {/* Dark Vignette Overlay over image */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-70" />
                
                <motion.img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-70 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Tag Label */}
              <div className="absolute top-6 left-6 z-20">
                <div className={`px-3 py-1 border rounded-full bg-black/60 ${project.tagColor} border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
                  <span className="text-[9px] font-black tracking-widest uppercase">{project.tag}</span>
                </div>
              </div>

              {/* Bottom Title & Interaction Hint */}
              <div className="absolute bottom-0 left-0 w-full p-8 pb-10 z-20">
                <h3 className="text-2xl font-bold text-white leading-tight mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                  {project.title}
                </h3>
              </div>

              {/* Hover Pill Button */}
              <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/30">
                <div className="px-6 py-3 bg-cyan-500 text-white font-bold text-sm rounded-full shadow-[0_0_30px_rgba(6,182,212,0.6)] flex items-center gap-2 scale-90 translate-y-4 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-500">
                  Execute Instance <ArrowRight size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Futuristic Glassmorphism Modal Overlay */}
      <AnimatePresence>
        {activeProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveProject(null)}
              className="absolute inset-0 bg-[#030303]/90"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-5xl bg-[#0a0a0a]/90 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(6,182,212,0.15)] flex flex-col md:flex-row h-full max-h-[85vh]"
            >
              {/* Left Side: Image */}
              <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a]/90 z-10 hidden md:block" />
                <motion.img 
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1.05 }}
                  transition={{ duration: 8, ease: "linear" }}
                  src={activeProject.image} 
                  alt={activeProject.title}
                  className="w-full h-full object-cover opacity-60"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Right Side: Content */}
              <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center relative bg-gradient-to-br from-[#0a0a0a] to-[#111] z-20">
                <button 
                  onClick={() => setActiveProject(null)}
                  className="absolute top-8 right-8 p-3 bg-white/5 border border-white/10 text-white/50 rounded-full hover:bg-white/10 hover:text-white hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all duration-300"
                >
                  <X size={20} />
                </button>

                <div className="space-y-8">
                  <div className={`inline-block px-4 py-1 border rounded-full ${activeProject.tagColor}`}>
                    <span className="text-[10px] font-black tracking-widest uppercase">
                      // {activeProject.tag}
                    </span>
                  </div>

                  <h3 className="text-4xl lg:text-5xl font-display text-white uppercase leading-[0.9] tracking-tighter">
                    {activeProject.title}
                  </h3>

                  <p className="text-slate-400 text-lg leading-relaxed font-light">
                    {activeProject.description}
                  </p>

                  <div className="pt-8 border-t border-white/10 flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                    <span className="text-cyan-400/80 text-[10px] font-mono uppercase tracking-widest">
                      Build In Progress // High-Speed Stack
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}