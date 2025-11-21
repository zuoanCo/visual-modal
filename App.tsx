import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Card } from './components/Card';
import { RealTimeChart } from './components/charts/RealTimeChart';
import { EnergyPieChart } from './components/charts/EnergyPieChart';
import { PowerGridScene } from './components/three/PowerGridScene';
import { HistoryChart } from './components/charts/HistoryChart';
import { StorageWidget } from './components/widgets/StorageWidget';
import { GaugeWidget } from './components/widgets/GaugeWidget';
import { WeatherWidget } from './components/widgets/WeatherWidget';
import { Sun, Wind, Droplets } from 'lucide-react';

export default function App() {
  const [metrics, setMetrics] = useState({
    capacity: 2.5,
    generation: 1.8,
    carbon: 1200,
    efficiency: 94.5
  });

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        capacity: 2.5,
        generation: Number((1.8 + (Math.random() * 0.1 - 0.05)).toFixed(3)),
        carbon: Math.floor(1200 + Math.random() * 20 - 10),
        efficiency: Number((94.5 + (Math.random() * 2 - 1)).toFixed(1))
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Total Capacity', value: metrics.capacity.toFixed(1), unit: 'GW', color: 'text-yellow-400' },
    { label: 'Real-time Gen', value: metrics.generation.toFixed(3), unit: 'GW', color: 'text-cyan-400' },
    { label: 'Carbon Reduction', value: metrics.carbon.toLocaleString(), unit: 'Tons', color: 'text-green-400' },
    { label: 'Efficiency', value: metrics.efficiency.toFixed(1), unit: '%', color: 'text-blue-400' },
  ];

  return (
    <div className="h-screen w-screen bg-[#020617] text-white flex flex-col font-sans relative overflow-hidden">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-20" 
           style={{ 
             backgroundImage: 'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }} 
      />

      <Header />

      <main className="flex-1 grid grid-cols-12 gap-4 p-4 z-10 min-h-0">
        
        {/* Left Column */}
        <div className="col-span-3 flex flex-col gap-4 min-h-0">
          <Card title="Real-time Power Generation" className="flex-[2] flex flex-col gap-2">
             <div className="flex-1 min-h-0">
                <RealTimeChart type="solar" color="#facc15" title="Solar" icon={<Sun className="w-4 h-4 text-yellow-400" />} />
             </div>
             <div className="flex-1 min-h-0">
                <RealTimeChart type="wind" color="#4ade80" title="Wind" icon={<Wind className="w-4 h-4 text-green-400" />} />
             </div>
             <div className="flex-1 min-h-0">
                <RealTimeChart type="hydro" color="#38bdf8" title="Hydro" icon={<Droplets className="w-4 h-4 text-blue-400" />} />
             </div>
          </Card>
          <Card title="Energy Structure" className="flex-1 min-h-0">
            <EnergyPieChart />
          </Card>
        </div>

        {/* Center Column */}
        <div className="col-span-6 flex flex-col gap-4 min-h-0">
          {/* Top Stats */}
          <div className="flex justify-between bg-slate-900/50 p-4 rounded-xl border border-cyan-500/30 backdrop-blur-sm shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-slate-400 text-xs mb-1 font-mono uppercase tracking-wider opacity-80">{stat.label}</div>
                <div className={`text-3xl font-bold font-mono ${stat.color} drop-shadow-sm`}>
                  {stat.value} <span className="text-sm text-slate-300 font-normal">{stat.unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 3D Map Visualization */}
          <div className="flex-[3] relative rounded-xl border border-cyan-500/30 bg-slate-900/40 overflow-hidden relative group">
            <div className="absolute top-2 left-4 z-10 text-cyan-300 text-xs font-mono flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              LIVE GRID MONITORING // SYSTEM ACTIVE
            </div>
            
            <PowerGridScene />
            
            {/* Map Legend Overlay */}
            <div className="absolute bottom-4 right-4 bg-slate-900/80 p-3 rounded border border-slate-700 text-xs space-y-2 backdrop-blur z-10 font-mono">
               <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_#facc15]"></span> Solar Farm</div>
               <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80]"></span> Wind Farm</div>
               <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_#38bdf8]"></span> Hydro Station</div>
            </div>
          </div>

          {/* Bottom History Chart */}
          <Card title="Historical Operation Data" className="flex-1 min-h-0">
            <HistoryChart />
          </Card>
        </div>

        {/* Right Column */}
        <div className="col-span-3 flex flex-col gap-4 min-h-0">
          <Card title="Storage Status" className="flex-1 min-h-0">
            <StorageWidget />
          </Card>
          <Card title="Efficiency Analysis" className="flex-1 min-h-0">
            <GaugeWidget value={metrics.efficiency} />
          </Card>
          <Card title="Weather Forecast" className="flex-1 min-h-0">
            <WeatherWidget />
          </Card>
        </div>

      </main>
    </div>
  );
}