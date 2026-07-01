import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Calendar, Filter, MoreVertical, Eye, Download, X, 
  Map, Ticket, CheckCircle, Clock, XCircle, FileText, ChevronLeft, ChevronRight, User, Phone, Mail, ChevronDown
} from 'lucide-react';
import axiosClient from '../../api/axios';
import DateRangePicker from '../../components/admin/DateRangePicker';
import Toast, { ToastMessage, ToastType } from '../../components/admin/Toast';

const ORDER_STATUSES = [
  { value: 'all', label: 'Tất cả' },
  { value: 'pending', label: 'Chờ xác nhận', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  { value: 'paid', label: 'Đã thanh toán', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  { value: 'completed', label: 'Đã hoàn thành', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  { value: 'cancelled', label: 'Đã hủy', color: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
];

const moneyFormatter = new Intl.NumberFormat('vi-VN');

const formatMoney = (value: unknown) => {
  const amount = Number(value || 0);
  return `${moneyFormatter.format(Number.isFinite(amount) ? amount : 0)} đ`;
};

const formatDateTime = (value: string | null | undefined) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const time = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const datePart = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  return `${time} ${datePart}`;
};

const normalizeStatus = (status: string | undefined, paymentStatus: string | undefined) => {
  const normalized = String(status || paymentStatus || 'PENDING').toUpperCase();
  if (normalized === 'PAID') return 'paid';
  if (normalized === 'CONFIRMED' || normalized === 'COMPLETED') return 'completed';
  if (normalized === 'CANCELLED') return 'cancelled';
  return 'pending';
};

const mapOrder = (order: any) => {
  const items = Array.isArray(order.items) ? order.items : [];
  const firstItem = items[0] || {};
  const quantity = items.reduce((sum: number, item: any) => sum + Number(item?.quantity || 0), 0) || 1;
  const orderDate = formatDateTime(order.paid_at || order.created_at);

  return {
    id: order.order_code,
    bookingDate: orderDate,
    customer: {
      name: order.customer_name || '',
      phone: order.customer_phone || '',
      email: order.customer_email || '',
      avatarBg: 'bg-orange-100 text-[#ff5b00]',
    },
    product: {
      type: 'tour',
      name: firstItem.product_name || order.order_code,
      quantity,
    },
    useDate: firstItem.use_date || '-',
    price: formatMoney(order.total_amount),
    status: normalizeStatus(order.status, order.payment_status),
    paymentMethod: order.payment_method || 'SEPAY',
    source: order,
  };
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
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

  useEffect(() => {
    let mounted = true;
    const loadOrders = async () => {
      try {
        const res = await axiosClient.get('/orders?limit=200');
        if (!mounted) return;
        setOrders((res.data || []).map(mapOrder));
      } catch (error) {
        console.error('Failed to load orders:', error);
        if (mounted) setOrders([]);
      }
    };

    loadOrders();
    return () => {
      mounted = false;
    };
  }, []);

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

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    setSelectedOrder((prev: any) => prev && prev.id === orderId ? { ...prev, status: newStatus } : prev);

    try {
      await axiosClient.patch(`/orders/${orderId}/status`, {
        status: newStatus.toUpperCase(),
        payment_status: newStatus === 'paid' ? 'PAID' : undefined,
      });
    } catch (error) {
      console.error('Failed to update order status:', error);
      setToastMessage({
        title: 'Lỗi cập nhật',
        message: 'Không thể cập nhật trạng thái đơn hàng.'
      });
    }
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
                    {orders.length === 0
                      ? 'Chưa có dữ liệu đơn hàng.'
                      : 'Không tìm thấy đơn hàng nào phù hợp với bộ lọc.'}
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
