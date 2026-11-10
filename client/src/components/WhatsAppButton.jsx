import React, { useState, useEffect, useRef } from 'react';

/**
 * WhatsApp Floating Concierge Medallion
 * Circular, side-docking draggable button that magnetically snaps along the left or right
 * edge of the screen, and gracefully dims to a translucent state when undisturbed.
 */
export const WhatsAppButton = () => {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [dockedSide, setDockedSide] = useState('right'); // 'left' | 'right'

  // Ghanaian customer care concierge line
  const whatsappNumber = '233244198820'; // Local Ghana representative (+233)
  const defaultMessage = encodeURIComponent(
    "Hello Habrenoir Concierge, I'm browsing your online collection and would like to inquire about an item."
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  const BTN_SIZE = 48; // 48px circular button
  const idleTimerRef = useRef(null);

  // Internal mutable drag tracking
  const dragInfo = useRef({
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
    hasMoved: false
  });

  // Reset idle fade timer (becomes translucent after 3 seconds undisturbed)
  const resetIdleTimer = () => {
    setIsIdle(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      setIsIdle(true);
    }, 3000);
  };

  // Magnetic edge-docking helper
  const snapToNearestEdge = (currX, currY) => {
    const midX = window.innerWidth / 2;
    const isLeft = currX < midX;
    const snappedX = isLeft ? 12 : window.innerWidth - BTN_SIZE - 12;
    // Constrain Y between header (75px) and bottom boundary (20px from bottom)
    const clampedY = Math.min(Math.max(75, currY), window.innerHeight - BTN_SIZE - 20);

    const side = isLeft ? 'left' : 'right';
    setDockedSide(side);
    setIsSnapping(true);
    setPosition({ x: snappedX, y: clampedY });

    try {
      sessionStorage.setItem('hbn_wa_position', JSON.stringify({ x: snappedX, y: clampedY, side }));
    } catch (e) { }

    setTimeout(() => {
      setIsSnapping(false);
    }, 300);
  };

  // Initialize position and resize handler
  useEffect(() => {
    const saved = sessionStorage.getItem('hbn_wa_position');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        snapToNearestEdge(parsed.x, parsed.y);
      } catch (e) {
        snapToNearestEdge(window.innerWidth - BTN_SIZE - 16, window.innerHeight - BTN_SIZE - 32);
      }
    } else {
      snapToNearestEdge(window.innerWidth - BTN_SIZE - 16, window.innerHeight - BTN_SIZE - 32);
    }

    resetIdleTimer();

    const handleResize = () => {
      setPosition(prev => {
        if (!prev) return prev;
        const isLeft = prev.x < window.innerWidth / 2;
        const newX = isLeft ? 12 : window.innerWidth - BTN_SIZE - 12;
        const newY = Math.min(Math.max(75, prev.y), window.innerHeight - BTN_SIZE - 20);
        setDockedSide(isLeft ? 'left' : 'right');
        return { x: newX, y: newY };
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  // Mouse Drag Handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0 || !position) return;
    resetIdleTimer();

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

      const nextX = Math.min(
        Math.max(6, dragInfo.current.origX + dx),
        window.innerWidth - BTN_SIZE - 6
      );
      const nextY = Math.min(
        Math.max(70, dragInfo.current.origY + dy),
        window.innerHeight - BTN_SIZE - 16
      );

      setPosition({ x: nextX, y: nextY });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      setIsDragging(false);

      if (dragInfo.current.hasMoved) {
        setPosition(latest => {
          if (latest) snapToNearestEdge(latest.x, latest.y);
          return latest;
        });
      }
      resetIdleTimer();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Touch Drag Handlers (Mobile & Tablets)
  const handleTouchStart = (e) => {
    if (e.touches.length !== 1 || !position) return;
    resetIdleTimer();
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

      if (Math.hypot(dx, dy) > 5) {
        dragInfo.current.hasMoved = true;
        setIsDragging(true);
        if (moveEvent.cancelable) moveEvent.preventDefault();
      }

      const nextX = Math.min(
        Math.max(6, dragInfo.current.origX + dx),
        window.innerWidth - BTN_SIZE - 6
      );
      const nextY = Math.min(
        Math.max(70, dragInfo.current.origY + dy),
        window.innerHeight - BTN_SIZE - 16
      );

      setPosition({ x: nextX, y: nextY });
    };

    const handleTouchEnd = () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      setIsDragging(false);

      if (dragInfo.current.hasMoved) {
        setPosition(latest => {
          if (latest) snapToNearestEdge(latest.x, latest.y);
          return latest;
        });
      }
      resetIdleTimer();
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
  };

  // Click handler (only trigger link if user did NOT drag)
  const handleClick = (e) => {
    if (dragInfo.current.hasMoved) {
      e.preventDefault();
      e.stopPropagation();
      dragInfo.current.hasMoved = false;
      return;
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsIdle(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    resetIdleTimer();
  };

  if (!position) return null;

  // Determine dynamic opacity & styling
  // Translucent (opacity-35 to 40) when undisturbed, fully opaque when hovered, touched, or dragging
  const isQuiet = isIdle && !isHovered && !isDragging;

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
      className={`print:hidden select-none ${isSnapping ? 'transition-all duration-300 ease-out' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative group">
        {/* Floating Tooltip Label (Snaps to opposite side of screen edge) */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200 hidden sm:flex items-center ${dockedSide === 'left' ? 'left-full ml-3' : 'right-full mr-3'
            } ${isHovered && !isDragging ? 'opacity-100 translate-x-0' : 'opacity-0 scale-95'}`}
        >
          <div className="bg-[#140002]/95 backdrop-blur-md text-[#ECE7DF] border border-[#C5A880]/60 px-3 py-1.5 shadow-[0_4px_16px_rgba(20,0,2,0.4)] whitespace-nowrap">
            <span className="font-sans text-[10px] tracking-[0.16em] uppercase font-semibold text-[#FFFFFF]">
              WhatsApp Concierge
            </span>
          </div>
        </div>

        {/* Circular Luxury Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          aria-label="Direct WhatsApp Concierge. Drag to move along screen sides."
          className={`relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full border bg-[#140002]/90 backdrop-blur-md text-[#FFFFFF] shadow-[0_6px_20px_rgba(20,0,2,0.35)] transition-all duration-500 ease-out ${isQuiet
              ? 'opacity-35 hover:opacity-100 border-[#C5A880]/40 scale-90'
              : 'opacity-100 border-[#C5A880] scale-100'
            } ${isDragging
              ? 'cursor-grabbing scale-110 shadow-[0_12px_30px_rgba(20,0,2,0.6)] ring-2 ring-[#C5A880]/50 border-[#C5A880]'
              : 'cursor-grab hover:scale-105 hover:border-[#C5A880]'
            }`}
        >
          {/* Champagne Gold WhatsApp Vector Icon */}
          <svg
            className={`w-5 h-5 text-[#C5A880] group-hover:text-[#FFFFFF] transition-colors ${isQuiet ? 'opacity-80' : 'opacity-100'
              }`}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12.031 2C6.5 2 2 6.5 2 12.031c0 1.969.563 3.813 1.563 5.375L2 22l4.75-1.531c1.5 1 3.281 1.563 5.281 1.563 5.531 0 10.031-4.5 10.031-10.031S17.563 2 12.031 2zm0 18.281c-1.781 0-3.375-.5-4.719-1.375l-.344-.219-2.813.906.938-2.75-.219-.344C3.875 15.063 3.375 13.594 3.375 12c0-4.75 3.875-8.625 8.656-8.625s8.656 3.875 8.656 8.625c0 4.781-3.875 8.656-8.656 8.656zm4.75-6.469c-.25-.125-1.5-.75-1.719-.844-.219-.094-.375-.125-.531.125s-.625.844-.781 1.031c-.156.156-.281.188-.531.063-.25-.125-1.063-.375-2.031-1.25-.75-.656-1.25-1.469-1.406-1.719-.156-.25 0-.406.125-.531.125-.125.25-.281.375-.438.125-.156.156-.25.25-.406.094-.156.031-.313-.031-.438s-.531-1.281-.719-1.75c-.188-.469-.375-.406-.531-.406h-.438c-.156 0-.406.063-.625.313-.219.219-.844.813-.844 2s.875 2.313 1 2.469c.125.188 1.719 2.656 4.156 3.719.594.25 1.063.406 1.438.531.594.188 1.156.156 1.594.094.469-.063 1.5-.625 1.719-1.219.219-.594.219-1.125.156-1.219-.063-.125-.219-.188-.469-.313z" />
          </svg>
        </a>
      </div>
    </div>
  );
};
