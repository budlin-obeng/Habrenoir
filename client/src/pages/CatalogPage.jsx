import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { FilterDrawer } from '../components/FilterDrawer';
import { ActiveFilterStrip } from '../components/ActiveFilterStrip';

export const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get('category') || 'all';
  const urlGender = searchParams.get('gender') || 'all';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(urlCategory);
  const [sortOption, setSortOption] = useState('curated');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Filter criteria state
  const [filters, setFilters] = useState({
    category: urlCategory,
    gender: urlGender,
    color: 'all',
    size: 'all',
    maxPrice: 50000
  });

  // Keep filters in sync when searchParams change
  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    const gen = searchParams.get('gender') || 'all';
    setFilters(prev => ({ ...prev, category: cat, gender: gen }));
    setActiveCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (filters.category !== 'all') queryParams.append('category', filters.category);
        if (filters.gender !== 'all') queryParams.append('gender', filters.gender);
        if (filters.color !== 'all') queryParams.append('color', filters.color);
        if (filters.size !== 'all') queryParams.append('size', filters.size);
        if (filters.maxPrice < 50000) queryParams.append('maxPrice', filters.maxPrice);
        if (sortOption !== 'curated') queryParams.append('sort', sortOption);

        const res = await fetch(`/api/products?${queryParams.toString()}`);
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data) {
            setProducts(result.data);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.warn('Backend connection warning, reading fallback', e);
      }

      // Local client fallback
      import('../data/fallbackCatalog.js').then((mod) => {
        let items = [...mod.fallbackProducts];
        if (filters.gender !== 'all') {
          items = items.filter(p => p.gender === filters.gender || p.gender === 'unisex');
        }
        if (filters.category !== 'all') {
          items = items.filter(p => p.category === filters.category);
        }
        if (filters.color !== 'all') {
          items = items.filter(p => p.color === filters.color || p.availableColors?.some(c => c.slug === filters.color));
        }
        if (filters.size !== 'all') {
          items = items.filter(p => p.size === filters.size);
        }
        if (filters.maxPrice < 5000) {
          items = items.filter(p => p.price <= filters.maxPrice);
        }
        if (sortOption === 'price-asc') items.sort((a, b) => a.price - b.price);
        if (sortOption === 'price-desc') items.sort((a, b) => b.price - a.price);
        setProducts(items);
        setLoading(false);
      });
    };

    fetchCatalog();
  }, [filters, sortOption]);

  const handleFilterChange = (key, val) => {
    setFilters(prev => ({ ...prev, [key]: val }));
    if (key === 'category') {
      setActiveCategory(val);
      // Update URL param cleanly
      const newParams = new URLSearchParams(searchParams);
      if (val === 'all') newParams.delete('category');
      else newParams.set('category', val);
      setSearchParams(newParams);
    }
  };

  const handleResetFilters = () => {
    setFilters({ category: 'all', gender: 'all', color: 'all', size: 'all', maxPrice: 50000 });
    setActiveCategory('all');
    setSearchParams(new URLSearchParams());
  };

  const handleCategoryTabClick = (catId) => {
    handleFilterChange('category', catId);
  };

  const categoriesTabs = [
    { id: 'all', label: 'ALL CREATIONS' },
    { id: 'bags', label: 'Bags & Leather' },
    { id: 'shoes', label: 'Footwear & Loafers' },
    { id: 'shirts', label: 'Silk Shirts' },
    { id: 'blazers', label: 'Tailoring & Blazers' },
    { id: 'accessories', label: 'Belts & Accessories' }
  ];

  // Dynamic Hero Configuration Based on Active Filter / Group
  let heroTitle = "Handcrafted Leather Goods & Apparel";
  let heroDescription = "The Habrenoir luxury fashion collection ranges from sculpted box calfskin handbags and horsebit loafers to Como silk bowling shirts and double-breasted tailoring.";
  let heroImage = "/images/campaign/hero-palazzo.jpg";
  let breadcrumbLabel = "All Creations";

  if (filters.gender === 'women') {
    heroTitle = "Women's Collection";
    heroDescription = "The Habrenoir women's collection features sculptural top-handle handbags, evening clutches, and luxury leather goods.";
    breadcrumbLabel = "Women's Collection";
    heroImage = "/images/campaign/hero-women-couture.jpg";
  } else if (filters.gender === 'men') {
    heroTitle = "Men's Collection";
    heroDescription = "The Habrenoir men's collection features Blake-stitched horsebit loafers, Como silk bowling shirts, and Milanese tailored blazers.";
    breadcrumbLabel = "Men's Collection";
    heroImage = "/images/campaign/hero-men-tailoring.jpg";
  }

  if (filters.category === 'bags') {
    heroTitle = "Women's Handbags";
    heroDescription = "Sculpted top-handle creations, glazed box calfskin, and architectural turn-lock clasps in deep burgundy and classic black.";
    breadcrumbLabel = "Handbags & Leather Goods";
    heroImage = "/images/campaign/hero-women-couture.jpg";
  } else if (filters.category === 'shoes') {
    heroTitle = "Men's Footwear & Shoes";
    heroDescription = "Handcrafted Florentine horsebit loafers in burnished calfskin and velvety tobacco suede with Blake-stitched soles.";
    breadcrumbLabel = "Footwear & Shoes";
    heroImage = "/images/campaign/hero-men-tailoring.jpg";
  } else if (filters.category === 'shirts') {
    heroTitle = "Ready-to-Wear Silk Shirts";
    heroDescription = "Como mulberry silk crepe bowling shirts with cuban camp collars and botanical jacquard flora.";
    breadcrumbLabel = "Ready-to-Wear Shirts";
  } else if (filters.category === 'blazers') {
    heroTitle = "Tailoring & Blazers";
    heroDescription = "Double-breasted structured jackets in Super 130s wool twill and opulent royal evening velvet.";
    breadcrumbLabel = "Tailoring & Blazers";
  } else if (filters.category === 'accessories') {
    heroTitle = "Belts & Accessories";
    heroDescription = "Box calfskin waist belts featuring hand-beveled edges and sculptural interlocking monogram buckles.";
    breadcrumbLabel = "Belts & Accessories";
  }

  return (
    <main className="w-full bg-[#FFFFFF] pt-14 sm:pt-20 pb-24">
      
      {/* 1. Full-Bleed Cinematic Hero Banner (Exact Gucci Format) */}
      <section className="relative w-full h-[46vh] sm:h-[58vh] min-h-[350px] max-h-[580px] bg-[#111111] overflow-hidden">
        <img
          src={heroImage}
          alt={heroTitle}
          className="w-full h-full object-cover object-center filter brightness-[0.92]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"></div>

        {/* Bottom Left Editorial Overlay */}
        <div className="absolute bottom-8 sm:bottom-12 left-4 sm:left-12 max-w-xl text-[#FFFFFF] z-10">
          <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-[#C5A880] block mb-1">
            HABRENOIR ARCHIVE
          </span>
          <h1 className="font-serif text-[26px] sm:text-[36px] font-normal tracking-tight text-[#FFFFFF] mb-2 leading-tight">
            {heroTitle}
          </h1>
          <p className="font-sans text-[13px] sm:text-[14px] leading-relaxed text-[#FFFFFF]/90 font-light">
            {heroDescription}
          </p>
        </div>
      </section>

      {/* 2. Sub-Category Tabs Strip (Exact Gucci Layout) */}
      <section className="border-b border-[#EAE6DF] bg-[#FFFFFF] px-4 sm:px-12 pt-6 pb-4">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center space-x-2 text-[11px] font-sans text-[#767676]">
          <Link to="/" className="underline underline-offset-4 hover:text-[#111111]">Home</Link>
          <span>/</span>
          {filters.gender !== 'all' && (
            <>
              <Link to={`/catalog?gender=${filters.gender}`} className="underline underline-offset-4 hover:text-[#111111] capitalize">
                {filters.gender}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-[#111111] font-medium">{breadcrumbLabel}</span>
        </div>

        {/* Horizontal Category Nav */}
        <div className="flex items-center space-x-6 sm:space-x-8 overflow-x-auto no-scrollbar whitespace-nowrap text-[13px] font-sans">
          {categoriesTabs.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleCategoryTabClick(tab.id)}
                className={`transition-colors py-1 ${
                  isActive
                    ? 'font-bold uppercase text-[#111111] border-b-2 border-[#111111]'
                    : 'text-[#666666] hover:text-[#111111] font-normal'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Catalog Utility Toolbar */}
      <section className="max-w-[1800px] mx-auto px-4 sm:px-12 py-5 font-sans text-[13px]">
        <div className="flex items-center justify-between border-b border-[#EAE6DF] pb-4">
          
          {/* Left: Count & Sort Descriptor */}
          <div className="relative">
            <button
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              className="flex items-center space-x-1.5 text-[#111111] hover:text-[#725B38] transition-colors"
            >
              <span className="font-medium">{products.length} Items</span>
              <span className="text-[#767676]">Sorted by</span>
              <span className="underline underline-offset-4 font-normal capitalize">
                {sortOption === 'curated' ? 'Curated' : sortOption === 'price-asc' ? 'Price: Low to High' : 'Price: High to Low'}
              </span>
              <svg className={`w-3 h-3 ml-1 text-[#524344] transition-transform ${isSortDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isSortDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-52 bg-[#FFFFFF] border border-[#EAE6DF] z-30 shadow-none py-2 text-[12px]">
                <button
                  onClick={() => { setSortOption('curated'); setIsSortDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2 hover:bg-[#F9F8F6] ${sortOption === 'curated' ? 'font-bold text-[#111111]' : 'text-[#555555]'}`}
                >
                  Curated
                </button>
                <button
                  onClick={() => { setSortOption('price-asc'); setIsSortDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2 hover:bg-[#F9F8F6] ${sortOption === 'price-asc' ? 'font-bold text-[#111111]' : 'text-[#555555]'}`}
                >
                  Price: Low to High
                </button>
                <button
                  onClick={() => { setSortOption('price-desc'); setIsSortDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2 hover:bg-[#F9F8F6] ${sortOption === 'price-desc' ? 'font-bold text-[#111111]' : 'text-[#555555]'}`}
                >
                  Price: High to Low
                </button>
              </div>
            )}
          </div>

          {/* Right: Filter Trigger */}
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="flex items-center space-x-2 text-[#111111] hover:text-[#725B38] transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="4" y1="21" x2="4" y2="14" />
              <line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" />
              <line x1="20" y1="12" x2="20" y2="3" />
              <line x1="1" y1="14" x2="7" y2="14" />
              <line x1="9" y1="8" x2="15" y2="8" />
              <line x1="17" y1="16" x2="23" y2="16" />
            </svg>
            <span className="underline underline-offset-4 font-normal">
              Filter and sort
            </span>
          </button>
        </div>

        {/* Active Filters Bar if any */}
        <ActiveFilterStrip
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />
      </section>

      {/* 4. The 4-Column Planar Product Grid (Exact Reference Cards with Elevated Plinths) */}
      <section className="max-w-[1800px] mx-auto px-4 sm:px-12">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
              <div key={n} className="aspect-[3/4] bg-[#FFFFFF] border border-[#EAE6DF] animate-pulse flex items-center justify-center">
                <span className="text-[11px] text-[#C5A880] tracking-widest font-sans uppercase">Habrenoir Atelier</span>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-24 text-center px-4">
            <h3 className="font-sans text-[18px] text-[#111111] mb-2 font-normal">No items found matching your selection</h3>
            <p className="font-sans text-[13px] text-[#767676] mb-6">Try clearing your filters to view the full collection.</p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 border border-[#111111] text-[#111111] font-sans text-[12px] hover:bg-[#111111] hover:text-[#FFFFFF] transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {products.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        )}
      </section>

      {/* 5. Editorial In-Grid Interstitial Feature */}
      <section className="my-16 px-4 sm:px-12">
        <div className="max-w-[1400px] mx-auto bg-[#FBF9F5] border border-[#EAE6DF] p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#725B38] block mb-2 font-semibold">
              EXQUISITE CRAFTSMANSHIP · ACCRA & FLORENCE
            </span>
            <h2 className="font-serif text-[26px] sm:text-[32px] text-[#111111] font-normal leading-tight mb-4">
              The Architecture of The Vendôme
            </h2>
            <p className="font-sans text-[13px] text-[#524344] leading-relaxed">
              “Crafted using hand-selected Tuscan box calfskin and solid brass hardware dipped in mirror-polished palladium. Each bag is finished with eight hand-lacquered edge coats.”
            </p>
          </div>
          <div className="w-full md:w-auto">
            <Link
              to="/product/vendome-bag"
              className="w-full md:w-auto inline-block px-8 py-3.5 bg-[#111111] text-[#FFFFFF] font-sans text-[11px] uppercase tracking-[0.2em] hover:bg-[#3D0C15] transition-colors text-center"
            >
              Explore Vendôme
            </Link>
          </div>
        </div>
      </section>

      {/* Slide-over Filter & Refine Drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        totalResultsCount={products.length}
      />

    </main>
  );
};
