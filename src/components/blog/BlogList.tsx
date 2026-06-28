import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const MOCK_BLOGS = [
  {
    id: '1',
    title: 'Kinh nghiệm du lịch Đà Lạt tự túc từ A-Z năm 2026',
    excerpt: 'Đà Lạt luôn là điểm đến hấp dẫn với khí hậu mát mẻ quanh năm. Cùng khám phá những địa điểm ăn chơi, sống ảo mới nhất nhé.',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=2000',
    category: 'Kinh nghiệm',
    date: '28/06/2026',
    author: 'DITRAVEL Team'
  },
  {
    id: '2',
    title: 'Top 5 địa điểm săn mây tuyệt đẹp không thể bỏ lỡ',
    excerpt: 'Nếu bạn là người yêu thích sự lãng mạn của biển mây bồng bềnh, đây chắc chắn là những địa điểm bạn phải ghi chú lại ngay.',
    image: 'https://images.unsplash.com/photo-1544735716-3920e6e41540?q=80&w=2000',
    category: 'Điểm đến',
    date: '25/06/2026',
    author: 'Minh Nguyễn'
  },
  {
    id: '3',
    title: 'Review chi tiết Sun World Bà Nà Hills cập nhật mới nhất',
    excerpt: 'Có gì hot tại Bà Nà Hills năm nay? Cùng xem ngay bảng giá vé, lịch trình vui chơi và những góc check-in xịn sò nhất.',
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=2000',
    category: 'Review',
    date: '20/06/2026',
    author: 'Phương Thảo'
  }
];

export default function BlogList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {MOCK_BLOGS.map((blog, index) => (
        <motion.article 
          key={blog.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col group"
        >
          <Link to={`/blog/${blog.id}`} className="block relative h-[220px] overflow-hidden">
            <img 
              src={blog.image} 
              alt={blog.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4 bg-[#ff5b00] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {blog.category}
            </div>
          </Link>
          
          <div className="p-6 flex flex-col flex-1">
            <div className="flex items-center gap-4 text-[12px] text-slate-500 mb-3">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {blog.date}
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                {blog.author}
              </div>
            </div>
            
            <Link to={`/blog/${blog.id}`} className="block mb-3">
              <h2 className="text-[18px] font-bold text-slate-800 group-hover:text-[#0084ff] transition-colors line-clamp-2 leading-snug">
                {blog.title}
              </h2>
            </Link>
            
            <p className="text-[14px] text-slate-600 line-clamp-3 mb-5 leading-relaxed">
              {blog.excerpt}
            </p>
            
            <div className="mt-auto pt-4 border-t border-slate-100">
              <Link to={`/blog/${blog.id}`} className="inline-flex items-center gap-1 text-[13px] font-bold text-[#ff5b00] group-hover:gap-2 transition-all">
                Đọc tiếp <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
