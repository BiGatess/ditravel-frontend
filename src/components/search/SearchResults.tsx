import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, CalendarDays } from 'lucide-react';
import { formatVnd } from '../../utils/currency';

interface SearchResultsProps {
  products: any[];
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export default function SearchResults({ products, sortBy, setSortBy }: SearchResultsProps) {
  return (
    <div className="flex-1">
      {/* Sorting Tabs */}
      <div className="flex flex-wrap border border-[#e1e1e1] rounded-[2px] mb-5 bg-white overflow-hidden text-[13px]">
        <div className="px-2 py-3 text-slate-500 border-r border-[#e1e1e1] bg-slate-50 font-normal">
          SẮP XẾP THEO:
        </div>
        <button 
          onClick={() => setSortBy('ĐIVUI ĐỀ XUẤT')}
          className={`px-5 py-3 font-bold tracking-tight transition-colors cursor-pointer ${sortBy === 'ĐIVUI ĐỀ XUẤT' ? 'bg-[#0084ff] text-white' : 'text-slate-600 hover:bg-slate-50 border-r border-[#e1e1e1]'}`}
        >
          ĐIVUI ĐỀ XUẤT
        </button>
        <button 
          onClick={() => setSortBy('PHỔ BIẾN NHẤT')}
          className={`px-5 py-3 font-medium transition-colors cursor-pointer border-r border-[#e1e1e1] ${sortBy === 'PHỔ BIẾN NHẤT' ? 'bg-[#0084ff] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          PHỔ BIẾN NHẤT
        </button>
        <button 
          onClick={() => setSortBy('GIÁ THẤP ĐẾN CAO')}
          className={`px-5 py-3 font-medium transition-colors cursor-pointer border-r border-[#e1e1e1] ${sortBy === 'GIÁ THẤP ĐẾN CAO' ? 'bg-[#0084ff] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          GIÁ THẤP ĐẾN CAO
        </button>
        <button 
          onClick={() => setSortBy('ĐÁNH GIÁ CAO NHẤT')}
          className={`px-5 py-3 font-medium transition-colors cursor-pointer ${sortBy === 'ĐÁNH GIÁ CAO NHẤT' ? 'bg-[#0084ff] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          ĐÁNH GIÁ CAO NHẤT
        </button>
      </div>

      {/* Product List */}
      <div className="space-y-5">
        {products.length === 0 ? (
          <div className="text-center py-10 text-slate-500 border border-dashed border-slate-300 rounded-[8px]">
            Không tìm thấy hoạt động nào phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          products.map(product => (
            <Link key={product.id} to={`/product/${product.id}`} className="flex flex-col sm:flex-row bg-white border border-[#e1e1e1] rounded-[8px] hover:shadow-[0_4px_15px_rgba(0,0,0,0.08)] transition-all overflow-visible relative group">
              
              {/* Left: Image */}
              <div className="w-full sm:w-[280px] h-[180px] sm:h-auto shrink-0 relative overflow-hidden rounded-t-[8px] sm:rounded-l-[8px] sm:rounded-tr-none">
                <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                <div className="absolute top-[12px] left-[12px] z-10 flex gap-1">
                  <span className="bg-[#4caf50] text-white text-[10px] font-bold px-[6px] py-[2px] rounded-[2px] uppercase">MỚI</span>
                </div>
              </div>
              
              {/* Middle: Details */}
              <div className="flex-1 p-5 flex flex-col border-r-0 sm:border-r border-[#e1e1e1]/50 sm:border-dashed">
                <h3 className="text-[17px] font-medium text-slate-800 mb-2 group-hover:text-blue-600 group-hover:underline transition-all line-clamp-2 leading-snug">
                  {product.name}
                </h3>
                <p className="text-[13px] text-slate-500 mb-4 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center gap-2 mb-3 text-[12px] text-slate-500 hidden sm:flex">
                  {product.rating > 0 && (
                    <>
                      <div className="flex">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} className={`w-[12px] h-[12px] ${star <= product.rating ? 'text-[#ff5b00] fill-current' : 'text-[#e1e1e1] fill-current'}`} />
                        ))}
                      </div>
                      <span>{product.reviews} đánh giá</span>
                    </>
                  )}
                </div>
                
                <div className="mt-auto flex flex-wrap gap-4 text-[12px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{product.delivery}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#4caf50]">
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span>{product.stock}</span>
                  </div>
                </div>
              </div>
              
              {/* Right: Price */}
              <div className="w-full sm:w-[220px] shrink-0 p-5 flex flex-col items-end justify-center relative overflow-hidden sm:overflow-visible">
                 {product.discount && (
                    <div className="sm:absolute top-5 -right-[6px] bg-[#ff5b00] text-white text-[12px] font-bold py-1.5 px-3 shadow-sm mb-3 sm:mb-0 z-10 rounded-l-[4px] self-start sm:self-auto uppercase">
                      TIẾT KIỆM {product.discount}
                      <div className="absolute right-0 -bottom-[6px] w-0 h-0 border-t-[6px] border-t-[#c84600] border-r-[6px] border-r-transparent hidden sm:block" />
                    </div>
                 )}
                 
                 <div className="text-right w-full mt-2 sm:mt-auto">
                    <div className="text-[12px] text-slate-500 mb-1 text-right w-full">Giá từ</div>
                    <div className="font-normal text-[#ff5b00] text-[24px] leading-tight flex justify-end items-start gap-1">
                      {formatVnd(product.price).replace(' đ', '')}
                      <span className="text-[14px] underline font-normal mt-1">đ</span>
                    </div>
                    {product.oldPrice && (
                      <div className="text-[13px] text-slate-400 line-through mt-1 text-right w-full">
                        {formatVnd(product.oldPrice)}
                      </div>
                    )}
                 </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
