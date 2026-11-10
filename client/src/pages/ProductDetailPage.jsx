import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { SizeGuideModal } from '../components/SizeGuideModal';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const requestedColorSlug = searchParams.get('color');
  const productId = id || 'vendome-bag';
  const { addToCart, formatCurrency } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  // Accordions
  const [openAccordions, setOpenAccordions] = useState({
    details: true,
    craftsmanship: false,
    shipping: false,
    packaging: false
  });

  const toggleAccordion = (key) => {
    setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            initProductData(result.data);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Backend connection warning, reading fallback', err);
      }

      // Local client fallback
      import('../data/fallbackCatalog.js').then((mod) => {
        const found = mod.fallbackProducts.find(p => p.id === productId) || mod.fallbackProducts[0];
        initProductData(found);
        setLoading(false);
      });
    };

    const initProductData = (prod) => {
      setProduct(prod);
      const colors = prod.availableColors || [];
      const matchColor = requestedColorSlug ? colors.find(c => c.slug === requestedColorSlug) : null;
      const initial = matchColor || colors[0] || {
        name: prod.colorName || 'Classic',
        hex: prod.colorHex || '#111111',
        slug: prod.color || 'default',
        image: prod.image,
        caption: prod.name
      };
      setSelectedColor(initial);
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [productId, requestedColorSlug]);

  if (loading || !product) {
    return (
      <main className="w-full min-h-screen bg-[#FFFFFF] pt-32 pb-20 flex items-center justify-center font-sans text-[13px] text-[#767676]">
        <span>Loading creation details...</span>
      </main>
    );
  }

  const activeMainImage = selectedColor?.image || product.image;
  const availableColors = product.availableColors || [];
  const wishlisted = isInWishlist(product.id);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <main className="w-full bg-[#FFFFFF] pt-20 sm:pt-24 pb-28 font-sans">
      
      {/* 1. Breadcrumbs */}
      <div className="max-w-[1700px] mx-auto px-4 sm:px-12 py-3 border-b border-[#EAE6DF] mb-6">
        <div className="flex items-center space-x-2 font-sans text-[11px] text-[#767676]">
          <Link to="/" className="hover:text-[#111111] underline underline-offset-4">Home</Link>
          <span>/</span>
          <Link to={`/catalog?category=${product.category}`} className="hover:text-[#111111] underline underline-offset-4">
            {product.categoryName || product.category}
          </Link>
          <span>/</span>
          <span className="text-[#111111]">{product.name}</span>
        </div>
      </div>

      {/* 2. Gucci European PDP 2-Column Architecture */}
      <div className="max-w-[1700px] mx-auto px-4 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* =========================================================
              LEFT COLUMN (lg:col-span-7): HIGH-DEFINITION EDITORIAL GALLERY
             ========================================================= */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            
            {/* Main Stage with Zoom Hover */}
            <div
              className="relative w-full aspect-[3/4] bg-[#FFFFFF] border border-[#EAE6DF] overflow-hidden flex items-center justify-center cursor-crosshair group"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <span className="absolute top-4 left-4 z-10 font-sans text-[11px] text-[#767676]">
                {product.badge || 'New Arrival'}
              </span>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)}
                aria-label="Save to Wishlist"
                className="absolute top-4 right-4 z-20 p-2 text-[#111111] hover:text-[#3D0C15] transition-colors"
              >
                <svg
                  className={`w-5 h-5 ${wishlisted ? 'fill-[#111111]' : 'fill-none'}`}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              <img
                key={activeMainImage}
                src={activeMainImage}
                alt={selectedColor?.caption || product.name}
                onError={(e) => {
                  if (product.image && e.target.src !== product.image) {
                    e.target.src = product.image;
                  } else {
                    e.target.src = '/images/products/bags/vendome-burgundy.jpg';
                  }
                }}
                className="w-full h-full object-contain p-6 transition-opacity duration-300 animate-fade-in"
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                        transform: 'scale(1.7)'
                      }
                    : { transform: 'scale(1)' }
                }
              />

              {/* Micro-zoom instruction hint */}
              <div className="hidden sm:block absolute bottom-3 left-4 text-[9px] uppercase tracking-widest text-[#857374] pointer-events-none group-hover:opacity-0 transition-opacity">
                Hover to magnify details
              </div>
            </div>

            {/* Variation Thumbnails */}
            {availableColors.length > 1 && (
              <div className="space-y-2">
                <span className="text-[11px] font-sans uppercase tracking-wider text-[#767676]">
                  Available Colorways & Finishes
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {availableColors.map((clr, index) => {
                    const isSelected = selectedColor?.slug === clr.slug;
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(clr)}
                        className={`aspect-[3/4] p-2 bg-[#FFFFFF] border flex flex-col items-center justify-between transition-all ${
                          isSelected ? 'border-[#111111] ring-1 ring-[#111111]' : 'border-[#EAE6DF] hover:border-[#111111]'
                        }`}
                      >
                        <div className="w-full h-4/5 flex items-center justify-center overflow-hidden">
                          <img
                            src={clr.image}
                            alt={clr.caption}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="text-[10px] text-[#767676] truncate w-full text-center">
                          {clr.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* =========================================================
              RIGHT COLUMN (lg:col-span-5): STICKY EDITORIAL & PURCHASE
             ========================================================= */}
          <div className="lg:col-span-5 flex flex-col space-y-6 lg:sticky lg:top-28">
            
            {/* Header info */}
            <div>
              <span className="text-[10px] font-sans uppercase tracking-[0.24em] text-[#857374] block mb-1">
                {product.ref} · {product.categoryName}
              </span>
              <h1 className="font-serif text-[28px] sm:text-[34px] text-[#111111] font-normal leading-tight">
                {product.name}
              </h1>
              <span className="font-sans text-[20px] font-semibold text-[#3D0C15] block mt-2">
                {formatCurrency(product.price)}
              </span>
            </div>

            {/* Color selection strip */}
            <div className="space-y-2 pt-2 border-t border-[#EAE6DF]">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#767676] uppercase tracking-wider">Color: <strong>{selectedColor?.name}</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                {availableColors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(c)}
                    className={`w-7 h-7 border flex items-center justify-center p-0.5 ${
                      selectedColor?.slug === c.slug ? 'border-[#111111] ring-1 ring-[#111111]' : 'border-[#E8E3DC]'
                    }`}
                    title={c.name}
                  >
                    <span className="w-full h-full block" style={{ backgroundColor: c.hex }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Size & Size Guide Trigger */}
            <div className="flex items-center justify-between pt-2 border-t border-[#EAE6DF] text-[11px]">
              <div>
                <span className="text-[#767676] uppercase tracking-wider block">Proportions / Size</span>
                <strong className="text-[#111111]">{product.sizeLabel || 'Standard Size'}</strong>
              </div>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-[#3D0C15] underline underline-offset-4 font-medium uppercase tracking-wider hover:text-[#111111]"
              >
                Size & Fit Guide →
              </button>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => addToCart(product, selectedColor)}
                className="w-full py-4 bg-[#111111] text-[#FFFFFF] font-sans text-[11px] uppercase tracking-[0.22em] hover:bg-[#3D0C15] transition-colors border border-[#111111] font-medium"
              >
                Add to Shopping Bag
              </button>

              <a
                href={`https://wa.me/233244198820?text=${encodeURIComponent(
                  `Hello Habrenoir Concierge, I'm interested in ordering "${product.name}" (${selectedColor?.name || ''}) priced at ${formatCurrency(product.price)}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#FAFAF8] hover:bg-[#F3EFEA] text-[#111111] font-sans text-[11px] uppercase tracking-[0.16em] transition-colors border border-[#E8E3DC] flex items-center justify-center space-x-2 font-medium"
              >
                <span className="w-2 h-2 rounded-full bg-[#25D366]"></span>
                <span>Inquire / Order via WhatsApp</span>
              </a>

              <button
                onClick={() => toggleWishlist(product)}
                className="w-full py-3 bg-[#FFFFFF] text-[#111111] font-sans text-[11px] uppercase tracking-[0.18em] hover:bg-[#F9F8F6] transition-colors border border-[#E8E3DC] flex items-center justify-center space-x-2"
              >
                <svg className={`w-4 h-4 ${wishlisted ? 'fill-[#111111]' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{wishlisted ? 'Saved to Wishlist' : 'Save to Wishlist'}</span>
              </button>
            </div>

            {/* Accordions */}
            <div className="border-t border-[#EAE6DF] divide-y divide-[#EAE6DF] text-[12px]">
              
              {/* Accordion 1: Details */}
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion('details')}
                  className="w-full flex justify-between items-center text-left uppercase tracking-wider text-[#111111] font-medium"
                >
                  <span>Materials & Craftsmanship</span>
                  <svg className={`w-3.5 h-3.5 text-[#524344] transition-transform duration-200 ${openAccordions.details ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openAccordions.details && (
                  <div className="pt-3 pb-2 text-[#524344] leading-relaxed space-y-2">
                    <p>{product.shortDescription}</p>
                    <ul className="list-disc pl-5 space-y-1 text-[11px] pt-1">
                      {(product.details || []).map((det, idx) => (
                        <li key={idx}>{det}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion 2: Craftsmanship */}
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion('craftsmanship')}
                  className="w-full flex justify-between items-center text-left uppercase tracking-wider text-[#111111] font-medium"
                >
                  <span>Atelier Craftsmanship & Provenance</span>
                  <svg className={`w-3.5 h-3.5 text-[#524344] transition-transform duration-200 ${openAccordions.craftsmanship ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openAccordions.craftsmanship && (
                  <div className="pt-3 pb-2 text-[#524344] leading-relaxed text-[11px] space-y-2">
                    <p>
                      Each Habrenoir hardware piece is cast individually in Accra and Kumasi utilizing 1,000°C lost-wax molten brass metallurgy, then electroplated in Florence with durable champagne gold or palladium.
                    </p>
                    <Link to="/atelier" className="text-[#3D0C15] underline font-medium block pt-1">
                      Explore Our Craftsmanship →
                    </Link>
                  </div>
                )}
              </div>

              {/* Accordion 3: Courier Delivery */}
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full flex justify-between items-center text-left uppercase tracking-wider text-[#111111] font-medium"
                >
                  <span>White-Glove Courier & Returns</span>
                  <svg className={`w-3.5 h-3.5 text-[#524344] transition-transform duration-200 ${openAccordions.shipping ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openAccordions.shipping && (
                  <div className="pt-3 pb-2 text-[#524344] leading-relaxed text-[11px] space-y-2">
                    <p>
                      Complimentary express courier delivery across Greater Accra (same-day delivery for orders before 2:00 PM) and nationwide across Ghana (24–48 hours via secure courier). Delivered in our signature Habrenoir presentation box with archival dust bag.
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        category={product.category}
      />

      {/* Sticky Mobile Add-to-Bag Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-[#FFFFFF] border-t border-[#E8E3DC] p-3 px-4 z-40 flex items-center justify-between shadow-md">
        <div className="pr-3">
          <span className="font-serif text-[13px] text-[#111111] font-normal block truncate max-w-[170px] leading-tight">
            {product.name}
          </span>
          <span className="font-sans text-[12px] font-semibold text-[#3D0C15]">
            {formatCurrency(product.price)}
          </span>
        </div>
        <button
          onClick={() => addToCart(product, selectedColor)}
          className="px-5 py-2.5 bg-[#111111] text-[#FFFFFF] font-sans text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-[#3D0C15] transition-colors whitespace-nowrap"
        >
          Add to Bag
        </button>
      </div>
    </main>
  );
};
