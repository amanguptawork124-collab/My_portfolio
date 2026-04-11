import { Suspense, useRef, useState, useEffect, memo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, Html, Center, Float } from '@react-three/drei';
import * as THREE from 'three';

const RobotModel = memo(function RobotModel({ isChatOpen, toggleChat }: { isChatOpen: boolean; toggleChat: () => void }) {
  const { scene } = useGLTF('/robot.glb');
  const isInProtocolsRef = useRef(false);
  
  // Listen for protocol visibility directly via ref (no re-renders)
  useEffect(() => {
    const handler = (e: Event) => {
      isInProtocolsRef.current = (e as CustomEvent).detail.isVisible;
    };
    window.addEventListener('protocols-visibility', handler);
    return () => window.removeEventListener('protocols-visibility', handler);
  }, []);
  
  const groupRef = useRef<THREE.Group>(null);
  const dragRef = useRef<THREE.Group>(null);
  
  // High-performance refs for zero-lag state
  const isDragging = useRef(false);
  const lastInteraction = useRef(Date.now());
  const scrollYRef = useRef(0);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Requirement: Robot Makes Eye Contact (Look Straight)
  const isChatOpenRef = useRef(false);
  
  // Sync the ref with the UI state for zero-lag 3D access
  useEffect(() => {
    isChatOpenRef.current = isChatOpen;
  }, [isChatOpen]);
  
  // Requirement: Fixed Physical Position [3.8, -1.3, 0]
  const baseHomeX = 3.8;
  const baseHomeY = -1.3;
  const homePosition = new THREE.Vector3(baseHomeX, baseHomeY, 0);
  const targetPosition = useRef(new THREE.Vector3(baseHomeX, baseHomeY, 0));
  
  const { viewport } = useThree();

  // Requirement: Passive window scroll listener with Auto-Correction Detection
  useEffect(() => {
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
      isScrolling.current = true;
      
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        isScrolling.current = false;
      }, 150); // 150ms timeout to detect "stopped" state
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  // Initialize position on mount
  useEffect(() => {
    if (dragRef.current) {
      dragRef.current.position.copy(homePosition);
    }
  }, []);

  useFrame((state) => {
    const now = Date.now();

    // 1. Physical Position Logic (LOCKED TO CORNER + DRAG)
    if (isDragging.current) {
      targetPosition.current.x = (state.pointer.x * viewport.width) / 2;
      targetPosition.current.y = (state.pointer.y * viewport.height) / 2;
    } else if (now - lastInteraction.current > 5000) {
      targetPosition.current.lerp(homePosition, 0.02);
    }

    // Apply position lerp
    if (dragRef.current) {
      const factor = isDragging.current ? 0.1 : 0.02;
      dragRef.current.position.lerp(targetPosition.current, factor);
    }

    // 2. Advanced Ninja Flip or Eye Contact Logic
    if (groupRef.current) {
      let targetRotX = 0;
      let targetRotY = 0;

      if (isChatOpenRef.current) {
        // Requirement: Eye Contact - Smoothly lerp to 0 (looking straight)
        targetRotX = 0;
        targetRotY = 0;
      } else if (isInProtocolsRef.current) {
        // Protocol Scanning Mode: robot points attention toward cards (left side)
        targetRotX = -0.15;
        targetRotY = -0.4;
      } else {
        // Running the exact existing pointer-tracking and scroll-flip logic
        const pointerTiltX = (-state.pointer.y * Math.PI) / 6;
        targetRotY = (state.pointer.x * Math.PI) / 2.5;

        // Current flip value based on continuous scroll
        const scrollFlip = -(scrollYRef.current * 0.003); 

        if (isScrolling.current) {
          targetRotX = pointerTiltX + scrollFlip;
        } else {
          const nearest360 = Math.round(scrollFlip / (Math.PI * 2)) * (Math.PI * 2);
          targetRotX = nearest360 + pointerTiltX;
        }
      }

      // Smoothly rotate to the target (Eye contact or Ninja flip)
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x, 
        targetRotX, 
        0.05
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y, 
        targetRotY, 
        0.05
      );
    }
  });

  return (
    <group 
      ref={dragRef}
      onClick={(e) => {
        e.stopPropagation();
        toggleChat();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'auto';
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        isDragging.current = true;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
        isDragging.current = false;
        lastInteraction.current = Date.now();
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (isDragging.current) {
          e.stopPropagation();
          lastInteraction.current = Date.now();
        }
      }}
    >
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={1}>
        <group ref={groupRef}>
          <Center>
            <primitive object={scene} scale={0.7} />
          </Center>
        </group>
      </Float>
    </group>
  );
});

