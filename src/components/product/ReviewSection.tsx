import React, { useEffect, useMemo, useState } from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import ReviewForm from './ReviewForm';
import axiosClient from '../../api/axios';

type Review = {
  id: string;
  author: string;
  date: string;
  rating: number;
  content: string;
  adminReply?: string | null;
  likes: number;
};

type ReviewSectionProps = {
  productId: string;
  productName: string;
};

const mapReview = (review: any): Review => ({
  id: review.id,
  author: review.user_name || 'Khách hàng',
  date: review.created_at ? new Date(review.created_at).toLocaleString('vi-VN') : '',
  rating: Number(review.rating || 0),
  content: review.content || '',
  adminReply: review.admin_reply || null,
  likes: 0,
});

export default function ReviewSection({ productId, productName }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchReviews = async () => {
    if (!productId) return;
    setIsLoading(true);
    try {
      const res = await axiosClient.get(`/reviews/product/${productId}`);
      setReviews((res.data || []).map(mapReview));
    } catch (error) {
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return '0.0';
    const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  }, [reviews]);

  const handleAddReview = async (newReview: any) => {
    setMessage('');
    try {
      await axiosClient.post('/reviews/', {
        product_id: productId,
        product_name: productName,
        user_name: newReview.userName || 'Khách hàng DiTravel',
        rating: newReview.rating,
        content: newReview.content,
        status: 'pending',
      });
      setMessage('Đánh giá của bạn đã được gửi và đang chờ duyệt.');
    } catch (error: any) {
      setMessage(error.response?.data?.detail || 'Không thể gửi đánh giá. Vui lòng thử lại.');
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[20px] font-bold text-slate-800">Đánh giá từ khách hàng</h3>
      </div>

      <div className="flex items-center gap-6 mb-8 p-6 bg-orange-50 border border-orange-100 rounded-xl">
        <div className="text-center shrink-0">
          <div className="text-[36px] font-bold text-[#ff5b00] leading-none mb-1">{averageRating}</div>
          <div className="flex text-[#ff5b00] justify-center mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className={`w-4 h-4 ${star <= Math.round(Number(averageRating)) ? 'fill-current' : 'text-orange-200'}`} />
            ))}
          </div>
          <div className="text-[12px] text-slate-500">{reviews.length} đánh giá đã duyệt</div>
        </div>
        
        <div className="flex-1 max-w-[300px]">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter(r => r.rating === star).length;
            const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-[12px] mb-1">
                <span className="w-2 text-slate-600">{star}</span>
                <Star className="w-3 h-3 text-slate-400 fill-current" />
                <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#ff5b00]" style={{ width: `${percent}%` }} />
                </div>
                <span className="w-6 text-right text-slate-500">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-6 mb-10">
        {isLoading ? (
          <div className="text-[14px] text-slate-500 py-6">Đang tải đánh giá...</div>
        ) : reviews.length === 0 ? (
          <div className="text-[14px] text-slate-500 py-6 border border-dashed border-slate-200 rounded-xl text-center">
            Chưa có đánh giá nào được duyệt cho sản phẩm này.
          </div>
        ) : reviews.map((review) => (
          <div key={review.id} className="border-b border-slate-100 pb-6 last:border-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-[14px]">
                  {review.author.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-[14px] text-slate-800">{review.author}</div>
                  <div className="flex items-center gap-2">
                    <div className="flex text-[#ff5b00]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'fill-current' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-400">{review.date}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-[14px] text-slate-600 leading-relaxed mb-3 pl-13">
              {review.content}
            </p>

            {review.adminReply && (
              <div className="ml-13 mb-3 rounded-lg bg-slate-50 border border-slate-100 p-3 text-[13px] text-slate-600">
                <span className="font-bold text-slate-800">Phản hồi từ DiTravel:</span> {review.adminReply}
              </div>
            )}
            
            <div className="pl-13">
              <button className="flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-[#0084ff] transition-colors">
                <ThumbsUp className="w-3.5 h-3.5" />
                Hữu ích ({review.likes})
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 pt-8 border-t border-slate-200">
        <h3 className="text-[18px] font-bold text-slate-800 mb-4">Để lại đánh giá của bạn</h3>
        {message && (
          <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-[13px] text-blue-700">
            {message}
          </div>
        )}
        <ReviewForm onSubmit={handleAddReview} />
      </div>
    </div>
  );
}
