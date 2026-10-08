import React, { useState } from 'react';
import { X, Star, Bell, Check } from 'lucide-react';
import { Product, CustomerReview } from '../types';
import { PRODUCTS, MENS_PRODUCTS } from '../data';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  onAddReview: (review: CustomerReview) => void;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  isOpen,
  onClose,
  productId,
  onAddReview
}) => {
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewImages, setNewReviewImages] = useState<string[]>([]);
  const [reviewFormError, setReviewFormError] = useState('');
  const [reviewSubmitSuccess, setReviewSubmitSuccess] = useState(false);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Read up to 4 images
    const fileList = Array.from(files).slice(0, 4) as File[];
    fileList.forEach(file => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setNewReviewImages(prev => {
            if (prev.length >= 4) return prev;
            return [...prev, uploadEvent.target!.result as string];
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const product = [...PRODUCTS, ...MENS_PRODUCTS].find(p => p.id === productId);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-neutral-900">
      <div className="bg-[#FAF6F0] rounded-3xl border border-[#E5A93C]/30 p-6 md:p-8 max-w-lg w-full shadow-2xl relative flex flex-col max-h-[90vh]">
        <button
          type="button"
          onClick={() => {
            onClose();
            setReviewSubmitSuccess(false);
            setReviewFormError('');
          }}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-200/50 transition-colors cursor-pointer text-[#4A1D05]/60"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4 overflow-y-auto pr-1 custom-scrollbar text-left flex-grow">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[#C86428]/10 text-[#C86428] rounded-2xl flex items-center justify-center mx-auto border border-[#C86428]/20">
              <Star className="w-6 h-6 fill-current" />
            </div>
            <h3 className="font-serif text-2xl font-black text-[#4A1D05]">Write a Review</h3>
            <p className="text-xs text-neutral-500 font-medium">
              Share your honest experience for{' '}
              <span className="font-bold text-[#4A1D05]">
                {product?.name || 'this remedy'}
              </span>
            </p>
          </div>

          {reviewSubmitSuccess ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4 animate-scaleUp">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-lg font-bold text-emerald-900">Review Submitted Successfully!</h4>
                <p className="text-xs text-emerald-700 font-medium">
                  Your review has been successfully submitted and is now live on the product page. Thank you for sharing your journey!
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setReviewSubmitSuccess(false);
                }}
                className="w-full bg-[#5C1D13] hover:bg-[#4A1D05] text-[#E5A93C] font-extrabold text-xs py-3 rounded-xl transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newReviewName.trim() || !newReviewComment.trim()) {
                  setReviewFormError('Please fill in your Name and Write Your Review.');
                  return;
                }
                
                const newRev: CustomerReview = {
                  productId: productId,
                  name: newReviewName,
                  rating: newReviewRating,
                  review: newReviewComment,
                  image: newReviewImages,
                  verified: true,
                  date: new Date().toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  }),
                  title: newReviewComment.substring(0, 35) + (newReviewComment.length > 35 ? '...' : ''),
                  approved: true
                };

                onAddReview(newRev);
                setReviewSubmitSuccess(true);
                
                // Reset fields
                setNewReviewName('');
                setNewReviewRating(5);
                setNewReviewComment('');
                setNewReviewImages([]);
                setReviewFormError('');
              }}
              className="space-y-4"
            >
              {reviewFormError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-bold">
                  ⚠️ {reviewFormError}
                </div>
              )}

              {/* Rating Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-700">Rating *</label>
                <div className="flex gap-1.5 text-amber-400">
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setNewReviewRating(stars)}
                      className="hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          stars <= newReviewRating ? 'fill-current text-[#E5A93C]' : 'text-neutral-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-700">Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={newReviewName}
                  onChange={(e) => setNewReviewName(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#C86428]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-700">Write Your Review *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write your detailed experience here..."
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-xl p-3 text-xs focus:outline-none focus:border-[#C86428]"
                />
              </div>

              {/* Photo Upload with Previews */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-700">
                  Upload up to 4 Product Photos (Optional)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageChange}
                  className="text-xs text-neutral-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#C86428]/10 file:text-[#C86428] hover:file:bg-[#C86428]/20 cursor-pointer w-full"
                />
                
                {newReviewImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newReviewImages.map((imgSrc, i) => (
                      <div key={i} className="relative w-16 h-16 rounded-xl border border-neutral-200 overflow-hidden group">
                        <img src={imgSrc} alt="Preview" width="64" height="64" decoding="async" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setNewReviewImages(prev => prev.filter((_, idx) => idx !== i))}
                          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#5C1D13] hover:bg-[#4A1D05] text-[#E5A93C] font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-md active:scale-95 text-center mt-2 cursor-pointer"
              >
                Submit Review
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

interface RestockModalProps {
  product: Product | null;
  onClose: () => void;
}

export const RestockModal: React.FC<RestockModalProps> = ({
  product,
  onClose
}) => {
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySuccess, setNotifySuccess] = useState(false);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF6F0] rounded-3xl border border-[#E5A93C]/30 p-6 md:p-8 max-w-md w-full shadow-2xl relative text-[#4A1D05]">
        <button
          type="button"
          onClick={() => {
            onClose();
            setNotifyEmail('');
            setNotifySuccess(false);
          }}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-200/50 transition-colors cursor-pointer text-[#4A1D05]/60"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4 text-center">
          <div className="w-12 h-12 bg-[#C86428]/10 text-[#C86428] rounded-2xl flex items-center justify-center mx-auto border border-[#C86428]/20 shadow-sm">
            <Bell className="w-6 h-6 animate-bounce" />
          </div>

          <div className="space-y-1.5">
            <h3 className="font-serif text-xl font-black">Restock Notification</h3>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
              Be the first to know when <strong className="text-[#4A1D05]">{product.name}</strong> is back in our temperature-controlled Ayurvedic warehouse.
            </p>
          </div>

          {notifySuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl space-y-2 text-left">
              <p className="text-xs font-bold flex items-center gap-1.5 justify-center">
                <span>🎉</span> Alert Activated Successfully!
              </p>
              <p className="text-[10px] text-emerald-700/90 leading-relaxed font-medium">
                We've registered <strong className="underline">{notifyEmail}</strong>. You'll receive an instant alert the second our herbal extraction process is complete.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setNotifyEmail('');
                  setNotifySuccess(false);
                }}
                className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Awesome, Thanks!
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (notifyEmail.trim()) {
                  setNotifySuccess(true);
                }
              }}
              className="space-y-3"
            >
              <div className="text-left">
                <label htmlFor="notify-email" className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Your Best Email Address
                </label>
                <input
                  id="notify-email"
                  type="email"
                  required
                  placeholder="e.g. customer@meonmode.com"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  className="w-full bg-white border border-[#E5A93C]/30 focus:border-[#C86428] focus:ring-1 focus:ring-[#C86428] rounded-xl px-4 py-3 text-xs text-[#4A1D05] placeholder-neutral-400 focus:outline-none transition-all shadow-inner"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#C86428] to-[#E5A93C] hover:from-[#8B3B15] hover:to-[#C86428] text-white font-extrabold text-xs py-3.5 rounded-xl transition-all hover:shadow-[0_0_15px_rgba(200,100,40,0.4)] shadow-lg active:scale-95 duration-200 cursor-pointer"
              >
                Set Restock Alert
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
