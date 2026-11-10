import React from 'react';

export const FilterDrawer = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onResetFilters,
  totalResultsCount
}) => {
  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Creations' },
    { id: 'bags', label: 'Bags & Leather Goods' },
    { id: 'shoes', label: 'Footwear & Shoes' },
    { id: 'shirts', label: 'Ready-to-Wear Shirts' },
    { id: 'blazers', label: 'Tailoring & Outerwear' },
    { id: 'accessories', label: 'Belts & Accessories' }
  ];

  const colors = [
    { id: 'all', name: 'All Colors', hex: '#EAE6DF' },
    { id: 'noir', name: 'Classic Black', hex: '#140002' },
    { id: 'bordeaux', name: 'Deep Burgundy', hex: '#3D0C15' },
    { id: 'creme', name: 'Ivory Cream', hex: '#F3EDE3' },
    { id: 'camel', name: 'Tobacco Brown', hex: '#8C582B' },
    { id: 'emerald', name: 'Emerald Green', hex: '#124C34' }
  ];

  const sizes = [
    { id: 'all', label: 'All Sizes' },
    { id: 'M', label: 'Medium (Shirts & Tops)' },
    { id: 'medium', label: 'Medium (Bags)' },
    { id: '42', label: 'EU 42 (Shoes)' },
    { id: '48', label: 'IT 48 (Blazers)' },
    { id: '90', label: '90 cm (Belts)' }
  ];

  const activeFiltersCount =
    (filters.category !== 'all' ? 1 : 0) +
    (filters.color !== 'all' ? 1 : 0) +
    (filters.size !== 'all' ? 1 : 0) +
    (filters.maxPrice < 50000 ? 1 : 0);

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#000000]/30 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Body (Gucci Style: Minimalist White, Hairline Borders) */}
      <aside className="relative w-full max-w-md bg-[#FFFFFF] border-l border-[#EAE6DF] h-full flex flex-col justify-between z-10 animate-fade-in shadow-none">
        
        {/* Header */}
        <div className="h-16 sm:h-20 px-6 sm:px-8 border-b border-[#EAE6DF] flex items-center justify-between bg-[#FFFFFF]">
          <span className="font-sans text-[13px] uppercase tracking-[0.14em] text-[#111111] font-medium">
            Filter and Sort {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </span>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-[#111111] hover:text-[#725B38] transition-colors"
            aria-label="Close filters"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Filters Scrollable Container */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-8 no-scrollbar font-sans">
          
          {/* Category */}
          <div className="space-y-3">
            <span className="text-[12px] uppercase tracking-wider text-[#111111] font-semibold block pb-2 border-b border-[#EAE6DF]">
              Category
            </span>
            <div className="flex flex-col space-y-2 pt-1 text-[13px]">
              {categories.map((cat) => {
                const isSelected = filters.category === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => onFilterChange('category', cat.id)}
                    className={`flex items-center justify-between text-left py-1 hover:underline ${
                      isSelected ? 'font-bold text-[#111111]' : 'text-[#555555]'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {isSelected && (
                      <svg className="w-3.5 h-3.5 text-[#3D0C15]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color */}
          <div className="space-y-3">
            <span className="text-[12px] uppercase tracking-wider text-[#111111] font-semibold block pb-2 border-b border-[#EAE6DF]">
              Color
            </span>
            <div className="grid grid-cols-2 gap-2 pt-1 text-[12px]">
              {colors.map((c) => {
                const isSelected = filters.color === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => onFilterChange('color', c.id)}
                    className={`flex items-center space-x-2.5 p-2 border transition-all text-left ${
                      isSelected
                        ? 'border-[#111111] bg-[#F9F8F6] font-medium text-[#111111]'
                        : 'border-[#EAE6DF] hover:border-[#111111] text-[#555555]'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 shrink-0 border border-black/10"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="truncate">{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size */}
          <div className="space-y-3">
            <span className="text-[12px] uppercase tracking-wider text-[#111111] font-semibold block pb-2 border-b border-[#EAE6DF]">
              Size
            </span>
            <div className="flex flex-col space-y-2 pt-1 text-[13px]">
              {sizes.map((s) => {
                const isSelected = filters.size === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => onFilterChange('size', s.id)}
                    className={`flex items-center justify-between text-left py-1 hover:underline ${
                      isSelected ? 'font-bold text-[#111111]' : 'text-[#555555]'
                    }`}
                  >
                    <span>{s.label}</span>
                    {isSelected && (
                      <svg className="w-3.5 h-3.5 text-[#3D0C15]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#EAE6DF]">
              <span className="text-[12px] uppercase tracking-wider text-[#111111] font-semibold">
                Maximum Price
              </span>
              <span className="text-[13px] font-medium text-[#111111]">
                GH₵ {Number(filters.maxPrice).toLocaleString('en-US')}
              </span>
            </div>
            <input
              type="range"
              min="3000"
              max="50000"
              step="500"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange('maxPrice', Number(e.target.value))}
              className="w-full accent-[#111111] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#767676]">
              <span>GH₵ 3,000</span>
              <span>GH₵ 35,000+</span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-[#EAE6DF] bg-[#FFFFFF] flex items-center space-x-4">
          <button
            onClick={onResetFilters}
            className="flex-1 py-3 text-center text-[12px] uppercase tracking-widest text-[#767676] hover:text-[#111111] transition-colors border border-[#EAE6DF] hover:border-[#111111]"
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 text-center text-[12px] uppercase tracking-widest text-[#FFFFFF] bg-[#111111] hover:bg-[#3D0C15] transition-colors font-medium"
          >
            View ({totalResultsCount})
          </button>
        </div>

      </aside>
    </div>
  );
};
