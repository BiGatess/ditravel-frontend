import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Plus, MoreVertical, MapPin, Box, Ticket, 
  Eye, EyeOff, Edit, Trash2, Image as ImageIcon, X, CheckCircle,
  Filter, Star, ChevronDown, RefreshCcw, Tag, AlertTriangle, Layers
} from 'lucide-react';
import { REGIONS_DATA, ALL_PROVINCES } from '../../constants/provinces';
import TicketTypesModal from '../../components/admin/TicketTypesModal';

// --- MOCK DATA ---
const PRODUCT_TYPES = ['Tour', 'Vé tham quan', 'Combo'];
const CATEGORIES = [
  'Sun World', 'Khu vui chơi', 'Di sản', 'Thiên nhiên', 
  'Biển đảo', 'Văn hóa lịch sử', 'Nghỉ dưỡng'
];

import axiosClient from '../../api/axios';
import Toast, { ToastMessage, ToastType } from '../../components/admin/Toast';

const MOCK_PLACES: any[] = [];

const FilterDropdown = ({ icon: Icon, label, value, options, groups, valueMap, onChange, disabled, disabledText }: any) => {
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

  const displayValue = value === 'All' ? 'Tất cả' : (valueMap ? valueMap[value] : value);

  return (
    <div className={`relative flex-1 group ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`} ref={dropdownRef}>
      <div 
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between pl-11 pr-4 py-4 bg-transparent border-none text-[13px] outline-none transition-colors ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${isOpen ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
      >
        <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isOpen ? 'text-[#0084ff]' : 'text-slate-400 group-hover:text-[#0084ff]'}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="truncate pr-4 text-left flex-1 select-none">
          {disabled ? (
             <span className="text-slate-400 italic">{disabledText || label}</span>
          ) : value === 'All' ? (
            <span className="font-bold text-slate-700">Tất cả: {label}</span>
          ) : (
            <>
              <span className="text-slate-500 mr-1">{label}:</span>
              <span className="font-bold text-[#0084ff]">{displayValue}</span>
            </>
          )}
        </div>
        {!disabled && value !== 'All' ? (
          <div
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange('All');
              setIsOpen(false);
            }}
            className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors z-10"
            title="Xóa bộ lọc này"
          >
            <X className="w-4 h-4" />
          </div>
        ) : (
          !disabled && <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </div>

      {isOpen && !disabled && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-full min-w-[220px] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 py-2 z-50 animate-dropdown">
          <div className="max-h-[300px] overflow-y-auto hide-scrollbar">
            {groups ? (
              groups.map((group: any) => (
                <div key={group.name} className="py-1">
                  <div className="px-4 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 sticky top-0 z-10">
                    {group.name}
                  </div>
                  {group.options.map((opt: string) => {
                    const optDisplay = valueMap ? valueMap[opt] : opt;
                    const isSelected = value === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => { onChange(isSelected ? 'All' : opt); setIsOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors flex items-center gap-3 ${isSelected ? 'text-[#0084ff] font-bold bg-blue-50/50' : 'text-slate-700 hover:bg-slate-50'}`}
                      >
                        <span className="truncate">{optDisplay}</span>
                      </button>
                    );
                  })}
                </div>
              ))
            ) : (
              options?.map((opt: string) => {
                const optDisplay = valueMap ? valueMap[opt] : opt;
                const isSelected = value === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => { onChange(isSelected ? 'All' : opt); setIsOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors flex items-center gap-3 ${isSelected ? 'text-[#0084ff] font-bold bg-blue-50/50' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    <span className="truncate">{optDisplay}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const FormSelect = ({ label, value, options, groups, onChange, disabled, disabledText, required, error }: any) => {
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

  const displayValue = value || '';

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-[13px] font-bold text-slate-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div 
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between border rounded-lg p-3 text-[14px] outline-none transition-colors ${disabled ? 'bg-slate-50 border-slate-300 cursor-not-allowed text-slate-400' : 'bg-white'} ${error ? 'border-red-500 bg-red-50/30' : (isOpen ? 'border-slate-400' : 'border-slate-300 hover:border-slate-400')}`}
      >
        <span className={displayValue ? 'text-slate-800' : 'text-slate-400'}>
          {disabled ? disabledText : (displayValue || `-- Chọn ${label} --`)}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && !disabled && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-full min-w-[200px] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 py-2 z-50 animate-dropdown max-h-[250px] overflow-y-auto hide-scrollbar">
          {groups ? (
            groups.map((group: any) => {
              const unselectedOptions = group.options.filter((opt: string) => opt !== value);
              if (unselectedOptions.length === 0) return null;
              
              return (
              <div key={group.name} className="py-1">
                <div className="px-4 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 sticky top-0 z-10">
                  {group.name}
                </div>
                {unselectedOptions.map((opt: string) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => { onChange(opt); setIsOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-[13px] transition-colors text-slate-700 hover:bg-slate-50 hover:text-[#0084ff]"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )})
          ) : (
            options?.filter((opt: string) => opt !== value).map((opt: string) => (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setIsOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-[13px] transition-colors text-slate-700 hover:bg-slate-50 hover:text-[#0084ff]"
              >
                {opt}
              </button>
            ))
          )}
        </div>
      )}
      {error && <div className="text-red-500 text-[12px] mt-1.5 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> {error}</div>}
    </div>
  );
};

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [places, setPlaces] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterPlace, setFilterPlace] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  
  // Cascading Places Logic
  const availablePlaces = filterLocation === 'All' ? [] : places.filter(p => p.province_id === filterLocation);

  // Reset Place filter when Location changes
  useEffect(() => {
    setFilterPlace('All');
  }, [filterLocation]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null);
  const [managingTicketProduct, setManagingTicketProduct] = useState<any>(null);

  // Form states
  const [modalName, setModalName] = useState('');
  const [modalType, setModalType] = useState('');
  const [modalLocation, setModalLocation] = useState('');
  const [modalPlace, setModalPlace] = useState('');
  const [modalCategory, setModalCategory] = useState('');
  const [modalPrice, setModalPrice] = useState('');
  const [modalOriginalPrice, setModalOriginalPrice] = useState('');
  const [modalIsFeatured, setModalIsFeatured] = useState(false);
  const [modalStatus, setModalStatus] = useState('active');
  const [modalHighlights, setModalHighlights] = useState('');
  const [modalTerms, setModalTerms] = useState('');
  const [modalCancellationPolicy, setModalCancellationPolicy] = useState('');
  const [modalUsageGuide, setModalUsageGuide] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  
  // Inline Ticket Types state
  const [modalTicketTypes, setModalTicketTypes] = useState<any[]>([]);
  
  const modalAvailablePlaces = modalLocation ? places.filter(p => p.province_id === modalLocation) : [];

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [prodRes, placesRes, provRes] = await Promise.all([
        axiosClient.get('/products/'),
        axiosClient.get('/places/'),
        axiosClient.get('/provinces/')
      ]);
      setProducts(prodRes.data);
      setPlaces(placesRes.data);
      setProvinces(provRes.data);
    } catch (error) {
      setToastMessage({ title: 'Lỗi', message: 'Lỗi tải dữ liệu', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    Array.from(files).forEach((file: File, index) => {
      if (uploadedImages.length + index >= 5) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImages(prev => {
          if (prev.length >= 5) return prev;
          return [...prev, reader.result as string];
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRefresh = async () => {
    setSearchQuery('');
    setFilterLocation('All');
    setFilterPlace('All');
    setFilterType('All');
    setFilterCategory('All');
    setFilterStatus('All');
    await fetchData();
    setToastMessage({ title: 'Thành công', message: 'Đã làm mới dữ liệu thành công', type: 'success' });
  };

  const filteredProducts = products.filter(prod => {
    const matchSearch = (prod.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    // Tìm province của product thông qua place
    const placeOfProd = places.find(p => p.id === prod.place_id);
    const prodProvId = placeOfProd ? placeOfProd.province_id : null;
    
    const matchLoc = filterLocation === 'All' || prodProvId === filterLocation;
    const matchPlace = filterPlace === 'All' || prod.place_id === filterPlace;
    const matchStatus = filterStatus === 'All' || (filterStatus === 'active' ? prod.is_active : !prod.is_active);
    return matchSearch && matchLoc && matchPlace && matchStatus;
  });

  const toggleStatus = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const prod = products.find(p => p.id === id);
      if (!prod) return;
      const newStatus = !prod.is_active;
      await axiosClient.put(`/products/${id}`, { is_active: newStatus });
      fetchData();
      setToastMessage({ title: 'Thành công', message: newStatus ? `Đã hiển thị "${prod.title}"` : `Đã ẩn "${prod.title}"`, type: 'success' });
    } catch (error) {
      setToastMessage({ title: 'Lỗi', message: 'Lỗi cập nhật trạng thái', type: 'error' });
    }
  };

  const confirmDelete = (prod: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setProductToDelete(prod);
    setIsConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (productToDelete) {
      try {
        await axiosClient.delete(`/products/${productToDelete.id}`);
        fetchData();
        setToastMessage({ title: 'Thành công', message: `Đã xóa sản phẩm "${productToDelete.title}" thành công`, type: 'success' });
        setIsConfirmOpen(false);
        setProductToDelete(null);
      } catch (error) {
        setToastMessage({ title: 'Lỗi', message: 'Lỗi xóa sản phẩm', type: 'error' });
      }
    }
  };

  const handleOpenModal = (prod: any = null) => {
    setEditingProduct(prod);
    setModalName(prod?.title || '');
    
    // Tìm province của product thông qua place
    const placeOfProd = prod ? places.find(p => p.id === prod.place_id) : null;
    const prodProvId = placeOfProd ? placeOfProd.province_id : '';
    
    setModalLocation(prodProvId);
    setModalPlace(prod?.place_id || '');
    setModalCategory(prod?.category || 'TOUR');
    
    setModalPrice(prod?.price ? new Intl.NumberFormat('vi-VN').format(prod.price) : '');
    setModalOriginalPrice(''); // Không có originalPrice trong DB
    setModalIsFeatured(prod?.is_featured || false);
    setModalStatus(prod ? (prod.is_active ? 'active' : 'hidden') : 'active');
    setModalHighlights(prod?.highlights || '');
    setModalTerms(prod?.terms || '');
    setModalCancellationPolicy(prod?.cancellation_policy || '');
    setModalUsageGuide(prod?.usage_guide || '');
    
    let images = [];
    if (prod?.gallery && prod.gallery.length > 0) {
      images = prod.gallery;
    } else if (prod?.image) {
      images = [prod.image];
    }
    setUploadedImages(images);
    
    // Load existing ticket types
    const existingTickets = prod?.ticket_types?.map((tt: any) => ({
      name: tt.name || '',
      description: tt.description || '',
      price: tt.price ? Number(tt.price).toString() : '',
      original_price: tt.original_price ? Number(tt.original_price).toString() : '',
      min_quantity: tt.min_quantity || 1,
      max_quantity: tt.max_quantity || 10,
      is_active: tt.is_active !== false
    })) || [];
    setModalTicketTypes(existingTickets);
    
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (!value) {
      setter('');
      return;
    }
    const formatted = new Intl.NumberFormat('vi-VN').format(parseInt(value, 10));
    setter(formatted);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!modalName.trim()) newErrors.name = 'Vui lòng nhập tên sản phẩm';
    if (!modalLocation || modalLocation === 'All') newErrors.location = 'Vui lòng chọn Tỉnh/thành';
    if (!modalPlace || modalPlace === 'All') newErrors.place = 'Vui lòng chọn Địa điểm du lịch';
    if (!modalPrice) newErrors.price = 'Vui lòng nhập giá bán';

    if (Object.keys(newErrors).length > 0) {
       setErrors(newErrors);
       return;
    }
    setErrors({});
    
    const priceNum = parseInt(modalPrice.replace(/\./g, ''));
    if (priceNum < 0) {
        alert("Giá bán không được nhỏ hơn 0");
        return;
    }
    
    try {
      // Build inline ticket types payload
      const ticketTypesPayload = modalTicketTypes
        .filter(tt => tt.name.trim())
        .map(tt => ({
          name: tt.name.trim(),
          description: tt.description?.trim() || null,
          price: parseFloat(tt.price) || 0,
          original_price: tt.original_price ? parseFloat(tt.original_price) : null,
          min_quantity: parseInt(tt.min_quantity) || 1,
          max_quantity: parseInt(tt.max_quantity) || 10,
          is_active: tt.is_active !== false
        }));

      const payload: any = {
        title: modalName,
        place_id: modalPlace,
        category: modalCategory,
        price: priceNum,
        is_featured: modalIsFeatured,
        is_active: modalStatus === 'active',
        image: uploadedImages.length > 0 ? uploadedImages[0] : null,
        gallery: uploadedImages,
        highlights: modalHighlights,
        terms: modalTerms,
        cancellation_policy: modalCancellationPolicy,
        usage_guide: modalUsageGuide,
        ticket_types: ticketTypesPayload
      };

      if (editingProduct) {
        await axiosClient.put(`/products/${editingProduct.id}`, payload);
        setToastMessage({ title: 'Thành công', message: `Cập nhật "${modalName}" thành công`, type: 'success' });
      } else {
        await axiosClient.post('/products/', payload);
        setToastMessage({ title: 'Thành công', message: `Đã thêm sản phẩm "${modalName}"`, type: 'success' });
      }
      fetchData();
      handleCloseModal();
    } catch (err) {
      setToastMessage({ title: 'Lỗi', message: 'Lỗi lưu sản phẩm', type: 'error' });
    }
  };

  // Auto-hide toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => { setToastMessage(null); }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="p-6 h-full flex flex-col bg-slate-50 relative">
      {/* Toast */}
      <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-slate-800">Quản lý Sản phẩm (Tours/Vé)</h1>
          <p className="text-[13px] text-slate-500 mt-1">Quản lý kho sản phẩm, giá bán và các điểm tham quan.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#ff5b00] hover:bg-[#e05000] text-white font-bold py-2.5 px-4 rounded-lg text-[13px] flex items-center gap-2 shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" /> Thêm sản phẩm mới
        </button>
      </div>

      {/* Unified Toolbar / Filters */}
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] border border-slate-200 mb-6 flex flex-col lg:flex-row items-center transition-all hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)] flex-wrap">
        
        {/* Search */}
        <div className="relative w-full lg:w-[320px] shrink-0 border-b lg:border-b-0 lg:border-r border-slate-200 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#ff5b00] transition-colors" />
          <input 
            type="text" 
            placeholder="Tìm theo tên sản phẩm..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-4 bg-transparent border-none text-[13px] outline-none placeholder:text-slate-400 focus:ring-0"
          />
        </div>
        
        <div className="flex-1 flex flex-col sm:flex-row w-full divide-y sm:divide-y-0 sm:divide-x divide-slate-200 flex-wrap">
          <FilterDropdown 
            icon={MapPin} label="Tỉnh/thành" value={filterLocation} 
            options={provinces.map(p => p.id)}
            valueMap={provinces.reduce((acc, p) => ({...acc, [p.id]: p.name}), {})}
            onChange={setFilterLocation} 
          />
          <FilterDropdown 
            icon={MapPin} label="Địa điểm" value={filterPlace} 
            options={availablePlaces.map((p: any) => p.id)}
            valueMap={availablePlaces.reduce((acc: any, p: any) => ({...acc, [p.id]: p.name}), {})}
            disabled={filterLocation === 'All'}
            disabledText="Chọn Tỉnh/thành trước"
            onChange={setFilterPlace} 
          />
          <FilterDropdown 
            icon={Box} label="Loại" value={filterType} 
            options={PRODUCT_TYPES} onChange={setFilterType} 
          />
          <FilterDropdown 
            icon={Filter} label="Danh mục" value={filterCategory} 
            options={CATEGORIES} onChange={setFilterCategory} 
          />
          <FilterDropdown 
            icon={Eye} label="Trạng thái" value={filterStatus} 
            options={['active', 'hidden']} 
            valueMap={{ active: 'Đang bán', hidden: 'Đang ẩn' }}
            onChange={setFilterStatus} 
          />
        </div>

        {/* Clear Filters Button */}
        <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className={`p-4 border-l border-slate-200 transition-colors flex items-center justify-center shrink-0 w-full sm:w-auto ${isLoading ? 'text-[#0084ff] bg-blue-50' : 'text-slate-400 hover:text-[#0084ff] hover:bg-blue-50'}`}
            title="Làm mới dữ liệu & Xóa bộ lọc"
        >
            <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats row */}
      <div className="mb-4 text-[13px] font-bold text-slate-500 flex justify-end">
        Tìm thấy: <span className="text-slate-800 ml-1 bg-slate-200 px-2 rounded-md">{filteredProducts.length}</span> sản phẩm
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-2xl flex-1 overflow-hidden flex flex-col shadow-[0_2px_12px_rgb(0,0,0,0.02)]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[12px] uppercase tracking-wider text-slate-500">
                <th className="p-4 font-bold w-[60px] text-center">STT</th>
                <th className="p-4 font-bold w-[360px]">Sản phẩm</th>
                <th className="p-4 font-bold">Phân loại</th>
                <th className="p-4 font-bold">Vị trí</th>
                <th className="p-4 font-bold text-right">Giá bán</th>
                <th className="p-4 font-bold text-center w-[120px]">Trạng thái</th>
                <th className="p-4 font-bold text-right w-[100px]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[14px]">
              {isLoading ? (
                // Skeleton loading rows
                [1, 2, 3, 4].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4"><div className="h-4 bg-slate-100 rounded-md w-8 mx-auto"></div></td>
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-xl shrink-0"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-slate-100 rounded-md w-3/4 mb-2"></div>
                          <div className="h-3 bg-slate-100 rounded-md w-1/2"></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4"><div className="h-4 bg-slate-100 rounded-md w-24"></div></td>
                    <td className="p-4"><div className="h-4 bg-slate-100 rounded-md w-24"></div></td>
                    <td className="p-4"><div className="h-4 bg-slate-100 rounded-md w-20 ml-auto"></div></td>
                    <td className="p-4"><div className="h-6 bg-slate-100 rounded-full w-20 mx-auto"></div></td>
                    <td className="p-4"><div className="h-8 bg-slate-100 rounded-md w-24 ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((prod, index) => {
                  const placeOfProd = places.find(p => p.id === prod.place_id);
                  const provOfProd = provinces.find(p => p.id === placeOfProd?.province_id);
                  return (
                  <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-4 text-center text-slate-500 font-medium">{index + 1}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl border border-slate-200 overflow-hidden shrink-0 relative bg-slate-50">
                          <img src={prod.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80'} alt={prod.title} className={`w-full h-full object-cover ${!prod.is_active ? 'grayscale opacity-70' : ''}`} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 group-hover:text-[#0084ff] transition-colors line-clamp-1 mb-1" title={prod.title}>
                            {prod.title}
                          </div>
                          {prod.is_featured && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">
                              <Star className="w-3 h-3 fill-orange-500" /> Nổi bật
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-700">Tour/Vé</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-700">{provOfProd?.name || ''}</div>
                      <div className="text-[12px] text-slate-500 mt-0.5 line-clamp-1">{prod.place?.name || placeOfProd?.name || ''}</div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="font-bold text-[#ff5b00]">{formatPrice(prod.price)}</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[12px] font-bold border ${prod.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                        {prod.is_active ? 'Đang bán' : 'Đang ẩn'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => toggleStatus(prod.id, e)}
                          title={prod.is_active ? 'Ẩn sản phẩm' : 'Hiển thị sản phẩm'}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${prod.is_active ? 'text-slate-400 hover:text-orange-500 hover:bg-orange-50' : 'text-slate-400 hover:text-emerald-500 hover:bg-emerald-50'}`}
                        >
                          {prod.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => handleOpenModal(prod)}
                          title="Chỉnh sửa"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#0084ff] hover:bg-blue-50 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setManagingTicketProduct(prod); }}
                          title="Quản lý Gói dịch vụ (Loại vé)"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-purple-500 hover:bg-purple-50 transition-colors"
                        >
                          <Layers className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => confirmDelete(prod, e)}
                          title="Xóa"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )})
              ) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <Box className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    <div className="font-bold text-slate-500 text-[14px]">Không tìm thấy sản phẩm nào</div>
                    <div className="text-[13px] mt-1">Thử thay đổi bộ lọc hoặc thêm mới.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={handleCloseModal}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <h2 className="text-[18px] font-bold text-slate-800">
                {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </h2>
              <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="flex flex-col flex-1 overflow-hidden" noValidate>
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                
                {/* Images */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[13px] font-bold text-slate-700">Hình ảnh sản phẩm (Tối đa 5 ảnh)</label>
                    <span className="text-[12px] text-slate-500 font-medium">{uploadedImages.length}/5 ảnh</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {uploadedImages.map((img, index) => (
                      <div key={index} className="w-24 h-24 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden relative group shrink-0">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full text-slate-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:text-red-500 hover:bg-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-[#0084ff]/90 text-white text-[10px] font-bold py-1 text-center backdrop-blur-sm">
                            Ảnh chính
                          </div>
                        )}
                      </div>
                    ))}

                    {uploadedImages.length < 5 && (
                      <label className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-[#ff5b00] transition-colors flex flex-col items-center justify-center cursor-pointer shrink-0 group">
                        <div className="w-8 h-8 rounded-full bg-slate-200 group-hover:bg-orange-100 text-slate-500 group-hover:text-[#ff5b00] flex items-center justify-center mb-1 transition-colors">
                          <Plus className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-medium text-slate-500 group-hover:text-[#ff5b00]">Thêm ảnh</span>
                        <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                      </label>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-[13px] font-bold text-slate-700 mb-2">Tên sản phẩm (Tour/Vé) <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={modalName}
                      onChange={(e) => { setModalName(e.target.value); if(errors.name) setErrors({...errors, name: ''}); }}
                      placeholder="VD: Tour VIP Bà Nà Hills 1 Ngày" 
                      className={`w-full border rounded-lg p-3 text-[14px] outline-none transition-colors ${errors.name ? 'border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/30' : 'border-slate-300 focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff]'}`}
                    />
                    {errors.name && <div className="text-red-500 text-[12px] mt-1.5 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> {errors.name}</div>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[13px] font-bold text-slate-700 mb-2">Tỉnh/thành phố <span className="text-red-500">*</span></label>
                    <select
                      value={modalLocation}
                      onChange={(e) => { setModalLocation(e.target.value); setModalPlace(''); if(errors.location) setErrors({...errors, location: ''}); }}
                      className={`w-full border rounded-lg p-3 text-[14px] outline-none transition-colors ${errors.location ? 'border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/30' : 'border-slate-300 focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff]'}`}
                      required
                    >
                      <option value="" disabled>-- Chọn Tỉnh/thành --</option>
                      {provinces.map((prov) => (
                        <option key={prov.id} value={prov.id}>{prov.name}</option>
                      ))}
                    </select>
                    {errors.location && <div className="text-red-500 text-[12px] mt-1.5 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> {errors.location}</div>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[13px] font-bold text-slate-700 mb-2">Địa điểm du lịch <span className="text-red-500">*</span></label>
                    <select
                      value={modalPlace}
                      onChange={(e) => { setModalPlace(e.target.value); if(errors.place) setErrors({...errors, place: ''}); }}
                      className={`w-full border rounded-lg p-3 text-[14px] outline-none transition-colors ${!modalLocation ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : ''} ${errors.place ? 'border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/30' : 'border-slate-300 focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff]'}`}
                      disabled={!modalLocation}
                      required
                    >
                      <option value="" disabled>{!modalLocation ? 'Chọn Tỉnh/thành trước' : '-- Chọn Địa điểm --'}</option>
                      {modalAvailablePlaces.map((place: any) => (
                        <option key={place.id} value={place.id}>{place.name}</option>
                      ))}
                    </select>
                    {errors.place && <div className="text-red-500 text-[12px] mt-1.5 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> {errors.place}</div>}
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2">Danh mục <span className="text-red-500">*</span></label>
                    <select
                      value={modalCategory}
                      onChange={(e) => setModalCategory(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-3 text-[14px] outline-none transition-colors focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff]"
                      required
                    >
                      <option value="TOUR">Tour trọn gói</option>
                      <option value="VÉ">Vé tham quan</option>
                      <option value="COMBO">Combo du lịch</option>
                      <option value="KHÁC">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2">Giá bán (VND) <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <input 
                        type="text" 
                        value={modalPrice}
                        onChange={(e) => { handlePriceChange(e, setModalPrice); if(errors.price) setErrors({...errors, price: ''}); }}
                        placeholder="Ví dụ: 1.500.000" 
                        className={`w-full border rounded-lg p-3 pr-10 text-[14px] outline-none transition-colors ${errors.price ? 'border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/30' : 'border-slate-300 focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff]'}`}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[13px] font-bold">₫</span>
                    </div>
                    {errors.price && <div className="text-red-500 text-[12px] mt-1.5 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> {errors.price}</div>}
                  </div>
                  
                  <div className="md:col-span-2 flex items-center gap-2 mt-2">
                    <input 
                      type="checkbox" 
                      id="modalIsFeatured"
                      checked={modalIsFeatured}
                      onChange={(e) => setModalIsFeatured(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-[#ff5b00] focus:ring-[#ff5b00]"
                    />
                    <label htmlFor="modalIsFeatured" className="text-[13px] font-bold text-slate-700 cursor-pointer flex items-center gap-1">
                      <Star className="w-4 h-4 text-orange-500" /> Sản phẩm Nổi bật (Hiển thị đầu tiên ngoài Trang chủ)
                    </label>
                  </div>
                  
                  {/* Rich Text Fields */}
                  <div className="md:col-span-2 space-y-5 border-t border-slate-100 pt-5">
                    <h3 className="font-bold text-[15px] text-slate-800">Thông tin chi tiết</h3>
                    
                    <div>
                      <label className="block text-[13px] font-bold text-slate-700 mb-2">Bạn được trải nghiệm những gì? (Lịch trình / Điểm nổi bật)</label>
                      <textarea 
                        value={modalHighlights}
                        onChange={(e) => setModalHighlights(e.target.value)}
                        placeholder="Mô tả chi tiết lịch trình hoặc các điểm nổi bật của Tour/Vé..." 
                        className="w-full border border-slate-300 rounded-lg p-3 text-[14px] outline-none transition-colors focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff] min-h-[100px]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[13px] font-bold text-slate-700 mb-2">Điều kiện vé</label>
                      <textarea 
                        value={modalTerms}
                        onChange={(e) => setModalTerms(e.target.value)}
                        placeholder="VD: Xác nhận trong 24h, Vé chỉ có giá trị trong ngày, Trẻ em < 1m miễn phí..." 
                        className="w-full border border-slate-300 rounded-lg p-3 text-[14px] outline-none transition-colors focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff] min-h-[80px]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[13px] font-bold text-slate-700 mb-2">Hướng dẫn sử dụng</label>
                      <textarea 
                        value={modalUsageGuide}
                        onChange={(e) => setModalUsageGuide(e.target.value)}
                        placeholder="VD: Có mặt trước 15p, xuất trình mã QR..." 
                        className="w-full border border-slate-300 rounded-lg p-3 text-[14px] outline-none transition-colors focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff] min-h-[80px]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[13px] font-bold text-slate-700 mb-2">Chính sách hủy</label>
                      <textarea 
                        value={modalCancellationPolicy}
                        onChange={(e) => setModalCancellationPolicy(e.target.value)}
                        placeholder="VD: Hủy trước 24h hoàn 100%, Hủy trong vòng 24h không hoàn tiền..." 
                        className="w-full border border-slate-300 rounded-lg p-3 text-[14px] outline-none transition-colors focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff] min-h-[80px]"
                      />
                    </div>
                  </div>

                  {/* Inline Ticket Types Section */}
                  <div className="md:col-span-2 space-y-4 border-t border-slate-100 pt-5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-[15px] text-slate-800 flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-[#ff5b00]" />
                        Gói dịch vụ / Loại vé
                      </h3>
                      <button
                        type="button"
                        onClick={() => setModalTicketTypes(prev => [...prev, { name: '', description: '', price: '', original_price: '', min_quantity: 1, max_quantity: 10, is_active: true }])}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0084ff] text-white text-[12px] font-bold rounded-lg hover:bg-[#0073e6] transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Thêm gói
                      </button>
                    </div>

                    {modalTicketTypes.length === 0 ? (
                      <div className="text-center py-6 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                        <Ticket className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-[13px] text-slate-400">Chưa có gói dịch vụ nào</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Bấm "Thêm gói" để tạo gói dịch vụ cho sản phẩm này</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {modalTicketTypes.map((tt, idx) => (
                          <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 relative group">
                            <button
                              type="button"
                              onClick={() => setModalTicketTypes(prev => prev.filter((_, i) => i !== idx))}
                              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                              title="Xóa gói này"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Gói {idx + 1}</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="md:col-span-2">
                                <input
                                  type="text"
                                  value={tt.name}
                                  onChange={e => {
                                    const updated = [...modalTicketTypes];
                                    updated[idx].name = e.target.value;
                                    setModalTicketTypes(updated);
                                  }}
                                  placeholder="Tên gói (VD: Vé người lớn, Vé trẻ em...)"
                                  className="w-full border border-slate-300 rounded-lg p-2.5 text-[13px] outline-none focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff]"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-bold text-slate-500 mb-1 block">Giá bán (đ)</label>
                                <input
                                  type="number"
                                  value={tt.price}
                                  onChange={e => {
                                    const updated = [...modalTicketTypes];
                                    updated[idx].price = e.target.value;
                                    setModalTicketTypes(updated);
                                  }}
                                  placeholder="0"
                                  className="w-full border border-slate-300 rounded-lg p-2.5 text-[13px] outline-none focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff]"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-bold text-slate-500 mb-1 block">Giá gốc (đ) <span className="text-slate-400 font-normal">(tùy chọn)</span></label>
                                <input
                                  type="number"
                                  value={tt.original_price}
                                  onChange={e => {
                                    const updated = [...modalTicketTypes];
                                    updated[idx].original_price = e.target.value;
                                    setModalTicketTypes(updated);
                                  }}
                                  placeholder="0"
                                  className="w-full border border-slate-300 rounded-lg p-2.5 text-[13px] outline-none focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff]"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-bold text-slate-500 mb-1 block">Số lượng tối thiểu</label>
                                <input
                                  type="number"
                                  value={tt.min_quantity}
                                  onChange={e => {
                                    const updated = [...modalTicketTypes];
                                    updated[idx].min_quantity = parseInt(e.target.value) || 1;
                                    setModalTicketTypes(updated);
                                  }}
                                  min="1"
                                  className="w-full border border-slate-300 rounded-lg p-2.5 text-[13px] outline-none focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff]"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-bold text-slate-500 mb-1 block">Số lượng tối đa</label>
                                <input
                                  type="number"
                                  value={tt.max_quantity}
                                  onChange={e => {
                                    const updated = [...modalTicketTypes];
                                    updated[idx].max_quantity = parseInt(e.target.value) || 10;
                                    setModalTicketTypes(updated);
                                  }}
                                  min="1"
                                  className="w-full border border-slate-300 rounded-lg p-2.5 text-[13px] outline-none focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff]"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <input
                                  type="text"
                                  value={tt.description}
                                  onChange={e => {
                                    const updated = [...modalTicketTypes];
                                    updated[idx].description = e.target.value;
                                    setModalTicketTypes(updated);
                                  }}
                                  placeholder="Mô tả ngắn (tùy chọn)"
                                  className="w-full border border-slate-300 rounded-lg p-2.5 text-[13px] outline-none focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff]"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2 pt-4 border-t border-slate-100 flex gap-6">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          checked={modalIsFeatured}
                          onChange={(e) => setModalIsFeatured(e.target.checked)}
                          className="peer sr-only" 
                        />
                        <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#ff5b00]"></div>
                      </div>
                      <span className="text-[13px] font-bold text-slate-700 group-hover:text-slate-900">Sản phẩm nổi bật (Trang chủ)</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          checked={modalStatus === 'active'}
                          onChange={(e) => setModalStatus(e.target.checked ? 'active' : 'hidden')}
                          className="peer sr-only" 
                        />
                        <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                      </div>
                      <span className="text-[13px] font-bold text-slate-700 group-hover:text-slate-900">Hiển thị ra ngoài Web</span>
                    </label>
                  </div>
                </div>

              </div>
              
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
                <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 rounded-lg text-[13px] font-bold text-slate-600 hover:bg-slate-200 transition-colors">
                  Hủy bỏ
                </button>
                <button type="submit" className="px-6 py-2.5 rounded-lg text-[13px] font-bold text-white bg-[#0084ff] hover:bg-[#0073e6] shadow-sm transition-colors">
                  {editingProduct ? 'Cập nhật' : 'Lưu sản phẩm'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsConfirmOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm relative z-10 p-6 text-center animate-in zoom-in-95 duration-200">
            <h3 className="text-[18px] font-bold text-slate-800 mb-2">Xác nhận xóa</h3>
            <p className="text-[14px] text-slate-500 mb-6">
              Bạn có chắc chắn muốn xóa <strong className="text-slate-800">{productToDelete?.title}</strong>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setIsConfirmOpen(false)} className="flex-1 px-4 py-2.5 rounded-lg text-[14px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                Hủy bỏ
              </button>
              <button onClick={executeDelete} className="flex-1 px-4 py-2.5 rounded-lg text-[14px] font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-sm">
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Types Modal */}
      {managingTicketProduct && (
        <TicketTypesModal 
          product={managingTicketProduct}
          onClose={() => setManagingTicketProduct(null)}
        />
      )}

    </div>
  );
}
