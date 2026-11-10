import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const ProductCard = ({ product }) => {
  const { addToCart, formatCurrency } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  // Active variation state for this card
  const initialColor = product.availableColors?.[0] || {
    name: product.colorName || 'Classic',
    hex: product.colorHex || '#111111',
    slug: product.color || 'default',
    image: product.image
  };
  const [selectedColor, setSelectedColor] = useState(initialColor);

  const displayedImage = selectedColor.image || product.image;
  const isSaved = isInWishlist(product.id);

  return (
    <article className="flex flex-col relative group transition-all duration-300">
      
      {/* Product Image Stage (The Single Neutral Plinth Rectangle) */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] bg-[#EFECE8] group-hover:bg-[#EAE6DF] overflow-hidden transition-colors">
        {/* Top Tag & Wishlist */}
        <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between pointer-events-none">
          <span className="font-sans text-[10px] text-[#767676] tracking-wider uppercase font-medium bg-[#FFFFFF]/90 px-2.5 py-0.5 border border-[#EAE6DF]">
            {product.badge ? product.badge.replace(/RUNWAY · /g, '').replace(/RUNWAY/g, 'New Arrival') : 'New Arrival'}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            aria-label="Save to Wishlist"
            className="pointer-events-auto text-[#111111] hover:text-[#3D0C15] transition-colors p-1.5 bg-[#FFFFFF]/80 hover:bg-[#FFFFFF]"
          >
            <svg
              className={`w-[17px] h-[17px] ${isSaved ? 'fill-[#111111]' : 'fill-none'}`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        <Link
          to={`/product/${product.id}?color=${selectedColor.slug}`}
          className="w-full h-full p-6 sm:p-8 flex items-center justify-center"
        >
          <img
            src={displayedImage}
            alt={product.name}
            onError={(e) => {
              if (product.image && e.target.src !== product.image) {
                e.target.src = product.image;
              } else {
                e.target.src = '/images/products/bags/vendome-burgundy.jpg';
              }
            }}
            className="w-full h-full object-contain transform transition-transform duration-500 ease-out group-hover:scale-105 filter drop-shadow-md"
          />
        </Link>
      </div>

      {/* Product Information (Title, Description, Divider, Centered Price directly below) */}
      <div className="pt-5 pb-2 px-1 flex flex-col justify-between flex-grow text-left">
        <div>
          <Link to={`/product/${product.id}?color=${selectedColor.slug}`}>
            <h3 className="font-serif text-[17px] sm:text-[19px] font-bold text-[#111827] group-hover:text-[#3D0C15] transition-colors leading-snug line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <p className="font-sans text-[12px] sm:text-[12.5px] text-[#6B7280] leading-relaxed line-clamp-2 mt-2 font-light">
            {product.shortDescription || 'Mastercrafted in the Habrenoir ateliers using sculpted box calfskin.'}
          </p>
        </div>

        {/* Centered Hairline Divider Line */}
        <div className="w-8 h-[1px] bg-[#D1D5DB] mx-auto my-3.5"></div>

        {/* Centered Bold Price */}
        <div>
          <span className="font-sans text-[17px] sm:text-[19px] font-bold text-[#111111] block text-center">
            {formatCurrency(product.price)}
          </span>
        </div>

        {/* Colorway Swatches */}
        {product.availableColors && product.availableColors.length > 1 && (
          <div className="flex items-center justify-center space-x-1.5 mt-2.5 pt-2 border-t border-[#F4F1EC]">
            {product.availableColors.map((clr, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedColor(clr);
                }}
                className={`w-3.5 h-3.5 border transition-all ${
                  selectedColor.slug === clr.slug
                    ? 'border-[#111111] ring-1 ring-[#111111]'
                    : 'border-[#E8E3DC] hover:border-[#857374]'
                }`}
                style={{ backgroundColor: clr.hex }}
                title={clr.name}
                aria-label={`Select ${clr.name}`}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
};
