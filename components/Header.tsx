import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';

export const Header: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-[#050b14] border-b border-cyan-500/30 relative shadow-[0_0_20px_rgba(6,182,212,0.15)] shrink-0 z-50">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-[200px] h-[2px] bg-cyan-500"></div>
      <div className="absolute bottom-0 right-0 w-[200px] h-[2px] bg-cyan-500"></div>

      <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm">
        <span className="animate-pulse text-green-400">●</span> SYSTEM ONLINE
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 text-center">
        <h1 className="text-2xl md:text-3xl font-bold font-mono tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-400 shadow-cyan-500 drop-shadow-sm">
          NEW ENERGY VPP
        </h1>
        <div className="h-1 w-full bg-cyan-900 mt-1 relative overflow-hidden">
            <div className="absolute top-0 left-0 h-full w-1/3 bg-cyan-400 blur-[2px] animate-[loading_3s_ease-in-out_infinite]"></div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Server Time</div>
          <div className="text-lg font-mono text-cyan-300 leading-none">{time.toLocaleTimeString()}</div>
        </div>
        <div className="p-2 bg-cyan-500/10 rounded-full border border-cyan-500/20">
            <Activity className="text-cyan-400 animate-pulse w-5 h-5" />
        </div>
      </div>
    </header>
  );
};