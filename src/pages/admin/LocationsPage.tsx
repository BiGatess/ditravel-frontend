import React, { useState } from 'react';
import {
  Search, Plus, MoreVertical, MapPin, Map, Ticket,
  Eye, EyeOff, Edit, Trash2, Image as ImageIcon, X, CheckCircle
} from 'lucide-react';

import axiosClient from '../../api/axios';
import Toast, { ToastMessage, ToastType } from '../../components/admin/Toast';

export default function LocationsPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<any>(null);
  const [modalName, setModalName] = useState('');

  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null);

  // Gọi API lấy dữ liệu Tỉnh/thành
  const fetchProvinces = async () => {
    try {
      setIsLoading(true);
      const res = await axiosClient.get('/provinces/');
      setLocations(res.data);
    } catch (err) {
      setToastMessage({ title: 'Lỗi', message: 'Lỗi khi tải dữ liệu Tỉnh/Thành phố', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProvinces();
  }, []);

  const filteredLocations = locations.filter(loc =>
    (loc.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (loc.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStatus = async (id: string) => {
    try {
      const loc = locations.find(l => l.id === id);
      if (!loc) return;
      const newStatus = !loc.is_active;
      await axiosClient.put(`/provinces/${id}`, { is_active: newStatus });
      fetchProvinces();
      setToastMessage({ title: 'Thành công', message: newStatus ? `Đã hiển thị địa điểm "${loc.name}"` : `Đã ẩn địa điểm "${loc.name}"`, type: 'success' });
    } catch (err) {
      setToastMessage({ title: 'Lỗi', message: 'Lỗi khi cập nhật trạng thái', type: 'error' });
    }
  };

  const handleDeleteLocation = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa địa điểm này? Các tour thuộc địa điểm này cũng sẽ bị xóa.')) return;
    try {
      await axiosClient.delete(`/provinces/${id}`);
      fetchProvinces();
      setToastMessage({ title: 'Thành công', message: `Đã xóa địa điểm thành công`, type: 'success' });
    } catch (err) {
      setToastMessage({ title: 'Lỗi', message: 'Lỗi khi xóa địa điểm', type: 'error' });
    }
  };

  const [modalDescription, setModalDescription] = useState('');
  const [modalIsActive, setModalIsActive] = useState(true);
  const [modalImage, setModalImage] = useState('');

  const handleSaveModal = async () => {
    try {
      if (editingLocation) {
        await axiosClient.put(`/provinces/${editingLocation.id}`, {
          name: modalName,
          description: modalDescription,
          is_active: modalIsActive,
          image: modalImage
        });
        setToastMessage({ title: 'Thành công', message: `Đã cập nhật địa điểm "${modalName}"`, type: 'success' });
      } else {
        await axiosClient.post('/provinces/', {
          name: modalName,
          description: modalDescription,
          is_active: modalIsActive,
          image: modalImage
        });
        setToastMessage({ title: 'Thành công', message: `Đã thêm địa điểm mới "${modalName}"`, type: 'success' });
      }
      fetchProvinces();
      handleCloseModal();
    } catch (err) {
      setToastMessage({ title: 'Lỗi', message: 'Lỗi khi lưu dữ liệu', type: 'error' });
    }
  };

  const handleOpenModal = (location: any = null) => {
    setEditingLocation(location);
    setModalName(location ? location.name : '');
    setModalDescription(location ? (location.description || '') : '');
    setModalIsActive(location ? location.is_active : true);
    setModalImage(location ? (location.image || '') : '');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLocation(null);
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
          <h1 className="text-[24px] font-bold text-slate-800">Quản lý Tỉnh/thành phố</h1>
          <p className="text-[13px] text-slate-500 mt-1">Thêm mới, cập nhật và quản lý các điểm đến du lịch.</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); handleOpenModal(); }}
          className="bg-[#ff5b00] hover:bg-[#e05000] text-white font-bold py-2.5 px-4 rounded-lg text-[13px] flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Thêm địa điểm mới
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex items-center justify-between">
        <div className="relative w-full md:w-[350px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên tỉnh/thành phố..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00] rounded-lg text-[13px] outline-none transition-all"
          />
        </div>

        <div className="hidden md:flex items-center gap-4 text-[13px] text-slate-500 font-medium">
          <div>Tổng số: <span className="text-slate-800 font-bold">{filteredLocations.length}</span></div>
          <div className="w-1 h-1 rounded-full bg-slate-300"></div>
          <div>Hoạt động: <span className="text-emerald-600 font-bold">{filteredLocations.filter(l => l.is_active).length}</span></div>
          <div className="w-1 h-1 rounded-full bg-slate-300"></div>
          <div>Đang ẩn: <span className="text-slate-400 font-bold">{filteredLocations.filter(l => !l.is_active).length}</span></div>
        </div>
      </div>

      {/* Table List View */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[13px] uppercase font-bold">
                <th className="py-4 px-6 font-semibold w-[60px] text-center">STT</th>
                <th className="py-4 px-6 font-semibold">Tỉnh/thành phố</th>
                <th className="py-4 px-6 font-semibold">Dịch vụ</th>
                <th className="py-4 px-6 font-semibold">Trạng thái</th>
                <th className="py-4 px-6 w-[140px] text-center font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLocations.map((location, index) => (
                <tr
                  key={location.id}
                  onClick={() => handleOpenModal(location)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-6 text-center text-slate-500 font-medium">{index + 1}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-100 bg-slate-100 relative">
                        <img
                          src={location.image || 'https://images.unsplash.com/photo-1544735716-3920e6e41540?w=800&q=80'}
                          alt={location.name}
                          className={`w-full h-full object-cover ${!location.is_active ? 'grayscale opacity-70' : ''}`}
                        />
                      </div>
                      <div>
                        <div className="font-bold text-[15px] text-slate-800 mb-0.5 group-hover:text-[#ff5b00] transition-colors">{location.name}</div>
                        <div className="text-[13px] text-slate-500 line-clamp-1">{location.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[13px]">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                      <span className="flex items-center gap-1.5 text-slate-600 bg-slate-100 px-2 py-1 rounded-md font-medium whitespace-nowrap"><Map className="w-3.5 h-3.5" /> {location.tours_count || 0} Tours</span>
                      <span className="flex items-center gap-1.5 text-slate-600 bg-slate-100 px-2 py-1 rounded-md font-medium whitespace-nowrap"><Ticket className="w-3.5 h-3.5" /> {location.tickets_count || 0} Vé</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {location.is_active ? (
                      <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-1 rounded-md text-[12px] font-bold whitespace-nowrap">
                        <Eye className="w-3.5 h-3.5" /> Hiển thị
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-500 border border-slate-200 px-2.5 py-1 rounded-md text-[12px] font-bold whitespace-nowrap">
                        <EyeOff className="w-3.5 h-3.5" /> Đã ẩn
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleOpenModal(location)}
                        className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-[#0084ff] hover:border-[#0084ff] hover:bg-blue-50 flex items-center justify-center transition-colors shadow-sm"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleStatus(location.id)}
                        className={`w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center transition-colors shadow-sm ${location.is_active
                            ? 'text-slate-500 hover:text-orange-500 hover:border-orange-500 hover:bg-orange-50'
                            : 'text-slate-500 hover:text-emerald-600 hover:border-emerald-600 hover:bg-emerald-50'
                          }`}
                        title={location.is_active ? 'Ẩn' : 'Hiện'}
                      >
                        {location.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteLocation(location.id)}
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

          {filteredLocations.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p>Không tìm thấy địa điểm nào phù hợp.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={handleCloseModal}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">

            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-[18px] font-bold text-slate-800">
                {editingLocation ? 'Chỉnh sửa địa điểm' : 'Thêm địa điểm mới'}
              </h2>
              <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-5">

              {/* Image Upload */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-[13px] font-bold text-slate-700">Hình ảnh địa điểm</label>
                  <span className="text-[12px] text-slate-500">Tỉ lệ 4:3</span>
                </div>

                <div className="flex gap-3">
                  <div className="relative w-32 h-24 rounded-lg overflow-hidden group border border-slate-200 shrink-0 bg-slate-50 flex items-center justify-center">
                    <input
                      type="file"
                      accept="image/*"
                      id="location-image-upload"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setModalImage(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {modalImage ? (
                      <>
                        <img src={modalImage} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <label htmlFor="location-image-upload" className="cursor-pointer p-1.5 bg-white/20 hover:bg-white/40 rounded-full transition-colors text-white" title="Thay đổi">
                            <Edit className="w-4 h-4" />
                          </label>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setModalImage('');
                            }}
                            className="p-1.5 bg-white/20 hover:bg-red-500/80 rounded-full transition-colors text-white"
                            title="Xóa ảnh"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <label htmlFor="location-image-upload" className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 hover:text-[#ff5b00] hover:bg-orange-50 transition-colors cursor-pointer">
                        <Plus className="w-6 h-6 mb-1" />
                        <span className="text-[11px] font-medium">Thêm ảnh</span>
                      </label>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">Ảnh tự động crop (object-cover) để vừa đúng khung tỷ lệ mà không bị méo hình.</p>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2">Tên Tỉnh/thành phố <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={modalName}
                  onChange={(e) => setModalName(e.target.value)}
                  placeholder="VD: Đà Lạt"
                  className="w-full border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00] transition-shadow"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2">Mô tả ngắn</label>
                <textarea
                  rows={3}
                  value={modalDescription}
                  onChange={(e) => setModalDescription(e.target.value)}
                  placeholder="VD: Thành phố ngàn hoa..."
                  className="w-full border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00] transition-shadow resize-none"
                ></textarea>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex-1">
                  <div className="font-bold text-[13px] text-slate-800 mb-0.5">Hiển thị công khai</div>
                  <div className="text-[12px] text-slate-500">Khách hàng có thể tìm kiếm và xem các dịch vụ tại địa điểm này.</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={modalIsActive} onChange={(e) => setModalIsActive(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0084ff]"></div>
                </label>
              </div>

            </div>

            <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-5 py-2.5 rounded-lg text-[13px] font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSaveModal}
                className="px-5 py-2.5 rounded-lg text-[13px] font-bold text-white bg-[#ff5b00] hover:bg-[#e05000] shadow-sm transition-colors"
              >
                {editingLocation ? 'Lưu thay đổi' : 'Tạo mới'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
