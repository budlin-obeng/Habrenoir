import React, { useState, useEffect, useRef } from 'react';

/**
 * WhatsApp Floating Concierge Button
 * Ultra-compact, draggable floating badge providing direct concierge connection
 * for the Ghanaian market without obstructing the luxury shopping experience.
 */
export const WhatsAppButton = () => {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Ghanaian customer care concierge line
  const whatsappNumber = '233244198820'; // Local Ghana representative (+233)
  const defaultMessage = encodeURIComponent(
    "Hello Habrenoir Concierge, I'm browsing your online collection and would like to inquire about an item."
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  // Internal mutable drag tracking
  const dragInfo = useRef({
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
    hasMoved: false
  });

  // Calculate default position (bottom-right) or retrieve from session
  useEffect(() => {
    const updateDefaultPosition = () => {
      const saved = sessionStorage.getItem('hbn_wa_position');
      const btnWidth = buttonRef.current ? buttonRef.current.offsetWidth : 110;
      const btnHeight = buttonRef.current ? buttonRef.current.offsetHeight : 38;

      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const clampedX = Math.min(Math.max(12, parsed.x), window.innerWidth - btnWidth - 12);
          const clampedY = Math.min(Math.max(70, parsed.y), window.innerHeight - btnHeight - 12);
          setPosition({ x: clampedX, y: clampedY });
          return;
        } catch (e) {}
      }

      const defaultX = Math.max(12, window.innerWidth - btnWidth - 20);
      const defaultY = Math.max(70, window.innerHeight - btnHeight - 24);
      setPosition({ x: defaultX, y: defaultY });
    };

    updateDefaultPosition();

    // Re-clamp on window resize
    const handleResize = () => {
      setPosition(prev => {
        if (!prev) return prev;
        const btnWidth = buttonRef.current ? buttonRef.current.offsetWidth : 110;
        const btnHeight = buttonRef.current ? buttonRef.current.offsetHeight : 38;
        return {
          x: Math.min(Math.max(12, prev.x), window.innerWidth - btnWidth - 12),
          y: Math.min(Math.max(70, prev.y), window.innerHeight - btnHeight - 12)
        };
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse Drag Handler
  const handleMouseDown = (e) => {
    if (e.button !== 0 || !position) return; // Only primary mouse button

    dragInfo.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: position.x,
      origY: position.y,
      hasMoved: false
    };

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - dragInfo.current.startX;
      const dy = moveEvent.clientY - dragInfo.current.startY;

      if (Math.hypot(dx, dy) > 4) {
        dragInfo.current.hasMoved = true;
        setIsDragging(true);
      }

      const btnWidth = buttonRef.current ? buttonRef.current.offsetWidth : 110;
      const btnHeight = buttonRef.current ? buttonRef.current.offsetHeight : 38;

      const nextX = Math.min(
        Math.max(12, dragInfo.current.origX + dx),
        window.innerWidth - btnWidth - 12
      );
      const nextY = Math.min(
        Math.max(70, dragInfo.current.origY + dy),
        window.innerHeight - btnHeight - 12
      );

      setPosition({ x: nextX, y: nextY });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      setIsDragging(false);

      if (dragInfo.current.hasMoved) {
        setPosition(latest => {
          if (latest) {
            sessionStorage.setItem('hbn_wa_position', JSON.stringify(latest));
          }
          return latest;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Touch Drag Handler for Mobile
  const handleTouchStart = (e) => {
    if (e.touches.length !== 1 || !position) return;
    const touch = e.touches[0];

    dragInfo.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      origX: position.x,
      origY: position.y,
      hasMoved: false
    };

    const handleTouchMove = (moveEvent) => {
      if (moveEvent.touches.length !== 1) return;
      const currentTouch = moveEvent.touches[0];
      const dx = currentTouch.clientX - dragInfo.current.startX;
      const dy = currentTouch.clientY - dragInfo.current.startY;

      if (Math.hypot(dx, dy) > 6) {
        dragInfo.current.hasMoved = true;
        setIsDragging(true);
        if (moveEvent.cancelable) moveEvent.preventDefault(); // Prevent page scroll during drag
      }

      const btnWidth = buttonRef.current ? buttonRef.current.offsetWidth : 110;
      const btnHeight = buttonRef.current ? buttonRef.current.offsetHeight : 38;

      const nextX = Math.min(
        Math.max(12, dragInfo.current.origX + dx),
        window.innerWidth - btnWidth - 12
      );
      const nextY = Math.min(
        Math.max(70, dragInfo.current.origY + dy),
        window.innerHeight - btnHeight - 12
      );

      setPosition({ x: nextX, y: nextY });
    };

    const handleTouchEnd = () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      setIsDragging(false);

      if (dragInfo.current.hasMoved) {
        setPosition(latest => {
          if (latest) {
            sessionStorage.setItem('hbn_wa_position', JSON.stringify(latest));
          }
          return latest;
        });
      }
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
  };

  // Prevent link opening if the user dragged the button
  const handleClick = (e) => {
    if (dragInfo.current.hasMoved) {
      e.preventDefault();
      e.stopPropagation();
      dragInfo.current.hasMoved = false;
    }
  };

  // Render hidden until coordinates calculate to avoid flicker
  if (!position) return null;

  return (
    <div
      ref={buttonRef}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 90,
        touchAction: 'none'
      }}
      className="print:hidden select-none"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title="Chat with Habrenoir Concierge (Drag to move)"
        className={`group flex items-center bg-[#140002]/95 hover:bg-[#2A050D] active:bg-[#140002] backdrop-blur-md text-[#FFFFFF] border border-[#C5A880]/60 hover:border-[#C5A880] px-2.5 sm:px-3 py-1.5 sm:py-2 shadow-[0_8px_24px_rgba(20,0,2,0.35)] transition-all duration-200 ease-out ${
          isDragging ? 'cursor-grabbing scale-105 shadow-[0_12px_32px_rgba(20,0,2,0.5)] border-[#C5A880]' : 'cursor-grab hover:scale-[1.02]'
        }`}
        aria-label="Direct WhatsApp Concierge. Drag to move on screen."
      >
        {/* Pulsating Emerald Live Indicator */}
        <span className="relative flex h-2 w-2 mr-2 flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]"></span>
        </span>

        {/* WhatsApp Champagne Vector SVG */}
        <svg
          className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C5A880] group-hover:text-[#FFFFFF] transition-colors flex-shrink-0 mr-1.5"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12.031 2C6.5 2 2 6.5 2 12.031c0 1.969.563 3.813 1.563 5.375L2 22l4.75-1.531c1.5 1 3.281 1.563 5.281 1.563 5.531 0 10.031-4.5 10.031-10.031S17.563 2 12.031 2zm0 18.281c-1.781 0-3.375-.5-4.719-1.375l-.344-.219-2.813.906.938-2.75-.219-.344C3.875 15.063 3.375 13.594 3.375 12c0-4.75 3.875-8.625 8.656-8.625s8.656 3.875 8.656 8.625c0 4.781-3.875 8.656-8.656 8.656zm4.75-6.469c-.25-.125-1.5-.75-1.719-.844-.219-.094-.375-.125-.531.125s-.625.844-.781 1.031c-.156.156-.281.188-.531.063-.25-.125-1.063-.375-2.031-1.25-.75-.656-1.25-1.469-1.406-1.719-.156-.25 0-.406.125-.531.125-.125.25-.281.375-.438.125-.156.156-.25.25-.406.094-.156.031-.313-.031-.438s-.531-1.281-.719-1.75c-.188-.469-.375-.406-.531-.406h-.438c-.156 0-.406.063-.625.313-.219.219-.844.813-.844 2s.875 2.313 1 2.469c.125.188 1.719 2.656 4.156 3.719.594.25 1.063.406 1.438.531.594.188 1.156.156 1.594.094.469-.063 1.5-.625 1.719-1.219.219-.594.219-1.125.156-1.219-.063-.125-.219-.188-.469-.313z" />
        </svg>

        {/* Refined Luxury Label */}
        <span className="font-sans text-[9.5px] sm:text-[10px] font-semibold tracking-[0.16em] uppercase text-[#ECE7DF] group-hover:text-[#FFFFFF] whitespace-nowrap">
          Concierge
        </span>

        {/* Discrete Grip Dots Handle Indicator */}
        <span
          className="ml-2 pl-1.5 border-l border-[#C5A880]/30 flex flex-col justify-center space-y-0.5 opacity-60 group-hover:opacity-100 transition-opacity"
          aria-hidden="true"
        >
          <span className="w-0.5 h-0.5 rounded-full bg-[#C5A880]"></span>
          <span className="w-0.5 h-0.5 rounded-full bg-[#C5A880]"></span>
          <span className="w-0.5 h-0.5 rounded-full bg-[#C5A880]"></span>
        </span>
      </a>
    </div>
  );
};
