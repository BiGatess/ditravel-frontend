import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronDown, Info, User, Minus, Plus, FileText, Package, ShoppingCart, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

// MOCK DATA
const TICKET_TYPES = [
  { id: 'adult', name: 'Người lớn', originalPrice: 1000000, price: 970000 },
  { id: 'child', name: 'Trẻ em', originalPrice: 800000, price: 790000 },
  { id: 'elder', name: 'Người cao tuổi', originalPrice: 800000, price: 790000 },
];

export default function TicketBookingWidget() {
  const navigate = useNavigate();
  const calendarRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState('2026-06-19');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isPackageExpanded, setIsPackageExpanded] = useState(true);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateQty = (pkgId: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[pkgId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[pkgId];
        return copy;
      }
      return { ...prev, [pkgId]: next };
    });
  };

  const totalItems: number = (Object.values(quantities) as number[]).reduce((a: number, b: number) => a + b, 0);
  const totalPrice: number = (Object.entries(quantities) as [string, number][]).reduce((total: number, entry) => {
    const [id, qty] = entry;
    const pkg = TICKET_TYPES.find(p => p.id === id);
    return total + (pkg ? pkg.price * (qty as number) : 0);
  }, 0);

  const handleBook = () => {
    if (totalItems > 0) {
      navigate('/checkout');
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    try {
       const d = new Date(dateStr);
       if(isNaN(d.getTime())) return "Chọn ngày";
       return `${days[d.getDay()]}, ${d.getDate()} tháng ${d.getMonth() + 1}, ${d.getFullYear()}`;
    } catch(e) {
       return "Chọn ngày";
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-5 mb-4 items-start relative z-30">
      <div className="flex-1 space-y-5 min-w-0 w-full">
        {/* Booking Box */}
        <motion.div id="booking-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="rounded-[8px] bg-white shadow-[0_-5px_20px_rgba(0,0,0,0.05)] scroll-mt-24">
          <div className="bg-[#fdf2f2] p-5 rounded-t-[8px]">
            <h3 className="text-[18px] font-bold text-[#242424]">Chọn ngày và vé tham quan</h3>
            <p className="text-[13px] text-slate-500 mt-1">Chọn ngày bạn muốn tham quan</p>
          </div>
          <div className="bg-[#fdf2f2] px-5 pb-0 rounded-b-[8px]">
            <div className="flex flex-wrap gap-2 mb-5">
              {[
                { label: 'TH 6', date: '2026-06-19', display: '19/06' },
                { label: 'TH 7', date: '2026-06-20', display: '20/06' },
                { label: 'CN', date: '2026-06-21', display: '21/06' }
              ].map((quickD) => (
                <button 
                  key={quickD.date}
                  onClick={() => setSelectedDate(quickD.date)}
                  className={`flex flex-col items-center justify-center min-w-[90px] h-[64px] rounded-[6px] border transition-transform hover:scale-105 ${selectedDate === quickD.date ? 'bg-[#dc2626] text-white border-[#dc2626] shadow-sm relative' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                >
                  <span className={`text-[12px] ${selectedDate === quickD.date ? 'opacity-90' : ''}`}>{quickD.label}</span>
                  <span className="font-bold text-[16px]">{quickD.display}</span>
                  {selectedDate === quickD.date && (
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-white rounded-full border border-[#dc2626]"></div>
                  )}
                </button>
              ))}
              
              {(() => {
                const isCustomDate = !['2026-06-19', '2026-06-20', '2026-06-21'].includes(selectedDate);
                
                return (
                  <div className="relative inline-block" ref={calendarRef}>
                    <button 
                      onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                      className={`flex flex-col items-center justify-center min-w-[100px] h-[64px] rounded-[6px] border transition-colors px-2 ${(isCalendarOpen || isCustomDate) ? 'bg-[#dc2626] text-white border-[#dc2626] shadow-[0_5px_15px_rgba(220,38,38,0.3)]' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                    >
                      <Calendar className={`w-5 h-5 mb-1 ${(isCalendarOpen || isCustomDate) ? 'text-white' : 'text-slate-400'}`} />
                      <span className="text-[12px] leading-none font-bold">
                        {isCustomDate ? selectedDate.split('-').reverse().slice(0, 2).join('/') : 'Xem lịch'}
                      </span>
                    </button>
                    
                    {/* Custom Calendar Popover */}
                    {isCalendarOpen && (
                  <div className="absolute top-[72px] right-0 z-50 w-[450px] max-w-[90vw] bg-white rounded-[12px] shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-slate-200 lg:right-auto lg:left-0 origin-top-left animate-in fade-in zoom-in-95 duration-200 pb-2">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-100">
                      <h4 className="text-[16px] font-bold text-slate-800">Tháng 6 2026</h4>
                      <div className="flex gap-2">
                        <button className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors">
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="p-4 pb-2">
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => (
                          <div key={day} className="text-center font-bold text-[12px] text-slate-500 pb-2">
                            {day}
                          </div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-7 gap-1">
                        {/* Empty days for formatting (start on monday) */}
                        {Array.from({length: 0}).map((_, i) => (
                          <div key={`empty-${i}`} className="h-[46px] bg-slate-50 border border-slate-100 rounded-[6px]"></div>
                        ))}
                        
                        {/* Days 1 to 30 */}
                        {Array.from({length: 30}).map((_, i) => {
                          const day = i + 1;
                          const isWeekend = (day + 0) % 7 === 6 || (day + 0) % 7 === 0;
                          const isToday = day === 18;
                          // Active selected date
                          const formattedDay = `2026-06-${day.toString().padStart(2, '0')}`;
                          const isSelected = selectedDate === formattedDay;
                          // Price check
                          const hasPrice = day >= 19 || isToday;
                          
                          if (!hasPrice) {
                            return (
                              <div key={day} className="h-[46px] flex flex-col items-center justify-center bg-[#f8fafc] border border-slate-100/50 rounded-[6px] opacity-70">
                                <span className="text-[14px] text-slate-400 font-semibold">{day}</span>
                                {isToday && <div className="mt-0.5 w-1 h-1 rounded-full bg-slate-300"></div>}
                              </div>
                            );
                          }

                          return (
                            <button 
                              key={day} 
                              onClick={() => {
                                setSelectedDate(`2026-06-${day.toString().padStart(2, '0')}`);
                                setIsCalendarOpen(false);
                              }}
                              className={`h-[46px] flex flex-col items-center justify-center rounded-[6px] border hover:border-[#dc2626] transition-all cursor-pointer relative ${
                                isSelected 
                                  ? 'bg-[#dc2626] border-[#dc2626] shadow-[0_4px_12px_rgba(220,38,38,0.25)] text-white' 
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-red-50'
                              }`}
                            >
                              <span className={`text-[14px] font-bold ${isWeekend && !isSelected ? 'text-[#dc2626]' : ''}`}>{day}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              );
             })()}
            </div>

            <h3 className="text-[16px] font-bold text-[#242424] mb-3">Các gói dịch vụ</h3>
            
            <div className="bg-white rounded-[8px] border border-slate-200 overflow-hidden shadow-sm">
              {/* Package Header */}
              <div 
                className="p-4 sm:p-5 flex flex-col sm:flex-row cursor-pointer items-start sm:items-center justify-between hover:bg-slate-50 transition-colors gap-3 sm:gap-0"
                onClick={() => setIsPackageExpanded(!isPackageExpanded)}
              >
                <div className="font-bold text-[15px] sm:text-[16px] text-[#242424] flex-1 pr-4">
                  [GIẢM 3%] Vé Cáp Treo Bà Nà Hill
                </div>
                <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-left sm:text-right">
                    <div className="text-[11px] text-slate-500 uppercase">Từ</div>
                    <div className="text-[#dc2626] font-bold text-[20px] leading-tight">
                      970.000 <span className="underline font-normal text-[16px]">đ</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-[#dc2626] text-white rounded-[4px]">
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isPackageExpanded ? 'rotate-180' : ''}`} />
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center border border-slate-200 text-[#dc2626] hover:bg-slate-50 transition-colors rounded-full">
                      <Info className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Package Body */}
              {isPackageExpanded && (
                <div className="p-4 sm:p-5 border-t border-slate-200 space-y-4 bg-white">
                  {TICKET_TYPES.map(ticket => (
                    <div key={ticket.id} className="border border-slate-200 hover:border-slate-300 rounded-[6px] p-4 sm:p-5 transition-colors">
                      <div className="flex items-center gap-2 font-bold mb-4 text-[#242424] text-[15px]">
                         <User className="w-4 h-4 text-[#dc2626]" />
                         {ticket.name}
                      </div>
                      
                      <div className="mb-5">
                        <div className="text-[11px] font-bold text-slate-400 mb-0.5">GIÁ</div>
                        {ticket.originalPrice && (
                          <div className="text-[13px] text-slate-400 line-through">
                            {ticket.originalPrice.toLocaleString('vi-VN')} đ
                          </div>
                        )}
                        <div className="text-[#dc2626] font-bold text-[22px] leading-tight flex items-start gap-1">
                          {ticket.price.toLocaleString('vi-VN')} <span className="underline text-[16px] mt-0.5 font-normal">đ</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">(Đã bao gồm 8% VAT)</div>
                      </div>
                      
                      {/* Quantity Selector Full Width */}
                      <div className="flex items-center w-full h-10">
                        <button 
                          onClick={(e) => { e.stopPropagation(); updateQty(ticket.id, -1); }}
                          disabled={!quantities[ticket.id]}
                          className="w-12 h-full flex items-center justify-center text-slate-500 bg-[#f1f5f9] rounded-l-[4px] disabled:opacity-50 hover:bg-slate-200 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <div className="flex-1 h-full bg-[#fdf2f2] flex items-center justify-center font-bold text-[#242424] text-[15px]">
                          {quantities[ticket.id] || 0}
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); updateQty(ticket.id, 1); }}
                          className="w-12 h-full flex items-center justify-center text-white bg-[#dc2626] hover:bg-[#b91c1c] rounded-r-[4px] transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Item Subtotal aligned right */}
                      {quantities[ticket.id] > 0 && (
                        <div className="mt-3 text-right">
                          <div className="text-[12px] text-slate-500 mb-0.5">
                            {quantities[ticket.id]} x {ticket.price.toLocaleString('vi-VN')} đ
                          </div>
                          <div className="font-bold text-[#dc2626] text-[16px]">
                            {(quantities[ticket.id] * ticket.price).toLocaleString('vi-VN')} đ
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
      </motion.div>
      </div>

      {/* Sticky Sidebar (Right) - Row 2 (Summary) */}
      <div className="w-full lg:w-[350px] shrink-0 relative z-20">
         <div className="sticky top-4 space-y-6">
             {/* Summary Box */}
             <div className="bg-white rounded-[8px] shadow-[0_5px_20px_rgba(0,0,0,0.08)] overflow-hidden">
                <div className="bg-[#fdf2f2] p-4 flex items-center gap-2 border-b border-[#fceeed]">
                   <FileText className="w-5 h-5 text-[#dc2626]" />
                   <h3 className="font-bold text-[16px] text-[#dc2626]">Tóm tắt</h3>
                </div>
                
                <div className="p-4 xl:p-5 flex flex-col gap-4">
                  <div className="border border-slate-200 rounded-[6px] p-3.5">
                    <div className="flex items-center gap-2 text-slate-500 mb-1.5 font-bold text-[11px] uppercase tracking-wider">
                      <Calendar className="w-4 h-4 text-[#dc2626]" /> NGÀY
                    </div>
                    <div className="font-medium text-[#242424] text-[15px]">{formatDate(selectedDate)}</div>
                  </div>

                  <div className="border border-slate-200 rounded-[6px] p-3.5">
                    <div className="flex items-center gap-2 text-slate-500 mb-3 font-bold text-[11px] uppercase tracking-wider">
                      <Package className="w-4 h-4 text-[#dc2626]" /> 
                      CHI TIẾT
                    </div>
                    
                    {totalItems > 0 ? (
                    <div className="space-y-4">
                      <div className="font-bold text-[#0084ff] text-[14px] leading-tight">
                        [GIẢM 3%] Vé Cáp Treo Bà Nà Hill
                      </div>
                      <div className="space-y-2">
                        {TICKET_TYPES.map(t => {
                           if(quantities[t.id]) {
                              return (
                                <div key={t.id} className="flex justify-between items-start text-[13px] border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                                  <div>
                                    <div className="font-medium text-[#242424] mb-0.5">{t.name}</div>
                                    <div className="text-slate-500 text-[12px]">{quantities[t.id]} x {t.price.toLocaleString('vi-VN')} đ</div>
                                  </div>
                                  <div className="font-bold text-[#242424]">
                                     {(quantities[t.id] * t.price).toLocaleString('vi-VN')} đ
                                  </div>
                                </div>
                              )
                           }
                           return null;
                        })}
                      </div>
                    </div>
                    ) : (
                      <div className="text-[#242424] font-bold text-[18px] ml-6">-</div>
                    )}
                  </div>

                  <div className={`rounded-[6px] p-4 flex justify-between items-center relative transition-colors ${totalItems > 0 ? 'bg-[#fdf2f2] border border-[#fceeed]' : 'bg-slate-50 border border-slate-200'}`}>
                    <div>
                      <div className="text-[12px] font-bold text-slate-500 uppercase mb-1">TỔNG CỘNG</div>
                      <div className={`font-bold text-[28px] leading-tight flex items-start gap-1 transition-colors ${totalItems > 0 ? 'text-[#dc2626]' : 'text-slate-400'}`}>
                        {totalItems > 0 ? totalPrice.toLocaleString('vi-VN') : '0'} 
                        <span className="text-[18px] underline font-normal mt-1">đ</span>
                      </div>
                    </div>
                    {!totalItems && (
                      <div className="w-8 h-8 rounded-full bg-[#fca5a5] text-white flex items-center justify-center font-bold text-[18px]">!</div>
                    )}
                  </div>

                  {!totalItems && (
                    <div className="text-center text-[12px] text-slate-400 italic mt-2">
                      Chọn gói dịch vụ và số lượng để thêm vào giỏ hàng
                    </div>
                  )}

                  <div className="space-y-3 mt-1">
                    <button 
                      onClick={handleBook}
                      disabled={totalItems === 0}
                      className="w-full bg-[#dc2626] hover:bg-[#b91c1c] disabled:bg-[#f1f5f9] disabled:text-slate-400 text-white font-bold h-[48px] rounded-[6px] flex items-center justify-center gap-2 transition-colors uppercase text-[14px]"
                    >
                      <ShoppingCart className="w-5 h-5" /> Thêm vào giỏ hàng
                    </button>
                    
                    <button 
                      onClick={handleBook}
                      disabled={totalItems === 0}
                      className="w-full bg-[#16a34a] hover:bg-[#15803d] disabled:bg-[#f1f5f9] disabled:text-slate-400 text-white font-bold h-[48px] rounded-[6px] flex items-center justify-center gap-2 transition-colors uppercase text-[14px]"
                    >
                      <CreditCard className="w-5 h-5" /> Thanh toán ngay
                    </button>
                  </div>
                </div>
             </div>
         </div>
      </div>
    </div>
  );
}
