import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
import SearchFilters from '../components/search/SearchFilters';
import SearchResults from '../components/search/SearchResults';
import axiosClient from '../api/axios';
import { normalizeVndAmount } from '../utils/currency';

export default function SearchPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSpots, setSelectedSpots] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('ĐIVUI ĐỀ XUẤT');
  const [selectedCountry, setSelectedCountry] = useState<string>('Việt Nam');
  const [selectedProvince, setSelectedProvince] = useState<string>('Tất cả');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [products, setProducts] = useState<any[]>([]);
  const [places, setPlaces] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const q = searchParams.get('q');
    if (q) setSelectedProvince(q);
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
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
        console.error("Lỗi khi tải dữ liệu tìm kiếm:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleSpot = (spot: string) => {
    setSelectedSpots(prev => 
      prev.includes(spot) ? prev.filter(s => s !== spot) : [...prev, spot]
    );
  };

  const mappedProducts = useMemo(() => {
    return products.filter(p => p.is_active).map(prod => {
      const place = places.find(p => p.id === prod.place_id);
      const province = provinces.find(p => p.id === place?.province_id);
      const price = normalizeVndAmount(prod.price);
      return {
        ...prod,
        price,
        name: prod.title,
        thumbnail: prod.image || 'https://images.unsplash.com/photo-1544735716-3920e6e41540?w=800&q=80',
        oldPrice: price * 1.2,
        discount: '17%',
        reviews: prod.reviews || Math.floor(Math.random() * 500) + 50,
        rating: prod.rating || Number((4.5 + Math.random() * 0.5).toFixed(1)),
        delivery: 'Xác nhận ngay',
        stock: 'Có sẵn hôm nay',
        categories: place?.category ? [place.category] : [],
        spots: place?.name ? [place.name] : [],
        provinceName: province?.name || 'Tất cả'
      };
    });
  }, [products, places, provinces]);

  const computedCategories = useMemo(() => {
    const cats = new Map<string, number>();
    mappedProducts.forEach(p => {
      if (selectedProvince === 'Tất cả' || p.provinceName === selectedProvince) {
        p.categories.forEach((c: string) => cats.set(c, (cats.get(c) || 0) + 1));
      }
    });
    return Array.from(cats.entries()).map(([label, count]) => ({ label, count }));
  }, [mappedProducts, selectedProvince]);

  const computedSpots = useMemo(() => {
    const spots = new Map<string, number>();
    mappedProducts.forEach(p => {
      if (selectedProvince === 'Tất cả' || p.provinceName === selectedProvince) {
        p.spots.forEach((s: string) => spots.set(s, (spots.get(s) || 0) + 1));
      }
    });
    return Array.from(spots.entries()).map(([label, count]) => ({ label, count }));
  }, [mappedProducts, selectedProvince]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = mappedProducts.filter(product => {
      const matchProvince = selectedProvince === 'Tất cả' || product.provinceName === selectedProvince;
      const matchCat = selectedCategories.length === 0 || product.categories.some((c: string) => selectedCategories.includes(c));
      const matchSpot = selectedSpots.length === 0 || product.spots.some((s: string) => selectedSpots.includes(s));
      return matchProvince && matchCat && matchSpot;
    });

    if (sortBy === 'PHỔ BIẾN NHẤT') {
      result.sort((a, b) => b.reviews - a.reviews);
    } else if (sortBy === 'GIÁ THẤP ĐẾN CAO') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'ĐÁNH GIÁ CAO NHẤT') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [mappedProducts, selectedCategories, selectedSpots, sortBy, selectedProvince]);

  return (
    <div className="bg-white min-h-screen font-sans pb-16">
      <div className="container mx-auto max-w-[1300px] px-2 pt-8 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-3 mb-3">
          <h1 className="text-[22px] sm:text-[28px] font-bold text-[#242424] leading-tight">Các hoạt động vui chơi tại {selectedProvince === 'Tất cả' ? 'Việt Nam' : selectedProvince}</h1>
          <span className="text-[13px] text-slate-500 mb-0.5">Tổng cộng {filteredAndSortedProducts.length} hoạt động</span>
        </div>
        
        <div className="flex items-center gap-2 text-[13px] text-[#0084ff] mb-8">
          <Link to="/" className="hover:underline">Trang chủ</Link>
          <span className="text-slate-300">/</span>
          <Link to="#" className="hover:underline">{selectedCountry}</Link>
          {selectedProvince !== 'Tất cả' && (
            <>
              <span className="text-slate-300">/</span>
              <Link to="#" className="hover:underline">{selectedProvince}</Link>
            </>
          )}
        </div>

        <div className="mb-4 lg:hidden">
          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-[14px] font-semibold text-slate-700 shadow-sm"
          >
            <span className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[#ff5b00]" />
              Bộ lọc
            </span>
            <span className="text-[12px] font-medium text-slate-500">
              {selectedCategories.length + selectedSpots.length + (selectedProvince !== 'Tất cả' ? 1 : 0)} đã chọn
            </span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="hidden lg:block">
            <SearchFilters 
              categories={computedCategories}
              touristSpots={computedSpots}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              selectedProvince={selectedProvince}
              setSelectedProvince={setSelectedProvince}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              selectedSpots={selectedSpots}
              toggleSpot={toggleSpot}
            />
          </div>

          {isLoading ? (
            <div className="flex-1 flex justify-center items-center py-20">
              <div className="w-8 h-8 border-4 border-[#0084ff] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <SearchResults 
              products={filteredAndSortedProducts}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          )}
        </div>
      </div>

      {isFilterOpen && (
        <div className="fixed inset-0 z-[120] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsFilterOpen(false)}
            aria-label="Đóng bộ lọc"
          />
          <div className="absolute left-0 top-0 h-full w-[90%] max-w-[380px] overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
              <div>
                <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">Bộ lọc</div>
                <div className="text-[16px] font-bold text-slate-800">Chọn điều kiện</div>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-600"
                aria-label="Đóng bộ lọc"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SearchFilters 
              categories={computedCategories}
              touristSpots={computedSpots}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              selectedProvince={selectedProvince}
              setSelectedProvince={setSelectedProvince}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              selectedSpots={selectedSpots}
              toggleSpot={toggleSpot}
            />
          </div>
        </div>
      )}
    </div>
  );
}
