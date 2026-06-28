import React from 'react';

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">{title}</h1>
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
        <div className="text-slate-400 mb-2">
           <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
           </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-700">Đang phát triển</h3>
        <p className="text-slate-500 text-[14px] mt-1 text-center max-w-sm">
          Module này đang nằm trong lộ trình xây dựng và sẽ sớm ra mắt trong bản cập nhật tiếp theo.
        </p>
      </div>
    </div>
  );
}