/* ─── Lights component that reads protocol state via ref ─── */
const SceneLights = memo(function SceneLights() {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const dirRef = useRef<THREE.DirectionalLight>(null);
  const pointRef = useRef<THREE.PointLight>(null);
  const isInProtocolsRef = useRef(false);

  const cyanColor = new THREE.Color('#22d3ee');
  const whiteColor = new THREE.Color('#ffffff');
  const cyanDir = new THREE.Color('#06b6d4');
  const greenPoint = new THREE.Color('#10b981');

  useEffect(() => {
    const handler = (e: Event) => {
      isInProtocolsRef.current = (e as CustomEvent).detail.isVisible;
    };
    window.addEventListener('protocols-visibility', handler);
    return () => window.removeEventListener('protocols-visibility', handler);
  }, []);

  useFrame(() => {
    const inProto = isInProtocolsRef.current;
    if (ambientRef.current) {
      ambientRef.current.color.lerp(inProto ? cyanColor : whiteColor, 0.03);
      const targetInt = inProto ? 3.5 : 2.5;
      ambientRef.current.intensity += (targetInt - ambientRef.current.intensity) * 0.03;
    }
    if (dirRef.current) {
      dirRef.current.color.lerp(inProto ? cyanDir : whiteColor, 0.03);
    }
    if (pointRef.current) {
      const targetInt = inProto ? 4 : 0;
      pointRef.current.intensity += (targetInt - pointRef.current.intensity) * 0.05;
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={2.5} />
      <directionalLight ref={dirRef} position={[5, 5, 5]} intensity={3.5} />
      <pointLight ref={pointRef} position={[-3, 0, 3]} intensity={0} color={greenPoint} distance={8} />
    </>
  );
});

type Message = {
  id: number;
  sender: 'user' | 'ai';
  text: string;
};

export default function ModelTracker() {
  const [eventSource, setEventSource] = useState<HTMLElement | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'ai', text: "> System online.\n> Hello! I'm the Nexus Assistant. How can I help you investigate this portfolio today?" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEventSource(document.body);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const newUserMsg: Message = { id: Date.now(), sender: 'user', text: inputValue };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");
    setIsTyping(true);

    const responses = [
      "Bro, Aman is literally cooking code right now. Hold up.",
      "I'm just a floating 3D head, I don't get paid for this.",
      "Sounds like a skill issue tbh. But I'll let Aman know.",
      "Bet. Aman is debugging his life, he'll get back to you.",
      "Error 404: Motivation to reply not found. (Jk, Aman will see this)."
    ];

    setTimeout(() => {
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const newAiMsg: Message = { 
        id: Date.now(), 
        sender: 'ai', 
        text: randomResponse 
      };
      setMessages(prev => [...prev, newAiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[100]">
      <Canvas 
        className="pointer-events-auto"
        camera={{ position: [0, 0, 5], fov: 50 }}
        eventSource={eventSource || undefined}
      >
        <Suspense fallback={null}>
          <SceneLights />
          <Environment preset="city" />
          <RobotModel isChatOpen={isChatOpen} toggleChat={() => setIsChatOpen((prev) => !prev)} />
        </Suspense>
      </Canvas>

      {/* Premium Cyberpunk Chatbot UI */}
      {isChatOpen && (
        <div className="absolute bottom-24 right-4 md:right-8 w-[340px] bg-black/60 backdrop-blur-md border border-cyan-500/30 rounded-2xl shadow-[0_0_20px_rgba(0,255,255,0.15)] overflow-hidden pointer-events-auto flex flex-col z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="flex justify-between items-center px-5 py-4 border-b border-cyan-500/30 bg-cyan-950/40">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              <span className="text-cyan-400 font-mono text-xs font-bold tracking-[0.2em] uppercase">[ VIBE_CHECK.exe ]</span>
            </div>
            <button 
              onClick={() => setIsChatOpen(false)}
              className="text-cyan-500/60 hover:text-cyan-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          
          {/* Chat Body */}
          <div className="p-5 h-80 overflow-y-auto flex flex-col gap-4 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0 border border-cyan-500/30 mr-3 mt-1">
                    <span className="text-cyan-400 text-[10px] font-bold">AI</span>
                  </div>
                )}
                <div 
                  className={`p-3 rounded-2xl max-w-[80%] text-sm leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-br from-cyan-600 to-cyan-500 text-white rounded-br-sm shadow-[0_0_10px_rgba(6,182,212,0.3)]' 
                      : 'bg-[#1a1a1a] border border-cyan-500/20 text-cyan-50 rounded-tl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0 border border-cyan-500/30 mr-3 mt-1">
                  <span className="text-cyan-400 text-[10px] font-bold">AI</span>
                </div>
                <div className="bg-[#1a1a1a] border border-cyan-500/20 p-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-cyan-500/30 bg-black/60">
            <div className="relative">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Enter command..." 
                className="w-full bg-[#0a0a0a] border border-cyan-500/30 rounded-xl pl-4 pr-12 py-3 text-sm text-cyan-50 placeholder-cyan-500/40 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all font-mono" 
              />
              <button 
                onClick={handleSend}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-cyan-500 hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

useGLTF.preload('/robot.glb');
