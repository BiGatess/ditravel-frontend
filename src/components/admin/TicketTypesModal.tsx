import React, { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, AlertTriangle, CheckCircle, Ticket } from 'lucide-react';
import axiosClient from '../../api/axios';

type TicketTypesModalProps = {
  product: any;
  onClose: () => void;
  onChanged?: () => void;
};

export default function TicketTypesModal({ product, onClose, onChanged }: TicketTypesModalProps) {
  const [ticketTypes, setTicketTypes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [editingTicket, setEditingTicket] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [minQuantity, setMinQuantity] = useState(1);
  const [maxQuantity, setMaxQuantity] = useState(10);
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchTicketTypes();
  }, [product.id]);

  const fetchTicketTypes = async () => {
    try {
      setIsLoading(true);
      const res = await axiosClient.get(`/ticket-types/product/${product.id}`);
      setTicketTypes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenForm = (ticket: any = null, defaultName = '') => {
    setEditingTicket(ticket);
    setName(ticket?.name || defaultName);
    setDescription(ticket?.description || '');
    setPrice(ticket?.price ? new Intl.NumberFormat('vi-VN').format(ticket.price) : '');
    setOriginalPrice(ticket?.original_price ? new Intl.NumberFormat('vi-VN').format(ticket.original_price) : '');
    setMinQuantity(ticket?.min_quantity || 1);
    setMaxQuantity(ticket?.max_quantity || 10);
    setIsActive(ticket ? ticket.is_active : true);
    setErrors({});
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTicket(null);
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Vui lòng nhập tên gói';
    if (!price) newErrors.price = 'Vui lòng nhập giá bán';

    if (Object.keys(newErrors).length > 0) {
       setErrors(newErrors);
       return;
    }
    
    const priceNum = parseInt(price.replace(/\./g, ''));
    const origPriceNum = originalPrice ? parseInt(originalPrice.replace(/\./g, '')) : null;

    try {
      const payload = {
        name,
        description,
        price: priceNum,
        original_price: origPriceNum,
        min_quantity: minQuantity,
        max_quantity: maxQuantity,
        is_active: isActive,
        product_id: product.id
      };

      if (editingTicket) {
        await axiosClient.put(`/ticket-types/${editingTicket.id}`, payload);
      } else {
        await axiosClient.post('/ticket-types/', payload);
      }
      
      fetchTicketTypes();
      onChanged?.();
      handleCloseForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa gói dịch vụ này?")) {
      try {
        await axiosClient.delete(`/ticket-types/${id}`);
        fetchTicketTypes();
        onChanged?.();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const activeTicketPrices = ticketTypes
    .filter(ticket => ticket.is_active !== false)
    .map(ticket => Number(ticket.price))
    .filter(price => price > 0);
  const startingPrice = activeTicketPrices.length > 0 ? Math.min(...activeTicketPrices) : Number(product.price || 0);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div>
            <h2 className="text-[18px] font-bold text-slate-800 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-[#ff5b00]" /> Quản lý Gói dịch vụ
            </h2>
            <p className="text-[13px] text-slate-500 mt-0.5">Sản phẩm: {product.title}</p>
            <p className="text-[12px] text-slate-500 mt-1">
              Giá từ đang dùng trên web: <span className="font-bold text-[#ff5b00]">{startingPrice > 0 ? `${startingPrice.toLocaleString('vi-VN')} đ` : 'Chưa có giá'}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {!isFormOpen ? (
            <>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
                <div>
                  <h3 className="font-bold text-[14px] text-slate-700">Danh sách các gói hiện có</h3>
                  <p className="text-[12px] text-slate-500 mt-1">Mỗi dòng là một loại vé thật hiển thị ngoài trang chi tiết.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleOpenForm(null, 'Vé người lớn')}
                    className="bg-white hover:border-[#0084ff] hover:text-[#0084ff] text-slate-700 border border-slate-200 font-bold py-2 px-3 rounded-lg text-[13px] flex items-center gap-2 shadow-sm transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Vé người lớn
                  </button>
                  <button
                    onClick={() => handleOpenForm(null, 'Vé trẻ em')}
                    className="bg-white hover:border-[#0084ff] hover:text-[#0084ff] text-slate-700 border border-slate-200 font-bold py-2 px-3 rounded-lg text-[13px] flex items-center gap-2 shadow-sm transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Vé trẻ em
                  </button>
                  <button 
                    onClick={() => handleOpenForm()}
                    className="bg-[#0084ff] hover:bg-[#0073e6] text-white font-bold py-2 px-4 rounded-lg text-[13px] flex items-center gap-2 shadow-sm transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Gói khác
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-8 text-slate-400">Đang tải...</div>
              ) : ticketTypes.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                  <Ticket className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                  <div className="font-bold text-slate-500">Chưa có gói dịch vụ nào</div>
                  <div className="text-[13px] text-slate-400 mt-1">Hãy thêm gói mới (Ví dụ: Vé người lớn, Vé trẻ em...)</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {ticketTypes.map(ticket => (
                    <div key={ticket.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-slate-800">{ticket.name}</h4>
                          {!ticket.is_active && <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-1.5 py-0.5 rounded">Đang ẩn</span>}
                        </div>
                        <div className="text-[12px] text-slate-500 line-clamp-1">{ticket.description || 'Không có mô tả'}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[#ff5b00]">{ticket.price.toLocaleString('vi-VN')} đ</div>
                        {ticket.original_price && <div className="text-[11px] text-slate-400 line-through">{ticket.original_price.toLocaleString('vi-VN')} đ</div>}
                      </div>
                      <div className="flex items-center gap-2 border-l border-slate-100 pl-4 ml-2">
                        <button 
                          onClick={() => handleOpenForm(ticket)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#0084ff] hover:bg-blue-50 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(ticket.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-[15px] text-slate-800 mb-4">{editingTicket ? 'Sửa Gói dịch vụ' : 'Thêm Gói dịch vụ mới'}</h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Tên gói dịch vụ <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => { setName(e.target.value); if(errors.name) setErrors({...errors, name: ''}); }}
                    placeholder="VD: Vé Người Lớn, Gói VIP..." 
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-[14px] outline-none transition-colors focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff]"
                  />
                  {errors.name && <div className="text-red-500 text-[12px] mt-1">{errors.name}</div>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Giá bán (VND) <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={price}
                      onChange={(e) => { handlePriceChange(e, setPrice); if(errors.price) setErrors({...errors, price: ''}); }}
                      placeholder="VD: 500.000" 
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-[14px] outline-none transition-colors focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff]"
                    />
                    {errors.price && <div className="text-red-500 text-[12px] mt-1">{errors.price}</div>}
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Giá gốc (Tùy chọn)</label>
                    <input 
                      type="text" 
                      value={originalPrice}
                      onChange={(e) => handlePriceChange(e, setOriginalPrice)}
                      placeholder="VD: 600.000" 
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-[14px] outline-none transition-colors focus:border-[#0084ff]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Số lượng tối thiểu <span className="text-red-500">*</span></label>
                    <input 
                      type="number" 
                      value={minQuantity}
                      onChange={(e) => setMinQuantity(parseInt(e.target.value) || 1)}
                      min="1"
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-[14px] outline-none transition-colors focus:border-[#0084ff]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Số lượng tối đa <span className="text-red-500">*</span></label>
                    <input 
                      type="number" 
                      value={maxQuantity}
                      onChange={(e) => setMaxQuantity(parseInt(e.target.value) || 10)}
                      min="1"
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-[14px] outline-none transition-colors focus:border-[#0084ff]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Mô tả (Bao gồm những gì)</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="VD: Bao gồm vé tham quan&#10;Bao gồm xe đưa đón" 
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-[14px] outline-none transition-colors focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff] min-h-[80px]"
                  />
                  <div className="text-[11px] text-slate-400 mt-1">Xuống dòng để tạo danh sách "Bao gồm"</div>
                </div>
                
                <label className="flex items-center gap-3 cursor-pointer group pt-2">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="peer sr-only" 
                    />
                    <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                  </div>
                  <span className="text-[13px] font-bold text-slate-700">Đang hoạt động (Hiển thị ra Web)</span>
                </label>

                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={handleCloseForm} className="px-4 py-2 rounded-lg text-[13px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                    Hủy
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-lg text-[13px] font-bold text-white bg-[#ff5b00] hover:bg-[#e05000] shadow-sm transition-colors">
                    {editingTicket ? 'Cập nhật' : 'Thêm gói mới'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
