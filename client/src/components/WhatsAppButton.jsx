import React, { useState } from 'react';

/**
 * WhatsApp Floating Action Button
 * Luxury-styled direct customer service inquiry button for the Ghanaian market.
 * Provides high conversion by connecting shoppers directly to the Accra concierge.
 */
export const WhatsAppButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  // Ghanaian customer care concierge line
  const whatsappNumber = '233244198820'; // Local Ghana representative (+233)
  const defaultMessage = encodeURIComponent(
    "Hello Habrenoir Concierge, I'm browsing your online collection and would like to inquire about an item."
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  return (
    <aside
      aria-label="Direct WhatsApp Concierge"
      className="fixed bottom-20 sm:bottom-8 right-4 sm:right-8 z-[90] flex items-center space-x-2.5 print:hidden select-none pointer-events-auto"
    >
      {/* Floating Concierge Pill / Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center bg-[#140002] hover:bg-[#2A050D] text-[#FFFFFF] border border-[#C5A880]/70 pl-3.5 pr-4 py-2.5 sm:py-3 shadow-[0_10px_30px_rgba(20,0,2,0.35)] transition-all duration-300 ease-out hover:scale-[1.03] active:scale-[0.98]"
        aria-label="Chat with Habrenoir Concierge on WhatsApp"
      >
        {/* Live Status Indicator Dot */}
        <span className="relative flex h-2.5 w-2.5 mr-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25D366]"></span>
        </span>

        {/* WhatsApp Vector Icon in Champagne Gold */}
        <svg
          className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#C5A880] group-hover:text-[#FFFFFF] transition-colors flex-shrink-0 mr-2"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12.031 2C6.5 2 2 6.5 2 12.031c0 1.969.563 3.813 1.563 5.375L2 22l4.75-1.531c1.5 1 3.281 1.563 5.281 1.563 5.531 0 10.031-4.5 10.031-10.031S17.563 2 12.031 2zm0 18.281c-1.781 0-3.375-.5-4.719-1.375l-.344-.219-2.813.906.938-2.75-.219-.344C3.875 15.063 3.375 13.594 3.375 12c0-4.75 3.875-8.625 8.656-8.625s8.656 3.875 8.656 8.625c0 4.781-3.875 8.656-8.656 8.656zm4.75-6.469c-.25-.125-1.5-.75-1.719-.844-.219-.094-.375-.125-.531.125s-.625.844-.781 1.031c-.156.156-.281.188-.531.063-.25-.125-1.063-.375-2.031-1.25-.75-.656-1.25-1.469-1.406-1.719-.156-.25 0-.406.125-.531.125-.125.25-.281.375-.438.125-.156.156-.25.25-.406.094-.156.031-.313-.031-.438s-.531-1.281-.719-1.75c-.188-.469-.375-.406-.531-.406h-.438c-.156 0-.406.063-.625.313-.219.219-.844.813-.844 2s.875 2.313 1 2.469c.125.188 1.719 2.656 4.156 3.719.594.25 1.063.406 1.438.531.594.188 1.156.156 1.594.094.469-.063 1.5-.625 1.719-1.219.219-.594.219-1.125.156-1.219-.063-.125-.219-.188-.469-.313z" />
        </svg>

        {/* Text Label */}
        <div className="flex flex-col text-left">
          <span className="font-sans text-[10px] sm:text-[11px] font-semibold tracking-[0.16em] uppercase text-[#ECE7DF] group-hover:text-[#FFFFFF] leading-tight">
            WhatsApp Concierge
          </span>
          <span className="font-sans text-[8.5px] tracking-wider text-[#C5A880] leading-none mt-0.5 hidden sm:inline">
            Direct Local Support · Accra
          </span>
        </div>
      </a>
    </aside>
  );
};

