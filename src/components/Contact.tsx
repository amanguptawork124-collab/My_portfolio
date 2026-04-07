import { useRef, useEffect } from "react";
import { Mail, Github, Linkedin, Twitter } from "lucide-react";

const contactBg = new URL("./assets/Create_animated_video_202603271534.mp4", import.meta.url).href;

// Crossfade duration in seconds before video end
const CROSSFADE_START = 1.5;
const CROSSFADE_DURATION = 1200; // ms

export default function Contact() {
  const vidA = useRef<HTMLVideoElement>(null);
  const vidB = useRef<HTMLVideoElement>(null);
  const activeRef = useRef<"A" | "B">("A");
  const crossfadingRef = useRef(false);

  useEffect(() => {
    const a = vidA.current;
    const b = vidB.current;
    if (!a || !b) return;

    // Start B hidden at time 0
    b.style.opacity = "0";
    b.currentTime = 0;

    const handleTimeUpdate = () => {
      const active = activeRef.current === "A" ? a : b;
      const next   = activeRef.current === "A" ? b : a;

      if (!active.duration) return;
      const remaining = active.duration - active.currentTime;

      if (remaining <= CROSSFADE_START && !crossfadingRef.current) {
        crossfadingRef.current = true;

        // Reset & start next video
        next.currentTime = 0;
        next.play().catch(() => {});

        // Crossfade: active fades out, next fades in
        const start = performance.now();
        const fade = (now: number) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / CROSSFADE_DURATION, 1);
          active.style.opacity = String(1 - progress);
          next.style.opacity   = String(progress);
          if (progress < 1) {
            requestAnimationFrame(fade);
          } else {
            // Swap active
            activeRef.current = activeRef.current === "A" ? "B" : "A";
            active.pause();
            active.currentTime = 0;
            crossfadingRef.current = false;
          }
        };
        requestAnimationFrame(fade);
      }
    };

    a.addEventListener("timeupdate", handleTimeUpdate);
    b.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      a.removeEventListener("timeupdate", handleTimeUpdate);
      b.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  return (
    <section id="contact" className="relative py-24 px-8 md:px-16 text-white overflow-hidden">
      {/* Video A */}
      <video
        ref={vidA}
        autoPlay
        muted
        playsInline
        style={{ opacity: 1, transition: "none" }}
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
      >
        <source src={contactBg} type="video/mp4" />
      </video>

      {/* Video B (crossfade twin) */}
      <video
        ref={vidB}
        muted
        playsInline
        style={{ opacity: 0, transition: "none" }}
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
      >
        <source src={contactBg} type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/65 z-[1]" />

      {/* Content */}
      <div className="relative z-[2] max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Left — Let's Talk */}
          <div>
            <h2 className="font-display text-7xl md:text-9xl uppercase leading-none mb-12">
              Let's<br />Talk
            </h2>
            <p className="text-xl opacity-60 mb-12 max-w-md">
              Got a cool idea or need a high-speed website? I'm always excited to talk about new projects, AI, or just tech in general. Let's build something great together.
            </p>
            <div className="flex flex-col gap-6">
              <a
                href="mailto:amangupta.work124@gmail.com"
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                  <Mail size={20} />
                </div>
                <span className="text-sm md:text-lg font-medium break-all lowercase">amangupta.work124@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Right — Socials */}
          <div className="flex flex-col justify-end">
            <div className="flex flex-col gap-4 mb-12">
              <span className="text-xs font-bold uppercase tracking-widest opacity-40">Socials</span>
              <a
                href="https://www.linkedin.com/in/aman-gupta-615209286/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg hover:opacity-60 transition-opacity flex items-center gap-2"
              >
                <Linkedin size={18} /> LinkedIn
              </a>
              <a
                href="https://github.com/amanguptawork124-collab"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg hover:opacity-60 transition-opacity flex items-center gap-2"
              >
                <Github size={18} /> GitHub
              </a>
              <a
                href="https://x.com/AmanGupta_01467"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg hover:opacity-60 transition-opacity flex items-center gap-2"
              >
                <Twitter size={18} /> X
              </a>
            </div>

            <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between gap-8 opacity-40 text-sm">
              <p>© 2026 AMAN GUPTA. ALL RIGHTS RESERVED.</p>
              <p>BUILT WITH REACT &amp; TAILWIND</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
