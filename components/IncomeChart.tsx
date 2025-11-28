import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { IncomeSource } from '../types';
import { formatCurrency } from '../constants';

interface IncomeChartProps {
  data: IncomeSource[];
}

const incomeColors: { [key: string]: string } = {
  'Salary': '#6366f1',          // indigo-500
  'Business Income': '#3b82f6', // blue-500
  'Side Hustle': '#10b981',     // emerald-500
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 text-white p-3 rounded-xl shadow-lg">
        <p className="text-sm font-bold">{label}</p>
        <p className="text-xs">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const IncomeChart: React.FC<IncomeChartProps> = ({ data }) => {
  // Ensure a consistent order for display
  const chartData = [
    data.find(d => d.name === 'Salary'),
    data.find(d => d.name === 'Business Income'),
    data.find(d => d.name === 'Side Hustle')
  ].filter(Boolean) as IncomeSource[];

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={chartData} 
          margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
        >
          <XAxis 
            dataKey="name" 
            tickLine={false} 
            axisLine={false} 
            tick={{ fontSize: 10, fill: '#64748b' }} 
            formatter={(value) => value.replace(' Income', '')}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }} 
            content={<CustomTooltip />} 
          />
          <Bar dataKey="amount" radius={[8, 8, 8, 8]}>
            {chartData.map((entry) => (
              <Cell key={`cell-${entry.id}`} fill={incomeColors[entry.name]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeChart;
