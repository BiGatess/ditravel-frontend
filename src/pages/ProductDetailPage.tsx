import { useState, useRef, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  Star, Clock, ThumbsUp, ShieldCheck, Headphones, 
  Smartphone, ArrowRight, Calendar, ChevronDown, Info, 
  User, Minus, Plus, FileText, Package, ShoppingCart, CreditCard, FileCheck,
  ChevronLeft, ChevronRight, Heart
} from 'lucide-react';
import { motion } from 'motion/react';
import { useWishlist } from '../context/WishlistContext';
import PackageSelectionWidget from '../components/product/PackageSelectionWidget';
import axiosClient from '../api/axios';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const [productData, setProductData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto bold the first line of text content
  const formatTextContent = (text: string) => {
    if (!text) return '';
    const lines = text.split('\n');
    let firstNonEmptyIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() !== '') {
        firstNonEmptyIndex = i;
        break;
      }
    }
    
    if (firstNonEmptyIndex !== -1) {
      lines[firstNonEmptyIndex] = `<strong class="text-[15px] text-slate-800">${lines[firstNonEmptyIndex]}</strong>`;
    }
    
    return lines.join('<br/>');
  };

  useEffect(() => {
    setCurrentImageIndex(0);
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Assuming axiosClient is imported from '../api/axios'
        // Need to import it if it's not there.
        // Wait, axiosClient is not imported in this file yet! I will use it.
        const res = await axiosClient.get(`/products/${id}`);
        // Map the backend data format to what the frontend expects
        const data = res.data;
        // Merge product gallery and place gallery
        const prodGallery = data.gallery || [];
        const placeGallery = data.place?.gallery || [];
        const combinedGallery = Array.from(new Set([...prodGallery, ...placeGallery]));
        const activeTicketTypes = (data.ticket_types || []).filter((ticket: any) => ticket.is_active !== false);
        const ticketPrices = activeTicketTypes
          .map((ticket: any) => Number(ticket.price))
          .filter((price: number) => price > 0);
        const startingPrice = ticketPrices.length > 0 ? Math.min(...ticketPrices) : Number(data.price || 0);
        const startingTicket = activeTicketTypes.find((ticket: any) => Number(ticket.price) === startingPrice);
        
        setProductData({
          id: data.id,
          name: data.title,
          image: data.image || 'https://images.unsplash.com/photo-1544735716-3920e6e41540?w=1200&q=80',
          price: startingPrice,
          description: data.description,
          oldPrice: startingTicket?.original_price ? Number(startingTicket.original_price) : null,
          startingTicketName: startingTicket?.name || '',
          highlights: data.highlights,
          terms: data.terms,
          cancellation_policy: data.cancellation_policy,
          usage_guide: data.usage_guide,
          gallery: combinedGallery,
          ticket_types: data.ticket_types || []
        });
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Không tìm thấy sản phẩm hoặc có lỗi xảy ra.");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Autoplay gallery
  useEffect(() => {
    if (!productData || !productData.gallery || productData.gallery.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev === productData.gallery.length - 1 ? 0 : prev + 1));
    }, 3000);
    
    return () => clearInterval(interval);
  }, [productData]);

  const isSaved = productData ? isInWishlist(productData.id) : false;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0084ff] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !productData) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-slate-500 font-medium">{error || 'Không tìm thấy sản phẩm này'}</div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen text-[#242424] font-sans pb-20">
      {/* Hero Image Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full h-[300px] md:h-[450px] relative overflow-hidden group"
      >
        <img 
          src={productData.gallery && productData.gallery.length > 0 ? (productData.gallery[currentImageIndex] || productData.gallery[0]) : productData.image} 
          alt={productData.name} 
          className="w-full h-full object-cover object-center transition-opacity duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {productData.gallery && productData.gallery.length > 1 && (
          <>
            <button 
              onClick={() => setCurrentImageIndex(prev => prev === 0 ? productData.gallery.length - 1 : prev - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setCurrentImageIndex(prev => prev === productData.gallery.length - 1 ? 0 : prev + 1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {productData.gallery.map((_: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${currentImageIndex === idx ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}`}
                />
              ))}
            </div>
          </>
        )}
      </motion.div>

      <div className="container mx-auto max-w-[1300px] px-2 -mt-8 md:-mt-24 relative z-10">
        <div className="flex flex-col lg:flex-row gap-5 mb-4 items-start">
          
          {/* Main Content (Left) */}
          <div className="flex-1 space-y-5 min-w-0 w-full">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-[4px] p-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]"
            >
            {/* Breadcrumb */}
            <motion.div variants={itemVariants} className="flex items-center text-[12px] text-slate-500 gap-2 mb-4">
              <Link to="/" className="hover:text-[#0084ff]">Trang chủ</Link>
              <span className="text-slate-300">/</span>
              <Link to="#" className="hover:text-[#0084ff]">Việt Nam</Link>
              <span className="text-slate-300">/</span>
              <Link to="#" className="hover:text-[#0084ff]">Đà Nẵng</Link>
              <span className="text-slate-300">/</span>
              <span className="text-slate-400">{productData.name}</span>
            </motion.div>

            {/* Title & Ratings */}
            <motion.div variants={itemVariants} className="flex justify-between items-start gap-4 mb-3">
              <h1 className="text-[28px] md:text-[32px] font-bold text-[#242424] leading-tight">
                {productData.name}
              </h1>
              <button 
                className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-colors border shadow-sm ${
                  isSaved 
                    ? 'bg-red-50 text-red-500 border-red-100' 
                    : 'bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 border-slate-100'
                }`}
                onClick={() => {
                  if (isSaved) {
                    removeFromWishlist(productData.id);
                  } else {
                    addToWishlist(productData);
                  }
                }}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 text-[13px] mb-8 pb-6 border-b border-[#e1e1e1]">
              <span className="bg-[#4caf50] text-white font-bold px-2 py-0.5 rounded-[2px] text-[11px] uppercase">
                Bán chạy
              </span>
              <div className="flex text-[#ff5b00]">
                {[1,2,3,4,5].map(star => <Star key={star} className="w-4 h-4 fill-current" />)}
              </div>
              <span className="text-slate-600">9 đánh giá</span>
              <span className="w-px h-3 bg-slate-300"></span>
              <span className="text-slate-600 font-medium">856 vé đã bán!</span>
            </motion.div>

            {/* Quick Info Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-[13px] text-slate-600 mb-8">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                <span>Thời gian nhận Vé/Voucher: <span className="text-[#242424]">Trong vòng 24h</span></span>
              </div>
              <div className="flex items-start gap-2.5">
                <Smartphone className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                <span>Xuất trình Vé/Voucher: <span className="text-[#242424]">Qua điện thoại</span></span>
              </div>
              <div className="flex items-start gap-2.5">
                <Headphones className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                <span>Hướng dẫn viên: <span className="text-[#242424]">Nói tiếng Anh và tiếng Việt</span></span>
              </div>
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                <span>Hạn sử dụng: <span className="text-[#242424]">Đúng ngày đăng kí</span></span>
              </div>
            </motion.div>

            {/* Highlights Section */}
            {productData.highlights && (
              <motion.div variants={itemVariants} className="mb-10 pl-2">
                <div 
                  className="space-y-3 text-[14px] text-[#242424] prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: productData.highlights.replace(/\n/g, '<br/>') }}
                />
              </motion.div>
            )}

            </motion.div>
          </div>

          {/* Sticky Sidebar (Right) - Row 1 (Intro) */}
          <div className="w-full lg:w-[350px] shrink-0 relative z-20">
             <div className="sticky top-4 space-y-6">
                 {/* Price Box */}
                 <div className="bg-white border border-[#e1e1e1] shadow-[0_5px_20px_rgba(0,0,0,0.08)] rounded-[8px] p-5">
                    <div className="text-[13px] text-slate-500 mb-1">Giá chỉ từ</div>
                    <div className="text-[#ff5b00] font-bold text-[24px] mb-5 tracking-tight">
                      {productData.price > 0 ? productData.price.toLocaleString('vi-VN') : 'Liên hệ'} {productData.price > 0 && <span className="text-[18px] underline font-normal">đ</span>} {productData.startingTicketName && <span className="text-[13px] text-slate-500 font-normal">/ {productData.startingTicketName}</span>}
                    </div>
                    <button 
                      onClick={() => {
                        document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className="w-full bg-[#ff5b00] hover:bg-[#e05000] text-white font-bold py-3.5 rounded-[6px] mb-3 uppercase tracking-wider text-[14px] transition-colors shadow-md"
                    >
                      Đặt vé online
                    </button>
                    
                    <div className="text-center text-[13px] text-[#0084ff] mb-5 pb-5 border-b border-[#e1e1e1]">
                      hoặc gọi đặt vé <span className="font-bold">1900 0000</span>
                    </div>

                    <div className="space-y-3 text-[13px] text-slate-600">
                       <div className="flex gap-2.5 items-start">
                         <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                         <span>Nhận vé trong vòng 24h qua email</span>
                       </div>
                       <div className="flex gap-2.5 items-start">
                         <FileCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                         <span>Còn vé từ <span className="font-semibold text-slate-800">
                           {(() => {
                             const tomorrow = new Date();
                             tomorrow.setDate(tomorrow.getDate() + 1);
                             return `${tomorrow.getDate().toString().padStart(2, '0')}/${(tomorrow.getMonth() + 1).toString().padStart(2, '0')}/${tomorrow.getFullYear()}`;
                           })()}
                         </span></span>
                       </div>
                    </div>
                 </div>
             </div>
          </div>
        </div>

        {/* ROW 2: TICKET BOOKING WIDGET */}
        <PackageSelectionWidget
          ticketTypes={productData.ticket_types}
          product={{ id: productData.id, name: productData.name, image: productData.image }}
        />

        {/* ROW 3: DESCRIPTION */}
        <div className="flex flex-col lg:flex-row gap-5 mb-8 items-start relative z-20">
          <div className="flex-1 space-y-5 min-w-0 w-full mb-6">
            {/* Description Content */}
            <motion.div variants={itemVariants} className="bg-white p-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] rounded-[8px] space-y-6">
              
              <section>
                {productData.gallery && productData.gallery.length > 0 && (
                  <div className="w-full relative overflow-hidden group rounded-xl mb-8 shadow-sm">
                    <img 
                      src={productData.gallery[currentImageIndex] || productData.gallery[0]} 
                      alt="Gallery" 
                      className="w-full h-[400px] object-cover object-center transition-opacity duration-500" 
                    />
                    {productData.gallery.length > 1 && (
                      <>
                        <button 
                          onClick={() => setCurrentImageIndex(prev => prev === 0 ? productData.gallery.length - 1 : prev - 1)}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/40 hover:bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-800 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button 
                          onClick={() => setCurrentImageIndex(prev => prev === productData.gallery.length - 1 ? 0 : prev + 1)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/40 hover:bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-800 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                        
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                          {productData.gallery.map((_: any, idx: number) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentImageIndex(idx)}
                              className={`w-2 h-2 rounded-full transition-all border border-white/50 ${currentImageIndex === idx ? 'bg-white w-4' : 'bg-transparent hover:bg-white/50'}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
                
                <h3 className="text-[20px] font-bold mb-6 text-slate-800">Bạn được trải nghiệm những gì?</h3>
                
                {productData.highlights && (
                  <div 
                    className="space-y-4 text-[14px] text-slate-700 leading-relaxed mt-6 prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: formatTextContent(productData.highlights) }}
                  />
                )}
              </section>

              <div className="w-full h-px bg-[#e1e1e1]"></div>

              {productData.terms && (
                <section>
                  <h3 className="text-[20px] font-bold mb-4 text-slate-800">Điều kiện vé</h3>
                  <div 
                    className="text-[14px] text-slate-700 space-y-2 prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: formatTextContent(productData.terms) }}
                  />
                </section>
              )}

              {productData.cancellation_policy && (
                <section>
                  <h3 className="text-[20px] font-bold mb-4 text-slate-800">Chính sách hủy</h3>
                  <div 
                    className="text-[14px] text-slate-700 space-y-2 prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: formatTextContent(productData.cancellation_policy) }}
                  />
                </section>
              )}

              {productData.usage_guide && (
                <section>
                  <h3 className="text-[20px] font-bold mb-4 text-slate-800">Hướng dẫn sử dụng</h3>
                  <div 
                    className="text-[14px] text-slate-700 space-y-2 prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: formatTextContent(productData.usage_guide) }}
                  />
                </section>
              )}

            </motion.div>
          </div>

          {/* Sticky Sidebar (Right) - Row 3 (Ad Banners) */}
          <div className="w-full lg:w-[350px] shrink-0 relative z-20">
             <div className="sticky top-4 space-y-6">
               {/* Why Ditravel box shared */}
               <div className="bg-[#f9f9f9] border border-[#e1e1e1] p-5 rounded-[8px]">
                 <h4 className="font-normal text-[15px] mb-4">Tại sao đặt vé với Ditravel</h4>
                  <div className="space-y-3 text-[12px] text-slate-600">
                     <div className="flex gap-2.5 items-start">
                       <ThumbsUp className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                       <span>Ditravel cam kết <Link to="#" className="text-[#0084ff] hover:underline">chính sách giá tốt, thấp hơn giá mua trực tiếp!</Link></span>
                     </div>
                     <div className="flex gap-2.5 items-start">
                       <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                       <span>Thanh toán bằng tiền Việt, không mất phí chuyển đổi ngoại tệ</span>
                     </div>
                     <div className="flex gap-2.5 items-start">
                       <Headphones className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                       <span>Chuyên viên người Việt, hỗ trợ tư vấn qua điện thoại, chat, email, zalo...</span>
                     </div>
                  </div>
               </div>
               
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
