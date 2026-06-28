import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  singleDate?: boolean;
  onApply: (start: Date | null, end: Date | null) => void;
  onClose: () => void;
}

export default function DateRangePicker({ startDate, endDate, singleDate, onApply, onClose }: DateRangePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(startDate || new Date());
  const [tempStart, setTempStart] = useState<Date | null>(startDate);
  const [tempEnd, setTempEnd] = useState<Date | null>(endDate);

  // Sync state if props change
  useEffect(() => {
    setTempStart(startDate);
    setTempEnd(endDate);
  }, [startDate, endDate]);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  // Calculate padding for the first week (Monday is 1, Sunday is 0)
  const prevMonthPadding = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; 

  const handleDateClick = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    if (singleDate) {
      setTempStart(selected);
      setTempEnd(null);
      return;
    }
    
    if (!tempStart || (tempStart && tempEnd)) {
      setTempStart(selected);
      setTempEnd(null);
    } else if (tempStart && !tempEnd) {
      if (selected < tempStart) {
        setTempEnd(tempStart);
        setTempStart(selected);
      } else {
        setTempEnd(selected);
      }
    }
  };

  const isSelected = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const time = date.getTime();
    const startTime = tempStart?.getTime();
    const endTime = tempEnd?.getTime();
    
    if (startTime === time || endTime === time) return true;
    if (startTime && endTime && time > startTime && time < endTime) return true;
    return false;
  };

  const isEndpoint = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).getTime();
    return date === tempStart?.getTime() || date === tempEnd?.getTime();
  };

  return (
    <div className="w-[280px] p-4 bg-white rounded-xl shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
          className="p-1.5 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-slate-600" />
        </button>
        <div className="font-bold text-[14px] text-slate-800">
          Tháng {currentMonth.getMonth() + 1}, {currentMonth.getFullYear()}
        </div>
        <button 
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
          className="p-1.5 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-slate-600" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 mb-2">
        <div>T2</div><div>T3</div><div>T4</div><div>T5</div><div>T6</div><div>T7</div><div>CN</div>
      </div>
      
      <div className="grid grid-cols-7 gap-y-1 text-center text-[13px]">
        {Array.from({ length: prevMonthPadding }).map((_, i) => (
          <div key={`empty-${i}`} className="p-0.5"></div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const selected = isSelected(day);
          const endpoint = isEndpoint(day);
          return (
            <div key={day} className="p-0.5 relative">
              {selected && !endpoint && (
                <div className="absolute inset-y-0.5 -inset-x-0.5 bg-orange-50 z-0"></div>
              )}
              <button 
                onClick={() => handleDateClick(day)}
                className={`relative z-10 w-full aspect-square flex items-center justify-center rounded-md transition-all duration-200 transform
                  ${endpoint ? 'bg-[#ff5b00] text-white font-bold shadow-sm hover:bg-[#e65200] hover:scale-105' : 
                    selected ? 'text-[#ff5b00] font-medium hover:bg-orange-100 hover:scale-110' : 
                    'hover:bg-orange-50 text-slate-700 hover:text-[#ff5b00] hover:scale-110 hover:-translate-y-0.5 hover:shadow-sm'
                  }`}
              >
                {day}
              </button>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
         <button 
           onClick={onClose}
           className="text-[12px] font-medium text-slate-500 hover:text-slate-700 px-2 py-1 rounded"
         >
           Hủy
         </button>
         <button 
           onClick={() => {
             if (singleDate && tempStart) {
               onApply(tempStart, null);
             } else if (tempStart) {
               onApply(tempStart, tempEnd || tempStart);
             }
           }}
           disabled={!tempStart}
           className={`px-4 py-1.5 rounded-md text-[12px] font-bold transition-colors ${tempStart ? 'bg-[#ff5b00] text-white hover:bg-[#e65200] shadow-sm' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
         >
           Áp dụng
         </button>
      </div>
    </div>
  );
}
