import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, Trash2, MapPin } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <div className="bg-slate-50 min-h-screen pb-16 pt-8 font-sans">
      <div className="container mx-auto px-2 max-w-[1100px]">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] text-[#0084ff] mb-6">
          <Link to="/" className="hover:underline">Trang chủ</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500">Danh sách yêu thích</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Heart className="w-6 h-6 text-[#ff5b00] fill-current" />
              Sản phẩm yêu thích
            </h1>
            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[13px] font-medium">
              {wishlist.length} mục
            </span>
          </div>

          <div className="p-6">
            {wishlist.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-800 mb-2">Danh sách yêu thích trống</h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">Bạn chưa lưu bất kỳ tour hoặc hoạt động nào. Hãy thả tim những trải nghiệm bạn thích để dễ dàng tìm lại nhé!</p>
                <Link to="/search" className="inline-block bg-[#ff5b00] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#e05000] transition-colors shadow-sm">
                  Khám phá ngay
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all bg-white flex flex-col group relative"
                  >
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        removeFromWishlist(item.id);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-white transition-all z-10 shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <Link to={`/product/${item.id}`} className="block h-[180px] overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </Link>
                    
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-center gap-1.5 text-[12px] text-slate-500 mb-2">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{item.location}</span>
                      </div>
                      
                      <Link to={`/product/${item.id}`} className="block mb-4">
                        <h3 className="font-bold text-slate-800 text-[15px] group-hover:text-[#0084ff] transition-colors line-clamp-2 leading-snug">
                          {item.name}
                        </h3>
                      </Link>
                      
                      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="text-[12px] text-slate-500">Giá từ</div>
                        <div className="font-bold text-[#ff5b00] text-[18px]">
                          {item.price.toLocaleString('vi-VN')} <span className="text-[13px] underline font-normal">đ</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
