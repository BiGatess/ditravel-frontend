import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  colorClass: string;
  chartData?: number[];
  chartColor?: string;
}

export default function StatCard({ title, value, icon, trend, colorClass, chartData, chartColor = "currentColor" }: StatCardProps) {
  
  let chartPoints = '';
  if (chartData && chartData.length > 0) {
    const max = Math.max(...chartData);
    const min = Math.min(...chartData) * 0.8; 
    const range = max - min || 1;
    chartPoints = chartData.map((val, i) => {
      const x = (i / (chartData.length - 1)) * 100;
      const y = 100 - ((val - min) / range) * 100;
      return `${x},${y}`;
    }).join(' ');
  }

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden group">
      <div className="flex justify-between items-start mb-2 relative z-10">
        <div>
          <p className="text-slate-500 text-[13px] font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass} shadow-sm`}>
          {icon}
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center gap-2 mt-2 text-[12px] relative z-10">
          <span className={`flex items-center font-bold px-1.5 py-0.5 rounded-md ${trend.isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
          <span className="text-slate-400">so với kỳ trước</span>
        </div>
      )}
    </div>
  );
}
