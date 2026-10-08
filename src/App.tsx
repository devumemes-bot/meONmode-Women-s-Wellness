/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  ChevronRight, 
  Star, 
  ArrowLeft, 
  Plus, 
  Minus, 
  Trash2, 
  Lock, 
  Check, 
  ShieldCheck, 
  Heart, 
  Sparkles,
  Send,
  Share2,
  Copy,
  MessageCircle,
  Facebook,
  Instagram,
  Search,
  X,
  Package,
  Clipboard,
  Bell,
  Phone
} from 'lucide-react';
import { PRODUCTS, MENS_PRODUCTS, VAYUCORE_PRODUCT, reviews, CustomerReview, optimizeCloudinaryUrl } from './data';
import { Product, CartItem, ViewType, CheckoutDetails } from './types';
import { UI_TRANSLATIONS, getTranslatedProducts, getTranslatedFAQs, getTranslatedTestimonials, getTranslatedReviews } from './translations';
import { Hero } from './components/Hero';
import { ConcernSelector } from './components/ConcernSelector';
import { 
  trackAddToCart, 
  trackViewCart, 
  trackBeginCheckout, 
  trackAddShippingInfo, 
  trackAddPaymentInfo, 
  trackPurchase 
} from './analytics';

// Code-split dynamic views and below-the-fold sections for optimal mobile FCP/LCP
const WhyOurFormulations = React.lazy(() => import('./components/WhyOurFormulations').then(m => ({ default: m.WhyOurFormulations })));
const WhyMeonmode = React.lazy(() => import('./components/WhyMeonmode').then(m => ({ default: m.WhyMeonmode })));
const IngredientTransparency = React.lazy(() => import('./components/IngredientTransparency').then(m => ({ default: m.IngredientTransparency })));
const HowItWorks = React.lazy(() => import('./components/HowItWorks').then(m => ({ default: m.HowItWorks })));
const BrandStory = React.lazy(() => import('./components/BrandStory').then(m => ({ default: m.BrandStory })));

const ProductDetail = React.lazy(() => import('./components/ProductDetail').then(m => ({ default: m.ProductDetail })));
const AllProductsPage = React.lazy(() => import('./components/AllProductsPage').then(m => ({ default: m.AllProductsPage })));
const AboutUsPage = React.lazy(() => import('./components/AboutUsPage').then(m => ({ default: m.AboutUsPage })));
const BlogListing = React.lazy(() => import('./components/BlogListing').then(m => ({ default: m.BlogListing })));
const BlogArticleView = React.lazy(() => import('./components/BlogArticleView').then(m => ({ default: m.BlogArticleView })));

const RefundPolicyView = React.lazy(() => import('./components/PolicyPages').then(m => ({ default: m.RefundPolicyView })));
const ShippingPolicyView = React.lazy(() => import('./components/PolicyPages').then(m => ({ default: m.ShippingPolicyView })));
const PrivacyPolicyView = React.lazy(() => import('./components/PolicyPages').then(m => ({ default: m.PrivacyPolicyView })));
const TermsAndConditionsView = React.lazy(() => import('./components/PolicyPages').then(m => ({ default: m.TermsAndConditionsView })));
const OrderHistoryView = React.lazy(() => import('./components/OrderHistoryView').then(m => ({ default: m.OrderHistoryView })));

const CartCheckoutView = React.lazy(() => import('./components/CartCheckoutView').then(m => ({ default: m.CartCheckoutView })));
const PaymentGatewayModal = React.lazy(() => import('./components/PaymentGatewayModal').then(m => ({ default: m.PaymentGatewayModal })));
const OrderSuccessView = React.lazy(() => import('./components/OrderSuccessView').then(m => ({ default: m.OrderSuccessView })));
const CustomerReviewsSection = React.lazy(() => import('./components/CustomerReviewsSection').then(m => ({ default: m.CustomerReviewsSection })));
const ProductReviewsModal = React.lazy(() => import('./components/ProductReviewsModal').then(m => ({ default: m.ProductReviewsModal })));
const WriteReviewModal = React.lazy(() => import('./components/ReviewModals').then(m => ({ default: m.WriteReviewModal })));
const RestockModal = React.lazy(() => import('./components/ReviewModals').then(m => ({ default: m.RestockModal })));
const ReviewCanvasLightbox = React.lazy(() => import('./components/ReviewCanvasLightbox').then(m => ({ default: m.ReviewCanvasLightbox })));
const WhatsAppDeskModal = React.lazy(() => import('./components/WhatsAppDeskModal').then(m => ({ default: m.WhatsAppDeskModal })));

// Cookie helpers for pre-filling user data
function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

function setCookie(name: string, value: string, days?: number) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (encodeURIComponent(value) || "") + expires + "; path=/; SameSite=Lax";
}

// Product Clean Canonical Slug Mapping
export function getProductCleanSlug(id: string): string {
  switch (id) {
    case 'flowelle': return 'flowelle';
    case 'ovaira': return 'ovaira';
    case 'wantmore-men':
    case 'wantmore': return 'wantmore';
    case 'alphamax-men':
    case 'alphamax': return 'alphamax';
    case 'vayucore': return 'vayucore';
    case 'combo-kit':
    case 'female-combo-kit': return 'combo-kit';
    case 'mens-combo':
    case 'mens-ultimate-performance-combo': return 'mens-combo';
    default: return id;
  }
}

export function getProductFromSlug(slug: string): Product | undefined {
  if (!slug) return undefined;
  const clean = slug
    .toLowerCase()
    .replace('/products/', '')
    .replace('/product/', '')
    .replace('/combos/', '')
    .replace('/combo/', '')
    .replace(/^\/+|\/+$/g, '')
    .split('?')[0]
    .split('#')[0]
    .trim();
  const allProds = [...PRODUCTS, ...MENS_PRODUCTS, VAYUCORE_PRODUCT];
  return allProds.find(p => {
    if (p.id.toLowerCase() === clean) return true;
    if (clean === 'female-combo-kit' || clean === 'combo-kit' || clean === 'womens-combo' || clean === 'women-combo' || clean === 'women-combo-kit') return p.id === 'combo-kit';
    if (clean === 'mens-ultimate-performance-combo' || clean === 'mens-combo' || clean === 'men-combo' || clean === 'men-combo-kit') return p.id === 'mens-combo';
    if (clean === 'wantmore' || clean === 'wantmore-men' || clean === 'wantmore-prash') return p.id === 'wantmore-men';
    if (clean === 'alphamax' || clean === 'alphamax-men' || clean === 'alphamax-capsules') return p.id === 'alphamax-men';
    if (clean === 'flowelle' || clean === 'flowelle-syrup' || clean === 'flowelle-drink') return p.id === 'flowelle';
    if (clean === 'ovaira' || clean === 'ovaira-capsules') return p.id === 'ovaira';
    if (clean === 'vayucore' || clean === 'vayucore-liquid') return p.id === 'vayucore';
    return false;
  });
}

export function getProductSeoData(product: Product) {
  const slug = getProductCleanSlug(product.id);
  const canonicalUrl = `https://meonmode.com/products/${slug}`;

  switch (slug) {
    case 'ovaira':
      return {
        title: "meONmode® OVAIRA Capsules | Ayurvedic PCOS & Hormonal Wellness",
        description: "Shop meONmode OVAIRA Veg Capsules for PCOS care, hormonal balance, ovarian wellness, and clear skin. Ayurvedic formula with Shatavari & Kanchnar.",
        h1: "meONmode® OVAIRA Capsules",
        canonicalUrl,
        ogImage: product.images?.[0] || "https://res.cloudinary.com/ukqeabxy/image/upload/v1787512635/ChatGPT_Image_Jun_20_2026_10_27_18_PM_copy.png"
      };
    case 'flowelle':
      return {
        title: "meONmode® FLOWELLE Drink | Ayurvedic Period & Flow Care",
        description: "Shop meONmode FLOWELLE Ayurvedic syrup for period cramp relief, cycle regularity, and uterine wellness. Made with Ashok Chal, Shatavari, and Gokhru.",
        h1: "meONmode® FLOWELLE Drink",
        canonicalUrl,
        ogImage: product.images?.[0] || "https://res.cloudinary.com/ukqeabxy/image/upload/v1787512638/ChatGPT_Image_Jun_20_2026_10_28_00_PM.png"
      };
    case 'alphamax':
      return {
        title: "meONmode® AlphaMax FOR MEN | Ayurvedic Shudh Shilajit & Vitality Capsules",
        description: "Shop meONmode AlphaMax Veg Capsules with Shudh Shilajit, Safed Musli, and Gokshura to support physical stamina, cellular energy, and daily recovery.",
        h1: "meONmode® AlphaMax FOR MEN (Capsules)",
        canonicalUrl,
        ogImage: product.images?.[0] || "https://res.cloudinary.com/ukqeabxy/image/upload/v1787581390/ChatGPT_Image_Aug_24_2026_07_29_31_PM.png"
      };
    case 'wantmore':
      return {
        title: "meONmode® WANTMORE FOR MEN (Prash) | Ayurvedic Stamina & Vigor",
        description: "Shop meONmode WANTMORE FOR MEN Prash for maximum strength, endurance, and stamina. Ayurvedic formula with Safed Musli and Ashwagandha.",
        h1: "meONmode® WANTMORE FOR MEN (Prash)",
        canonicalUrl,
        ogImage: product.images?.[0] || "https://res.cloudinary.com/ukqeabxy/image/upload/v1787581394/ChatGPT_Image_Aug_24_2026_07_28_33_PM.png"
      };
    case 'vayucore':
      return {
        title: "meONmode® VAYUCORE | Ayurvedic Digestive & Gut Health Liquid",
        description: "Shop meONmode VAYUCORE 450ml Ayurvedic liquid for fast relief from gas, acidity, and bloating while supporting healthy gut digestion.",
        h1: "meONmode® VAYUCORE",
        canonicalUrl,
        ogImage: product.images?.[0] || "https://res.cloudinary.com/ukqeabxy/image/upload/v1787581399/ChatGPT_Image_Aug_24_2026_07_30_05_PM.png"
      };
    case 'combo-kit':
    case 'female-combo-kit':
      return {
        title: "meONmode® Female Combo Kit | OVAIRA Capsules + FLOWELLE Syrup",
        description: "Shop meONmode Female Combo Kit with OVAIRA Capsules and FLOWELLE Syrup for complete Ayurvedic cycle care, hormonal balance, and period support.",
        h1: "meONmode® Combo Kit (Female Wellness Combo)",
        canonicalUrl: "https://meonmode.com/products/combo-kit",
        ogImage: product.images?.[0] || "https://res.cloudinary.com/ukqeabxy/image/upload/v1787512639/ChatGPT_Image_Jun_20_2026_10_28_24_PM.png"
      };
    case 'mens-combo':
    case 'mens-ultimate-performance-combo':
      return {
        title: "meONmode® Men's Ultimate Performance Combo | WANTMORE + AlphaMax + VAYUCORE",
        description: "Shop meONmode Men's Ultimate Performance Combo with WANTMORE Prash, AlphaMax Capsules, and FREE VAYUCORE for complete male stamina, power, and digestion.",
        h1: "Men's Ultimate Performance Combo Kit",
        canonicalUrl: "https://meonmode.com/products/mens-combo",
        ogImage: product.images?.[0] || "https://res.cloudinary.com/ukqeabxy/image/upload/v1787581402/ChatGPT_Image_Aug_24_2026_07_42_58_PM.png"
      };
    default:
      return {
        title: `${product.name} | meONmode® Ayurvedic Wellness`,
        description: product.shortDescription || product.longDescription,
        h1: product.name,
        canonicalUrl,
        ogImage: product.images?.[0] || "https://res.cloudinary.com/ukqeabxy/image/upload/v1787512639/ChatGPT_Image_Jun_20_2026_10_28_24_PM.png"
      };
  }
}

function getProductCategory(prod: Product): string {
  const name = prod.name.toLowerCase();
  const desc = prod.shortDescription?.toLowerCase() || '';
  if (prod.id.includes('combo') || prod.id.includes('kit')) return 'Combos';
  if (prod.id === 'vayucore' || name.includes('vayucore') || name.includes('syrup') || desc.includes('syrup')) return 'Syrups';
  if (name.includes('prash') || desc.includes('prash') || prod.id.includes('wantmore')) return 'Prash';
  return 'Capsules';
}

