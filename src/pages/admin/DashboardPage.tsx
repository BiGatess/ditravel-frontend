import React, { useState, useEffect, useRef } from 'react';
import { Wallet, ShoppingBag, Ticket, CreditCard, ArrowRight, Calendar, ChevronDown, Map, TrendingUp } from 'lucide-react';
import StatCard from '../../components/admin/StatCard';
import DateRangePicker from '../../components/admin/DateRangePicker';
import Toast, { ToastMessage, ToastType } from '../../components/admin/Toast';
import { Link, useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null);
  
  const showToast = (title: string, message: string, type: ToastType = 'success') => {
    setToastMessage({ title, message, type });
  };
  
  const [chartFilter, setChartFilter] = useState('7days');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [customStart, setCustomStart] = useState<Date | null>(new Date(2026, 5, 1));
  const [customEnd, setCustomEnd] = useState<Date | null>(new Date(2026, 5, 14));
  
  const [orderFilter, setOrderFilter] = useState('Hôm nay');
  const [isOrderFilterOpen, setIsOrderFilterOpen] = useState(false);
  const [isOrderCalendarOpen, setIsOrderCalendarOpen] = useState(false);
  
  const [headerFilter, setHeaderFilter] = useState('Hôm nay');
  const [isHeaderFilterOpen, setIsHeaderFilterOpen] = useState(false);
  
  const filterRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const orderFilterRef = useRef<HTMLDivElement>(null);
  const orderCalendarRef = useRef<HTMLDivElement>(null);
  const headerFilterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerFilterRef.current && !headerFilterRef.current.contains(event.target as Node)) {
        setIsHeaderFilterOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
      if (orderFilterRef.current && !orderFilterRef.current.contains(event.target as Node)) {
        setIsOrderFilterOpen(false);
      }
      if (orderCalendarRef.current && !orderCalendarRef.current.contains(event.target as Node)) {
        setIsOrderCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (d: Date | null) => {
    if (!d) return '';
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  const filterOptions = [
    { value: '7days', label: '7 ngày qua' },
    { value: 'month', label: 'Tháng này (1 - 30)' }
  ];

  // Dynamic Chart Data based on Filter
  let chartData: any[] = [];

  return (
    <div className="p-6">
      <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tổng quan hệ thống</h1>
          <p className="text-slate-500 text-[14px] mt-1">Xin chào Admin, đây là tình hình kinh doanh hôm nay.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative" ref={headerFilterRef}>
            <button 
              onClick={() => setIsHeaderFilterOpen(!isHeaderFilterOpen)}
              className={`flex items-center justify-between w-[130px] bg-white border border-slate-200 text-slate-700 text-[13px] px-4 py-2 outline-none transition-colors ${isHeaderFilterOpen ? 'rounded-t-lg' : 'rounded-lg hover:border-slate-300'}`}
            >
              <span className="font-medium">{headerFilter}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isHeaderFilterOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isHeaderFilterOpen && (
              <div className="absolute top-full left-0 w-full bg-white border border-t-0 border-slate-200 rounded-b-lg shadow-lg py-1 z-50">
                {['Hôm nay', 'Tuần này', 'Tháng này']
                  .filter(opt => opt !== headerFilter)
                  .map(opt => (
                  <button
                    key={opt}
                    onClick={() => {
                      setHeaderFilter(opt);
                      setIsHeaderFilterOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-[13px] text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button 
            onClick={() => showToast('Đang phát triển', 'Tính năng xuất báo cáo đang được phát triển.')}
            className="bg-[#ff5b00] hover:bg-[#e05000] text-white text-[13px] font-bold px-4 py-2 rounded-lg transition-colors"
          >
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard 
          title="Tổng Doanh Thu" 
          value="0 đ" 
          icon={<Wallet className="w-6 h-6" fill="currentColor" fillOpacity={0.2} strokeWidth={2} />} 
          colorClass="bg-green-100 text-green-600"
          trend={{ value: "0%", isPositive: true }}
          chartData={[]}
          chartColor="#16a34a"
        />
        <StatCard 
          title="Đơn hàng mới" 
          value="0" 
          icon={<ShoppingBag className="w-6 h-6" fill="currentColor" fillOpacity={0.2} strokeWidth={2} />} 
          colorClass="bg-blue-100 text-blue-600"
          trend={{ value: "0%", isPositive: true }}
          chartData={[]}
          chartColor="#2563eb"
        />
        <StatCard 
          title="Vé Sun World đã bán" 
          value="0" 
          icon={<Ticket className="w-6 h-6" fill="currentColor" fillOpacity={0.2} strokeWidth={2} />} 
          colorClass="bg-orange-100 text-[#ff5b00]"
          trend={{ value: "0%", isPositive: true }}
          chartData={[]}
          chartColor="#ff5b00"
        />
        <StatCard 
          title="Đơn chờ xử lý" 
          value="0" 
          icon={<CreditCard className="w-6 h-6" fill="currentColor" fillOpacity={0.2} strokeWidth={2} />} 
          colorClass="bg-purple-100 text-purple-600"
          chartData={[]}
          chartColor="#9333ea"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6 p-5">
        <div className="flex justify-between items-center mb-6 relative z-30">
          <h2 className="font-bold text-slate-800">Biểu đồ Doanh thu</h2>
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center bg-white border border-slate-200 rounded-md p-1 shadow-sm transition-all duration-300">
                <div className="relative" ref={calendarRef}>
                  <button 
                    onClick={() => { setIsCalendarOpen(!isCalendarOpen); setIsFilterOpen(false); }}
                    className={`p-1.5 rounded transition-colors flex items-center justify-center ${isCalendarOpen || chartFilter === 'custom' ? 'bg-orange-50 text-[#ff5b00]' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                  >
                    <Calendar className="w-4 h-4 shrink-0" />
                  </button>
                  
                  {isCalendarOpen && (
                    <div className="absolute top-full mt-2 right-0 z-50">
                      <DateRangePicker 
                        startDate={customStart}
                        endDate={customEnd}
                        onApply={(start, end) => {
                          setCustomStart(start);
                          setCustomEnd(end);
                          setChartFilter('custom');
                          setIsCalendarOpen(false);
                        }}
                        onClose={() => setIsCalendarOpen(false)}
                      />
                    </div>
                  )}
                </div>

                <div className="w-px h-4 bg-slate-200 mx-1"></div>

                <div className="relative" ref={filterRef}>
                  <button 
                    onClick={() => { setIsFilterOpen(!isFilterOpen); setIsCalendarOpen(false); }}
                    className="flex items-center gap-1.5 bg-transparent px-2 py-1 text-[12px] font-medium text-slate-600 hover:bg-slate-50 outline-none cursor-pointer shrink-0 rounded transition-colors"
                  >
                    <span>
                      {chartFilter === 'custom' 
                        ? `${customStart ? formatDate(customStart) : ''} - ${customEnd ? formatDate(customEnd) : ''}` 
                        : filterOptions.find(o => o.value === chartFilter)?.label}
                    </span>
                    <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isFilterOpen && (
                    <div className="absolute top-full mt-2 right-0 w-[140px] bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-50 animate-in fade-in zoom-in-95">
                      {filterOptions.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setChartFilter(opt.value);
                            setIsFilterOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-[12px] transition-colors ${chartFilter === opt.value ? 'bg-orange-50 text-[#ff5b00] font-bold' : 'text-slate-600 hover:bg-slate-50 font-medium'}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
             </div>
             <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-[#ff5b00]"></span>
               <span className="text-[12px] text-slate-500">Doanh thu (VNĐ)</span>
             </div>
          </div>
        </div>
        
        <div className="h-[250px] w-full flex items-end justify-around gap-1 sm:gap-2 pt-6 relative border-b border-slate-100 pb-2 px-2 sm:px-8">
          {/* Y-axis guidelines */}
          <div className="absolute left-0 top-0 w-full h-full flex flex-col justify-between pb-8 pointer-events-none">
            {[150, 100, 50, 0].map((val, i) => (
              <div key={i} className="flex items-center w-full">
                <span className="text-[11px] text-slate-400 w-8">{val}M</span>
                <div className="flex-1 border-t border-slate-100 border-dashed"></div>
              </div>
            ))}
          </div>

          {chartData.map((item, i) => (
            <div key={i} className="flex flex-col items-center flex-1 group relative z-10 h-full justify-end">
              {/* Permanent label */}
              <div className={`font-bold text-[#ff5b00] mb-1.5 whitespace-nowrap z-20 transition-all ${chartData.length > 15 ? 'text-[9px] -rotate-45 mb-3 sm:rotate-0 sm:mb-1.5 sm:text-[10px]' : 'text-[12px]'}`}>
                {item.value}M
              </div>
              
              {/* Full value tooltip on hover (optional enhancement) */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-800 text-white shadow-md px-2 py-1 rounded text-[11px] whitespace-nowrap z-30 pointer-events-none">
                {item.label}
              </div>

              {/* Chart Bar */}
              <div 
                className="w-full max-w-[48px] bg-gradient-to-t from-[#ff5b00]/60 to-[#ff5b00] hover:from-[#ff5b00] hover:to-[#e65200] rounded-t-lg transition-all duration-300 relative overflow-hidden shadow-sm" 
                style={{ height: `${(item.value / 150) * 100}%` }}
              >
              </div>
              <div className={`font-medium text-slate-500 mt-2 ${chartData.length > 15 ? 'text-[9px] sm:text-[10px]' : 'text-[12px]'}`}>
                {item.day}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Recent Orders List */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              Đơn hàng gần đây
            </h2>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center bg-white border border-slate-200 rounded-md p-1 shadow-sm transition-all duration-300">
                <div className="relative" ref={orderCalendarRef}>
                  <button 
                    onClick={() => { setIsOrderCalendarOpen(!isOrderCalendarOpen); setIsOrderFilterOpen(false); }}
                    className={`p-1.5 flex items-center justify-center shrink-0 rounded transition-colors ${isOrderCalendarOpen ? 'bg-orange-50 text-[#ff5b00]' : 'hover:bg-slate-50 text-slate-400'}`}
                  >
                    <Calendar className={`w-3.5 h-3.5 ${isOrderCalendarOpen ? 'text-[#ff5b00]' : 'text-[#ff5b00]'}`} />
                  </button>
                  
                  {isOrderCalendarOpen && (
                    <div className="absolute top-full mt-2 right-0 z-50">
                      <DateRangePicker 
                        startDate={null}
                        endDate={null}
                        singleDate={true}
                        onApply={(start) => {
                          if (start) {
                            setOrderFilter(`${start.getDate()}/${start.getMonth() + 1}/${start.getFullYear()}`);
                            setIsOrderCalendarOpen(false);
                          }
                        }}
                        onClose={() => setIsOrderCalendarOpen(false)}
                      />
                    </div>
                  )}
                </div>
                
                <div className="w-px h-4 bg-slate-200 mx-0.5"></div>
                
                <div className="relative" ref={orderFilterRef}>
                  <button 
                    onClick={() => setIsOrderFilterOpen(!isOrderFilterOpen)}
                    className="flex items-center gap-1.5 bg-transparent px-2 py-1 text-[12px] font-medium text-slate-600 hover:bg-slate-50 outline-none cursor-pointer shrink-0 rounded transition-colors"
                  >
                    <span>{orderFilter}</span>
                    <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOrderFilterOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isOrderFilterOpen && (
                    <div className="absolute top-full mt-2 right-0 w-[120px] bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-50 animate-in fade-in zoom-in-95">
                      {['Hôm nay', 'Hôm qua', '7 ngày qua'].map(opt => (
                        <button
                          key={opt}
                          onClick={() => {
                            setOrderFilter(opt);
                            setIsOrderFilterOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-[12px] transition-colors ${orderFilter === opt ? 'bg-orange-50 text-[#ff5b00] font-bold' : 'text-slate-600 hover:bg-slate-50 font-medium'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <Link to="/admin/orders" className="text-[12px] font-semibold text-[#0084ff] hover:text-[#0066cc] flex items-center gap-1 transition-colors">
                Xem tất cả <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-[13px] text-left whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 text-[12px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4 font-bold">Mã ĐH</th>
                  <th className="py-2.5 px-4 font-bold">Thời gian</th>
                  <th className="py-2.5 px-4 font-bold">Khách hàng</th>
                  <th className="py-2.5 px-4 font-bold">Sản phẩm</th>
                  <th className="py-2.5 px-4 font-bold">Tổng tiền</th>
                  <th className="py-2.5 px-4 font-bold text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {([] as any[]).map((order, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors group">
                    <td 
                      className="py-3.5 px-4 font-bold text-[#0084ff] hover:text-[#0066cc] hover:underline transition-colors cursor-pointer"
                      onClick={() => navigate('/admin/orders')}
                    >
                      {order.id}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-medium">{order.time}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${order.initialBg}`}>
                          {order.name.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-700">{order.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                          {order.type === 'tour' ? <Map className="w-3.5 h-3.5" /> : <Ticket className="w-3.5 h-3.5" />}
                        </div>
                        <div className="max-w-[180px] truncate font-medium text-slate-600">{order.product}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{order.price}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${order.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${order.dotColor}`}></span>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h2 className="font-bold text-slate-800">Top bán chạy</h2>
            <span className="text-[11px] text-slate-500 font-medium px-2 py-0.5 bg-slate-200 rounded">Tháng này</span>
          </div>
          <div className="p-4 space-y-4 flex-1">
            {([] as any[]).map((product, i) => (
              <div key={i} className="flex gap-3 items-center p-2.5 -mx-2.5 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
                <div className="w-6 text-center font-bold text-slate-400 text-[14px]">
                  {i + 1}.
                </div>
                <div className={`w-11 h-11 rounded-xl shadow-sm overflow-hidden shrink-0 border border-slate-100 flex items-center justify-center ${product.bgColor}`}>
                  <product.icon className={`w-5 h-5 ${product.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[13px] font-bold text-slate-700 truncate group-hover:text-[#ff5b00] transition-colors">{product.name}</h4>
                  <div className="flex items-center gap-3 mt-1">
                     <span className="text-[11.5px] text-slate-600 font-medium flex items-center gap-1.5">
                        <ShoppingBag className="w-3 h-3 text-slate-400" />
                        {product.sales} lượt đặt
                     </span>
                     <span className="text-[11px] text-emerald-500 font-bold flex items-center gap-0.5 bg-emerald-50 px-1.5 rounded">
                        <TrendingUp className="w-3 h-3" /> {product.trend}
                     </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-slate-100 text-center bg-slate-50/50">
             <Link to="/admin/products" className="text-[12px] font-semibold text-slate-500 hover:text-[#ff5b00] transition-colors">
               Xem tất cả sản phẩm
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
