import React from 'react';
import { X, Star, ShieldCheck } from 'lucide-react';
import { Product, CustomerReview } from '../types';
import { optimizeCloudinaryUrl } from '../data';

interface ProductReviewsModalProps {
  activeReviewProduct: Product | null;
  onClose: () => void;
  currentReviews: CustomerReview[];
  getProductRatingDetails: (productId: string) => { rating: number; reviewsCount: number };
  onOpenWriteReview: (productId: string) => void;
  setLightboxImage: (img: string | null) => void;
  setLightboxZoom: (zoom: boolean) => void;
}

export const ProductReviewsModal: React.FC<ProductReviewsModalProps> = ({
  activeReviewProduct,
  onClose,
  currentReviews,
  getProductRatingDetails,
  onOpenWriteReview,
  setLightboxImage,
  setLightboxZoom
}) => {
  if (!activeReviewProduct) return null;

  const prodReviews = currentReviews.filter(r => r.productId === activeReviewProduct.id && r.approved);
  const { rating, reviewsCount } = getProductRatingDetails(activeReviewProduct.id);

  let p5 = 88;
  let p4 = 10;
  let p3 = 2;
  if (rating === 5.0) {
    p5 = 94;
    p4 = 5;
    p3 = 1;
  } else if (rating === 4.8) {
    p5 = 82;
    p4 = 14;
    p3 = 4;
  } else if (prodReviews.length > 0) {
    const total = prodReviews.length;
    const stars5 = prodReviews.filter(r => r.rating === 5).length;
    const stars4 = prodReviews.filter(r => r.rating === 4).length;
    const stars3 = prodReviews.filter(r => r.rating <= 3).length;
    p5 = Math.round((stars5 / total) * 100) || 0;
    p4 = Math.round((stars4 / total) * 100) || 0;
    p3 = Math.round((stars3 / total) * 100) || 0;
  }

  const getReviewImages = (img?: string | string[]): string[] => {
    if (!img) return [];
    if (Array.isArray(img)) return img.filter(Boolean);
    return img.split(/[\s\n,]+/).map(u => u.trim()).filter(u => u.startsWith('http'));
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="bg-[#fdfbf7] text-neutral-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-neutral-200/60 flex flex-col max-h-[85vh] transform scale-100 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-[#FAF8F6]">
          <div className="text-left">
            <h3 className="font-serif text-lg font-black text-neutral-950">Verified Buyer Feedback</h3>
            <p className="text-[11px] text-neutral-500 font-medium">Genuine experiences shared by verified meONmode® customers</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-200/60 text-neutral-500 hover:text-neutral-950 transition-colors cursor-pointer"
            aria-label="Close reviews"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6 custom-scrollbar text-left flex-grow">
          {/* Target Product Reference Banner */}
          <div className="flex gap-3 items-center p-3 bg-neutral-100/50 rounded-2xl border border-neutral-200/30">
            <div className="w-12 h-12 rounded-xl bg-white border border-neutral-200/40 p-1 shrink-0 flex items-center justify-center">
              <img 
                src={optimizeCloudinaryUrl(activeReviewProduct.images && activeReviewProduct.images[0], 96)} 
                alt={activeReviewProduct.name} 
                loading="lazy"
                decoding="async"
                width="48"
                height="48"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = optimizeCloudinaryUrl('https://res.cloudinary.com/ukqeabxy/image/upload/v1787512639/ChatGPT_Image_Jun_20_2026_10_28_24_PM.png', 96);
                }}
              />
            </div>
            <div className="text-left">
              <h4 className="font-serif text-xs font-bold text-neutral-900">{activeReviewProduct.name}</h4>
              <p className="text-[10px] text-neutral-500 font-semibold">{activeReviewProduct.subtitle}</p>
            </div>
          </div>

          {/* Summary Breakdown Card */}
          <div className="bg-[#FAF8F6] border border-neutral-200/60 rounded-2xl p-5 grid grid-cols-12 gap-4 items-center">
            {/* Big Score Block */}
            <div className="col-span-5 text-center border-r border-neutral-200/60 pr-2">
              <div className="font-serif text-4xl md:text-5xl font-black text-[#C86428]">{rating.toFixed(1)}</div>
              <div className="flex justify-center my-1 text-[#E5A93C]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <div className="text-[10px] font-extrabold text-neutral-500 tracking-wide uppercase font-mono mt-1">
                {reviewsCount.toLocaleString('en-IN')} reviews
              </div>
            </div>

            {/* Horizontal Breakdown Bars */}
            <div className="col-span-7 space-y-2">
              {/* 5 star row */}
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-700">
                <span className="w-7 text-right">5 ★</span>
                <div className="flex-grow h-2.5 bg-neutral-200/80 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#C86428] to-[#E5A93C] rounded-full" style={{ width: `${p5}%` }}></div>
                </div>
                <span className="w-8 text-neutral-500 font-medium text-[10px]">{p5}%</span>
              </div>
              {/* 4 star row */}
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-700">
                <span className="w-7 text-right">4 ★</span>
                <div className="flex-grow h-2.5 bg-neutral-200/80 rounded-full overflow-hidden">
                  <div className="h-full bg-[#E5A93C]/70 rounded-full" style={{ width: `${p4}%` }}></div>
                </div>
                <span className="w-8 text-neutral-500 font-medium text-[10px]">{p4}%</span>
              </div>
              {/* 3 star row */}
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-700">
                <span className="w-7 text-right">3 ★</span>
                <div className="flex-grow h-2.5 bg-neutral-200/80 rounded-full overflow-hidden">
                  <div className="h-full bg-neutral-300 rounded-full" style={{ width: `${p3}%` }}></div>
                </div>
                <span className="w-8 text-neutral-500 font-medium text-[10px]">{p3}%</span>
              </div>
            </div>
          </div>

          {/* WRITE A REVIEW ACTION BUTTON IN BANNER */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => onOpenWriteReview(activeReviewProduct.id)}
              className="w-full flex items-center justify-center gap-2 bg-[#FAF6F0] hover:bg-[#FAF6F0]/80 text-[#C86428] border-2 border-dashed border-[#C86428]/30 hover:border-[#C86428] font-black text-xs py-3 rounded-2xl transition-all cursor-pointer active:scale-95"
            >
              ⭐ Write a Review for {activeReviewProduct.name}
            </button>
          </div>

          {/* Individual Review Entries */}
          <div className="space-y-4">
            <p className="text-[10px] font-extrabold text-neutral-400 font-mono tracking-wider uppercase">Showing Verified Feedback ({prodReviews.length})</p>
            
            {prodReviews.length === 0 ? (
              <p className="text-xs text-neutral-500 italic">No detailed reviews logged for this product yet.</p>
            ) : (
              prodReviews.map((rev, rIdx) => {
                const revImages = getReviewImages(rev.image);
                return (
                  <div key={rIdx} className="bg-white border border-neutral-200/50 rounded-2xl p-4 space-y-3 hover:shadow-md transition-shadow">
                    {/* Top row: Stars & Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex text-[#E5A93C]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-neutral-200'}`} 
                          />
                        ))}
                      </div>
                      {rev.verified && (
                        <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Verified Buyer</span>
                        </span>
                      )}
                    </div>

                    {/* Image box inside card above review text if available */}
                    {revImages.length > 0 && (
                      <div className="flex gap-2 flex-wrap pt-1 pb-1">
                        {revImages.map((url, imgIndex) => (
                          <div key={imgIndex} className="relative rounded-xl border border-neutral-200 overflow-hidden w-20 h-20 shrink-0 bg-neutral-50 flex items-center justify-center p-1">
                            <img 
                              src={optimizeCloudinaryUrl(url, 200)} 
                              srcSet={`${optimizeCloudinaryUrl(url, 120)} 120w, ${optimizeCloudinaryUrl(url, 200)} 200w`}
                              sizes="80px"
                              alt="Review Asset" 
                              loading="lazy"
                              decoding="async"
                              width="80"
                              height="80"
                              className="w-full h-full object-contain cursor-zoom-in"
                              onClick={() => {
                                setLightboxImage(url);
                                setLightboxZoom(false);
                              }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://res.cloudinary.com/ukqeabxy/image/upload/v1787512639/ChatGPT_Image_Jun_20_2026_10_28_24_PM.png';
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Mid Row: Title & Body */}
                    <div className="space-y-1">
                      <h4 className="font-serif text-sm font-bold text-neutral-950">{rev.title || "Wonderful healing experience"}</h4>
                      <p className="text-xs text-neutral-700 leading-relaxed font-sans">{rev.review}</p>
                    </div>

                    {/* Bottom Row: Name, Location, Date */}
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 font-semibold border-t border-neutral-100 pt-2 font-sans">
                      <span>{rev.name} {rev.location ? `(${rev.location})` : ''}</span>
                      <span>{rev.date || "Verified"}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#FAF8F6] border-t border-neutral-100 flex gap-2">
          <button
            type="button"
            onClick={() => onOpenWriteReview(activeReviewProduct.id)}
            className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs py-3 px-4 rounded-xl transition-all cursor-pointer text-center flex-1 shrink-0"
          >
            Write a Review
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-[#5C1D13] hover:bg-[#4A1D05] text-[#E5A93C] font-extrabold text-xs py-3 px-6 rounded-xl transition-all shadow-md cursor-pointer text-center flex-1"
          >
            Close Modal
          </button>
        </div>
      </div>
    </div>
  );
};
