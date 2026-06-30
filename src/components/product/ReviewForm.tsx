import React, { useState } from 'react';
import { Star, Upload, X } from 'lucide-react';

export default function ReviewForm({ onSubmit }: { onSubmit: (review: any) => void }) {
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Simulate image upload by creating local object URLs
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((file) => URL.createObjectURL(file as File));
      setImages(prev => [...prev, ...newImages].slice(0, 3)); // Max 3 images
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    onSubmit({
      userName: userName.trim() || 'Khách hàng DiTravel',
      rating,
      content,
      images
    });
    
    // Reset form
    setUserName('');
    setContent('');
    setImages([]);
    setRating(5);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8">
      <h4 className="font-bold text-slate-800 mb-3">Đánh giá chuyến đi của bạn</h4>
      
      <div className="mb-4">
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Tên hiển thị của bạn"
          className="w-full border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff]"
        />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-[14px] text-slate-600 mr-2">Chất lượng:</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            >
              <Star 
                className={`w-6 h-6 ${
                  star <= (hoverRating || rating) 
                    ? 'fill-[#ff5b00] text-[#ff5b00]' 
                    : 'text-slate-300'
                } transition-colors`} 
              />
            </button>
          ))}
        </div>
        <span className="text-[13px] text-[#ff5b00] font-medium ml-2">
          {rating === 5 ? 'Tuyệt vời' : rating === 4 ? 'Rất tốt' : rating === 3 ? 'Bình thường' : rating === 2 ? 'Kém' : 'Rất kém'}
        </span>
      </div>

      <div className="mb-4">
        <textarea
          required
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ này (tối thiểu 10 ký tự)..."
          className="w-full border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff] resize-none"
        ></textarea>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <input 
            type="file" 
            id="review-images" 
            multiple 
            accept="image/*" 
            className="hidden" 
            onChange={handleImageUpload}
          />
          <label 
            htmlFor="review-images"
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-[13px] text-slate-600 font-medium cursor-pointer hover:bg-white transition-colors"
          >
            <Upload className="w-4 h-4" />
            Thêm ảnh đính kèm
          </label>
          <span className="text-[11px] text-slate-400 ml-3">Tối đa 3 ảnh</span>
        </div>

        <button 
          type="submit" 
          disabled={!content.trim()}
          className="bg-[#ff5b00] text-white px-6 py-2 rounded-lg font-bold text-[14px] hover:bg-[#e05000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Gửi đánh giá
        </button>
      </div>

      {images.length > 0 && (
        <div className="flex gap-3 mt-4">
          {images.map((img, index) => (
            <div key={index} className="relative w-16 h-16 rounded-md overflow-hidden border border-slate-200">
              <img src={img} alt={`Upload ${index}`} className="w-full h-full object-cover" />
              <button 
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-0 right-0 bg-black/50 text-white p-0.5 rounded-bl-md hover:bg-red-500 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </form>
  );
}
