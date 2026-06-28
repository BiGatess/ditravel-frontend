import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Calendar, Filter, MoreVertical, Eye, Download, X, 
  Map, Ticket, CheckCircle, Clock, XCircle, FileText, ChevronLeft, ChevronRight, User, Phone, Mail, ChevronDown
} from 'lucide-react';
import DateRangePicker from '../../components/admin/DateRangePicker';
import Toast, { ToastMessage, ToastType } from '../../components/admin/Toast';

// --- MOCK DATA ---
const ORDER_STATUSES = [
  { value: 'all', label: 'Tất cả' },
  { value: 'pending', label: 'Chờ xác nhận', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  { value: 'paid', label: 'Đã thanh toán', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  { value: 'completed', label: 'Đã hoàn thành', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  { value: 'cancelled', label: 'Đã hủy', color: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
];

const INITIAL_ORDERS = [
  { id: '#DV89321', bookingDate: '10:24 22/06/2026', useDate: '25/06/2026', customer: { name: 'Nguyễn Văn Anh', email: 'vananh@gmail.com', phone: '0901234567', avatarBg: 'bg-blue-100 text-blue-700' }, product: { name: 'Vé Cáp Treo Bà Nà Hills', type: 'ticket', quantity: 2 }, price: '1.800.000 đ', status: 'paid', paymentMethod: 'Chuyển khoản (Vietcombank)' },
  { id: '#DV89320', bookingDate: '09:15 22/06/2026', useDate: '22/06/2026', customer: { name: 'Trần Thị Bình', email: 'binhtt@yahoo.com', phone: '0912345678', avatarBg: 'bg-purple-100 text-purple-700' }, product: { name: 'Tour Sài Gòn 1 ngày', type: 'tour', quantity: 1 }, price: '750.000 đ', status: 'pending', paymentMethod: 'Chuyển khoản (Momo)' },
  { id: '#DV89319', bookingDate: '08:45 22/06/2026', useDate: '28/06/2026', customer: { name: 'Lê Hoàng Cường', email: 'cuong.le@gmail.com', phone: '0987654321', avatarBg: 'bg-orange-100 text-orange-700' }, product: { name: 'Combo Buffet Sun World', type: 'ticket', quantity: 4 }, price: '2.500.000 đ', status: 'completed', paymentMethod: 'Chuyển khoản (MB Bank)' },
  { id: '#DV89318', bookingDate: '16:30 20/06/2026', useDate: '23/06/2026', customer: { name: 'Phạm Dung', email: 'pham.dung@congty.vn', phone: '0933445566', avatarBg: 'bg-emerald-100 text-emerald-700' }, product: { name: 'Cáp treo Fansipan Sapa', type: 'ticket', quantity: 2 }, price: '1.600.000 đ', status: 'cancelled', paymentMethod: 'Chuyển khoản (Momo)' },
  { id: '#DV89317', bookingDate: '14:20 20/06/2026', useDate: '30/06/2026', customer: { name: 'Hoàng Thị Yến', email: 'yen.hoang@gmail.com', phone: '0944556677', avatarBg: 'bg-rose-100 text-rose-700' }, product: { name: 'VinWonders Phú Quốc', type: 'ticket', quantity: 3 }, price: '1.950.000 đ', status: 'paid', paymentMethod: 'Chuyển khoản (Techcombank)' },
  { id: '#DV89316', bookingDate: '11:10 20/06/2026', useDate: '21/06/2026', customer: { name: 'Vũ Đức Phát', email: 'phat.vu@gmail.com', phone: '0909887766', avatarBg: 'bg-indigo-100 text-indigo-700' }, product: { name: 'Tour Đảo Ngọc Phú Quốc', type: 'tour', quantity: 2 }, price: '2.100.000 đ', status: 'completed', paymentMethod: 'Chuyển khoản (Vietcombank)' },
  { id: '#DV89315', bookingDate: '09:05 20/06/2026', useDate: '24/06/2026', customer: { name: 'Ngô Tấn Tài', email: 'tai.ngo@gmail.com', phone: '0977665544', avatarBg: 'bg-cyan-100 text-cyan-700' }, product: { name: 'Vé Xem Show Ký Ức Hội An', type: 'ticket', quantity: 2 }, price: '1.200.000 đ', status: 'paid', paymentMethod: 'Chuyển khoản (MB Bank)' },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Date range
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, startDate, endDate]);

  // Modal & Toast
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null);

  const handleUpdateSubmit = () => {
    if (selectedOrder) {
      setToastMessage({
        title: 'Cập nhật thành công',
        message: `Đơn hàng ${selectedOrder.id} đã được lưu lại.`
      });
      setSelectedOrder(null); // Close the modal
      
      // Auto hide after 3s
      setTimeout(() => {
        setToastMessage(null);
      }, 3000);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date: Date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const getStatusConfig = (statusValue: string) => {
    return ORDER_STATUSES.find(s => s.value === statusValue) || ORDER_STATUSES[0];
  };

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    setSelectedOrder((prev: any) => prev && prev.id === orderId ? { ...prev, status: newStatus } : prev);
  };

  // Base filtered orders (excluding tab filter)
  const baseFilteredOrders = orders.filter(order => {
    // Date filter
    let matchesDate = true;
    if (startDate) {
      const dateParts = order.bookingDate.split(' ')[1].split('/');
      const orderDate = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]));
      const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      
      if (endDate) {
        const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
        matchesDate = orderDate >= start && orderDate <= end;
      } else {
        matchesDate = orderDate.getTime() === start.getTime();
      }
    }

    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.phone.includes(searchQuery);
      
    return matchesSearch && matchesDate;
  });

  // Filter orders based on active tab
  const filteredOrders = baseFilteredOrders.filter(order => {
    return activeTab === 'all' || order.status === activeTab;
  });

  const getTabCount = (tabId: string) => {
    if (tabId === 'all') return baseFilteredOrders.length;
    return baseFilteredOrders.filter(o => o.status === tabId).length;
  };

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredOrders.length);
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  return (
    <div className="p-6 h-full flex flex-col bg-slate-50 relative">
      
      {/* Toast Notification */}
      <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Toast Notification */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-slate-800">Quản lý Đơn hàng</h1>
          <p className="text-[13px] text-slate-500 mt-1">Quản lý, theo dõi và cập nhật trạng thái các đơn đặt chỗ.</p>
        </div>
        <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2 px-4 rounded-lg text-[13px] flex items-center gap-2 shadow-sm transition-colors">
          <Download className="w-4 h-4" /> Xuất Excel
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col">
        {/* Tabs */}
        <div className="flex px-6 border-b border-slate-200 overflow-x-auto">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'pending', label: 'Chờ xác nhận' },
            { id: 'paid', label: 'Đã thanh toán' },
            { id: 'completed', label: 'Đã hoàn thành' },
            { id: 'cancelled', label: 'Đã hủy' }
          ].map(tab => {
            const count = getTabCount(tab.id);
            return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedOrder(null);
              }}
              className={`px-4 py-4 text-[14px] font-bold border-b-2 transition-colors relative flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-[#ff5b00] text-[#ff5b00]' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                activeTab === tab.id 
                  ? 'bg-orange-100 text-[#ff5b00]' 
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {count}
              </span>
            </button>
          )})}
        </div>
        
        <div className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-[350px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm theo mã đơn, tên khách, SĐT..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00] rounded-lg text-[13px] outline-none transition-all"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative" ref={calendarRef}>
              <button 
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-[13px] font-medium transition-colors ${isCalendarOpen || startDate ? 'bg-orange-50 border-orange-200 text-[#ff5b00]' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                <Calendar className="w-4 h-4" />
                {startDate && endDate 
                  ? (startDate.getTime() === endDate.getTime() 
                      ? formatDate(startDate) 
                      : `${formatDate(startDate)} - ${formatDate(endDate)}`) 
                  : startDate 
                    ? formatDate(startDate) 
                    : 'Lọc theo ngày'}
              </button>
              
              {isCalendarOpen && (
                <div className="absolute top-full mt-2 right-0 z-50">
                  <DateRangePicker 
                    startDate={startDate}
                    endDate={endDate}
                    onApply={(start, end) => {
                      setStartDate(start);
                      setEndDate(end);
                      setIsCalendarOpen(false);
                    }}
                    onClose={() => setIsCalendarOpen(false)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-[13px] text-left whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-[12px] uppercase tracking-wider sticky top-0 z-10">
              <tr>
                <th className="py-3.5 px-5 font-bold w-[60px] text-center">STT</th>
                <th className="py-3.5 px-5 font-bold">Mã ĐH / Thời gian</th>
                <th className="py-3.5 px-5 font-bold">Khách hàng</th>
                <th className="py-3.5 px-5 font-bold">Dịch vụ</th>
                <th className="py-3.5 px-5 font-bold">Tổng tiền</th>
                <th className="py-3.5 px-5 font-bold">Trạng thái</th>
                <th className="py-3.5 px-5 font-bold text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {currentOrders.length > 0 ? currentOrders.map((order, i) => {
                const statusConf = getStatusConfig(order.status);
                return (
                  <tr key={i} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-3.5 px-5 text-center text-slate-500 font-medium">{i + 1}</td>
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-slate-800 cursor-pointer hover:text-[#ff5b00] transition-colors mb-0.5" onClick={() => setSelectedOrder(order)}>{order.id}</div>
                      <div className="text-[12px] text-slate-500">{order.bookingDate}</div>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 ${order.customer.avatarBg}`}>
                          {order.customer.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 mb-0.5">{order.customer.name}</div>
                          <div className="text-[12px] text-slate-500 flex items-center gap-1.5">
                            <Phone className="w-3 h-3" /> {order.customer.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                          {order.product.type === 'tour' ? <Map className="w-4 h-4" /> : <Ticket className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-bold text-slate-700 max-w-[200px] truncate mb-0.5" title={order.product.name}>{order.product.name}</div>
                          <div className="text-[12px] text-slate-500 flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" /> SD: {order.useDate} <span className="mx-1">•</span> SL: {order.product.quantity}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-[#ff5b00]">{order.price}</div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusConf.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusConf.dot}`}></span>
                        {statusConf.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 text-slate-400 hover:text-[#0084ff] hover:bg-blue-50 rounded transition-colors inline-flex"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    Không tìm thấy đơn hàng nào phù hợp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="border-t border-slate-200 px-5 py-3 flex items-center justify-between bg-slate-50">
          <div className="text-[12px] text-slate-500 font-medium">
            Đang hiển thị <span className="font-bold text-slate-800">{filteredOrders.length === 0 ? 0 : startIndex + 1} - {endIndex}</span>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 border border-slate-200 rounded text-slate-600 hover:bg-white transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-7 h-7 flex items-center justify-center rounded text-[12px] font-bold shadow-sm transition-colors ${currentPage === idx + 1 ? 'bg-[#ff5b00] text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                {idx + 1}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1 border border-slate-200 rounded text-slate-600 hover:bg-white transition-colors disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* --- ORDER DETAILS SLIDE-OVER MODAL --- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity animate-in fade-in" 
            onClick={() => setSelectedOrder(null)}
          ></div>
          
          {/* Panel */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h2 className="text-[18px] font-bold text-slate-800 flex items-center gap-2">
                  Chi tiết đơn hàng {selectedOrder.id}
                </h2>
                <p className="text-[12px] text-slate-500 mt-0.5">Đặt lúc {selectedOrder.bookingDate}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Status Banner with Custom Interactive Status Changer */}
              <div className={`p-5 rounded-xl border flex flex-col gap-4 ${getStatusConfig(selectedOrder.status).color}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-[14px]">
                    Trạng thái:
                  </div>
                  <span className="text-[18px] font-black">{selectedOrder.price}</span>
                </div>
                
                <div className="relative w-full" ref={statusDropdownRef}>
                  <button 
                    onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                    className="w-full flex items-center justify-between font-bold text-[14px] px-4 py-3 rounded-lg border bg-white cursor-pointer shadow-sm transition-all hover:bg-slate-50 text-slate-800"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${getStatusConfig(selectedOrder.status).dot}`}></span>
                      {getStatusConfig(selectedOrder.status).label}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isStatusDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                      {ORDER_STATUSES.filter(s => s.value !== 'all').map(status => (
                        <button
                          key={status.value}
                          onClick={() => {
                            handleUpdateStatus(selectedOrder.id, status.value);
                            setIsStatusDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-[13px] font-bold hover:bg-slate-50 flex items-center gap-3 transition-colors border-b last:border-0 border-slate-50 ${selectedOrder.status === status.value ? 'bg-slate-50 text-[#0084ff]' : 'text-slate-700'}`}
                        >
                          <span className={`w-2.5 h-2.5 rounded-full ${status.dot}`}></span>
                          {status.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {selectedOrder.status === 'pending' && (
                  <p className="text-[12px] opacity-90 mt-1">Khách hàng chưa thanh toán. Vui lòng liên hệ hỗ trợ.</p>
                )}
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-3">Thông tin Khách hàng</h3>
                <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold shrink-0 ${selectedOrder.customer.avatarBg}`}>
                      {selectedOrder.customer.name.charAt(0)}
                    </div>
                      <div>
                        <div className="font-bold text-slate-800">{selectedOrder.customer.name}</div>
                      </div>
                  </div>
                  <div className="flex items-center gap-3 text-[13px]">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-700">{selectedOrder.customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[13px]">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-700">{selectedOrder.customer.email}</span>
                  </div>
                </div>
              </div>

              {/* Service Info */}
              <div>
                <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-3">Thông tin Dịch vụ</h3>
                <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                  <div className="flex gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                      {selectedOrder.product.type === 'tour' ? <Map className="w-5 h-5" /> : <Ticket className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-[14px] mb-1">{selectedOrder.product.name}</div>
                      <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-[11px] font-bold uppercase rounded">
                        {selectedOrder.product.type === 'tour' ? 'Tour du lịch' : 'Vé tham quan'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    <div className="flex justify-between text-[13px]">
                      <span className="text-slate-500">Ngày sử dụng:</span>
                      <span className="font-bold text-slate-800">{selectedOrder.useDate}</span>
                    </div>
                    <div className="flex justify-between text-[13px]">
                      <span className="text-slate-500">Số lượng:</span>
                      <span className="font-bold text-slate-800">{selectedOrder.product.quantity} vé</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div>
                <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-3">Thanh toán</h3>
                <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-2 text-[13px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Phương thức:</span>
                    <span className="font-medium text-slate-800">{selectedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tạm tính:</span>
                    <span className="font-medium text-slate-800">{selectedOrder.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Khuyến mãi:</span>
                    <span className="font-medium text-[#4caf50]">0 đ</span>
                  </div>
                  <div className="border-t border-dashed border-slate-200 pt-2 mt-2 flex justify-between items-center">
                    <span className="font-bold text-slate-800">Tổng cộng:</span>
                    <span className="font-black text-[18px] text-[#ff5b00]">{selectedOrder.price}</span>
                  </div>
                </div>
              </div>

            </div>
            
            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-slate-200 bg-white grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[13px] transition-colors">
                <FileText className="w-4 h-4" /> In biên lai
              </button>
              <button 
                onClick={handleUpdateSubmit}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0084ff] hover:bg-[#0066cc] text-white font-bold rounded-lg text-[13px] shadow-sm transition-colors"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
