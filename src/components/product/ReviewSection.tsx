import React, { useState } from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import { motion } from 'motion/react';
import ReviewForm from './ReviewForm';

const INITIAL_REVIEWS = [
  {
    id: '1',
    author: 'ĐÀM QUANG THIỆN',
    date: '16/12/2025 6:24 SA',
    rating: 4,
    content: 'Ổn. Chất lượng dịch vụ tương xứng với giá tiền. Hướng dẫn viên nhiệt tình nhưng thời gian ở Fantasy Park hơi ít.',
    images: [],
    likes: 12
  },
  {
    id: '2',
    author: 'NGUYỄN THỊ THU NGA',
    date: '10/11/2025 2:15 CH',
    rating: 5,
    content: 'Gia đình mình đã có một chuyến đi tuyệt vời. Cáp treo rất êm, buffet trưa cực kỳ phong phú. Rất đáng tiền!',
    images: ['https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80&w=200'],
    likes: 45
  }
];

export default function ReviewSection() {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);

  const handleAddReview = (newReview: any) => {
    setReviews([...reviews, newReview]); // Add to bottom (or top, but since form is at bottom, maybe add to bottom)
  };

  const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
  const averageRating = (totalRating / reviews.length).toFixed(1);

  return (
    <div className="mt-8 pt-8 border-t border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[20px] font-bold text-slate-800">Đánh giá từ khách hàng</h3>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-6 mb-8 p-6 bg-orange-50 border border-orange-100 rounded-xl">
        <div className="text-center shrink-0">
          <div className="text-[36px] font-bold text-[#ff5b00] leading-none mb-1">{averageRating}</div>
          <div className="flex text-[#ff5b00] justify-center mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className={`w-4 h-4 ${star <= Math.round(Number(averageRating)) ? 'fill-current' : 'text-orange-200'}`} />
            ))}
          </div>
          <div className="text-[12px] text-slate-500">{reviews.length} đánh giá</div>
        </div>
        
        <div className="flex-1 max-w-[300px]">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter(r => r.rating === star).length;
            const percent = (count / reviews.length) * 100;
            return (
              <div key={star} className="flex items-center gap-2 text-[12px] mb-1">
                <span className="w-2 text-slate-600">{star}</span>
                <Star className="w-3 h-3 text-slate-400 fill-current" />
                <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#ff5b00]" style={{ width: `${percent}%` }}></div>
                </div>
                <span className="w-6 text-right text-slate-500">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* List */}
      <div className="space-y-6 mb-10">
        {reviews.map((review) => (
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

            {review.images && review.images.length > 0 && (
              <div className="flex gap-2 mb-3 pl-13">
                {review.images.map((img: string, idx: number) => (
                  <img key={idx} src={img} alt="Review" className="w-20 h-20 object-cover rounded-lg border border-slate-200" />
                ))}
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

      {/* Form */}
      <div className="mt-10 pt-8 border-t border-slate-200">
        <h3 className="text-[18px] font-bold text-slate-800 mb-4">Để lại đánh giá của bạn</h3>
        <ReviewForm onSubmit={handleAddReview} />
      </div>
    </div>
  );
}
