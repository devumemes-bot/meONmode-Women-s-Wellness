import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';
import { Product, CustomerReview } from '../types';
import { PRODUCTS, MENS_PRODUCTS, optimizeCloudinaryUrl } from '../data';

interface CustomerReviewsSectionProps {
  activeCategory: 'all' | 'women' | 'men';
  currentReviews: CustomerReview[];
  setLightboxImage: (img: string | null) => void;
  setLightboxZoom: (zoom: boolean) => void;
}

export const CustomerReviewsSection: React.FC<CustomerReviewsSectionProps> = ({
  activeCategory,
  currentReviews,
  setLightboxImage,
  setLightboxZoom
}) => {
  const getReviewImages = (img?: string | string[]): string[] => {
    if (!img) return [];
    if (Array.isArray(img)) return img.filter(Boolean);
    return img.split(/[\s\n,]+/).map(u => u.trim()).filter(u => u.startsWith('http'));
  };

  const homeReviews = currentReviews.filter(rev => {
    const isMen = rev.productId === 'wantmore-men' || rev.productId === 'alphamax-men' || rev.productId === 'mens-combo';
    const isWomen = rev.productId === 'combo-kit' || rev.productId === 'ovaira' || rev.productId === 'flowelle';
    if (activeCategory === 'men') {
      return isMen;
    } else if (activeCategory === 'women') {
      return isWomen;
    }
    return true;
  });

  return (
    <section id="review-gallery" className="lg:col-span-12 space-y-8 relative overflow-hidden bg-[#23120b]/30 border-2 border-[#FAF6F0]/20 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-md content-auto">
      {/* Soft glowing background element */}
      <div className="absolute top-12 left-1/3 w-80 h-80 bg-gradient-to-tr from-[#E5A93C]/5 via-[#C86428]/5 to-transparent rounded-full blur-[100px] pointer-events-none"></div>

      <div className="text-center space-y-2 relative z-10">
        <span className="text-[#E5A93C] uppercase text-xs tracking-widest font-black font-mono">
          ✨ Real Customer Reviews
        </span>
        <h2 className="font-serif text-3xl md:text-5xl font-extrabold text-[#FAF6F0]">
          {activeCategory === 'men' ? "Men's Vitality Testimonials" : "Genuine Wellness Transformations"}
        </h2>
        <p className="text-[#FAF6F0]/80 max-w-xl mx-auto text-xs sm:text-sm font-sans">
          {activeCategory === 'men' 
            ? "Read authentic, raw experiences shared by verified customers. Filtered for 100% relevance."
            : "Discover honest reviews and photo logs shared by verified meONmode® customers. Real people, real results."}
        </p>
      </div>

      {/* Dynamic Review Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
        {homeReviews.length === 0 ? (
          <div className="col-span-full py-12 text-center text-white/50 italic">
            No reviews found for this category yet. Be the first to write one!
          </div>
        ) : (
          homeReviews.map((rev, index) => {
            const prod = [...PRODUCTS, ...MENS_PRODUCTS].find(p => p.id === rev.productId);
            const revImages = getReviewImages(rev.image);
            return (
              <div 
                key={index}
                className="group flex flex-col justify-between bg-[#FAF6F0] text-neutral-900 rounded-[24px] border border-[#E5A93C]/10 shadow-md hover:shadow-2xl hover:border-[#E5A93C]/40 transition-all duration-300 ease-out text-left overflow-hidden h-full transform hover:-translate-y-1.5"
              >
                <div>
                  {/* Swipeable Image Gallery if available */}
                  {revImages.length > 0 && (
                    <div className="relative w-full overflow-hidden bg-neutral-100 flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-none border-b border-neutral-200/40 h-[220px]">
                      {revImages.map((imgUrl, imgIndex) => (
                        <div key={imgIndex} className="w-full h-full snap-center shrink-0 relative flex items-center justify-center p-2">
                          <img 
                            src={optimizeCloudinaryUrl(imgUrl, 480)} 
                            srcSet={`${optimizeCloudinaryUrl(imgUrl, 320)} 320w, ${optimizeCloudinaryUrl(imgUrl, 480)} 480w, ${optimizeCloudinaryUrl(imgUrl, 640)} 640w, ${optimizeCloudinaryUrl(imgUrl, 960)} 960w`}
                            sizes="(max-width: 640px) 280px, 320px"
                            alt={`${rev.name}'s Review Asset ${imgIndex + 1}`} 
                            loading="lazy"
                            decoding="async"
                            width="300"
                            height="220"
                            className="w-full h-full object-contain transition-transform duration-500 hover:scale-105 cursor-pointer rounded-xl"
                            onClick={() => {
                              setLightboxImage(imgUrl);
                              setLightboxZoom(false);
                            }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = optimizeCloudinaryUrl('https://res.cloudinary.com/ukqeabxy/image/upload/v1787512639/ChatGPT_Image_Jun_20_2026_10_28_24_PM.png', 480);
                            }}
                          />
                          {revImages.length > 1 && (
                            <div className="absolute bottom-2.5 right-2.5 bg-neutral-950/70 border border-white/10 text-white rounded-lg px-2.5 py-0.5 text-[9px] font-bold font-mono tracking-wider z-10">
                              {imgIndex + 1} / {revImages.length}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Card Content */}
                  <div className="p-5 space-y-3">
                    {/* Stars & Verified badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex text-[#E5A93C]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current text-[#E5A93C]' : 'text-neutral-300'}`} />
                        ))}
                      </div>
                      {rev.verified && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full font-bold">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Verified Buyer</span>
                        </span>
                      )}
                    </div>

                    {/* Review Title & Body */}
                    <div className="space-y-1">
                      <h3 className="font-serif text-sm font-extrabold text-[#4A1D05] leading-tight">
                        {rev.title || "Miraculous Healing Journey"}
                      </h3>
                      <p className="text-[11px] text-neutral-600 leading-relaxed font-sans line-clamp-4 group-hover:line-clamp-none transition-all duration-300">
                        {rev.review}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Product name, customer name, date */}
                <div className="p-5 pt-0 mt-auto border-t border-[#4A1D05]/10 space-y-1.5 bg-neutral-150/50">
                  <div className="flex items-center justify-between text-[10px] text-neutral-500 font-semibold font-mono uppercase tracking-wider">
                    <span>{rev.name} {rev.location ? `(${rev.location})` : ''}</span>
                    <span>{rev.date || "Verified"}</span>
                  </div>
                  <div className="text-[10px] text-[#C86428] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#C86428]/30 rounded-full"></span>
                    <span>Product: {rev.productId === 'mens-combo' ? "Men's Combo" : (prod?.name || "meONmode Remedy")}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
