import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { HabrenoirLogo } from './HabrenoirLogo';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#140002] text-[#ECE7DF] border-t border-[#3D0C15] pt-16 pb-12 font-sans">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-8">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-[#3D0C15]">

          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3.5">
              <HabrenoirLogo
                color="#E5C378"
                className="w-11 h-11 flex-shrink-0"
              />
              <span className="font-serif text-[28px] sm:text-[34px] tracking-[0.38em] text-[#FFFFFF] block font-normal leading-none">
                HABRENOIR
              </span>
            </div>
            <span className="font-sans text-[10px] tracking-[0.28em] text-[#C5A880] uppercase block">
              ACCRA, GHANA — LUXURY LEATHER GOODS & SARTORIAL CRAFT
            </span>
            <p className="font-sans text-[12px] text-[#A89899] max-w-sm leading-relaxed pt-2">
              Ghanaian luxury house uniting generations of Akan lost-wax molten brass metallurgy with master shoemaking and fine leathercraft.
            </p>
            <div className="pt-2 flex items-center space-x-2 text-[10px] tracking-[0.2em] uppercase text-[#C5A880]">
              <span className="w-2 h-2 bg-[#C5A880]"></span>
              <span>CURRENCY: GHANAIAN CEDIS (GH₵ / GHS)</span>
            </div>
          </div>

          {/* Col 1: Collections */}
          <div className="space-y-3">
            <span className="text-[#C5A880] text-[10px] tracking-[0.24em] uppercase block font-semibold">
              COLLECTIONS
            </span>
            <ul className="space-y-2 text-[12px] text-[#A89899]">
              <li><Link to="/catalog?gender=women" className="hover:text-[#FFFFFF] transition-colors">Women's Leather Goods</Link></li>
              <li><Link to="/catalog?gender=men" className="hover:text-[#FFFFFF] transition-colors">Men's Sartorial & Shoes</Link></li>
              <li><Link to="/catalog?category=bags" className="hover:text-[#FFFFFF] transition-colors">Handbags & Clutches</Link></li>
              <li><Link to="/catalog?category=shoes" className="hover:text-[#FFFFFF] transition-colors">Loafers & Dress Shoes</Link></li>
              <li><Link to="/catalog" className="hover:text-[#FFFFFF] transition-colors">All Creations Archive</Link></li>
            </ul>
          </div>

          {/* Col 3: Client Services */}
          <div className="space-y-3">
            <span className="text-[#C5A880] text-[10px] tracking-[0.24em] uppercase block font-semibold">
              CLIENT SERVICES
            </span>
            <ul className="space-y-2 text-[12px] text-[#A89899]">
              <li><Link to="/contact" className="hover:text-[#FFFFFF] transition-colors">Accra Flagship Showroom</Link></li>
              <li><Link to="/track" className="hover:text-[#FFFFFF] transition-colors">{t('order_tracking')}</Link></li>
              <li><a href="tel:+233302948810" className="hover:text-[#FFFFFF] transition-colors">Tel: +233 (0) 30 294 8810</a></li>
              <li><a href="https://wa.me/233240001926" target="_blank" rel="noreferrer" className="hover:text-[#FFFFFF] transition-colors">WhatsApp Concierge Desk</a></li>
              <li><Link to="/contact" className="hover:text-[#FFFFFF] transition-colors">Doorstep Delivery Desk</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[10px] tracking-[0.16em] uppercase text-[#736364] space-y-4 sm:space-y-0">
          <div>
            © 2026 HABRENOIR LUXURY LEATHER GOODS · ACCRA, GHANA. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center space-x-6 text-[#A89899]">
            <Link to="/contact" className="hover:underline">PRIVACY POLICY</Link>
            <Link to="/contact" className="hover:underline">TERMS OF SERVICE</Link>
            <Link to="/track" className="hover:underline">SMS PROTOCOL</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
