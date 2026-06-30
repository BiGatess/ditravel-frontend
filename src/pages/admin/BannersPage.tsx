import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, Filter, Edit2, Trash2, X, CheckCircle, AlertTriangle, 
  Image as ImageIcon, ArrowUp, ArrowDown, ExternalLink, Calendar, Save, Upload, ChevronDown
} from 'lucide-react';

import axiosClient from '../../api/axios';
import Toast, { ToastMessage, ToastType } from '../../components/admin/Toast';

interface Banner {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  link?: string;
  position: "HOME_MAIN" | "HOME_SUB" | "POPUP";
  order: number;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  created_at: string;
}

const POSITION_LABELS = {
  HOME_MAIN: 'Trang chủ - Slide chính',
  HOME_SUB: 'Trang chủ - Khuyến mãi',
  POPUP: 'Popup quảng cáo'
};

const MOCK_BANNERS: Banner[] = [];

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>(MOCK_BANNERS);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [positionFilter, setPositionFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isPositionDropdownOpen, setIsPositionDropdownOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Banner>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Toast
  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);

  const showToast = (title: string, message: string, type: ToastType = 'success') => {
    setToastMessage({ title, message, type });
  };

  const fetchBanners = async () => {
    try {
      const res = await axiosClient.get('/banners/');
      setBanners(res.data);
    } catch (error) {
      showToast('Lỗi', 'Không thể tải danh sách Banner');
    }
  };

  React.useEffect(() => {
    fetchBanners();
  }, []);

  const filteredBanners = useMemo(() => {
    let result = [...banners];
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => (b.title || '').toLowerCase().includes(q));
    }
    
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      result = result.filter(b => b.is_active === isActive);
    }
    
    if (positionFilter !== 'all') {
      result = result.filter(b => b.position === positionFilter);
    }
    
    // Sort by position then order
    result.sort((a, b) => {
      if (a.position !== b.position) {
        return a.position.localeCompare(b.position);
      }
      return a.order - b.order;
    });
    
    return result;
  }, [banners, searchQuery, statusFilter, positionFilter]);

  // Stats
  const totalBanners = banners.length;
  const activeBanners = banners.filter(b => b.is_active).length;
  const inactiveBanners = totalBanners - activeBanners;

  const handleOpenModal = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({ ...banner });
    } else {
      setEditingBanner(null);
      setFormData({
        title: '',
        description: '',
        image_url: '',
        link: '',
        position: 'HOME_MAIN',
        order: 1,
        is_active: true,
        start_date: '',
        end_date: ''
      });
    }
    setFormErrors({});
    setIsPositionDropdownOpen(false);
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.image_url?.trim()) errors.image_url = 'Vui lòng chọn hình ảnh';
    
    if (!formData.position) errors.position = 'Vui lòng chọn vị trí hiển thị';
    if (!formData.order || formData.order < 1) errors.order = 'Thứ tự phải lớn hơn 0';
    
    if (formData.start_date && formData.end_date) {
      if (new Date(formData.end_date) < new Date(formData.start_date)) {
        errors.end_date = 'Ngày kết thúc không được nhỏ hơn ngày bắt đầu';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    // Clean data: convert empty strings to null for optional fields
    const cleanData = {
      ...formData,
      title: formData.title?.trim() || null,
      description: formData.description?.trim() || null,
      link: formData.link?.trim() || null,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
    };

    try {
      if (editingBanner) {
        await axiosClient.put(`/banners/${editingBanner.id}`, cleanData);
        showToast('Cập nhật thành công', `Banner đã được lưu thành công.`);
      } else {
        await axiosClient.post('/banners/', cleanData);
        showToast('Thêm mới thành công', `Đã tạo banner mới thành công.`);
      }
      fetchBanners();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Save banner error:', error.response?.data || error);
      const detail = error.response?.data?.detail;
      const msg = typeof detail === 'string' ? detail : 'Có lỗi xảy ra khi lưu banner';
      showToast('Lỗi', msg, 'error');
    }
  };

  const handleDeleteConfirm = (banner: Banner) => {
    setBannerToDelete(banner);
    setIsConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (!bannerToDelete) return;
    try {
      await axiosClient.delete(`/banners/${bannerToDelete.id}`);
      fetchBanners();
      showToast('Đã xóa banner', `Banner đã bị xóa.`, 'delete');
    } catch (error) {
      showToast('Lỗi', 'Có lỗi xảy ra khi xóa banner', 'error');
    } finally {
      setIsConfirmOpen(false);
      setBannerToDelete(null);
    }
  };

  const handleToggleActive = async (id: string) => {
    const banner = banners.find(b => b.id === id);
    if (!banner) return;
    try {
      const newStatus = !banner.is_active;
      await axiosClient.put(`/banners/${id}`, { is_active: newStatus });
      fetchBanners();
      showToast('Cập nhật trạng thái', `Banner "${banner.title}" đã được ${newStatus ? 'BẬT' : 'TẮT'}.`);
    } catch (error) {
      showToast('Lỗi', 'Không thể cập nhật trạng thái');
    }
  };

  const handleMoveOrder = async (id: string, direction: 'up' | 'down') => {
    const banner = banners.find(b => b.id === id);
    if (!banner) return;
    
    const positionBanners = banners.filter(b => b.position === banner.position).sort((a, b) => a.order - b.order);
    const currentIndex = positionBanners.findIndex(b => b.id === id);
    
    let targetBanner = null;
    
    if (direction === 'up' && currentIndex > 0) {
      targetBanner = positionBanners[currentIndex - 1];
    } else if (direction === 'down' && currentIndex < positionBanners.length - 1) {
      targetBanner = positionBanners[currentIndex + 1];
    }

    if (targetBanner) {
      const currentOrder = banner.order;
      const targetOrder = targetBanner.order;
      
      try {
        await axiosClient.patch('/banners/order', [
          { id: banner.id, order: targetOrder },
          { id: targetBanner.id, order: currentOrder }
        ]);
        fetchBanners();
        showToast('Thành công', 'Đã đổi thứ tự hiển thị.');
      } catch (error) {
        showToast('Lỗi', 'Không thể đổi thứ tự');
      }
    }
  };

  return (
    <div className="p-6 h-full flex flex-col bg-slate-50 relative">
      
      {/* Toast Notification */}
      <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h1 className="text-[24px] font-bold text-slate-800">Quản lý Banner</h1>
          <p className="text-[13px] text-slate-500 mt-1">Quản lý hình ảnh quảng cáo và slide hiển thị trên website.</p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden divide-x divide-slate-100">
          <div className="px-5 py-3">
            <div className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tổng cộng</div>
            <div className="text-[22px] font-black text-slate-800 leading-none">{totalBanners}</div>
          </div>
          <div className="px-5 py-3 bg-emerald-50/30">
            <div className="text-[12px] font-bold text-emerald-600 uppercase tracking-wider mb-1.5">Đang bật</div>
            <div className="text-[22px] font-black text-emerald-600 leading-none">{activeBanners}</div>
          </div>
          <div className="px-5 py-3 bg-slate-50">
            <div className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Đang tắt</div>
            <div className="text-[22px] font-black text-slate-600 leading-none">{inactiveBanners}</div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Tìm theo tên banner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
          />
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-[220px]">
            <select 
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-2 border border-slate-300 rounded-lg text-[13px] text-slate-700 focus:outline-none focus:border-black focus:ring-1 focus:ring-black bg-white"
            >
              <option value="all">Tất cả vị trí hiển thị</option>
              {Object.entries(POSITION_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative w-full md:w-[160px]">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-2 border border-slate-300 rounded-lg text-[13px] text-slate-700 focus:outline-none focus:border-black focus:ring-1 focus:ring-black bg-white"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang bật</option>
              <option value="inactive">Đang tắt</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          
          {(searchQuery || statusFilter !== 'all' || positionFilter !== 'all') && (
            <button 
              onClick={() => { setSearchQuery(''); setStatusFilter('all'); setPositionFilter('all'); }}
              className="px-4 py-2 text-[13px] font-medium text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              Xóa lọc
            </button>
          )}

          <button 
            onClick={() => handleOpenModal()}
            className="bg-[#0084ff] hover:bg-[#0073e6] text-white px-5 py-2 rounded-lg text-[13px] font-bold transition-all shadow-sm flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Thêm Banner
          </button>
        </div>
      </div>

      {/* Banner List */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-[13px] uppercase tracking-wider border-b border-slate-200">
                <th className="py-4 px-6 font-bold w-[60px] text-center">STT</th>
                <th className="py-4 px-6 font-bold w-[120px]">Hình ảnh</th>
                <th className="py-4 px-6 font-bold">Thông tin Banner</th>
                <th className="py-4 px-6 font-bold w-[220px]">Vị trí hiển thị</th>
                <th className="py-4 px-6 font-bold w-[120px] text-center">Thứ tự</th>
                <th className="py-4 px-6 font-bold w-[120px] text-center">Trạng thái</th>
                <th className="py-4 px-6 font-bold w-[100px] text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBanners.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <ImageIcon className="w-12 h-12 mb-3 opacity-20" />
                      <p className="text-[14px]">Không tìm thấy banner nào phù hợp.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBanners.map((banner, index) => {
                  const isFirstInPosition = index === 0 || filteredBanners[index - 1].position !== banner.position;
                  const isLastInPosition = index === filteredBanners.length - 1 || filteredBanners[index + 1].position !== banner.position;
                  
                  return (
                    <tr key={banner.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-6 text-center text-slate-500 font-medium">{index + 1}</td>
                      <td className="py-3 px-6">
                        <div className="w-[100px] h-[56px] rounded bg-slate-100 overflow-hidden border border-slate-200 relative">
                          <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-[15px] text-slate-800 mb-1">{banner.title}</div>
                        {banner.description && <div className="text-[13px] text-slate-500 mb-1.5 line-clamp-1">{banner.description}</div>}
                        
                        {(banner.start_date || banner.end_date) && (
                          <div className="flex items-center gap-1.5 text-[12px] text-slate-500 mt-2">
                            <Calendar className="w-3.5 h-3.5" />
                            {banner.start_date ? new Date(banner.start_date).toLocaleDateString('vi-VN') : '...'} 
                            {' - '} 
                            {banner.end_date ? new Date(banner.end_date).toLocaleDateString('vi-VN') : 'Không giới hạn'}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className="bg-blue-50 text-[#0084ff] text-[12px] font-bold px-3 py-1.5 rounded-md border border-blue-100">
                          {POSITION_LABELS[banner.position]}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="flex flex-col">
                            <button 
                              onClick={() => handleMoveOrder(banner.id, 'up')}
                              disabled={isFirstInPosition || !!searchQuery}
                              className="p-1 text-slate-400 hover:text-[#ff5b00] disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                              title="Đẩy lên"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleMoveOrder(banner.id, 'down')}
                              disabled={isLastInPosition || !!searchQuery}
                              className="p-1 text-slate-400 hover:text-[#ff5b00] disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                              title="Đẩy xuống"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                          </div>
                          <span className="w-8 text-[16px] font-bold text-slate-700">{banner.order}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-center">
                        <button 
                          onClick={() => handleToggleActive(banner.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${banner.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${banner.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </td>
                      <td className="py-3 px-6 text-right">
                        <div className="relative flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleOpenModal(banner)}
                            className="p-1.5 text-slate-400 hover:text-[#0084ff] bg-white hover:bg-blue-50 rounded transition-colors"
                            title="Sửa"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          
                          <button 
                            onClick={() => handleDeleteConfirm(banner)}
                            className="p-1.5 text-slate-400 hover:text-red-500 bg-white hover:bg-red-50 rounded transition-colors"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="text-[18px] font-bold text-slate-800">
                {editingBanner ? 'Sửa thông tin Banner' : 'Thêm Banner mới'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 flex flex-col md:flex-row gap-8">
              {/* Form Left */}
              <div className="flex-1 flex flex-col gap-5">
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-2">Tên banner (Chiến dịch)</label>
                  <input 
                    type="text" 
                    value={formData.title || ''}
                    onChange={(e) => { setFormData({...formData, title: e.target.value}); if (formErrors.title) setFormErrors({...formErrors, title: ''}); }}
                    placeholder="Ví dụ: Khuyến mãi Hè 2026"
                    className={`w-full border rounded-lg p-3 text-[14px] outline-none transition-colors ${formErrors.title ? 'border-red-500 bg-red-50/30 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-black focus:ring-1 focus:ring-black'}`}
                  />
                  {formErrors.title && <div className="text-red-500 text-[12px] mt-1.5 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {formErrors.title}</div>}
                </div>



                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-[13px] font-bold text-slate-700 mb-2">Vị trí hiển thị <span className="text-red-500">*</span></label>
                    <div 
                      onClick={() => setIsPositionDropdownOpen(!isPositionDropdownOpen)}
                      className={`w-full border py-3 pl-4 pr-4 text-[14px] cursor-pointer outline-none bg-white flex items-center justify-between select-none ${
                        formErrors.position 
                          ? 'border-red-500 bg-red-50/30 rounded-lg' 
                          : isPositionDropdownOpen 
                            ? 'border-slate-200 border-b-slate-100 rounded-t-lg shadow-sm relative z-20' 
                            : 'border-slate-200 rounded-lg hover:border-slate-300'
                      }`}
                    >
                      <span className={`truncate mr-2 ${formData.position ? 'text-[#0f172a]' : 'text-slate-400'}`}>
                        {formData.position ? POSITION_LABELS[formData.position] : '-- Chọn vị trí --'}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isPositionDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>
                    
                    {isPositionDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsPositionDropdownOpen(false)}></div>
                        <div className="absolute top-full left-0 min-w-full bg-white border border-t-0 border-slate-200 rounded-b-lg shadow-lg z-20 overflow-hidden pb-1">
                          {Object.entries(POSITION_LABELS)
                            .filter(([key]) => key !== formData.position)
                            .map(([key, label]) => (
                              <div 
                                key={key} 
                                onClick={() => {
                                  setFormData({...formData, position: key as Banner['position']});
                                  if (formErrors.position) setFormErrors({...formErrors, position: ''});
                                  setIsPositionDropdownOpen(false);
                                }}
                                className="px-4 py-3 text-[14px] text-[#0f172a] whitespace-nowrap cursor-pointer transition-colors hover:bg-slate-50"
                              >
                                {label}
                              </div>
                            ))}
                        </div>
                      </>
                    )}
                    
                    {formErrors.position && <div className="text-red-500 text-[12px] mt-1.5 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {formErrors.position}</div>}
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2">Thứ tự ưu tiên <span className="text-red-500">*</span></label>
                    <input 
                      type="number" 
                      min="1"
                      value={formData.order || ''}
                      onChange={(e) => { setFormData({...formData, order: parseInt(e.target.value)}); if (formErrors.order) setFormErrors({...formErrors, order: ''}); }}
                      className={`w-full border rounded-lg p-3 text-[14px] outline-none transition-colors ${formErrors.order ? 'border-red-500 bg-red-50/30 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-black focus:ring-1 focus:ring-black'}`}
                    />
                    <p className="text-[11px] text-slate-500 mt-1.5">Số nhỏ hiển thị trước</p>
                    {formErrors.order && <div className="text-red-500 text-[12px] mt-1.5 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {formErrors.order}</div>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2">Ngày bắt đầu</label>
                    <input 
                      type="date" 
                      value={formData.start_date ? new Date(formData.start_date).toISOString().split('T')[0] : ''}
                      onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-2">Ngày kết thúc</label>
                    <input 
                      type="date" 
                      value={formData.end_date ? new Date(formData.end_date).toISOString().split('T')[0] : ''}
                      onChange={(e) => { setFormData({...formData, end_date: e.target.value}); if (formErrors.end_date) setFormErrors({...formErrors, end_date: ''}); }}
                      className={`w-full border rounded-lg p-3 text-[14px] outline-none transition-colors ${formErrors.end_date ? 'border-red-500 bg-red-50/30 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-black focus:ring-1 focus:ring-black'}`}
                    />
                    {formErrors.end_date && <div className="text-red-500 text-[12px] mt-1.5 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {formErrors.end_date}</div>}
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-2">Trạng thái Bật/Tắt</label>
                  <label 
                    className="flex items-center gap-3 cursor-pointer select-none"
                    onClick={(e) => { e.preventDefault(); setFormData({...formData, is_active: !formData.is_active}); }}
                  >
                    <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                    </div>
                    <span className={`text-[14px] font-medium ${formData.is_active ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {formData.is_active ? 'Đang bật hiển thị' : 'Đang tắt hiển thị'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Form Right (Preview & Upload) */}
              <div className="w-full md:w-[320px] flex flex-col shrink-0">
                <label className="block text-[13px] font-bold text-slate-700 mb-2">Hình ảnh Banner <span className="text-red-500">*</span></label>
                <div className={`bg-slate-50 border ${formErrors.image_url ? 'border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.1)]' : 'border-slate-200'} rounded-xl w-full aspect-[16/9] flex flex-col overflow-hidden relative group transition-all`}>
                  <input 
                    type="file" 
                    accept="image/*"
                    id="banner-upload"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Mock upload for now or you can handle real upload
                        const reader = new FileReader();
                        reader.onloadend = () => {
                           setFormData({...formData, image_url: reader.result as string});
                           if (formErrors.image_url) setFormErrors({...formErrors, image_url: ''});
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  
                  {formData.image_url ? (
                    <>
                      <img 
                        src={formData.image_url} 
                        alt="Preview" 
                        className="w-full h-full object-contain bg-slate-100 absolute inset-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmMThmMWIiIC8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTQ5NGEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+4Lih4o+S4LiEIEFuIGVycm9yIG9jY3VycmVkPC90ZXh0Pjwvc3ZnPg==';
                        }}
                      />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex flex-col items-center justify-center gap-3">
                        <label htmlFor="banner-upload" className="cursor-pointer bg-white text-slate-800 hover:bg-slate-100 px-4 py-2 rounded-lg text-[13px] font-bold flex items-center gap-2 transition-colors shadow-sm w-[120px] justify-center">
                          <Upload className="w-4 h-4" /> Thay ảnh
                        </label>
                        <button type="button" onClick={() => setFormData({...formData, image_url: ''})} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-[13px] font-bold flex items-center gap-2 transition-colors shadow-sm w-[120px] justify-center">
                          <Trash2 className="w-4 h-4" /> Xóa ảnh
                        </button>
                      </div>
                      
                      {/* Text Overlay for visual touch */}
                      {formData.position === 'HOME_MAIN' && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 flex flex-col justify-end p-4 pointer-events-none group-hover:opacity-0 transition-opacity">
                          <div className="text-white font-bold text-[16px] drop-shadow-md mb-1">{formData.title || 'Tiêu đề Banner'}</div>
                          <div className="text-white/80 text-[12px] drop-shadow line-clamp-2">{formData.description || 'Mô tả banner sẽ hiển thị ở đây'}</div>
                        </div>
                      )}
                    </>
                  ) : (
                      <label htmlFor="banner-upload" className="flex-1 flex flex-col items-center justify-center text-slate-400 p-6 text-center z-10 relative cursor-pointer hover:bg-slate-100 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0084ff] flex items-center justify-center mb-3">
                          <Upload className="w-6 h-6" />
                        </div>
                        <p className="text-[13px] font-bold text-slate-700 mb-1">Click để tải ảnh lên</p>
                        <p className="text-[11px] text-slate-500">JPG, PNG, GIF</p>
                        <p className="text-[11px] text-slate-500 mt-1">Khuyến nghị ảnh ngang 16:9 để hiển thị chuẩn</p>
                      </label>
                    )}
                  </div>
                {formErrors.image_url && <div className="text-red-500 text-[12px] mt-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Vui lòng tải lên hình ảnh banner</div>}
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-[14px] font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2.5 text-[14px] font-bold text-white bg-[#0084ff] hover:bg-[#0073e6] shadow-sm rounded-lg flex items-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" /> Lưu Banner
              </button>
            </div>
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
              Bạn có chắc chắn muốn xóa banner <strong className="text-slate-800">{bannerToDelete?.title}</strong>?
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

    </div>
  );
}
