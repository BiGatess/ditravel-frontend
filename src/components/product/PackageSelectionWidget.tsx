import React, { useState } from 'react';
import { Calendar, ChevronDown, Check, Info, Minus, Plus, ShoppingCart, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';



// Generate next 3 days
const nextDays = Array.from({ length: 3 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i + 1);
  return {
    date: d,
    dayStr: d.toLocaleDateString('vi-VN', { weekday: 'short' }),
    dateStr: `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`,
    fullStr: d.toISOString().split('T')[0]
  };
});

export default function PackageSelectionWidget({ ticketTypes = [] }: { ticketTypes?: any[] }) {
  const displayPackages = ticketTypes.length > 0 ? ticketTypes.map(t => ({
    id: t.id,
    name: t.name,
    priceAdult: Number(t.price),
    priceChild: Number(t.price) * 0.7, // Giả lập giá trẻ em = 70% giá người lớn nếu backend chưa có
    includes: t.description ? t.description.split('\n') : [],
    note: ''
  })) : [];

  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(nextDays[0].fullStr);
  const [expandedPackage, setExpandedPackage] = useState<string | null>(displayPackages[0]?.id || null);
  const [quantities, setQuantities] = useState<Record<string, { adult: number; child: number }>>({});

  React.useEffect(() => {
    setQuantities(
      displayPackages.reduce((acc, pkg) => ({ ...acc, [pkg.id]: { adult: 0, child: 0 } }), {})
    );
  }, [ticketTypes]);

  const updateQuantity = (pkgId: string, type: 'adult' | 'child', delta: number) => {
    setQuantities(prev => {
      const current = prev[pkgId][type];
      const next = Math.max(0, current + delta);
      return { ...prev, [pkgId]: { ...prev[pkgId], [type]: next } };
    });
  };

  const calculateTotal = (pkg: any) => {
    const q = quantities[pkg.id] || { adult: 0, child: 0 };
    return q.adult * pkg.priceAdult + q.child * pkg.priceChild;
  };

  const renderCalendar = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      const dateStr = d.toISOString().split('T')[0];
      const isSelected = selectedDate === dateStr;
      const isPast = d < new Date(new Date().setHours(0,0,0,0));
      
      days.push(
        <button
          key={i}
          disabled={isPast}
          onClick={() => {
            setSelectedDate(dateStr);
            setShowCalendar(false);
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] transition-all ${
            isSelected ? 'bg-[#ff5b00] text-white font-bold shadow-md' : 
            isPast ? 'text-slate-200 cursor-not-allowed' : 
            'text-slate-700 hover:bg-slate-100 hover:text-[#ff5b00]'
          }`}
        >
          {i}
        </button>
      );
    }
    return days;
  };

  const isCustomDateSelected = selectedDate && !nextDays.some(d => d.fullStr === selectedDate);

  return (
    <div id="booking-section" className="bg-white rounded-xl shadow-[0_5px_30px_rgba(0,0,0,0.06)] border border-slate-100 relative z-30 mb-8">
      {/* Step 1: Date Selection */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-[#ff5b00]/10 text-[#ff5b00] flex items-center justify-center font-bold text-[14px]">1</div>
          <h3 className="text-[18px] font-bold text-slate-800">Chọn ngày sử dụng</h3>
        </div>
        
        <div className="flex flex-wrap gap-3 pl-11">
          {nextDays.map((day) => (
            <button
              key={day.fullStr}
              onClick={() => setSelectedDate(day.fullStr)}
              className={`flex flex-col items-center justify-center min-w-[70px] py-2 px-3 rounded-lg border-2 transition-all ${
                selectedDate === day.fullStr 
                  ? 'border-[#ff5b00] bg-[#ff5b00]/5 text-[#ff5b00]' 
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <span className="text-[12px] font-medium">{day.dayStr}</span>
              <span className="text-[15px] font-bold">{day.dateStr}</span>
            </button>
          ))}
          <div className="relative">
            <button 
              onClick={() => setShowCalendar(!showCalendar)}
              className={`flex flex-col items-center justify-center min-w-[70px] h-full py-2 px-3 rounded-lg border-2 transition-all cursor-pointer ${
                showCalendar || isCustomDateSelected ? 'border-[#ff5b00] bg-[#ff5b00]/5 text-[#ff5b00]' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              {isCustomDateSelected ? (
                <>
                  <span className="text-[12px] font-medium">{new Date(selectedDate).toLocaleDateString('vi-VN', { weekday: 'short' })}</span>
                  <span className="text-[15px] font-bold">{`${new Date(selectedDate).getDate().toString().padStart(2, '0')}/${(new Date(selectedDate).getMonth() + 1).toString().padStart(2, '0')}`}</span>
                </>
              ) : (
                <>
                  <Calendar className="w-5 h-5 mb-1" />
                  <span className="text-[12px] font-medium">Khác</span>
                </>
              )}
            </button>
            
            <AnimatePresence>
              {showCalendar && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-3 p-4 bg-white rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.12)] border border-slate-100 z-50 w-[280px]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <button 
                      onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="font-bold text-slate-800 text-[14px]">
                      Tháng {calendarMonth.getMonth() + 1}, {calendarMonth.getFullYear()}
                    </div>
                    <button 
                      onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d => (
                      <div key={d} className="text-[11px] font-bold text-slate-400">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {renderCalendar()}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Step 2: Package Selection */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-[#ff5b00]/10 text-[#ff5b00] flex items-center justify-center font-bold text-[14px]">2</div>
          <h3 className="text-[18px] font-bold text-slate-800">Chọn Gói dịch vụ</h3>
        </div>

        <div className="pl-11 space-y-4">
          {displayPackages.length === 0 ? (
            <div className="text-[14px] text-slate-500 italic p-4 bg-slate-50 rounded-xl border border-slate-200">
              Chưa có gói dịch vụ nào được cấu hình cho sản phẩm này.
            </div>
          ) : displayPackages.map((pkg) => {
            const isExpanded = expandedPackage === pkg.id;
            const total = calculateTotal(pkg);
            const q = quantities[pkg.id] || { adult: 0, child: 0 };
            const hasItems = q.adult > 0 || q.child > 0;
            // Fake sold out state: Package 2 is sold out on the second day
            const isSoldOut = false; // Bỏ logic sold out fake

            return (
              <div 
                key={pkg.id} 
                className={`border-2 rounded-xl transition-all overflow-hidden relative ${
                  hasItems && !isSoldOut ? 'border-slate-800' : 'border-slate-200 hover:border-slate-300'
                } ${isSoldOut ? 'opacity-80 bg-slate-50' : ''}`}
              >
                {/* Package Header (Always visible) */}
                <div 
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer bg-white"
                  onClick={() => setExpandedPackage(isExpanded ? null : pkg.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-[18px] font-bold text-slate-800">{pkg.name}</h4>
                      {isSoldOut && <span className="bg-red-100 text-red-600 text-[11px] font-bold px-2 py-0.5 rounded uppercase border border-red-200">Hết vé</span>}
                    </div>
                    <div className="text-[13px] text-slate-500 flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500" /> Hoàn hủy miễn phí
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <Check className="w-3.5 h-3.5 text-emerald-500" /> Xác nhận tức thì
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-[12px] text-slate-500">Giá chỉ từ</div>
                      <div className="text-[18px] font-bold text-[#ff5b00]">
                        {pkg.priceAdult.toLocaleString('vi-VN')} <span className="underline text-[14px]">đ</span>
                      </div>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-4 h-4 text-slate-600" />
                    </div>
                  </div>
                </div>

                {/* Package Details (Expandable) */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-slate-100 bg-slate-50/30"
                    >
                      <div className="p-4 sm:p-5">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          
                          {/* Details Left */}
                          <div className="text-[13px]">
                            <h5 className="font-bold text-slate-800 mb-2 uppercase tracking-wide text-[12px]">Bao gồm</h5>
                            <ul className="space-y-1.5 mb-4 text-slate-600">
                              {pkg.includes.map((item: string, i: number) => (
                                item.trim() ? (
                                <li key={i} className="flex gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#ff5b00] shrink-0 mt-1.5"></div>
                                  <span>{item}</span>
                                </li>
                                ) : null
                              ))}
                            </ul>
                            
                            {pkg.note && (
                              <div className="bg-blue-50 text-blue-700 p-3 rounded-lg flex gap-2 items-start mt-4">
                                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                                <span className="leading-relaxed">{pkg.note}</span>
                              </div>
                            )}
                          </div>

                          {/* Selection Right */}
                          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative">
                            {isSoldOut && (
                              <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center rounded-xl backdrop-blur-[1px]">
                                <div className="bg-white px-4 py-2 rounded-lg shadow-md border border-red-100 text-red-500 font-bold text-[14px] flex items-center gap-2">
                                  Ngày này đã hết vé, vui lòng chọn ngày khác
                                </div>
                              </div>
                            )}
                            <div className="space-y-4 mb-4 pb-4 border-b border-slate-100">
                              
                              {/* Adult Row */}
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-bold text-slate-800 text-[14px]">Người lớn</div>
                                  <div className="text-[12px] text-slate-500">{pkg.priceAdult.toLocaleString('vi-VN')} đ</div>
                                </div>
                                <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200 p-1">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); updateQuantity(pkg.id, 'adult', -1); }}
                                    disabled={q.adult <= 0 || isSoldOut}
                                    className="w-7 h-7 flex items-center justify-center rounded bg-white shadow-sm disabled:opacity-30 disabled:shadow-none text-slate-600 hover:text-[#ff5b00] transition-colors"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-8 text-center font-bold text-[14px] text-slate-800">{q.adult}</span>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); updateQuantity(pkg.id, 'adult', 1); }}
                                    disabled={isSoldOut}
                                    className="w-7 h-7 flex items-center justify-center rounded bg-white shadow-sm disabled:opacity-30 disabled:shadow-none text-slate-600 hover:text-[#ff5b00] transition-colors"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>

                              {/* Child Row */}
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-bold text-slate-800 text-[14px]">Trẻ em</div>
                                  <div className="text-[12px] text-slate-500">Từ 4-9 tuổi • {pkg.priceChild.toLocaleString('vi-VN')} đ</div>
                                </div>
                                <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200 p-1">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); updateQuantity(pkg.id, 'child', -1); }}
                                    disabled={q.child <= 0 || isSoldOut}
                                    className="w-7 h-7 flex items-center justify-center rounded bg-white shadow-sm disabled:opacity-30 disabled:shadow-none text-slate-600 hover:text-[#ff5b00] transition-colors"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-8 text-center font-bold text-[14px] text-slate-800">{q.child}</span>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); updateQuantity(pkg.id, 'child', 1); }}
                                    disabled={isSoldOut}
                                    className="w-7 h-7 flex items-center justify-center rounded bg-white shadow-sm disabled:opacity-30 disabled:shadow-none text-slate-600 hover:text-[#ff5b00] transition-colors"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>

                            </div>

                            {/* Action Row */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                              <div>
                                <div className="text-[12px] text-slate-500 mb-0.5">Tổng cộng</div>
                                <motion.div 
                                  key={total}
                                  initial={{ scale: 1.1, color: '#ff5b00' }}
                                  animate={{ scale: 1, color: '#ff5b00' }}
                                  className="text-[20px] font-bold leading-none"
                                >
                                  {total.toLocaleString('vi-VN')} <span className="underline text-[14px] font-medium">đ</span>
                                </motion.div>
                              </div>
                              <button 
                                disabled={!hasItems || !selectedDate || isSoldOut}
                                className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-bold text-[14px] flex items-center justify-center gap-2 transition-all shadow-md ${
                                  hasItems && selectedDate && !isSoldOut
                                    ? 'bg-gradient-to-r from-[#ff5b00] to-[#ff7a33] text-white hover:shadow-lg hover:-translate-y-0.5' 
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                                }`}
                              >
                                Đặt vé ngay
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                            
                            {!selectedDate && hasItems && (
                              <div className="text-[12px] text-orange-500 mt-3 text-center sm:text-right font-medium">
                                Vui lòng chọn ngày sử dụng ở Bước 1
                              </div>
                            )}

                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
