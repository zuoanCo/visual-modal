import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RealTimeChartProps {
  type: 'solar' | 'wind' | 'hydro';
  color: string;
  title: string;
  icon: React.ReactNode;
}

// Initial data generation helper
const generateInitialData = (count: number) => {
  const data = [];
  const now = new Date().getTime();
  for (let i = count; i > 0; i--) {
    data.push({
      time: i,
      value: Math.floor(Math.random() * 40) + 30
    });
  }
  return data;
};

export const RealTimeChart: React.FC<RealTimeChartProps> = ({ type, color, title, icon }) => {
  const [data, setData] = useState(() => generateInitialData(20));

  useEffect(() => {
    const interval = setInterval(() => {
      setData(currentData => {
        const lastTime = currentData[currentData.length - 1].time;
        const nextTime = lastTime + 1;
        
        // Simulate value based on type
        let prevValue = currentData[currentData.length - 1].value;
        let change = (Math.random() - 0.5) * 10;
        let newValue = Math.max(10, Math.min(100, prevValue + change));

        // Solar is more consistent, Wind is more erratic
        if (type === 'solar') {
           newValue = Math.max(0, Math.min(100, prevValue + (Math.random() - 0.5) * 5));
        }

        const newData = [...currentData.slice(1), { time: nextTime, value: Math.round(newValue) }];
        return newData;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [type]);

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 text-sm text-slate-300 font-sans font-medium">
          {icon}
          <span>{title}</span>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 animate-pulse">● Live</span>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`color${type}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis hide dataKey="time" />
            <YAxis hide domain={[0, 100]} />
            <Tooltip 
              contentStyle={{backgroundColor: '#0f172a', borderColor: color, borderRadius: '4px', fontSize: '12px'}}
              itemStyle={{color: color}}
              labelStyle={{display: 'none'}}
              formatter={(value: number) => [`${value} MW`, 'Output']}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              strokeWidth={2}
              fillOpacity={1} 
              fill={`url(#color${type})`} 
              isAnimationActive={false} // Disable rechart animation for smooth streaming
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};