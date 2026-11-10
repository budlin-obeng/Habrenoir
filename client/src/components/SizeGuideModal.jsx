import React, { useState } from 'react';

export const SizeGuideModal = ({ isOpen, onClose, category = 'shoes' }) => {
  const [activeTab, setActiveTab] = useState(category === 'blazers' || category === 'shirts' ? 'apparel' : category === 'shoes' ? 'shoes' : 'bags');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#111111]/50 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[#FFFFFF] border border-[#E8E3DC] p-6 sm:p-10 z-10 rounded-none shadow-none animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#E8E3DC] pb-4 mb-6">
          <div>
            <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-[#C5A880] font-semibold block">
              HABRENOIR · SIZE & PROPORTIONS GUIDE
            </span>
            <h3 className="font-serif text-[24px] text-[#111111] font-normal">
              Size & Fit Guide
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#111111] hover:text-[#3D0C15] p-2"
            aria-label="Close Size Guide"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex space-x-2 border-b border-[#E8E3DC] mb-6 font-sans text-[11px] uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('shoes')}
            className={`pb-2.5 px-3 font-medium transition-colors border-b-2 ${
              activeTab === 'shoes' ? 'border-[#3D0C15] text-[#3D0C15]' : 'border-transparent text-[#857374] hover:text-[#111111]'
            }`}
          >
            Footwear & Loafers
          </button>
          <button
            onClick={() => setActiveTab('apparel')}
            className={`pb-2.5 px-3 font-medium transition-colors border-b-2 ${
              activeTab === 'apparel' ? 'border-[#3D0C15] text-[#3D0C15]' : 'border-transparent text-[#857374] hover:text-[#111111]'
            }`}
          >
            Ready-to-Wear & Tailoring
          </button>
          <button
            onClick={() => setActiveTab('bags')}
            className={`pb-2.5 px-3 font-medium transition-colors border-b-2 ${
              activeTab === 'bags' ? 'border-[#3D0C15] text-[#3D0C15]' : 'border-transparent text-[#857374] hover:text-[#111111]'
            }`}
          >
            Bags & Dimensions
          </button>
        </div>

        {/* Table Content */}
        {activeTab === 'shoes' && (
          <div className="space-y-4">
            <p className="font-sans text-[12px] text-[#524344] leading-relaxed">
              Our footwear is crafted on custom hornbeam wooden lasts in our master workshops in Accra and Florence. For our Blake-stitched loafers, we recommend selecting your standard European dress shoe size.
            </p>
            <table className="w-full text-left font-sans text-[11px] border-collapse">
              <thead>
                <tr className="border-b border-[#E8E3DC] text-[#857374] uppercase tracking-wider">
                  <th className="py-2">EU Size</th>
                  <th className="py-2">UK Size</th>
                  <th className="py-2">US Size</th>
                  <th className="py-2">Foot Length (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E3DC] text-[#111111]">
                <tr><td className="py-2 font-medium">EU 40</td><td className="py-2">UK 6.5</td><td className="py-2">US 7.5</td><td className="py-2">25.4 cm</td></tr>
                <tr><td className="py-2 font-medium">EU 41</td><td className="py-2">UK 7.5</td><td className="py-2">US 8.5</td><td className="py-2">26.0 cm</td></tr>
                <tr><td className="py-2 font-medium">EU 42</td><td className="py-2">UK 8.0</td><td className="py-2">US 9.0</td><td className="py-2">26.7 cm</td></tr>
                <tr><td className="py-2 font-medium">EU 43</td><td className="py-2">UK 9.0</td><td className="py-2">US 10.0</td><td className="py-2">27.3 cm</td></tr>
                <tr><td className="py-2 font-medium">EU 44</td><td className="py-2">UK 10.0</td><td className="py-2">US 11.0</td><td className="py-2">28.0 cm</td></tr>
                <tr><td className="py-2 font-medium">EU 45</td><td className="py-2">UK 11.0</td><td className="py-2">US 12.0</td><td className="py-2">28.7 cm</td></tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'apparel' && (
          <div className="space-y-4">
            <p className="font-sans text-[12px] text-[#524344] leading-relaxed">
              Tailoring jackets are cut with structured shoulders and Milanese chest drape. Silk bowling shirts feature a generous camp-collar cuban silhouette.
            </p>
            <table className="w-full text-left font-sans text-[11px] border-collapse">
              <thead>
                <tr className="border-b border-[#E8E3DC] text-[#857374] uppercase tracking-wider">
                  <th className="py-2">Size</th>
                  <th className="py-2">Chest (Inches / cm)</th>
                  <th className="py-2">Waist (Inches / cm)</th>
                  <th className="py-2">Shoulder Width</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E3DC] text-[#111111]">
                <tr><td className="py-2 font-medium">Small (IT 46)</td><td className="py-2">38" / 96 cm</td><td className="py-2">31" / 79 cm</td><td className="py-2">44.5 cm</td></tr>
                <tr><td className="py-2 font-medium">Medium (IT 48)</td><td className="py-2">40" / 102 cm</td><td className="py-2">33" / 84 cm</td><td className="py-2">45.5 cm</td></tr>
                <tr><td className="py-2 font-medium">Large (IT 50)</td><td className="py-2">42" / 107 cm</td><td className="py-2">35" / 89 cm</td><td className="py-2">46.5 cm</td></tr>
                <tr><td className="py-2 font-medium">XL (IT 52)</td><td className="py-2">44" / 112 cm</td><td className="py-2">37" / 94 cm</td><td className="py-2">47.5 cm</td></tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'bags' && (
          <div className="space-y-4">
            <p className="font-sans text-[12px] text-[#524344] leading-relaxed">
              Each handbag silhouette is engineered to accommodate modern luxury essentials (pro smartphone, cardholder, passport, lip lacquer, keys).
            </p>
            <ul className="space-y-2 text-[12px] text-[#111111]">
              <li className="p-3 bg-[#F9F8F6] border border-[#E8E3DC]">
                <strong className="block font-serif text-[14px]">The Vendôme Sculpted Handbag</strong>
                <span className="text-[#857374] text-[11px]">26 cm (W) × 19 cm (H) × 11 cm (D) · Strap Drop: 50 cm</span>
              </li>
              <li className="p-3 bg-[#F9F8F6] border border-[#E8E3DC]">
                <strong className="block font-serif text-[14px]">The Sienne Sculpted Tote</strong>
                <span className="text-[#857374] text-[11px]">38 cm (W) × 29 cm (H) × 14 cm (D) · Fits 14" Laptop & Tablet</span>
              </li>
              <li className="p-3 bg-[#F9F8F6] border border-[#E8E3DC]">
                <strong className="block font-serif text-[14px]">The Milano Evening Clutch</strong>
                <span className="text-[#857374] text-[11px]">18 cm (W) × 11 cm (H) × 5 cm (D) · Evening Chain Drop: 55 cm</span>
              </li>
            </ul>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-[#E8E3DC] flex items-center justify-between text-[11px] text-[#857374]">
          <span>Need custom bespoke tailoring or measurement advice?</span>
          <a href="/contact" className="text-[#3D0C15] font-semibold hover:underline">
            Consult Concierge Desk →
          </a>
        </div>
      </div>
    </div>
  );
};

