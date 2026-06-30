import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Plus, MoreVertical, MapPin, Map, Ticket, 
  Eye, EyeOff, Edit, Trash2, Image as ImageIcon, X, CheckCircle,
  Filter, Star, AlertTriangle, ChevronDown
} from 'lucide-react';

// --- MOCK DATA ---
const CATEGORIES = [
  'Hoạt động & trải nghiệm', 'Vé tham quan - Công viên giải trí', 
  'Show diễn & Sự kiện', 'Tour tham quan ngắm cảnh', 
  'Phương tiện di chuyển', 'Ẩm thực - Buffet', 'Thư giãn & Sức khỏe'
];

import axiosClient from '../../api/axios';
import Toast, { ToastMessage, ToastType } from '../../components/admin/Toast';

const FilterDropdown = ({ icon: Icon, label, value, options, valueMap, onChange }: any) => {
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
    <div className="relative flex-1 group" ref={dropdownRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between pl-11 pr-4 py-4 bg-transparent border-none text-[13px] outline-none cursor-pointer transition-colors ${isOpen ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
      >
        <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isOpen ? 'text-[#0084ff]' : 'text-slate-400 group-hover:text-[#0084ff]'}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="truncate pr-4 text-left flex-1">
          {value === 'All' ? (
            <span className="font-bold text-slate-700">Tất cả: {label}</span>
          ) : (
            <>
              <span className="text-slate-500 mr-1">{label}:</span>
              <span className="font-bold text-[#0084ff]">{displayValue}</span>
            </>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-full min-w-[220px] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 py-2 z-50 animate-dropdown">
          <div className="max-h-[300px] overflow-y-auto hide-scrollbar">
            {options?.map((opt: any) => {
              const optValue = opt?.id || opt;
              const optDisplay = valueMap
                ? (valueMap[optValue] || opt?.name || opt)
                : (opt?.name || opt);
              const isSelected = value === optValue;
              return (
                <button
                  key={optValue}
                  type="button"
                  onClick={() => { onChange(isSelected ? 'All' : optValue); setIsOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors flex items-center gap-3 ${isSelected ? 'text-[#0084ff] font-bold bg-blue-50/50' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  <span className="truncate">{optDisplay}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const FormDropdown = ({ label, value, options, valueMap, onChange, placeholder }: any) => {
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

  const selectedLabel = value
    ? (valueMap ? valueMap[value] : value)
    : placeholder;

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-[13px] font-bold text-slate-700 mb-2">{label} <span className="text-red-500">*</span></label>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={`w-full flex items-center justify-between border rounded-lg p-3 text-[14px] outline-none transition-colors bg-white ${isOpen ? 'border-slate-400' : 'border-slate-300 hover:border-slate-400'}`}
      >
        <span className={value ? 'text-slate-800' : 'text-slate-400'}>{selectedLabel}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-full min-w-[220px] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 py-2 z-50 animate-dropdown">
          <div className="max-h-[300px] overflow-y-auto hide-scrollbar">
            {options?.map((opt: any) => {
              const optValue = opt?.id || opt;
              const optLabel = valueMap ? (valueMap[optValue] || opt?.name || opt) : (opt?.name || opt);
              const isSelected = value === optValue;
              return (
                <button
                  key={optValue}
                  type="button"
                  onClick={() => {
                    onChange(isSelected ? '' : optValue);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors flex items-center gap-3 ${isSelected ? 'text-[#0084ff] font-bold bg-blue-50/50' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  <span className="truncate">{optLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default function PlacesPage() {
  const [places, setPlaces] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Modal & Dialog states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<any>(null);
  const [modalName, setModalName] = useState('');
  const [modalProvinceId, setModalProvinceId] = useState('');
  const [modalCategory, setModalCategory] = useState('');
  const [modalAddress, setModalAddress] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const [modalIsFeatured, setModalIsFeatured] = useState(false);
  const [modalIsActive, setModalIsActive] = useState(true);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [placeToDelete, setPlaceToDelete] = useState<any>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  
  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [placesRes, provincesRes] = await Promise.all([
        axiosClient.get('/places/'),
        axiosClient.get('/provinces/')
      ]);
      setPlaces(placesRes.data);
      setProvinces(provincesRes.data);
    } catch (err) {
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

  const filteredPlaces = places.filter(place => {
    const matchSearch = (place.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (place.address || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchLoc = filterLocation === 'All' || place.province_id === filterLocation;
    const matchCat = filterCategory === 'All' || place.category === filterCategory;
    const matchStatus = filterStatus === 'All' || (filterStatus === 'active' ? place.is_active : !place.is_active);
    
    return matchSearch && matchLoc && matchCat && matchStatus;
  });

  const toggleStatus = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const place = places.find(p => p.id === id);
      if (!place) return;
      const newStatus = !place.is_active;
      await axiosClient.put(`/places/${id}`, { is_active: newStatus });
      fetchData();
      setToastMessage({ title: 'Thành công', message: newStatus ? `Đã hiển thị địa điểm "${place.name}"` : `Đã ẩn địa điểm "${place.name}"`, type: 'success' });
    } catch (err) {
      setToastMessage({ title: 'Lỗi', message: 'Lỗi cập nhật trạng thái', type: 'error' });
    }
  };

  const confirmDelete = (place: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setPlaceToDelete(place);
    setIsConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (placeToDelete) {
      try {
        await axiosClient.delete(`/places/${placeToDelete.id}`);
        fetchData();
        setToastMessage({ title: 'Thành công', message: `Đã xóa địa điểm "${placeToDelete.name}" thành công`, type: 'success' });
        setIsConfirmOpen(false);
        setPlaceToDelete(null);
      } catch (err) {
        setToastMessage({ title: 'Lỗi', message: 'Lỗi khi xóa địa điểm', type: 'error' });
      }
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: modalName,
        province_id: modalProvinceId,
        category: modalCategory,
        address: modalAddress,
        description: modalDescription,
        is_featured: modalIsFeatured,
        is_active: modalIsActive,
        image: uploadedImages.length > 0 ? uploadedImages[0] : null
      };

      if (editingPlace) {
        await axiosClient.put(`/places/${editingPlace.id}`, payload);
        setToastMessage({ title: 'Thành công', message: `Cập nhật địa điểm "${modalName}" thành công`, type: 'success' });
      } else {
        await axiosClient.post('/places/', payload);
        setToastMessage({ title: 'Thành công', message: `Thêm địa điểm "${modalName}" thành công`, type: 'success' });
      }
      fetchData();
      handleCloseModal();
    } catch (err) {
      setToastMessage({ title: 'Lỗi', message: 'Lỗi khi lưu dữ liệu', type: 'error' });
    }
  };

  const handleOpenModal = (place: any = null) => {
    setEditingPlace(place);
    setModalName(place ? place.name : '');
    setModalProvinceId(place ? place.province_id : '');
    setModalCategory(place ? (place.category || '') : '');
    setModalAddress(place ? (place.address || '') : '');
    setModalDescription(place ? (place.description || '') : '');
    setModalIsFeatured(place ? place.is_featured : false);
    setModalIsActive(place ? place.is_active : true);
    setUploadedImages(place && place.image ? [place.image] : []);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlace(null);
  };

  // Auto-hide toast
  React.useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  return (
    <div className="p-6 h-full flex flex-col bg-slate-50 relative">
      
      {/* Toast Notification */}
      <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Toast Notification */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-slate-800">Quản lý Địa điểm du lịch</h1>
          <p className="text-[13px] text-slate-500 mt-1">Thêm mới, cập nhật danh sách các điểm tham quan chi tiết.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#ff5b00] hover:bg-[#e05000] text-white font-bold py-2.5 px-4 rounded-lg text-[13px] flex items-center gap-2 shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" /> Thêm địa điểm mới
        </button>
      </div>

      {/* Unified Toolbar / Filters */}
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] border border-slate-200 mb-6 flex flex-col lg:flex-row items-center transition-all hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)]">
        
        {/* Search */}
        <div className="relative w-full lg:w-[320px] shrink-0 border-b lg:border-b-0 lg:border-r border-slate-200 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#ff5b00] transition-colors" />
          <input 
            type="text" 
            placeholder="Tìm theo tên hoặc địa chỉ..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-4 bg-transparent border-none text-[13px] outline-none placeholder:text-slate-400 focus:ring-0"
          />
        </div>
        
        <div className="flex-1 flex flex-col sm:flex-row w-full divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
          <FilterDropdown 
            icon={MapPin} 
            label="Tỉnh/thành" 
            value={filterLocation} 
            options={provinces}
            valueMap={provinces.reduce((acc, p) => ({...acc, [p.id]: p.name}), {})}
            onChange={setFilterLocation} 
          />
          <FilterDropdown 
            icon={Filter} 
            label="Danh mục" 
            value={filterCategory} 
            options={CATEGORIES} 
            onChange={setFilterCategory} 
          />
          <FilterDropdown 
            icon={Eye} 
            label="Trạng thái" 
            value={filterStatus} 
            options={['active', 'hidden']} 
            valueMap={{'active': 'Hiển thị', 'hidden': 'Đã ẩn'}}
            onChange={setFilterStatus} 
          />
        </div>
        
        {/* Results count */}
        <div className="hidden xl:flex items-center justify-center px-6 py-4 border-l border-slate-200 bg-slate-50 shrink-0">
          <div className="text-[13px] text-slate-500 font-medium">Tìm thấy: <span className="text-slate-800 font-bold ml-1">{filteredPlaces.length}</span></div>
        </div>
      </div>

      {/* Table List View */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1">
        <div className="overflow-x-auto h-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[13px] uppercase font-bold sticky top-0 z-10">
                <th className="py-4 px-6 font-semibold w-[60px] text-center">STT</th>
                <th className="py-4 px-6 font-semibold min-w-[300px]">Địa điểm du lịch</th>
                <th className="py-4 px-4 font-semibold">Khu vực & Danh mục</th>
                <th className="py-4 px-4 font-semibold text-center">Liên kết</th>
                <th className="py-4 px-4 font-semibold text-center">Nổi bật</th>
                <th className="py-4 px-4 font-semibold">Trạng thái</th>
                <th className="py-4 px-6 w-[140px] text-center font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPlaces.map((place, index) => (
                <tr 
                  key={place.id} 
                  onClick={() => handleOpenModal(place)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-6 text-center text-slate-500 font-medium">{index + 1}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-100 bg-slate-100 relative">
                        <img 
                          src={place.image || 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80'} 
                          alt={place.name} 
                          className={`w-full h-full object-cover ${!place.is_active ? 'grayscale opacity-70' : ''}`}
                        />
                      </div>
                      <div>
                        <div className="font-bold text-[15px] text-slate-800 mb-0.5 group-hover:text-[#ff5b00] transition-colors">{place.name}</div>
                        <div className="text-[12px] text-slate-500 line-clamp-1" title={place.address}>{place.address}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="inline-flex items-center gap-1.5 text-[12px] text-slate-600 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {place.province?.name}
                      </span>
                      {place.category && (
                        <span className="inline-flex items-center gap-1.5 text-[12px] text-blue-600 font-medium">
                          <Filter className="w-3.5 h-3.5" /> {place.category}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center justify-center gap-1.5 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md text-[13px] font-bold">
                      <Ticket className="w-4 h-4" /> 0
                    </span>
                  </td>

                  <td className="py-4 px-4 text-center">
                    {place.is_featured ? (
                      <Star className="w-5 h-5 text-amber-400 fill-amber-400 mx-auto" />
                    ) : (
                      <Star className="w-5 h-5 text-slate-300 mx-auto" />
                    )}
                  </td>

                  <td className="py-4 px-4">
                    {place.is_active ? (
                      <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-1 rounded-md text-[12px] font-bold">
                        <Eye className="w-3.5 h-3.5" /> Hiển thị
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-500 border border-slate-200 px-2.5 py-1 rounded-md text-[12px] font-bold">
                        <EyeOff className="w-3.5 h-3.5" /> Đã ẩn
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleOpenModal(place); }}
                        className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-[#0084ff] hover:border-[#0084ff] hover:bg-blue-50 flex items-center justify-center transition-colors shadow-sm"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => toggleStatus(place.id, e)}
                        className={`w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center transition-colors shadow-sm ${
                          place.is_active 
                            ? 'text-slate-500 hover:text-orange-500 hover:border-orange-500 hover:bg-orange-50' 
                            : 'text-slate-500 hover:text-emerald-600 hover:border-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={place.is_active ? 'Ẩn' : 'Hiện'}
                      >
                        {place.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={(e) => confirmDelete(place, e)}
                        className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-500 hover:bg-red-50 flex items-center justify-center transition-colors shadow-sm"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredPlaces.length === 0 && (
            <div className="p-16 text-center text-slate-500">
              <MapPin className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h3 className="text-[16px] font-bold text-slate-700 mb-1">Không tìm thấy địa điểm</h3>
              <p className="text-[13px]">Vui lòng thử lại với từ khóa hoặc bộ lọc khác.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- CONFIRM DELETE DIALOG --- */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsConfirmOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm relative z-10 animate-in zoom-in-95 duration-200 p-6 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-[18px] font-bold text-slate-800 mb-2">Xác nhận xóa</h3>
            <p className="text-[14px] text-slate-500 mb-6">
              Bạn có chắc chắn muốn xóa địa điểm <strong className="text-slate-800">{placeToDelete?.name}</strong>? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsConfirmOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-lg text-[14px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={executeDelete}
                className="flex-1 px-4 py-2.5 rounded-lg text-[14px] font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-sm"
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD/EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={handleCloseModal}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <h2 className="text-[18px] font-bold text-slate-800">
                {editingPlace ? 'Chỉnh sửa địa điểm' : 'Thêm địa điểm mới'}
              </h2>
              <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                
                {/* Multi-Image Upload UI */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[13px] font-bold text-slate-700">Hình ảnh địa điểm (Tối đa 5 ảnh)</label>
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
                            Ảnh bìa
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
                        <input 
                          type="file" 
                          accept="image/*" 
                          multiple
                          className="hidden" 
                          onChange={handleImageUpload}
                        />
                      </label>
                    )}
                  </div>
                  <p className="text-[12px] text-slate-500 mt-3">
                    Hỗ trợ JPG, PNG. Kích thước tối ưu: 800x600px. Ảnh đầu tiên sẽ làm ảnh bìa.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-[13px] font-bold text-slate-700 mb-2">Tên địa điểm <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={modalName}
                      onChange={(e) => setModalName(e.target.value)}
                      placeholder="VD: Bà Nà Hills, VinWonders..." 
                      className="w-full border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00] transition-shadow"
                      required
                    />
                  </div>

                  <FormDropdown
                    label="Thuộc Tỉnh/thành phố"
                    value={modalProvinceId}
                    options={provinces}
                    valueMap={provinces.reduce((acc, p) => ({ ...acc, [p.id]: p.name }), {})}
                    onChange={setModalProvinceId}
                    placeholder="-- Chọn Tỉnh/thành --"
                  />

                  <FormDropdown
                    label="Danh mục"
                    value={modalCategory}
                    options={CATEGORIES}
                    onChange={setModalCategory}
                    placeholder="-- Chọn Danh mục --"
                  />

                  <div className="md:col-span-2">
                    <label className="block text-[13px] font-bold text-slate-700 mb-2">Địa chỉ cụ thể</label>
                    <input 
                      type="text" 
                      value={modalAddress}
                      onChange={(e) => setModalAddress(e.target.value)}
                      placeholder="Số nhà, Đường, Quận/Huyện..." 
                      className="w-full border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[13px] font-bold text-slate-700 mb-2">Mô tả ngắn</label>
                    <textarea 
                      rows={2}
                      value={modalDescription}
                      onChange={(e) => setModalDescription(e.target.value)}
                      placeholder="Mô tả tóm tắt về điểm đến..." 
                      className="w-full border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00] resize-none"
                    ></textarea>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center gap-3 p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                    <div className="flex-1">
                      <div className="font-bold text-[13px] text-slate-800 mb-0.5 flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Địa điểm nổi bật
                      </div>
                      <div className="text-[12px] text-slate-500">Ưu tiên hiển thị trên trang chủ.</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={modalIsFeatured} onChange={(e) => setModalIsFeatured(e.target.checked)} className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex-1">
                      <div className="font-bold text-[13px] text-slate-800 mb-0.5">Hiển thị công khai</div>
                      <div className="text-[12px] text-slate-500">Khách hàng có thể tìm thấy.</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={modalIsActive} onChange={(e) => setModalIsActive(e.target.checked)} className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0084ff]"></div>
                    </label>
                  </div>
                </div>

              </div>

              <div className="p-5 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 rounded-lg text-[13px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 rounded-lg text-[13px] font-bold text-white bg-[#ff5b00] hover:bg-[#e05000] shadow-sm transition-colors"
                >
                  {editingPlace ? 'Lưu thay đổi' : 'Tạo mới'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
