import React from 'react';

interface GaugeWidgetProps {
  value?: number;
}

export const GaugeWidget: React.FC<GaugeWidgetProps> = ({ value = 94.5 }) => {
  // SVG arc logic
  // Circumference of half circle or full circle logic adjusted for the specific SVG path
  // Path length for 80 radius ~ 251.2 (pi * 80)
  const maxVal = 100;
  const radius = 80;
  const arcLength = Math.PI * radius; // Semi-circle length
  const dashOffset = arcLength * (1 - (value / maxVal));

  return (
    <div className="h-full w-full flex flex-col items-center justify-center relative">
      <div className="relative w-full h-24 flex items-end justify-center overflow-hidden">
         <svg viewBox="0 0 200 100" className="w-48 h-24 overflow-visible">
             {/* Background Track */}
             <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
             
             {/* Active Value */}
             <path 
                d="M 20 100 A 80 80 0 0 1 180 100" 
                fill="none" 
                stroke="url(#gradGauge)" 
                strokeWidth="12" 
                strokeLinecap="round"
                strokeDasharray={arcLength}
                strokeDashoffset={dashOffset}
                className="transition-[stroke-dashoffset] duration-1000 ease-out"
             />
             <defs>
                <linearGradient id="gradGauge" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="50%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#4ade80" />
                </linearGradient>
             </defs>
         </svg>
         
         {/* Center Text */}
         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center mb-[-5px]">
            <div className="text-3xl font-bold font-mono text-white drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                {value.toFixed(1)}<span className="text-lg text-cyan-400">%</span>
            </div>
         </div>
      </div>
      
      <div className="flex justify-between w-48 mt-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
        <span>Poor</span>
        <span>Optimal</span>
      </div>
    </div>
  );
};