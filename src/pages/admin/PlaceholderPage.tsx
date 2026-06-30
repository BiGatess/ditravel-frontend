import React from 'react';
import { Construction } from 'lucide-react';

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">{title}</h1>
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
        <div className="mb-3 grid h-14 w-14 place-items-center rounded-lg bg-slate-100 text-slate-500">
           <Construction className="h-7 w-7" strokeWidth={2.2} />
        </div>
        <h3 className="text-lg font-medium text-slate-700">Đang phát triển</h3>
        <p className="text-slate-500 text-[14px] mt-1 text-center max-w-sm">
          Module này đang nằm trong lộ trình xây dựng và sẽ sớm ra mắt trong bản cập nhật tiếp theo.
        </p>
      </div>
    </div>
  );
}
