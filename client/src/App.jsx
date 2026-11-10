import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { WhatsAppButton } from './components/WhatsAppButton';

// Multi-Page Routes
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { AtelierPage } from './pages/AtelierPage';
import { ContactPage } from './pages/ContactPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AdminPage } from './pages/AdminPage';

// Scroll restoration helper
const ScrollToTop = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, search]);
  return null;
};

// Toast Notification Sub-component
const LuxuryToast = () => {
  const { toastMessage } = useCart();
  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[180] bg-[#140002] text-[#FFFFFF] px-6 py-3.5 font-sans text-[11px] tracking-[0.22em] uppercase rounded-none shadow-none border border-[#C5A880] flex items-center space-x-3 animate-fade-in">
      <span className="w-1.5 h-1.5 bg-[#C5A880]"></span>
      <span>{toastMessage}</span>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
              <ScrollToTop />
              <div className="min-h-screen bg-[#FFFFFF] text-[#111111] flex flex-col font-sans">
                {/* Main Header */}
                <Header />

                {/* Page Routing */}
                <div className="flex-1">
                  <Routes>
                    {/* 1. Main Gucci-style Editorial Homepage */}
                    <Route path="/" element={<HomePage />} />
                    
                    {/* 2. Dedicated Product Listing Pages */}
                    <Route path="/catalog" element={<CatalogPage />} />
                    <Route path="/women" element={<Navigate to="/catalog?gender=women" replace />} />
                    <Route path="/men" element={<Navigate to="/catalog?gender=men" replace />} />
                    
                    {/* 3. Product Detail Page */}
                    <Route path="/product/:id" element={<ProductDetailPage />} />

                    {/* 4. The Atelier & Craftsmanship */}
                    <Route path="/atelier" element={<AtelierPage />} />

                    {/* 5. Client Services & Private Salons */}
                    <Route path="/contact" element={<ContactPage />} />

                    {/* 6. Live Order Tracking */}
                    <Route path="/track" element={<OrderTrackingPage />} />

                    {/* 7. Order Confirmation */}
                    <Route path="/order-confirmation" element={<OrderConfirmationPage />} />

                    {/* 8. Admin Suite */}
                    <Route path="/admin" element={<AdminPage />} />

                    {/* Catch-all */}
                    <Route path="*" element={<Navigate to="/catalog" replace />} />
                  </Routes>
                </div>

                {/* Luxury Footer */}
                <Footer />

                {/* Luxury Cart Drawer & Modals */}
                <CartDrawer />
                <OrderConfirmationModal />
                <WhatsAppButton />
                <LuxuryToast />
              </div>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
