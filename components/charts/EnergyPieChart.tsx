import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Solar', value: 20.9, color: '#facc15' },
  { name: 'Wind', value: 22.7, color: '#4ade80' },
  { name: 'Hydro', value: 35.5, color: '#38bdf8' },
  { name: 'Thermal', value: 15.3, color: '#f87171' },
];

export const EnergyPieChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          innerRadius="55%"
          outerRadius="80%"
          paddingAngle={5}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
           contentStyle={{backgroundColor: '#0f172a', borderColor: '#06b6d4', borderRadius: '4px', fontSize: '12px'}}
           itemStyle={{color: '#fff'}}
        />
        <Legend 
          verticalAlign="middle" 
          align="right"
          layout="vertical"
          iconSize={8}
          iconType="circle"
          wrapperStyle={{fontSize: '12px', fontFamily: 'Rajdhani'}}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};