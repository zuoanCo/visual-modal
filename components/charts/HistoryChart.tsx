import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = Array.from({ length: 12 }, (_, i) => ({
  month: `2024-${i + 1}`,
  gen: Math.floor(Math.random() * 100) + 100,
  usage: Math.floor(Math.random() * 80) + 80,
}));

export const HistoryChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} barSize={10} barGap={2}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
        <XAxis dataKey="month" tick={{fill: '#64748b', fontSize: 10}} axisLine={false} tickLine={false} />
        <YAxis tick={{fill: '#64748b', fontSize: 10}} axisLine={false} tickLine={false} />
        <Tooltip 
          cursor={{fill: 'rgba(255,255,255,0.05)'}}
          contentStyle={{backgroundColor: '#0f172a', borderColor: '#06b6d4', borderRadius: '4px'}}
        />
        <Bar dataKey="gen" fill="#06b6d4" radius={[2, 2, 0, 0]} name="Generation" />
        <Bar dataKey="usage" fill="#38bdf8" radius={[2, 2, 0, 0]} fillOpacity={0.5} name="Usage" />
      </BarChart>
    </ResponsiveContainer>
  );
};