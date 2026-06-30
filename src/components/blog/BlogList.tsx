import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import axiosClient from '../../api/axios';

const fallbackImage = 'https://images.unsplash.com/photo-1528127269322-53982823b123?auto=format&fit=crop&w=1200&q=80';

export default function BlogList() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axiosClient.get('/blogs/public');
        setBlogs(res.data || []);
      } catch (error) {
        setBlogs([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (isLoading) {
    return <div className="text-center py-10 text-slate-500">Đang tải bài viết...</div>;
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-xl">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <div className="font-bold text-slate-700">Chưa có bài viết nào được xuất bản</div>
        <p className="text-[13px] text-slate-500 mt-1">Các bài viết đã xuất bản trong admin sẽ hiển thị tại đây.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogs.map((blog, index) => (
        <motion.article 
          key={blog.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col group"
        >
          <Link to={`/blog/${blog.slug}`} className="block relative h-[220px] overflow-hidden">
            <img 
              src={blog.cover_image || fallbackImage} 
              alt={blog.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {blog.is_featured && (
              <div className="absolute top-4 left-4 bg-[#ff5b00] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Nổi bật
              </div>
            )}
          </Link>
          
          <div className="p-6 flex flex-col flex-1">
            <div className="flex items-center gap-4 text-[12px] text-slate-500 mb-3">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(blog.published_at || blog.created_at).toLocaleDateString('vi-VN')}
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                {blog.author_name || 'DITRAVEL'}
              </div>
            </div>
            
            <Link to={`/blog/${blog.slug}`} className="block mb-3">
              <h2 className="text-[18px] font-bold text-slate-800 group-hover:text-[#0084ff] transition-colors line-clamp-2 leading-snug">
                {blog.title}
              </h2>
            </Link>
            
            <p className="text-[14px] text-slate-600 line-clamp-3 mb-5 leading-relaxed">
              {blog.excerpt || 'Bài viết từ DiTravel.'}
            </p>
            
            <div className="mt-auto pt-4 border-t border-slate-100">
              <Link to={`/blog/${blog.slug}`} className="inline-flex items-center gap-1 text-[13px] font-bold text-[#ff5b00] group-hover:gap-2 transition-all">
                Đọc tiếp <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
