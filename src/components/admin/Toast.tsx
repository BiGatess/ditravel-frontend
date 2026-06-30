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
  const borderColor = isError ? '#ef4444' : isDelete ? '#f97316' : '#22c55e';
  const bgColor = isError ? 'bg-red-50' : isDelete ? 'bg-orange-50' : 'bg-emerald-50';
  const titleColor = isError ? 'text-red-700' : isDelete ? 'text-orange-700' : 'text-emerald-700';
  const messageColor = isError ? 'text-red-700/80' : isDelete ? 'text-orange-700/80' : 'text-emerald-700/80';

  return (
    <div
      className={`fixed top-4 right-4 z-[100] w-[280px] overflow-hidden rounded-lg border px-3 py-2.5 ${bgColor} animate-in fade-in slide-in-from-right-3 duration-200`}
      style={{ borderColor }}
    >
      <div className="flex items-start gap-2">
        <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${isError ? 'bg-red-500' : isDelete ? 'bg-orange-500' : 'bg-emerald-500'}`} />
        <div className="min-w-0 flex-1">
          <h4 className={`text-[13px] font-semibold leading-5 ${titleColor}`}>{toast.title}</h4>
          <p className={`mt-0.5 text-[12px] leading-5 ${messageColor}`}>{toast.message}</p>
        </div>
      </div>
    </div>
  );
}
