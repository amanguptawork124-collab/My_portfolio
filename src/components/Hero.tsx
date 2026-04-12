import { useRef, useState, memo, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useMotionValue, useTransform, useSpring } from "motion/react";
import { 
  ArrowRight, Globe, Zap, 
  Brain, Cpu, ShieldCheck, Terminal, X,
  GraduationCap, Code2
} from "lucide-react";
import backgroundVideo from "./assets/Smoother_looping_animation_202603271417.mp4";

// Badge Data
const badges = [
  { 
    id: 1, 
    title: "AI & NLP Integration", 
    color: "bg-brand-teal", 
    icon: <Brain size={24} />, 
    description: "Developing intelligent systems using modern LLMs and Natural Language Processing. Focus on context-aware automation and semantic search solutions.",
    position: "absolute top-4 left-4 md:top-12 md:left-12 origin-top-left scale-[0.7] md:scale-100 z-10",
    rotate: -5,
    delay: 0
  },
  { 
    id: 2, 
    title: "Rapid Web Prototyping", 
    color: "bg-brand-yellow", 
    icon: <Globe size={16} />, 
    description: "Turning ambitious ideas into functional web experiences with lightning speed. Leveraging modern stacks like React and Next.js for maximum impact.",
    position: "absolute top-1/2 -translate-y-1/2 left-0 md:left-8 origin-left scale-[0.7] md:scale-100 z-10",
    rotate: -8,
    delay: 0.5
  },
  { 
    id: 3, 
    title: "SaaS & Automation", 
    color: "bg-brand-orange", 
    icon: <Zap size={16} />, 
    description: "Architecting scalable Software-as-a-Service platforms. Automating repetitive workflows to drive efficiency for modern digital businesses.",
    position: "absolute bottom-4 left-4 md:bottom-12 md:left-12 origin-bottom-left scale-[0.7] md:scale-100 z-10",
    rotate: 5,
    delay: 1.0
  },
  { 
    id: 4, 
    title: "IoT & Hardware UI", 
    color: "bg-brand-pink", 
    icon: <Cpu size={20} />, 
    description: "Bridging the gap between hardware and software. Designing intuitive control interfaces for IoT devices and embedded systems.",
    position: "absolute top-4 right-4 md:top-12 md:right-12 origin-top-right scale-[0.7] md:scale-100 z-10",
    rotate: 10,
    delay: 1.5
  },
  { 
    id: 5, 
    title: "Security-First Design", 
    color: "bg-brand-green", 
    icon: <ShieldCheck size={20} />, 
    description: "Building with security as a core architectural pillar. From authentication flows to data encryption, ensuring every layer is hardened.",
    position: "absolute top-1/2 -translate-y-1/2 right-0 md:right-8 origin-right scale-[0.7] md:scale-100 z-10",
    rotate: 6,
    delay: 2.0
  },
  { 
    id: 6, 
    title: "CLI & Dev Tooling", 
    color: "bg-brand-teal", 
    icon: <Terminal size={18} />, 
    description: "Creating powerful command-line interfaces and developer tools. Streamlining workflows with custom scripts and automation pipelines.",
    position: "absolute bottom-4 right-4 md:bottom-12 md:right-12 origin-bottom-right scale-[0.7] md:scale-100 z-10",
    rotate: -4,
    delay: 2.5
  },
];

const colorMap: Record<string, { border: string; text: string }> = {
  "bg-brand-teal": { border: "border-brand-teal", text: "text-brand-teal" },
  "bg-brand-yellow": { border: "border-brand-yellow", text: "text-brand-yellow" },
  "bg-brand-orange": { border: "border-brand-orange", text: "text-brand-orange" },
  "bg-brand-pink": { border: "border-brand-pink", text: "text-brand-pink" },
  "bg-brand-green": { border: "border-brand-green", text: "text-brand-green" },
};

