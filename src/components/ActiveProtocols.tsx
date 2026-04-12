import { MouseEvent, useRef, useEffect, useCallback, memo } from "react";
import { motion, useMotionValue, useMotionTemplate, useSpring } from "motion/react";
import { ExternalLink, Camera, Brain } from "lucide-react";

const protocols = [
  {
    id: 1,
    title: "Air Draw with Camera",
    description:
      "Real-time virtual canvas using Computer Vision. Tracks hand gestures to draw on-screen without physical touch.",
    tags: ["Python", "OpenCV", "MediaPipe"],
    icon: <Camera size={28} />,
    source: "https://github.com/amanguptawork124-collab/Air-Canvas-CV.git",
  },
  {
    id: 2,
    title: "Emotion Detector (V1)",
    description:
      "Deep Learning model for facial expression recognition. Serving as the core logic for a future empathetic AI assistant.",
    tags: ["Python", "TensorFlow", "Computer Vision"],
    icon: <Brain size={28} />,
    source: "https://github.com/amanguptawork124-collab/facial-emotion-recognition-v1.git",
  },
];

/* ─── Lightweight Canvas Particle Grid (70% reduced, no O(n²) lines) ─── */
const ParticleGrid = memo(function ParticleGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = 0;
    let h = 0;

    // 70% fewer particles: max 18 instead of 60
    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];

    function resize() {
      w = canvas!.offsetWidth;
      h = canvas!.offsetHeight;
      canvas!.width = w;
      canvas!.height = h;
    }

    function init() {
      resize();
      particles.length = 0;
      const count = Math.min(18, Math.floor((w * h) / 50000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.4 + 0.1,
        });
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(6, 182, 212, ${p.opacity})`;
        ctx!.fill();
      }
      // No more O(n²) line-drawing — pure dots only
      animId = requestAnimationFrame(draw);
    }

    init();
    draw();
    window.addEventListener("resize", init);
    return () => {
      window.removeEventListener("resize", init);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-[1] pointer-events-none" />;
});

/* ─── 3D Tilt Card Wrapper (memoized, throttled) ─── */
const TiltCard = memo(function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(0, { stiffness: 150, damping: 25 });
  const rotateY = useSpring(0, { stiffness: 150, damping: 25 });
  const rafRef = useRef<number>(0);

  const handleMouse = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (rafRef.current) return; // throttle to 1 per frame
    rafRef.current = requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      rotateY.set(px * 10);
      rotateX.set(-py * 10);
      rafRef.current = 0;
    });
  }, [rotateX, rotateY]);

  const handleLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 800, translateZ: 0, willChange: "transform" }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

/* ─── Memoized Protocol Card ─── */
const ProtocolCard = memo(function ProtocolCard({ protocol, index }: { protocol: typeof protocols[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut",
      }}
      style={{ translateZ: 0, willChange: "transform, opacity" }}
    >
      <TiltCard className="group relative bg-white/[0.03] border border-white/[0.08] rounded-2xl backdrop-blur-md shadow-2xl hover:-translate-y-1 hover:border-cyan-500/30 transition-all duration-300 overflow-hidden">
        {/* STATUS: LIVE Badge */}
        <div className="absolute top-5 right-5 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 backdrop-blur-md shadow-xl">
          <span className="w-[6px] h-[6px] rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
          <span className="text-emerald-400 text-[9px] font-mono font-bold tracking-widest uppercase">
            STATUS: LIVE
          </span>
        </div>

        <div className="p-8 md:p-10 relative z-10">
          {/* Icon & Title Row */}
          <div className="flex items-start gap-4 mb-5">
            <div className="text-cyan-400/80 group-hover:text-cyan-400 transition-colors duration-300 mt-1 shrink-0">
              {protocol.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-mono tracking-wide text-gray-300 text-lg md:text-xl font-medium leading-tight">
                {protocol.title}
              </h3>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-400 text-sm leading-relaxed font-mono tracking-wide mb-8 pl-0 md:pl-[44px]">
            {protocol.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8 pl-0 md:pl-[44px]">
            {protocol.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-mono tracking-wide rounded-md bg-white/5 border border-white/5 text-gray-300 group-hover:border-white/10 transition-colors duration-300"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Source Link */}
          <div className="pl-0 md:pl-[52px]">
            <a
              href={protocol.source}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-widest hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={14} />
              View Source
            </a>
          </div>
        </div>

        {/* Hover Border Glow Accent */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/0 to-transparent group-hover:via-cyan-500/60 transition-all duration-700" />
      </TiltCard>
    </motion.div>
  );
});

/* ─── Main Component ─── */
export default function ActiveProtocols() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const sectionRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number>(0);

  // Throttled mouse handler via rAF
  const handleMouseMove = useCallback(({ currentTarget, clientX, clientY }: MouseEvent) => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      const { left, top } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
      rafRef.current = 0;
    });
  }, [mouseX, mouseY]);

  // Intersection Observer: dispatch custom event for robot sync
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        window.dispatchEvent(
          new CustomEvent("protocols-visibility", {
            detail: { isVisible: entry.isIntersecting },
          })
        );
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="protocols"
      className="py-32 bg-[#0a0a0a] overflow-hidden relative"
      onMouseMove={handleMouseMove}
    >
      {/* Matrix Background Effect */}
      <div className="absolute inset-0 z-0 bg-matrix-pattern opacity-10 pointer-events-none mix-blend-screen" />
      {/* Gradient Overlay for Readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a0a0a]/90 via-transparent to-[#0a0a0a]/90 pointer-events-none" />

      {/* Partition Glowing Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent z-50 opacity-60" />

      {/* Animated Particle Grid (lower z-index, absolute) */}
      <ParticleGrid />

      {/* Interactive Mouse Sparkle Grid & Glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[2] opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(rgba(6, 182, 212, 0.4) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          WebkitMaskImage: useMotionTemplate`radial-gradient(250px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-30 z-[2]"
        style={{
          background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(6,182,212,0.15), transparent 80%)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="inline-flex max-w-max items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            Live Builds
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            style={{ translateZ: 0, willChange: "transform, opacity" }}
            className="font-display text-5xl md:text-7xl lg:text-8xl text-white uppercase tracking-tighter leading-[0.9] mb-4"
          >
            ACTIVE<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">
              PROTOCOLS
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-300 font-mono text-sm leading-relaxed uppercase tracking-widest max-w-xl"
          >
            Current engineering sprints and real-time AI implementations.
          </motion.p>
        </div>

        {/* Two-Column Card Grid with 3D Tilt */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {protocols.map((protocol, index) => (
            <ProtocolCard key={protocol.id} protocol={protocol} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
