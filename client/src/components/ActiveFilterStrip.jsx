import React from 'react';

export const ActiveFilterStrip = ({ filters, onFilterChange, onResetFilters }) => {
  const activeTags = [];

  if (filters.category !== 'all') {
    const categoryLabels = {
      'top-handle': 'Top Handle',
      'shoulder': 'Shoulder Bags',
      'totes': 'Totes & Clutches',
      'clutch': 'Evening Clutches',
      'clutches': 'Evening Clutches'
    };
    activeTags.push({
      key: 'category',
      value: 'all',
      label: categoryLabels[filters.category] || filters.category
    });
  }

  if (filters.color !== 'all') {
    const colorLabels = {
      bordeaux: 'Bordeaux',
      noir: 'Black',
      creme: 'Chalk Cream',
      espresso: 'Dark Brown',
      camel: 'Camel'
    };
    activeTags.push({
      key: 'color',
      value: 'all',
      label: colorLabels[filters.color] || filters.color
    });
  }

  if (filters.size !== 'all') {
    activeTags.push({
      key: 'size',
      value: 'all',
      label: `Size: ${filters.size}`
    });
  }

  if (filters.maxPrice < 50000) {
    activeTags.push({
      key: 'maxPrice',
      value: 50000,
      label: `Under GH₵ ${filters.maxPrice.toLocaleString()}`
    });
  }

  if (activeTags.length === 0) return null;

  return (
    <div className="flex items-center space-x-2 pt-3 overflow-x-auto no-scrollbar font-sans text-[12px]">
      <span className="text-[#888888] mr-1 shrink-0">Applied:</span>
      {activeTags.map((tag) => (
        <span
          key={tag.key}
          className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-[#F5F5F5] text-[#111111] text-[11px] shrink-0 border border-[#E5E5E5]"
        >
          <span>{tag.label}</span>
          <button
            onClick={() => onFilterChange(tag.key, tag.value)}
            className="hover:text-[#BA1A1A] text-[#767676] p-0.5"
            aria-label={`Remove filter ${tag.label}`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}
      <button
        onClick={onResetFilters}
        className="text-[#767676] underline underline-offset-4 text-[11px] hover:text-[#111111] ml-2 shrink-0"
      >
        Clear all
      </button>
    </div>
  );
};