const Sticker = memo(function Sticker({ 
  children, color, className = "", rotate = 0, delay = 0, onClick 
}: { 
  children: React.ReactNode; color: string; className?: string; rotate?: number; delay?: number; onClick: () => void;
}) {
  const mappedColors = colorMap[color] || { border: "border-white/30", text: "text-white" };
  
  return (
    <motion.div
      layout="position"
      initial={{ opacity: 1, scale: 1, rotate }}
      animate={{ opacity: 1, scale: 1, rotate }}
      whileHover={{ scale: 1.15, rotate: 0, zIndex: 50 }}
      onClick={onClick}
      className={`${className} cursor-pointer perspective-1000`}
      style={{ transform: `translateZ(40px)`, willChange: "transform" }}
    >
      <motion.div
        layout="position"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className={`bg-black/60 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)] 
          border-2 ${mappedColors.border} rounded-2xl flex flex-col items-center justify-center text-center gap-1 p-4
          w-max min-w-[120px] max-w-[180px] h-auto transition-all glitch-hover
          whitespace-pre-wrap break-words`}
        >
          {/* Explicit Icon Container with dynamic text color */}
          <div className={`w-8 h-8 flex items-center justify-center mb-1 shrink-0 ${mappedColors.text} drop-shadow-[0_0_8px_currentColor]`}>
            {children}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeBadge, setActiveBadge] = useState<typeof badges[0] | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rafRef = useRef<number>(0);

  // Throttled mouse handler via requestAnimationFrame to ensure 60fps interaction
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (rafRef.current) return;
    
    rafRef.current = requestAnimationFrame(() => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      mouseX.set(x);
      mouseY.set(y);
      rafRef.current = 0;
    });
  }, [mouseX, mouseY]);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 100, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { stiffness: 100, damping: 20 });
  
  // Throttled and smoothed scroll values for "Makkhan" rotation
  const coreScale = useSpring(useTransform(scrollYProgress, [0, 0.5], [1, 1.2]), { stiffness: 50, damping: 20 });
  const coreRotate = useSpring(useTransform(scrollYProgress, [0, 1], [0, 45]), { stiffness: 50, damping: 20 });

  return (
    <section ref={sectionRef} onMouseMove={handleMouseMove} className="relative flex flex-col min-h-screen overflow-hidden bg-[#000000]">
      {/* Video Background - High-Quality 4K intent rendering without heavy CSS filters */}
      <div className="absolute inset-0 z-0 bg-black">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-80 video-render-optimize">
          <source src={backgroundVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Top Left Logo - Pure Minimalist Typography */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
        className="absolute top-6 left-6 md:top-10 md:left-10 z-50 flex items-center gap-3"
      >
        <span className="text-white font-sans font-black uppercase tracking-tighter text-lg leading-none border-r border-white/20 pr-3">
          AMAN GUPTA
        </span>
        <span className="text-cyan-500 font-mono text-[10px] uppercase tracking-[0.2em] leading-none opacity-90 hidden sm:block">
          Aspiring Software Engineer
        </span>
      </motion.div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col flex-grow">
        {/* Top Section - VERTICAL STACKED LAYOUT */}
        <div className="flex-grow flex items-center justify-center pt-24 pb-12">
          <div className="max-w-5xl w-full mx-auto px-6 md:px-12 flex flex-col items-center text-center gap-y-6">
            
            {/* Main Badge / Title */}
            <motion.div 
               initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
               className="mb-2"
            >
              <p className="text-sm md:text-base font-bold uppercase tracking-[0.3em] text-cyan-400">
                Code, Create, Automate, Innovate.
              </p>
            </motion.div>

            {/* Main Name */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
              className="font-display text-5xl sm:text-7xl md:text-9xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-slate-400 leading-none"
            >
              AMAN GUPTA
            </motion.h1>

            {/* Primary Title */}
            <motion.h2 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl md:text-2xl font-bold text-slate-200 uppercase tracking-wide"
            >
              Aspiring Software Developer <span className="text-cyan-500 mx-2">/</span> AI Product Engineer
            </motion.h2>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="text-slate-400 text-sm sm:text-base md:text-lg max-w-3xl font-medium tracking-wide leading-relaxed"
            >
              Exploring Next-Gen UI, Automation, and Digital Solutions. Intense focus on practical problem-solving and scalable digital architectures. Deep immersion in Product Design, C, Python, and AI (LLMs, RAG).
            </motion.p>

            {/* The "Details" Section - Dark Transparent Cards with Repeating Scroll Animation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl mt-4 relative z-20 pb-12">
               <motion.div 
                  initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ delay: 0.1, duration: 0.6 }}
                  className="bg-[#0a0a0a]/60 border border-white/10 p-5 rounded-2xl flex items-center gap-4 hover:border-cyan-500/30 hover:-translate-y-1 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group"
               >
                  <Globe className="text-cyan-400 shrink-0 group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all" size={22} />
                  <div className="text-left flex flex-col">
                     <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mb-1 group-hover:text-cyan-400/80 transition-colors">Expertise</span>
                     <span className="text-sm font-semibold text-slate-100">Python, AI, and Automation</span>
                  </div>
               </motion.div>
               
               <motion.div 
                  initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ delay: 0.2, duration: 0.6 }}
                  className="bg-[#0a0a0a]/60 border border-white/10 p-5 rounded-2xl flex items-center gap-4 hover:border-cyan-500/30 hover:-translate-y-1 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group"
               >
                  <GraduationCap className="text-cyan-400 shrink-0 group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all" size={22} />
                  <div className="text-left flex flex-col">
                     <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mb-1 group-hover:text-cyan-400/80 transition-colors">Academic</span>
                     <span className="text-sm font-semibold text-slate-100">CompSci Student (Class of 2029)</span>
                  </div>
               </motion.div>
               
               <motion.div 
                  initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ delay: 0.3, duration: 0.6 }}
                  className="bg-[#0a0a0a]/60 border border-white/10 p-5 rounded-2xl flex items-center gap-4 hover:border-cyan-500/30 hover:-translate-y-1 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group"
               >
                  <Terminal className="text-cyan-400 shrink-0 group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all" size={22} />
                  <div className="text-left flex flex-col">
                     <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mb-1 group-hover:text-cyan-400/80 transition-colors">CORE ENGINEERING</span>
                     <span className="text-sm font-semibold text-slate-100">Analysis, Neurology, and Computer Networks</span>
                  </div>
               </motion.div>
               
               <motion.div 
                  initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ delay: 0.4, duration: 0.6 }}
                  className="bg-[#0a0a0a]/60 border border-white/10 p-5 rounded-2xl flex items-center gap-4 hover:border-cyan-500/30 hover:-translate-y-1 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group"
               >
                  <Brain className="text-cyan-400 shrink-0 group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all" size={22} />
                  <div className="text-left flex flex-col">
                     <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mb-1 group-hover:text-cyan-400/80 transition-colors">Advanced AI</span>
                     <span className="text-sm font-semibold text-slate-100">Logic & Product Systems</span>
                  </div>
               </motion.div>
            </div>

            {/* CTA */}
            <motion.a 
              href="#contact"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}
              whileHover={{ y: -2, scale: 1.02 }}
              className="mt-6 flex items-center gap-3 px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm rounded-full hover:bg-cyan-400 transition-colors duration-300 shadow-[0_0_20px_rgba(0,255,255,0.2)] hover:shadow-[0_0_30px_rgba(0,255,255,0.4)]"
            >
              Get In Touch <ArrowRight size={18} />
            </motion.a>
            
          </div>
        </div>
      </div>

      {/* Visual Section - Preserved Parallax Core from original */}
      <div className="relative flex-grow rounded-t-[4rem] md:rounded-t-[8rem] overflow-hidden min-h-[400px] md:min-h-[600px] flex flex-col items-center mt-12 bg-black/60 border-t border-white/10">
        <div className="w-full pt-16 pb-8 flex justify-center z-10">
          <h3 className="text-[10px] md:text-xs font-mono text-cyan-500/60 uppercase tracking-[0.4em] text-center">
            [ CAPABILITY MATRIX // ENGINEERING NEXUS ]
          </h3>
        </div>
        
        {/* Tightly Clustered Mobile Container */}
        <div style={{ perspective: 1200 }} className="relative w-full max-w-[340px] md:max-w-6xl h-[400px] md:h-[500px] flex items-center justify-center mx-auto will-change-transform">
          
          <motion.div 
            className="relative w-full h-full flex items-center justify-center"
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          >
            {/* SVG Circuit Lines */}
            <div className="absolute inset-0 pointer-events-none z-[-10]" style={{ transform: "translateZ(-10px)", zIndex: -10 }}>
               <svg className="w-full h-full opacity-30 pointer-events-none will-change-transform" style={{ zIndex: -10 }}>
                  <line x1="50%" y1="50%" x2="10%" y2="20%" stroke="cyan" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse will-change-transform" />
                  <line x1="50%" y1="50%" x2="5%" y2="50%" stroke="magenta" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse will-change-transform" style={{ animationDelay: '0.2s' }} />
                  <line x1="50%" y1="50%" x2="10%" y2="80%" stroke="orange" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse will-change-transform" style={{ animationDelay: '0.4s' }} />
                  <line x1="50%" y1="50%" x2="90%" y2="20%" stroke="pink" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse will-change-transform" style={{ animationDelay: '0.6s' }} />
                  <line x1="50%" y1="50%" x2="95%" y2="50%" stroke="cyan" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse will-change-transform" style={{ animationDelay: '0.8s' }} />
                  <line x1="50%" y1="50%" x2="90%" y2="80%" stroke="magenta" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse will-change-transform" style={{ animationDelay: '1s' }} />
               </svg>
            </div>

            {/* Central Visual (Engineering Nexus Core) */}
            <motion.div 
              style={{ scale: coreScale, rotateZ: coreRotate, transform: "translateZ(50px) rotateZ(0deg)", willChange: "transform" }}
              className="backdrop-blur-xl bg-[#000000]/40 border border-white/20 rounded-3xl h-64 w-64 md:h-80 md:w-80 flex items-center justify-center shadow-[0_0_80px_rgba(0,255,255,0.15)] relative z-10 overflow-hidden"
            >
               {/* Complex Geometric Core Filaments High Speed Rotation */}
               <motion.div 
                  className="absolute w-[140%] h-[140%] border-[2px] border-cyan-400/20 rounded-full will-change-transform" 
                  style={{ transform: 'translateZ(0)' }}
                  animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
               />
               <motion.div 
                  className="absolute w-[120%] h-[120%] border-[1px] border-pink-400/30 rounded-full will-change-transform" 
                  style={{ transform: 'translateZ(0)' }}
                  animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
               />
               <motion.div 
                  className="absolute w-40 h-40 md:w-52 md:h-52 border border-orange-400/30 shadow-[inset_0_0_20px_rgba(255,165,0,0.2)] will-change-transform" 
                  style={{ transform: 'translateZ(0)' }}
                  animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
               />
               
               {/* Core inner glow */}
               <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-white/50 animate-pulse flex items-center justify-center bg-[#050505] shadow-[0_0_30px_rgba(0,255,255,0.4)]">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-cyan-400/40 blur-2xl rounded-full"></div>
                  <div className="absolute w-4 h-4 bg-white shadow-[0_0_30px_#fff] rounded-full"></div>
               </div>
            </motion.div>

            {/* Badge Stickers */}
            {badges.map((badge) => (
              <Sticker 
                key={badge.id}
                color={badge.color} 
                className={badge.position} 
                rotate={badge.rotate}
                delay={badge.delay}
                onClick={() => setActiveBadge(badge)}
              >
                <div className="mb-0.5">{badge.icon}</div>
                <span className={`font-mono text-xs md:text-sm font-bold uppercase tracking-wider ${colorMap[badge.color]?.text || 'text-white'} block text-center leading-tight whitespace-pre-wrap`}>
                  {badge.title}
                </span>
              </Sticker>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Glassmorphism Informational Modal Logic */}
      <AnimatePresence>
        {activeBadge && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveBadge(null)}
              className="absolute inset-0"
            />
            
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 30 }}
              className={`relative bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-[0_0_30px_rgba(0,255,255,0.2)] text-white`}
            >
              <button 
                onClick={() => setActiveBadge(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/20 transition-colors"
                aria-label="Close modal"
              >
                <X size={20} className="text-white" />
              </button>

              <div className={`w-14 h-14 ${activeBadge.color} rounded-xl flex items-center justify-center mb-6 shadow-md`}>
                <div className="text-black">{activeBadge.icon}</div>
              </div>

              <h3 className={`text-white text-xl md:text-2xl font-mono uppercase mb-3 leading-tight tracking-wider font-bold`}>
                {activeBadge.title}
              </h3>
              
              <p className="text-slate-200 text-sm md:text-base font-mono leading-relaxed mb-6 whitespace-pre-wrap">
                {activeBadge.description}
              </p>

              <button 
                onClick={() => setActiveBadge(null)}
                className={`w-full py-3 bg-white/10 text-white border border-white/30 rounded-xl font-mono font-bold uppercase tracking-widest text-xs hover:bg-white/30 transition-colors`}
              >
                Dismiss
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
