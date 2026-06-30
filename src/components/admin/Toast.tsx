import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'delete';

export interface ToastMessage {
  title: string;
  message: string;
  type?: ToastType;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const isError = toast.type === 'error';
  const isDelete = toast.type === 'delete';
  const borderColor = isError ? '#ef4444' : isDelete ? '#f97316' : '#0084ff';
  const titleColor = isError ? 'text-red-600' : isDelete ? 'text-orange-600' : 'text-[#0084ff]';
  const accentBar = isError ? 'bg-red-500' : isDelete ? 'bg-orange-500' : 'bg-[#0084ff]';

  return (
    <div
      className="fixed top-6 right-6 z-[100] w-[340px] overflow-hidden rounded-xl border bg-white shadow-[0_14px_40px_-16px_rgba(15,23,42,0.35)] animate-in fade-in slide-in-from-right-4 zoom-in-95 duration-300"
      style={{ borderLeft: `4px solid ${borderColor}` }}
    >
      <div className={`h-1 w-full ${accentBar}`} />
      <div className="px-4 py-3">
        <h4 className={`text-[14px] font-bold ${titleColor}`}>{toast.title}</h4>
        <p className="mt-1 text-[13px] leading-5 text-slate-600">{toast.message}</p>
      </div>
    </div>
  );
}
