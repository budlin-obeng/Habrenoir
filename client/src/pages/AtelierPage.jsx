import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { HabrenoirLogo } from '../components/HabrenoirLogo';

export const AtelierPage = () => {
  const { t } = useLanguage();
  const [activeStage, setActiveStage] = useState('brass');

  const stages = [
    {
      id: 'brass',
      step: 'STAGE 01',
      title: 'Accra Lost-Wax Molten Brass Casting',
      subtitle: 'Kumasi & Accra Metalsmith Heritage',
      desc: 'Every piece of Habrenoir hardware—the Vendôme lock, interlocking monogram buckles, and sculptural horsebit bars—is individually hand-cast in Accra using centuries-old Ghanaian lost-wax casting methods. The raw solid brass is poured at 1,000°C, then chiseled by hand to micrometer tolerances before receiving a brushed champagne gold or palladium electroplate.',
      specs: [
        'Solid virgin jeweler-grade brass ingot',
        'Hand-filed geometric bevels',
        'Bespoke anti-tarnish microscopic protective seal'
      ]
    },
    {
      id: 'leather',
      step: 'STAGE 02',
      title: 'French Box Calfskin Selection',
      subtitle: 'Grade-1 Hides from Historic River Tanneries',
      desc: 'Our leather is sourced exclusively from historic French tanneries in Le Puy-en-Velay. The full-grain skins are vegetable-tanned in organic oak bark extracts over six months, yielding a supple, resilient leather that develops an extraordinary patina with wear.',
      specs: [
        '1.4mm uniform substance across entire hide',
        'Zero synthetic polymer surface corrections',
        'Natural drum-dyed through-and-through'
      ]
    },
    {
      id: 'stitch',
      step: 'STAGE 03',
      title: 'Dual-Hand Saddle Stitching',
      subtitle: 'Waxed Irish Linen Thread',
      desc: 'Our artisans use two harness needles and a single continuous length of beeswax-coated linen thread to hand-stitch structural stress points. Unlike machine lock-stitching, our hand saddle stitch never unravels, ensuring a lifespan counted in decades.',
      specs: [
        '8 stitches per centimeter precision',
        'Beeswax burnished thread for moisture resistance',
        'Hand-painted edge sealed with 7 coats over 48 hours'
      ]
    },
    {
      id: 'cordwain',
      step: 'STAGE 04',
      title: 'Blake Rapid & Goodyear Cordwaining',
      subtitle: 'Accra Last Workshop & Italian Benchtops',
      desc: 'Footwear creations are mounted on custom-carved hornbeam hardwood lasts designed to cradle the foot with anatomical balance. Outsoles are cut from triple-oak-bark leather and bevelled into a sculptural fiddleback waist.',
      specs: [
        '48-hour moisture stabilization on wooden last',
        'Solid brass shank and recessed toe taps',
        'Ultra-supple glove-leather full interior lining'
      ]
    },
    {
      id: 'finish',
      step: 'STAGE 05',
      title: 'The Ceremonial Finishing & Hallmark',
      subtitle: 'Hand-Stamped Gold Foil & Shea Conditioning',
      desc: 'Before any creation departs our Accra atelier, it undergoes a 36-point inspection in natural daylight. Leather surfaces are conditioned with raw Ghanaian shea butter and warm beeswax, then hallmarked with our serial registration and master artisan signature.',
      specs: [
        '24-karat gold leaf foil serial embossing',
        'Certified provenance passport enclosed with each creation',
        'Archival raw silk dust bag and grosgrain ribbon box'
      ]
    }
  ];

  return (
    <div className="pt-24 sm:pt-32 pb-24 bg-[#F9F8F6] text-[#111111]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 font-sans text-[10px] tracking-[0.2em] uppercase text-[#857374] mb-8">
          <Link to="/" className="hover:text-[#111111]">Home</Link>
          <span>/</span>
          <span className="text-[#3D0C15] font-semibold">{t('the_atelier')}</span>
        </div>

        {/* Editorial Title Banner */}
        <div className="border-b border-[#E8E3DC] pb-12 mb-16">
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#725B38] font-semibold block mb-3">
            ACCRA · FLORENCE · PARIS
          </span>
          <h1 className="font-serif text-[34px] sm:text-[56px] tracking-tight leading-[1.08] text-[#111111] max-w-4xl">
            {t('atelier_hero_title')}
          </h1>
          <p className="font-sans text-[14px] sm:text-[16px] text-[#524344] max-w-2xl mt-4 font-normal leading-relaxed">
            {t('atelier_hero_subtitle')}
          </p>
        </div>

        {/* Heritage Double-Spread Feature */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
          <div className="relative bg-[#FFFFFF] border border-[#E8E3DC] p-4 sm:p-8">
            <div className="aspect-[4/5] overflow-hidden bg-[#ECE7DF]">
              <img 
                src="/images/campaign/hero-couture.jpg" 
                alt="Atelier Craftsmanship in Accra" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4 flex items-center justify-between font-sans text-[9px] tracking-[0.24em] uppercase text-[#857374]">
              <span>Bench No. 04 · Accra Flagship Atelier</span>
              <span>Hardware Assembly</span>
            </div>
          </div>

          <div className="space-y-6">
            <span className="font-sans text-[10px] tracking-[0.28em] uppercase text-[#725B38] font-semibold block">
              OUR FOUNDING ETHOS
            </span>
            <h2 className="font-serif text-[30px] sm:text-[42px] tracking-tight text-[#111111] leading-tight">
              Honoring Ghanaian Roots, Redefining Continental Luxury
            </h2>
            <p className="font-sans text-[13px] sm:text-[14px] text-[#524344] leading-relaxed">
              Founded in Accra, Habrenoir began with a bold proposition: to challenge Eurocentric luxury by uniting Ghana's hereditary metalsmithing arts with the highest standards of bespoke leathercraft and cordwaining.
            </p>
            <p className="font-sans text-[13px] sm:text-[14px] text-[#524344] leading-relaxed">
              Located in the quiet, historic Airport Residential Area in Accra, our flagship workshop pairs generational Akan brass casters with cordwainers trained in Florence and Paris. Every buckle, strap, and seam is built to outlast trends and become an heirloom.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[#E8E3DC]">
              <div>
                <span className="font-serif text-[32px] sm:text-[40px] text-[#3D0C15] block font-normal">180+</span>
                <span className="font-sans text-[10px] tracking-[0.18em] uppercase text-[#857374] block mt-1">Manual Steps Per Piece</span>
              </div>
              <div>
                <span className="font-serif text-[32px] sm:text-[40px] text-[#3D0C15] block font-normal">48 Hrs</span>
                <span className="font-sans text-[10px] tracking-[0.18em] uppercase text-[#857374] block mt-1">Last Resting for Perfect Memory</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive 5 Pillars of Craftsmanship */}
        <div className="bg-[#FFFFFF] border border-[#E8E3DC] p-6 sm:p-12 mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#725B38] font-semibold block mb-2">
              THE 5 PILLARS OF CRAFTSMANSHIP
            </span>
            <h3 className="font-serif text-[28px] sm:text-[36px] tracking-tight text-[#111111]">
              The Anatomy of an Heirloom
            </h3>
          </div>

          {/* Tab Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12 border-b border-[#E8E3DC] pb-4">
            {stages.map((st) => (
              <button
                key={st.id}
                onClick={() => setActiveStage(st.id)}
                className={`px-4 py-2 font-sans text-[10px] tracking-[0.2em] uppercase transition-colors rounded-none ${
                  activeStage === st.id 
                    ? 'bg-[#3D0C15] text-[#FFFFFF]' 
                    : 'bg-transparent text-[#857374] hover:text-[#111111] border border-transparent hover:border-[#E8E3DC]'
                }`}
              >
                {st.step} : {st.title.split(' ')[0]} {st.title.split(' ')[1]}
              </button>
            ))}
          </div>

          {/* Active Detail Display */}
          {(() => {
            const current = stages.find(s => s.id === activeStage) || stages[0];
            return (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="space-y-4">
                  <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#C5A880] font-semibold">
                    {current.step} · {current.subtitle}
                  </span>
                  <h4 className="font-serif text-[26px] sm:text-[32px] text-[#111111] tracking-tight">
                    {current.title}
                  </h4>
                  <p className="font-sans text-[13px] sm:text-[14px] text-[#524344] leading-relaxed">
                    {current.desc}
                  </p>
                  <ul className="space-y-2 pt-4">
                    {current.specs.map((sp, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-[12px] text-[#111111] font-sans">
                        <span className="w-1.5 h-1.5 bg-[#C5A880]"></span>
                        <span>{sp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#F9F8F6] border border-[#E8E3DC] p-6 sm:p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-[10px] tracking-[0.24em] uppercase text-[#725B38] font-semibold block">
                      CERTIFIED ACCRA QUALITY SEAL
                    </span>
                    <HabrenoirLogo color="#3D0C15" className="w-6 h-6 flex-shrink-0" />
                  </div>
                  <p className="font-sans text-[13px] text-[#524344] leading-relaxed">
                    "Every creation bears the stamped initials of the master cordwainer or metalsmith responsible for its creation. In our eyes, true luxury is never anonymous."
                  </p>
                  <div className="pt-4 border-t border-[#E8E3DC] flex items-center justify-between font-sans text-[10px] tracking-widest text-[#857374] uppercase">
                    <span>Authenticity Protocol</span>
                    <span className="font-serif text-[14px] text-[#3D0C15] font-semibold">HN · ACCRA</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Global Ateliers & Salons Grid */}
        <div className="mb-20">
          <div className="border-b border-[#E8E3DC] pb-4 mb-8">
            <span className="font-sans text-[10px] tracking-[0.24em] uppercase text-[#725B38] font-semibold block">
              PHYSICAL PRESENCE
            </span>
            <h3 className="font-serif text-[28px] text-[#111111]">
              Flagships & Showrooms
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FFFFFF] border border-[#E8E3DC] p-6 space-y-3">
              <span className="font-sans text-[9px] tracking-[0.2em] text-[#C5A880] uppercase font-semibold">FLAGSHIP SALON</span>
              <h4 className="font-serif text-[20px] text-[#111111]">Accra Flagship & Atelier</h4>
              <p className="font-sans text-[12px] text-[#524344]">Airport Residential Area, Villa 8, Accra, Ghana</p>
              <p className="font-sans text-[11px] text-[#857374] pt-2">Global Headquarters, Brass Foundry & Bespoke Lasts</p>
              <div className="pt-4 border-t border-[#E8E3DC]">
                <Link to="/contact" className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#3D0C15] hover:underline font-semibold">
                  CONTACT ACCRA CONCIERGE →
                </Link>
              </div>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E8E3DC] p-6 space-y-3">
              <span className="font-sans text-[9px] tracking-[0.2em] text-[#C5A880] uppercase font-semibold">SOURCING ATELIER</span>
              <h4 className="font-serif text-[20px] text-[#111111]">Paris Sourcing Suite</h4>
              <p className="font-sans text-[12px] text-[#524344]">14 Place Vendôme, 75001 Paris, France</p>
              <p className="font-sans text-[11px] text-[#857374] pt-2">European Sourcing Ateliers & Fine Leather Procurement</p>
              <div className="pt-4 border-t border-[#E8E3DC]">
                <Link to="/contact" className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#3D0C15] hover:underline font-semibold">
                  INQUIRE SOURCING →
                </Link>
              </div>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E8E3DC] p-6 space-y-3">
              <span className="font-sans text-[9px] tracking-[0.2em] text-[#C5A880] uppercase font-semibold">CORDWAINING BENCH</span>
              <h4 className="font-serif text-[20px] text-[#111111]">Florence Cordwaining Studio</h4>
              <p className="font-sans text-[12px] text-[#524344]">Via de' Tornabuoni 12, 50123 Firenze, Italy</p>
              <p className="font-sans text-[11px] text-[#857374] pt-2">Sole Welting & European Leather Sourcing Archives</p>
              <div className="pt-4 border-t border-[#E8E3DC]">
                <Link to="/contact" className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#3D0C15] hover:underline font-semibold">
                  INQUIRE STUDIOS →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-[#140002] text-[#FFFFFF] p-8 sm:p-16 text-center border border-[#3D0C15]">
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#C5A880] block mb-2 font-semibold">
            EXPERIENCE HABRENOIR
          </span>
          <h3 className="font-serif text-[32px] sm:text-[46px] tracking-tight mb-4 text-[#FFFFFF]">
            Explore the Current Catalog
          </h3>
          <p className="font-sans text-[13px] text-[#ECE7DF] max-w-xl mx-auto mb-8 font-light leading-relaxed">
            Every piece is priced natively in Ghanaian Cedis (GH₵) with complimentary express courier delivery across Greater Accra and nationwide Ghana.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/catalog"
              className="px-8 py-4 bg-[#C5A880] hover:bg-[#B39368] text-[#140002] font-sans text-[11px] tracking-[0.24em] uppercase font-semibold transition-colors"
            >
              VIEW ALL CREATIONS
            </Link>
            <a
              href="https://wa.me/233244198820?text=Hello%20Habrenoir%20Concierge,%20I'd%20like%20to%20inquire%20about%20your%20creations."
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border border-[#C5A880] hover:bg-[#3D0C15] text-[#FFFFFF] font-sans text-[11px] tracking-[0.24em] uppercase font-semibold transition-colors inline-flex items-center space-x-2"
            >
              <span>WHATSAPP CONCIERGE</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
