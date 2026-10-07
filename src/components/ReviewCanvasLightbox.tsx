import React from 'react';
import { X } from 'lucide-react';
import { optimizeCloudinaryUrl } from '../data';

interface ReviewCanvasLightboxProps {
  image: string | null;
  zoom: boolean;
  onToggleZoom: () => void;
  onClose: () => void;
}

export const ReviewCanvasLightbox: React.FC<ReviewCanvasLightboxProps> = ({
  image,
  zoom,
  onToggleZoom,
  onClose
}) => {
  if (!image) return null;

  return (
    <div className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in p-4">
      {/* Top bar controls */}
      <div className="absolute top-4 left-0 right-0 px-6 flex items-center justify-between z-20">
        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-neutral-400 font-mono">
          meONmode® Verified Review Canvas
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleZoom}
            className="bg-white/10 hover:bg-white/20 text-[#FAF6F0] px-4 py-2 rounded-full border border-white/20 text-xs font-bold transition-all active:scale-95 cursor-pointer select-none"
          >
            {zoom ? "🔍 Zoom Out" : "🔍 Zoom In"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-[#C86428] hover:bg-[#8B3B15] text-[#FAF6F0] p-2.5 rounded-full border border-[#E5A93C]/30 shadow-md transition-all active:scale-95 cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Fullscreen image container */}
      <div 
        onClick={onToggleZoom}
        className="w-full h-full max-h-[80vh] flex items-center justify-center relative cursor-zoom-in overflow-auto p-4 md:p-8"
      >
        <img
          src={optimizeCloudinaryUrl(image, 1200)}
          srcSet={`${optimizeCloudinaryUrl(image, 640)} 640w, ${optimizeCloudinaryUrl(image, 1080)} 1080w, ${optimizeCloudinaryUrl(image, 1600)} 1600w`}
          sizes="90vw"
          alt="Customer Review Expanded"
          referrerPolicy="no-referrer"
          decoding="async"
          className={`max-w-full max-h-full object-contain rounded-2xl transition-all duration-300 ease-out select-none shadow-2xl border border-white/10 ${
            zoom ? "scale-150 cursor-zoom-out" : "scale-100"
          }`}
        />
      </div>

      <p className="absolute bottom-6 text-[10px] text-neutral-500 font-medium tracking-wide text-center max-w-md px-4 leading-relaxed font-sans">
        This customer testimonial is a verified botanical wellness journey document. Individual results may vary.
      </p>
    </div>
  );
};
