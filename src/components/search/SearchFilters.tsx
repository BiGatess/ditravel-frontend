import React from 'react';
import { Menu, ChevronDown } from 'lucide-react';

interface SearchFiltersProps {
  categories: { label: string; count: number }[];
  touristSpots: { label: string; count: number }[];
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  selectedProvince: string;
  setSelectedProvince: (province: string) => void;
  selectedCategories: string[];
  toggleCategory: (cat: string) => void;
  selectedSpots: string[];
  toggleSpot: (spot: string) => void;
}

export default function SearchFilters({
  categories,
  touristSpots,
  selectedCountry,
  setSelectedCountry,
  selectedProvince,
  setSelectedProvince,
  selectedCategories,
  toggleCategory,
  selectedSpots,
  toggleSpot
}: SearchFiltersProps) {
  return (
    <aside className="w-full lg:w-[260px] shrink-0">
      <div className="bg-[#0084ff] text-white py-3 px-2 flex items-center gap-2 font-bold text-[14px]">
        <Menu className="w-5 h-5" /> BỘ LỌC
      </div>
      
      <div className="border border-t-0 border-[#e1e1e1] bg-white">
        {/* Điểm đến */}
        <div className="p-4 border-b border-[#e1e1e1]">
          <h3 className="font-bold text-[13px] text-[#242424] mb-3">Điểm đến</h3>
          <div className="space-y-3">
            <div>
              <label className="text-[12px] text-slate-600 block mb-1">Quốc gia</label>
              <div className="relative">
                <select 
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full border border-[#e1e1e1] rounded-[2px] px-3 py-1.5 text-[13px] text-slate-600 outline-none bg-white cursor-pointer appearance-none pr-8 focus:border-[#0084ff] hover:border-[#c0c0c0] transition-colors"
                >
                  <option value="Việt Nam">Việt Nam</option>
                  <option value="Quốc tế">Quốc tế</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-[12px] text-slate-600 block mb-1">Tỉnh / thành</label>
              <div className="relative">
                <select 
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="w-full border border-[#e1e1e1] rounded-[2px] px-3 py-1.5 text-[13px] text-slate-600 outline-none bg-white cursor-pointer appearance-none pr-8 focus:border-[#0084ff] hover:border-[#c0c0c0] transition-colors"
                >
                  <option value="Tất cả">Tất cả</option>
                  <optgroup label="Miền Nam & Tây Nguyên">
                    {['Hồ Chí Minh', 'Vũng Tàu', 'Tây Ninh', 'Buôn Ma Thuột - Đắk Lắk', 'Đà Lạt', 'Phú Quốc', 'Côn Đảo', 'Cần Thơ', 'Măng Đen'].map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Miền Trung">
                    {['Đà Nẵng', 'Hội An', 'Huế', 'Nha Trang', 'Phan Thiết', 'Ninh Thuận', 'Quy Nhơn', 'Quảng Bình', 'Phú Yên'].map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Miền Bắc">
                    {['Hà Nội', 'Hạ Long', 'Sapa', 'Ninh Bình', 'Hà Giang', 'Mộc Châu', 'Hải Phòng', 'Cát Bà', 'Phú Thọ'].map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </optgroup>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Danh mục */}
        <div className="p-4 border-b border-[#e1e1e1]">
          <h3 className="font-bold text-[13px] text-[#242424] mb-3">Danh mục</h3>
          <div className="space-y-3">
            {categories.map((item, i) => (
              <label key={i} className="flex items-start gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={selectedCategories.includes(item.label)}
                  onChange={() => toggleCategory(item.label)}
                  className="mt-0.5 rounded-[2px] border-[#c0c0c0] text-[#0084ff] focus:ring-[#0084ff] cursor-pointer" 
                />
                <span className="text-[13px] text-slate-600 group-hover:text-[#ff5b00] transition-colors leading-snug">
                  {item.label} ({item.count})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Địa điểm du lịch */}
        <div className="p-4">
          <h3 className="font-bold text-[13px] text-[#242424] mb-3">Địa điểm du lịch</h3>
          <div className="space-y-3">
            {touristSpots.map((item, i) => (
              <label key={i} className="flex items-start gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={selectedSpots.includes(item.label)}
                  onChange={() => toggleSpot(item.label)}
                  className="mt-0.5 rounded-[2px] border-[#c0c0c0] text-[#0084ff] focus:ring-[#0084ff] cursor-pointer" 
                />
                <span className="text-[13px] text-slate-600 group-hover:text-[#ff5b00] transition-colors leading-snug">
                  {item.label} ({item.count})
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
