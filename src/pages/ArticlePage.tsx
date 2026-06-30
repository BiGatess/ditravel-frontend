import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, User, Facebook, Twitter, Link as LinkIcon, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import axiosClient from '../api/axios';

const fallbackImage = 'https://images.unsplash.com/photo-1528127269322-53982823b123?auto=format&fit=crop&w=1400&q=80';

export default function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      setIsLoading(true);
      setError('');
      try {
        const res = await axiosClient.get(`/blogs/slug/${id}`);
        setArticle(res.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Không tìm thấy bài viết.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (isLoading) {
    return <div className="bg-white min-h-screen flex items-center justify-center text-slate-500">Đang tải bài viết...</div>;
  }

  if (error || !article) {
    return <div className="bg-white min-h-screen flex items-center justify-center text-slate-500">{error || 'Không tìm thấy bài viết.'}</div>;
  }

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      <div className="container mx-auto px-2 max-w-[800px] pt-8">
        <div className="flex items-center flex-wrap gap-2 text-[13px] text-[#0084ff] mb-8">
          <Link to="/" className="hover:underline">Trang chủ</Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <Link to="/blog" className="hover:underline">Cẩm nang du lịch</Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-slate-500">{article.title}</span>
        </div>

        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            {article.is_featured && (
              <span className="bg-[#ff5b00] text-white text-[12px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
                Nổi bật
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 leading-tight mb-6">
              {article.title}
            </h1>
            
            <div className="flex items-center gap-6 text-[14px] text-slate-500 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                  {(article.author_name || 'D').charAt(0)}
                </div>
                <span className="font-medium text-slate-700">{article.author_name || 'DITRAVEL'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(article.published_at || article.created_at).toLocaleDateString('vi-VN')}
              </div>
            </div>
          </div>

          <div className="prose prose-slate max-w-none prose-img:rounded-xl">
            {article.excerpt && (
              <p className="text-lg text-slate-600 leading-relaxed mb-6 font-medium">
                {article.excerpt}
              </p>
            )}

            <img 
              src={article.cover_image || fallbackImage} 
              alt={article.title} 
              className="w-full rounded-xl mb-8"
            />

            <div
              className="text-slate-700 leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: (article.content || '').replace(/\n/g, '<br/>') }}
            />
          </div>

          <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="font-medium text-slate-800">Chia sẻ bài viết này:</div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full bg-sky-100 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
                className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-600 hover:text-white transition-colors"
              >
                <LinkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}
