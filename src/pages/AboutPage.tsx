import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Users, Globe, Shield, Award, Heart, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function AboutPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop" 
            alt="About DITRAVEL" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#242424]/90 to-[#242424]/40"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10">
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <div className="text-[#ff5b00] font-black text-5xl md:text-6xl tracking-normal lowercase flex items-center justify-center gap-4 mb-6">
              <span className="grid h-14 w-14 place-items-center rounded-lg bg-[#ff5b00] text-white shadow-lg md:h-16 md:w-16">
                <Plane className="h-8 w-8 md:h-9 md:w-9" strokeWidth={2.5} />
              </span>
              ditravel
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Hành trình khám phá thế giới <br/><span className="text-[#0084ff]">bắt đầu từ đây</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto">
              Nền tảng công nghệ du lịch hàng đầu, kết nối hàng triệu du khách với những trải nghiệm tuyệt vời nhất trên toàn cầu.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-[1200px] -mt-16 relative z-20 pb-20">
        {/* Stats Row */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
          className="bg-white rounded-2xl shadow-xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
        >
          {[
            { number: "1M+", label: "Khách hàng tin dùng" },
            { number: "50+", label: "Quốc gia & Điểm đến" },
            { number: "10K+", label: "Hoạt động trải nghiệm" },
            { number: "4.9/5", label: "Đánh giá trung bình" }
          ].map((stat, idx) => (
            <motion.div key={idx} variants={fadeIn} className="text-center">
              <div className="text-3xl md:text-4xl font-black text-[#0084ff] mb-2">{stat.number}</div>
              <div className="text-slate-500 font-medium text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-[#ff5b00] font-bold tracking-wider text-sm mb-3 uppercase">Sứ mệnh của chúng tôi</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6 leading-tight">
              Định hình lại cách bạn <br/>trải nghiệm du lịch
            </h3>
            <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
              <p>
                DITRAVEL ra đời với một niềm tin đơn giản: Du lịch là để tận hưởng, không phải để lo âu. Chúng tôi áp dụng công nghệ tiên tiến để loại bỏ mọi rào cản trong việc lên kế hoạch chuyến đi.
              </p>
              <p>
                Từ việc đặt vé máy bay, phòng khách sạn, đến vé tham quan hay tour trải nghiệm địa phương độc đáo, mọi thứ đều nằm gọn trong tầm tay bạn với vài cú click chuột.
              </p>
            </div>
            <ul className="mt-8 space-y-3">
              {['Tiết kiệm thời gian & chi phí', 'Minh bạch 100% trong giá cả', 'Chất lượng được kiểm chứng'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-slate-700 font-medium">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1528543606781-2f6e6857f318?q=80&w=1000&auto=format&fit=crop" alt="Travel Mission" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl max-w-[250px] hidden md:block">
              <div className="flex gap-1 mb-2">
                {[1,2,3,4,5].map(i => <Heart key={i} className="w-5 h-5 fill-red-500 text-red-500" />)}
              </div>
              <div className="font-bold text-slate-800">"Nền tảng đặt tour số 1 Việt Nam"</div>
              <div className="text-sm text-slate-500 mt-1">- Tạp chí Du Lịch 2025</div>
            </div>
          </motion.div>
        </div>

        {/* Why Choose Us */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Giá trị cốt lõi</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Vì sao hàng triệu du khách tin tưởng lựa chọn DITRAVEL cho mọi hành trình của mình?</p>
        </div>

        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8"
        >
          <motion.div variants={fadeIn} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group">
            <div className="w-16 h-16 bg-[#0084ff]/10 text-[#0084ff] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Globe className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Kết nối không giới hạn</h3>
            <p className="text-slate-600 leading-relaxed">Khám phá hơn 100,000 hoạt động và điểm đến thú vị từ khắp nơi trên thế giới được cập nhật liên tục.</p>
          </motion.div>

          <motion.div variants={fadeIn} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group">
            <div className="w-16 h-16 bg-[#ff5b00]/10 text-[#ff5b00] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">An tâm tuyệt đối</h3>
            <p className="text-slate-600 leading-relaxed">Thanh toán bảo mật chuẩn quốc tế, đối tác được xác minh nghiêm ngặt. Đảm bảo quyền lợi khách hàng 100%.</p>
          </motion.div>

          <motion.div variants={fadeIn} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Giá tốt nhất thị trường</h3>
            <p className="text-slate-600 leading-relaxed">Cam kết mức giá cạnh tranh nhất, thường xuyên có các chương trình khuyến mãi độc quyền từ đối tác.</p>
          </motion.div>
        </motion.div>
        
        {/* CTA */}
        <div className="mt-24 bg-gradient-to-br from-[#0084ff] to-[#0066cc] rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 translate-x-1/4 -translate-y-1/4">
             <Plane className="w-64 h-64" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Sẵn sàng cho chuyến đi tiếp theo?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto relative z-10">Đừng để những rắc rối cản bước đam mê khám phá của bạn. Hãy để DITRAVEL lo liệu phần còn lại.</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-white text-[#0084ff] font-bold px-8 py-4 rounded-full hover:bg-slate-50 transition-colors relative z-10 shadow-lg hover:shadow-xl">
            Khám phá ngay <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
