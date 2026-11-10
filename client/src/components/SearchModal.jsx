import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { formatCurrency } = useCart();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setResults(json.data || []);
          }
        }
      } catch (e) {
        console.warn('Search query error', e);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const quickSearches = [
    { label: 'Vendôme Handbag', query: 'Vendome' },
    { label: 'Horsebit Loafers', query: 'Horsebit' },
    { label: 'Silk Bowling Shirts', query: 'Silk' },
    { label: 'Bordeaux Calfskin', query: 'Bordeaux' },
    { label: 'Double-Breasted Blazers', query: 'Blazer' }
  ];

  return (
    <div className="fixed inset-0 z-[150] flex flex-col bg-[#FFFFFF] animate-fade-in">
      {/* Top Search Bar */}
      <div className="border-b border-[#E8E3DC] px-6 sm:px-12 py-6 flex items-center justify-between">
        <div className="flex-1 max-w-4xl mx-auto flex items-center space-x-4">
          <svg className="w-5 h-5 text-[#857374]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search creations, leathers or references..."
            className="w-full font-serif text-[20px] sm:text-[28px] text-[#111111] placeholder-[#A89899] bg-transparent outline-none border-none tracking-wide"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#857374] hover:text-[#111111] text-[12px] uppercase font-sans tracking-widest px-2"
            >
              Clear
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="text-[#111111] hover:text-[#3D0C15] p-2"
          aria-label="Close Search"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Quick Search Tags */}
      <div className="border-b border-[#E8E3DC] bg-[#F9F8F6] px-6 sm:px-12 py-3">
        <div className="max-w-4xl mx-auto flex items-center space-x-3 overflow-x-auto no-scrollbar font-sans text-[11px] uppercase tracking-wider text-[#767676]">
          <span className="text-[#C5A880] font-medium flex-shrink-0">Curated:</span>
          {quickSearches.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setQuery(s.query)}
              className="px-3 py-1 bg-[#FFFFFF] border border-[#E8E3DC] hover:border-[#111111] hover:text-[#111111] transition-colors flex-shrink-0"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results Display */}
      <div className="flex-1 overflow-y-auto px-6 sm:px-12 py-10">
        <div className="max-w-5xl mx-auto">
          {loading && (
            <div className="text-center py-16 font-sans text-[12px] uppercase tracking-widest text-[#857374]">
              Searching Catalog...
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="text-center py-20">
              <h4 className="font-serif text-[22px] text-[#111111]">No creations found</h4>
              <p className="font-sans text-[12px] text-[#857374] mt-2 max-w-sm mx-auto">
                No matching archival creations for "{query}". Try browsing our collections or contacting our client concierge.
              </p>
              <button
                onClick={() => {
                  onClose();
                  navigate('/catalog');
                }}
                className="mt-6 px-6 py-3 bg-[#3D0C15] text-[#FFFFFF] font-sans text-[10px] uppercase tracking-[0.22em]"
              >
                View Full Catalog
              </button>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div>
              <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#857374] block mb-6">
                Found {results.length} Creation{results.length > 1 ? 's' : ''}
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    onClick={onClose}
                    className="group flex flex-col bg-[#FFFFFF] border border-[#E8E3DC] p-4 transition-all hover:border-[#111111]"
                  >
                    <div className="aspect-[3/4] bg-[#FFFFFF] flex items-center justify-center overflow-hidden mb-3">
                      <img
                        src={product.image || product.availableColors?.[0]?.image}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span className="font-sans text-[9px] uppercase tracking-widest text-[#857374]">
                      {product.categoryName || product.category}
                    </span>
                    <h5 className="font-sans text-[12px] text-[#111111] group-hover:underline mt-1 line-clamp-1">
                      {product.name}
                    </h5>
                    <span className="font-sans text-[12px] text-[#3D0C15] font-semibold mt-2">
                      {formatCurrency(product.price)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

