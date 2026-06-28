import React from 'react';
import { Link } from 'react-router-dom';
import BlogList from '../components/blog/BlogList';

export default function BlogPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-16 pt-8 font-sans">
      <div className="container mx-auto px-2 max-w-[1100px]">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] text-[#0084ff] mb-6">
          <Link to="/" className="hover:underline">Trang chủ</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500">Cẩm nang du lịch</span>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Cẩm nang du lịch</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Khám phá những điểm đến mới lạ, kinh nghiệm du lịch hữu ích và những bí kíp săn vé siêu hời cùng DITRAVEL.
          </p>
        </div>

        <BlogList />
      </div>
    </div>
  );
}
