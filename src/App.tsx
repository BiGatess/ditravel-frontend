import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import AuthPage from './pages/AuthPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import WishlistPage from './pages/WishlistPage';
import BlogPage from './pages/BlogPage';
import ArticlePage from './pages/ArticlePage';
import HelpPage from './pages/HelpPage';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import ContactPage from './pages/ContactPage';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import OrdersPage from './pages/admin/OrdersPage';
import LocationsPage from './pages/admin/LocationsPage';
import PlacesPage from './pages/admin/PlacesPage';
import ProductsPage from './pages/admin/ProductsPage';
import PricingPage from './pages/admin/PricingPage';
import BannersPage from './pages/admin/BannersPage';
import UsersPage from './pages/admin/UsersPage';
import ReviewsPage from './pages/admin/ReviewsPage';
import VouchersPage from './pages/admin/VouchersPage';
import BlogsPage from './pages/admin/BlogsPage';
import SettingsPage from './pages/admin/SettingsPage';
import PlaceholderPage from './pages/admin/PlaceholderPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';

import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AdminAuthProvider } from './context/AdminAuthContext';

export default function App() {
  return (
    <AdminAuthProvider>
      <WishlistProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="product/:id" element={<ProductDetailPage />} />
              <Route path="cart" element={<CheckoutPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="login" element={<AuthPage defaultType="login" />} />
              <Route path="register" element={<AuthPage defaultType="register" />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="wishlist" element={<WishlistPage />} />
              <Route path="blog" element={<BlogPage />} />
              <Route path="blog/:id" element={<ArticlePage />} />
              <Route path="help" element={<HelpPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="terms" element={<TermsPage />} />
              <Route path="contact" element={<ContactPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            
            <Route path="/admin" element={<AdminProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="locations" element={<LocationsPage />} />
              <Route path="places" element={<PlacesPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="ticket-types" element={<PlaceholderPage title="Quản lý Loại vé" />} />
              <Route path="pricing" element={<PricingPage />} />
              <Route path="payments" element={<PlaceholderPage title="Thanh toán SePay" />} />
              <Route path="vouchers" element={<VouchersPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="reviews" element={<ReviewsPage />} />
              <Route path="coupons" element={<Navigate to="/admin/vouchers" replace />} />
              <Route path="banners" element={<BannersPage />} />
              <Route path="blogs" element={<BlogsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  </WishlistProvider>
</AdminAuthProvider>
  );
}
