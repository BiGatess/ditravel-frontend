import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  AlertTriangle, Filter, Save, RefreshCcw
} from 'lucide-react';
import Toast, { ToastMessage } from '../../components/admin/Toast';
import axiosClient from '../../api/axios';
import { formatVndInput, formatVndInputValue, parseVndInput } from '../../utils/currency';

type PricingStatus = 'OPEN' | 'FULL' | 'CLOSED';

interface PricingRecord {
  id?: string;
  productId: string;
  optionId: string;
  date: string; // YYYY-MM-DD
  price: number;
  originalPrice: number | null;
  stock: number;
  status: PricingStatus;
  note?: string;
}

// Utilities
const formatCurrency = (amount: number) => {
  return formatVndInputValue(amount);
};

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  let day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
};

// Custom Dropdown Component
const CustomDropdown = ({ label, value, options, onChange, placeholder }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((o: any) => o.id === value);

  return (
    <div className="relative" ref={dropdownRef}>
      {label && <label className="block text-[12px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full sm:w-[240px] flex items-center justify-between border border-slate-300 bg-white rounded-lg px-4 py-2.5 text-[14px] font-medium text-slate-700 outline-none hover:border-slate-400 focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00] transition-colors"
      >
        <span className={`truncate ${!selectedOption ? 'text-slate-400' : ''}`}>
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-90' : 'rotate-0'}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-full min-w-[240px] bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 max-h-[300px] overflow-y-auto">
          {options.map((opt: any) => (
            <button
              key={opt.id}
              onClick={() => { onChange(opt.id); setIsOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors ${value === opt.id ? 'bg-blue-50/50 text-[#0084ff] font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
            >
              {opt.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function PricingPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  
  const [pricingData, setPricingData] = useState<Record<string, PricingRecord>>({});
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  
  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Bulk Selection State
  const [bulkFromDate, setBulkFromDate] = useState('');
  const [bulkToDate, setBulkToDate] = useState('');

  // Form State
  const [formStatus, setFormStatus] = useState<PricingStatus>('OPEN');
  const [formPrice, setFormPrice] = useState('');
  const [formOriginalPrice, setFormOriginalPrice] = useState('');
  const [formStock, setFormStock] = useState('100');
  const [formNote, setFormNote] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const productOptions = useMemo(
    () => products.map(product => ({ id: product.id, name: product.title })),
    [products]
  );

  const ticketOptionsByProduct = useMemo(() => {
    return products.reduce((acc: Record<string, { id: string; name: string }[]>, product) => {
      acc[product.id] = (product.ticket_types || [])
        .filter((ticket: any) => ticket.is_active !== false)
        .map((ticket: any) => ({ id: ticket.id, name: ticket.name }));
      return acc;
    }, {});
  }, [products]);

  const selectedTicketOptions = selectedProduct ? (ticketOptionsByProduct[selectedProduct] || []) : [];

  const fetchProducts = useCallback(async () => {
    const res = await axiosClient.get('/products/');
    const activeProducts = (res.data || []).filter((product: any) => product.is_active !== false);
    setProducts(activeProducts);
  }, []);

  useEffect(() => {
    fetchProducts().catch(() => {
      setToastMessage({ title: 'Lỗi tải dữ liệu', message: 'Không thể tải danh sách sản phẩm.', type: 'error' });
    });
  }, [fetchProducts]);

  useEffect(() => {
    if (!products.length) {
      setSelectedProduct('');
      setSelectedOption('');
      return;
    }
    if (!products.some(product => product.id === selectedProduct)) {
      setSelectedProduct(products[0].id);
    }
  }, [products, selectedProduct]);

  useEffect(() => {
    const options = selectedProduct ? (ticketOptionsByProduct[selectedProduct] || []) : [];
    if (!options.length) {
      setSelectedOption('');
      return;
    }
    if (!options.some(option => option.id === selectedOption)) {
      setSelectedOption(options[0].id);
    }
  }, [selectedProduct, selectedOption, ticketOptionsByProduct]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDates(new Set());
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDates(new Set());
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await fetchProducts();
      await loadPricing();
      setToastMessage({
        title: 'Làm mới thành công',
        message: 'Dữ liệu lịch & giá đã được cập nhật.'
      });
    } catch (error) {
      setToastMessage({
        title: 'Lỗi làm mới',
        message: 'Không thể tải lại dữ liệu lịch & giá.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const weeks = [];
  let days = [];
  
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
    if (days.length === 7) {
      weeks.push(days);
      days = [];
    }
  }
  
  if (days.length > 0) {
    while (days.length < 7) {
      days.push(null);
    }
    weeks.push(days);
  }

  const getDateStr = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getRecordKey = (dateStr: string) => {
    return `${selectedProduct}_${selectedOption}_${dateStr}`;
  };

  const loadPricing = useCallback(async () => {
    if (!selectedProduct || !selectedOption) {
      setPricingData({});
      return;
    }

    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;
    const res = await axiosClient.get('/pricing/', {
      params: {
        product_id: selectedProduct,
        ticket_type_id: selectedOption,
        start_date: startDate,
        end_date: endDate,
      },
    });

    const nextData = (res.data || []).reduce((acc: Record<string, PricingRecord>, record: any) => {
      acc[`${record.product_id}_${record.ticket_type_id}_${record.date}`] = {
        id: record.id,
        productId: record.product_id,
        optionId: record.ticket_type_id,
        date: record.date,
        price: parseVndInput(record.price),
        originalPrice: record.original_price ? parseVndInput(record.original_price) : null,
        stock: Number(record.stock || 0),
        status: record.status,
        note: record.note || '',
      };
      return acc;
    }, {});

    setPricingData(nextData);
  }, [selectedProduct, selectedOption, year, month, daysInMonth]);

  useEffect(() => {
    if (!selectedProduct || !selectedOption) {
      setPricingData({});
      return;
    }

    setIsLoading(true);
    loadPricing()
      .catch(() => {
        setToastMessage({
          title: 'Lỗi tải lịch giá',
          message: 'Không thể tải dữ liệu lịch & giá cho gói đã chọn.',
          type: 'error',
        });
      })
      .finally(() => setIsLoading(false));
  }, [loadPricing, selectedProduct, selectedOption]);

  const handleDateClick = (day: number) => {
    if (!selectedProduct || !selectedOption) return;
    
    const dateStr = getDateStr(day);
    const newSelection = new Set(selectedDates);
    
    if (newSelection.has(dateStr)) {
      newSelection.delete(dateStr);
    } else {
      newSelection.add(dateStr);
    }
    
    setSelectedDates(newSelection);
    setErrors({});
    
    if (newSelection.size === 1) {
      const selectedArr = Array.from(newSelection);
      const record = pricingData[getRecordKey(selectedArr[0] as string)];
      if (record) {
        setFormPrice(formatVndInputValue(record.price));
        setFormOriginalPrice(record.originalPrice ? formatVndInputValue(record.originalPrice) : '');
        setFormStock(record.stock.toString());
        setFormStatus(record.status);
        setFormNote(record.note || '');
      } else {
        resetForm();
      }
    }
  };

  const resetForm = () => {
    setFormPrice('');
    setFormOriginalPrice('');
    setFormStock('100');
    setFormStatus('OPEN');
    setFormNote('');
    setErrors({});
  };

  const handleClearSelection = () => {
    setSelectedDates(new Set());
    resetForm();
    setBulkFromDate('');
    setBulkToDate('');
  };

  const handleBulkSelect = () => {
    if (!bulkFromDate || !bulkToDate) return;
    
    const start = new Date(bulkFromDate);
    const end = new Date(bulkToDate);
    
    if (start > end) {
      alert("Ngày bắt đầu không được lớn hơn ngày kết thúc");
      return;
    }
    
    const newSelection = new Set(selectedDates);
    let curr = new Date(start);
    while (curr <= end) {
      const cy = curr.getFullYear();
      const cm = curr.getMonth();
      const cd = curr.getDate();
      const dateStr = `${cy}-${String(cm + 1).padStart(2, '0')}-${String(cd).padStart(2, '0')}`;
      newSelection.add(dateStr);
      curr.setDate(curr.getDate() + 1);
    }
    
    setSelectedDates(newSelection);
    setBulkFromDate('');
    setBulkToDate('');
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    setter(formatVndInput(e.target.value));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDates.size === 0) return;

    const newErrors: Record<string, string> = {};
    const priceNum = parseVndInput(formPrice);
    const originalPriceNum = formOriginalPrice ? parseVndInput(formOriginalPrice) : null;
    const stockNum = parseInt(formStock);

    if (formStatus === 'OPEN' && (!formPrice || isNaN(priceNum))) {
      newErrors.price = 'Vui lòng nhập giá bán';
    }
    if (!isNaN(priceNum) && priceNum < 0) {
      newErrors.price = 'Giá không hợp lệ';
    }
    if (originalPriceNum !== null && originalPriceNum < priceNum) {
      newErrors.originalPrice = 'Giá gốc phải lớn hơn hoặc bằng giá bán';
    }
    if (isNaN(stockNum) || stockNum < 0) {
      newErrors.stock = 'Số lượng không hợp lệ';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedCount = selectedDates.size;
    const records = Array.from(selectedDates).map(dateStr => ({
      product_id: selectedProduct,
      ticket_type_id: selectedOption,
      date: dateStr,
      price: formStatus === 'OPEN' ? priceNum : 0,
      original_price: formStatus === 'OPEN' && originalPriceNum ? originalPriceNum : null,
      stock: formStatus === 'FULL' ? 0 : stockNum,
      status: formStatus,
      note: formNote.trim() || null,
    }));

    setIsLoading(true);
    try {
      await axiosClient.post('/pricing/bulk', { records });
      await loadPricing();
      setErrors({});
      setSelectedDates(new Set());
      resetForm();
      setToastMessage({
        title: 'Cập nhật thành công',
        message: `Đã lưu cài đặt giá cho ${selectedCount} ngày.`
      });
    } catch (error: any) {
      setToastMessage({
        title: 'Lỗi lưu lịch giá',
        message: error.response?.data?.detail || 'Không thể lưu lịch giá. Vui lòng thử lại.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    const recordsToDelete = Array.from(selectedDates)
      .map(dateStr => pricingData[getRecordKey(dateStr)])
      .filter((record): record is PricingRecord => Boolean(record?.id));

    if (recordsToDelete.length === 0) {
      setToastMessage({
        title: 'Chưa có lịch giá',
        message: 'Các ngày đang chọn chưa có lịch giá để xóa.',
        type: 'error',
      });
      return;
    }

    setIsLoading(true);
    try {
      await Promise.all(recordsToDelete.map(record => axiosClient.delete(`/pricing/${record.id}`)));
      await loadPricing();
      setSelectedDates(new Set());
      resetForm();
      setToastMessage({
        title: 'Đã xóa lịch giá',
        message: `Đã xóa ${recordsToDelete.length} cấu hình lịch giá.`,
        type: 'delete',
      });
    } catch (error: any) {
      setToastMessage({
        title: 'Lỗi xóa lịch giá',
        message: error.response?.data?.detail || 'Không thể xóa lịch giá đã chọn.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColorInfo = (status: string) => {
    switch (status) {
      case 'OPEN': return { bg: 'bg-emerald-500', text: 'text-white', border: 'border-emerald-600', label: 'Mở bán' };
      case 'FULL': return { bg: 'bg-red-500', text: 'text-white', border: 'border-red-600', label: 'Hết chỗ' };
      case 'CLOSED': return { bg: 'bg-slate-500', text: 'text-white', border: 'border-slate-600', label: 'Đóng' };
      default: return { bg: 'bg-transparent', text: 'text-slate-400', border: 'border-dashed border-slate-200', label: 'Chưa cài đặt' };
    }
  };

  return (
    <div className="p-6 h-full flex flex-col bg-slate-50 relative">
      <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />

      <div className="mb-6">
        <h1 className="text-[24px] font-bold text-slate-800">Quản lý Lịch & Giá</h1>
        <p className="text-[13px] text-slate-500 mt-1">Cài đặt giá bán, số lượng chỗ và trạng thái theo từng ngày cụ thể.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 p-4 flex flex-col md:flex-row items-end justify-between gap-4 z-20 relative">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <CustomDropdown 
            label="Sản phẩm"
            value={selectedProduct}
            options={productOptions}
            onChange={setSelectedProduct}
            placeholder="Chọn sản phẩm"
          />
          
          {selectedProduct && selectedTicketOptions.length > 0 && (
            <CustomDropdown 
              label="Loại vé / Tùy chọn"
              value={selectedOption}
              options={selectedTicketOptions}
              onChange={setSelectedOption}
              placeholder="Chọn loại vé"
            />
          )}
        </div>
        <button 
          onClick={handleRefresh}
          disabled={isLoading}
          className={`p-2.5 border rounded-lg transition-colors flex items-center justify-center shrink-0 w-full md:w-auto ${isLoading ? 'text-[#0084ff] bg-blue-50 border-blue-200' : 'text-slate-500 border-slate-300 hover:text-[#0084ff] hover:bg-blue-50 hover:border-blue-300'}`}
          title="Làm mới dữ liệu"
        >
          <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {selectedProduct && selectedOption ? (
        <div className="flex flex-col xl:flex-row gap-6 flex-1 min-h-0">
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col min-h-[600px] xl:min-h-0 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <h2 className="text-[18px] font-bold text-slate-800 flex items-center gap-2">
                  Tháng {month + 1}, {year}
                </h2>
                <div className="flex items-center bg-slate-100 rounded-lg p-1">
                  <button onClick={handlePrevMonth} className="p-1.5 text-slate-500 hover:bg-white hover:shadow-sm rounded-md transition-all">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={handleToday} className="px-3 py-1 text-[12px] font-bold text-slate-600 hover:bg-white hover:shadow-sm rounded-md transition-all">
                    Hôm nay
                  </button>
                  <button onClick={handleNextMonth} className="p-1.5 text-slate-500 hover:bg-white hover:shadow-sm rounded-md transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-[12px] font-medium">
                <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Mở bán</span>
                <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Hết chỗ</span>
                <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span> Đóng</span>
              </div>
            </div>

            <div className="flex flex-col flex-1 overflow-auto bg-slate-50/50 p-4">
              <div className="min-w-[800px] bg-white border border-slate-200 rounded-xl overflow-hidden shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-[12px] font-bold text-slate-500 text-center">
                  {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'].map(d => (
                    <div key={d} className="py-3 border-r border-slate-200 last:border-r-0">{d}</div>
                  ))}
                </div>
                
                {isLoading ? (
                  <div className="flex flex-col animate-pulse">
                    {[1, 2, 3, 4, 5].map((week) => (
                      <div key={week} className="grid grid-cols-7 border-b border-slate-100 last:border-b-0 min-h-[120px]">
                        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                          <div key={day} className="border-r border-slate-100 last:border-r-0 p-2">
                            <div className="w-6 h-4 bg-slate-200 rounded mb-3"></div>
                            <div className="w-12 h-4 bg-slate-200 rounded-md mb-2"></div>
                            <div className="w-20 h-5 bg-slate-200 rounded mb-2"></div>
                            <div className="w-full h-3 bg-slate-200 rounded"></div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {weeks.map((week, wIdx) => (
                      <div key={wIdx} className="grid grid-cols-7 border-b border-slate-100 last:border-b-0 min-h-[120px]">
                        {week.map((day, dIdx) => {
                          if (!day) {
                            return <div key={`empty-${dIdx}`} className="bg-slate-50/50 border-r border-slate-100 last:border-r-0"></div>;
                          }
                          
                          const dateStr = getDateStr(day);
                          const recordKey = getRecordKey(dateStr);
                          const record = pricingData[recordKey];
                          const isSelected = selectedDates.has(dateStr);
                          
                          const today = new Date();
                          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                          const isPast = new Date(year, month, day) < new Date(today.setHours(0,0,0,0));

                          return (
                            <div 
                              key={day} 
                              onClick={() => !isPast && handleDateClick(day)}
                              className={`
                                border-r border-slate-100 last:border-r-0 p-2 relative transition-colors
                                ${isPast ? 'bg-slate-50/80 cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-orange-50'}
                                ${isSelected ? 'ring-2 ring-inset ring-[#ff5b00] bg-orange-50/50' : ''}
                              `}
                            >
                              <div className={`text-[13px] font-bold mb-2 flex items-center justify-between ${isToday ? 'text-[#ff5b00]' : 'text-slate-600'}`}>
                                {day}
                                {isToday && <span className="text-[9px] bg-orange-100 text-[#ff5b00] px-1.5 py-0.5 rounded-sm uppercase tracking-wider">Hôm nay</span>}
                              </div>
                              
                              {record ? (
                                <div className="flex flex-col gap-1.5">
                                  <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md self-start border ${getStatusColorInfo(record.status).bg} ${getStatusColorInfo(record.status).border} ${getStatusColorInfo(record.status).text}`}>
                                    {getStatusColorInfo(record.status).label}
                                  </div>
                                  <div className="text-[14px] font-black text-slate-800">
                                    {formatCurrency(record.price)}<span className="text-[10px] text-slate-400 font-normal">đ</span>
                                  </div>
                                  <div className="flex items-center justify-between text-[11px] mt-1">
                                    {record.originalPrice && record.originalPrice > record.price ? (
                                      <span className="text-slate-400 line-through">{formatCurrency(record.originalPrice)}đ</span>
                                    ) : <span></span>}
                                    <span className="text-slate-500 font-medium">Kho: <span className={record.stock === 0 ? 'text-red-500 font-bold' : ''}>{record.stock}</span></span>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center h-[70px] opacity-0 hover:opacity-100 transition-opacity">
                                  <span className="text-[11px] text-slate-400 italic">Bấm để cài đặt</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full xl:w-[380px] bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col shrink-0 relative overflow-hidden">
            {selectedDates.size === 0 ? (
              <div className="flex-1 flex flex-col p-6">
                <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 mb-8">
                  <CalendarIcon className="w-16 h-16 mb-4 opacity-20" />
                  <h3 className="text-[16px] font-bold text-slate-600 mb-2">Chưa chọn ngày</h3>
                  <p className="text-[13px] leading-relaxed">
                    Vui lòng click chọn một hoặc nhiều ngày trên lịch bên trái để cài đặt giá và trạng thái.
                  </p>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <h4 className="text-[13px] font-bold text-slate-700 mb-4 uppercase tracking-wider flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#ff5b00]" /> Chọn nhanh khoảng ngày
                  </h4>
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="block text-[12px] font-medium text-slate-500 mb-1">Từ ngày</label>
                      <input 
                        type="date" 
                        value={bulkFromDate}
                        onChange={(e) => setBulkFromDate(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2.5 text-[13px] outline-none focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00]"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium text-slate-500 mb-1">Đến ngày</label>
                      <input 
                        type="date" 
                        value={bulkToDate}
                        onChange={(e) => setBulkToDate(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2.5 text-[13px] outline-none focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00]"
                      />
                    </div>
                    <button 
                      onClick={handleBulkSelect}
                      disabled={!bulkFromDate || !bulkToDate}
                      className="mt-2 w-full bg-white border border-slate-300 hover:border-[#ff5b00] hover:text-[#ff5b00] text-slate-700 font-bold py-2.5 px-4 rounded-lg text-[13px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Áp dụng chọn
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="px-6 py-4 border-b border-slate-100 bg-orange-50/50 flex justify-between items-center">
                  <h3 className="text-[15px] font-bold text-[#ff5b00]">
                    Đã chọn {selectedDates.size} ngày
                  </h3>
                  <button onClick={handleClearSelection} className="text-[12px] font-bold text-slate-500 hover:text-red-500 transition-colors">
                    Hủy chọn
                  </button>
                </div>
                
                <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5" noValidate>
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-3">Trạng thái bán <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { val: 'OPEN', label: 'Mở bán', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
                        { val: 'FULL', label: 'Hết chỗ', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
                        { val: 'CLOSED', label: 'Đóng', color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-300' }
                      ].map(st => (
                        <button
                          key={st.val}
                          type="button"
                          onClick={() => { setFormStatus(st.val as PricingStatus); if (errors.price) setErrors({...errors, price: ''}); }}
                          className={`
                            py-2.5 rounded-lg text-[13px] font-bold border transition-all text-center
                            ${formStatus === st.val ? `${st.bg} ${st.color} ${st.border} ring-1 ring-inset ring-current` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}
                          `}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-bold text-slate-700 mb-2">Giá bán (VND) <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={formPrice}
                          onChange={(e) => { handlePriceChange(e, setFormPrice); if(errors.price) setErrors({...errors, price: ''}); }}
                          onBlur={() => setFormPrice(formatVndInputValue(formPrice))}
                          placeholder="Ví dụ: 900.000"
                          disabled={formStatus !== 'OPEN'}
                          className={`w-full border rounded-lg p-3 pr-8 text-[14px] outline-none transition-colors 
                            ${formStatus !== 'OPEN' ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed' : 
                              errors.price ? 'border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/30' : 'border-slate-300 focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00]'}`}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[13px] font-bold">₫</span>
                      </div>
                      {errors.price && <div className="text-red-500 text-[12px] mt-1.5 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> {errors.price}</div>}
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-slate-700 mb-2">Giá gốc (VND)</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={formOriginalPrice}
                          onChange={(e) => { handlePriceChange(e, setFormOriginalPrice); if(errors.originalPrice) setErrors({...errors, originalPrice: ''}); }}
                          onBlur={() => setFormOriginalPrice(formatVndInputValue(formOriginalPrice))}
                          placeholder="Nếu có giảm giá"
                          disabled={formStatus !== 'OPEN'}
                          className={`w-full border rounded-lg p-3 pr-8 text-[14px] outline-none transition-colors 
                            ${formStatus !== 'OPEN' ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed' : 
                              errors.originalPrice ? 'border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/30' : 'border-slate-300 focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00]'}`}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[13px] font-bold">₫</span>
                      </div>
                      {errors.originalPrice && <div className="text-red-500 text-[12px] mt-1.5 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> {errors.originalPrice}</div>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2">Số lượng / Sức chứa (Vé) <span className="text-red-500">*</span></label>
                    <input 
                      type="number"
                      min="0" 
                      value={formStatus === 'FULL' ? '0' : formStock}
                      onChange={(e) => { setFormStock(e.target.value); if(errors.stock) setErrors({...errors, stock: ''}); }}
                      disabled={formStatus === 'FULL'}
                      className={`w-full border rounded-lg p-3 text-[14px] outline-none transition-colors 
                        ${formStatus === 'FULL' ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed' : 
                          errors.stock ? 'border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/30' : 'border-slate-300 focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00]'}`}
                    />
                    {errors.stock && <div className="text-red-500 text-[12px] mt-1.5 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> {errors.stock}</div>}
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2">Ghi chú nội bộ</label>
                    <textarea 
                      value={formNote}
                      onChange={(e) => setFormNote(e.target.value)}
                      placeholder="Ghi chú về ngày này (VD: Lễ 30/4, cuối tuần...)"
                      rows={3}
                      className="w-full border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00] resize-none"
                    ></textarea>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button type="submit" className="flex-1 bg-[#ff5b00] hover:bg-[#e65200] text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm">
                      <Save className="w-4 h-4" /> Lưu cài đặt ({selectedDates.size} ngày)
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteSelected}
                      className="px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-red-600 text-[13px] font-bold hover:bg-red-100 transition-colors"
                    >
                      Xóa
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center p-10 text-center">
          <CalendarIcon className="w-16 h-16 text-slate-300 mb-4" />
          <h2 className="text-[18px] font-bold text-slate-700 mb-2">Vui lòng chọn Sản phẩm</h2>
          <p className="text-[14px] text-slate-500 max-w-md">
            Bạn cần chọn một Tour/Vé và loại vé ở thanh công cụ phía trên để xem và cài đặt lịch giá.
          </p>
        </div>
      )}
    </div>
  );
}
