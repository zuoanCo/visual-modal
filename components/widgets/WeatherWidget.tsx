import React from 'react';
import { Sun, CloudRain, Cloud, Wind } from 'lucide-react';

export const WeatherWidget: React.FC = () => {
  const days = [
    { day: 'Today', icon: Sun, temp: '24°C', type: 'Sunny', color: 'text-yellow-400' },
    { day: 'Tomorrow', icon: Cloud, temp: '22°C', type: 'Cloudy', color: 'text-slate-400' },
    { day: 'Wed', icon: CloudRain, temp: '19°C', type: 'Rain', color: 'text-blue-400' },
  ];

  return (
    <div className="flex items-center justify-around h-full">
      {days.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors">
          <span className="text-xs text-slate-400 font-sans">{d.day}</span>
          <d.icon className={`w-8 h-8 ${d.color}`} />
          <span className="text-lg font-mono font-bold text-slate-200">{d.temp}</span>
          <span className="text-[10px] uppercase text-slate-500 tracking-wider">{d.type}</span>
        </div>
      ))}
      <div className="h-full w-[1px] bg-slate-800 mx-2"></div>
      <div className="flex flex-col gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Wind size={14} /> <span>4.2 m/s</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold">H</span> <span>45%</span>
        </div>
      </div>
    </div>
  );
};