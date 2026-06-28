import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Ticket, ThumbsUp, MessageSquare, CreditCard, Headset, ChevronRight, ChevronLeft, Search, Calendar, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import axiosClient from '../api/axios';

const DEFAULT_HERO_IMAGES = [
  "https://images.unsplash.com/photo-1518342426992-69cf613c2db7?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1528127269322-53982823b123?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=2000&q=80"
];

// --- COMPONENTS ---

const SectionHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="mb-6">
    <h2 className="text-[22px] font-normal text-slate-800 mb-1">{title}</h2>
    <p className="text-sm text-slate-500">{subtitle}</p>
  </div>
);

const ViewAllButton = ({ text }: { text: string }) => (
  <div className="flex justify-center mt-8">
    <Link to="/search" className="border border-[#0084ff] text-[#0084ff] hover:bg-[#f0f7ff] hover:shadow-sm px-6 py-2 rounded-[4px] text-[13px] transition-all duration-300 inline-block">
      {text}
    </Link>
  </div>
);

const ProductCard: React.FC<{ prod: any }> = ({ prod }) => (
  <Link to={`/product/${prod.id}`} className="border border-[#e1e1e1] rounded-[8px] overflow-hidden hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)] transition-all duration-300 bg-white flex flex-col group cursor-pointer hover:-translate-y-1">
    <div className="relative h-[180px] overflow-hidden">
      <div className="absolute top-[10px] left-[10px] z-10 flex gap-2">
        {prod.badge2 && <span className="bg-[#4caf50] text-white text-[10px] font-bold px-[8px] py-[3px] rounded-[4px] uppercase shadow-sm">{prod.badge2}</span>}
        {prod.badge && <span className="bg-[#ff5b00] text-white text-[10px] font-bold px-[8px] py-[3px] rounded-[4px] uppercase shadow-sm">{prod.badge}</span>}
      </div>
      <img src={prod.img} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute inset-0 bg-black/opacity-0 group-hover:bg-black/5 transition-colors duration-300" />
    </div>
    
    <div className="p-4 flex flex-col flex-1">
      <span className="text-[12px] font-medium text-slate-500 mb-1">{prod.location}</span>
      <h3 className="font-medium text-[16px] text-slate-800 line-clamp-2 h-12 mb-2 group-hover:text-blue-600 transition-colors leading-snug">{prod.name}</h3>
      
      <div className="flex items-center gap-1.5 mb-4">
        <div className="flex">
          {[1,2,3,4,5].map(star => (
            <Star key={star} className={`w-[12px] h-[12px] ${star <= prod.rating ? 'text-[#ff5b00] fill-[#ff5b00]' : 'text-[#e1e1e1] fill-[#e1e1e1]'}`} />
          ))}
        </div>
        <span className="text-[12px] text-slate-500">{prod.reviews} đánh giá</span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-start gap-2">
          <Ticket className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span className="text-[12px] text-slate-600">{prod.delivery}</span>
        </div>
        <div className="flex items-start gap-2">
          <MessageSquare className="w-4 h-4 text-[#4caf50] shrink-0 mt-0.5" />
          <span className="text-[12px] text-[#4caf50]">{prod.stock || 'Có thể đặt từ ngày mai'}</span>
        </div>
        {prod.extra && (
          <div className="flex items-start gap-2">
            <CreditCard className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span className="text-[12px] text-slate-600">{prod.extra}</span>
          </div>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-slate-100 flex items-end justify-between">
        <div className="flex flex-col">
           {prod.discount && (
              <span className="text-[#ff0000] font-bold text-[11px] bg-[#fff0e6] px-1.5 py-0.5 rounded-[2px] w-fit mb-1">{prod.discount}</span>
           )}
           {prod.oldPrice && (
             <span className="text-slate-400 line-through text-[12px]">{prod.oldPrice} đ</span>
           )}
        </div>
        <div className="text-right">
          <div className="text-[11px] text-slate-500 mb-0.5 font-medium uppercase">Giá từ</div>
          <div className="font-bold text-[#ff5b00] text-[20px] leading-none">
            {prod.price} <span className="text-[14px] underline font-normal">đ</span>
          </div>
        </div>
      </div>
    </div>
  </Link>
);

const HorizontalCityScroll = ({ cities }: { cities: any[] }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -250, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 250, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group">
      <button 
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-slate-400 hover:text-[#ff5b00] opacity-0 group-hover:opacity-100 transition-all border border-slate-100 hidden md:flex"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <div 
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory scroll-smooth"
      >
        {cities.map((city, idx) => (
          <Link key={idx} to="/search" className="relative w-[210px] h-[210px] shrink-0 rounded-[4px] overflow-hidden snap-start group/card">
            <img src={city.img} alt={city.name} className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover/card:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-4 left-0 w-full text-center px-2 transform group-hover/card:-translate-y-1 transition-transform duration-300">
              <span className="text-white font-bold text-[15px] drop-shadow-lg">{city.name}</span>
            </div>
          </Link>
        ))}
      </div>

      <button 
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-slate-400 hover:text-[#ff5b00] opacity-0 group-hover:opacity-100 transition-all border border-slate-100 hidden md:flex"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

// --- MOCK DATA ---

// --- MAIN PAGE ---

export default function HomePage() {
  const [currentHeroIdx, setCurrentHeroIdx] = useState(0);
  const [heroBanners, setHeroBanners] = useState<any[]>([]);
  const [subBanners, setSubBanners] = useState<any[]>([]);

  // --- DATA FETCHING ---
  const [products, setProducts] = useState<any[]>([]);
  const [places, setPlaces] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);

  useEffect(() => {
    const fetchCoreData = async () => {
      try {
        const [prodRes, placesRes, provRes] = await Promise.all([
          axiosClient.get('/products/'),
          axiosClient.get('/places/'),
          axiosClient.get('/provinces/')
        ]);
        setProducts(prodRes.data);
        setPlaces(placesRes.data);
        setProvinces(provRes.data);
      } catch (err) {
        console.error("Failed to fetch core data", err);
      }
    };
    fetchCoreData();
  }, []);

  const mappedProducts = useMemo(() => {
    return products.filter(p => p.is_active).map(prod => {
      const place = places.find(p => p.id === prod.place_id);
      const province = provinces.find(p => p.id === place?.province_id);
      return {
        ...prod,
        name: prod.title,
        img: prod.image || 'https://images.unsplash.com/photo-1544735716-3920e6e41540?w=800&q=80',
        oldPrice: (Number(prod.price) * 1.2).toLocaleString('vi-VN'),
        price: Number(prod.price).toLocaleString('vi-VN'),
        reviews: prod.reviews || Math.floor(Math.random() * 500) + 50,
        rating: prod.rating || Number((4.5 + Math.random() * 0.5).toFixed(1)),
        delivery: 'Xác nhận ngay',
        stock: 'Có thể đặt từ ngày mai',
        location: `${place?.name || ''}, ${province?.name || ''}`.replace(/^, | , /g, '').trim(),
        provinceName: province?.name || '',
        category: prod.category || 'TOUR',
        is_featured: prod.is_featured || false
      };
    });
  }, [products, places, provinces]);

  const domesticCities = useMemo(() => {
    return provinces.filter(p => p.is_active).slice(0, 10).map(p => ({
      name: p.name,
      img: p.image || 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80'
    }));
  }, [provinces]);

  const otherDomesticCities = useMemo(() => {
    return provinces.filter(p => p.is_active).slice(10).map(p => ({
      name: p.name,
      img: p.image || 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80'
    }));
  }, [provinces]);

  const domesticTours = useMemo(() => mappedProducts.filter(p => p.is_featured).slice(0, 4), [mappedProducts]);
  const domesticTickets = useMemo(() => mappedProducts.filter(p => p.category === 'VÉ').slice(0, 4), [mappedProducts]);
  
  const daNangActs = useMemo(() => {
    return mappedProducts.filter(p => p.provinceName.toLowerCase().includes('đà nẵng')).slice(0, 4);
  }, [mappedProducts]);
  
  const phuQuocActs = useMemo(() => {
    return mappedProducts.filter(p => p.provinceName.toLowerCase().includes('phú quốc')).slice(0, 4);
  }, [mappedProducts]);
  
  const moreActs = useMemo(() => mappedProducts.filter(p => !p.is_featured && p.category !== 'VÉ').slice(0, 4), [mappedProducts]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axiosClient.get('/banners/');
        const activeBanners = res.data.filter((b: any) => b.is_active);
        const main = activeBanners.filter((b: any) => b.position === 'HOME_MAIN').sort((a: any, b: any) => a.order - b.order);
        const sub = activeBanners.filter((b: any) => b.position === 'HOME_SUB').sort((a: any, b: any) => a.order - b.order);
        setHeroBanners(main);
        setSubBanners(sub);
      } catch (err) {
        console.error("Failed to fetch banners", err);
      }
    };
    fetchBanners();
  }, []);

  const displayHero = heroBanners.length > 0 ? heroBanners : DEFAULT_HERO_IMAGES.map(url => ({ image_url: url, title: 'Du lịch tự túc - book ditravel.com', description: 'Dịch vụ chính hãng - An tâm đặt vé' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIdx((prev) => (prev + 1) % displayHero.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [displayHero.length]);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  return (
    <div className="bg-white font-sans overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative h-[380px] md:h-[450px] flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.img 
            key={currentHeroIdx}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            src={displayHero[currentHeroIdx]?.image_url} 
            alt="Hero Background" 
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-[#0084ff]/30 mix-blend-multiply pointer-events-none" />
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 container mx-auto px-2 text-center max-w-4xl pt-8"
        >
          <h1 className="text-3xl md:text-[42px] font-bold text-white mb-3 tracking-tight drop-shadow-md">
            {displayHero[currentHeroIdx]?.title || 'Du lịch tự túc - book ditravel.com'}
          </h1>
          <p className="text-base md:text-[18px] text-white font-medium mb-1 drop-shadow">
            {displayHero[currentHeroIdx]?.description || 'Dịch vụ chính hãng - An tâm đặt vé'}
          </p>
          {/* <p className="text-xs md:text-[13px] text-white/90 mb-8 drop-shadow font-medium">
            Thanh toán với tài khoản Công Ty TNHH Ditravel - 0071001060528 - Vietcombank
          </p> */}
          
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('open-dest-modal'))}
            className="bg-[#ff5b00] hover:bg-[#e05000] text-white font-bold py-3 px-8 rounded-[4px] text-sm uppercase flex items-center gap-2 mx-auto shadow-lg transition-transform hover:scale-105 duration-300"
          >
            <MapPin className="w-4 h-4" /> CHỌN ĐIỂM ĐẾN
          </button>
        </motion.div>
      </section>

      {/* Features Outline Icons */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="container mx-auto max-w-[1300px] px-2 -mt-8 relative z-20 mb-8"
      >
        <div className="bg-white rounded-[4px] shadow-[0_4px_25px_rgba(0,0,0,0.06)] py-8 px-2 grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
             { icon: Ticket, title: 'Không bỏ lỡ bất kỳ trải nghiệm nào', desc: '+1000 đặc sắc từ +300 nhà cung cấp tại +30 điểm đến' },
             { icon: ThumbsUp, title: 'Tiết kiệm từ 5% đến 40% so với mua trực tiếp', desc: 'Cam kết chính sách giá rẻ hơn giá mua trực tiếp' },
             { icon: MessageSquare, title: '+10.000 đánh giá & nhận xét sản phẩm', desc: 'Từ +100.000 khách đã sử dụng dịch vụ' },
             { icon: CreditCard, title: 'Đặt vé tiện lợi, Thanh toán linh hoạt', desc: 'Tiền mặt, chuyển khoản, ví điện tử, QR code, thẻ thanh toán...' },
             { icon: Headset, title: 'Chuyên viên hỗ trợ 365', desc: 'Tư vấn hỗ trợ trước trong lẫn sau chuyến đi', extraClass: 'col-span-2 md:col-span-1' }
          ].map((feat, i) => (
            <div key={i} className={`flex flex-col items-center text-center group cursor-pointer ${feat.extraClass || ''}`}>
              <div className="h-14 flex items-center justify-center text-[#0084ff] mb-3 transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300">
                <feat.icon className="w-9 h-9 stroke-[1.2]" />
              </div>
              <h3 className="font-bold text-slate-800 text-[13px] mb-1 leading-snug">{feat.title}</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Hot Banners */}
      <motion.section {...fadeInUp} className="container mx-auto max-w-[1300px] px-2 mb-8">
        <SectionHeader title="Ditravel có gì hot!" subtitle="Trải nghiệm ưu đãi cùng Ditravel và đối tác" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {subBanners.length > 0 ? subBanners.slice(0, 2).map((banner, idx) => (
            <a key={banner.id} href={banner.link || '#'} className="rounded-[4px] overflow-hidden h-[220px] relative group cursor-pointer shadow-sm block">
              <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-2 text-center mt-8">
                <h3 className="font-bold text-xl md:text-[22px] mb-1 drop-shadow-lg group-hover:-translate-y-1 transition-transform duration-300">{banner.title}</h3>
                <p className="font-medium text-[15px] drop-shadow-md group-hover:-translate-y-1 transition-transform duration-300 delay-75">{banner.description}</p>
              </div>
            </a>
          )) : (
            <>
              <div className="rounded-[4px] overflow-hidden h-[220px] relative group cursor-pointer shadow-sm">
                <img src="https://images.unsplash.com/photo-1549474768-3e4b7b3b4fdd?auto=format&fit=crop&q=80&w=800" alt="Banner 1" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-2 text-center mt-8">
                  <h3 className="font-bold text-xl md:text-[22px] mb-1 drop-shadow-lg group-hover:-translate-y-1 transition-transform duration-300">Ngắm Vịnh Nha Trang trên Du Thuyền Emperor</h3>
                  <p className="font-medium text-[15px] drop-shadow-md group-hover:-translate-y-1 transition-transform duration-300 delay-75">với giá ưu đãi chỉ có tại Ditravel</p>
                </div>
              </div>
              <div className="rounded-[4px] overflow-hidden h-[220px] relative group cursor-pointer shadow-sm">
                <img src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=800" alt="Banner 2" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-2 text-center mt-6">
                  <span className="text-[#a855f7] font-black text-[28px] drop-shadow-lg tracking-tight group-hover:scale-105 transition-transform duration-300">Nova DREAMS</span>
                  <h3 className="font-black text-xl md:text-[26px] mt-1 tracking-wider text-white drop-shadow-xl group-hover:scale-105 transition-transform duration-300 delay-75">CHÀO 8/3 - MUA VÉ LIỀN TAY</h3>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.section>

      {/* Domestic Destinations */}
      <motion.section {...fadeInUp} className="container mx-auto max-w-[1300px] px-2 mb-8 relative">
        <SectionHeader title="Điểm đến du lịch trong nước" subtitle="10 điểm đến du lịch phổ biến nhất tại 3 miền Bắc Trung Nam và còn tiếp tục mở rộng" />
        <HorizontalCityScroll cities={domesticCities} />
        <ViewAllButton text="Xem tất cả các hoạt động du lịch tại Việt Nam" />
      </motion.section>

      {/* Featured Domestic Products */}
      <motion.section {...fadeInUp} className="container mx-auto max-w-[1300px] px-2 mb-8">
        <SectionHeader title="Trải nghiệm du lịch nổi bật trong nước" subtitle="Để những chuyến du lịch tự túc trong nước không bao giờ nhàm chán" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {domesticTours.map((prod, i) => (
             <ProductCard key={i} prod={prod} />
          ))}
        </div>
      </motion.section>

      {/* Domestic Tickets */}
      <motion.section {...fadeInUp} className="container mx-auto max-w-[1300px] px-2 mb-8">
        <SectionHeader title="Vé tham quan trong nước" subtitle="Đặt vé online hoặc điện thoại, nhận vé qua email. Xuất trình vé qua điện thoại. Không phải xếp hàng mua vé, tiết kiệm 3% đến 10% so với mua trực tiếp" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {domesticTickets.map((prod, i) => (
             <ProductCard key={i} prod={prod} />
          ))}
        </div>
      </motion.section>

      {/* International Destinations */}
      <motion.section {...fadeInUp} className="container mx-auto max-w-[1300px] px-2 mb-8 relative">
        <div className="flex items-baseline gap-2 mb-6">
          <h2 className="text-[22px] font-normal text-slate-800">Khám phá dải đất hình chữ S</h2>
          <span className="text-sm text-slate-500">Các thành phố nổi tiếng trải dọc ba miền</span>
        </div>
        <HorizontalCityScroll cities={otherDomesticCities} />
      </motion.section>

      {/* Thai Activities */}
      {daNangActs.length > 0 && (
        <motion.section {...fadeInUp} className="container mx-auto max-w-[1300px] px-2 mb-8">
          <SectionHeader title="Các hoạt động hấp dẫn tại Đà Nẵng" subtitle="Khám phá trọn vẹn sức sống miền Trung" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {daNangActs.map((prod, i) => (
               <ProductCard key={i} prod={prod} />
            ))}
          </div>
          <ViewAllButton text="Xem tất cả các hoạt động du lịch tại Đà Nẵng" />
        </motion.section>
      )}

      {/* Singapore Activities */}
      {phuQuocActs.length > 0 && (
        <motion.section {...fadeInUp} className="container mx-auto max-w-[1300px] px-2 mb-8">
          <SectionHeader title="Trải nghiệm đặc sắc ở Phú Quốc" subtitle="Kỳ nghỉ nhiệt đới đáng nhớ cùng hàng loạt tiện ích" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {phuQuocActs.map((prod, i) => (
               <ProductCard key={i} prod={prod} />
            ))}
          </div>
          <ViewAllButton text="Xem tất cả các hoạt động du lịch tại Phú Quốc" />
        </motion.section>
      )}

      {/* More Activities */}
      <motion.section {...fadeInUp} className="container mx-auto max-w-[1300px] px-2 mb-10">
        <SectionHeader title="Cùng nhiều trải nghiệm thú vị khác ở Việt Nam" subtitle="Nhanh tay đặt vé để không bỏ lỡ" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {moreActs.map((prod, i) => (
             <ProductCard key={i} prod={prod} />
          ))}
        </div>
      </motion.section>

      {/* Newsletter Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-[#f2f2f2] py-6 mt-8 border-t border-[#e1e1e1]"
      >
        <div className="container mx-auto max-w-[1300px] px-2 flex flex-col md:flex-row items-center gap-5 justify-between">
          <div className="md:w-1/2">
            <h3 className="text-[16px] font-normal text-[#242424] mb-2 uppercase">Nhận ƯU ĐÃI, tin KHUYẾN MÃI từ ditravel.com</h3>
            <p className="text-[13px] text-slate-500 leading-relaxed">Đăng ký nhận ngay Bản tin du lịch miễn phí của DITRAVEL với các thông tin được cập nhật liên tục từ Kinh nghiệm du lịch, Các Tour/ Điểm tham quan và các khuyến mại mới nhất.</p>
          </div>
          <div className="md:w-1/2 w-full flex justify-end">
            <div className="flex w-full max-w-[400px] shadow-sm transform hover:shadow-md transition-shadow">
              <input type="email" placeholder="Nhập email của bạn" className="flex-1 bg-white border border-[#e1e1e1] border-r-0 rounded-l-[4px] px-2 py-2.5 text-[13px] outline-none focus:border-[#ff5b00] transition-colors" />
              <button className="bg-[#ff5b00] hover:bg-[#e05000] text-white font-bold px-8 py-2.5 rounded-r-[4px] text-[13px] transition-colors whitespace-nowrap">
                ĐĂNG KÝ
              </button>
            </div>
          </div>
        </div>
      </motion.section>

    </div>
  );
}
