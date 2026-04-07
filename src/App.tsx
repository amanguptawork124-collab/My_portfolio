import React from 'react';
import ModelTracker from './components/ModelTracker';
import Hero from './components/Hero';
import OperatingDomains from './components/OperatingDomains';
import Work from './components/Work';
import Contact from './components/Contact';

function App() {
  return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-x-hidden">
      
      {/* 3D Background sabse peeche */}
      <ModelTracker />

      {/* Main Content Layer (Tere saare sections yahan aayenge) */}
      <main className="relative z-10 w-full bg-transparent pointer-events-none">
        
        {/* pointer-events-auto zaroori hai taaki tere buttons click ho sakein */}
        <div className="pointer-events-auto">
          <Hero />
          <OperatingDomains />
          <Work />
          <Contact />
        </div>
        
      </main>
    </div>
  );
}

export default App;