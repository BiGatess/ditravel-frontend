import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, Filter, Eye, X, CheckCircle, AlertTriangle, 
  Trash2, Star, Check, EyeOff, MessageSquare
} from 'lucide-react';
import Toast, { ToastMessage, ToastType } from '../../components/admin/Toast';
import axiosClient from '../../api/axios';

interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  productName: string;
  rating: number;
  content: string;
  createdAt: string;
  status: 'approved' | 'pending' | 'hidden';
  adminReply: string | null;
}

const getAvatarUrl = (name: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'DiTravel')}&background=f1f5f9&color=475569`;

const mapReview = (review: any): Review => ({
  id: review.id,
  userName: review.user_name || 'Khách hàng',
  userAvatar: review.user_avatar || getAvatarUrl(review.user_name || 'Khách hàng'),
  productName: review.product_name || 'Sản phẩm',
  rating: Number(review.rating || 0),
  content: review.content || '',
  createdAt: review.created_at,
  status: review.status,
  adminReply: review.admin_reply || null,
});

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isRatingFilterOpen, setIsRatingFilterOpen] = useState(false);
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const ratingFilterRef = useRef<HTMLDivElement>(null);
  const statusFilterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ratingFilterRef.current && !ratingFilterRef.current.contains(event.target as Node)) {
        setIsRatingFilterOpen(false);
      }
      if (statusFilterRef.current && !statusFilterRef.current.contains(event.target as Node)) {
        setIsStatusFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const ratingOptions = [
    { v: 'all', l: 'Tất cả số sao' },
    { v: '5', l: '5 Sao' },
    { v: '4', l: '4 Sao' },
    { v: '3', l: '3 Sao' },
    { v: '2', l: '2 Sao' },
    { v: '1', l: '1 Sao' }
  ];

  const statusOptions = [
    { v: 'all', l: 'Tất cả trạng thái' },
    { v: 'pending', l: 'Chờ duyệt' },
    { v: 'approved', l: 'Đang hiển thị' },
    { v: 'hidden', l: 'Đã ẩn' }
  ];

  // Modal State
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Toast & Confirm
  const [toastMessage, setToastMessage] = useState<{title: string, message: string, type: 'success' | 'error'} | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const showToast = (title: string, message: string, type: ToastType = 'success') => {
    setToastMessage({ title, message, type });
  };

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await axiosClient.get('/reviews/');
      setReviews((res.data || []).map(mapReview));
    } catch (error: any) {
      showToast('Lỗi tải đánh giá', error.response?.data?.detail || 'Không thể tải danh sách đánh giá.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filteredReviews = useMemo(() => {
    let result = [...reviews];
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => 
        r.content.toLowerCase().includes(q) || 
        r.productName.toLowerCase().includes(q) ||
        r.userName.toLowerCase().includes(q)
      );
    }
    
    if (ratingFilter !== 'all') {
      result = result.filter(r => r.rating === parseInt(ratingFilter));
    }

    if (statusFilter !== 'all') {
      result = result.filter(r => r.status === statusFilter);
    }
    
    // Sort by latest
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return result;
  }, [reviews, searchQuery, ratingFilter, statusFilter]);

  // Stats
  const totalReviews = reviews.length;
  const pendingReviews = reviews.filter(r => r.status === 'pending').length;
  const averageRating = totalReviews > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1) 
    : '0.0';

  const updateReviewStatus = async (id: string, status: Review['status']) => {
    try {
      const res = await axiosClient.patch(`/reviews/${id}/status`, { status });
      const updated = mapReview(res.data);
      setReviews(prev => prev.map(r => r.id === id ? updated : r));
      if (selectedReview?.id === id) setSelectedReview(updated);
      return updated;
    } catch (error: any) {
      showToast('Lỗi cập nhật', error.response?.data?.detail || 'Không thể cập nhật trạng thái đánh giá.', 'error');
      return null;
    }
  };

  const handleApprove = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated = await updateReviewStatus(id, 'approved');
    if (updated) showToast('Duyệt thành công', 'Đánh giá đã được hiển thị công khai.');
  };

  const handleToggleHide = async (id: string, currentStatus: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newStatus = currentStatus === 'hidden' ? 'approved' : 'hidden';
    const updated = await updateReviewStatus(id, newStatus as Review['status']);
    if (!updated) return;
    showToast(
      newStatus === 'hidden' ? 'Đã ẩn đánh giá' : 'Đã hiển thị đánh giá', 
      newStatus === 'hidden' ? 'Đánh giá đã bị ẩn khỏi hệ thống.' : 'Đánh giá đã được hiển thị công khai.'
    );
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosClient.delete(`/reviews/${id}`);
      setReviews(prev => prev.filter(r => r.id !== id));
      setConfirmDeleteId(null);
      showToast('Xóa thành công', 'Đánh giá đã bị xóa vĩnh viễn.', 'delete');
      if (selectedReview?.id === id) setIsModalOpen(false);
    } catch (error: any) {
      showToast('Lỗi xóa đánh giá', error.response?.data?.detail || 'Không thể xóa đánh giá.', 'error');
    }
  };

  const handleOpenModal = (review: Review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  // Helper to render stars
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star 
            key={star} 
            className={`w-3.5 h-3.5 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-slate-100 text-slate-200'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 h-full flex flex-col bg-slate-50 relative">
      
      {/* Toast Notification */}
      <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Toast Notification */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h1 className="text-[24px] font-bold text-slate-800">Quản lý Đánh giá</h1>
          <p className="text-[14px] text-slate-500 mt-1">Kiểm duyệt bình luận và phản hồi của khách hàng về sản phẩm.</p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden divide-x divide-slate-100">
          <div className="px-5 py-3">
            <div className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tổng đánh giá</div>
            <div className="text-[22px] font-black text-slate-800 leading-none">{totalReviews}</div>
          </div>
          <div className="px-5 py-3 bg-yellow-50/50">
            <div className="text-[12px] font-bold text-yellow-600 uppercase tracking-wider mb-1.5">Trung bình sao</div>
            <div className="text-[22px] font-black text-yellow-600 leading-none flex items-center gap-1">
              {averageRating} <Star className="w-4 h-4 fill-yellow-500 text-yellow-500 relative -top-0.5" />
            </div>
          </div>
          <div className="px-5 py-3 bg-orange-50/50">
            <div className="text-[12px] font-bold text-[#ff5b00] uppercase tracking-wider mb-1.5">Chờ duyệt</div>
            <div className="text-[22px] font-black text-[#ff5b00] leading-none">{pendingReviews}</div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Tìm theo nội dung đánh giá, khách hàng, sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-[14px] focus:outline-none focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00] transition-colors"
          />
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-[150px]" ref={ratingFilterRef}>
            <button 
              onClick={() => setIsRatingFilterOpen(!isRatingFilterOpen)}
              className={`flex items-center justify-between w-full bg-white border border-slate-300 text-slate-700 text-[14px] px-4 py-2 outline-none transition-colors ${isRatingFilterOpen ? 'rounded-t-lg' : 'rounded-lg hover:border-slate-400'}`}
            >
              <span className="font-medium truncate">{ratingOptions.find(o => o.v === ratingFilter)?.l}</span>
              <Filter className={`w-4 h-4 text-slate-400 shrink-0 transition-colors ${isRatingFilterOpen ? 'text-[#ff5b00]' : ''}`} />
            </button>
            {isRatingFilterOpen && (
              <div className="absolute top-full left-0 w-full bg-white border border-t-0 border-slate-300 rounded-b-lg shadow-lg py-1 z-50">
                {ratingOptions.filter(opt => opt.v !== ratingFilter).map(opt => (
                  <button
                    key={opt.v}
                    onClick={() => {
                      setRatingFilter(opt.v);
                      setIsRatingFilterOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-[14px] text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    {opt.l}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative w-full md:w-[170px]" ref={statusFilterRef}>
            <button 
              onClick={() => setIsStatusFilterOpen(!isStatusFilterOpen)}
              className={`flex items-center justify-between w-full bg-white border border-slate-300 text-slate-700 text-[14px] px-4 py-2 outline-none transition-colors ${isStatusFilterOpen ? 'rounded-t-lg' : 'rounded-lg hover:border-slate-400'}`}
            >
              <span className="font-medium truncate">{statusOptions.find(o => o.v === statusFilter)?.l}</span>
              <Filter className={`w-4 h-4 text-slate-400 shrink-0 transition-colors ${isStatusFilterOpen ? 'text-[#ff5b00]' : ''}`} />
            </button>
            {isStatusFilterOpen && (
              <div className="absolute top-full left-0 w-full bg-white border border-t-0 border-slate-300 rounded-b-lg shadow-lg py-1 z-50">
                {statusOptions.filter(opt => opt.v !== statusFilter).map(opt => (
                  <button
                    key={opt.v}
                    onClick={() => {
                      setStatusFilter(opt.v);
                      setIsStatusFilterOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-[14px] text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    {opt.l}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {(searchQuery || ratingFilter !== 'all' || statusFilter !== 'all') && (
            <button 
              onClick={() => { setSearchQuery(''); setRatingFilter('all'); setStatusFilter('all'); }}
              className="px-4 py-2 text-[14px] font-medium text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              Xóa lọc
            </button>
          )}
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-[13px] uppercase tracking-wider border-b border-slate-200">
                <th className="py-4 px-6 font-bold w-[60px] text-center">STT</th>
                <th className="py-4 px-6 font-bold w-[250px]">Người đánh giá</th>
                <th className="py-4 px-6 font-bold">Nội dung đánh giá</th>
                <th className="py-4 px-6 font-bold w-[160px]">Thời gian</th>
                <th className="py-4 px-6 font-bold w-[140px] text-center">Trạng thái</th>
                <th className="py-4 px-6 font-bold w-[160px] text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[14px] text-slate-500">
                    Đang tải đánh giá...
                  </td>
                </tr>
              ) : filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <MessageSquare className="w-12 h-12 mb-3 opacity-20" />
                      <p className="text-[14px]">Không tìm thấy đánh giá nào phù hợp.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review, index) => (
                  <tr key={review.id} className={`transition-colors group ${review.status === 'pending' ? 'bg-orange-50/30' : 'hover:bg-slate-50/50'}`}>
                    <td className="py-4 px-6 text-center text-slate-500 font-medium">{index + 1}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img src={review.userAvatar} alt={review.userName} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                        <div>
                          <div className="font-bold text-[14px] text-slate-800">{review.userName}</div>
                          <div className="text-[12px] text-slate-500 mt-0.5 line-clamp-1" title={review.productName}>{review.productName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1.5">
                        {renderStars(review.rating)}
                        <div className="text-[13px] text-slate-700 line-clamp-2 max-w-2xl leading-relaxed">
                          {review.content}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[13px] text-slate-500">
                      <div>{new Date(review.createdAt).toLocaleDateString('vi-VN')}</div>
                      <div className="text-[11px] mt-0.5">{new Date(review.createdAt).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {review.status === 'pending' && (
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[12px] font-bold bg-orange-100 text-[#ff5b00]">
                          Chờ duyệt
                        </span>
                      )}
                      {review.status === 'approved' && (
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[12px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                          Hiển thị
                        </span>
                      )}
                      {review.status === 'hidden' && (
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[12px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                          Đã ẩn
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right relative">
                      <div className="flex items-center justify-end gap-2">
                        {review.status === 'pending' && (
                          <button 
                            onClick={(e) => handleApprove(review.id, e)}
                            className="p-1.5 text-white bg-emerald-500 hover:bg-emerald-600 rounded transition-colors shadow-sm"
                            title="Duyệt đánh giá"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        
                        {review.status !== 'pending' && (
                          <button 
                            onClick={(e) => handleToggleHide(review.id, review.status, e)}
                            className={`p-1.5 rounded transition-colors ${review.status === 'hidden' ? 'bg-slate-100 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50' : 'bg-white text-slate-400 hover:text-orange-500 hover:bg-orange-50 border border-transparent hover:border-orange-100'}`}
                            title={review.status === 'hidden' ? 'Hiển thị đánh giá' : 'Ẩn đánh giá'}
                          >
                            {review.status === 'hidden' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                        )}
                        
                        <button 
                          onClick={() => handleOpenModal(review)}
                          className="p-1.5 text-slate-400 hover:text-[#0084ff] bg-white hover:bg-blue-50 rounded transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {confirmDeleteId === review.id ? (
                          <div className="flex items-center bg-white border border-slate-200 rounded px-2 py-1 gap-2 absolute right-8 z-10 shadow-lg animate-in fade-in zoom-in-95">
                            <span className="text-[12px] font-bold text-red-600 whitespace-nowrap">Xóa vĩnh viễn?</span>
                            <button onClick={() => handleDelete(review.id)} className="text-[11px] text-white px-2 py-0.5 rounded bg-red-600 hover:bg-red-700">Có</button>
                            <button onClick={() => setConfirmDeleteId(null)} className="text-[11px] text-slate-500 hover:text-slate-700">Hủy</button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setConfirmDeleteId(review.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 bg-white hover:bg-red-50 rounded transition-colors"
                            title="Xóa đánh giá"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail */}
      {isModalOpen && selectedReview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
              <h2 className="text-[18px] font-bold text-slate-800 flex items-center gap-2">
                Chi tiết đánh giá
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 flex flex-col gap-6">
              {/* Product Info */}
              <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
                <div className="text-[12px] font-bold text-blue-600 uppercase mb-1">Sản phẩm được đánh giá</div>
                <div className="text-[16px] font-bold text-slate-800">{selectedReview.productName}</div>
              </div>

              {/* Review Content */}
              <div className="flex gap-4">
                <img src={selectedReview.userAvatar} alt={selectedReview.userName} className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-[15px] text-slate-800">{selectedReview.userName}</div>
                    <div className="text-[12px] text-slate-500">
                      {new Date(selectedReview.createdAt).toLocaleString('vi-VN')}
                    </div>
                  </div>
                  <div className="mb-3">
                    {renderStars(selectedReview.rating)}
                  </div>
                  <div className="text-[15px] text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {selectedReview.content}
                  </div>
                </div>
              </div>
              
              {/* Actions & Status */}
              <div className="mt-4 pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-medium text-slate-600">Trạng thái hiện tại:</span>
                  {selectedReview.status === 'pending' && <span className="px-3 py-1 bg-orange-100 text-[#ff5b00] rounded-md text-[13px] font-bold">Chờ duyệt</span>}
                  {selectedReview.status === 'approved' && <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-md text-[13px] font-bold">Hiển thị</span>}
                  {selectedReview.status === 'hidden' && <span className="px-3 py-1 bg-slate-100 text-slate-500 border border-slate-200 rounded-md text-[13px] font-bold">Đã ẩn</span>}
                </div>
                
                <div className="flex items-center gap-3">
                  {selectedReview.status === 'pending' && (
                    <button 
                      onClick={() => handleApprove(selectedReview.id)}
                      className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[13px] font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" /> Duyệt ngay
                    </button>
                  )}
                  {selectedReview.status !== 'pending' && (
                    <button 
                      onClick={() => handleToggleHide(selectedReview.id, selectedReview.status)}
                      className={`px-5 py-2.5 text-[13px] font-bold rounded-lg transition-colors flex items-center gap-2 ${selectedReview.status === 'hidden' ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                    >
                      {selectedReview.status === 'hidden' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />} 
                      {selectedReview.status === 'hidden' ? 'Khôi phục hiển thị' : 'Ẩn đánh giá này'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
