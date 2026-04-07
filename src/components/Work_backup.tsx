import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowRight } from "lucide-react";

const projects = [
  {
    id: 1,
    tag: "FRONTEND & MOTION UI",
    tagColor: "bg-indigo-50 text-indigo-600 border-indigo-100",
    title: "Aman.OS (Interactive Portfolio)",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    description: "Engineered a high-performance personal digital identity utilizing React and Framer Motion. Focused on complex DOM manipulation, smooth scroll physics, and minimalist Apple-tier motion UI design."
  },
  {
    id: 2,
    tag: "FULL-STACK (WIP)",
    tagColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
    title: "Local Business Booking Interface",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    description: "Currently developing a friction-free appointment scheduling interface. Designing a lightweight, high-converting automated platform to optimize client acquisition and routing for service-based businesses."
  },
  {
    id: 3,
    tag: "CORE CSE LOGIC",
    tagColor: "bg-amber-50 text-amber-600 border-amber-100",
    title: "Algorithmic Problem Solving",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=800",
    description: "Building a robust backend core utilizing Python and C. Mastering data structures, complex control flow logic, and algorithmic efficiency to lay the groundwork for future machine learning and AI integrations."
  }
];

export default function Work() {
  const [activeProject, setActiveProject] = useState<typeof projects[0] | null>(null);

  return (
    <section id="work" className="py-32 bg-[#F4F3EE] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 0.5, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-[0.3em] mb-4 text-slate-900"
          >
            — Selected Builds
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="font-display text-7xl md:text-9xl text-slate-900 uppercase tracking-tighter leading-none mb-6"
          >
            Featured<br />Builds
          </motion.h2>
          <p className="text-slate-500 text-lg md:text-xl max-w-xl font-medium tracking-wide">
            Current engineering builds, interface experiments, and core logic foundations.
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              onClick={() => setActiveProject(project)}
              className="group relative cursor-pointer bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <motion.img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Tag Label */}
              <div className="absolute top-6 left-6">
                <div className={`px-3 py-1 border rounded-full backdrop-blur-md ${project.tagColor} border-white/20 shadow-sm`}>
                  <span className="text-[9px] font-black tracking-widest uppercase">{project.tag}</span>
                </div>
              </div>

              {/* Bottom Title & Interaction Hint */}
              <div className="p-8 pb-10">
                <h3 className="text-2xl font-bold text-slate-900 leading-tight mb-2">
                  {project.title}
                </h3>
              </div>

              {/* Hover Pill Button */}
              <div className="absolute inset-0 flex items-end justify-center pb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="px-6 py-2.5 bg-white/95 backdrop-blur-md text-slate-900 font-bold text-sm rounded-full shadow-2xl flex items-center gap-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  View Details <ArrowRight size={14} />
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
              className="absolute inset-0 bg-white/40 backdrop-blur-2xl"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-white/70 border border-white/40 rounded-[2.5rem] overflow-hidden shadow-[0_32px_128px_-16px_rgba(0,0,0,0.1)] backdrop-blur-3xl flex flex-col md:flex-row h-full max-h-[85vh]"
            >
              {/* Left Side: Image */}
              <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
                <motion.img 
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1.05 }}
                  src={activeProject.image} 
                  alt={activeProject.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Right Side: Content */}
              <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center relative bg-white/30">
                <button 
                  onClick={() => setActiveProject(null)}
                  className="absolute top-8 right-8 p-3 bg-white/80 text-slate-400 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-all duration-300 shadow-sm"
                >
                  <X size={20} />
                </button>

                <div className="space-y-8">
                  <div className={`inline-block px-4 py-1 border rounded-full ${activeProject.tagColor}`}>
                    <span className="text-[10px] font-black tracking-widest uppercase">
                      {activeProject.tag}
                    </span>
                  </div>

                  <h3 className="text-5xl font-display text-slate-900 uppercase leading-none tracking-tighter">
                    {activeProject.title}
                  </h3>

                  <p className="text-slate-600 text-lg md:text-xl leading-relaxed font-medium">
                    {activeProject.description}
                  </p>

                  <div className="pt-8 border-t border-slate-200 flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-slate-900 animate-pulse" />
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
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