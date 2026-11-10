import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { HabrenoirLogo } from './HabrenoirLogo';

export const WishlistDrawer = () => {
  const { wishlist, wishlistCount, isWishlistOpen, closeWishlist, removeFromWishlist } = useWishlist();
  const { addToCart, formatCurrency } = useCart();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#111111]/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeWishlist}
        aria-hidden="true"
      />

      {/* Drawer Body */}
      <aside className="relative w-full max-w-full sm:max-w-md bg-[#FFFFFF] border-l border-[#E8E3DC] h-full flex flex-col justify-between z-10 rounded-none shadow-none animate-fade-in">
        {/* Header */}
        <div className="h-20 px-6 border-b border-[#E8E3DC] flex items-center justify-between bg-[#FFFFFF]">
          <div className="flex items-center space-x-2">
            <span className="font-serif text-[20px] uppercase tracking-[0.14em] text-[#111111]">
              Saved Creations
            </span>
            <span className="font-sans text-[12px] text-[#725B38] tracking-widest font-medium">
              ({wishlistCount})
            </span>
          </div>
          <button
            onClick={closeWishlist}
            className="w-10 h-10 flex items-center justify-center text-[#111111] hover:text-[#3D0C15] transition-colors rounded-none"
            aria-label="Close Wishlist"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {wishlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <HabrenoirLogo color="#3D0C15" className="w-10 h-10 mb-3" />
              <h5 className="font-serif text-[18px] text-[#111111] uppercase tracking-wide">
                Your wishlist is empty
              </h5>
              <p className="font-sans text-[13px] text-[#767676] mt-2 max-w-[260px] leading-relaxed">
                Save pieces to your private salon curation while exploring our archives.
              </p>
              <Link
                to="/catalog"
                onClick={closeWishlist}
                className="mt-6 px-6 py-3 bg-[#3D0C15] text-[#FFFFFF] font-sans text-[10px] uppercase tracking-[0.24em] hover:bg-[#140002] transition-colors"
              >
                Explore Catalog
              </Link>
            </div>
          ) : (
            wishlist.map((item) => (
              <div
                key={item.id}
                className="flex items-start space-x-4 p-4 border border-[#E8E3DC] bg-[#F9F8F6] relative group"
              >
                <Link
                  to={`/product/${item.id}`}
                  onClick={closeWishlist}
                  className="w-20 h-24 bg-[#FFFFFF] border border-[#E8E3DC] flex-shrink-0 flex items-center justify-center p-2"
                >
                  <img
                    src={item.image || item.availableColors?.[0]?.image}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </Link>

                <div className="flex-1 min-w-0 pr-6">
                  <Link
                    to={`/product/${item.id}`}
                    onClick={closeWishlist}
                    className="font-sans text-[12px] text-[#111111] hover:underline font-normal block leading-tight truncate"
                  >
                    {item.name}
                  </Link>
                  <span className="font-sans text-[10px] text-[#857374] uppercase tracking-wider block mt-1">
                    {item.categoryName || item.category}
                  </span>
                  <span className="font-sans text-[12px] text-[#3D0C15] font-semibold block mt-2">
                    {formatCurrency(item.price)}
                  </span>

                  <button
                    onClick={() => {
                      addToCart(item);
                      removeFromWishlist(item.id);
                    }}
                    className="mt-3 px-3 py-1.5 bg-[#111111] text-[#FFFFFF] font-sans text-[9px] uppercase tracking-[0.2em] hover:bg-[#3D0C15] transition-colors"
                  >
                    Move to Bag
                  </button>
                </div>

                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-3 right-3 text-[#857374] hover:text-[#3D0C15] p-1"
                  aria-label="Remove from Wishlist"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {wishlist.length > 0 && (
          <div className="p-6 border-t border-[#E8E3DC] bg-[#FFFFFF]">
            <Link
              to="/catalog"
              onClick={closeWishlist}
              className="block w-full py-3.5 text-center border border-[#111111] text-[#111111] font-sans text-[10px] uppercase tracking-[0.22em] hover:bg-[#111111] hover:text-[#FFFFFF] transition-colors"
            >
              Continue Exploring
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
};

