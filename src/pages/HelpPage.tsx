import React from 'react';
import { Link } from 'react-router-dom';
import FAQAccordion from '../components/help/FAQAccordion';
import ContactForm from '../components/help/ContactForm';
import { HelpCircle } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-16 pt-8 font-sans">
      <div className="container mx-auto px-2 max-w-[1100px]">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] text-[#0084ff] mb-6">
          <Link to="/" className="hover:underline">Trang chủ</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500">Trung tâm hỗ trợ</span>
        </div>

        <div className="flex items-center justify-center gap-3 mb-10 text-slate-800">
          <HelpCircle className="w-8 h-8 text-[#0084ff]" />
          <h1 className="text-3xl md:text-4xl font-bold">Trung tâm hỗ trợ DITRAVEL</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-[400px] shrink-0">
            <h2 className="text-[18px] font-bold text-slate-800 mb-4">Câu hỏi thường gặp (FAQ)</h2>
            <FAQAccordion />
          </div>
          
          <div className="flex-1">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
