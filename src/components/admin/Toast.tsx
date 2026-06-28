import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, Trash2, X } from 'lucide-react';

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
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const isError = toast.type === 'error';
  const isDelete = toast.type === 'delete';
  const isSuccess = !toast.type || toast.type === 'success';

  const borderColor = isError ? '#ef4444' : isDelete ? '#f97316' : '#0084ff';
  const bgColor = isError ? 'bg-red-50' : isDelete ? 'bg-orange-50' : 'bg-blue-50';
  const textColor = isError ? 'text-red-500' : isDelete ? 'text-orange-500' : 'text-[#0084ff]';

  return (
    <div className="fixed top-6 right-6 z-[100] bg-white border-l-4 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] rounded-lg p-4 w-[320px] animate-in slide-in-from-right duration-300"
         style={{ borderLeftColor: borderColor }}>
      <div className="flex items-start gap-3">
        <div className={`p-1.5 rounded-full shrink-0 ${bgColor} ${textColor}`}>
          {isError && <AlertTriangle className="w-5 h-5" />}
          {isDelete && <Trash2 className="w-5 h-5" />}
          {isSuccess && <CheckCircle className="w-5 h-5" />}
        </div>
        <div>
          <h4 className="text-[14px] font-bold text-slate-800">{toast.title}</h4>
          <p className="text-[13px] text-slate-500 mt-0.5">{toast.message}</p>
        </div>
        <button onClick={onClose} className="ml-auto text-slate-400 hover:text-slate-600">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
