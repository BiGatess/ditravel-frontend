import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function MainLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800">
      <Header />

      {/* Main Content */}
      <main className="flex-1 bg-white">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
