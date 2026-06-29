import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Check, ChevronDown, ChevronLeft, ChevronRight, Info, Minus, Plus, ShoppingCart, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../../context/CartContext';

type TicketType = {
  id: string;
  name: string;
  description?: string | null;
  price: number | string;
  original_price?: number | string | null;
  min_quantity?: number;
  max_quantity?: number;
  is_active?: boolean;
};

type ProductInfo = {
  id: string;
  name: string;
  image?: string;
};

type PackageSelectionWidgetProps = {
  ticketTypes?: TicketType[];
  product?: ProductInfo;
};

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

const formatCurrency = (value: number) => `${value.toLocaleString('vi-VN')} đ`;

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export default function PackageSelectionWidget({ ticketTypes = [], product }: PackageSelectionWidgetProps) {
  const navigate = useNavigate();
  const { setCartItems } = useCart();
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(nextDays[0].fullStr);
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const tickets = useMemo(() => {
    return ticketTypes
      .filter(ticket => ticket.is_active !== false)
      .map(ticket => ({
        id: ticket.id,
        name: ticket.name,
        description: ticket.description || '',
        includes: ticket.description ? ticket.description.split('\n').filter(Boolean) : [],
        price: Number(ticket.price || 0),
        originalPrice: ticket.original_price ? Number(ticket.original_price) : null,
        minQuantity: Number(ticket.min_quantity || 1),
        maxQuantity: Number(ticket.max_quantity || 10)
      }))
      .filter(ticket => ticket.price > 0);
  }, [ticketTypes]);

  useEffect(() => {
    setQuantities(tickets.reduce((acc, ticket) => ({ ...acc, [ticket.id]: 0 }), {}));
    setExpandedTicket(tickets[0]?.id || null);
  }, [tickets]);

  const updateQuantity = (ticketId: string, delta: number) => {
    const ticket = tickets.find(item => item.id === ticketId);
    if (!ticket) return;

    setQuantities(prev => {
      const current = prev[ticketId] || 0;
      const minValue = delta > 0 && current === 0 ? ticket.minQuantity : 0;
      const next = Math.min(ticket.maxQuantity, Math.max(minValue, current + delta));
      return { ...prev, [ticketId]: next };
    });
  };

  const selectedTickets = tickets.filter(ticket => (quantities[ticket.id] || 0) > 0);
  const totalItems = selectedTickets.reduce((sum, ticket) => sum + quantities[ticket.id], 0);
  const totalPrice = selectedTickets.reduce((sum, ticket) => sum + ticket.price * quantities[ticket.id], 0);

  const addSelectedToCart = (goToCheckout = false) => {
    if (!product || totalItems === 0) return;

    setCartItems(current => {
      const next = [...current];
      selectedTickets.forEach(ticket => {
        const quantity = quantities[ticket.id];
        const rowId = `${product.id}-${ticket.id}-${selectedDate}`;
        const existing = next.find(item => item.id === rowId);
        if (existing) {
          existing.quantity += quantity;
        } else {
          next.push({
            id: rowId,
            name: product.name,
            date: formatDate(selectedDate),
            type: ticket.name,
            price: ticket.price,
            quantity,
            image: product.image || 'https://images.unsplash.com/photo-1544735716-3920e6e41540?w=800&q=80'
          });
        }
      });
      return next;
    });

    if (goToCheckout) {
      navigate('/checkout');
    }
  };

  const renderCalendar = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDay; i += 1) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }

    for (let i = 1; i <= daysInMonth; i += 1) {
      const d = new Date(year, month, i);
      const dateStr = d.toISOString().split('T')[0];
      const isSelected = selectedDate === dateStr;
      const isPast = d < new Date(new Date().setHours(0, 0, 0, 0));

      days.push(
        <button
          key={i}
          type="button"
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

  const isCustomDateSelected = selectedDate && !nextDays.some(day => day.fullStr === selectedDate);

  return (
    <div id="booking-section" className="bg-white rounded-xl shadow-[0_5px_30px_rgba(0,0,0,0.06)] border border-slate-100 relative z-30 mb-8">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-[#ff5b00]/10 text-[#ff5b00] flex items-center justify-center font-bold text-[14px]">1</div>
          <h3 className="text-[18px] font-bold text-slate-800">Chọn ngày sử dụng</h3>
        </div>

        <div className="flex flex-wrap gap-3 pl-0 sm:pl-11">
          {nextDays.map(day => (
            <button
              key={day.fullStr}
              type="button"
              onClick={() => setSelectedDate(day.fullStr)}
              className={`flex flex-col items-center justify-center min-w-[74px] py-2 px-3 rounded-lg border-2 transition-all ${
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
              type="button"
              onClick={() => setShowCalendar(!showCalendar)}
              className={`flex flex-col items-center justify-center min-w-[74px] h-full py-2 px-3 rounded-lg border-2 transition-all ${
                showCalendar || isCustomDateSelected
                  ? 'border-[#ff5b00] bg-[#ff5b00]/5 text-[#ff5b00]'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
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
                      type="button"
                      onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="font-bold text-slate-800 text-[14px]">
                      Tháng {calendarMonth.getMonth() + 1}, {calendarMonth.getFullYear()}
                    </div>
                    <button
                      type="button"
                      onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
                      <div key={day} className="text-[11px] font-bold text-slate-400">{day}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-[#ff5b00]/10 text-[#ff5b00] flex items-center justify-center font-bold text-[14px]">2</div>
          <h3 className="text-[18px] font-bold text-slate-800">Chọn gói dịch vụ</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
          <div className="space-y-4">
            {tickets.length === 0 ? (
              <div className="text-[14px] text-slate-500 p-4 bg-slate-50 rounded-xl border border-slate-200">
                Sản phẩm này chưa có gói dịch vụ đang bán.
              </div>
            ) : tickets.map(ticket => {
              const isExpanded = expandedTicket === ticket.id;
              const quantity = quantities[ticket.id] || 0;
              const hasItems = quantity > 0;

              return (
                <div
                  key={ticket.id}
                  className={`border-2 rounded-xl transition-all overflow-hidden ${
                    hasItems ? 'border-[#ff5b00]' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    className="w-full p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white text-left"
                    onClick={() => setExpandedTicket(isExpanded ? null : ticket.id)}
                  >
                    <div className="flex-1">
                      <h4 className="text-[17px] font-bold text-slate-800">{ticket.name}</h4>
                      <div className="text-[13px] text-slate-500 flex flex-wrap items-center gap-2 mt-1">
                        <Check className="w-3.5 h-3.5 text-emerald-500" /> Xác nhận sau khi thanh toán
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        Tối đa {ticket.maxQuantity} vé
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-[12px] text-slate-500">Giá</div>
                        {ticket.originalPrice && ticket.originalPrice > ticket.price && (
                          <div className="text-[12px] text-slate-400 line-through">{formatCurrency(ticket.originalPrice)}</div>
                        )}
                        <div className="text-[18px] font-bold text-[#ff5b00]">{formatCurrency(ticket.price)}</div>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                        <ChevronDown className="w-4 h-4 text-slate-600" />
                      </div>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="border-t border-slate-100 bg-slate-50/40"
                      >
                        <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-[1fr_260px] gap-5">
                          <div className="text-[13px]">
                            <h5 className="font-bold text-slate-800 mb-2 uppercase tracking-wide text-[12px]">Bao gồm</h5>
                            {ticket.includes.length > 0 ? (
                              <ul className="space-y-1.5 text-slate-600">
                                {ticket.includes.map((item, index) => (
                                  <li key={index} className="flex gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff5b00] shrink-0 mt-1.5" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <div className="bg-white border border-slate-200 rounded-lg p-3 text-slate-500 flex gap-2">
                                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>Gói này chưa có mô tả chi tiết.</span>
                              </div>
                            )}
                          </div>

                          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <div className="font-bold text-slate-800 text-[14px]">{ticket.name}</div>
                                <div className="text-[12px] text-slate-500">{formatCurrency(ticket.price)} / vé</div>
                              </div>
                              <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200 p-1">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(ticket.id, -1)}
                                  disabled={quantity <= 0}
                                  className="w-8 h-8 flex items-center justify-center rounded bg-white shadow-sm disabled:opacity-30 text-slate-600 hover:text-[#ff5b00] transition-colors"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-10 text-center font-bold text-[14px] text-slate-800">{quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(ticket.id, 1)}
                                  disabled={quantity >= ticket.maxQuantity}
                                  className="w-8 h-8 flex items-center justify-center rounded bg-white shadow-sm disabled:opacity-30 text-slate-600 hover:text-[#ff5b00] transition-colors"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <div className="flex items-end justify-between border-t border-slate-100 pt-4">
                              <div className="text-[12px] text-slate-500">Tạm tính</div>
                              <motion.div
                                key={quantity * ticket.price}
                                initial={{ scale: 1.05 }}
                                animate={{ scale: 1 }}
                                className="text-[20px] font-bold text-[#ff5b00]"
                              >
                                {formatCurrency(quantity * ticket.price)}
                              </motion.div>
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

          <aside className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 h-fit lg:sticky lg:top-24">
            <h4 className="font-bold text-[16px] text-slate-800 mb-4">Tóm tắt đặt vé</h4>
            <div className="rounded-lg border border-slate-200 p-3 mb-4">
              <div className="text-[11px] font-bold text-slate-500 uppercase mb-1">Ngày sử dụng</div>
              <div className="font-semibold text-slate-800 text-[14px]">{formatDate(selectedDate)}</div>
            </div>

            {selectedTickets.length > 0 ? (
              <div className="space-y-3 mb-5">
                {selectedTickets.map(ticket => (
                  <div key={ticket.id} className="flex justify-between gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    <div>
                      <div className="font-semibold text-slate-800 text-[13px]">{ticket.name}</div>
                      <div className="text-[12px] text-slate-500">{quantities[ticket.id]} x {formatCurrency(ticket.price)}</div>
                    </div>
                    <div className="font-bold text-slate-800 text-[13px]">{formatCurrency(quantities[ticket.id] * ticket.price)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[13px] text-slate-400 bg-slate-50 rounded-lg p-4 mb-5">
                Chưa chọn gói dịch vụ nào.
              </div>
            )}

            <div className="rounded-lg bg-orange-50 border border-orange-100 p-4 flex items-end justify-between mb-4">
              <div>
                <div className="text-[12px] font-bold text-orange-700 uppercase">Tổng cộng</div>
                <div className="text-[12px] text-slate-500 mt-1">{totalItems} vé</div>
              </div>
              <div className="text-[24px] leading-none font-bold text-[#ff5b00]">{formatCurrency(totalPrice)}</div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => addSelectedToCart(false)}
                disabled={totalItems === 0}
                className="w-full bg-[#ff5b00] hover:bg-[#e05000] disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold h-[46px] rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" /> Thêm vào giỏ hàng
              </button>
              <button
                type="button"
                onClick={() => addSelectedToCart(true)}
                disabled={totalItems === 0}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold h-[46px] rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <CreditCard className="w-4 h-4" /> Thanh toán ngay
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
