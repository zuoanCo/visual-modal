import React, { useState, useEffect } from 'react';
import { Battery, Zap, Waves, Flame } from 'lucide-react';

const StorageItem = ({ label, value, capacity, color, icon: Icon }: any) => (
  <div className="mb-3 last:mb-0 group">
    <div className="flex justify-between items-center mb-1">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
        <div className={`p-1.5 rounded-md bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`}>
          <Icon size={14} />
        </div>
        {label}
      </div>
      <span className={`text-sm font-mono font-bold text-${color}-400`}>{value}%</span>
    </div>
    
    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden relative border border-slate-700/50">
      <div 
        className={`h-full rounded-full bg-gradient-to-r from-${color}-600 to-${color}-400 relative transition-all duration-1000 ease-in-out`} 
        style={{ width: `${value}%` }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xIDF2MmgyVjF6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMikiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==')] opacity-30"></div>
        {/* Charging animation glare */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20 -translate-x-full animate-[shimmer_2s_infinite]"></div>
      </div>
    </div>
    
    <div className="flex justify-between mt-1 text-[10px] text-slate-500 font-mono uppercase tracking-wider">
      <span className="text-cyan-500/70">Charging...</span>
      <span>Cap: {capacity}</span>
    </div>
  </div>
);

export const StorageWidget: React.FC = () => {
  const [values, setValues] = useState({ battery: 85, hydro: 70, thermal: 92 });

  useEffect(() => {
    const interval = setInterval(() => {
      setValues(prev => ({
        battery: Math.min(100, Math.max(0, prev.battery + (Math.random() * 4 - 2))),
        hydro: Math.min(100, Math.max(0, prev.hydro + (Math.random() * 2 - 1))),
        thermal: Math.min(100, Math.max(0, prev.thermal + (Math.random() * 3 - 1.5)))
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col justify-around h-full py-1">
      <StorageItem label="Battery Array" value={Math.round(values.battery)} capacity="2.3 GW" color="green" icon={Battery} />
      <StorageItem label="Pumped Hydro" value={Math.round(values.hydro)} capacity="1000 T" color="cyan" icon={Waves} />
      <StorageItem label="Thermal Storage" value={Math.round(values.thermal)} capacity="2000 T" color="orange" icon={Flame} />
    </div>
  );
};