export default function App() {
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  // Language state (English)
  const lang: 'en' = 'en';

  // Navigation & Cart States
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(PRODUCTS[0]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('meonmode_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'women' | 'men' | 'all'>('women');
  const [activeReviewProduct, setActiveReviewProduct] = useState<Product | null>(null);

  // Centralized Reviews Database State (Persisted in LocalStorage)
  const [allReviews, setAllReviews] = useState<CustomerReview[]>(() => {
    try {
      const saved = localStorage.getItem('meonmode_reviews_v7');
      if (saved) {
        const parsed: CustomerReview[] = JSON.parse(saved);
        // Combine parsed user reviews with pristine base reviews, eliminating duplicate objects
        const userAddedReviews = parsed.filter(
          p => !reviews.some(base => base.name.toLowerCase() === p.name.toLowerCase() && base.productId === p.productId)
        );
        return [...reviews, ...userAddedReviews];
      }
      return reviews;
    } catch (e) {
      return reviews;
    }
  });

  // Auto-save reviews
  useEffect(() => {
    localStorage.setItem('meonmode_reviews_v7', JSON.stringify(allReviews));
  }, [allReviews]);

  // Review System Modal / Sheet States
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState<boolean>(false);
  const [writeReviewProductId, setWriteReviewProductId] = useState<string>('');
  
  // New review form values state
  const [newReviewName, setNewReviewName] = useState<string>('');
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [newReviewComment, setNewReviewComment] = useState<string>('');
  const [newReviewImages, setNewReviewImages] = useState<string[]>([]);
  const [reviewFormError, setReviewFormError] = useState<string>('');
  const [reviewSubmitSuccess, setReviewSubmitSuccess] = useState<boolean>(false);

  // Utility to copy toast notification trigger
  const showToastNotification = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  // Translate products dynamically based on lang (memoized for high responsiveness)
  const translatedData = useMemo(() => getTranslatedProducts(lang, PRODUCTS, MENS_PRODUCTS), [lang]);
  const womenProducts = translatedData.women;
  const menProducts = translatedData.men;

  const displayFAQs = useMemo(() => {
    return activeCategory === 'all' 
      ? [...getTranslatedFAQs(lang, false), ...getTranslatedFAQs(lang, true)]
      : getTranslatedFAQs(lang, activeCategory === 'men');
  }, [lang, activeCategory]);

  const displayTestimonials = useMemo(() => {
    return activeCategory === 'all'
      ? [...getTranslatedTestimonials(lang, false), ...getTranslatedTestimonials(lang, true)]
      : getTranslatedTestimonials(lang, activeCategory === 'men');
  }, [lang, activeCategory]);

  const displayReviews = useMemo(() => getTranslatedReviews(lang), [lang]);

  const currentReviews = useMemo(() => {
    return allReviews.map(rev => {
      const matched = displayReviews.find(tr => tr.productId === rev.productId && (tr.name === rev.name || rev.name === "Priya Sharma" || rev.name === "Anjali Verma" || rev.name === "Karuna" || rev.name === "प्रिया शर्मा" || rev.name === "अंजलि वर्मा" || rev.name === "करुणा"));
      if (matched) {
        return {
          ...rev,
          name: matched.name,
          review: matched.review,
          title: matched.title
        };
      }
      return rev;
    });
  }, [allReviews, displayReviews]);

  const t = useCallback((key: keyof typeof UI_TRANSLATIONS['en'], variables?: Record<string, string | number>) => {
    let str = UI_TRANSLATIONS[lang][key] || UI_TRANSLATIONS['en'][key] || '';
    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, String(v));
      });
    }
    return str;
  }, [lang]);

  // Translate products dynamically inside the cart
  const translatedCart = useMemo(() => {
    return cart.map(item => {
      const translatedProd = womenProducts.find(p => p.id === item.product.id) || menProducts.find(p => p.id === item.product.id) || item.product;
      return {
        ...item,
        product: translatedProd
      };
    });
  }, [cart, womenProducts, menProducts]);

  const currentProduct = useMemo(() => {
    return selectedProduct 
      ? (womenProducts.find(p => p.id === selectedProduct.id) || menProducts.find(p => p.id === selectedProduct.id) || selectedProduct) 
      : null;
  }, [selectedProduct, womenProducts, menProducts]);

  // Convert uploaded review images into Base64 URLs for localized persistence
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files) as File[];
    if (newReviewImages.length + files.length > 4) {
      setReviewFormError("Maximum of 4 photos are allowed.");
      return;
    }
    setReviewFormError('');
    files.forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNewReviewImages(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file as Blob);
    });
  };

  // Safe Multi-Image parsing helper with strict deduplication
  const getReviewImages = (imageField: string | string[] | undefined): string[] => {
    if (!imageField) return [];
    const list = Array.isArray(imageField) 
      ? imageField 
      : imageField.split(/[\s\n,]+/).filter(url => url.trim().startsWith('http'));
    return Array.from(new Set(list.map(u => u.trim()).filter(u => u.startsWith('http'))));
  };

  // Compute dynamic average ratings and review counts merging custom reviews into status counts
  const getProductRatingDetails = (productId: string) => {
    const staticProd = [...PRODUCTS, ...MENS_PRODUCTS].find(p => p.id === productId);
    const baseCount = staticProd?.reviewsCount || 100;
    const baseRating = staticProd?.rating || 4.8;

    // Filter user-submitted reviews for this product
    const approvedUserReviews = allReviews.filter(
      r => r.productId === productId && 
      !reviews.some(old => old.name === r.name && old.review === r.review)
    );

    const totalCount = baseCount + approvedUserReviews.length;
    const newSum = approvedUserReviews.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = totalCount > 0 ? (baseRating * baseCount + newSum) / totalCount : baseRating;

    return {
      rating: Number(averageRating.toFixed(1)),
      reviewsCount: totalCount
    };
  };

  const isMenProduct = (prod: Product | null) => {
    if (!prod) return false;
    return prod.id === 'wantmore-men' || prod.id === 'alphamax-men' || prod.id === 'mens-combo';
  };

  const getProductStockStatus = (productId: string) => {
    const indicators: Record<string, { status: string; text: string; count: number }> = {
      'combo-kit': { status: 'selling_fast', text: t('stockSellingFast'), count: 50 },
      'ovaira': { status: 'limited_stock', text: t('stockLimited'), count: 50 },
      'flowelle': { status: 'in_stock', text: t('stockInStock'), count: 100 },
      'wantmore-men': { status: 'ready_to_ship', text: t('stockReady'), count: 100 },
      'alphamax-men': { status: 'selling_fast', text: t('stockSellingFast'), count: 50 },
      'mens-combo': { status: 'limited_stock', text: t('stockLimited'), count: 50 },
      'vayucore': { status: 'limited_stock', text: t('stockLimited'), count: 50 }
    };
    return indicators[productId] || { status: 'in_stock', text: t('stockInStock'), count: 100 };
  };

  // Form Details
  const [checkout, setCheckout] = useState<CheckoutDetails>({
    fullName: '',
    phone: '',
    address: '',
    pincode: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<CheckoutDetails>>({});
  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('cod');
  const [notifyMeProduct, setNotifyMeProduct] = useState<Product | null>(null);
  const [notifyEmail, setNotifyEmail] = useState<string>('');
  const [notifySuccess, setNotifySuccess] = useState<boolean>(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxZoom, setLightboxZoom] = useState<boolean>(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [detailQuantity, setDetailQuantity] = useState<number>(1);
  const [dismissedBanner, setDismissedBanner] = useState<boolean>(false);
  const [highlightedProductId, setHighlightedProductId] = useState<string | null>(null);
  const [codAcknowledged, setCodAcknowledged] = useState<boolean>(false);
  const [showShareDropdown, setShowShareDropdown] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [searchCategory, setSearchCategory] = useState<'All' | 'Capsules' | 'Syrups' | 'Prash' | 'Combos'>('All');
  const [lastOrderId, setLastOrderId] = useState<string>('');
  const [showInvoice, setShowInvoice] = useState<boolean>(false);
  const [trackingOrderIdInput, setTrackingOrderIdInput] = useState<string>('');
  
  // SECURE PAYMENT GATEWAY & VERIFICATION STATES
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [pendingPaymentOrder, setPendingPaymentOrder] = useState<any | null>(null);
  const [paymentRefInput, setPaymentRefInput] = useState<string>('');
  const [showGatewayModal, setShowGatewayModal] = useState<boolean>(false);
  const [lastVerifiedOrder, setLastVerifiedOrder] = useState<any | null>(() => {
    try {
      const saved = sessionStorage.getItem('meonmode_verified_order');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [orderHistory, setOrderHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('meonmode_order_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string>('pcos-kya-hai-pcod-se-alag');

  const location = useLocation();
  const navigate = useNavigate();

  // Synchronize BrowserRouter location & search <-> currentView & sub-states
  useEffect(() => {
    const path = location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
    const searchParams = new URLSearchParams(location.search);
    const prodParam = searchParams.get('product') || searchParams.get('p');

    if (path === '/cart') {
      if (currentView !== 'cart') setCurrentView('cart');
    } else if (path === '/orders' || path === '/order-history' || path === '/track-order' || path === '/track-orders') {
      if (currentView !== 'order-history') setCurrentView('order-history');
    } else if (path === '/refund-policy' || path === '/return-policy') {
      if (currentView !== 'refund-policy') setCurrentView('refund-policy');
    } else if (path === '/shipping-policy') {
      if (currentView !== 'shipping-policy') setCurrentView('shipping-policy');
    } else if (path === '/privacy-policy') {
      if (currentView !== 'privacy-policy') setCurrentView('privacy-policy');
    } else if (path === '/terms-and-conditions' || path === '/terms' || path === '/terms-of-service') {
      if (currentView !== 'terms-and-conditions') setCurrentView('terms-and-conditions');
    } else if (path === '/about' || path === '/about-us') {
      if (currentView !== 'about') setCurrentView('about');
    } else if (path === '/contact' || path === '/contact-us') {
      if (currentView !== 'contact') setCurrentView('contact');
    } else if (path === '/success') {
      if (lastVerifiedOrder) {
        if (currentView !== 'success') setCurrentView('success');
      } else {
        navigate('/cart', { replace: true });
      }
    } else if (path === '/blog') {
      if (currentView !== 'blog') setCurrentView('blog');
    } else if (path.startsWith('/blog/')) {
      const slug = path.split('/blog/')[1]?.split('/')[0]?.split('?')[0];
      const cleanSlug = (slug || '').toLowerCase();
      if (cleanSlug) {
        setSelectedBlogSlug(cleanSlug);
        if (currentView !== 'blog-article') setCurrentView('blog-article');
      } else {
        if (currentView !== 'not-found') setCurrentView('not-found');
      }
    } else if (path.startsWith('/products/') || path.startsWith('/product/') || path.startsWith('/combo/') || path.startsWith('/combos/')) {
      const slug = path
        .replace(/^\/(products|product|combos|combo)\//, '')
        .split('/')[0]
        ?.split('?')[0];
      const match = getProductFromSlug(slug || '');
      if (match) {
        setSelectedProduct(match);
        setActiveImageIndex(0);
        setDetailQuantity(1);
        if (currentView !== 'detail') setCurrentView('detail');
        const isMen = isMenProduct(match);
        setActiveCategory(isMen ? 'men' : 'women');
      } else {
        if (currentView !== 'not-found') setCurrentView('not-found');
      }
    } else if (prodParam) {
      const match = getProductFromSlug(prodParam);
      if (match) {
        setSelectedProduct(match);
        setActiveImageIndex(0);
        setDetailQuantity(1);
        if (currentView !== 'detail') setCurrentView('detail');
        const isMen = isMenProduct(match);
        setActiveCategory(isMen ? 'men' : 'women');
      } else {
        if (currentView !== 'not-found') setCurrentView('not-found');
      }
    } else if (path === '/products' || path === '/combos' || path === '/collections/all-products' || path === '/collections/all' || path === '/all-products' || path === '/collections') {
      if (currentView !== 'home') setCurrentView('home');
      setActiveCategory('all');
    } else if (path === '/women' || path === '/womens' || path === '/collections/women' || path === '/collections/womens') {
      if (currentView !== 'home') setCurrentView('home');
      setActiveCategory('women');
    } else if (path === '/men' || path === '/mens' || path === '/collections/men' || path === '/collections/mens') {
      if (currentView !== 'home') setCurrentView('home');
      setActiveCategory('men');
    } else if (path === '/') {
      if (currentView !== 'home') setCurrentView('home');
    } else {
      if (currentView !== 'not-found') setCurrentView('not-found');
    }
  }, [location.pathname, location.search]);

  // Always reset activeImageIndex and detailQuantity when selected product changes
  useEffect(() => {
    setActiveImageIndex(0);
    setDetailQuantity(1);
  }, [selectedProduct?.id]);

  // View navigation helper that updates route URL
  const navigateToView = (view: ViewType, product?: Product, blogSlug?: string) => {
    setCurrentView(view);
    if (view === 'home') navigate('/');
    else if (view === 'cart') navigate('/cart');
    else if (view === 'order-history' || view === 'track-order') navigate('/orders');
    else if (view === 'refund-policy') navigate('/refund-policy');
    else if (view === 'shipping-policy') navigate('/shipping-policy');
    else if (view === 'privacy-policy') navigate('/privacy-policy');
    else if (view === 'terms-and-conditions') navigate('/terms-and-conditions');
    else if (view === 'about') navigate('/about');
    else if (view === 'contact') navigate('/contact');
    else if (view === 'success') navigate('/success');
    else if (view === 'blog') navigate('/blog');
    else if (view === 'blog-article') {
      const slug = blogSlug || selectedBlogSlug;
      setSelectedBlogSlug(slug);
      navigate(`/blog/${slug}`);
    }
    else if (view === 'detail') {
      const prodToUse = product || selectedProduct;
      if (prodToUse) {
        setSelectedProduct(prodToUse);
        setActiveImageIndex(0);
        setDetailQuantity(1);
        const slug = getProductCleanSlug(prodToUse.id);
        navigate(`/products/${slug}`);
      }
    }
  };

  // Order History by Mobile Number States
  const [orderHistoryPhoneInput, setOrderHistoryPhoneInput] = useState<string>(() => {
    try {
      return localStorage.getItem('meonmode_phone_lookup') || '';
    } catch (e) {
      return '';
    }
  });
  const [orderHistoryOrders, setOrderHistoryOrders] = useState<any[]>([]);
  const [isLoadingOrderHistory, setIsLoadingOrderHistory] = useState<boolean>(false);
  const [orderHistorySearchError, setOrderHistorySearchError] = useState<string | null>(null);
  const [selectedInvoiceModalOrder, setSelectedInvoiceModalOrder] = useState<any | null>(null);

  const handleLookupOrdersByPhone = async (phoneToQuery?: string) => {
    const rawInput = (phoneToQuery !== undefined ? phoneToQuery : orderHistoryPhoneInput).trim();
    if (!rawInput) {
      setOrderHistorySearchError('Please enter your 10-digit mobile number or Order ID.');
      return;
    }

    const cleanPhone = rawInput.replace(/\D/g, '').slice(-10);
    const isOrderQuery = rawInput.toUpperCase().startsWith('MEON') || (!cleanPhone || cleanPhone.length < 10);

    setIsLoadingOrderHistory(true);
    setOrderHistorySearchError(null);

    // 1. Direct Order ID lookup path
    if (isOrderQuery && rawInput.length >= 4) {
      const cleanOrderId = rawInput.toUpperCase();
      try {
        const res = await fetch(`/api/orders/${encodeURIComponent(cleanOrderId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.order) {
            setOrderHistoryOrders([data.order]);
            setIsLoadingOrderHistory(false);
            return;
          }
        }
      } catch (e) {}

      // Fallback: Check locally stored confirmed orders
      try {
        if (lastVerifiedOrder && lastVerifiedOrder.orderId?.toUpperCase() === cleanOrderId) {
          setOrderHistoryOrders([lastVerifiedOrder]);
          setIsLoadingOrderHistory(false);
          return;
        }
        const cachedRaw = localStorage.getItem('meonmode_cached_orders');
        if (cachedRaw) {
          const cachedList = JSON.parse(cachedRaw);
          const found = cachedList.find((o: any) => o?.orderId?.toUpperCase() === cleanOrderId);
          if (found) {
            setOrderHistoryOrders([found]);
            setIsLoadingOrderHistory(false);
            return;
          }
        }
      } catch (e) {}
    }

    // 2. Phone Number lookup path
    if (!cleanPhone || cleanPhone.length < 10) {
      setOrderHistorySearchError('Please enter a valid 10-digit mobile number or Order ID.');
      setIsLoadingOrderHistory(false);
      return;
    }

    try {
      localStorage.setItem('meonmode_phone_lookup', cleanPhone);
      let fetched: any[] = [];

      try {
        const res = await fetch(`/api/orders-by-phone/${cleanPhone}`);
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          if (data.success && Array.isArray(data.orders)) {
            fetched = data.orders;
          }
        }
      } catch (netErr) {
        console.warn("Network order fetch notice:", netErr);
      }

      // Merge lastVerifiedOrder if phone matches
      if (lastVerifiedOrder && lastVerifiedOrder.checkoutDetails?.phone?.replace(/\D/g, '').slice(-10) === cleanPhone) {
        if (!fetched.some(o => o.orderId === lastVerifiedOrder.orderId)) {
          fetched.unshift(lastVerifiedOrder);
        }
      }

      // Merge locally stored cached orders if phone matches
      try {
        const cachedRaw = localStorage.getItem('meonmode_cached_orders');
        if (cachedRaw) {
          const cachedList = JSON.parse(cachedRaw);
          if (Array.isArray(cachedList)) {
            cachedList.forEach((co: any) => {
              const cPhone = co?.checkoutDetails?.phone?.replace(/\D/g, '').slice(-10);
              if (cPhone === cleanPhone && !fetched.some(o => o.orderId === co.orderId)) {
                fetched.push(co);
              }
            });
          }
        }
      } catch (e) {}

      setOrderHistoryOrders(fetched);
      if (fetched.length === 0) {
        setOrderHistorySearchError('No orders found for this phone number or ID. Please check your 10-digit number.');
      }
    } catch (err: any) {
      console.error("Order history lookup error:", err);
      const friendlyMsg = (err.message && !err.message.includes('<') && !err.message.includes('JSON') && !err.message.includes('token'))
        ? err.message
        : 'Unable to retrieve orders at this time. Please try again or contact support.';
      setOrderHistorySearchError(friendlyMsg);
    } finally {
      setIsLoadingOrderHistory(false);
    }
  };

  // Auto-search if phone input already filled when switching to order-history view
  useEffect(() => {
    if (currentView === 'order-history' && orderHistoryPhoneInput.replace(/\D/g, '').length >= 10 && orderHistoryOrders.length === 0 && !isLoadingOrderHistory) {
      handleLookupOrdersByPhone(orderHistoryPhoneInput);
    }
  }, [currentView]);

  // Verify server status on view change to prevent direct URL/state bypass
  useEffect(() => {
    if (currentView === 'success') {
      if (!lastVerifiedOrder || !lastVerifiedOrder.orderId || !lastVerifiedOrder.orderVerificationToken) {
        // Direct unverified access attempt blocked
        setCurrentView('cart');
        setPaymentError('Unverified order access blocked. Payment must be verified by server before order confirmation.');
        return;
      }

      // Re-query backend server to confirm order authenticity
      fetch(`/api/orders/${lastVerifiedOrder.orderId}?token=${lastVerifiedOrder.orderVerificationToken}`)
        .then(res => {
          const contentType = res.headers.get('content-type') || '';
          if (!contentType.includes('application/json')) {
            throw new Error('Non-JSON response');
          }
          return res.json();
        })
        .then(data => {
          if (!data.success || !data.order) {
            setLastVerifiedOrder(null);
            sessionStorage.removeItem('meonmode_verified_order');
            setCurrentView('cart');
            setPaymentError('Payment verification expired or unverified on server. Order was NOT confirmed.');
          }
        })
        .catch(() => {
          // Keep cached order if offline
        });
    }
  }, [currentView]);

  // Dynamic Razorpay SDK script loader
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Helper function to send verification payload to backend /api/verify-payment
  const verifyPaymentOnServer = async (verifyPayload: any) => {
    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      const res = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verifyPayload)
      });

      const data = await res.json();

      if (!res.ok || !data.verified || !data.success) {
        throw new Error(data.error || "Payment verification failed. Order was NOT confirmed.");
      }

      // Success: Save verified order details
      setLastVerifiedOrder(data.order);
      setLastOrderId(data.orderId);
      sessionStorage.setItem('meonmode_verified_order', JSON.stringify(data.order));
      saveOrderToHistory(data.order || data.orderId);

      // GA4 Recommended purchase Ecommerce Event (Cryptographically verified orders only, zero PII, deduplicated)
      trackPurchase(data.order);

      // Clear cart ONLY AFTER payment is verified
      setCart([]);

      setShowGatewayModal(false);
      setIsProcessingPayment(false);
      setPaymentRefInput('');
      setCurrentView('success');

    } catch (err: any) {
      console.error("Payment Verification Error:", err);
      setIsProcessingPayment(false);
      setPaymentError(err.message || "Payment verification failed. Your order was NOT confirmed.");
    }
  };

  // Helper function to trigger WhatsApp confirmation for verified orders only
  const triggerWhatsAppConfirmation = () => {
    if (!lastVerifiedOrder) return;

    const cartSummary = lastVerifiedOrder.items.map((item: any) => 
      `${item.name} x ${item.quantity} - Rs. ${(item.price * item.quantity).toLocaleString('en-IN')}`
    ).join('\n');

    const isCod = lastVerifiedOrder.paymentMethod === 'cod';
    const paymentLine = isCod 
      ? `• Mandatory COD Advance Paid: Rs. 150 (Verified Txn Ref: ${lastVerifiedOrder.paymentId})\n• Balance Due at Delivery: Rs. ${lastVerifiedOrder.balanceDue.toLocaleString('en-IN', {minimumFractionDigits: 2})}`
      : `• Prepaid Full Amount Paid: Rs. ${lastVerifiedOrder.grandTotal.toLocaleString('en-IN', {minimumFractionDigits: 2})} (Verified Txn Ref: ${lastVerifiedOrder.paymentId})`;

    const textPayload = `*VERIFIED ORDER - meONmode*
*Order ID:* ${lastVerifiedOrder.orderId}
*Payment Status:* VERIFIED SUCCESS ✓ (Ref: ${lastVerifiedOrder.paymentId})
───────────────────────
*Customer Delivery Details:*
• Name: ${lastVerifiedOrder.checkoutDetails.fullName}
• Phone Number: ${lastVerifiedOrder.checkoutDetails.phone}
• Full Address: ${lastVerifiedOrder.checkoutDetails.address}
• Pincode: ${lastVerifiedOrder.checkoutDetails.pincode}

*Order Summary:*
${cartSummary}

Taxable Value: Rs. ${lastVerifiedOrder.taxableValue.toLocaleString('en-IN', {minimumFractionDigits: 2})}
CGST (2.5%): Rs. ${lastVerifiedOrder.cgst.toLocaleString('en-IN', {minimumFractionDigits: 2})}
SGST (2.5%): Rs. ${lastVerifiedOrder.sgst.toLocaleString('en-IN', {minimumFractionDigits: 2})}
Total GST (5%): Rs. ${lastVerifiedOrder.totalGst.toLocaleString('en-IN', {minimumFractionDigits: 2})}
*Grand Total: Rs. ${lastVerifiedOrder.grandTotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}*

*Payment Breakdown:*
${paymentLine}

*Payment Method:* ${isCod ? 'Cash on Delivery (COD)' : 'Prepaid UPI'}
───────────────────────
Payment has been cryptographically verified on the backend server. Please dispatch this parcel.`;

    const encodedPayload = encodeURIComponent(textPayload);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=917290810336&text=${encodedPayload}`;
    window.open(whatsappUrl, '_blank');
  };

  const saveOrderToHistory = (orderRecord: any) => {
    const orderId = typeof orderRecord === 'string' ? orderRecord : orderRecord?.orderId;
    const clean = (orderId || '').trim().toUpperCase();
    if (!clean || clean.length < 4) return;
    setOrderHistory(prev => {
      const filtered = prev.filter(id => id.toUpperCase() !== clean);
      const updated = [clean, ...filtered].slice(0, 10);
      try {
        localStorage.setItem('meonmode_order_history', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (typeof orderRecord === 'object' && orderRecord) {
      try {
        const cachedRaw = localStorage.getItem('meonmode_cached_orders');
        const list = cachedRaw ? JSON.parse(cachedRaw) : [];
        const filteredList = Array.isArray(list) ? list.filter((o: any) => o?.orderId?.toUpperCase() !== clean) : [];
        const updatedList = [orderRecord, ...filteredList].slice(0, 20);
        localStorage.setItem('meonmode_cached_orders', JSON.stringify(updatedList));
      } catch (e) {}
    }
  };

  // Wishlist toggle handler
  const toggleWishlist = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWishlist(prev => {
      const exists = prev.includes(product.id);
      const updated = exists ? prev.filter(id => id !== product.id) : [...prev, product.id];
      try {
        localStorage.setItem('meonmode_wishlist', JSON.stringify(updated));
      } catch {}
      showToastNotification(exists ? `${product.name} removed from Wishlist` : `❤️ ${product.name} added to Wishlist!`);
      return updated;
    });
  };

  // Smooth scroll to Pricing & Details section taking sticky header into account
  const scrollToPricingDetails = () => {
    requestAnimationFrame(() => {
      const el = document.getElementById('pricing-details-section') || document.getElementById('product-purchase-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  };

  const scrollToBuyingDetails = scrollToPricingDetails;

  const [showWhatsAppChat, setShowWhatsAppChat] = useState<boolean>(false);
  const [whatsAppMessage, setWhatsAppMessage] = useState<string>('');
  const [whatsAppTopic, setWhatsAppTopic] = useState<string>('general');

  // AI Chatbot States (Dr. Ananya AI Consultant)
  const [chatTab, setChatTab] = useState<'ai' | 'whatsapp'>('ai');
  const [aiInput, setAiInput] = useState<string>('');
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content: "Namaste! 🙏 I am Dr. Ananya Iyer, Head of Wellness at meONmode®. How may I guide your Ayurvedic hormone balance, PCOS relief, cycle regularity, or male vitality journey today?"
    }
  ]);

  // Auto scroll chat to bottom only when open
  useEffect(() => {
    if (showWhatsAppChat && chatEndRef.current) {
      requestAnimationFrame(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }, [aiMessages, isAiTyping, showWhatsAppChat, chatTab]);

  // Ensure checkout details are completely empty on mount so actual customers can type cleanly
  useEffect(() => {
    setCheckout({
      fullName: '',
      phone: '',
      address: '',
      pincode: ''
    });
  }, []);

  // Save checkout details to cookie when they change
  useEffect(() => {
    if (checkout.fullName || checkout.phone || checkout.address || checkout.pincode) {
      setCookie('meonmode_user_session', JSON.stringify(checkout), 7);
    }
  }, [checkout.fullName, checkout.phone, checkout.address, checkout.pincode]);

  // GA4 Recommended view_cart & begin_checkout tracking state
  const hasTrackedCartViewRef = useRef<boolean>(false);
  const hasTrackedBeginCheckoutRef = useRef<boolean>(false);

  useEffect(() => {
    if (currentView === 'cart') {
      if (!hasTrackedCartViewRef.current && cart.length > 0) {
        trackViewCart(cart, getCartTotal());
        hasTrackedCartViewRef.current = true;
      }
    } else {
      hasTrackedCartViewRef.current = false;
      hasTrackedBeginCheckoutRef.current = false;
    }
  }, [currentView, cart]);

  const handleCheckoutFieldFocus = () => {
    if (!hasTrackedBeginCheckoutRef.current && cart.length > 0) {
      hasTrackedBeginCheckoutRef.current = true;
      trackBeginCheckout(cart, getCartTotal());
    }
  };

  // Comprehensive Dynamic Head Metadata, Canonical URL, Open Graph & Twitter Tags Updater
  useEffect(() => {
    let seo = {
      title: "meONmode | Ayurvedic Wellness Products",
      description: "Discover authentic Ayurvedic wellness products by meONmode. Shop natural, herbal formulations for women and men including OVAIRA, FLOWELLE, ALPHAMAX, WANTMORE, and VAYUCORE with free shipping and Cash on Delivery across India.",
      canonicalUrl: "https://meonmode.com/",
      ogImage: "https://res.cloudinary.com/ukqeabxy/image/upload/v1789500041/07423c38-2e23-4015-8305-246530cbbbcf.png",
      robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    };

    const currentPath = location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
    if (currentView === 'home') {
      if (currentPath === '/women') {
        seo = {
          title: "Women's Ayurvedic Wellness Products | meONmode",
          description: "Explore meONmode Ayurvedic wellness solutions for women: OVAIRA Capsules for PCOS/PCOD and FLOWELLE Drink for cramp and flow balance. natural, free pan-India shipping.",
          canonicalUrl: "https://meonmode.com/women",
          ogImage: "https://res.cloudinary.com/ukqeabxy/image/upload/v1787512639/ChatGPT_Image_Jun_20_2026_10_28_24_PM.png",
          robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        };
      } else if (currentPath === '/men') {
        seo = {
          title: "Men's Ayurvedic Vitality & Performance | meONmode",
          description: "Discover meONmode Ayurvedic formulations for men: ALPHAMAX Capsules with Shudh Shilajit and WANTMORE Prash for endurance, vigor, and cellular energy with free shipping.",
          canonicalUrl: "https://meonmode.com/men",
          ogImage: "https://res.cloudinary.com/ukqeabxy/image/upload/v1787581402/ChatGPT_Image_Aug_24_2026_07_42_58_PM.png",
          robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        };
      } else if (currentPath === '/products') {
        seo = {
          title: "All Ayurvedic Products | meONmode Wellness",
          description: "Explore the complete catalogue of authentic Ayurvedic wellness products by meONmode for women and men, featuring free shipping and Cash on Delivery across India.",
          canonicalUrl: "https://meonmode.com/products",
          ogImage: "https://res.cloudinary.com/ukqeabxy/image/upload/v1789500041/07423c38-2e23-4015-8305-246530cbbbcf.png",
          robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        };
      } else if (currentPath === '/combos') {
        seo = {
          title: "Ayurvedic Wellness Combos | meONmode",
          description: "Shop meONmode synergistic Ayurvedic combos for women's hormonal balance and men's performance vitality with maximum savings and free pan-India delivery.",
          canonicalUrl: "https://meonmode.com/combos",
          ogImage: "https://res.cloudinary.com/ukqeabxy/image/upload/v1787512639/ChatGPT_Image_Jun_20_2026_10_28_24_PM.png",
          robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        };
      }
    } else if (currentView === 'detail' && selectedProduct) {
      const prodSeo = getProductSeoData(selectedProduct);
      seo = {
        title: prodSeo.title,
        description: prodSeo.description,
        canonicalUrl: prodSeo.canonicalUrl,
        ogImage: prodSeo.ogImage,
        robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      };
    } else if (currentView === 'blog') {
      seo = {
        title: "meONmode Ayurvedic Blog | Health & Wellness Tips in Hindi",
        description: "Read expert Ayurvedic health and wellness guides in Hindi on PCOD, PCOS, white discharge, men's stamina, gut health, and hormonal harmony.",
        canonicalUrl: "https://meonmode.com/blog",
        ogImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
        robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      };
    } else if (currentView === 'blog-article') {
      const formattedTitle = (selectedBlogSlug || '')
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      seo = {
        title: formattedTitle ? `${formattedTitle} | meONmode` : "Ayurvedic Health Article | meONmode",
        description: "Expert Ayurvedic health tips and wellness advice in Hindi from meONmode.",
        canonicalUrl: `https://meonmode.com/blog/${selectedBlogSlug || ''}`,
        ogImage: "https://res.cloudinary.com/ukqeabxy/image/upload/v1789500041/07423c38-2e23-4015-8305-246530cbbbcf.png",
        robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      };
    } else if (currentView === 'refund-policy') {
      seo = {
        title: "Refund & Return Policy | meONmode Ayurvedic Wellness",
        description: "Read meONmode's transparent return, replacement, and refund policies for authentic Ayurvedic wellness orders with unboxing video guidelines.",
        canonicalUrl: "https://meonmode.com/refund-policy",
        ogImage: "https://res.cloudinary.com/ukqeabxy/image/upload/v1789500041/07423c38-2e23-4015-8305-246530cbbbcf.png",
        robots: "index, follow"
      };
    } else if (currentView === 'shipping-policy') {
      seo = {
        title: "Shipping & Delivery Policy | meONmode Ayurvedic Wellness",
        description: "Learn about meONmode's 100% free pan-India shipping, discreet unbranded packaging, and fast 3-5 business day delivery.",
        canonicalUrl: "https://meonmode.com/shipping-policy",
        ogImage: "https://res.cloudinary.com/ukqeabxy/image/upload/v1789500041/07423c38-2e23-4015-8305-246530cbbbcf.png",
        robots: "index, follow"
      };
    } else if (currentView === 'privacy-policy') {
      seo = {
        title: "Privacy Policy & Data Security | meONmode Ayurvedic Wellness",
        description: "meONmode's strict privacy policy guarantees 100% confidential health consultations, 256-bit SSL encrypted checkout, and zero data sharing.",
        canonicalUrl: "https://meonmode.com/privacy-policy",
        ogImage: "https://res.cloudinary.com/ukqeabxy/image/upload/v1789500041/07423c38-2e23-4015-8305-246530cbbbcf.png",
        robots: "index, follow"
      };
    } else if (currentView === 'terms-and-conditions') {
      seo = {
        title: "Terms & Conditions | meONmode Ayurvedic Wellness",
        description: "Review the official terms, conditions, AYUSH-compliant Ayurvedic wellness product guidelines, and order policies for meONmode.",
        canonicalUrl: "https://meonmode.com/terms-and-conditions",
        ogImage: "https://res.cloudinary.com/ukqeabxy/image/upload/v1789500041/07423c38-2e23-4015-8305-246530cbbbcf.png",
        robots: "index, follow"
      };
    } else if (currentView === 'about') {
      seo = {
        title: "About Us | meONmode Ayurvedic Wellness",
        description: "Discover meONmode's mission to bring authentic, AYUSH-compliant Ayurvedic wellness, herbal purity, and hormonal balance to everyday lives.",
        canonicalUrl: "https://meonmode.com/about",
        ogImage: "https://res.cloudinary.com/ukqeabxy/image/upload/v1789500041/07423c38-2e23-4015-8305-246530cbbbcf.png",
        robots: "index, follow"
      };
    } else if (currentView === 'contact') {
      seo = {
        title: "Contact & Doctor Support | meONmode Ayurvedic Wellness",
        description: "Get in touch with meONmode Ayurvedic doctors and customer support desk via WhatsApp (+91 72908 10336) and email.",
        canonicalUrl: "https://meonmode.com/contact",
        ogImage: "https://res.cloudinary.com/ukqeabxy/image/upload/v1789500041/07423c38-2e23-4015-8305-246530cbbbcf.png",
        robots: "index, follow"
      };
    } else if (currentView === 'order-history') {
      seo = {
        title: "Track Your Order | meONmode Ayurvedic Wellness",
        description: "Track your meONmode Ayurvedic order status, delivery timeline, and shipment details.",
        canonicalUrl: "https://meonmode.com/",
        ogImage: "https://res.cloudinary.com/ukqeabxy/image/upload/v1789500041/07423c38-2e23-4015-8305-246530cbbbcf.png",
        robots: "noindex, follow"
      };
    } else if (currentView === 'not-found') {
      seo = {
        title: "404 - Page Not Found | meONmode Ayurvedic Wellness",
        description: "The requested page could not be found. Explore meONmode AYUSH-compliant Ayurvedic formulations.",
        canonicalUrl: "https://meonmode.com/",
        ogImage: "https://res.cloudinary.com/ukqeabxy/image/upload/v1789500041/07423c38-2e23-4015-8305-246530cbbbcf.png",
        robots: "noindex, nofollow"
      };
    }

    document.title = seo.title;

    const setMeta = (attrName: string, attrVal: string, contentVal: string) => {
      let el = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', contentVal);
    };

    const setLink = (rel: string, hrefVal: string, typeVal?: string, sizesVal?: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', hrefVal);
      if (typeVal) el.setAttribute('type', typeVal);
      if (sizesVal) el.setAttribute('sizes', sizesVal);
    };

    setMeta('name', 'description', seo.description);
    setMeta('name', 'title', seo.title);
    setMeta('name', 'robots', seo.robots);
    setLink('canonical', seo.canonicalUrl);

    // Ensure active favicon matches the official meONmode brand logo
    const officialFaviconUrl = "https://res.cloudinary.com/ukqeabxy/image/upload/w_48,h_48,c_fill,f_png/v1789500041/07423c38-2e23-4015-8305-246530cbbbcf.png";
    setLink('icon', officialFaviconUrl, 'image/png', '48x48');
    setLink('shortcut icon', officialFaviconUrl, 'image/png', '48x48');
    setLink('apple-touch-icon', "https://res.cloudinary.com/ukqeabxy/image/upload/w_180,h_180,c_fill,f_png/v1789500041/07423c38-2e23-4015-8305-246530cbbbcf.png", 'image/png', '180x180');

    // Open Graph
    setMeta('property', 'og:title', seo.title);
    setMeta('property', 'og:description', seo.description);
    setMeta('property', 'og:url', seo.canonicalUrl);
    setMeta('property', 'og:image', seo.ogImage);
    setMeta('property', 'og:site_name', 'meONmode');
    setMeta('property', 'og:type', currentView === 'blog-article' ? 'article' : 'website');

    // Twitter
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', seo.title);
    setMeta('name', 'twitter:description', seo.description);
    setMeta('name', 'twitter:image', seo.ogImage);
  }, [currentView, selectedProduct, selectedBlogSlug]);

  const handleSendAiMessage = async (customText?: string) => {
    const textToSend = customText || aiInput;
    if (!textToSend.trim()) return;

    const updatedMessages = [...aiMessages, { role: 'user' as const, content: textToSend }];
    setAiMessages(updatedMessages);
    if (!customText) setAiInput('');
    setIsAiTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages })
      });

      if (!res.ok) {
        throw new Error('Failed to fetch from wellness engine');
      }

      const data = await res.json();
      setAiMessages(prev => [...prev, { role: 'assistant' as const, content: data.response }]);
    } catch (err) {
      console.error("AI Consult Error:", err);
      // Fallback friendly message
      setAiMessages(prev => [
        ...prev,
        {
          role: 'assistant' as const,
          content: "Thank you for consulting. I'm experiencing a brief connection delay with our AI engine. Feel free to ask about our PCOS Combo Kit (₹1999), OVAIRA (₹1199) or FLOWELLE (₹999) prices, dosages, or unboxing policy, or select the WhatsApp tab to chat directly with our medical support desk!"
        }
      ]);
    } finally {
      setIsAiTyping(false);
    }
  };

  // Auto-switch to home view when user starts searching
  useEffect(() => {
    if (searchQuery.trim() !== '') {
      if (currentView !== 'home' && currentView !== 'success') {
        setCurrentView('home');
      }
    }
  }, [searchQuery]);

  // Auto scroll to top on view changes (skipped on first mount)
  const isFirstMountRef = useRef<boolean>(true);
  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedProduct]);

  // Reset active image index when selected product changes
  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedProduct?.id]);

  // Handle Share copy link
  const handleShareProduct = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const slug = getProductCleanSlug(product.id);
    const shareUrl = `https://meonmode.com/products/${slug}`;
    
    // Copy function
    const copyToClipboard = (text: string) => {
      if (navigator.clipboard) {
        return navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          document.body.removeChild(textArea);
          return Promise.resolve();
        } catch (err) {
          document.body.removeChild(textArea);
          return Promise.reject(err);
        }
      }
    };

    copyToClipboard(shareUrl)
      .then(() => {
        setShowToast(`Shared! Link for ${product.name} copied.`);
        setTimeout(() => setShowToast(null), 3500);
      })
      .catch((err) => {
        console.error("Failed to copy", err);
        setShowToast("Unable to copy link.");
        setTimeout(() => setShowToast(null), 3000);
      });
  };

  // Cart Functions
  const addToCart = (product: Product, quantity: number = 1) => {
    // GA4 Recommended add_to_cart Ecommerce Event
    trackAddToCart(product, quantity);

    setCart(prevCart => {
      const existing = prevCart.find(item => item.product.id === product.id);
      if (existing) {
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });

    // Trigger feedback toast
    setShowToast(`${product.name} added to cart!`);
    setTimeout(() => setShowToast(null), 3000);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prevCart => 
      prevCart.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartMrpTotal = () => {
    return cart.reduce((total, item) => total + (item.product.mrp * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Direct checkout
  const handleQuickBuy = (product: Product) => {
    // Add to cart if not already inside, then go to checkout
    const exists = cart.find(item => item.product.id === product.id);
    if (!exists) {
      addToCart(product, 1);
    }
    setCheckoutStep(1);
    setPaymentMethod('cod');
    setCurrentView('cart');

    // GA4 Recommended begin_checkout for direct quick-buy
    if (!hasTrackedBeginCheckoutRef.current) {
      hasTrackedBeginCheckoutRef.current = true;
      const checkoutItems = exists ? cart : [...cart, { product, quantity: 1 }];
      const checkoutTotal = exists ? getCartTotal() : getCartTotal() + product.price;
      trackBeginCheckout(checkoutItems, checkoutTotal);
    }
  };

  // Form Validation and WhatsApp Redirection
  const validateForm = () => {
    const errors: Partial<CheckoutDetails> = {};
    if (!checkout.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!checkout.phone.trim()) {
      errors.phone = 'Mobile Number is required';
    } else if (!/^\d{10}$/.test(checkout.phone.trim().replace(/[\s-+]/g, ''))) {
      errors.phone = 'Enter a valid 10-digit mobile number';
    }
    if (!checkout.address.trim()) errors.address = 'Complete Shipping Address is required';
    if (!checkout.pincode.trim()) {
      errors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(checkout.pincode.trim())) {
      errors.pincode = 'Enter a valid 6-digit Pincode';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (checkoutStep === 1) {
      if (!hasTrackedBeginCheckoutRef.current && cart.length > 0) {
        hasTrackedBeginCheckoutRef.current = true;
        trackBeginCheckout(cart, getCartTotal());
      }
      // GA4 Recommended add_shipping_info: Customer completes shipping/delivery details
      trackAddShippingInfo(cart, getCartTotal());
      setCheckoutStep(2);
      return;
    }

    if (checkoutStep === 2) {
      // GA4 Recommended add_payment_info: Customer confirms payment method selection
      trackAddPaymentInfo(cart, getCartTotal(), paymentMethod);
      if (paymentMethod === 'cod' && !codAcknowledged) {
        alert("Please accept the mandatory ₹150 advance payment policy for Cash on Delivery orders to proceed.");
        return;
      }
    }

    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      const payload = {
        items: cart.map(item => ({
          id: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price
        })),
        checkoutDetails: checkout,
        paymentMethod
      };

      const res = await fetch('/api/create-payment-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to initialize payment order.");
      }

      setPendingPaymentOrder(data);

      if (data.mode === 'razorpay') {
        const loaded = await loadRazorpayScript();
        if (loaded && (window as any).Razorpay) {
          const options = {
            key: data.keyId,
            amount: Math.round(data.amount * 100),
            currency: data.currency || 'INR',
            name: 'meONmode® Wellness',
            description: paymentMethod === 'cod' ? '₹150 COD Advance Payment' : 'Prepaid Order Payment',
            order_id: data.razorpayOrderId,
            prefill: {
              name: checkout.fullName,
              contact: checkout.phone
            },
            theme: {
              color: '#C86428'
            },
            handler: async (response: any) => {
              verifyPaymentOnServer({
                orderId: data.orderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              });
            },
            modal: {
              ondismiss: () => {
                setIsProcessingPayment(false);
                setPaymentError('Payment window was closed before completion. Order was NOT confirmed.');
              }
            }
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.on('payment.failed', (resp: any) => {
            setIsProcessingPayment(false);
            setPaymentError(`Payment Failed: ${resp.error?.description || 'Transaction declined by bank.'}`);
          });
          rzp.open();
          return;
        }
      }

      // Gateway / Reference Challenge Mode
      setShowGatewayModal(true);
      setIsProcessingPayment(false);

    } catch (err: any) {
      console.error("Checkout Payment Error:", err);
      setIsProcessingPayment(false);
      setPaymentError(err.message || "Payment initialization failed. Please try again.");
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setActiveImageIndex(0);
    setDetailQuantity(1);
    setHighlightedProductId(product.id);
    const isMen = MENS_PRODUCTS.some(m => m.id === product.id);
    setActiveCategory(isMen ? 'men' : 'women');
    
    navigateToView('detail', product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen text-[#FDFEFE] font-sans antialiased selection:bg-[#E5A93C] selection:text-[#4A1D05] transition-all duration-700 ${
      activeCategory === 'all'
        ? 'bg-gradient-to-b from-[#2B1B15] via-[#1C110D] to-[#120B09]'
        : activeCategory === 'men' 
          ? 'bg-gradient-to-b from-[#121212] via-[#0D0D0D] to-[#181818]' 
          : 'bg-gradient-to-b from-[#C86428] via-[#8B3B15] to-[#4A1D05]'
    }`}>
      
      {/* 100% Privacy Sticky Alert Bar */}
      <div className={`transition-all duration-500 text-center py-2 px-4 text-xs font-medium tracking-wide flex items-center justify-center gap-2 border-b border-white/10 ${
        activeCategory === 'all'
          ? 'bg-[#1F130E] text-[#E5A93C]'
          : activeCategory === 'men' 
            ? 'bg-[#1C1C1C] text-[#E5A93C]' 
            : 'bg-[#5C1D13] text-[#FDFEFE]'
      }`}>
        <Lock className="w-3.5 h-3.5 text-[#E5A93C]" />
        <span>{t('freeShipping')}</span>
      </div>

      {/* Global Navigation Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b border-white/10 px-4 py-3 shadow-lg transition-colors duration-500 ${
        activeCategory === 'all'
          ? 'bg-[#1C110D]/95 border-amber-500/15 shadow-amber-950/10'
          : activeCategory === 'men' 
            ? 'bg-[#0A0A0A]/95 border-amber-500/20 shadow-amber-950/5' 
            : 'bg-[#4A1D05]/90'
      }`}>
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-1 md:gap-3">
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            {currentView !== 'home' && (
              <button 
                id="back-button"
                onClick={() => {
                  if (currentView === 'success') {
                    setCart([]);
                    setCurrentView('home');
                  } else if (currentView === 'detail') {
                    setCurrentView('home');
                  } else if (currentView === 'cart') {
                    if (selectedProduct) {
                      setCurrentView('detail');
                    } else {
                      setCurrentView('home');
                    }
                  } else if (currentView === 'refund-policy') {
                    setCurrentView('home');
                  } else if (currentView === 'track-order') {
                    setCurrentView('home');
                  }
                }}
                className="p-1.5 rounded-full hover:bg-white/10 text-white hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out flex items-center justify-center cursor-pointer"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <a 
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentView !== 'success') {
                    setCurrentView('home');
                    navigate('/');
                  }
                }}
                className="text-left cursor-pointer inline-block"
                aria-label="meONmode Home"
              >
                <span className="font-serif text-lg md:text-2xl font-black tracking-wide text-white flex items-center gap-1">
                  meONmode<span className="text-[#E5A93C] text-[10px] md:text-sm align-super">®</span>
                </span>
                <span className="block text-[7px] md:text-[9px] tracking-[0.2em] uppercase text-[#E5A93C] font-semibold -mt-1 font-sans">
                  A y u r v e d i c &nbsp; W e l l n e s s
                </span>
              </a>
            </div>
          </div>

          {/* Real-time Search Bar */}
          <div 
            className="flex items-center flex-grow max-w-[180px] xs:max-w-[240px] sm:max-w-sm md:max-w-md lg:max-w-lg relative"
            onFocus={() => setSearchFocused(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setTimeout(() => setSearchFocused(false), 250);
              }
            }}
          >
            <span className="absolute left-2.5 text-white/40">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchFocused(true);
              }}
              onFocus={() => setSearchFocused(true)}
              className="w-full bg-black/30 border border-white/10 hover:border-white/20 focus:border-[#E5A93C] focus:ring-1 focus:ring-[#E5A93C] rounded-full pl-7.5 pr-7 py-1.5 text-[11px] md:text-xs text-white placeholder-white/40 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSearchCategory('All');
                }}
                className="absolute right-2 p-0.5 rounded-full text-white/40 hover:text-white/80 transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}

            {/* Real-time Search Dropdown with Category Filters */}
            {searchFocused && (
              <div 
                className="absolute top-full mt-2 left-0 right-0 w-full bg-neutral-900/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl z-50 p-3 space-y-3 text-left animate-fade-in"
                style={{ contentVisibility: 'auto' }}
              >
                {/* Category Selection Tab Pills */}
                <div className="space-y-1">
                  <span className="block text-[8px] uppercase font-bold text-[#E5A93C] font-mono tracking-wider">Filter by Type</span>
                  <div className="flex flex-wrap gap-1">
                    {(['All', 'Capsules', 'Syrups', 'Prash', 'Combos'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSearchCategory(cat);
                        }}
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                          searchCategory === cat
                            ? 'bg-[#E5A93C] text-neutral-950 border-[#E5A93C]'
                            : 'bg-white/5 text-white/80 border-white/5 hover:bg-white/10'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Match List */}
                <div className="space-y-1.5 max-h-[180px] overflow-y-auto custom-scrollbar">
                  <span className="block text-[8px] uppercase font-bold text-[#E5A93C] font-mono tracking-wider">Matching Remedies</span>
                  {(() => {
                    const allProductsList = Array.from(new Map([...womenProducts, ...menProducts].map(p => [p.id, p])).values());
                    const matched = allProductsList.filter(prod => {
                      // Filter by text search
                      const q = searchQuery.toLowerCase();
                      const matchesText = !q || 
                        prod.name.toLowerCase().includes(q) ||
                        prod.subtitle.toLowerCase().includes(q) ||
                        prod.shortDescription.toLowerCase().includes(q) ||
                        prod.longDescription.toLowerCase().includes(q) ||
                        prod.tag.toLowerCase().includes(q) ||
                        prod.benefits.some(b => b.toLowerCase().includes(q)) ||
                        prod.keyIngredients.some(i => i.name.toLowerCase().includes(q) || i.benefit.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));

                      if (!matchesText) return false;

                      // Filter by category
                      if (searchCategory !== 'All') {
                        const actualCat = getProductCategory(prod);
                        if (actualCat !== searchCategory) return false;
                      }

                      return true;
                    });

                    if (matched.length === 0) {
                      return (
                        <p className="text-[10px] text-neutral-400 py-2 text-center italic">
                          No matching remedies found.
                        </p>
                      );
                    }

                    return matched.map(prod => {
                      return (
                        <div
                          key={prod.id}
                          onClick={() => {
                            handleProductClick(prod);
                            setSearchFocused(false);
                            scrollToBuyingDetails();
                          }}
                          className="flex items-center gap-2 p-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#E5A93C]/20 transition-all cursor-pointer group"
                        >
                          <div className="w-7 h-7 rounded bg-gradient-to-br from-[#8B3B15] to-[#4A1D05] flex-shrink-0 flex items-center justify-center border border-white/10 overflow-hidden">
                            <img
                              src={optimizeCloudinaryUrl(prod.images && prod.images[0], 64)}
                              alt={prod.name}
                              loading="lazy"
                              decoding="async"
                              width="28"
                              height="28"
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = optimizeCloudinaryUrl('https://res.cloudinary.com/ukqeabxy/image/upload/v1787512639/ChatGPT_Image_Jun_20_2026_10_28_24_PM.png', 64);
                              }}
                            />
                          </div>
                          <div className="flex-grow min-w-0">
                            <h5 className="text-[10px] font-bold text-white truncate group-hover:text-[#E5A93C] transition-colors">{prod.name}</h5>
                            <p className="text-[8px] text-neutral-400 truncate">{getProductCategory(prod)} • ₹{prod.price}</p>
                          </div>
                          <ChevronRight className="w-3 h-3 text-neutral-500 group-hover:text-[#E5A93C] transition-colors" />
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            {/* Nav links for desktop */}
            <nav className="hidden lg:flex items-center gap-5 text-xs font-medium">
              <a 
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigateToView('home');
                }} 
                className={`transition-colors hover:text-[#E5A93C] cursor-pointer ${currentView === 'home' && activeCategory !== 'women' && activeCategory !== 'men' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
              >
                Home
              </a>

              <a 
                href="/women"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveCategory('women');
                  setCurrentView('home');
                  navigate('/women');
                }} 
                className={`transition-colors hover:text-[#E5A93C] cursor-pointer ${activeCategory === 'women' && currentView === 'home' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
              >
                Women
              </a>

              <a 
                href="/men"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveCategory('men');
                  setCurrentView('home');
                  navigate('/men');
                }} 
                className={`transition-colors hover:text-[#E5A93C] cursor-pointer ${activeCategory === 'men' && currentView === 'home' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
              >
                Men
              </a>

              <a 
                href="/blog"
                onClick={(e) => {
                  e.preventDefault();
                  navigateToView('blog');
                }} 
                className={`transition-colors hover:text-[#E5A93C] cursor-pointer flex items-center gap-1.5 ${currentView === 'blog' || currentView === 'blog-article' ? 'text-[#E8621A] font-extrabold' : 'text-white/80'}`}
              >
                <span>Blog</span>
                <span className="text-[9px] bg-[#E8621A] text-white px-1.5 py-0.2 rounded-full font-bold">Health Tips</span>
              </a>

              <a 
                href="/refund-policy"
                onClick={(e) => {
                  e.preventDefault();
                  navigateToView('refund-policy');
                }} 
                className={`transition-colors hover:text-[#E5A93C] cursor-pointer ${currentView === 'refund-policy' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
              >
                Return Policy
              </a>
              {activeCategory === 'all' ? (
                <>
                  <a 
                    href="/products/combo-kit"
                    onClick={(e) => {
                      e.preventDefault();
                      handleProductClick(PRODUCTS[0]);
                    }} 
                    className={`transition-colors hover:text-[#E5A93C] cursor-pointer ${selectedProduct?.id === 'combo-kit' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
                  >
                    Women's Combo
                  </a>
                  <a 
                    href="/products/mens-combo"
                    onClick={(e) => {
                      e.preventDefault();
                      handleProductClick(MENS_PRODUCTS[2]);
                    }} 
                    className={`transition-colors hover:text-[#E5A93C] cursor-pointer ${selectedProduct?.id === 'mens-combo' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
                  >
                    Men's Combo
                  </a>
                  <a 
                    href="/products/vayucore"
                    onClick={(e) => {
                      e.preventDefault();
                      const vayu = [...womenProducts, ...menProducts].find(p => p.id === 'vayucore');
                      if (vayu) handleProductClick(vayu);
                    }} 
                    className={`transition-colors hover:text-[#E5A93C] cursor-pointer ${selectedProduct?.id === 'vayucore' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
                  >
                    VAYUCORE
                  </a>
                </>
              ) : activeCategory === 'men' ? (
                <>
                  <a 
                    href="/products/mens-combo"
                    onClick={(e) => {
                      e.preventDefault();
                      handleProductClick(MENS_PRODUCTS[2]);
                    }} 
                    className={`transition-colors hover:text-[#E5A93C] cursor-pointer ${selectedProduct?.id === 'mens-combo' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
                  >
                    Men's Combo
                  </a>
                  <a 
                    href="/products/wantmore"
                    onClick={(e) => {
                      e.preventDefault();
                      handleProductClick(MENS_PRODUCTS[0]);
                    }} 
                    className={`transition-colors hover:text-[#E5A93C] cursor-pointer ${selectedProduct?.id === 'wantmore-men' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
                  >
                    WANTMORE Prash
                  </a>
                  <a 
                    href="/products/alphamax"
                    onClick={(e) => {
                      e.preventDefault();
                      handleProductClick(MENS_PRODUCTS[1]);
                    }} 
                    className={`transition-colors hover:text-[#E5A93C] cursor-pointer ${selectedProduct?.id === 'alphamax-men' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
                  >
                    ALPHAMAX
                  </a>
                  <a 
                    href="/products/vayucore"
                    onClick={(e) => {
                      e.preventDefault();
                      const vayu = [...womenProducts, ...menProducts].find(p => p.id === 'vayucore');
                      if (vayu) handleProductClick(vayu);
                    }} 
                    className={`transition-colors hover:text-[#E5A93C] cursor-pointer ${selectedProduct?.id === 'vayucore' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
                  >
                    VAYUCORE
                  </a>
                </>
              ) : (
                <>
                  <a 
                    href="/products/combo-kit"
                    onClick={(e) => {
                      e.preventDefault();
                      handleProductClick(PRODUCTS[0]);
                    }} 
                    className={`transition-colors hover:text-[#E5A93C] cursor-pointer ${selectedProduct?.id === 'combo-kit' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
                  >
                    Combo Kit
                  </a>
                  <a 
                    href="/products/ovaira"
                    onClick={(e) => {
                      e.preventDefault();
                      handleProductClick(PRODUCTS[1]);
                    }} 
                    className={`transition-colors hover:text-[#E5A93C] cursor-pointer ${selectedProduct?.id === 'ovaira' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
                  >
                    OVAIRA Capsules
                  </a>
                  <a 
                    href="/products/flowelle"
                    onClick={(e) => {
                      e.preventDefault();
                      handleProductClick(PRODUCTS[2]);
                    }} 
                    className={`transition-colors hover:text-[#E5A93C] cursor-pointer ${selectedProduct?.id === 'flowelle' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
                  >
                    FLOWELLE Syrup
                  </a>
                  <a 
                    href="/products/vayucore"
                    onClick={(e) => {
                      e.preventDefault();
                      const vayu = [...womenProducts, ...menProducts].find(p => p.id === 'vayucore');
                      if (vayu) handleProductClick(vayu);
                    }} 
                    className={`transition-colors hover:text-[#E5A93C] cursor-pointer ${selectedProduct?.id === 'vayucore' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
                  >
                    VAYUCORE
                  </a>
                </>
              )}
            </nav>



            {/* Cart Button */}
            <button 
              id="header-cart-btn"
              onClick={() => {
                if (currentView !== 'success') {
                  setCheckoutStep(1);
                  setPaymentMethod('cod');
                  navigateToView('cart');
                }
              }}
              className="relative p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center group cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4.5 h-4.5 text-white group-hover:text-[#E5A93C] transition-colors" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-[#E5A93C] text-[#4A1D05] text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center animate-pulse border border-[#4A1D05]">
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Dynamic Toast Feedback */}
      {showToast && (
        <div className="fixed bottom-6 right-6 left-6 md:left-auto md:max-w-sm z-50 bg-[#FDFEFE] text-[#4A1D05] py-3.5 px-4 rounded-xl shadow-2xl border border-[#E5A93C] flex items-center justify-between gap-3 animate-bounce">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-100 p-1 rounded-full text-emerald-600">
              <Check className="w-4 h-4" />
            </div>
            <p className="text-sm font-semibold">{showToast}</p>
          </div>
          <button 
            onClick={() => {
              setCheckoutStep(1);
              setPaymentMethod('cod');
              setCurrentView('cart');
              if (!hasTrackedBeginCheckoutRef.current && cart.length > 0) {
                hasTrackedBeginCheckoutRef.current = true;
                trackBeginCheckout(cart, getCartTotal());
              }
            }}
            className="text-xs bg-[#C86428] text-white py-1.5 px-3 rounded-lg font-bold hover:bg-[#8B3B15] transition-colors"
          >
            Checkout Now
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 py-6 md:py-10">

        {/* H1 SEO Heading */}
        <h1 className="font-serif text-center tracking-tight pb-3 mb-6 leading-tight flex flex-col items-center justify-center gap-1">
          <span className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight drop-shadow-md">
            meONmode<span className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl align-super font-bold ml-0.5">®</span>
          </span>
          <span className="text-white text-base sm:text-lg md:text-xl font-bold tracking-wide">
            Ayurvedic Wellness & Lifestyle Products
          </span>
        </h1>

        {/* ----------------- VIEW 1: HOME VIEW ----------------- */}
        {currentView === 'home' && (
          <div className="space-y-8">
            {/* JSON-LD Schema for Home View FAQs */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  "mainEntity": displayFAQs.map(faq => ({
                    "@type": "Question",
                    "name": faq.q,
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": faq.a
                    }
                  }))
                })
              }}
            />

            {/* Category Toggle Switch */}
            <div className="flex flex-col items-center justify-center space-y-2 mb-2">
              <span className="text-xs uppercase tracking-widest font-bold font-sans text-[#E5A93C]">
                Select Your Wellness Collection
              </span>
              <div className="inline-flex flex-wrap md:flex-nowrap justify-center p-1 rounded-3xl md:rounded-full bg-black/45 backdrop-blur-md border border-white/10 shadow-inner shadow-black/60 relative gap-1 md:gap-0">
                <a
                  href="/women"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveCategory('women');
                    navigate('/women');
                  }}
                  className={`relative z-10 px-5 md:px-7 py-2.5 rounded-full text-xs sm:text-sm font-extrabold tracking-wide uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                    activeCategory === 'women'
                      ? 'text-white shadow-lg bg-gradient-to-r from-[#C86428] to-[#8B3B15]'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span>👩</span>
                  <span>Women's</span>
                </a>
                <a
                  href="/men"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveCategory('men');
                    navigate('/men');
                  }}
                  className={`relative z-10 px-5 md:px-7 py-2.5 rounded-full text-xs sm:text-sm font-extrabold tracking-wide uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                    activeCategory === 'men'
                      ? 'text-white shadow-lg bg-gradient-to-r from-[#D4AF37] to-[#8A6D1C] border border-[#D4AF37]/25'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span>👨</span>
                  <span>Men's</span>
                </a>
                <a
                  href="/products"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveCategory('all');
                    navigate('/products');
                  }}
                  className={`relative z-10 px-5 md:px-7 py-2.5 rounded-full text-xs sm:text-sm font-extrabold tracking-wide uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                    activeCategory === 'all'
                      ? 'text-white shadow-lg bg-gradient-to-r from-[#8C5D3A] to-[#3B2314] border border-[#E5A93C]/25'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span>✨</span>
                  <span>All Products</span>
                </a>
              </div>
            </div>

            {activeCategory === 'all' ? (
              <React.Suspense fallback={<div className="min-h-[40vh] flex items-center justify-center text-[#E5A93C]"><div className="w-8 h-8 border-2 border-[#E5A93C] border-t-transparent rounded-full animate-spin"></div></div>}>
                <AllProductsPage
                  products={Array.from(new Map([...womenProducts, ...menProducts].map(p => [p.id, p])).values())}
                  onSelectProduct={handleProductClick}
                  onQuickBuy={handleQuickBuy}
                  onAddToCart={addToCart}
                  onBackToHome={() => setActiveCategory('women')}
                />
              </React.Suspense>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Modular Brand-First Hero (Neutral Gateway for All, Dedicated for Women/Men) */}
            <Hero
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              onQuickBuy={handleQuickBuy}
              onProductClick={handleProductClick}
              womenProducts={womenProducts}
              menProducts={menProducts}
              scrollToCatalog={() => {
                const catalogSec = document.getElementById('catalog-anchor');
                if (catalogSec) {
                  catalogSec.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.scrollTo({ top: window.innerHeight * 0.7, behavior: 'smooth' });
                }
              }}
              t={t}
            />

            {/* "What are you looking for?" Goal / Concern Navigator */}
            <ConcernSelector
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              onSelectProduct={(prod) => {
                handleProductClick(prod);
                scrollToBuyingDetails();
              }}
            />

            {/* Bento Block 4: Product Catalog Section (Col Span 12) */}
            <section id="catalog-anchor" className="lg:col-span-12 space-y-6 pt-4">
              <div className="text-center space-y-2 animate-fade-in">
                <span className="text-[#E5A93C] uppercase text-xs tracking-widest font-bold font-sans">
                  {activeCategory === 'all' ? "Unified Wellness Catalogue" : activeCategory === 'men' ? "Men's Wellness Catalogue" : "Our Treatment Catalogue"}
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-white">
                  {activeCategory === 'all' ? "Choose Your Healing Journey" : activeCategory === 'men' ? "Choose Your Vitality Protocol" : "Choose Your Wellness Protocol"}
                </h2>
                <p className="text-[#F7E7D9]/90 max-w-lg mx-auto text-sm">
                  {activeCategory === 'all'
                    ? "Restore physical vigor, elevate stamina, balance hormones, improve digestive health, and regularize your natural system with clinical-grade Ayurvedic formulations."
                    : activeCategory === 'men'
                      ? "Restore physical vigor, elevate stamina, and optimize cellular energy with clinical-grade Ayurvedic formulations."
                      : "Whether you need comprehensive restoration or targeted balance, choose our clinically verified herbal regimens."}
                </p>
              </div>

              {/* Dynamic Catalog Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                  <span className="text-xl">{activeCategory === 'all' ? "✨" : activeCategory === 'men' ? "👨" : "👩"}</span>
                  <h3 className="font-serif text-lg font-bold text-white tracking-wide">
                    {activeCategory === 'all' ? "Complete Ayurvedic Reset Protocol" : activeCategory === 'men' ? "Men's Vitality Protocol" : "Women's Hormonal Reset Protocol"}
                  </h3>
                </div>
                  
                {/* Grid of Product Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(() => {
                    const allUnique = Array.from(new Map([...womenProducts, ...menProducts].map(p => [p.id, p])).values());
                    const filteredProducts = (activeCategory === 'all' 
                      ? allUnique 
                      : activeCategory === 'men' 
                        ? menProducts 
                        : womenProducts
                    ).filter(prod => {
                      if (!searchQuery) return true;
                      const q = searchQuery.toLowerCase();
                      return prod.name.toLowerCase().includes(q) ||
                             prod.subtitle.toLowerCase().includes(q) ||
                             prod.shortDescription.toLowerCase().includes(q) ||
                             prod.longDescription.toLowerCase().includes(q) ||
                             prod.benefits.some(b => b.toLowerCase().includes(q));
                    });

                    if (filteredProducts.length === 0) {
                      return (
                        <div className="col-span-full py-16 px-4 text-center space-y-4 bg-white/5 border border-white/10 rounded-3xl animate-fade-in w-full">
                          <span className="text-4xl block">🔍</span>
                          <h4 className="font-serif text-xl font-bold text-white">No products match "{searchQuery}"</h4>
                          <p className="text-neutral-400 text-xs max-w-md mx-auto leading-relaxed">
                            We couldn't find any Ayurvedic remedies or combos matching your search. Try checking your spelling or search for "Combo", "Capsules", "Syrup", or ingredients like "Ashwagandha".
                          </p>
                          <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="bg-[#E5A93C] text-[#4A1D05] font-extrabold text-xs px-5 py-2.5 rounded-full hover:bg-[#C86428] hover:text-white transition-colors cursor-pointer"
                          >
                            Clear Search Filter
                          </button>
                        </div>
                      );
                    }

                    return filteredProducts.map((prod) => {
                      const isMen = isMenProduct(prod);
                      
                      return (
                      <div 
                        id={`product-card-${prod.id}`}
                        key={prod.id}
                        className={`bg-[#fdfbf7] text-neutral-900 border rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between transform transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${
                          selectedProduct?.id === prod.id || highlightedProductId === prod.id
                            ? 'ring-4 ring-[#E5A93C] scale-[1.02] border-[#E5A93C] shadow-[0_0_30px_rgba(229,169,60,0.4)] z-20'
                            : 'border-neutral-200/60'
                        }`}
                      >
                        {/* Top Image Section with Warm Alabaster Background */}
                        <div className="relative w-full h-auto overflow-hidden flex items-center justify-center bg-[#FAF8F6]/60 border-b border-neutral-100 p-4">
                          {prod.tag && (
                            <span className="absolute top-4 left-4 z-10 text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-sm tracking-wider bg-[#5C1D13] text-[#E5A93C] border border-[#E5A93C]/20 uppercase">
                              {prod.tag}
                            </span>
                          )}

                          {/* Floating Actions: Wishlist & Share */}
                          <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => toggleWishlist(prod, e)}
                              className={`p-2.5 rounded-full transition-all border shadow-sm hover:scale-110 active:scale-95 cursor-pointer ${
                                wishlist.includes(prod.id)
                                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                                  : 'bg-white/90 hover:bg-white text-neutral-600 hover:text-rose-600 border-neutral-200'
                              }`}
                              title={wishlist.includes(prod.id) ? "In Wishlist" : "Add to Wishlist"}
                              aria-label="Wishlist"
                            >
                              <Heart className={`w-4 h-4 ${wishlist.includes(prod.id) ? 'fill-rose-600 text-rose-600' : ''}`} />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => handleShareProduct(prod, e)}
                              className="p-2.5 bg-white/90 hover:bg-white text-neutral-800 hover:text-[#5C1D13] rounded-full transition-all border border-neutral-200 shadow-sm hover:scale-110 active:scale-95 cursor-pointer"
                              title="Share Product"
                              aria-label="Share Product"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <a
                            href={`/products/${getProductCleanSlug(prod.id)}`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleProductClick(prod);
                            }}
                            className="w-full focus:outline-none cursor-pointer overflow-hidden relative flex items-center justify-center group aspect-[4/3] sm:aspect-square max-h-56"
                            title={`Click to view pricing & details for ${prod.name}`}
                            aria-label={`View ${prod.name} details`}
                          >
                            <img 
                              src={optimizeCloudinaryUrl(prod.images && prod.images[0], 480)} 
                              srcSet={`${optimizeCloudinaryUrl(prod.images && prod.images[0], 360)} 360w, ${optimizeCloudinaryUrl(prod.images && prod.images[0], 480)} 480w, ${optimizeCloudinaryUrl(prod.images && prod.images[0], 640)} 640w, ${optimizeCloudinaryUrl(prod.images && prod.images[0], 960)} 960w`}
                              sizes="(max-width: 640px) 280px, (max-width: 1024px) 340px, 320px"
                              alt={prod.name}
                              loading="lazy"
                              decoding="async"
                              width="320"
                              height="240"
                              className="w-full h-full max-w-full object-contain block mx-auto p-2 transform transition-transform duration-500 ease-out group-hover:scale-105"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  const existingFallback = parent.querySelector('.card-fallback-overlay');
                                  if (existingFallback) {
                                    existingFallback.remove();
                                  }
                                  const overlay = document.createElement('div');
                                  overlay.className = "card-fallback-overlay absolute inset-0 flex flex-col justify-center items-center p-6 text-center text-neutral-800";
                                  let iconSvg = '';
                                  if (prod.id === 'combo-kit' || prod.id === 'mens-combo') {
                                    iconSvg = `<span class="p-3 bg-neutral-100 rounded-full text-[#C86428] mb-2 border border-neutral-200"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"></path></svg></span>`;
                                  } else if (prod.id === 'ovaira' || prod.id === 'alphamax-men') {
                                    iconSvg = `<span class="p-3 bg-neutral-100 rounded-full text-[#C86428] mb-2 border border-neutral-200"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l.707-.707m2.828 9.9a5 5 0 113.536 0V21h-3.536v-5.1z"></path></svg></span>`;
                                  } else {
                                    iconSvg = `<span class="p-3 bg-neutral-100 rounded-full text-[#C86428] mb-2 border border-neutral-200"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg></span>`;
                                  }
                                  overlay.innerHTML = `
                                    ${iconSvg}
                                    <h4 class="font-serif font-bold text-lg text-[#5C1D13]">${prod.volumeOrQty}</h4>
                                    <p class="text-[10px] uppercase tracking-widest text-neutral-500 mt-1 font-bold">meONmode Certified</p>
                                  `;
                                  parent.appendChild(overlay);
                                }
                              }}
                            />
                          </a>
                        </div>

                        {/* Product Detail & Content Area */}
                        <div className="p-6 flex-grow flex flex-col justify-between space-y-5">
                          
                          {/* Typography & Content Hierarchy */}
                          <div className="space-y-2">
                            {/* Gold Star Rating Block */}
                            <button
                              type="button"
                              onClick={() => setActiveReviewProduct(prod)}
                              className="flex items-center gap-1 text-neutral-800 hover:text-[#C86428] text-xs font-bold focus:outline-none transition-colors group cursor-pointer"
                              title="Click to view verified customer reviews"
                            >
                              <Star className="w-3.5 h-3.5 fill-[#E5A93C] text-[#E5A93C] group-hover:scale-110 transition-transform" />
                              {(() => {
                                const { rating, reviewsCount } = getProductRatingDetails(prod.id);
                                return (
                                  <span className="underline decoration-dotted decoration-[#E5A93C]/60 hover:decoration-solid">
                                    {rating.toFixed(1)} ({reviewsCount.toLocaleString('en-IN')} reviews)
                                  </span>
                                );
                              })()}
                            </button>

                            {/* Main Title: serif typography */}
                            <h3 className="font-serif text-xl md:text-2xl font-black text-neutral-950 tracking-tight leading-snug hover:text-[#5C1D13] transition-colors">
                              <a 
                                href={`/products/${getProductCleanSlug(prod.id)}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleProductClick(prod);
                                }}
                                className="hover:text-[#5C1D13] cursor-pointer"
                              >
                                {prod.name}
                              </a>
                            </h3>

                            {/* Subtitle: slightly tracked out uppercase sans-serif text */}
                            <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-neutral-500 mt-1">
                              {prod.subtitle} • {prod.volumeOrQty}
                            </p>

                            {/* Description: soft grey/dark text */}
                            <p className="text-xs md:text-sm text-neutral-600 leading-relaxed mt-2.5 line-clamp-3">
                              {prod.shortDescription}
                            </p>
                          </div>

                          {/* Pricing & Scarcity Layout */}
                          <div className="space-y-1.5 pt-1">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2.5 flex-wrap">
                                <span className="text-2xl md:text-3xl font-black text-neutral-950">
                                  ₹{prod.price.toLocaleString('en-IN')}
                                </span>
                                <span className="text-base font-bold line-through text-neutral-400">
                                  ₹{prod.mrp.toLocaleString('en-IN')}
                                </span>
                                <span className="text-xs font-extrabold px-3 py-1 rounded-full border border-red-200 bg-red-50 text-red-600">
                                  {Math.round(((prod.mrp - prod.price) / prod.mrp) * 100)}% Off
                                </span>
                              </div>
                              <p className="text-[10px] md:text-xs font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                                {t('inclusiveGst')}
                              </p>
                            </div>
                            
                            {/* Stock Alert */}
                            {(() => {
                              const stockInfo = getProductStockStatus(prod.id);
                              return (
                                <div className="flex items-center justify-between gap-1.5 mt-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="relative flex h-2 w-2">
                                      {stockInfo.status === 'low_stock' && (
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                      )}
                                      <span className={`relative inline-flex rounded-full h-2 w-2 ${stockInfo.status === 'low_stock' ? 'bg-red-500' : 'bg-neutral-400'}`}></span>
                                    </span>
                                    <span className={`text-[10px] font-black uppercase tracking-wider ${stockInfo.status === 'low_stock' ? 'text-red-600' : 'text-neutral-500'}`}>
                                      {stockInfo.text}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setNotifyMeProduct(prod)}
                                    className="text-[10px] font-extrabold text-[#C86428] hover:underline flex items-center gap-1 cursor-pointer"
                                  >
                                    <Bell className="w-3 h-3" /> Get Alert
                                  </button>
                                </div>
                              );
                            })()}
                          </div>

                          {/* FREE Personalized Diet Plan Trust Badge */}
                          <div className="bg-[#FAF6F0] border border-[#E5A93C]/40 rounded-xl p-2.5 flex items-center gap-2.5 text-left shadow-xs">
                            <span className="text-base shrink-0">🥗</span>
                            <div className="min-w-0">
                              <p className="text-[11px] font-extrabold text-[#4A1D05] leading-tight">
                                <span className="text-[#C86428] font-black uppercase text-[9px] bg-[#E5A93C]/20 px-1.5 py-0.5 rounded-md mr-1 inline-block">
                                  FREE BONUS
                                </span>
                                FREE Personalized Diet Plan based on your body type and weight
                              </p>
                            </div>
                          </div>

                          {/* Action Buttons Design & Alignment */}
                          {(() => {
                            const stockInfo = getProductStockStatus(prod.id);
                            if (stockInfo.status === 'out_of_stock') {
                              return (
                                <div className="space-y-2.5 pt-3 border-t border-neutral-100">
                                  <div className="grid grid-cols-2 gap-2.5">
                                    <a 
                                      href={`/products/${getProductCleanSlug(prod.id)}`}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleProductClick(prod);
                                      }}
                                      className="text-xs font-bold py-3 px-3.5 rounded-xl border border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50 hover:border-neutral-300 text-center cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5"
                                    >
                                      View Details
                                    </a>
                                    <button 
                                      disabled
                                      className="text-xs font-black py-3 px-3.5 rounded-xl bg-neutral-100 text-neutral-400 text-center cursor-not-allowed flex items-center justify-center gap-1.5"
                                    >
                                      Out of Stock
                                    </button>
                                  </div>
                                  
                                  <button 
                                    onClick={() => setNotifyMeProduct(prod)}
                                    className="w-full text-xs font-black py-3.5 px-4 rounded-xl bg-[#FAF6F0] border-2 border-[#C86428]/40 hover:border-[#C86428] text-[#C86428] hover:bg-[#C86428]/5 transition-all text-center flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 duration-200"
                                  >
                                    <Bell className="w-4 h-4 text-[#C86428]" />
                                    <span>Notify Me When Restocked</span>
                                  </button>
                                </div>
                              );
                            }
                            
                            return (
                              <div className="space-y-2.5 pt-3 border-t border-neutral-100">
                                {/* Row 1: Side by side View Details & Add to Cart */}
                                <div className="grid grid-cols-2 gap-2.5">
                                  <a 
                                    href={`/products/${getProductCleanSlug(prod.id)}`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleProductClick(prod);
                                    }}
                                    className="text-xs font-bold py-3 px-3.5 rounded-xl border border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50 hover:border-neutral-300 text-center cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5"
                                  >
                                    View Details
                                  </a>
                                  <button 
                                    onClick={() => addToCart(prod, 1)}
                                    className="text-xs font-black py-3 px-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-center cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/10"
                                  >
                                    Add to Cart
                                  </button>
                                </div>
                                
                                {/* Row 2: Full Width Quick Buy */}
                                <button 
                                  onClick={() => handleQuickBuy(prod)}
                                  className="w-full text-xs font-black py-3.5 px-4 rounded-xl bg-[#5C1D13] hover:bg-[#4A1D05] text-white transition-all text-center flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 shadow-[#5C1D13]/10 animate-breathe"
                                >
                                  <ShoppingBag className="w-4 h-4 text-white" />
                                  <span>Quick Buy (COD Available)</span>
                                </button>
                              </div>
                            );
                          })()}

                        </div>
                      </div>
                    );
                  })})()}
                </div>
              </div>
            </section>

            {/* Below-the-fold sections lazy-loaded smoothly on scroll */}
            <React.Suspense fallback={null}>
              <WhyOurFormulations />
              <WhyMeonmode />
              <IngredientTransparency category={activeCategory === 'men' ? 'men' : 'women'} />
              <HowItWorks />
              <BrandStory />
            </React.Suspense>

            {/* Bento Block 7: Dynamic Customer Reviews Section (Col Span 12) */}
            <React.Suspense fallback={null}>
              <CustomerReviewsSection
                activeCategory={activeCategory}
                currentReviews={currentReviews}
                setLightboxImage={setLightboxImage}
                setLightboxZoom={setLightboxZoom}
              />
            </React.Suspense>

            {/* Bento Block 8: FAQ Accordion (Col Span 12) */}
            <section className="lg:col-span-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-10 space-y-6 shadow-xl content-auto">
              <div className="text-center space-y-1">
                <h2 className="font-serif text-2xl md:text-3.5xl font-extrabold text-white">
                  {activeCategory === 'all' ? "Unified Ayurvedic Queries Answered" : activeCategory === 'men' ? "Wellness & Performance Queries Answered" : "Period Health Queries Answered"}
                </h2>
                <p className="text-[#F7E7D9]/80 text-xs sm:text-sm">Empowering you with complete, transparent Ayurvedic clinical facts.</p>
              </div>

              <div className="space-y-3 max-w-3xl mx-auto pt-4 border-t border-white/5">
                {displayFAQs.map((faq, idx) => (
                  <div 
                    key={idx}
                    className="border-b border-white/10 pb-3"
                  >
                    <button
                      onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                      className="w-full text-left font-serif font-bold text-sm md:text-base text-white hover:text-[#E5A93C] transition-colors flex justify-between items-center py-2"
                    >
                      <span>{faq.question}</span>
                      <span className="text-[#E5A93C] text-lg font-bold ml-2">
                        {activeFaq === idx ? '−' : '+'}
                      </span>
                    </button>
                    {activeFaq === idx && (
                      <p className="text-xs md:text-sm text-[#F7E7D9]/90 leading-relaxed mt-2 pl-1 font-sans">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Bento Block 9: SEO & Ayurvedic Wellness Knowledge Base */}
            <section className="lg:col-span-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-10 space-y-6 shadow-xl text-[#F7E7D9]/90 content-auto">
              <div className="space-y-2 border-b border-white/10 pb-4">
                <span className="text-[#E5A93C] uppercase text-xs tracking-widest font-bold font-sans">Ayurvedic Heritage & Modern Wellness</span>
                <h2 className="font-serif text-2xl md:text-3.5xl font-extrabold text-white">
                  Holistic Ayurvedic Wellness by meONmode®
                </h2>
              </div>

              <div className="space-y-4 text-xs md:text-sm leading-relaxed font-sans text-neutral-300">
                <p>
                  Welcome to <strong className="text-white font-semibold">meONmode®</strong>, India’s premier destination for science-backed Ayurvedic wellness and restorative lifestyle formulations. Rooted in ancient Vedic herbal wisdom and validated by modern pharmacological standardization, meONmode crafts natural, potent, and toxin-free formulations tailored specifically for modern men and women. Every remedy is produced using standardized extracts, rich in active phytochemicals, to harmonize vital doshas (Vata, Pitta, Kapha), rekindle metabolic vitality, and nurture long-term vitality.
                </p>

                <p>
                  Our flagship <strong className="text-[#E5A93C] font-semibold">Men’s Wellness Collection</strong> centers on two synergistic formulations: <strong className="text-white font-semibold">ALPHAMAX</strong> capsules and <strong className="text-white font-semibold">WANTMORE</strong> Prash. ALPHAMAX delivers an advanced cell-vitality and endurance matrix combining certified Grade-A Himalayan Shudh Shilajit (rich in fulvic acid and 84+ minerals), Ashwagandha, Safed Musli, Gokshura, and bioavailability enhancers to support physical vigor, healthy circulation, and everyday resilience. WANTMORE is an energizing, low-glycemic Ayurvedic Prash formulated for active stamina, muscular endurance, and rapid recovery without synthetic caffeine jitters or sugar spikes.
                </p>

                <p>
                  For women’s reproductive and endocrine balance, our <strong className="text-[#E5A93C] font-semibold">Women’s Health Collection</strong> features <strong className="text-white font-semibold">OVAIRA</strong> and <strong className="text-white font-semibold">FLOWELLE</strong>. OVAIRA is specifically designed to support hormonal balance, ovarian health, and uterine strength while addressing root causes of PCOS/PCOD, irregular periods, and stubborn cramping. Formulated with Shatavari, Lodhra, Ashoka, and Kanchnar Guggulu, it promotes natural menstrual rhythm and emotional equilibrium. FLOWELLE provides gentle botanical support for healthy menstrual volume, pelvic comfort, and vibrant daily energy.
                </p>

                <p>
                  For gut health and metabolic balance, our specialized remedy <strong className="text-white font-semibold">VAYUCORE</strong> provides an authentic 450 ML Ayurvedic digestive liquid formulation. Enriched with traditional carminative and hepatoprotective herbs like Triphala, Ajwain, Hing, and Jeera, VAYUCORE quickly relieves severe flatulence, chronic gastric distension, acid reflux, and heavy post-meal sluggishness by soothing the gastrointestinal lining and restoring natural digestive agni.
                </p>

                <p>
                  At meONmode, we make wellness accessible and completely transparent: enjoy <strong className="text-white font-semibold">100% Free Express Shipping</strong> across all PIN codes in India, flexible <strong className="text-white font-semibold">Cash on Delivery (COD)</strong> with no advance payment required, all prices inclusive of GST, and strictly <strong className="text-white font-semibold">100% Discreet & Private Packaging</strong> with zero external product names or markings to guarantee complete personal privacy.
                </p>
              </div>
            </section>
          </div>
        )}
        </div>
      )}

        {/* ----------------- VIEW 2: PRODUCT DETAIL VIEW ----------------- */}
        {currentView === 'detail' && currentProduct && (
          <React.Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-[#E5A93C]"><div className="w-8 h-8 border-2 border-[#E5A93C] border-t-transparent rounded-full animate-spin"></div></div>}>
            <ProductDetail
              product={currentProduct}
              onBack={() => {
                setCurrentView('home');
                navigate('/');
              }}
              onAddToCart={addToCart}
              onQuickBuy={handleQuickBuy}
              onProductClick={handleProductClick}
              onWriteReview={(prodId) => {
                setWriteReviewProductId(prodId);
                setIsWriteReviewOpen(true);
              }}
              onNotifyMe={(prod) => setNotifyMeProduct(prod)}
              wishlist={wishlist}
              onToggleWishlist={toggleWishlist}
              onShare={handleShareProduct}
              onOpenLightbox={(img) => {
                setLightboxImage(img);
                setLightboxZoom(false);
              }}
              currentReviews={currentReviews}
              womenProducts={womenProducts}
              menProducts={menProducts}
              getProductRatingDetails={getProductRatingDetails}
              getProductStockStatus={getProductStockStatus}
              t={t}
              optimizeCloudinaryUrl={optimizeCloudinaryUrl}
              getProductCleanSlug={getProductCleanSlug}
            />
          </React.Suspense>
        )}

        {/* ----------------- VIEW 3: SHOPPING CART & CHECKOUT VIEW ----------------- */}
        {currentView === 'cart' && (
          <React.Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-[#E5A93C]"><div className="w-8 h-8 border-2 border-[#E5A93C] border-t-transparent rounded-full animate-spin"></div></div>}>
            <CartCheckoutView
              cart={cart}
              translatedCart={translatedCart}
              getCartTotal={getCartTotal}
              getCartMrpTotal={getCartMrpTotal}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              checkout={checkout}
              setCheckout={setCheckout}
              checkoutStep={checkoutStep}
              setCheckoutStep={setCheckoutStep}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              codAcknowledged={codAcknowledged}
              setCodAcknowledged={setCodAcknowledged}
              dismissedBanner={dismissedBanner}
              setDismissedBanner={setDismissedBanner}
              isProcessingPayment={isProcessingPayment}
              paymentError={paymentError}
              formErrors={formErrors}
              setFormErrors={setFormErrors}
              handleCheckoutFieldFocus={handleCheckoutFieldFocus}
              handleCheckoutSubmit={handleCheckoutSubmit}
              validateForm={validateForm}
              setCurrentView={setCurrentView}
              t={t}
              trackAddShippingInfo={trackAddShippingInfo}
              trackAddPaymentInfo={trackAddPaymentInfo}
              trackBeginCheckout={trackBeginCheckout}
              hasTrackedBeginCheckoutRef={hasTrackedBeginCheckoutRef}
            />
          </React.Suspense>
        )}

        {/* SECURE PAYMENT GATEWAY & VERIFICATION MODAL */}
        {showGatewayModal && pendingPaymentOrder && (
          <React.Suspense fallback={null}>
            <PaymentGatewayModal
              pendingPaymentOrder={pendingPaymentOrder}
              setShowGatewayModal={setShowGatewayModal}
              setPaymentError={setPaymentError}
              paymentRefInput={paymentRefInput}
              setPaymentRefInput={setPaymentRefInput}
              isProcessingPayment={isProcessingPayment}
              verifyPaymentOnServer={verifyPaymentOnServer}
            />
          </React.Suspense>
        )}

        {/* ----------------- VIEW 4: ORDER SUCCESS VIEW ----------------- */}
        {currentView === 'success' && (
          <React.Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-[#E5A93C]"><div className="w-8 h-8 border-2 border-[#E5A93C] border-t-transparent rounded-full animate-spin"></div></div>}>
            <OrderSuccessView
              lastVerifiedOrder={lastVerifiedOrder}
              lastOrderId={lastOrderId}
              paymentMethod={paymentMethod}
              checkout={checkout}
              translatedCart={translatedCart}
              getCartTotal={getCartTotal}
              triggerWhatsAppConfirmation={triggerWhatsAppConfirmation}
              setCart={setCart}
              setCurrentView={setCurrentView}
              setShowToast={setShowToast}
              t={t}
            />
          </React.Suspense>
        )}
        {/* ----------------- VIEW 5: REFUND & RETURN POLICY VIEW ----------------- */}
        {currentView === 'refund-policy' && (
          <React.Suspense fallback={null}>
            <RefundPolicyView onBackToHome={() => navigateToView('home')} />
          </React.Suspense>
        )}

        {/* ----------------- VIEW 5B: SHIPPING POLICY VIEW ----------------- */}
        {currentView === 'shipping-policy' && (
          <React.Suspense fallback={null}>
            <ShippingPolicyView onBackToHome={() => navigateToView('home')} />
          </React.Suspense>
        )}

        {/* ----------------- VIEW 5C: PRIVACY POLICY VIEW ----------------- */}
        {currentView === 'privacy-policy' && (
          <React.Suspense fallback={null}>
            <PrivacyPolicyView onBackToHome={() => navigateToView('home')} />
          </React.Suspense>
        )}

        {/* ----------------- VIEW 5D: TERMS AND CONDITIONS VIEW ----------------- */}
        {currentView === 'terms-and-conditions' && (
          <React.Suspense fallback={null}>
            <TermsAndConditionsView onBackToHome={() => navigateToView('home')} />
          </React.Suspense>
        )}

        {/* ----------------- VIEW 5E: ABOUT US VIEW ----------------- */}
        {currentView === 'about' && (
          <React.Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-[#E5A93C]"><div className="w-8 h-8 border-2 border-[#E5A93C] border-t-transparent rounded-full animate-spin"></div></div>}>
            <AboutUsPage
              onBackToHome={() => navigateToView('home')}
              onNavigateToView={navigateToView}
              onSelectProduct={(product) => {
                setSelectedProduct(product);
                navigateToView('detail');
              }}
              products={[...PRODUCTS, ...MENS_PRODUCTS, VAYUCORE_PRODUCT]}
            />
          </React.Suspense>
        )}

        {/* ----------------- VIEW 5F: CONTACT US VIEW ----------------- */}
        {currentView === 'contact' && (
          <div className="max-w-3xl mx-auto space-y-8 py-4 animate-fade-in text-left">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <button
                onClick={() => navigateToView('home')}
                className="p-2 hover:bg-white/10 rounded-full text-white transition-colors flex items-center justify-center cursor-pointer"
                aria-label="Back to home"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="font-serif text-3xl font-extrabold text-white">Contact & Support</h1>
                <p className="text-[#E5A93C] text-xs font-semibold tracking-wider uppercase mt-1">meONmode Dedicated Doctor & Customer Care Desk</p>
              </div>
            </div>

            <div className="space-y-6 text-sm text-white/90 leading-relaxed bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
              <p className="text-white/80">
                Have questions about your order, dosages, or want a confidential Ayurvedic health consultation with Dr. Ananya Iyer? Our support team is here to assist you.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <a 
                  href="https://api.whatsapp.com/send?phone=917290810336&text=Hello%20meONmode%20Team%2C%20I%20have%20a%20query%20about%20my%20wellness%20order." 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-emerald-600/25 hover:bg-emerald-600/35 border border-emerald-500/30 p-4 rounded-2xl flex items-center gap-3 text-white font-semibold text-xs transition-colors"
                >
                  <span className="text-2xl">💬</span>
                  <div>
                    <div className="text-emerald-400 font-bold text-sm">WhatsApp Support</div>
                    <div>+91 72908 10336</div>
                  </div>
                </a>

                <a 
                  href="mailto:meonmodewellness@gmail.com" 
                  className="bg-blue-600/25 hover:bg-blue-600/35 border border-blue-500/30 p-4 rounded-2xl flex items-center gap-3 text-white font-semibold text-xs transition-colors"
                >
                  <span className="text-2xl">✉️</span>
                  <div>
                    <div className="text-blue-400 font-bold text-sm">Email Care Desk</div>
                    <div>meonmodewellness@gmail.com</div>
                  </div>
                </a>
              </div>

              <div className="pt-2 text-xs text-white/60">
                <strong>Support Hours:</strong> Monday – Saturday, 9:30 AM – 7:30 PM IST.
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => navigateToView('home')}
                className="bg-gradient-to-r from-[#C86428] to-[#E5A93C] text-white font-extrabold text-sm py-3.5 px-8 rounded-xl shadow-lg active:scale-95 transition-all duration-200 cursor-pointer"
              >
                Return to Shop
              </button>
            </div>
          </div>
        )}

        {/* ----------------- VIEW 5G: NOT FOUND (404) VIEW ----------------- */}
        {currentView === 'not-found' && (
          <div className="max-w-xl mx-auto space-y-6 py-12 px-4 animate-fade-in text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-[#E5A93C]/10 border border-[#E5A93C]/30 flex items-center justify-center text-4xl shadow-inner">
              🌿
            </div>
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold tracking-widest text-[#E5A93C] uppercase bg-[#E5A93C]/10 px-3 py-1 rounded-full border border-[#E5A93C]/20">
                404 • Page Not Found
              </span>
              <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-white">
                Looking for Holistic Healing?
              </h1>
              <p className="text-sm text-white/70 max-w-md mx-auto leading-relaxed">
                The page or product you requested cannot be found or may have been updated. Explore our authentic AYUSH-compliant Ayurvedic formulations below.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigateToView('home')}
                className="w-full sm:w-auto bg-gradient-to-r from-[#C86428] to-[#E5A93C] text-white font-extrabold text-sm py-3.5 px-8 rounded-xl shadow-lg active:scale-95 transition-all duration-200 cursor-pointer"
              >
                Back to Home / Shop
              </button>
              <button
                onClick={() => navigateToView('blog')}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white font-bold text-sm py-3.5 px-6 rounded-xl border border-white/10 transition-all duration-200 cursor-pointer"
              >
                Read Wellness Blog
              </button>
            </div>
          </div>
        )}

        {/* ----------------- VIEW 6: ORDER HISTORY & PAYMENT VERIFICATION VIEW ----------------- */}
        {currentView === 'order-history' && (
          <React.Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-[#E5A93C]"><div className="w-8 h-8 border-2 border-[#E5A93C] border-t-transparent rounded-full animate-spin"></div></div>}>
            <OrderHistoryView
              orderHistoryPhoneInput={orderHistoryPhoneInput}
              setOrderHistoryPhoneInput={setOrderHistoryPhoneInput}
              orderHistoryOrders={orderHistoryOrders}
              setOrderHistoryOrders={setOrderHistoryOrders}
              isLoadingOrderHistory={isLoadingOrderHistory}
              orderHistorySearchError={orderHistorySearchError}
              selectedInvoiceModalOrder={selectedInvoiceModalOrder}
              setSelectedInvoiceModalOrder={setSelectedInvoiceModalOrder}
              handleLookupOrdersByPhone={handleLookupOrdersByPhone}
              lastVerifiedOrder={lastVerifiedOrder}
              orderHistory={orderHistory}
              onBackToHome={() => navigateToView('home')}
            />
          </React.Suspense>
        )}

        {/* ----------------- VIEW 7: BLOG LISTING VIEW ----------------- */}
        {currentView === 'blog' && (
          <React.Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-[#E5A93C]"><div className="w-8 h-8 border-2 border-[#E5A93C] border-t-transparent rounded-full animate-spin"></div></div>}>
            <BlogListing
              onSelectArticle={(slug) => navigateToView('blog-article', undefined, slug)}
              onGoHome={() => navigateToView('home')}
              onSelectProduct={(product) => navigateToView('detail', product)}
            />
          </React.Suspense>
        )}

        {/* ----------------- VIEW 8: BLOG ARTICLE DETAIL VIEW ----------------- */}
        {currentView === 'blog-article' && (
          <React.Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-[#E5A93C]"><div className="w-8 h-8 border-2 border-[#E5A93C] border-t-transparent rounded-full animate-spin"></div></div>}>
            <BlogArticleView
              slug={selectedBlogSlug}
              onGoBackToBlog={() => navigateToView('blog')}
              onSelectArticle={(slug) => navigateToView('blog-article', undefined, slug)}
              onSelectProduct={(product) => navigateToView('detail', product)}
              onAddToCart={(product) => {
                addToCart(product);
                showToastNotification(`Added ${product.name} to Cart`);
              }}
            />
          </React.Suspense>
        )}

      </main>

      {/* Global Bottom Trust Seals */}
      <footer className="bg-black/40 border-t border-white/10 mt-16 py-12 px-4 text-center space-y-6 content-auto">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-[#F7E7D9]/80 text-xs">
          <div className="space-y-1 bg-[#4A1D05]/30 p-4 rounded-xl border border-white/5">
            <span className="font-serif block text-sm font-bold text-white">AYUSH Ministry</span>
            <p className="text-[10px]">100% compliant traditional Shastras & formulations.</p>
          </div>
          <div className="space-y-1 bg-[#4A1D05]/30 p-4 rounded-xl border border-white/5">
            <span className="font-serif block text-sm font-bold text-white">GMP Certified</span>
            <p className="text-[10px]">Hygiene standards maintained at clean medical centers.</p>
          </div>
          <div className="space-y-1 bg-[#4A1D05]/30 p-4 rounded-xl border border-white/5">
            <span className="font-serif block text-sm font-bold text-white">Zero Hormones</span>
            <p className="text-[10px]">No chemical steroids, pure plant-based bioactives only.</p>
          </div>
          <div className="space-y-1 bg-[#4A1D05]/30 p-4 rounded-xl border border-white/5">
            <span className="font-serif block text-sm font-bold text-white">Privacy Packed</span>
            <p className="text-[10px]">Completely unmarked plain brown corrugated outer boxes.</p>
          </div>
        </div>

        {/* Health Tips Footer Section */}
        <div className="max-w-4xl mx-auto border-t border-white/10 pt-6 pb-2 text-left space-y-3">
          <h4 className="font-serif text-sm font-bold text-[#E5A93C] uppercase tracking-wider text-center md:text-left">
            Popular Health Tips & Guides (Hindi)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs text-white/80">
            <a 
              href="/blog/pcos-kya-hai-pcod-se-alag"
              onClick={(e) => {
                e.preventDefault();
                navigateToView('blog-article', undefined, 'pcos-kya-hai-pcod-se-alag');
              }}
              className="hover:text-[#E5A93C] hover:underline text-left cursor-pointer truncate block"
            >
              • PCOS Kya Hai? PCOD Se Kaise Alag Hai
            </a>
            <a 
              href="/blog/white-discharge-shwet-pradar-ayurvedic"
              onClick={(e) => {
                e.preventDefault();
                navigateToView('blog-article', undefined, 'white-discharge-shwet-pradar-ayurvedic');
              }}
              className="hover:text-[#E5A93C] hover:underline text-left cursor-pointer truncate block"
            >
              • White Discharge (Safed Pani) Ayurvedic Ilaj
            </a>
            <a 
              href="/blog/pcod-diet-plan-hindi"
              onClick={(e) => {
                e.preventDefault();
                navigateToView('blog-article', undefined, 'pcod-diet-plan-hindi');
              }}
              className="hover:text-[#E5A93C] hover:underline text-left cursor-pointer truncate block"
            >
              • PCOD & PCOS Diet Plan Hindi
            </a>
            <a 
              href="/blog/wantmore-ingredient-guide"
              onClick={(e) => {
                e.preventDefault();
                navigateToView('blog-article', undefined, 'wantmore-ingredient-guide');
              }}
              className="hover:text-[#E5A93C] hover:underline text-left cursor-pointer truncate block"
            >
              • WANTMORE Prash Ingredient Guide
            </a>
            <a 
              href="/blog/alphamax-ingredient-guide"
              onClick={(e) => {
                e.preventDefault();
                navigateToView('blog-article', undefined, 'alphamax-ingredient-guide');
              }}
              className="hover:text-[#E5A93C] hover:underline text-left cursor-pointer truncate block"
            >
              • ALPHAMAX 6 Bioactive Herbs Guide
            </a>
            <a 
              href="/blog/ashwagandha-vs-shilajit"
              onClick={(e) => {
                e.preventDefault();
                navigateToView('blog-article', undefined, 'ashwagandha-vs-shilajit');
              }}
              className="hover:text-[#E5A93C] hover:underline text-left cursor-pointer truncate block"
            >
              • Ashwagandha vs Shilajit for Men
            </a>
            <a 
              href="/blog/vayucore-ingredient-guide"
              onClick={(e) => {
                e.preventDefault();
                navigateToView('blog-article', undefined, 'vayucore-ingredient-guide');
              }}
              className="hover:text-[#E5A93C] hover:underline text-left cursor-pointer truncate block"
            >
              • VAYUCORE Gut Health & Digestion
            </a>
            <a 
              href="/blog/shatavari-in-ayurveda"
              onClick={(e) => {
                e.preventDefault();
                navigateToView('blog-article', undefined, 'shatavari-in-ayurveda');
              }}
              className="hover:text-[#E5A93C] hover:underline text-left cursor-pointer truncate block"
            >
              • Shatavari in Ayurveda: Female Rasayana
            </a>
            <a 
              href="/blog"
              onClick={(e) => {
                e.preventDefault();
                navigateToView('blog');
              }}
              className="text-[#E8621A] font-bold hover:underline text-left cursor-pointer block"
            >
              • Saare 32 Articles Dekhein (meonmode.com/blog) →
            </a>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-[11px] text-neutral-400 max-w-2xl mx-auto space-y-3">
          {/* Social Media Sharing & Connect Buttons */}
          <div className="space-y-3 mb-6">
            <p className="text-xs uppercase tracking-widest font-bold text-[#E5A93C]">Connect & Share with meONmode®</p>
            <div className="flex flex-wrap justify-center items-center gap-3">
              <a 
                href="https://instagram.com/meonmode_" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#E5A93C]/10 hover:bg-[#E5A93C]/20 border border-[#E5A93C]/30 text-[#E5A93C] font-extrabold text-xs px-4 py-2.5 rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
                title="Follow meONmode on Instagram"
              >
                <Instagram className="w-4 h-4 text-[#E5A93C]" />
                <span>Instagram</span>
              </a>
              <a 
                href="https://api.whatsapp.com/send?text=Discover%20authentic%20Ayurvedic%20wellness%20products%20at%20meONmode%20with%20Free%20Shipping%20and%20COD%3A%20https%3A%2F%2Fmeonmode.com%2F" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-extrabold text-xs px-4 py-2.5 rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
                title="Share meONmode on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Share on WhatsApp</span>
              </a>
              <a 
                href="https://facebook.com/meonmode" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#E5A93C]/10 hover:bg-[#E5A93C]/20 border border-[#E5A93C]/30 text-[#E5A93C] font-extrabold text-xs px-4 py-2.5 rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
                title="Follow meONmode on Facebook"
              >
                <Facebook className="w-4 h-4 text-[#E5A93C]" />
                <span>Facebook</span>
              </a>
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-xs text-[#E5A93C] font-semibold mb-2">
            <a 
              href="/refund-policy"
              onClick={(e) => {
                e.preventDefault();
                navigateToView('refund-policy');
              }} 
              className="hover:underline cursor-pointer"
            >
              Refund & Return Policy
            </a>
            <span className="text-white/20">•</span>
            <a 
              href="/shipping-policy"
              onClick={(e) => {
                e.preventDefault();
                navigateToView('shipping-policy');
              }} 
              className="hover:underline cursor-pointer"
            >
              Shipping Policy
            </a>
            <span className="text-white/20">•</span>
            <a 
              href="/privacy-policy"
              onClick={(e) => {
                e.preventDefault();
                navigateToView('privacy-policy');
              }} 
              className="hover:underline cursor-pointer"
            >
              Privacy Policy
            </a>
            <span className="text-white/20">•</span>
            <a 
              href="/terms-and-conditions"
              onClick={(e) => {
                e.preventDefault();
                navigateToView('terms-and-conditions');
              }} 
              className="hover:underline cursor-pointer"
            >
              Terms & Conditions
            </a>
            <span className="text-white/20">•</span>
            <a 
              href="/about"
              onClick={(e) => {
                e.preventDefault();
                navigateToView('about');
              }} 
              className="hover:underline cursor-pointer"
            >
              About Us
            </a>
            <span className="text-white/20">•</span>
            <a 
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                navigateToView('contact');
              }} 
              className="hover:underline cursor-pointer"
            >
              Contact Support
            </a>
            <span className="text-white/20">•</span>
            <a 
              href="/orders"
              onClick={(e) => {
                e.preventDefault();
                navigateToView('order-history');
              }} 
              className="hover:underline cursor-pointer flex items-center gap-1.5"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Order History & Verification</span>
            </a>
          </div>
          <p>© 2026 meONmode® Ayurvedic Wellness. All rights reserved.</p>
          <p className="leading-relaxed">
            Disclaimer: Ayurveda is a holistic approach. While our therapeutic claims are supported by ancient texts and clinical audits of selected herbs, individual results can fluctuate depending on underlying health conditions (e.g. chronic metabolic blockages). Consult your Ayurvedic physician.
          </p>
        </div>
      </footer>

      {/* Floating Interactive Chat Desk (meONmode® AI Doctor & WhatsApp Desk) */}
      <React.Suspense fallback={null}>
        <WhatsAppDeskModal
          showWhatsAppChat={showWhatsAppChat}
          setShowWhatsAppChat={setShowWhatsAppChat}
          lastOrderId={lastOrderId}
        />
      </React.Suspense>

      {/* ----------------- MODALS & LIGHTBOX (LAZY LOADED) ----------------- */}
      <React.Suspense fallback={null}>
        {activeReviewProduct && (
          <ProductReviewsModal
            activeReviewProduct={activeReviewProduct}
            onClose={() => setActiveReviewProduct(null)}
            currentReviews={currentReviews}
            getProductRatingDetails={getProductRatingDetails}
            onOpenWriteReview={(prodId) => {
              setWriteReviewProductId(prodId);
              setIsWriteReviewOpen(true);
            }}
            setLightboxImage={setLightboxImage}
            setLightboxZoom={setLightboxZoom}
          />
        )}

        {notifyMeProduct && (
          <RestockModal
            product={notifyMeProduct}
            onClose={() => setNotifyMeProduct(null)}
          />
        )}

        {isWriteReviewOpen && (
          <WriteReviewModal
            isOpen={isWriteReviewOpen}
            onClose={() => setIsWriteReviewOpen(false)}
            productId={writeReviewProductId}
            onAddReview={(newRev) => setAllReviews(prev => [newRev, ...prev])}
          />
        )}

        {lightboxImage && (
          <ReviewCanvasLightbox
            image={lightboxImage}
            zoom={lightboxZoom}
            onToggleZoom={() => setLightboxZoom(!lightboxZoom)}
            onClose={() => {
              setLightboxImage(null);
              setLightboxZoom(false);
            }}
          />
        )}
      </React.Suspense>

    </div>
  );
}
