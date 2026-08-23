import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Share2, Copy, MessageSquare, Facebook } from 'lucide-react';
import { Product } from '../types';

interface ProductGalleryProps {
  product: Product;
  activeImageIndex: number;
  setActiveImageIndex: (index: number | ((prev: number) => number)) => void;
  onImageClick?: () => void;
  showShareDropdown: boolean;
  setShowShareDropdown: (show: boolean | ((prev: boolean) => boolean)) => void;
  handleShareProduct: (product: Product, e: React.MouseEvent) => void;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  product,
  activeImageIndex,
  setActiveImageIndex,
  onImageClick,
  showShareDropdown,
  setShowShareDropdown,
  handleShareProduct
}) => {
  const images = product.images && product.images.length > 0 ? product.images : [];
  const totalImages = images.length;
  
  // Safe bounded index
  const currentIndex = totalImages > 0 
    ? Math.min(Math.max(0, activeImageIndex), totalImages - 1) 
    : 0;

  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const thumbnailsContainerRef = useRef<HTMLDivElement>(null);
  const activeThumbnailRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    if (activeThumbnailRef.current && thumbnailsContainerRef.current) {
      activeThumbnailRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }, [currentIndex]);

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (totalImages <= 1) return;
    setActiveImageIndex(prev => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (totalImages <= 1) return;
    setActiveImageIndex(prev => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  // Mobile touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (totalImages <= 1) return;
    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeThreshold = 40; // 40px swipe distance
    
    if (swipeDistance > minSwipeThreshold) {
      // Swiped Left -> Go Next
      handleNext();
    } else if (swipeDistance < -minSwipeThreshold) {
      // Swiped Right -> Go Previous
      handlePrev();
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-between space-y-4">
      {/* Product Tag / Badge */}
      {product.tag && (
        <span className="absolute top-4 left-4 z-10 text-[10px] font-extrabold px-3 py-1.5 rounded-full tracking-wider shadow-sm bg-[#5C1D13] text-[#E5A93C] border border-[#E5A93C]/10 uppercase">
          {product.tag}
        </span>
      )}

      {/* Floating Share Button & Dropdown */}
      <div className="absolute top-4 right-4 z-20 flex flex-col items-end">
        <button
          type="button"
          onClick={() => setShowShareDropdown(prev => !prev)}
          className="p-3 rounded-full shadow-md transition-all border border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50 cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95"
          title="Share Options"
          aria-label="Share Options"
        >
          <Share2 className="w-4.5 h-4.5" />
        </button>
        
        {showShareDropdown && (
          <div className="mt-2 bg-white text-neutral-900 border border-neutral-200 p-2.5 rounded-2xl shadow-2xl flex flex-col gap-2 z-30 min-w-[170px] animate-fade-in">
            <button
              type="button"
              onClick={(e) => {
                handleShareProduct(product, e);
                setShowShareDropdown(false);
              }}
              className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-bold hover:bg-neutral-50 rounded-xl transition-colors cursor-pointer text-[#5C1D13]"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Link</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const shareUrl = `${window.location.origin}${window.location.pathname}?product=${product.id}`;
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${product.name}: ${shareUrl}`)}`, '_blank');
                setShowShareDropdown(false);
              }}
              className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-bold hover:bg-[#E8F5E9] text-emerald-700 rounded-xl transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const shareUrl = `${window.location.origin}${window.location.pathname}?product=${product.id}`;
                window.open(`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
                setShowShareDropdown(false);
              }}
              className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-bold hover:bg-[#E3F2FD] text-blue-700 rounded-xl transition-colors cursor-pointer"
            >
              <Facebook className="w-3.5 h-3.5" />
              <span>Facebook</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Large Image Container with Swipe & Navigation */}
      <div 
        className="relative w-full overflow-hidden flex items-center justify-center min-h-[280px] sm:min-h-[350px] md:min-h-[380px] rounded-2xl bg-[#FAF8F6] select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Main Display Image */}
        {totalImages > 0 ? (
          <div className="w-full h-full flex items-center justify-center p-2 sm:p-4">
            <button
              type="button"
              onClick={onImageClick}
              className="w-full h-full flex items-center justify-center focus:outline-none group/mainimg cursor-pointer overflow-hidden relative"
              title="Click to view pricing & details"
            >
              <img 
                key={currentIndex}
                src={images[currentIndex]} 
                alt={`${product.name} - View ${currentIndex + 1} of ${totalImages}`}
                loading={currentIndex === 0 ? "eager" : "lazy"}
                decoding="async"
                width="380"
                height="380"
                className="w-auto h-auto max-h-[260px] sm:max-h-[330px] md:max-h-[360px] max-w-full object-contain block mx-auto transition-transform duration-500 ease-out group-hover/mainimg:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const existing = parent.querySelector('.slider-fallback');
                    if (!existing) {
                      const fallback = document.createElement('div');
                      fallback.className = "slider-fallback absolute inset-0 flex flex-col justify-center items-center p-6 text-center text-neutral-800";
                      fallback.innerHTML = `
                        <span class="p-3 bg-neutral-100 border border-neutral-200 text-[#5C1D13] rounded-full mb-2">
                          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                        </span>
                        <h4 class="font-serif font-extrabold text-lg text-[#5C1D13]">${product.name}</h4>
                        <p class="text-[10px] text-neutral-500 mt-0.5 uppercase tracking-widest font-bold">${product.volumeOrQty}</p>
                      `;
                      parent.appendChild(fallback);
                    }
                  }
                }}
              />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-neutral-400">
            <span className="text-sm font-medium">No image available</span>
          </div>
        )}

        {/* Left Navigation Arrow (Visible if more than 1 image) */}
        {totalImages > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-neutral-800 hover:text-[#5C1D13] shadow-md border border-neutral-200/80 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-xs focus:outline-none"
            aria-label="Previous image"
            title="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Right Navigation Arrow (Visible if more than 1 image) */}
        {totalImages > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-neutral-800 hover:text-[#5C1D13] shadow-md border border-neutral-200/80 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-xs focus:outline-none"
            aria-label="Next image"
            title="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Image Counter Badge (e.g., "1 / 3" or "2 / 11") */}
        {totalImages > 1 && (
          <div className="absolute bottom-3 right-3 z-10 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full tracking-wider border border-white/10 shadow-sm pointer-events-none">
            {currentIndex + 1} / {totalImages}
          </div>
        )}
      </div>

      {/* Thumbnails Row (Visible only if more than 1 image) */}
      {totalImages > 1 && (
        <div className="w-full relative mt-2 pt-1">
          {/* Scrollable Thumbnails Strip */}
          <div 
            ref={thumbnailsContainerRef}
            className="w-full flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-1.5 pt-1 px-1 scroll-smooth no-scrollbar justify-start sm:justify-center"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {images.map((imgSrc, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={idx}
                  ref={isActive ? activeThumbnailRef : null}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative flex-shrink-0 w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-xl p-1.5 flex items-center justify-center transition-all duration-200 cursor-pointer overflow-hidden bg-white ${
                    isActive
                      ? 'border-2 border-[#5C1D13] ring-2 ring-[#E5A93C]/50 shadow-md scale-105 z-10 bg-[#FFFDF9]'
                      : 'border border-neutral-200/80 hover:border-neutral-400 opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`Select product image ${idx + 1}`}
                  title={`View image ${idx + 1}`}
                >
                  <img
                    src={imgSrc}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    loading="lazy"
                    decoding="async"
                    width="64"
                    height="64"
                    className="w-full h-full object-contain block mx-auto transition-transform duration-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://i.postimg.cc/dtsJKSzc/IMG-2931.png';
                    }}
                  />
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-0 h-1 bg-[#5C1D13] rounded-b-lg" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
