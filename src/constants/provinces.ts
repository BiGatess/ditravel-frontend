export const REGIONS_DATA = [
  {
    id: 'bac',
    name: 'Miền Bắc',
    provinces: [
      'Hà Nội', 'Hải Phòng', 'Hà Giang', 'Cao Bằng', 'Bắc Kạn', 'Tuyên Quang', 'Lào Cai', 'Điện Biên', 
      'Lai Châu', 'Sơn La', 'Yên Bái', 'Hòa Bình', 'Thái Nguyên', 'Lạng Sơn', 'Quảng Ninh', 'Bắc Giang', 
      'Phú Thọ', 'Vĩnh Phúc', 'Bắc Ninh', 'Hải Dương', 'Hưng Yên', 'Thái Bình', 'Hà Nam', 'Nam Định', 'Ninh Bình'
    ]
  },
  {
    id: 'trung',
    name: 'Miền Trung',
    provinces: [
      'Đà Nẵng', 'Thanh Hóa', 'Nghệ An', 'Hà Tĩnh', 'Quảng Bình', 'Quảng Trị', 'Thừa Thiên Huế', 
      'Quảng Nam', 'Quảng Ngãi', 'Bình Định', 'Phú Yên', 'Khánh Hòa', 'Ninh Thuận', 'Bình Thuận', 
      'Kon Tum', 'Gia Lai', 'Đắk Lắk', 'Đắk Nông', 'Lâm Đồng'
    ]
  },
  {
    id: 'nam',
    name: 'Miền Nam',
    provinces: [
      'TP.HCM', 'Cần Thơ', 'Bình Phước', 'Tây Ninh', 'Bình Dương', 'Đồng Nai', 'Bà Rịa - Vũng Tàu', 
      'Long An', 'Đồng Tháp', 'Tiền Giang', 'An Giang', 'Bến Tre', 'Vĩnh Long', 'Trà Vinh', 
      'Hậu Giang', 'Kiên Giang', 'Sóc Trăng', 'Bạc Liêu', 'Cà Mau'
    ]
  }
];

export const ALL_PROVINCES = REGIONS_DATA.flatMap(region => region.provinces);
