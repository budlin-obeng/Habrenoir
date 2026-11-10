import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { SearchModal } from './SearchModal';
import { WishlistDrawer } from './WishlistDrawer';
import { HabrenoirLogo } from './HabrenoirLogo';

export const Header = () => {
  const { count, openDrawer, currency, setCurrency, currencies } = useCart();
  const { wishlistCount, openWishlist } = useWishlist();
  const { t, lang, setLang, languages } = useLanguage();
  const { user, isSignedIn, isAdmin, logout, openAuthModal } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Responsive scroll-aware hide/reveal header behavior
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 70) {
        if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 8) {
          // Scrolling down: hide header on mobile
          setIsNavVisible(false);
          setIsUserMenuOpen(false);
        } else if (lastScrollY - currentScrollY > 8) {
          // Scrolling up: reveal header
          setIsNavVisible(true);
        }
      } else {
        // Near top: always visible
        setIsNavVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const shouldShowNav = isNavVisible || isMenuOpen;

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 bg-[#FFFFFF] border-b border-[#E5E5E5] shadow-none transition-transform duration-300 ease-in-out ${
          shouldShowNav ? 'translate-y-0' : '-translate-y-full md:translate-y-0'
        }`}
      >
        {/* Top Announcement Bar (Hidden on ultra-small mobile screens to maximize viewable area) */}
        <div className="hidden sm:flex bg-[#140002] text-[#FFFFFF] text-[9.5px] sm:text-[10px] tracking-[0.22em] uppercase py-2 px-4 font-sans items-center justify-between border-b border-[#3D0C15]">
          <span className="hidden md:inline text-[#C5A880] tracking-[0.26em]">
            ACCRA, GHANA
          </span>
          <span className="mx-auto text-[9px] sm:text-[10px] text-[#FFFFFF] tracking-[0.2em]">
            {t('complimentary_delivery_banner')}
          </span>
          <div className="hidden md:flex items-center space-x-3 text-[#C5A880]">
            <Link to="/track" className="hover:underline">
              {t('order_tracking')}
            </Link>
            <span>·</span>
            <span className="text-[#FFFFFF]">{currency}</span>
          </div>
        </div>

        <div className="max-w-[1800px] mx-auto px-3 sm:px-6 md:px-8 h-14 sm:h-20 flex items-center justify-between">
          
          {/* Left: Responsive Menu Trigger & Navigation Links */}
          <div className="flex-1 flex items-center justify-start space-x-3 sm:space-x-6">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-2 text-[#111111] hover:text-[#725B38] transition-colors p-1"
              aria-label="Toggle Navigation Menu"
            >
              <div className="flex flex-col justify-between w-4 h-3">
                <span className={`w-full h-[1.5px] bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-[5.2px]' : ''}`}></span>
                <span className={`w-full h-[1.5px] bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-full h-[1.5px] bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-[5.2px]' : ''}`}></span>
              </div>
              <span className="font-sans text-[11px] sm:text-[12px] tracking-[0.14em] uppercase font-medium hidden sm:inline">
                {isMenuOpen ? 'Close' : 'Menu'}
              </span>
            </button>

            <Link
              to="/catalog"
              className="hidden md:inline-block text-[#111111] hover:text-[#725B38] transition-colors font-sans text-[11px] sm:text-[12px] tracking-[0.16em] uppercase font-medium"
            >
              {t('catalog')}
            </Link>

            <Link
              to="/atelier"
              className="hidden lg:inline-block text-[#111111] hover:text-[#725B38] transition-colors font-sans text-[11px] sm:text-[12px] tracking-[0.16em] uppercase font-medium"
            >
              {t('the_atelier')}
            </Link>

            <Link
              to="/contact"
              className="hidden sm:inline-block text-[#111111] hover:text-[#725B38] transition-colors font-sans text-[11px] sm:text-[12px] tracking-[0.16em] uppercase font-medium"
            >
              {t('contact')}
            </Link>
          </div>

          {/* Center: Brand Monogram & Wordmark */}
          <div className="flex-shrink-0 flex items-center justify-center px-1 sm:px-3">
            <Link to="/" className="group flex items-center space-x-2 sm:space-x-3">
              <HabrenoirLogo
                className="w-6 h-6 sm:w-7 sm:h-7 text-[#111111] group-hover:text-[#3D0C15] transition-all duration-300 group-hover:scale-105 flex-shrink-0"
              />
              <span className="font-serif text-[18px] sm:text-[24px] md:text-[26px] tracking-[0.26em] sm:tracking-[0.34em] text-[#111111] group-hover:text-[#3D0C15] transition-colors font-normal leading-none pl-[0.1em]">
                HABRENOIR
              </span>
            </Link>
          </div>

          {/* Right: Search, Wishlist, Account & Bag */}
          <div className="flex-1 flex items-center justify-end space-x-2.5 sm:space-x-4 md:space-x-5 text-[#111111]">
            
            {/* 1. Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search Catalog"
              className="p-1 hover:text-[#725B38] transition-colors"
            >
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* 2. Wishlist Trigger (Shown on tablet and desktop) */}
            <button
              onClick={openWishlist}
              aria-label="Saved Creations"
              className="hidden sm:inline-block p-1 hover:text-[#725B38] transition-colors relative"
            >
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 font-sans text-[8px] w-3.5 h-3.5 bg-[#C5A880] text-[#140002] font-bold flex items-center justify-center leading-none">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* 3. User / Private Salon Portal */}
            <div className="relative">
              <button
                onClick={() => {
                  if (!isSignedIn) {
                    openAuthModal();
                  } else {
                    setIsUserMenuOpen(!isUserMenuOpen);
                  }
                }}
                className="p-1 hover:text-[#725B38] transition-colors flex items-center space-x-1"
                aria-label="Client Account"
              >
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>

              {isSignedIn && isUserMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-2 bg-[#FFFFFF] border border-[#E8E3DC] p-4 shadow-none z-50 min-w-[210px] font-sans text-[11px]"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div className="pb-2.5 mb-2.5 border-b border-[#E8E3DC]">
                    <strong className="block text-[#111111] truncate">{user?.fullName || 'Client'}</strong>
                    <span className="text-[9px] uppercase tracking-wider text-[#857374]">
                      {isAdmin ? 'Brand Director' : 'VIP Client'}
                    </span>
                  </div>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="py-1.5 text-[#3D0C15] font-semibold hover:underline flex items-center space-x-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>Admin Suite</span>
                    </Link>
                  )}

                  <Link
                    to="/track"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block py-1 text-[#524344] hover:text-[#111111]"
                  >
                    Track Orders
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left py-1.5 mt-2 border-t border-[#E8E3DC] text-[#857374] hover:text-[#111111] text-[10px] uppercase tracking-wider"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* 4. Shopping Bag */}
            <button
              onClick={openDrawer}
              aria-label="Shopping Bag"
              className="flex items-center hover:text-[#725B38] transition-colors relative p-1"
            >
              <svg
                className="w-[19px] h-[19px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 font-sans text-[8px] w-3.5 h-3.5 bg-[#3D0C15] text-[#FFFFFF] flex items-center justify-center leading-none">
                  {count}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Flyout Navigation Menu if toggled */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-[#FFFFFF] border-b border-[#E5E5E5] py-8 sm:py-10 px-5 sm:px-12 md:px-16 shadow-2xl animate-fade-in z-50 max-h-[calc(100vh-64px)] overflow-y-auto overscroll-contain">
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 font-sans text-[12px] tracking-wider uppercase text-[#111111]">
              <div className="space-y-3 pb-4 sm:pb-0 border-b sm:border-b-0 border-[#F4F1EC]">
                <span className="text-[#857374] text-[10px] tracking-widest block font-semibold">COLLECTIONS</span>
                <Link to="/catalog?gender=women" onClick={() => setIsMenuOpen(false)} className="block hover:underline font-medium">{t('women')}</Link>
                <Link to="/catalog?gender=men" onClick={() => setIsMenuOpen(false)} className="block hover:underline font-medium">{t('men')}</Link>
                <Link to="/catalog" onClick={() => setIsMenuOpen(false)} className="block hover:underline">{t('all_creations')}</Link>
              </div>
              
              <div className="space-y-3 pb-4 sm:pb-0 border-b sm:border-b-0 border-[#F4F1EC]">
                <span className="text-[#857374] text-[10px] tracking-widest block font-semibold">CATEGORIES</span>
                <Link to="/catalog?category=bags" onClick={() => setIsMenuOpen(false)} className="block hover:underline">{t('bags')}</Link>
                <Link to="/catalog?category=shoes" onClick={() => setIsMenuOpen(false)} className="block hover:underline">{t('shoes')}</Link>
                <Link to="/catalog?category=shirts" onClick={() => setIsMenuOpen(false)} className="block hover:underline">{t('ready_to_wear')}</Link>
                <Link to="/catalog?category=blazers" onClick={() => setIsMenuOpen(false)} className="block hover:underline">Tailoring</Link>
                <Link to="/catalog?category=accessories" onClick={() => setIsMenuOpen(false)} className="block hover:underline">{t('accessories')}</Link>
              </div>

              <div className="space-y-3 pb-4 sm:pb-0 border-b sm:border-b-0 border-[#F4F1EC]">
                <span className="text-[#857374] text-[10px] tracking-widest block font-semibold">OUR STORY & CRAFTSMANSHIP</span>
                <Link to="/atelier" onClick={() => setIsMenuOpen(false)} className="block hover:underline">{t('the_atelier')}</Link>
                <Link to="/atelier#brass" onClick={() => setIsMenuOpen(false)} className="block hover:underline">Accra Lost-Wax Brass</Link>
                <Link to="/atelier#leather" onClick={() => setIsMenuOpen(false)} className="block hover:underline">Full-Grain Box Calfskin</Link>
                <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block hover:underline">{t('contact')}</Link>
                <Link to="/track" onClick={() => setIsMenuOpen(false)} className="block hover:underline">{t('order_tracking')}</Link>
              </div>

              {/* Preferences: Currency & Language */}
              <div className="space-y-4">
                <span className="text-[#857374] text-[10px] tracking-widest block font-semibold">PREFERENCES</span>
                
                <div>
                  <span className="text-[9px] text-[#857374] block mb-1">LOCAL CURRENCY</span>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 text-[10px] bg-[#3D0C15] text-[#FFFFFF] border border-[#3D0C15] font-medium tracking-wider">
                      GH₵ (GHS)
                    </span>
                    <span className="text-[9.5px] text-[#725B38] tracking-wider uppercase">
                      Paystack & MoMo
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[9px] text-[#857374] block mb-1">LANGUAGE</span>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 text-[10px] bg-[#FFFFFF] text-[#111111] border border-[#E8E3DC] font-medium tracking-wider">
                      English
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[#F4F1EC]">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      openWishlist();
                    }}
                    className="text-[11px] text-[#111111] hover:underline font-medium"
                  >
                    Wishlist ({wishlistCount})
                  </button>
                  <Link to="/track" onClick={() => setIsMenuOpen(false)} className="text-[11px] text-[#3D0C15] underline font-medium">
                    {t('order_tracking')} →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Global Wishlist Drawer */}
      <WishlistDrawer />
    </>
  );
};
