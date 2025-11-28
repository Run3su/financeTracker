import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { SpendingCategory } from '../types';

interface SpendingChartProps {
  data: SpendingCategory[];
}

const SpendingChart: React.FC<SpendingChartProps> = ({ data }) => {
  return (
    <div className="h-64 w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="amount"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`K ${value.toLocaleString()}`, 'Spent']}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-sm text-slate-400 font-medium">Total Spent</span>
        <span className="text-xl font-bold text-slate-700">
           K {data.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default SpendingChart;
