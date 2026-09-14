import React, { useState } from 'react';
import { 
  ArrowLeft, Star, Heart, Check, Clock, Lock, ShoppingBag, 
  Truck, Bell, ShieldCheck, ChevronRight 
} from 'lucide-react';
import { Product } from '../types';
import { CustomerReview, PRODUCTS, MENS_PRODUCTS } from '../data';
import { ProductGallery } from './ProductGallery';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onQuickBuy: (product: Product) => void;
  onProductClick: (product: Product) => void;
  onWriteReview: (productId: string) => void;
  onNotifyMe: (product: Product) => void;
  wishlist: string[];
  onToggleWishlist: (product: Product, e?: React.MouseEvent) => void;
  onShare: (product: Product, platform: string) => void;
  onOpenLightbox: (imgUrl: string) => void;
  currentReviews: CustomerReview[];
  womenProducts: Product[];
  menProducts: Product[];
  getProductRatingDetails: (productId: string) => { rating: number; reviewsCount: number };
  getProductStockStatus: (productId: string) => { status: string; text: string; count: number };
  t: (key: string) => string;
  optimizeCloudinaryUrl: (url: string, width?: number) => string;
  getProductCleanSlug: (id: string) => string;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  onBack,
  onAddToCart,
  onQuickBuy,
  onProductClick,
  onWriteReview,
  onNotifyMe,
  wishlist,
  onToggleWishlist,
  onShare,
  onOpenLightbox,
  currentReviews,
  womenProducts,
  menProducts,
  getProductRatingDetails,
  getProductStockStatus,
  t,
  optimizeCloudinaryUrl,
  getProductCleanSlug
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [detailQuantity, setDetailQuantity] = useState<number>(1);
  const [showShareDropdown, setShowShareDropdown] = useState<boolean>(false);

  const { rating, reviewsCount } = getProductRatingDetails(product.id);
  const prodReviews = currentReviews.filter(r => r.productId === product.id);
  const isWishlisted = wishlist.includes(product.id);
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const stockInfo = getProductStockStatus(product.id);

  const isMenProduct = MENS_PRODUCTS.some(m => m.id === product.id);

  // Related products strictly segregated by gender relevance
  const relatedProducts = (isMenProduct ? menProducts : womenProducts)
    .filter(p => p.id !== product.id);

  // Helper for parsing review images safely
  const getReviewImages = (img?: string | string[]): string[] => {
    if (!img) return [];
    if (Array.isArray(img)) return img.filter(Boolean);
    return img.split(/[\s\n,]+/).map(u => u.trim()).filter(u => u.startsWith('http'));
  };

  return (
    <div className="space-y-12 animate-fade-in">
      {/* JSON-LD Structured Data for Google Search Stars & Breadcrumbs */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Product",
                "@id": `https://meonmode.com/products/${getProductCleanSlug(product.id)}#product`,
                "name": product.name,
                "image": product.images && product.images.length > 0 ? product.images : [],
                "description": product.shortDescription || product.longDescription,
                "sku": product.id,
                "mpn": product.id,
                "brand": {
                  "@type": "Brand",
                  "name": "meONmode"
                },
                "review": prodReviews.map(rev => ({
                  "@type": "Review",
                  "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": rev.rating || 5,
                    "bestRating": 5,
                    "worstRating": 1
                  },
                  "author": {
                    "@type": "Person",
                    "name": rev.name
                  },
                  "reviewBody": rev.review
                })),
                ...(prodReviews.length > 0 ? {
                  "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": Number((prodReviews.reduce((sum, r) => sum + (r.rating || 5), 0) / prodReviews.length).toFixed(1)),
                    "reviewCount": prodReviews.length,
                    "bestRating": 5,
                    "worstRating": 1
                  }
                } : {}),
                "offers": {
                  "@type": "Offer",
                  "url": `https://meonmode.com/products/${getProductCleanSlug(product.id)}`,
                  "priceCurrency": "INR",
                  "price": product.price,
                  "priceValidUntil": "2027-12-31",
                  "itemCondition": "https://schema.org/NewCondition",
                  "availability": stockInfo.status === 'out_of_stock' 
                    ? "https://schema.org/OutOfStock" 
                    : "https://schema.org/InStock",
                  "seller": {
                    "@type": "Organization",
                    "name": "meONmode",
                    "url": "https://meonmode.com/"
                  },
                  "shippingDetails": {
                    "@type": "OfferShippingDetails",
                    "shippingRate": {
                      "@type": "MonetaryAmount",
                      "value": "0",
                      "currency": "INR"
                    },
                    "shippingDestination": {
                      "@type": "DefinedRegion",
                      "addressCountry": "IN"
                    },
                    "deliveryTime": {
                      "@type": "ShippingDeliveryTime",
                      "handlingTime": {
                        "@type": "QuantitativeValue",
                        "minValue": 1,
                        "maxValue": 2,
                        "unitCode": "DAY"
                      },
                      "transitTime": {
                        "@type": "QuantitativeValue",
                        "minValue": 2,
                        "maxValue": 5,
                        "unitCode": "DAY"
                      }
                    }
                  },
                  "hasMerchantReturnPolicy": {
                    "@type": "MerchantReturnPolicy",
                    "applicableCountry": "IN",
                    "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
                    "merchantReturnDays": 2,
                    "returnMethod": "https://schema.org/ReturnByMail",
                    "returnFees": "https://schema.org/FreeReturn",
                    "refundType": "https://schema.org/FullRefund"
                  }
                }
              },
              {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://meonmode.com/"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": isMenProduct ? "Men's Wellness" : "Women's Wellness",
                    "item": isMenProduct ? "https://meonmode.com/men" : "https://meonmode.com/women"
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": product.name,
                    "item": `https://meonmode.com/products/${getProductCleanSlug(product.id)}`
                  }
                ]
              }
            ]
          })
        }}
      />

      {/* Breadcrumb back navigation link */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <nav className="flex items-center gap-2 text-xs text-white/70 font-medium">
          <button 
            type="button"
            onClick={onBack}
            className="hover:text-[#E5A93C] transition-colors cursor-pointer"
          >
            Home
          </button>
          <span className="text-white/40">/</span>
          <button 
            type="button"
            onClick={onBack}
            className="hover:text-[#E5A93C] transition-colors cursor-pointer"
          >
            {isMenProduct ? "Men's Wellness" : "Women's Wellness"}
          </button>
          <span className="text-white/40">/</span>
          <span className="text-[#E5A93C] font-bold truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        <button 
          type="button"
          onClick={onBack}
          className="text-xs text-white/90 hover:text-[#E5A93C] flex items-center gap-1.5 transition-all font-semibold bg-white/10 hover:bg-white/20 py-1.5 px-4 rounded-full border border-white/15 cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Products</span>
        </button>
      </div>

      {/* Main Product Spotlight Card */}
      <div className="bg-[#fdfbf7] text-neutral-900 border border-neutral-200/60 rounded-3xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-12">
          
          {/* Image Column */}
          <div className="md:col-span-5 relative flex flex-col items-center justify-start overflow-hidden bg-[#FAF8F6] p-4 sm:p-6 border-b md:border-b-0 md:border-r border-neutral-100 min-h-[350px] md:min-h-[450px]">
            <ProductGallery
              product={product}
              activeImageIndex={activeImageIndex}
              setActiveImageIndex={setActiveImageIndex}
              onImageClick={() => {
                const imgs = product.images || [];
                if (imgs[activeImageIndex]) {
                  onOpenLightbox(imgs[activeImageIndex]);
                }
              }}
              showShareDropdown={showShareDropdown}
              setShowShareDropdown={setShowShareDropdown}
              handleShareProduct={onShare}
            />
            <p className="text-[11px] text-neutral-400 font-medium text-center mt-2 flex items-center gap-1">
              <span>🔍</span> Click image for high-resolution zoom view
            </p>
          </div>

          {/* Info and Purchase Column */}
          <div id="product-purchase-section" className="md:col-span-7 p-6 md:p-10 flex flex-col justify-between space-y-6">
            
            {/* Title & Metadata */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                {/* Gold Star Rating Block */}
                <div className="flex items-center gap-1 text-neutral-800 text-xs font-bold">
                  <div className="flex items-center text-[#E5A93C]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="ml-1 font-sans">
                    {rating.toFixed(1)} ({reviewsCount.toLocaleString('en-IN')} verified reviews)
                  </span>
                </div>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={(e) => onToggleWishlist(product, e)}
                  className={`p-2 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                    isWishlisted
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'bg-white border-neutral-200 text-neutral-600 hover:text-rose-600 hover:border-rose-200'
                  }`}
                  title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
                  <span className="hidden sm:inline">{isWishlisted ? 'Wishlisted' : 'Save'}</span>
                </button>
              </div>

              {/* Main Title */}
              <h1 className="font-serif text-3xl md:text-4xl font-black text-neutral-950 tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Subtitle */}
              <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#5C1D13] mt-1 flex items-center gap-2 flex-wrap">
                <span>{product.subtitle}</span>
                <span className="text-neutral-300">•</span>
                <span className="bg-neutral-100 text-neutral-800 px-2.5 py-0.5 rounded-md font-mono font-bold">
                  {product.volumeOrQty}
                </span>
              </p>
            </div>

            {/* Pricing & Scarcity Layout */}
            <div className="space-y-2">
              <div className="flex flex-col">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-3xl sm:text-4xl font-black text-neutral-950">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-base sm:text-lg font-bold line-through text-neutral-400">
                    ₹{product.mrp.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-black px-3 py-1 rounded-full border border-red-200 bg-red-50 text-red-600">
                    {discount}% Off (Save ₹{(product.mrp - product.price).toLocaleString('en-IN')})
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 mt-1">
                  <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> {t('inclusiveGst')}
                  </p>
                  <p className="text-[10px] text-neutral-700 font-medium">
                    ({t('priceInclusiveOfGst')}) • Free Express Shipping Pan-India
                  </p>
                </div>
              </div>
              
              {/* Stock Alert */}
              <div className="flex items-center justify-between gap-1.5 mt-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    {stockInfo.status === 'low_stock' && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    )}
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${stockInfo.status === 'low_stock' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                  </span>
                  <span className={`text-[10px] font-black uppercase tracking-wider ${stockInfo.status === 'low_stock' ? 'text-red-600' : 'text-emerald-700'}`}>
                    {stockInfo.text}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onNotifyMe(product)}
                  className="text-[10px] font-extrabold text-[#C86428] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Bell className="w-3 h-3" /> Get Alert
                </button>
              </div>
            </div>

            {/* Long Description */}
            <div className="space-y-2">
              <h2 className="font-serif text-sm font-bold uppercase tracking-wider text-[#5C1D13]">
                Product Therapy Summary
              </h2>
              <p className="text-xs leading-relaxed md:text-sm text-neutral-700 font-sans">
                {product.longDescription}
              </p>
            </div>

            {/* Key Bio-Active Ingredients preview chips */}
            {product.keyIngredients && product.keyIngredients.length > 0 && (
              <div className="space-y-1.5">
                <h2 className="font-serif text-xs font-bold uppercase tracking-wider text-[#5C1D13]">
                  Key Bio-Active Ingredients
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {product.keyIngredients.map((ing: any, idx: number) => {
                    const ingName = typeof ing === 'string' ? ing : ing.name;
                    return (
                      <span key={idx} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-800 border border-neutral-200">
                        🌿 {ingName}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Dosage Guidelines */}
            <div className="p-4 rounded-2xl space-y-2 border border-neutral-100 bg-[#FAF8F6]">
              <h2 className="font-serif text-sm font-bold flex items-center gap-1.5 text-[#5C1D13]">
                <Clock className="w-4 h-4 text-[#C86428]" />
                <span>Compliant Dosage Guidelines</span>
              </h2>
              <div className="text-xs leading-relaxed font-medium whitespace-pre-line pl-1.5 text-neutral-700 font-sans">
                {product.dosage}
              </div>
            </div>

            {/* Quantity Selector Bar */}
            <div className="flex items-center gap-4 py-2 border-y border-neutral-100 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider text-[#5C1D13]">Quantity:</span>
              <div className="flex items-center border border-neutral-300 rounded-xl bg-white overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => setDetailQuantity(prev => Math.max(1, prev - 1))}
                  className="px-3.5 py-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors font-bold text-sm cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-4 py-2 font-black text-sm text-neutral-900 min-w-[2.5rem] text-center select-none">
                  {detailQuantity}
                </span>
                <button
                  type="button"
                  onClick={() => setDetailQuantity(prev => Math.min(10, prev + 1))}
                  className="px-3.5 py-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors font-bold text-sm cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-neutral-700 font-medium ml-auto font-sans">
                Item Total: <strong className="text-neutral-950 font-black text-sm">₹{(product.price * detailQuantity).toLocaleString('en-IN')}</strong>
              </span>
            </div>

            {/* Action Buttons */}
            {stockInfo.status === 'out_of_stock' ? (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={onBack}
                    className="text-xs font-bold py-3.5 px-4 rounded-xl border border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50 text-center cursor-pointer transition-all active:scale-95"
                  >
                    Back to Products
                  </button>
                  <button 
                    disabled
                    className="text-xs font-black py-3.5 px-4 rounded-xl bg-neutral-100 text-neutral-400 text-center cursor-not-allowed"
                  >
                    Out of Stock
                  </button>
                </div>
                
                <button 
                  type="button"
                  onClick={() => onNotifyMe(product)}
                  className="w-full text-xs font-black py-4 px-4 rounded-xl bg-[#FAF6F0] border-2 border-[#C86428]/40 hover:border-[#C86428] text-[#C86428] transition-all text-center flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Bell className="w-4 h-4 text-[#C86428]" />
                  <span>Notify Me When Restocked</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={onBack}
                    className="text-xs font-bold py-3.5 px-4 rounded-xl border border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50 hover:border-neutral-300 text-center cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    Back to Products
                  </button>
                  <button 
                    type="button"
                    onClick={() => onAddToCart(product, detailQuantity)}
                    className="text-xs font-black py-3.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-center cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/10"
                  >
                    Add to Cart ({detailQuantity})
                  </button>
                </div>
                
                {/* Full Width Quick Buy Now */}
                <button 
                  id="detail-quick-buy-btn"
                  type="button"
                  onClick={() => onQuickBuy(product)}
                  className="w-full text-xs font-black py-4 px-4 rounded-xl bg-[#5C1D13] hover:bg-[#4A1D05] text-white transition-all text-center flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4 text-white" />
                  <span>Quick Buy (COD Available)</span>
                </button>

                <div className="flex justify-center items-center gap-5 text-[11px] pt-1.5 font-medium text-neutral-700">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" /> Secure Checkout
                  </span>
                  <span>•</span>
                  <span>Shipped in 24 Hrs</span>
                  <span>•</span>
                  <span>Discreet Packaging</span>
                </div>

                {/* FREE Personalized Diet Plan Banner */}
                <div id="detail-diet-plan-banner" className="bg-[#FAF6F0] border-2 border-[#E5A93C]/40 p-4 rounded-2xl flex items-start gap-3 mt-4 text-left shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-[#E5A93C]/20 border border-[#E5A93C]/30 flex items-center justify-center shrink-0 text-base mt-0.5">
                    🥗
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] font-black uppercase tracking-wider bg-[#5C1D13] text-[#E5A93C] px-2 py-0.5 rounded-full font-mono">
                        FREE BONUS INCLUDED
                      </span>
                      <span className="text-[10px] font-extrabold text-[#C86428]">Customized for You</span>
                    </div>
                    <p className="text-xs sm:text-sm font-black text-[#4A1D05] leading-snug">
                      FREE Personalized Diet Plan based on your body type and weight
                    </p>
                    <p className="text-[11px] text-[#4A1D05]/85 leading-relaxed font-medium">
                      Every product order includes a 1-on-1 personalized Ayurvedic nutrition guide formulated around your body weight and dosha balance.
                    </p>
                  </div>
                </div>

                {/* COD Information Badge */}
                <div id="detail-cod-info-badge" className="bg-[#FAF6F0] border border-[#E5A93C]/30 p-4 rounded-2xl flex items-start gap-3 mt-4 text-left">
                  <Truck className="w-5 h-5 text-[#C86428] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-[#4A1D05]">Cash on Delivery Available</p>
                      <span className="text-[8px] bg-[#E5A93C]/20 text-[#4A1D05] px-1.5 py-0.5 rounded font-black font-mono uppercase tracking-wider">Policy</span>
                    </div>
                    <p className="text-[11px] text-[#4A1D05]/85 leading-relaxed font-medium">
                      ₹150 advance payment is required to confirm your COD order. The remaining amount is payable at the time of delivery.
                    </p>
                  </div>
                </div>

                {/* Write a Review Button */}
                <button
                  type="button"
                  onClick={() => onWriteReview(product.id)}
                  className="w-full flex items-center justify-center gap-2 bg-[#FAF6F0] hover:bg-[#C86428]/10 text-[#C86428] border border-[#C86428]/40 font-extrabold text-xs py-3.5 px-4 rounded-xl transition-all cursor-pointer active:scale-95 shadow-sm mt-3.5"
                >
                  <Star className="w-4 h-4 fill-[#C86428] text-[#C86428]" />
                  <span>Write a Product Review</span>
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Deep-dive: Approved Medical Benefits & Action Mechanisms */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Approved Therapeutic Benefits */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-5">
          <h2 className="font-serif text-xl font-bold text-white border-b border-white/10 pb-3">
            Approved Therapeutic Benefits
          </h2>
          <div className="space-y-3.5">
            {product.benefits && product.benefits.map((benefit, bIdx) => (
              <div key={bIdx} className="flex gap-2.5 items-start">
                <div className="p-0.5 bg-emerald-500/10 text-emerald-400 rounded-full mt-0.5 border border-emerald-500/20">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs md:text-sm text-[#F7E7D9] leading-normal font-medium">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Key Bio-Active Ingredients & Standardization */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-5">
          <div className="border-b border-white/10 pb-3 flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-white">
              Key Bio-Active Ingredients & Standardization
            </h2>
            <span className="text-[10px] font-mono uppercase text-[#E5A93C] bg-[#E5A93C]/10 border border-[#E5A93C]/20 px-2.5 py-0.5 rounded-full font-bold">
              Pure Extracts
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {product.keyIngredients && product.keyIngredients.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-black/30 border border-white/5 rounded-xl p-3.5 hover:border-[#E5A93C]/30 transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white flex items-center gap-2">
                    <span className="text-[#E5A93C]">🌿</span> {item.name}
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {item.benefit}
                  </span>
                </div>
                {item.description && (
                  <p className="text-xs text-neutral-300 leading-relaxed font-sans pl-6">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verified Customer Reviews Section */}
      <section className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-3">
          <div>
            <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
              <span>⭐</span> Verified Customer Reviews
            </h2>
            <p className="text-xs text-neutral-300">Real verified customers sharing their genuine feedback</p>
          </div>
          <button
            type="button"
            onClick={() => onWriteReview(product.id)}
            className="text-xs font-bold bg-[#E5A93C] text-[#23120B] px-4 py-2 rounded-xl hover:bg-[#C86428] hover:text-white transition-colors cursor-pointer self-start sm:self-auto"
          >
            + Write a Review
          </button>
        </div>

        {prodReviews.length === 0 ? (
          <div className="py-12 text-center text-white/50 italic bg-black/20 rounded-2xl border border-white/5">
            No customer reviews yet for {product.name}. Be the first to share your experience!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prodReviews.map((rev, rIdx) => {
              const revImgs = getReviewImages(rev.image);
              return (
                <div 
                  key={rIdx} 
                  className="bg-black/30 border border-white/10 rounded-2xl p-5 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex text-[#E5A93C]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-neutral-600'}`} />
                        ))}
                      </div>
                      {rev.verified && (
                        <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>

                    {rev.title && (
                      <h3 className="font-serif text-sm font-bold text-white">
                        {rev.title}
                      </h3>
                    )}

                    <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                      "{rev.review}"
                    </p>

                    {revImgs.length > 0 && (
                      <div className="flex gap-2 pt-1 overflow-x-auto">
                        {revImgs.map((imgUrl, imgI) => (
                          <div 
                            key={imgI} 
                            onClick={() => onOpenLightbox(imgUrl)}
                            className="w-12 h-12 rounded-lg overflow-hidden border border-white/20 cursor-pointer shrink-0"
                          >
                            <img 
                              src={optimizeCloudinaryUrl(imgUrl, 160)} 
                              srcSet={`${optimizeCloudinaryUrl(imgUrl, 96)} 96w, ${optimizeCloudinaryUrl(imgUrl, 160)} 160w`}
                              sizes="48px"
                              alt="Review attachment" 
                              loading="lazy"
                              decoding="async"
                              width="48"
                              height="48"
                              className="w-full h-full object-cover" 
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-white/10 pt-2 flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                    <span>{rev.name} {rev.location ? `(${rev.location})` : ''}</span>
                    <span>{rev.date || "Verified"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Related Products Section (Strictly Segregated by Gender) */}
      <section className="bg-gradient-to-br from-[#230d07] via-[#3a1508] to-[#1a0803] border border-[#E5A93C]/20 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-2">
          <div>
            <h2 className="font-serif text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <span>🌿</span> Complementary {isMenProduct ? "Men's Vitality" : "Women's Wellness"} Formulations
            </h2>
            <p className="text-xs text-neutral-300">Targeted formulas designed to work synergistically for complete holistic health</p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-bold text-[#E5A93C] hover:underline flex items-center gap-1 cursor-pointer"
          >
            View All Products →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedProducts.map(rel => (
            <div 
              key={rel.id} 
              onClick={() => {
                onProductClick(rel);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-black/30 border border-white/10 hover:border-[#E5A93C]/40 rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div className="aspect-square w-full rounded-xl overflow-hidden bg-black/40 border border-white/5 p-2 flex items-center justify-center">
                <img 
                  src={rel.images && rel.images.length > 0 ? optimizeCloudinaryUrl(rel.images[0], 480) : ''} 
                  srcSet={rel.images && rel.images.length > 0 ? `${optimizeCloudinaryUrl(rel.images[0], 240)} 240w, ${optimizeCloudinaryUrl(rel.images[0], 360)} 360w, ${optimizeCloudinaryUrl(rel.images[0], 480)} 480w, ${optimizeCloudinaryUrl(rel.images[0], 640)} 640w` : undefined}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 250px"
                  alt={rel.name} 
                  loading="lazy"
                  decoding="async"
                  width="250"
                  height="250"
                  className="w-full h-full object-contain transform transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="space-y-1">
                {rel.tag && (
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#E5A93C]/10 text-[#E5A93C] border border-[#E5A93C]/20">
                    {rel.tag}
                  </span>
                )}
                <h3 className="font-serif font-bold text-white text-sm group-hover:text-[#E5A93C] transition-colors line-clamp-1">
                  {rel.name}
                </h3>
                <p className="text-[10px] text-neutral-300 line-clamp-2 leading-tight">
                  {rel.shortDescription}
                </p>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-white/10">
                <div>
                  <span className="text-xs font-black text-amber-300">₹{rel.price}</span>
                  <span className="text-[10px] text-neutral-400 line-through ml-1">₹{rel.mrp}</span>
                </div>
                <span className="text-[10px] font-bold text-[#E5A93C] group-hover:translate-x-1 transition-transform">
                  View Details →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
