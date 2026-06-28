import axios from 'axios';

// Khởi tạo một đối tượng Axios với cấu hình mặc định
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api', // Đường dẫn tới Backend của chúng ta
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Tự động đính kèm Token vào mỗi Request trước khi gửi đi
axiosClient.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage (do trang AdminLoginPage lưu vào)
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor: Xử lý Response trả về từ Server
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Nếu lỗi 401 (Hết hạn Token hoặc Token sai) -> Xóa token và bắt đăng nhập lại
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin/login'; // Ép người dùng văng ra trang Login
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
