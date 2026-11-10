import React from 'react';
import { Link } from 'react-router-dom';
import { HabrenoirLogo } from '../components/HabrenoirLogo';
import { useCart } from '../context/CartContext';

export const HomePage = () => {
  const { formatCurrency } = useCart();

  // Curated signature creations matching the reference product section architecture
  const featuredCreations = [
    {
      id: 'vendome-bag',
      title: 'The Vendôme Sculpted Handbag',
      tagline: 'SIGNATURE LEATHER',
      description: 'Architectural top-handle silhouette hand-crafted in glazed box calfskin with polished palladium lock.',
      price: 24500,
      image: '/images/products/bags/vendome-burgundy.jpg',
      link: '/product/vendome-bag',
      cta: 'Discover Creation'
    },
    {
      id: 'horsebit-loafer',
      title: 'The Horsebit Atelier Loafers',
      tagline: 'ICON · CORDWAINING',
      description: 'Classic Florentine silhouette featuring hand-cast solid brass horsebit bar and Blake-stitched sole.',
      price: 12500,
      image: '/images/products/shoes/horsebit-black.jpg',
      link: '/product/horsebit-loafer',
      cta: 'Discover Creation'
    },
    {
      id: 'palazzo-silk-shirt',
      title: 'The Palazzo Silk Bowling Shirt',
      tagline: 'MULBERRY COMO SILK',
      description: 'Fluid camp-collar silhouette cut from Como mulberry silk crepe with bespoke botanical jacquard.',
      price: 8900,
      image: '/images/products/shirts/bowling-ivory.jpg',
      link: '/product/palazzo-silk-shirt',
      cta: 'Discover Creation'
    },
    {
      id: 'akroma-bag',
      title: 'The Akroma Sculpted Top-Handle',
      tagline: 'BESTSELLER',
      description: 'Structured box calfskin silhouette in deep forest green featuring Ghanaian lost-wax brass lock closure.',
      price: 26800,
      image: '/images/products/bags/akroma-forest-green.jpg',
      link: '/product/akroma-bag',
      cta: 'Discover Creation'
    },
    {
      id: 'atelier-blazer',
      title: 'The Double-Breasted Atelier Blazer',
      tagline: 'ITALIAN TAILORING',
      description: 'Structured 6-on-2 tailoring crafted from Super 130s Milanese wool twill with dramatic peak lapels.',
      price: 19800,
      image: '/images/products/blazers/atelier-black.jpg',
      link: '/product/atelier-blazer',
      cta: 'Discover Creation'
    },
    {
      id: 'signet-belt',
      title: 'The Signet Monogram Belt',
      tagline: 'HERITAGE HARDWARE',
      description: 'Hand-beveled box calfskin strap finished with sculptural lost-wax gold Habrenoir monogram buckle.',
      price: 4200,
      image: '/images/products/belts/signet-black.jpg',
      link: '/product/signet-belt',
      cta: 'Discover Creation'
    }
  ];

  return (
    <main className="w-full bg-[#FFFFFF] pt-14 sm:pt-20">

      {/* =========================================================
          1. FULL-BLEED CINEMATIC HERO CAMPAIGN BANNER
         ========================================================= */}
      <section className="relative w-full h-[70vh] sm:h-[82vh] min-h-[500px] max-h-[820px] bg-[#111111] overflow-hidden">
        <img
          src="/images/campaign/hero-campaign.jpg"
          alt="Habrenoir Spring Summer 2026 Campaign"
          className="w-full h-full object-cover object-center filter brightness-[0.92]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"></div>

        {/* Hero Editorial Text & Links */}
        <div className="absolute bottom-10 sm:bottom-16 left-6 sm:left-14 max-w-2xl text-[#FFFFFF] z-10">
          <span className="font-sans text-[11px] sm:text-[12px] uppercase tracking-[0.28em] text-[#C5A880] block mb-2 font-medium">
            SPRING SUMMER 2026 CAMPAIGN
          </span>
          <h1 className="font-serif text-[32px] sm:text-[46px] font-normal tracking-tight text-[#FFFFFF] mb-3 leading-tight">
            HABRENOIR
          </h1>
          <p className="font-sans text-[13px] sm:text-[15px] leading-relaxed text-[#FFFFFF]/90 font-light mb-6 max-w-xl">
            Ghanaian heritage meets modern luxury. Discover the new collection.
          </p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] sm:text-[12px] font-sans tracking-[0.14em] uppercase font-medium">
            <Link
              to="/catalog?gender=women"
              className="px-6 sm:px-7 py-3 sm:py-3.5 bg-[#FFFFFF] text-[#111111] hover:bg-[#3D0C15] hover:text-[#FFFFFF] transition-colors"
            >
              Shop Women
            </Link>
            <Link
              to="/catalog?gender=men"
              className="px-6 sm:px-7 py-3 sm:py-3.5 border border-[#FFFFFF] text-[#FFFFFF] hover:bg-[#FFFFFF] hover:text-[#111111] transition-colors"
            >
              Shop Men
            </Link>
            <Link
              to="/catalog"
              className="text-[#FFFFFF] hover:text-[#C5A880] underline underline-offset-8 transition-colors py-2 sm:py-3"
            >
              All Creations
            </Link>
          </div>
        </div>
      </section>


      {/* =========================================================
          2. FEATURED CREATIONS / PRODUCT SECTION (EXACT REFERENCE ARCHITECTURE)
         ========================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-10 lg:px-14 bg-[#FFFFFF] border-b border-[#EAE6DF]">
        <div className="max-w-[1700px] mx-auto">

          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="font-sans text-[11px] uppercase tracking-[0.28em] text-[#C5A880] block mb-2 font-semibold">
              HABRENOIR · ACCRA
            </span>
            <h2 className="font-serif text-[28px] sm:text-[38px] font-normal text-[#111111] tracking-tight">
              Featured Creations
            </h2>
            <div className="w-12 h-[1px] bg-[#111111] mx-auto mt-4 mb-3"></div>
            <p className="font-sans text-[13px] text-[#6B7280] font-light max-w-lg mx-auto">
              Sculptural leather craftsmanship, refined Blake-stitched footwear, and luxurious silk fabrics, thoughtfully crafted through the fusion of Ghanaian artistry and European design, from our Accra-based atelier to the world.
            </p>
          </div>

          {/* 3-Column Product Grid matching uploaded reference layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {featuredCreations.map((item) => (
              <article
                key={item.id}
                className="flex flex-col group transition-all duration-300"
              >
                {/* Single Image Rectangle - Clean Studio Plinth Stage (No Outer Box) */}
                <Link
                  to={item.link}
                  className="block relative w-full aspect-[4/4.2] bg-[#EFECE8] p-8 sm:p-10 flex items-center justify-center overflow-hidden group-hover:bg-[#EAE6DF] transition-colors"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain transform transition-transform duration-500 ease-out group-hover:scale-105 filter drop-shadow-md"
                  />
                  <span className="absolute top-4 left-4 font-sans text-[9px] uppercase tracking-[0.2em] text-[#767676] bg-[#FFFFFF]/90 px-2.5 py-1 border border-[#EAE6DF]">
                    {item.tagline}
                  </span>
                </Link>

                {/* Details matching user reference image directly below image rectangle */}
                <div className="pt-6 pb-2 px-1 flex flex-col justify-between flex-grow text-left">
                  <div>
                    <Link to={item.link}>
                      <h3 className="font-serif text-[18px] sm:text-[20px] font-bold text-[#111827] group-hover:text-[#3D0C15] transition-colors leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="font-sans text-[12.5px] sm:text-[13px] text-[#6B7280] leading-relaxed font-light mt-2 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Centered Hairline Divider Rule */}
                  <div className="w-8 h-[1px] bg-[#D1D5DB] mx-auto my-4"></div>

                  {/* Centered Bold Price */}
                  <div>
                    <span className="font-sans text-[18px] sm:text-[20px] font-bold text-[#111111] block text-center">
                      {formatCurrency(item.price)}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F4F1EC] text-center">
                    <Link
                      to={item.link}
                      className="inline-flex items-center text-[11px] font-sans uppercase tracking-[0.18em] font-medium text-[#111111] group-hover:text-[#3D0C15] transition-colors"
                    >
                      <span>{item.cta}</span>
                      <span className="ml-1.5 transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>


      {/* =========================================================
          3. TWO HERO IMAGES FOR MALE AND FEMALE (SPLIT PORTAL)
         ========================================================= */}
      <section className="w-full bg-[#FFFFFF] border-b border-[#EAE6DF]">
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* Left Portal: WOMEN */}
          <div className="relative h-[65vh] sm:h-[78vh] min-h-[480px] group overflow-hidden border-b md:border-b-0 md:border-r border-[#EAE6DF]">
            <img
              src="/images/campaign/hero-women-couture.jpg"
              alt="Habrenoir Women's Collection"
              className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-[1.03] filter brightness-[0.92]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>

            {/* Content Overlay */}
            <div className="absolute bottom-8 sm:bottom-12 left-6 sm:left-12 right-6 text-[#FFFFFF] z-10">
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-[#C5A880] block mb-1.5 font-medium">
                WOMEN'S COLLECTION
              </span>
              <h2 className="font-serif text-[28px] sm:text-[38px] font-normal text-[#FFFFFF] mb-2 leading-tight">
                Women's Collection
              </h2>
              <p className="font-sans text-[13px] text-[#FFFFFF]/85 max-w-md font-light mb-5">
                Sculptured leather handbags, evening clutches, and timeless accessories crafted in box calfskin.
              </p>
              <Link
                to="/catalog?gender=women"
                className="inline-block px-7 py-3.5 bg-[#FFFFFF] text-[#111111] hover:bg-[#3D0C15] hover:text-[#FFFFFF] text-[11px] uppercase tracking-[0.18em] font-medium transition-colors"
              >
                Explore Women's Collection
              </Link>
            </div>
          </div>

          {/* Right Portal: MEN */}
          <div className="relative h-[65vh] sm:h-[78vh] min-h-[480px] group overflow-hidden">
            <img
              src="/images/campaign/hero-men-tailoring.jpg"
              alt="Habrenoir Men's Collection"
              className="w-full h-full object-cover object-top transform transition-transform duration-700 ease-out group-hover:scale-[1.03] filter brightness-[0.92]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>

            {/* Content Overlay */}
            <div className="absolute bottom-8 sm:bottom-12 left-6 sm:left-12 right-6 text-[#FFFFFF] z-10">
              <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-[#C5A880] block mb-1.5 font-medium">
                MEN'S COLLECTION
              </span>
              <h2 className="font-serif text-[28px] sm:text-[38px] font-normal text-[#FFFFFF] mb-2 leading-tight">
                Men's Collection
              </h2>
              <p className="font-sans text-[13px] text-[#FFFFFF]/85 max-w-md font-light mb-5">
                Florentine Blake-stitched horsebit loafers, Como silk bowling shirts, and structured double-breasted tailoring.
              </p>
              <Link
                to="/catalog?gender=men"
                className="inline-block px-7 py-3.5 bg-[#FFFFFF] text-[#111111] hover:bg-[#3D0C15] hover:text-[#FFFFFF] text-[11px] uppercase tracking-[0.18em] font-medium transition-colors"
              >
                Explore Men's Collection
              </Link>
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================
          4. CLIENT COMMITMENTS & SERVICES
         ========================================================= */}
      <section className="py-20 px-6 sm:px-12 bg-[#FBF9F5]">
        <div className="max-w-[1400px] mx-auto text-center">
          <HabrenoirLogo
            color="#3D0C15"
            className="w-12 h-12 mx-auto mb-4"
          />
          <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-[#725B38] block mb-3 font-semibold">
            ACCRA · FLORENCE · COMO · MILAN · PARIS
          </span>
          <h2 className="font-serif text-[26px] sm:text-[34px] font-normal text-[#111111] mb-6 leading-relaxed max-w-3xl mx-auto">
            “True luxury resides in the permanence of materials, architectural proportion, and uncompromising craft.”
          </h2>
          <div className="w-16 h-[1px] bg-[#111111] mx-auto mb-12"></div>

          {/* Three Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto font-sans">
            <div className="p-6 bg-[#FFFFFF] border border-[#EAE6DF]">
              <span className="material-symbols-outlined text-[24px] text-[#111111] mb-3 block">local_shipping</span>
              <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                Accra & Nationwide Delivery
              </h4>
              <p className="text-[12px] text-[#666666] leading-relaxed">
                Same-day white-glove courier delivery across Greater Accra; 24-48 hours nationwide across Ghana.
              </p>
            </div>

            <div className="p-6 bg-[#FFFFFF] border border-[#EAE6DF]">
              <span className="material-symbols-outlined text-[24px] text-[#111111] mb-3 block">verified</span>
              <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                Serial Provenance
              </h4>
              <p className="text-[12px] text-[#666666] leading-relaxed">
                Each creation is individually numbered and certified in our atelier registry with an official certificate.
              </p>
            </div>

            <div className="p-6 bg-[#FFFFFF] border border-[#EAE6DF]">
              <span className="material-symbols-outlined text-[24px] text-[#111111] mb-3 block">support_agent</span>
              <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                WhatsApp Concierge
              </h4>
              <p className="text-[12px] text-[#666666] leading-relaxed">
                Direct local advisory via WhatsApp for sizing, instant Paystack checkout, and doorstep delivery coordination in Ghana.
              </p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
};
