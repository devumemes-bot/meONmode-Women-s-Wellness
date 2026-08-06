/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  ChevronRight, 
  ChevronLeft,
  Star, 
  ArrowLeft, 
  Plus, 
  Minus, 
  Trash2, 
  Lock, 
  Check, 
  ShieldCheck, 
  Activity, 
  Heart, 
  Sparkles,
  Droplet,
  Flame,
  HelpCircle,
  Clock,
  Send,
  Leaf,
  Share2,
  Copy,
  MessageSquare,
  MessageCircle,
  Facebook,
  Instagram,
  Search,
  X,
  Truck,
  Package,
  Calendar,
  MapPin,
  Clipboard,
  Bell,
  Pill,
  Flower2
} from 'lucide-react';
import { PRODUCTS, MENS_PRODUCTS, TESTIMONIALS, FAQS, MENS_TESTIMONIALS, MENS_FAQS, reviews, CustomerReview, reviewImages } from './data';
import { Product, CartItem, ViewType, CheckoutDetails } from './types';
import { motion } from 'motion/react';
import { UI_TRANSLATIONS, getTranslatedProducts, getTranslatedFAQs, getTranslatedTestimonials, getTranslatedReviews } from './translations';

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

  // Language switcher state
  const [lang, setLang] = useState<'en' | 'hi'>(() => {
    const saved = localStorage.getItem('meonmode-lang');
    return (saved === 'hi' ? 'hi' : 'en');
  });

  useEffect(() => {
    localStorage.setItem('meonmode-lang', lang);
  }, [lang]);



  // Navigation & Cart States
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'women' | 'men' | 'all'>('women');
  const [activeReviewProduct, setActiveReviewProduct] = useState<Product | null>(null);

  // Centralized Reviews Database State (Persisted in LocalStorage)
  const [allReviews, setAllReviews] = useState<CustomerReview[]>(() => {
    try {
      const saved = localStorage.getItem('meonmode_reviews');
      return saved ? JSON.parse(saved) : reviews;
    } catch (e) {
      return reviews;
    }
  });

  // Auto-save reviews
  useEffect(() => {
    localStorage.setItem('meonmode_reviews', JSON.stringify(allReviews));
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

  // Translate products dynamically based on lang
  const translatedData = getTranslatedProducts(lang, PRODUCTS, MENS_PRODUCTS);
  const womenProducts = translatedData.women;
  const menProducts = translatedData.men;

  const displayFAQs = activeCategory === 'all' 
    ? [...getTranslatedFAQs(lang, false), ...getTranslatedFAQs(lang, true)]
    : getTranslatedFAQs(lang, activeCategory === 'men');
  const displayTestimonials = activeCategory === 'all'
    ? [...getTranslatedTestimonials(lang, false), ...getTranslatedTestimonials(lang, true)]
    : getTranslatedTestimonials(lang, activeCategory === 'men');
  const displayReviews = getTranslatedReviews(lang);
  const currentReviews = allReviews.map(rev => {
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

  const t = (key: keyof typeof UI_TRANSLATIONS['en'], variables?: Record<string, string | number>) => {
    let str = UI_TRANSLATIONS[lang][key] || UI_TRANSLATIONS['en'][key] || '';
    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, String(v));
      });
    }
    return str;
  };

  // Translate products dynamically inside the cart
  const translatedCart = cart.map(item => {
    const translatedProd = womenProducts.find(p => p.id === item.product.id) || menProducts.find(p => p.id === item.product.id) || item.product;
    return {
      ...item,
      product: translatedProd
    };
  });

  const currentProduct = selectedProduct 
    ? (womenProducts.find(p => p.id === selectedProduct.id) || menProducts.find(p => p.id === selectedProduct.id) || selectedProduct) 
    : null;

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

  // Safe Multi-Image parsing helper
  const getReviewImages = (imageField: string | string[] | undefined): string[] => {
    if (!imageField) return [];
    if (Array.isArray(imageField)) return imageField;
    return imageField.split(/[\s\n,]+/).filter(url => url.trim().startsWith('http'));
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
    return MENS_PRODUCTS.some(m => m.id === prod.id);
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
  const [orderHistory, setOrderHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('meonmode_order_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const saveOrderToHistory = (orderId: string) => {
    const clean = orderId.trim().toUpperCase();
    if (!clean || clean.length < 4) return;
    setOrderHistory(prev => {
      const filtered = prev.filter(id => id.toUpperCase() !== clean);
      const updated = [clean, ...filtered].slice(0, 10);
      try {
        localStorage.setItem('meonmode_order_history', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const scrollToBuyingDetails = () => {
    setTimeout(() => {
      const el = document.getElementById('product-purchase-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

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

  // Auto scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
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

  // Update browser tab title dynamically
  useEffect(() => {
    if (currentView === 'detail' && currentProduct) {
      document.title = `${currentProduct.name} | meONmode® Premium Ayurvedic Wellness`;
    } else {
      document.title = "meONmode® | Ayurvedic Wellness | ALPHAMAX, WANTMORE, OVAIRA & VAYUCORE";
    }
  }, [currentView, currentProduct]);

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

  // Auto scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedProduct]);

  // Reset active image index when selected product changes
  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedProduct?.id]);

  // Deep-linking: read URL parameters on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const productParam = urlParams.get('product');
    if (productParam) {
      // Find product in PRODUCTS or MENS_PRODUCTS
      const allProducts = [...PRODUCTS, ...MENS_PRODUCTS];
      const found = allProducts.find(p => p.id === productParam);
      if (found) {
        // Set correct category tab so it is visible
        const isMen = MENS_PRODUCTS.some(m => m.id === productParam);
        setActiveCategory(isMen ? 'men' : 'women');
        setHighlightedProductId(productParam);
        
        // Let's scroll and/or highlight
        setTimeout(() => {
          const element = document.getElementById(`product-card-${productParam}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Keep the pulse glowing for a while then fade it
            setTimeout(() => {
              setHighlightedProductId(null);
            }, 6000);
          }
        }, 1200);
      }
    }
  }, []);

  // Handle Share copy link
  const handleShareProduct = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareUrl = `${window.location.origin}${window.location.pathname}?product=${product.id}`;
    
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

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (checkoutStep === 1) {
      setCheckoutStep(2);
      return;
    }

    if (checkoutStep === 2 && paymentMethod === 'cod' && !codAcknowledged) {
      alert("Please accept the mandatory ₹150 advance payment policy for Cash on Delivery orders to proceed.");
      return;
    }

    // Generate cart text details using translatedCart to support the selected language (Hindi/English)
    const cartSummary = translatedCart.map(item => 
      `${item.product.name} x ${item.quantity} - Rs. ${(item.product.price * item.quantity).toLocaleString('en-IN')}`
    ).join('\n');

    const totalAmount = getCartTotal();
    const taxableValue = Math.round((totalAmount / 1.05) * 100) / 100;
    const totalGst = Math.round((totalAmount - taxableValue) * 100) / 100;
    const cgst = Math.round((totalGst / 2) * 100) / 100;
    const sgst = Math.round((totalGst / 2) * 100) / 100;
    const isCod = paymentMethod === 'cod';
    const advancePaid = isCod ? 150 : totalAmount;
    const balanceDue = isCod ? totalAmount - 150 : 0;

    const paymentLine = isCod 
      ? `• Mandatory COD Advance Paid: Rs. 150\n• Balance Due at Delivery: Rs. ${balanceDue.toLocaleString('en-IN', {minimumFractionDigits: 2})}\n[Rs. ${totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})} - Rs. 150 = Rs. ${balanceDue.toLocaleString('en-IN', {minimumFractionDigits: 2})}]`
      : `• Prepaid Full Amount Paid: Rs. ${totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}`;

    // Generate a unique Order ID
    const randomOrderNum = Math.floor(100000 + Math.random() * 900000);
    const generatedOrderId = `MOM-${randomOrderNum}`;
    setLastOrderId(generatedOrderId);
    saveOrderToHistory(generatedOrderId);

    // Create the specified WhatsApp payload
    const textPayload = `*NEW ORDER - meONmode*
*Order ID:* ${generatedOrderId}
───────────────────────
*Customer Delivery Details:*
• Name: ${checkout.fullName.trim()}
• Phone Number: ${checkout.phone.trim()}
• Full Address: ${checkout.address.trim()}
• Pincode: ${checkout.pincode.trim()}

*Order Summary:*
${cartSummary}

Taxable Value: Rs. ${taxableValue.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
CGST (2.5%): Rs. ${cgst.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
SGST (2.5%): Rs. ${sgst.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
Total GST (5%): Rs. ${totalGst.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
*Grand Total (Inclusive of 5% GST): Rs. ${totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}*

*Payment & Delivery Breakdown:*
${paymentLine}

*Payment Method:* ${isCod ? 'Cash on Delivery (COD)' : 'Prepaid UPI'}
───────────────────────
Please process and confirm this parcel for dispatch.`;

    // Encode payload
    const encodedPayload = encodeURIComponent(textPayload);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=917290810336&text=${encodedPayload}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');

    // Switch view to Order Success
    setCurrentView('success');
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('detail');
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
                className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors flex items-center justify-center cursor-pointer"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <button 
                onClick={() => {
                  if (currentView !== 'success') {
                    setCurrentView('home');
                  }
                }}
                className="text-left cursor-pointer"
              >
                <span className="font-serif text-lg md:text-2xl font-black tracking-wide text-white flex items-center gap-1">
                  meONmode<span className="text-[#E5A93C] text-[10px] md:text-sm align-super">®</span>
                </span>
                <span className="block text-[7px] md:text-[9px] tracking-[0.2em] uppercase text-[#E5A93C] font-semibold -mt-1 font-sans">
                  A y u r v e d i c &nbsp; W e l l n e s s
                </span>
              </button>
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
                              src={prod.images && prod.images[0]}
                              alt={prod.name}
                              loading="lazy"
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://i.postimg.cc/dtsJKSzc/IMG-2931.png';
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
              <button 
                onClick={() => currentView !== 'success' && setCurrentView('home')} 
                className={`transition-colors hover:text-[#E5A93C] cursor-pointer ${currentView === 'home' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
              >
                Home
              </button>

              <button 
                onClick={() => currentView !== 'success' && setCurrentView('refund-policy')} 
                className={`transition-colors hover:text-[#E5A93C] cursor-pointer ${currentView === 'refund-policy' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
              >
                Return Policy
              </button>
              {activeCategory === 'all' ? (
                <>
                  <button 
                    onClick={() => handleProductClick(PRODUCTS[0])} 
                    className={`transition-colors hover:text-[#E5A93C] cursor-pointer ${selectedProduct?.id === 'combo-kit' && currentView === 'detail' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
                  >
                    Women's Combo
                  </button>
                  <button 
                    onClick={() => handleProductClick(MENS_PRODUCTS[2])} 
                    className={`transition-colors hover:text-[#E5A93C] cursor-pointer ${selectedProduct?.id === 'mens-combo' && currentView === 'detail' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
                  >
                    Men's Combo
                  </button>
                  <button 
                    onClick={() => {
                      const vayu = [...womenProducts, ...menProducts].find(p => p.id === 'vayucore');
                      if (vayu) handleProductClick(vayu);
                    }} 
                    className={`transition-colors hover:text-[#E5A93C] cursor-pointer ${selectedProduct?.id === 'vayucore' && currentView === 'detail' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
                  >
                    VAYUCORE
                  </button>
                </>
              ) : activeCategory === 'men' ? (
                <>
                  <button 
                    onClick={() => handleProductClick(MENS_PRODUCTS[2])} 
                    className={`transition-colors hover:text-[#E5A93C] cursor-pointer ${selectedProduct?.id === 'mens-combo' && currentView === 'detail' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
                  >
                    Men's Combo
                  </button>
                  <button 
                    onClick={() => handleProductClick(MENS_PRODUCTS[0])} 
                    className={`transition-colors hover:text-[#E5A93C] cursor-pointer ${selectedProduct?.id === 'wantmore-men' && currentView === 'detail' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
                  >
                    WANTMORE Prash
                  </button>
                  <button 
                    onClick={() => handleProductClick(MENS_PRODUCTS[1])} 
                    className={`transition-colors hover:text-[#E5A93C] cursor-pointer ${selectedProduct?.id === 'alphamax-men' && currentView === 'detail' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
                  >
                    ALPHAMAX
                  </button>
                  <button 
                    onClick={() => {
                      const vayu = [...womenProducts, ...menProducts].find(p => p.id === 'vayucore');
                      if (vayu) handleProductClick(vayu);
                    }} 
                    className={`transition-colors hover:text-[#E5A93C] cursor-pointer ${selectedProduct?.id === 'vayucore' && currentView === 'detail' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
                  >
                    VAYUCORE
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => handleProductClick(PRODUCTS[0])} 
                    className={`transition-colors hover:text-[#E5A93C] cursor-pointer ${selectedProduct?.id === 'combo-kit' && currentView === 'detail' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
                  >
                    Combo Kit
                  </button>
                  <button 
                    onClick={() => handleProductClick(PRODUCTS[1])} 
                    className={`transition-colors hover:text-[#E5A93C] cursor-pointer ${selectedProduct?.id === 'ovaira' && currentView === 'detail' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
                  >
                    OVAIRA Capsules
                  </button>
                  <button 
                    onClick={() => handleProductClick(PRODUCTS[2])} 
                    className={`transition-colors hover:text-[#E5A93C] cursor-pointer ${selectedProduct?.id === 'flowelle' && currentView === 'detail' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
                  >
                    FLOWELLE Syrup
                  </button>
                  <button 
                    onClick={() => {
                      const vayu = [...womenProducts, ...menProducts].find(p => p.id === 'vayucore');
                      if (vayu) handleProductClick(vayu);
                    }} 
                    className={`transition-colors hover:text-[#E5A93C] cursor-pointer ${selectedProduct?.id === 'vayucore' && currentView === 'detail' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
                  >
                    VAYUCORE
                  </button>
                </>
              )}
            </nav>



            {/* Language Switcher */}
            <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-0.5 text-[10px] sm:text-xs">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded-full font-extrabold transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-[#E5A93C] text-[#2D120B] shadow-sm font-black'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                🇬🇧 EN
              </button>
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`px-2 py-1 rounded-full font-extrabold transition-all cursor-pointer ${
                  lang === 'hi'
                    ? 'bg-[#E5A93C] text-[#2D120B] shadow-sm font-black'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                🇮🇳 हिन्दी
              </button>
            </div>

            {/* Cart Button */}
            <button 
              id="header-cart-btn"
              onClick={() => {
                if (currentView !== 'success') {
                  setCheckoutStep(1);
                  setPaymentMethod('cod');
                  setCurrentView('cart');
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
            }}
            className="text-xs bg-[#C86428] text-white py-1.5 px-3 rounded-lg font-bold hover:bg-[#8B3B15] transition-colors"
          >
            Checkout Now
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 py-6 md:py-10">

        {/* ----------------- VIEW 1: HOME VIEW ----------------- */}
        {currentView === 'home' && (
          <div className="space-y-8">
            {/* Premium Category Toggle Switch */}
            <div className="flex flex-col items-center justify-center space-y-2 mb-2">
              <span className="text-xs uppercase tracking-widest font-bold font-sans text-[#E5A93C]">
                Select Your Wellness Collection
              </span>
              <div className="inline-flex flex-wrap md:flex-nowrap justify-center p-1 rounded-3xl md:rounded-full bg-black/45 backdrop-blur-md border border-white/10 shadow-inner shadow-black/60 relative gap-1 md:gap-0">
                <button
                  onClick={() => setActiveCategory('women')}
                  className={`relative z-10 px-5 md:px-7 py-2.5 rounded-full text-xs sm:text-sm font-extrabold tracking-wide uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                    activeCategory === 'women'
                      ? 'text-white shadow-lg bg-gradient-to-r from-[#C86428] to-[#8B3B15]'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span>👩</span>
                  <span>Women's</span>
                </button>
                <button
                  onClick={() => setActiveCategory('men')}
                  className={`relative z-10 px-5 md:px-7 py-2.5 rounded-full text-xs sm:text-sm font-extrabold tracking-wide uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                    activeCategory === 'men'
                      ? 'text-white shadow-lg bg-gradient-to-r from-[#D4AF37] to-[#8A6D1C] border border-[#D4AF37]/25'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span>👨</span>
                  <span>Men's</span>
                </button>
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`relative z-10 px-5 md:px-7 py-2.5 rounded-full text-xs sm:text-sm font-extrabold tracking-wide uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                    activeCategory === 'all'
                      ? 'text-white shadow-lg bg-gradient-to-r from-[#8C5D3A] to-[#3B2314] border border-[#E5A93C]/25'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span>✨</span>
                  <span>All Products</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Bento Block 1: Hero Banner Section (Col Span 12) */}
            {activeCategory === 'women' ? (
              <section id="luxury-women-hero" className="lg:col-span-12 relative overflow-hidden rounded-[2.5rem] border-2 md:border-[3px] border-[#FAF6F0] shadow-[0_24px_80px_rgba(35,18,11,0.5)] bg-gradient-to-br from-[#1b0b05] via-[#4a1d05] to-[#2a0e05] p-6 md:p-12 transition-all duration-700">
                {/* Immersive gold glowing highlights with soft glowing effects */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-[#E5A93C]/15 via-[#C86428]/5 to-transparent rounded-full blur-[140px] animate-soft-glow pointer-events-none"></div>
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-bl from-[#C86428]/10 via-[#E5A93C]/8 to-transparent rounded-full blur-[160px] pointer-events-none"></div>
                
                {/* Fallback organic pattern background */}
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#E5A93C_1px,transparent_1px)] [background-size:32px_32px]"></div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                  {/* Left Column Content */}
                  <div className="lg:col-span-7 space-y-8 text-left">
                    {/* Small Premium Badge */}
                    <div id="women-hero-badge" className="inline-flex items-center gap-2 bg-[#FAF6F0]/10 border border-[#FAF6F0]/20 text-[#FAF6F0] text-xs font-black uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg backdrop-blur-md">
                      <Sparkles className="w-3.5 h-3.5 text-[#E5A93C] animate-pulse" />
                      <span>✨ Ayurvedic Women’s Wellness</span>
                    </div>

                    {/* Main Heading & Sub Heading with Luxury Serif typography */}
                    <div className="space-y-4">
                      <h1 id="women-hero-heading" className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-[#FAF6F0] leading-[1.05]">
                        Your Body. <br />
                        <span className="bg-gradient-to-r from-[#E5A93C] via-[#FAF6F0] to-[#E5A93C] bg-clip-text text-transparent animate-pulse">ON Mode.</span>
                      </h1>
                      <p id="women-hero-subheading" className="text-[#FAF6F0]/90 font-sans text-sm sm:text-base md:text-lg max-w-xl leading-relaxed font-medium">
                        Support your everyday women’s wellness with premium Ayurvedic nutrition crafted for modern lifestyles.
                      </p>
                    </div>

                    {/* Premium Wellness Highlight Chips arranged in two responsive rows with golden ticks */}
                    <div id="women-hero-chips-container" className="space-y-4">
                      <div className="text-[10px] uppercase font-bold text-[#E5A93C] tracking-widest font-mono flex items-center gap-1.5">
                        <Leaf className="w-3.5 h-3.5 text-[#E5A93C]" />
                        <span>Formulated to Support Women's Wellness Concerns:</span>
                      </div>
                      
                      <div className="flex flex-col gap-3">
                        {/* Row 1 */}
                        <div className="flex flex-wrap gap-2.5">
                          {[
                            'PCOS',
                            'PCOD',
                            'Hormonal Imbalance',
                            'Irregular Periods'
                          ].map((chipLabel, idx) => (
                            <span 
                              key={idx}
                              id={`women-chip-row1-${idx}`}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-lg text-xs font-bold text-[#FAF6F0] hover:scale-105 hover:bg-white/10 hover:border-[#E5A93C]/40 transition-all duration-300"
                            >
                              <Check className="w-3.5 h-3.5 text-[#E5A93C] stroke-[3]" />
                              <span>{chipLabel}</span>
                            </span>
                          ))}
                        </div>
                        {/* Row 2 */}
                        <div className="flex flex-wrap gap-2.5">
                          {[
                            'White Discharge',
                            'PMS Support',
                            'Menstrual Wellness',
                            'Ovulation Support'
                          ].map((chipLabel, idx) => (
                            <span 
                              key={idx}
                              id={`women-chip-row2-${idx}`}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-lg text-xs font-bold text-[#FAF6F0] hover:scale-105 hover:bg-white/10 hover:border-[#E5A93C]/40 transition-all duration-300"
                            >
                              <Check className="w-3.5 h-3.5 text-[#E5A93C] stroke-[3]" />
                              <span>{chipLabel}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-[10px] text-white/50 italic mt-2 leading-normal font-sans">
                        *Daily holistic lifestyle support. These wellness supplements do not claim to diagnose, treat, cure, or guarantee clinical results.
                      </p>
                    </div>

                    {/* CTA Buttons - Premium interactions with responsive focus on meONmode style */}
                    <div className="pt-2 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                      <button 
                        id="women-hero-cta-primary"
                        onClick={() => {
                          const catalogSec = document.getElementById('catalog-anchor');
                          if (catalogSec) {
                            catalogSec.scrollIntoView({ behavior: 'smooth' });
                          } else {
                            window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' });
                          }
                        }}
                        className="bg-gradient-to-r from-[#C86428] via-[#E5A93C] to-[#C86428] hover:brightness-110 active:bg-[#FAF6F0] active:text-[#4A1D05] active:from-none active:to-none text-[#23120B] font-extrabold text-xs sm:text-sm py-4 px-8 rounded-full shadow-xl shadow-black/30 transition-all duration-300 hover:shadow-[0_0_25px_rgba(229,169,60,0.5)] hover:scale-[1.03] active:scale-95 text-center flex items-center justify-center gap-2.5 cursor-pointer uppercase tracking-wider"
                      >
                        <ShoppingBag className="w-4.5 h-4.5" />
                        <span>Shop Women’s Wellness</span>
                      </button>
                      <button 
                        id="women-hero-cta-secondary"
                        onClick={() => {
                          const catalogSec = document.getElementById('catalog-anchor');
                          if (catalogSec) {
                            catalogSec.scrollIntoView({ behavior: 'smooth' });
                          } else {
                            window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' });
                          }
                        }}
                        className="bg-transparent hover:bg-white/5 active:bg-[#4A1D05] active:text-[#FAF6F0] border-2 border-[#FAF6F0]/60 hover:border-[#FAF6F0] text-[#FAF6F0] font-extrabold text-xs sm:text-sm py-3.5 px-8 rounded-full transition-all duration-300 text-center cursor-pointer hover:scale-[1.03] active:scale-95 uppercase tracking-wider"
                      >
                        Explore Products
                      </button>
                    </div>

                    {/* Trust Features styled as Premium Trust Cards */}
                    <div id="women-hero-trust-grid" className="pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        '100% Ayurvedic',
                        'Premium Herbal Ingredients',
                        'No Artificial Colors',
                        'No Heavy Metals',
                        'Made for Women’s Wellness',
                        'Quality Tested'
                      ].map((trust, idx) => (
                        <div 
                          key={idx} 
                          id={`women-trust-${idx}`} 
                          className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-2xl p-3 hover:bg-white/10 transition-colors shadow-sm"
                        >
                          <span className="text-[#E5A93C] font-bold text-sm">✓</span>
                          <span className="text-xs font-bold text-white/95">{trust}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column Visual Composition */}
                  <div className="lg:col-span-5 relative flex justify-center py-6">
                    {/* Simulated Soft Cream Fabric Backdrop & Wooden Platform */}
                    <div id="women-hero-visual-card" className="relative w-full max-w-[340px] md:max-w-md aspect-[4/5] rounded-[2.5rem] overflow-hidden p-6 shadow-2xl border-2 border-[#E5A93C]/20 bg-gradient-to-b from-[#2a130b] to-[#120502] flex flex-col justify-end">
                      
                      {/* Soft cream fabric background overlay style via elegant backdrop styling */}
                      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF6F0]/20 via-[#FAF3E8]/10 to-transparent opacity-80 pointer-events-none"></div>
                      
                      {/* Wood-colored warm brown wooden platform at the bottom */}
                      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#3B1E08] via-[#5C2E0B] to-[#FAF6F0]/5 rounded-t-[2rem] opacity-90 border-t-2 border-[#E5A93C]/20"></div>

                      {/* Golden glowing light rays and highlight spots */}
                      <div className="absolute -top-10 left-10 w-44 h-44 bg-amber-400/25 rounded-full blur-3xl animate-soft-pulse pointer-events-none"></div>
                      <div className="absolute top-1/2 right-0 w-32 h-32 bg-[#E5A93C]/25 rounded-full blur-2xl pointer-events-none animate-pulse"></div>

                      {/* Fresh Flowers & Botanicals floating absolute props using Lucide icons */}
                      <div className="absolute top-8 right-8 text-[#E5A93C]/40 pointer-events-none animate-float" style={{ animationDelay: '1s' }}>
                        <Leaf className="w-10 h-10 rotate-[40deg] filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]" />
                      </div>
                      <div className="absolute top-1/3 left-6 text-[#C86428]/50 pointer-events-none animate-float" style={{ animationDelay: '2.5s' }}>
                        <Flower2 className="w-12 h-12 rotate-[12deg] filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]" />
                      </div>
                      <div className="absolute bottom-20 right-8 text-[#E5A93C]/50 pointer-events-none animate-float" style={{ animationDelay: '0.5s' }}>
                        <Leaf className="w-8 h-8 rotate-[-30deg] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
                      </div>
                      
                      {/* Luxury Gift Box styling representation border lines */}
                      <div className="absolute inset-4 border border-[#E5A93C]/20 rounded-[1.8rem] pointer-events-none z-10"></div>
                      <div className="absolute inset-5 border border-[#E5A93C]/10 rounded-[1.6rem] pointer-events-none z-10"></div>

                      {/* Premium gold batch harvest badge */}
                      <div className="absolute top-6 left-6 bg-[#4A1D05] text-[#E5A93C] px-3 py-1 rounded-md border border-[#E5A93C]/30 z-20 shadow-md">
                        <span className="text-[9px] uppercase tracking-widest font-black font-mono flex items-center gap-1">
                          ✨ Gold Batch Harvest
                        </span>
                      </div>

                      {/* Product display container with floating animation */}
                      <button
                        id="women-hero-visual-button"
                        type="button"
                        onClick={() => {
                          const foundProd = PRODUCTS.find(p => p.id === 'combo-kit');
                          if (foundProd) {
                            handleProductClick(foundProd);
                            scrollToBuyingDetails();
                          }
                        }}
                        className="w-full relative z-20 focus:outline-none cursor-pointer overflow-hidden block group/hero-img rounded-2xl animate-float mt-auto"
                        title="Click to view details"
                      >
                        <img 
                          src="https://i.postimg.cc/BQm4ZB0G/IMG-2935.png" 
                          alt="meONmode Women's Combo Kit" 
                          loading="lazy"
                          className="w-full h-auto max-w-[280px] md:max-w-[320px] object-contain block mx-auto rounded-2xl crisp-img transform transition-transform duration-700 ease-out group-hover/hero-img:scale-105 filter drop-shadow-[0_25px_25px_rgba(0,0,0,0.6)]"
                          style={{ imageRendering: 'crisp-edges', WebkitImageRendering: '-webkit-optimize-contrast' }}
                        />
                      </button>

                      {/* Standardized Shastras floating badge */}
                      <span className="absolute bottom-6 left-6 bg-[#4A1D05] text-white text-[9px] font-black tracking-wider uppercase px-3 py-2 rounded-full shadow-lg border border-[#E5A93C]/30 z-20">
                        🌿 Standardized Shastras
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <section id="traditional-hero" className={`lg:col-span-12 relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl flex flex-col justify-between transition-all duration-700 ${
                activeCategory === 'all'
                  ? 'bg-gradient-to-br from-[#2B1B15] to-[#120B09]'
                  : 'bg-gradient-to-br from-[#1C1C1C] to-[#0A0A0A]'
              }`}>
                {/* Fallback pattern background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#C86428_1px,transparent_1px)] [background-size:16px_16px]"></div>
                
                {/* Soft Warm Depth Glow Behind Text/Image */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-12 items-center relative z-10 h-full">
                  {/* Text Sales Copy */}
                  <div className="md:col-span-7 space-y-6">
                    <div className={`inline-flex items-center gap-2 border text-[10px] font-bold uppercase tracking-wider py-1 px-3.5 rounded-full transition-colors duration-500 ${
                      activeCategory === 'all'
                        ? 'bg-[#3B2314] border-[#E5A93C]/30 text-[#E5A93C]'
                        : 'bg-[#E5A93C]/10 border-amber-500/30 text-[#E5A93C]'
                    }`}>
                      <Sparkles className="w-3 h-3 text-[#E5A93C]" />
                      {activeCategory === 'all' ? t('heroTaglineAll') : t('heroTaglineMen')}
                    </div>
                    
                    <h1 className="font-serif text-3.5xl sm:text-5xl md:text-5.5xl lg:text-6.5xl font-extrabold tracking-tight text-white leading-[1.08]">
                      {activeCategory === 'all' ? (
                        <>
                          {t('heroTitleAll1')} <br />
                          <span className="text-[#E5A93C] font-black">{t('heroTitleAll2')}</span>
                        </>
                      ) : (
                        <>
                          {t('heroTitleMen1')} <br />
                          <span className="text-[#E5A93C] font-black">{t('heroTitleMen2')}</span>
                        </>
                      )}
                    </h1>

                    <p className="text-[#F7E7D9] text-xs sm:text-sm md:text-base leading-relaxed max-w-xl font-medium">
                      {activeCategory === 'all'
                        ? t('heroDescAll')
                        : t('heroDescMen')}
                    </p>

                    {/* Highlight Specs */}
                    <div className="grid grid-cols-2 gap-3.5 max-w-md pt-1">
                      <div className="flex items-center gap-2 text-xs text-[#F7E7D9]/90">
                        <Check className="w-4 h-4 text-[#E5A93C] shrink-0" />
                        <span>{t('heroSpec1')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#F7E7D9]/90">
                        <Check className="w-4 h-4 text-[#E5A93C] shrink-0" />
                        <span>{t('heroSpec2')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#F7E7D9]/90">
                        <Check className="w-4 h-4 text-[#E5A93C] shrink-0" />
                        <span>{t('heroSpec3')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#F7E7D9]/90">
                        <Check className="w-4 h-4 text-[#E5A93C] shrink-0" />
                        <span>{t('heroSpec4')}</span>
                      </div>
                    </div>

                    <div className="pt-3 flex flex-col sm:flex-row gap-4">
                      <button 
                        id="hero-buy-combo-btn"
                        onClick={() => handleQuickBuy(activeCategory === 'men' ? menProducts[2] : womenProducts[0])}
                        className="bg-gradient-to-r from-[#C86428] to-[#E5A93C] hover:brightness-110 text-white font-extrabold text-xs sm:text-sm py-3.5 px-6 rounded-xl shadow-lg shadow-[#4A1D05]/50 transition-all hover:shadow-[0_0_20px_rgba(200,100,40,0.6)] hover:scale-[1.01] active:scale-95 text-center flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ShoppingBag className="w-4.5 h-4.5" />
                        <span>{t('shopCombo')} - <span className="text-white font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>{activeCategory === 'men' ? '₹5,999' : '₹1,999'}</span></span>
                      </button>
                      <button 
                        id="hero-view-details-btn"
                        onClick={() => handleProductClick(activeCategory === 'men' ? menProducts[2] : womenProducts[0])}
                        className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm py-3.5 px-6 rounded-xl transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] text-center cursor-pointer hover:scale-[1.01]"
                      >
                        {t('learnMore')}
                      </button>
                    </div>
                  </div>

                  {/* Right Hero Image Column representing 1000166066_2.jpg / Product Hero */}
                  <div className="md:col-span-5 relative flex justify-center">
                    {/* Outer stage glow */}
                    <div className="absolute inset-[-20px] bg-gradient-to-br from-[#E5A93C]/20 to-transparent blur-3xl rounded-full pointer-events-none"></div>
                    
                    <div className={`relative w-full max-w-[260px] md:max-w-sm rounded-3xl overflow-hidden p-2.5 shadow-2xl border border-white/20 transition-all duration-500 bg-gradient-to-br ${
                      activeCategory === 'all'
                        ? 'from-[#3B2314] to-[#1F120B]'
                        : 'from-[#333333] to-[#121212]'
                    }`}>
                      {/* Glowing golden light overlay inside the container */}
                      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 via-transparent to-transparent pointer-events-none"></div>

                      <button
                        id="traditional-hero-visual-btn"
                        type="button"
                        onClick={() => {
                          const targetId = activeCategory === 'men' ? 'mens-combo' : 'combo-kit';
                          const foundProd = (activeCategory === 'men' ? MENS_PRODUCTS : PRODUCTS).find(p => p.id === targetId);
                          if (foundProd) {
                            handleProductClick(foundProd);
                            scrollToBuyingDetails();
                          }
                        }}
                        className="w-full focus:outline-none cursor-pointer overflow-hidden relative block group/hero-img rounded-2xl"
                        title="Click to view details"
                      >
                        <img 
                          src={activeCategory === 'men' ? 'https://i.postimg.cc/Jh4rYcBN/IMG-3616.png' : 'https://i.postimg.cc/BQm4ZB0G/IMG-2935.png'} 
                          alt={activeCategory === 'men' ? "meONmode Men's Combo" : "meONmode Combo Kit"} 
                          loading="lazy"
                          className="w-full h-auto max-w-full object-contain block mx-auto rounded-2xl crisp-img transform transition-transform duration-700 ease-out group-hover/hero-img:scale-105 animate-float"
                          style={{ imageRendering: 'crisp-edges', WebkitImageRendering: '-webkit-optimize-contrast' }}
                        />
                      </button>
                      {/* Glassmorphic price tag pill */}
                      <div className="absolute top-3 right-3 bg-[#5C1D13]/90 backdrop-blur-md border-2 border-amber-400 text-white font-extrabold px-3 py-1 rounded-full text-[10px] shadow-[0_0_10px_rgba(251,191,36,0.5)] drop-shadow-md">
                        {activeCategory === 'all' ? 'Save Up to 57%' : 'Save 57%'}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Bento Block 3: Daily 90-Day Wellness Ritual Timeline (Col Span 12) */}
            {activeCategory === 'women' && (
              <section id="wellness-ritual-timeline" className="lg:col-span-12 bg-[#23120b] border-2 md:border-[3px] border-[#FAF6F0] rounded-[2.5rem] p-8 md:p-12 space-y-10 shadow-2xl relative overflow-hidden text-[#FAF6F0]">
                {/* Very soft glowing effects */}
                <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#E5A93C]/10 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#C86428]/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="text-center space-y-3 max-w-2xl mx-auto relative z-10">
                  <span className="inline-flex items-center gap-1.5 bg-[#FAF6F0]/10 text-[#E5A93C] uppercase text-[10px] tracking-widest font-extrabold font-mono px-4 py-1.5 rounded-full border border-[#E5A93C]/20 shadow-sm">
                    ✨ The 90-Day Protocol
                  </span>
                  <h3 className="font-serif text-3xl md:text-5xl font-black text-[#FAF6F0] tracking-tight">
                    90-Day Wellness Ritual
                  </h3>
                  <p className="text-[#FAF6F0]/80 text-xs sm:text-sm font-medium leading-relaxed font-sans">
                    A simple daily Ayurvedic ritual to support hormonal balance, menstrual wellness, vaginal wellness, a healthy body, and overall female well-being.
                  </p>
                </div>

                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.15
                      }
                    }
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                >
                  {/* Step 1 */}
                  <motion.div 
                    id="ritual-step-1" 
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15, duration: 0.6 } }
                    }}
                    className="bg-[#FAF6F0] rounded-[20px] border border-[#E5A93C]/25 p-6 md:p-8 space-y-5 hover:shadow-[0_0_20px_rgba(229,169,60,0.2)] hover:border-[#E5A93C]/50 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between shadow-lg text-[#4A1D05]"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 bg-[#4A1D05] text-[#E5A93C] rounded-2xl flex items-center justify-center font-bold border border-[#E5A93C]/30 shadow-md">
                          <Pill className="w-6 h-6 text-[#E5A93C]" />
                        </div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest font-mono text-[#C86428]">Step 01 / Morning</span>
                      </div>
                      <h4 className="font-serif font-black text-xl text-[#4A1D05]">
                        OVAIRA Capsule
                      </h4>
                      <p className="text-xs text-[#4A1D05]/90 font-medium leading-relaxed font-sans">
                        Take 1 capsule in the morning and 1 capsule in the evening after meals.
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[#4A1D05]/10 text-[10px] text-neutral-500 font-bold tracking-wider uppercase font-mono">
                      ✓ Supports cycle regularity
                    </div>
                  </motion.div>

                  {/* Step 2 */}
                  <motion.div 
                    id="ritual-step-2" 
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15, duration: 0.6 } }
                    }}
                    className="bg-[#FAF6F0] rounded-[20px] border border-[#E5A93C]/25 p-6 md:p-8 space-y-5 hover:shadow-[0_0_20px_rgba(229,169,60,0.2)] hover:border-[#E5A93C]/50 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between shadow-lg text-[#4A1D05]"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 bg-[#4A1D05] text-[#E5A93C] rounded-2xl flex items-center justify-center font-bold border border-[#E5A93C]/30 shadow-md">
                          <Droplet className="w-6 h-6 text-[#E5A93C]" />
                        </div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest font-mono text-[#C86428]">Step 02 / Evening</span>
                      </div>
                      <h4 className="font-serif font-black text-xl text-[#4A1D05]">
                        FLOWELLE Syrup
                      </h4>
                      <p className="text-xs text-[#4A1D05]/90 font-medium leading-relaxed font-sans">
                        Take 5 ml in the morning and 5 ml in the evening after meals.
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[#4A1D05]/10 text-[10px] text-neutral-500 font-bold tracking-wider uppercase font-mono">
                      ✓ Tones & strengthens uterine system
                    </div>
                  </motion.div>

                  {/* Step 3 */}
                  <motion.div 
                    id="ritual-step-3" 
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15, duration: 0.6 } }
                    }}
                    className="bg-[#FAF6F0] rounded-[20px] border border-[#E5A93C]/25 p-6 md:p-8 space-y-5 hover:shadow-[0_0_20px_rgba(229,169,60,0.2)] hover:border-[#E5A93C]/50 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between shadow-lg text-[#4A1D05]"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 bg-[#4A1D05] text-[#E5A93C] rounded-2xl flex items-center justify-center font-bold border border-[#E5A93C]/30 shadow-md">
                          <Flower2 className="w-6 h-6 text-[#E5A93C]" />
                        </div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest font-mono text-[#C86428]">Step 03 / Lifestyle</span>
                      </div>
                      <h4 className="font-serif font-black text-xl text-[#4A1D05]">
                        90-Day Wellness Ritual
                      </h4>
                      <p className="text-xs text-[#4A1D05]/90 font-medium leading-relaxed font-sans">
                        A simple daily Ayurvedic ritual to support hormonal balance, menstrual wellness, vaginal wellness, a healthy body, and overall female well-being.
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[#4A1D05]/10 text-[10px] text-neutral-500 font-bold tracking-wider uppercase font-mono">
                      ✓ Holistic mind-body equilibrium
                    </div>
                  </motion.div>
                </motion.div>

                {/* Safe elegant disclaimer that avoids guarantees or clinical medical claims */}
                <div className="pt-4 text-center text-[10px] text-white/60 max-w-2xl mx-auto leading-relaxed font-sans border-t border-white/10 relative z-10">
                  ⚠️ <strong className="font-extrabold text-[#E5A93C]">Disclaimer:</strong> Formulated for everyday health support. These products do not claim to diagnose, treat, cure, or prevent any medical conditions. Individual responses to botanical extracts may vary; please maintain a balanced lifestyle and consult your healthcare practitioner before commencing any new wellness routine.
                </div>
              </section>
            )}

            {/* Bento Block 4: Product Catalog Section (Col Span 12) */}
            <section className="lg:col-span-12 space-y-6 pt-4">
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
                    {activeCategory === 'all' ? "Complete Ayurvedic Reset Protocol" : activeCategory === 'men' ? "Men's Premium Vitality Protocol" : "Women's Hormonal Reset Protocol"}
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
                          highlightedProductId === prod.id
                            ? 'ring-4 ring-[#E5A93C] scale-[1.02] border-[#E5A93C] shadow-[0_0_25px_rgba(229,169,60,0.5)] z-20'
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

                          {/* Floating Share Product Icon */}
                          <button
                            type="button"
                            onClick={(e) => handleShareProduct(prod, e)}
                            className="absolute top-4 right-4 z-20 p-2.5 bg-white/90 hover:bg-white text-neutral-800 hover:text-[#5C1D13] rounded-full transition-all border border-neutral-200 shadow-sm hover:scale-110 active:scale-95 cursor-pointer"
                            title="Share Product"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => {
                              handleProductClick(prod);
                              scrollToBuyingDetails();
                            }}
                            className="w-full focus:outline-none cursor-pointer overflow-hidden relative flex items-center justify-center group"
                            title="Click to view pricing & details"
                          >
                            <img 
                              src={prod.images && prod.images[0]} 
                              alt={prod.name}
                              loading="lazy"
                              className="w-full h-auto max-w-full object-contain block mx-auto crisp-img h-48 md:h-56 p-2 transform transition-transform duration-500 ease-out group-hover:scale-105"
                              style={{ imageRendering: 'crisp-edges', WebkitImageRendering: '-webkit-optimize-contrast' }}
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
                          </button>
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
                            <h3 className="font-serif text-xl md:text-2xl font-black text-neutral-950 tracking-tight leading-snug">
                              {prod.name}
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

                          {/* Action Buttons Design & Alignment */}
                          {(() => {
                            const stockInfo = getProductStockStatus(prod.id);
                            if (stockInfo.status === 'out_of_stock') {
                              return (
                                <div className="space-y-2.5 pt-3 border-t border-neutral-100">
                                  <div className="grid grid-cols-2 gap-2.5">
                                    <button 
                                      onClick={() => handleProductClick(prod)}
                                      className="text-xs font-bold py-3 px-3.5 rounded-xl border border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50 hover:border-neutral-300 text-center cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5"
                                    >
                                      View Details
                                    </button>
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
                                  <button 
                                    onClick={() => handleProductClick(prod)}
                                    className="text-xs font-bold py-3 px-3.5 rounded-xl border border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50 hover:border-neutral-300 text-center cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5"
                                  >
                                    View Details
                                  </button>
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

            {/* Bento Block 5: Reassuring Medical Statement (Col Span 7) */}
            <section className={`lg:col-span-7 backdrop-blur-md border p-6 md:p-8 rounded-3xl flex flex-col justify-between shadow-2xl space-y-6 transition-colors duration-700 ${
              activeCategory === 'all'
                ? 'bg-[#1C110D]/90 border-amber-500/15'
                : activeCategory === 'men' 
                  ? 'bg-[#181818]/90 border-amber-500/20' 
                  : 'bg-[#5C1D13]/70 border-white/10'
            }`}>
              <div className="space-y-4">
                <span className="text-[#E5A93C] text-xs font-bold tracking-widest uppercase block">Clinically Certified Wellness</span>
                <h2 className="font-serif text-2xl md:text-3.5xl font-extrabold text-white leading-tight">
                  No Synthetic Pills. Just Pure, Standardized Ayurvedic Shastras.
                </h2>
                
                {activeCategory !== 'men' && (
                  <div className={`grid gap-4 my-2 ${activeCategory === 'all' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
                    <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black/20">
                      <span className="block text-[10px] uppercase font-bold text-[#E5A93C] p-2 bg-black/30 text-center border-b border-white/5">100% Raw Roots & Bark</span>
                      <img 
                        src="https://i.postimg.cc/qRNCQvxh/IMG-2918.png" 
                        alt="100% Ayurvedic Ingredients / Roots & Bark" 
                        loading="lazy"
                        className="w-full h-auto max-w-full object-contain block mx-auto crisp-img"
                        style={{ imageRendering: 'crisp-edges', WebkitImageRendering: '-webkit-optimize-contrast' }}
                      />
                    </div>
                    <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black/20">
                      <span className="block text-[10px] uppercase font-bold text-[#E5A93C] p-2 bg-black/30 text-center border-b border-white/5">Ayurveda vs Synthetic Pills</span>
                      <img 
                        src="https://i.postimg.cc/qMRxSpMV/IMG-2912.png" 
                        alt="Why Ayurvedic capsules are better Comparison" 
                        loading="lazy"
                        className="w-full h-auto max-w-full object-contain block mx-auto crisp-img"
                        style={{ imageRendering: 'crisp-edges', WebkitImageRendering: '-webkit-optimize-contrast' }}
                      />
                    </div>
                  </div>
                )}

                <p className="text-[#F7E7D9] text-xs sm:text-sm leading-relaxed">
                  {activeCategory === 'all' ? (
                    "Modern synthetic treatments are packed with temporary chemicals or high-dose artificial hormones which trigger severe weight gain, blood pressure spikes, and mental anxiety. meONmode® relies purely on organic, bio-active botanical compounds and uterine toners processed inside GMP certified facilities."
                  ) : activeCategory === 'men' ? (
                    "Most performance pills are packed with dangerous synthetic stimulants or low-grade chemicals which trigger critical blood pressure spikes, cardiac stress, and anxiety. meONmode® relies purely on organic, bio-active botanical compounds processed inside GMP certified facilities."
                  ) : (
                    "Most hormonal pills are packed with heavy doses of synthetic estrogen which trigger high weight gain, blood pressure spikes, and mental anxiety. meONmode® relies purely on bio-active phytoestrogens and uterine toners processed inside GMP certified facilities."
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div className="flex gap-3 items-start">
                  <div className="p-1.5 bg-[#C86428]/25 rounded-lg text-[#E5A93C] shrink-0">
                    <Leaf className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-white text-xs sm:text-sm">Ayush Ministry Formulated</h4>
                    <p className="text-[11px] text-[#F7E7D9]/80 mt-0.5">Tested thoroughly under strict Indian traditional guidelines.</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="p-1.5 bg-[#C86428]/25 rounded-lg text-[#E5A93C] shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-white text-xs sm:text-sm">Discreet & Sealed</h4>
                    <p className="text-[11px] text-[#F7E7D9]/80 mt-0.5">Double-sealed under vacuum so no outside contaminants spoil the herbs.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Bento Block 6: Support Score Graphic (Col Span 5) */}
            <section className="lg:col-span-5 bg-white/5 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-3xl flex flex-col justify-between shadow-2xl space-y-6">
              <div className="space-y-1">
                <h4 className="font-serif text-lg font-bold text-white text-center border-b border-white/10 pb-3">
                  {activeCategory === 'all' ? "Clinical Restorative Success Score" : activeCategory === 'men' ? "Clinical Men's Performance Score" : "Clinical Period Support Score"}
                </h4>
                <p className="text-[11px] text-[#F7E7D9]/80 text-center">Observed improvements over 90 days</p>
              </div>

              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-black/20">
                <img 
                  src={activeCategory === 'men' ? 'https://i.postimg.cc/Jh4rYcBN/IMG-3616.png' : 'https://i.postimg.cc/Y2ftZwDN/IMG-2926.png'} 
                  alt={activeCategory === 'men' ? "meONmode Men's Results" : "Bye Bye Period Problems / 87% & 95% Results"} 
                  loading="lazy"
                  className="w-full h-auto max-w-full object-contain block mx-auto crisp-img"
                  style={{ imageRendering: 'crisp-edges', WebkitImageRendering: '-webkit-optimize-contrast' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      const existingFallback = parent.querySelector('.score-fallback-overlay');
                      if (existingFallback) {
                        existingFallback.remove();
                      }
                      const fallback = document.createElement('div');
                      fallback.className = "score-fallback-overlay p-4 text-center text-white/90 font-serif text-sm flex flex-col items-center justify-center min-h-[140px]";
                      fallback.innerHTML = `
                        <div class="p-2 bg-amber-500/10 rounded-full border border-amber-500/20 mb-2">
                          <svg class="w-6 h-6 text-[#E5A93C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>
                        <span class="font-bold">Over 90% Voted Recovery Success</span>
                      `;
                      parent.appendChild(fallback);
                    }
                  }}
                />
              </div>
              
              <div className="space-y-4 text-xs font-semibold">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>
                      {activeCategory === 'all' ? "Stamina & Physical Endurance Boosted" : activeCategory === 'men' ? "Physical Stamina & Power Boosted" : "Irregular Flow Regularized (Within 45 Days)"}
                    </span>
                    <span className="text-[#E5A93C]">94%</span>
                  </div>
                  <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[#C86428] to-[#E5A93C] h-full rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>
                      {activeCategory === 'all' ? "Hormonal Balance & Stress Reduced" : activeCategory === 'men' ? "Vigor Restoration & Endurance Increased" : "Agonizing Pelvic Cramps Reduced"}
                    </span>
                    <span className="text-[#E5A93C]">97%</span>
                  </div>
                  <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[#C86428] to-[#E5A93C] h-full rounded-full" style={{ width: '97%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>
                      {activeCategory === 'all' ? "Overall Energy & Vitality Restored" : activeCategory === 'men' ? "Baseline Cellular Energy Stabilized" : "Cyst Clearance & LH/FSH Balanced"}
                    </span>
                    <span className="text-[#E5A93C]">88%</span>
                  </div>
                  <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[#C86428] to-[#E5A93C] h-full rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-center border-t border-white/5">
                <span className="inline-block text-[10px] tracking-wider text-neutral-300 bg-black/20 px-3 py-1.5 rounded-full">
                  *Based on a 12-week review of 3,420 meONmode® customers in 2025
                </span>
              </div>
            </section>

            {/* Bento Block 7: Premium Dynamic Customer Reviews Section (Col Span 12) */}
            <section id="review-gallery" className="lg:col-span-12 space-y-8 relative overflow-hidden bg-[#23120b]/30 border-2 border-[#FAF6F0]/20 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-md">
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
                    ? "Read authentic, raw experiences shared by brothers inside the meONmode® community. Filtered for 100% relevance."
                    : "Discover honest reviews and photo logs shared by our meONmode® community members. Real people, real results."}
                </p>
              </div>

              {/* Dynamic Review Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
                {(() => {
                  const homeReviews = currentReviews.filter(rev => {
                    const isMen = MENS_PRODUCTS.some(m => m.id === rev.productId);
                    if (activeCategory === 'men') {
                      return isMen;
                    } else if (activeCategory === 'women') {
                      return !isMen;
                    }
                    return true;
                  });

                  if (homeReviews.length === 0) {
                    return (
                      <div className="col-span-full py-12 text-center text-white/50 italic">
                        No reviews found for this category yet. Be the first to write one!
                      </div>
                    );
                  }

                  return homeReviews.map((rev, index) => {
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
                                    src={imgUrl} 
                                    alt={`${rev.name}'s Review Asset ${imgIndex + 1}`} 
                                    loading="lazy"
                                    className="w-full h-full object-contain transition-transform duration-500 hover:scale-105 cursor-pointer rounded-xl"
                                    onClick={() => {
                                      setLightboxImage(imgUrl);
                                      setLightboxZoom(false);
                                    }}
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = 'https://i.postimg.cc/dtsJKSzc/IMG-2931.png';
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
                              <h4 className="font-serif text-sm font-extrabold text-[#4A1D05] leading-tight">
                                {rev.title || "Miraculous Healing Journey"}
                              </h4>
                              <p className="text-[11px] text-neutral-600 leading-relaxed font-sans line-clamp-4 group-hover:line-clamp-none transition-all duration-300">
                                {rev.review}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Card Footer: Product name, customer name, date */}
                        <div className="p-5 pt-0 mt-auto border-t border-[#4A1D05]/10 space-y-1.5 bg-neutral-150/50">
                          <div className="flex items-center justify-between text-[10px] text-neutral-400 font-semibold font-mono uppercase tracking-wider">
                            <span>{rev.name} {rev.location ? `(${rev.location})` : ''}</span>
                            <span>{rev.date || "Verified"}</span>
                          </div>
                          <div className="text-[10px] text-[#C86428] font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-[#C86428]/30 rounded-full"></span>
                            <span>Product: {prod?.name || "meONmode Remedy"}</span>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </section>

            {/* Bento Block 7.5: meONmode Wellness Club Group */}
            <section className="lg:col-span-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 space-y-4 shadow-xl">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="space-y-3 md:w-1/2">
                  <span className="text-[#E5A93C] uppercase text-xs tracking-widest font-bold">Community Support</span>
                  <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-white">Join the meONmode® Wellness Club Group</h3>
                  <p className="text-[#F7E7D9]/80 text-xs sm:text-sm leading-relaxed">
                    {activeCategory === 'all'
                      ? "You are not alone in this journey. Connect with 15,000+ members, get daily Ayurvedic lifestyle tips, diet plans, strength guides, and direct expert consultations inside our exclusive Wellness Club."
                      : activeCategory === 'men'
                        ? "You are not alone in this journey. Connect with 10,000+ brothers, get daily Ayurvedic strength tips, clean diet plans, and direct expert consultations inside our exclusive Wellness Club."
                        : "You are not alone in this journey. Connect with 10,000+ sisters, get daily Ayurvedic lifestyle tips, diet plans, and direct expert consultations inside our exclusive Wellness Club."}
                  </p>
                  <div className="pt-2">
                    <a 
                      href="https://api.whatsapp.com/send?phone=917290810336&text=Hello%20meONmode%20Team%2C%20I%20want%20to%20join%20the%20Wellness%20Club%20Group."
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 px-5 rounded-xl transition-all shadow-md hover:scale-[1.02]"
                    >
                      <span>Join Free Group on WhatsApp</span>
                    </a>
                  </div>
                </div>
                <div className="md:w-1/2 w-full">
                  <div className="overflow-hidden rounded-2xl border border-white/10 shadow-lg bg-black/40 relative">
                    <img 
                      src="1000166074.jpg" 
                      alt="meONmode Wellness Club Group" 
                      loading="lazy"
                      className="w-full h-auto max-w-full object-contain block mx-auto crisp-img" 
                      style={{ imageRendering: 'crisp-edges', WebkitImageRendering: '-webkit-optimize-contrast' }} 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const existingFallback = parent.querySelector('.club-fallback-overlay');
                          if (existingFallback) {
                            existingFallback.remove();
                          }
                          const fb = document.createElement('div');
                          fb.className = "club-fallback-overlay p-8 text-center text-white/80 font-medium text-xs flex flex-col items-center justify-center min-h-[180px]";
                          fb.innerHTML = `
                            <div class="p-3 bg-emerald-500/10 text-emerald-400 rounded-full mb-2">
                              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            </div>
                            <span class="font-bold text-sm text-white">meONmode® Wellness Club Group Support</span>
                            <span class="text-[10px] text-emerald-400 mt-1 font-bold">10,000+ Active Members Active</span>
                          `;
                          parent.appendChild(fb);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Bento Block 8: FAQ Accordion (Col Span 12) */}
            <section className="lg:col-span-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-10 space-y-6 shadow-xl">
              <div className="text-center space-y-1">
                <h3 className="font-serif text-2xl md:text-3.5xl font-extrabold text-white">
                  {activeCategory === 'all' ? "Unified Ayurvedic Queries Answered" : activeCategory === 'men' ? "Wellness & Performance Queries Answered" : "Period Health Queries Answered"}
                </h3>
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
          </div>
        </div>
      )}

        {/* ----------------- VIEW 2: PRODUCT DETAIL VIEW ----------------- */}
        {(() => {
          if (!currentProduct || currentView !== 'detail') return null;
          const selectedProduct = currentProduct;
          const { rating, reviewsCount } = getProductRatingDetails(selectedProduct.id);
          const prodReviews = currentReviews.filter(r => r.productId === selectedProduct.id);
          return (
          <div className="space-y-12">
            {/* JSON-LD Structured Data for Google Search Stars */}
            <script 
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Product",
                  "name": selectedProduct.name,
                  "image": selectedProduct.images && selectedProduct.images.length > 0 ? selectedProduct.images : [selectedProduct.image],
                  "description": selectedProduct.shortDescription || selectedProduct.longDescription,
                  "sku": selectedProduct.id,
                  "mpn": selectedProduct.id,
                  "brand": {
                    "@type": "Brand",
                    "name": "meONmode"
                  },
                  "review": prodReviews.slice(0, 5).map(rev => ({
                    "@type": "Review",
                    "reviewRating": {
                      "@type": "Rating",
                      "ratingValue": rev.rating || 5,
                      "bestRating": 5
                    },
                    "author": {
                      "@type": "Person",
                      "name": rev.name
                    },
                    "reviewBody": rev.review
                  })),
                  "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": Number(rating.toFixed(1)),
                    "reviewCount": reviewsCount,
                    "bestRating": 5,
                    "worstRating": 1
                  },
                  "offers": {
                    "@type": "Offer",
                    "url": `${window.location.origin}${window.location.pathname}?product=${selectedProduct.id}`,
                    "priceCurrency": "INR",
                    "price": selectedProduct.price,
                    "priceValidUntil": "2027-12-31",
                    "itemCondition": "https://schema.org/NewCondition",
                    "availability": "https://schema.org/InStock",
                    "seller": {
                      "@type": "Organization",
                      "name": "meONmode"
                    }
                  }
                })
              }}
            />
            
            {/* Breadcrumb back navigation link */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentView('home')}
                className="text-xs text-white/80 hover:text-[#E5A93C] flex items-center gap-1.5 transition-colors font-medium bg-white/5 py-1.5 px-3.5 rounded-full border border-white/10"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to All Products</span>
              </button>
            </div>

            {/* Main Product Spotlight Card */}
            {(() => {
              return (
                <div className="bg-[#fdfbf7] text-neutral-900 border border-neutral-200/60 rounded-3xl overflow-hidden shadow-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-12">
                    
                    {/* Image Column */}
                    <div className="md:col-span-5 relative flex flex-col items-center justify-center overflow-hidden bg-[#FAF8F6] p-6 border-b md:border-b-0 md:border-r border-neutral-100 min-h-[350px] md:min-h-[450px]">
                      {selectedProduct.tag && (
                        <span className="absolute top-4 left-4 z-10 text-[10px] font-extrabold px-3 py-1.5 rounded-full tracking-wider shadow-sm bg-[#5C1D13] text-[#E5A93C] border border-[#E5A93C]/10 uppercase">
                          {selectedProduct.tag}
                        </span>
                      )}

                      {/* Floating share button with interactive sharing methods */}
                      <div className="absolute top-4 right-4 z-20 flex flex-col items-end">
                        <button
                          type="button"
                          onClick={() => setShowShareDropdown(!showShareDropdown)}
                          className="p-3 rounded-full shadow-md transition-all border border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50 cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95"
                          title="Share Options"
                        >
                          <Share2 className="w-4.5 h-4.5" />
                        </button>
                        
                        {showShareDropdown && (
                          <div className="mt-2 bg-white text-neutral-900 border border-neutral-200 p-2.5 rounded-2xl shadow-2xl flex flex-col gap-2 z-30 min-w-[170px] animate-fade-in">
                            <button
                              type="button"
                              onClick={(e) => {
                                handleShareProduct(selectedProduct, e);
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
                                const shareUrl = `${window.location.origin}${window.location.pathname}?product=${selectedProduct.id}`;
                                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${selectedProduct.name}: ${shareUrl}`)}`, '_blank');
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
                                const shareUrl = `${window.location.origin}${window.location.pathname}?product=${selectedProduct.id}`;
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

                      {/* Image Slider Component */}
                      <div className="w-full h-full relative flex flex-col justify-between items-center flex-1">
                        {/* Main Image Carousel Wrapper */}
                        <div className="relative w-full overflow-hidden flex items-center justify-center flex-1 min-h-[250px] md:min-h-[350px]">
                          {(selectedProduct.images || []).map((imgSrc, idx) => (
                            <div
                              key={idx}
                              className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out p-4 ${
                                idx === activeImageIndex 
                                  ? 'opacity-100 translate-x-0 scale-100 z-10' 
                                  : 'opacity-0 pointer-events-none'
                              } ${
                                idx < activeImageIndex ? '-translate-x-10' : idx > activeImageIndex ? 'translate-x-10' : ''
                              }`}
                            >
                              <button
                                type="button"
                                onClick={scrollToBuyingDetails}
                                className="w-full h-full flex items-center justify-center focus:outline-none group/img cursor-pointer overflow-hidden relative"
                                title="Click to view pricing & details"
                              >
                                <img 
                                  src={imgSrc} 
                                  alt={`${selectedProduct.name} - View ${idx + 1}`}
                                  loading="lazy"
                                  className="w-full h-auto max-h-[250px] md:max-h-[350px] object-contain block mx-auto crisp-img transform transition-transform duration-500 ease-out group-hover/img:scale-105"
                                  style={{ imageRendering: 'crisp-edges', WebkitImageRendering: '-webkit-optimize-contrast' }}
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
                                          <h4 class="font-serif font-extrabold text-lg text-[#5C1D13]">${selectedProduct.name}</h4>
                                          <p class="text-[10px] text-neutral-500 mt-0.5 uppercase tracking-widest font-bold">${selectedProduct.volumeOrQty}</p>
                                        `;
                                        parent.appendChild(fallback);
                                      }
                                    }
                                  }}
                                />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Left and Right Navigation Arrows (Visible only if more than 1 image) */}
                        {(selectedProduct.images || []).length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={() => setActiveImageIndex((prev) => (prev === 0 ? (selectedProduct.images || []).length - 1 : prev - 1))}
                              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-neutral-900/60 hover:bg-neutral-900/80 text-white p-2 rounded-full transition-all border border-neutral-800 active:scale-95 flex items-center justify-center cursor-pointer"
                              aria-label="Previous image"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveImageIndex((prev) => (prev === (selectedProduct.images || []).length - 1 ? 0 : prev + 1))}
                              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-neutral-900/60 hover:bg-neutral-900/80 text-white p-2 rounded-full transition-all border border-neutral-800 active:scale-95 flex items-center justify-center cursor-pointer"
                              aria-label="Next image"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </>
                        )}

                        {/* Pagination Dots (Visible only if more than 1 image) */}
                        {(selectedProduct.images || []).length > 1 && (
                          <div className="flex justify-center items-center gap-1.5 mt-2 z-20">
                            {(selectedProduct.images || []).map((_, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setActiveImageIndex(idx)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                  idx === activeImageIndex 
                                    ? 'w-5 bg-[#5C1D13]' 
                                    : 'w-1.5 bg-neutral-300 hover:bg-neutral-400'
                                  }`}
                                aria-label={`Go to slide ${idx + 1}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Info and Purchase Column */}
                    <div id="product-purchase-section" className="md:col-span-7 p-6 md:p-10 flex flex-col justify-between space-y-6">
                      
                      {/* Typography & Content Hierarchy */}
                      <div className="space-y-2">
                        {/* Gold Star Rating Block */}
                        <button
                          type="button"
                          onClick={() => setActiveReviewProduct(selectedProduct)}
                          className="flex items-center gap-1 text-neutral-800 hover:text-[#C86428] text-xs font-bold focus:outline-none transition-colors group cursor-pointer"
                          title="Click to view verified customer reviews"
                        >
                          <Star className="w-3.5 h-3.5 fill-[#E5A93C] text-[#E5A93C] group-hover:scale-110 transition-transform" />
                          {(() => {
                            const { rating, reviewsCount } = getProductRatingDetails(selectedProduct.id);
                            return (
                              <span className="underline decoration-dotted decoration-[#E5A93C]/60 hover:decoration-solid">
                                {rating.toFixed(1)} ({reviewsCount.toLocaleString('en-IN')} reviews)
                              </span>
                            );
                          })()}
                        </button>

                        {/* Main Title: Large, serif typography */}
                        <h2 className="font-serif text-3xl md:text-4xl font-black text-neutral-950 tracking-tight leading-snug">
                          {selectedProduct.name}
                        </h2>

                        {/* Subtitle: slightly tracked out uppercase sans-serif text */}
                        <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-neutral-500 mt-1">
                          {selectedProduct.subtitle} • {selectedProduct.volumeOrQty}
                        </p>
                      </div>

                      {/* Pricing & Scarcity Layout */}
                      <div className="space-y-2">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="text-3xl font-black text-neutral-950">
                              ₹{selectedProduct.price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-base font-bold line-through text-neutral-400">
                              ₹{selectedProduct.mrp.toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs font-extrabold px-3 py-1 rounded-full border border-red-200 bg-red-50 text-red-600">
                              {Math.round(((selectedProduct.mrp - selectedProduct.price) / selectedProduct.mrp) * 100)}% Off
                            </span>
                          </div>
                          <div className="flex flex-col gap-0.5 mt-1">
                            <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                              {t('inclusiveGst')}
                            </p>
                            <p className="text-[10px] text-neutral-500 font-medium">
                              ({t('priceInclusiveOfGst')})
                            </p>
                          </div>
                        </div>
                        
                        {/* Stock Alert */}
                        {(() => {
                          const stockInfo = getProductStockStatus(selectedProduct.id);
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
                                onClick={() => setNotifyMeProduct(selectedProduct)}
                                className="text-[10px] font-extrabold text-[#C86428] hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <Bell className="w-3 h-3" /> Get Alert
                              </button>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Long Description */}
                      <div className="space-y-2">
                        <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#5C1D13]">Product Therapy Summary</h4>
                        <p className="text-xs leading-relaxed md:text-sm text-neutral-600">
                          {selectedProduct.longDescription}
                        </p>
                      </div>

                      {/* Dosage Guidelines */}
                      <div className="p-4 rounded-2xl space-y-2 border border-neutral-100 bg-[#FAF8F6]">
                        <h4 className="font-serif text-sm font-bold flex items-center gap-1.5 text-[#5C1D13]">
                          <Clock className="w-4 h-4 text-[#C86428]" />
                          <span>Compliant Dosage Guidelines</span>
                        </h4>
                        <div className="text-xs leading-relaxed font-medium whitespace-pre-line pl-1.5 text-neutral-700">
                          {selectedProduct.dosage}
                        </div>
                      </div>

                      {/* Action Buttons Design & Alignment */}
                      {(() => {
                        const stockInfo = getProductStockStatus(selectedProduct.id);
                        if (stockInfo.status === 'out_of_stock') {
                          return (
                            <div className="space-y-3 pt-3 border-t border-neutral-100">
                              {/* Row 1: side-by-side Outline Back vs. Add to Cart (Disabled) */}
                              <div className="grid grid-cols-2 gap-3">
                                <button 
                                  onClick={() => setCurrentView('home')}
                                  className="text-xs font-bold py-3.5 px-4 rounded-xl border border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50 hover:border-neutral-300 text-center cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5"
                                >
                                  Back to Products
                                </button>
                                <button 
                                  disabled
                                  className="text-xs font-black py-3.5 px-4 rounded-xl bg-neutral-100 text-neutral-400 text-center cursor-not-allowed flex items-center justify-center gap-1.5"
                                >
                                  Out of Stock
                                </button>
                              </div>
                              
                              {/* Row 2: Full Width Notify Me button */}
                              <button 
                                onClick={() => setNotifyMeProduct(selectedProduct)}
                                className="w-full text-xs font-black py-4 px-4 rounded-xl bg-[#FAF6F0] border-2 border-[#C86428]/40 hover:border-[#C86428] text-[#C86428] hover:bg-[#C86428]/5 transition-all text-center flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 duration-200"
                              >
                                <Bell className="w-4 h-4 text-[#C86428]" />
                                <span>Notify Me When Restocked</span>
                              </button>

                              <div className="flex justify-center items-center gap-5 text-[11px] pt-1.5 font-medium text-neutral-500">
                                <span className="flex items-center gap-1">
                                  <Lock className="w-3.5 h-3.5 text-emerald-600" /> Secure Checkout
                                </span>
                                <span>•</span>
                                <span>Shipped in 24 Hrs</span>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div className="space-y-3 pt-3 border-t border-neutral-100">
                            {/* Row 1: side-by-side Outline Back vs. Add to Cart */}
                            <div className="grid grid-cols-2 gap-3">
                              <button 
                                onClick={() => setCurrentView('home')}
                                className="text-xs font-bold py-3.5 px-4 rounded-xl border border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50 hover:border-neutral-300 text-center cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5"
                              >
                                Back to Products
                              </button>
                              <button 
                                onClick={() => addToCart(selectedProduct, 1)}
                                className="text-xs font-black py-3.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-center cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/10"
                              >
                                Add to Cart
                              </button>
                            </div>
                            
                            {/* Row 2: Full Width Quick Buy Now (Maroon Burgundy background) */}
                            <button 
                              id="detail-quick-buy-btn"
                              onClick={() => handleQuickBuy(selectedProduct)}
                              className="w-full text-xs font-black py-4 px-4 rounded-xl bg-[#5C1D13] hover:bg-[#4A1D05] text-white transition-all text-center flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 shadow-[#5C1D13]/10 animate-breathe"
                            >
                              <ShoppingBag className="w-4 h-4 text-white" />
                              <span>Quick Buy (COD Available)</span>
                            </button>

                            <div className="flex justify-center items-center gap-5 text-[11px] pt-1.5 font-medium text-neutral-500">
                              <span className="flex items-center gap-1">
                                <Lock className="w-3.5 h-3.5 text-emerald-600" /> Secure Checkout
                              </span>
                              <span>•</span>
                              <span>Shipped in 24 Hrs</span>
                            </div>

                            {/* Premium COD Information Badge */}
                            <div id="detail-cod-info-badge" className="bg-[#FAF6F0] border border-[#E5A93C]/30 p-4 rounded-2xl flex items-start gap-3 mt-4 text-left">
                              <Truck className="w-5 h-5 text-[#C86428] shrink-0 mt-0.5" />
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5">
                                  <h4 className="text-xs font-bold text-[#4A1D05]">Cash on Delivery Available</h4>
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
                              onClick={() => {
                                setWriteReviewProductId(selectedProduct.id);
                                setIsWriteReviewOpen(true);
                              }}
                              className="w-full flex items-center justify-center gap-2 bg-[#FAF6F0] hover:bg-[#C86428]/10 text-[#C86428] border border-[#C86428]/40 font-extrabold text-xs py-3.5 px-4 rounded-xl transition-all cursor-pointer active:scale-95 shadow-sm mt-3.5"
                            >
                              <Star className="w-4 h-4 fill-[#C86428] text-[#C86428]" />
                              <span>Write a Product Review</span>
                            </button>
                          </div>
                        );
                      })()}

                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Deep-dive: Approved Medical Benefits & Action Mechanisms */}
            {selectedProduct.id === 'flowelle' ? (
              <div className="space-y-12">
                {/* 1. 8 FEMININE HEALTH PROBLEMS ADDITION */}
                <section className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                    
                    {/* Left side: Grid of problems */}
                    <div className="md:col-span-7 space-y-6">
                      <div>
                        <span className="text-xs font-bold text-[#E5A93C] uppercase tracking-widest bg-[#E5A93C]/10 px-3 py-1.5 rounded-full border border-[#E5A93C]/20">
                          Therapeutic Solution
                        </span>
                        <h3 className="font-serif text-2xl md:text-3xl font-bold text-white tracking-wide mt-3">
                          8 Feminine Health Problems Addition
                        </h3>
                        <p className="text-sm text-neutral-300 mt-2">
                          FLOWELLE is a deep-acting formulation engineered to address the 8 most critical aspects of women's physiological and hormonal health.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { title: "White Discharge (Leucorrhoea)", desc: "Controls abnormal secretion, restores healthy vaginal flora, and eliminates irritation." },
                          { title: "Irregular Periods", desc: "Regulates ovarian cycles to restore consistent, natural 28-day monthly rhythms." },
                          { title: "Hormonal Imbalance", desc: "Coordinates FSH and LH hormones to establish overall endocrine harmony." },
                          { title: "Menstrual Pain", desc: "Soothes severe pelvic contractions, backaches, and intense menstrual cramps." },
                          { title: "Low Energy", desc: "Revives cell mitochondrial stamina to eliminate daily fatigue and lethargy." },
                          { title: "Uterine Weakness", desc: "Tones and strengthens uterine muscles, preparing them for healthy functioning." },
                          { title: "Mood Swings", desc: "Reduces pre-period anxiety, irritability, and stress-induced emotional changes." },
                          { title: "Excessive Bleeding", desc: "Restricts abnormal flow volume, preventing iron loss and anemia." }
                        ].map((item, idx) => (
                          <div key={idx} className="p-4 bg-[#4A1D05]/30 border border-white/5 rounded-2xl space-y-1 hover:border-[#E5A93C]/30 transition-all group">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#E5A93C] group-hover:scale-125 transition-transform" />
                              <h4 className="font-serif font-bold text-white text-sm">{item.title}</h4>
                            </div>
                            <p className="text-xs text-neutral-300 leading-normal pl-4">{item.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right side: 8 Health Problems Image */}
                    <div className="md:col-span-5">
                      <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black/30 relative group">
                        <img 
                          src={
                            selectedProduct?.id === 'ovaira'
                              ? 'https://i.postimg.cc/Y2ftZwDN/IMG-2926.png'
                              : selectedProduct?.id === 'flowelle'
                                ? 'https://i.postimg.cc/FRYJGHVz/IMG-2917.png'
                                : 'https://i.postimg.cc/Y2ftZwDN/IMG-2926.png'
                          } 
                          alt="8 Feminine Health Solutions" 
                          loading="lazy"
                          className="w-full h-auto max-w-full object-contain block mx-auto transition-transform duration-500 group-hover:scale-105 crisp-img"
                          style={{ imageRendering: 'crisp-edges', WebkitImageRendering: '-webkit-optimize-contrast' }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://i.postimg.cc/dtsJKSzc/IMG-2931.png';
                          }}
                        />
                      </div>
                    </div>

                  </div>
                </section>

                {/* 2. POWERFUL 33-HERB FORMULA SECTION */}
                <section className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                    
                    {/* Left side: 33-Herb Formula Image */}
                    <div className="md:col-span-5 order-2 md:order-1">
                      <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black/30 relative group">
                        <img 
                          src="https://i.postimg.cc/qRNCQvxh/IMG-2918.png" 
                          alt="33-Herb Pure Formulation" 
                          loading="lazy"
                          className="w-full h-auto max-w-full object-contain block mx-auto transition-transform duration-500 group-hover:scale-105 crisp-img"
                          style={{ imageRendering: 'crisp-edges', WebkitImageRendering: '-webkit-optimize-contrast' }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://i.postimg.cc/dtsJKSzc/IMG-2931.png';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                          <p className="text-xs text-[#E5A93C] font-semibold tracking-wider uppercase font-mono">100% Pure Bharat Pharmacopoeia Standards</p>
                        </div>
                      </div>
                    </div>

                    {/* Right side: Ingredient feature */}
                    <div className="md:col-span-7 space-y-6 order-1 md:order-2">
                      <div>
                        <span className="text-xs font-bold text-[#E5A93C] uppercase tracking-widest bg-[#E5A93C]/10 px-3 py-1.5 rounded-full border border-[#E5A93C]/20">
                          Sourced Scientifically
                        </span>
                        <h3 className="font-serif text-2xl md:text-3xl font-bold text-white tracking-wide mt-3">
                          Powerful 33-Herb Formula Section
                        </h3>
                        <p className="text-sm text-neutral-300 mt-2">
                          Crafted under strict pharmaceutical guidelines as per the official <span className="text-[#E5A93C] font-semibold">Bharat Pharmacopoeia standards</span>, this multi-herb synergy incorporates thirty-three active botanical extracts for multi-system wellness.
                        </p>
                      </div>

                      <div className="space-y-4">
                        {[
                          { name: "Ashok Chal", benefit: "Supports uterine health and balance", desc: "Tones uterine muscles, regularizes menstrual bleeding volume, and manages painful dysmenorrhea." },
                          { name: "Shatavari", benefit: "Nourishes female reproductive system", desc: "Rich in natural phytoestrogens to regulate estrogen levels, boost ovulation health, and support lactation." },
                          { name: "Gokhru", benefit: "Supports hormonal balance", desc: "Directly triggers optimal endocrine wellness and combats fluid retention and pre-menstrual bloating." },
                          { name: "Ashwagandha", benefit: "Helps reduce stress and fatigue", desc: "Reduces high cortisol, calms overactive nervous symptoms, and provides healthy daily physical stamina." }
                        ].map((herb, hIdx) => (
                          <div key={hIdx} className="p-4 bg-[#4A1D05]/50 border border-white/5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <div className="space-y-1">
                              <h4 className="font-serif font-bold text-white text-base">{herb.name}</h4>
                              <p className="text-xs text-neutral-300">{herb.desc}</p>
                            </div>
                            <span className="text-[11px] font-extrabold px-3 py-1.5 rounded-full bg-[#C86428]/20 text-[#E5A93C] border border-[#C86428]/30 shrink-0 self-start sm:self-auto">
                              {herb.benefit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </section>

                {/* 3. EXACT CONSUMPTION RITUAL */}
                <section className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 space-y-8">
                  <div>
                    <div className="text-center max-w-xl mx-auto space-y-2">
                      <span className="text-xs font-bold text-[#E5A93C] uppercase tracking-widest bg-[#E5A93C]/10 px-3 py-1.5 rounded-full border border-[#E5A93C]/20">
                        Easy 30-Second Habit
                      </span>
                      <h3 className="font-serif text-2xl md:text-3xl font-bold text-white tracking-wide">
                        Exact Consumption Ritual (How to Consume)
                      </h3>
                      <p className="text-xs md:text-sm text-neutral-300">
                        Consistency is the secret to deep tissue rejuvenation. Follow this precise ritual twice daily.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-10 items-stretch">
                      
                      {/* Left: 3 Steps */}
                      <div className="md:col-span-6 flex flex-col justify-center space-y-6">
                        {[
                          { step: "Step 1", title: "Pour 5-10ml", desc: "Measure 5-10ml of FLOWELLE Syrup precisely using the custom measuring cap provided." },
                          { step: "Step 2", title: "Mix in Water", desc: "Pour into a glass of lukewarm or normal water and mix it well until evenly blended." },
                          { step: "Step 3", title: "Drink Daily", desc: "Drink daily after your meals (Morning and Evening) as a key part of your wellness routine." }
                        ].map((stepObj, sIdx) => (
                          <div key={sIdx} className="p-5 bg-[#4A1D05]/40 border border-white/5 rounded-2xl flex gap-4 items-start">
                            <span className="text-xs font-extrabold bg-[#E5A93C] text-[#4A1D05] px-3 py-1 rounded-full shrink-0">
                              {stepObj.step}
                            </span>
                            <div className="space-y-1">
                              <h4 className="font-serif font-bold text-white text-base">{stepObj.title}</h4>
                              <p className="text-xs text-neutral-300 leading-relaxed">{stepObj.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Right: Images Verified Dosage & Standardized Certification Side by Side */}
                      <div className="md:col-span-6 grid grid-cols-2 gap-4">
                        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-black/20 relative group flex flex-col justify-between">
                          <div className="p-3 bg-black/40 border-b border-white/10 text-center">
                            <p className="text-[10px] uppercase font-bold tracking-wider text-[#E5A93C] font-mono">Verified Ayurvedic Dosage</p>
                          </div>
                          <div className="flex-grow flex items-center justify-center p-2">
                            <img 
                              src={
                                selectedProduct?.id === 'ovaira'
                                  ? 'https://i.postimg.cc/Y2ftZwDN/IMG-2926.png'
                                  : 'https://i.postimg.cc/PxC8K5QK/IMG-2921.png'
                              } 
                              alt="Dosage Info" 
                              loading="lazy"
                              className="w-full h-auto max-w-full object-contain block mx-auto transition-transform duration-500 group-hover:scale-105 crisp-img"
                              style={{ imageRendering: 'crisp-edges', WebkitImageRendering: '-webkit-optimize-contrast' }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://i.postimg.cc/dtsJKSzc/IMG-2931.png';
                              }}
                            />
                          </div>
                        </div>

                        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-black/20 relative group flex flex-col justify-between">
                          <div className="p-3 bg-black/40 border-b border-white/10 text-center">
                            <p className="text-[10px] uppercase font-bold tracking-wider text-[#E5A93C] font-mono">Standardized Certification</p>
                          </div>
                          <div className="flex-grow flex items-center justify-center p-2">
                            <img 
                              src="https://i.postimg.cc/dtsJKSzc/IMG-2931.png" 
                              alt="Certification badge" 
                              loading="lazy"
                              className="w-full h-auto max-w-full object-contain block mx-auto transition-transform duration-500 group-hover:scale-105 crisp-img"
                              style={{ imageRendering: 'crisp-edges', WebkitImageRendering: '-webkit-optimize-contrast' }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://i.postimg.cc/dtsJKSzc/IMG-2931.png';
                              }}
                            />
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </section>
              </div>
            ) : (
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Left Column: Approved Benefits */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-5">
                  <h3 className="font-serif text-xl font-bold text-white border-b border-white/10 pb-3">
                    Approved Therapeutic Benefits
                  </h3>
                  <div className="space-y-3.5">
                    {selectedProduct.benefits.map((benefit, bIdx) => (
                      <div key={bIdx} className="flex gap-2.5 items-start">
                        <div className="p-0.5 bg-emerald-500/10 text-emerald-400 rounded-full mt-0.5 border border-emerald-500/20">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-xs md:text-sm text-[#F7E7D9] leading-normal font-medium">{benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column: Ayurvedic Ingredients spotlight */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-5">
                  <h3 className="font-serif text-xl font-bold text-white border-b border-white/10 pb-3">
                    Key Bio-Active Ingredients
                  </h3>
                  
                  <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black/20">
                    <img 
                      src={
                        selectedProduct?.id === 'ovaira'
                          ? 'https://i.postimg.cc/dtsJKSzc/IMG-2931.png'
                          : selectedProduct?.id === 'flowelle'
                            ? 'https://i.postimg.cc/qRNCQvxh/IMG-2918.png'
                            : 'https://i.postimg.cc/dtsJKSzc/IMG-2931.png'
                      } 
                      alt="Powerful Ingredients" 
                      loading="lazy"
                      className="w-full h-auto max-w-full object-contain block mx-auto animate-pulse-slow crisp-img"
                      style={{ imageRendering: 'crisp-edges', WebkitImageRendering: '-webkit-optimize-contrast' }}
                    />
                  </div>

                  <div className="space-y-4">
                    {selectedProduct.keyIngredients.map((ing, iIdx) => {
                      const isMens = activeCategory === 'men';
                      return (
                        <div 
                          key={iIdx} 
                          className={`p-3.5 border rounded-xl space-y-1 ${
                            isMens 
                              ? 'bg-[#4A1D05]/60 border-[#E5A93C]/20' 
                              : 'bg-[#4A1D05]/50 border-white/5'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <h4 className="font-serif font-bold text-white text-sm">{ing.name}</h4>
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                              isMens 
                                ? 'bg-[#E5A93C]/10 text-[#E5A93C] border-[#E5A93C]/20' 
                                : 'bg-[#C86428]/20 text-[#E5A93C] border-[#C86428]/30'
                            }`}>
                              {ing.benefit}
                            </span>
                          </div>
                          <p className={`text-xs leading-normal ${isMens ? 'text-neutral-300' : 'text-neutral-300'}`}>{ing.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </section>
            )}

            {/* ----------------- CUSTOMER REVIEWS DEDICATED SECTION ----------------- */}
            <section className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl mt-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="text-left">
                  <h3 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                    Verified Customer Reviews
                  </h3>
                  <p className="text-xs text-neutral-300 font-medium">Authentic feedback from real meONmode® users</p>
                </div>
                
                {/* Right side: Overall stars display & Write a Review button */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-1.5 text-[#E5A93C] text-sm font-extrabold bg-[#4A1D05]/60 px-3.5 py-2 rounded-xl border border-[#E5A93C]/20">
                    <Star className="w-4 h-4 fill-current animate-pulse-slow" />
                    {(() => {
                      const { rating, reviewsCount } = getProductRatingDetails(selectedProduct.id);
                      return (
                        <span>
                          {rating.toFixed(1)} / 5 ({reviewsCount} reviews)
                        </span>
                      );
                    })()}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setWriteReviewProductId(selectedProduct.id);
                      setIsWriteReviewOpen(true);
                    }}
                    className="bg-gradient-to-r from-[#C86428] to-[#E5A93C] hover:from-[#8B3B15] hover:to-[#C86428] text-white font-extrabold text-xs py-2.5 px-5 rounded-xl transition-all cursor-pointer shadow-md hover:shadow-[0_0_15px_rgba(200,100,40,0.3)]"
                  >
                    Write a Review
                  </button>
                </div>
              </div>

              {/* Individual reviews list */}
              {(() => {
                const prodReviews = currentReviews.filter(r => r.productId === selectedProduct.id);
                
                if (prodReviews.length === 0) {
                  return (
                    <div className="py-12 text-center text-white/50 italic space-y-3">
                      <p>No reviews submitted for this remedy yet.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setWriteReviewProductId(selectedProduct.id);
                          setIsWriteReviewOpen(true);
                        }}
                        className="bg-[#C86428]/10 hover:bg-[#C86428]/20 border border-[#C86428]/35 text-[#E5A93C] font-extrabold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                      >
                        Be the first to share your experience!
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {prodReviews.map((rev, rIdx) => {
                      const revImages = getReviewImages(rev.image);
                      return (
                        <div 
                          key={rIdx} 
                          className="bg-[#FAF6F0] text-neutral-900 rounded-2xl p-5 md:p-6 space-y-4 hover:shadow-lg transition-shadow border border-[#E5A93C]/10 text-left flex flex-col justify-between"
                        >
                          <div className="space-y-3">
                            {/* Top row: stars and verified badge */}
                            <div className="flex items-center justify-between">
                              <div className="flex text-[#E5A93C]">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-4 h-4 ${i < rev.rating ? 'fill-current' : 'text-neutral-300'}`} 
                                  />
                                ))}
                              </div>
                              {rev.verified && (
                                <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Verified Buyer</span>
                                </span>
                              )}
                            </div>

                            {/* Swipeable image gallery if images are present */}
                            {revImages.length > 0 && (
                              <div className="space-y-1">
                                {revImages.length > 1 && (
                                  <span className="block text-[8px] text-neutral-400 font-extrabold uppercase tracking-wider font-mono">◀ Swipe Photos ▶</span>
                                )}
                                <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-none py-1.5 scroll-smooth">
                                  {revImages.map((imgUrl, imgI) => (
                                    <div 
                                      key={imgI} 
                                      className="snap-center shrink-0 w-24 h-24 rounded-xl border border-neutral-200 bg-neutral-50 p-0.5 flex items-center justify-center cursor-pointer hover:border-[#C86428] transition-colors relative"
                                      onClick={() => {
                                        setLightboxImage(imgUrl);
                                        setLightboxZoom(false);
                                      }}
                                    >
                                      <img 
                                        src={imgUrl} 
                                        alt={`Review image ${imgI + 1}`} 
                                        className="w-full h-full object-cover rounded-lg"
                                        loading="lazy"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src = 'https://i.postimg.cc/dtsJKSzc/IMG-2931.png';
                                        }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Review text */}
                            <div className="space-y-1">
                              {rev.title && (
                                <h4 className="font-serif text-sm font-extrabold text-[#4A1D05] leading-snug">
                                  {rev.title}
                                </h4>
                              )}
                              <p className="text-xs text-neutral-700 leading-relaxed font-sans">{rev.review}</p>
                            </div>
                          </div>

                          {/* Footer with name and date */}
                          <div className="flex items-center justify-between text-[10px] text-neutral-400 font-semibold border-t border-neutral-100 pt-3 mt-4 font-sans uppercase tracking-wider">
                            <span>{rev.name} {rev.location ? `(${rev.location})` : ''}</span>
                            <span>{rev.date || "Verified"}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </section>

            {/* Related Products Section */}
            <section className="bg-gradient-to-br from-[#230d07] via-[#3a1508] to-[#1a0803] border border-[#E5A93C]/20 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-2">
                <div>
                  <h3 className="font-serif text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                    <span>🌿</span> Related Ayurvedic Remedies & Protocols
                  </h3>
                  <p className="text-xs text-neutral-300">Complementary formulas for complete holistic health</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs font-bold text-[#E5A93C] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  View All Products →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(() => {
                  const allUnique = Array.from(new Map([...womenProducts, ...menProducts].map(p => [p.id, p])).values());
                  const related = allUnique.filter(p => p.id !== selectedProduct.id);
                  return related.map(rel => (
                    <div 
                      key={rel.id} 
                      onClick={() => {
                        handleProductClick(rel);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-black/30 border border-white/10 hover:border-[#E5A93C]/40 rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] cursor-pointer flex flex-col justify-between space-y-3 group"
                    >
                      <div className="aspect-square w-full rounded-xl overflow-hidden bg-black/40 border border-white/5 p-2 flex items-center justify-center">
                        <img 
                          src={rel.images && rel.images.length > 0 ? rel.images[0] : ''} 
                          alt={rel.name} 
                          className="w-full h-full object-contain transform transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#E5A93C]/10 text-[#E5A93C] border border-[#E5A93C]/20">
                          {rel.tag}
                        </span>
                        <h4 className="font-serif font-bold text-white text-sm group-hover:text-[#E5A93C] transition-colors line-clamp-1">
                          {rel.name}
                        </h4>
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
                  ));
                })()}
              </div>
            </section>

          </div>
          );
        })()}

        {/* ----------------- VIEW 3: SHOPPING CART & CHECKOUT VIEW ----------------- */}
        {currentView === 'cart' && (
          <div className="space-y-8">
            <h2 className="font-serif text-3xl font-extrabold text-white text-center md:text-left">Your Wellness Cart & Secured Checkout</h2>
            
            {cart.length === 0 ? (
              /* Empty Cart State */
              <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center space-y-6 max-w-lg mx-auto">
                <div className="w-16 h-16 bg-[#C86428]/10 text-[#E5A93C] rounded-full flex items-center justify-center mx-auto border border-[#C86428]/30">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-bold text-white">Your Cart is Empty</h3>
                  <p className="text-xs text-[#F7E7D9]/80 max-w-sm mx-auto leading-relaxed">
                    Choose from our high-converting clinically balanced meONmode formulas to reset your monthly cycle health.
                  </p>
                </div>
                <button 
                  onClick={() => setCurrentView('home')}
                  className="bg-gradient-to-r from-[#C86428] to-[#E5A93C] text-white font-extrabold text-sm py-3 px-6 rounded-xl shadow-md"
                >
                  Browse Wellness Protocols
                </button>
              </div>
            ) : (
              /* Active Cart and Checkout Form Grid */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Side: Cart Items list */}
                <div className="lg:col-span-5 space-y-4">
                  
                  {/* Loyalty Reward Progress Bar Box */}
                  {(() => {
                    const total = getCartTotal();
                    const threshold = 2500;
                    const remaining = Math.max(0, threshold - total);
                    const percent = Math.min(100, Math.round((total / threshold) * 100));
                    
                    return (
                      <div className="bg-gradient-to-br from-[#4A1D05]/80 to-[#5C1D13]/60 border border-[#E5A93C]/20 rounded-2xl p-4 shadow-xl space-y-3 sticky top-4 z-10 backdrop-blur-md">
                        <div className="flex items-center gap-2 text-white">
                          <Sparkles className="w-4.5 h-4.5 text-[#E5A93C] animate-pulse shrink-0" />
                          <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#E5A93C]">Loyalty Reward Tracker</h4>
                        </div>
                        
                        {remaining > 0 ? (
                          <p className="text-xs text-[#F7E7D9] leading-relaxed">
                            Spend <span className="font-black text-amber-300">₹{remaining.toLocaleString('en-IN')}</span> more to unlock <span className="font-bold text-emerald-300 underline">Free Premium Ayurvedic Samples</span> in your shipment!
                          </p>
                        ) : (
                          <p className="text-xs text-emerald-400 font-bold leading-relaxed flex items-center gap-1.5 animate-pulse">
                            🎉 Loyalty Reward Unlocked! Free premium Ayurvedic samples have been added to your package.
                          </p>
                        )}
                        
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[10px] font-mono text-neutral-300">
                            <span>Progress: {percent}%</span>
                            <span>₹{total.toLocaleString('en-IN')} / ₹{threshold.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="w-full h-3 bg-neutral-900/60 rounded-full border border-white/5 overflow-hidden p-0.5">
                            <div 
                              className={`h-full rounded-full transition-all duration-700 ease-out ${
                                remaining > 0 
                                  ? 'bg-gradient-to-r from-[#C86428] to-[#E5A93C] shadow-[0_0_8px_rgba(229,169,60,0.5)]' 
                                  : 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.7)]'
                              }`} 
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  <h3 className="font-serif text-lg font-bold text-white">Order Summary</h3>
                  
                  <div className="space-y-3">
                    {translatedCart.map((item) => (
                      <div 
                        key={item.product.id}
                        className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4 justify-between items-center"
                      >
                        <div className="flex-grow space-y-1">
                          <h4 className="font-serif font-bold text-sm text-white line-clamp-1">{item.product.name}</h4>
                          <p className="text-[10px] text-[#E5A93C] font-semibold">{item.product.volumeOrQty}</p>
                          <p 
                            className="text-xs font-black text-white pt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                            style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)' }}
                          >
                            ₹{item.product.price.toLocaleString('en-IN')} each
                          </p>
                        </div>

                        {/* Quantity Modifier */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center bg-[#4A1D05]/60 rounded-xl border border-white/10 px-1 py-1">
                            <button 
                              onClick={() => updateQuantity(item.product.id, -1)}
                              className="p-1 text-white hover:text-[#E5A93C]"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2 text-xs font-bold text-white w-6 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.product.id, 1)}
                              className="p-1 text-white hover:text-[#E5A93C]"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button 
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/10 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Calculations breakdown */}
                  {(() => {
                    const totalBill = getCartTotal();
                    const taxableValue = Math.round((totalBill / 1.05) * 100) / 100;
                    const totalGst = Math.round((totalBill - taxableValue) * 100) / 100;
                    const cgst = Math.round((totalGst / 2) * 100) / 100;
                    const sgst = Math.round((totalGst / 2) * 100) / 100;

                    return (
                      <div className="bg-[#4A1D05]/50 border border-white/10 rounded-2xl p-5 space-y-3 text-xs">
                        <div className="flex justify-between text-[#F7E7D9]/80 font-semibold drop-shadow-sm">
                          <span>{t('originalPriceMrp')}</span>
                          <span className="line-through text-white font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>₹{getCartMrpTotal().toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-white font-extrabold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                          <span>{t('herbalDiscountSavings')}</span>
                          <span>-₹{(getCartMrpTotal() - totalBill).toLocaleString('en-IN')}</span>
                        </div>

                        <div className="border-t border-white/10 my-2"></div>

                        <div className="flex justify-between text-[#F7E7D9]/80 font-semibold drop-shadow-sm">
                          <span>{t('subtotal')} ({t('priceInclusiveOfGst')})</span>
                          <span className="text-white font-bold" style={{ textShadow: '0 1.5px 3px rgba(0,0,0,0.8)' }}>₹{totalBill.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="flex justify-between text-[#F7E7D9]/80 font-semibold drop-shadow-sm">
                          <span>{t('delivery')}</span>
                          <span className="text-emerald-400 font-bold uppercase tracking-wider">{t('freeDelivery')}</span>
                        </div>

                        <div className="border-t border-dashed border-white/10 my-2"></div>

                        <div className="flex justify-between text-[#F7E7D9]/70 text-[11px]">
                          <span>{t('taxableValueLabel')}</span>
                          <span className="text-neutral-300 font-medium">₹{taxableValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between text-[#F7E7D9]/70 text-[11px]">
                          <span>{t('cgstLabel')}</span>
                          <span className="text-neutral-300 font-medium">₹{cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between text-[#F7E7D9]/70 text-[11px]">
                          <span>{t('sgstLabel')}</span>
                          <span className="text-neutral-300 font-medium">₹{sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between text-[#F7E7D9]/80 font-semibold text-[11px]">
                          <span>{t('totalGstLabel')}</span>
                          <span className="text-white font-bold">₹{totalGst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </div>
                        
                        <div className="border-t border-white/10 pt-3 space-y-2">
                          <div className="flex justify-between items-baseline">
                            <span className="font-serif text-sm font-bold text-white drop-shadow-md">{t('totalProductBill')}</span>
                            <span 
                              className="font-serif text-lg font-black text-white"
                              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                            >
                              ₹{totalBill.toLocaleString('en-IN')}
                            </span>
                          </div>

                          {paymentMethod === 'cod' ? (
                            <>
                              <div className="flex justify-between items-baseline text-xs text-amber-300 font-extrabold">
                                <span>{t('codAdvanceLabel')}</span>
                                <span>-₹150</span>
                              </div>
                              <div className="flex justify-between items-baseline text-sm text-emerald-400 font-extrabold border-t border-dashed border-white/10 pt-1">
                                <span>{t('balanceDueLabel')}</span>
                                <span>₹{(totalBill - 150).toLocaleString('en-IN')}</span>
                              </div>
                            </>
                          ) : (
                            <div className="flex justify-between items-baseline text-xs text-emerald-400 font-extrabold">
                              <span>{t('paidInFullLabel')}</span>
                              <span>₹{totalBill.toLocaleString('en-IN')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Packaging Guarantee Box */}
                  <div className="p-4 bg-[#5C1D13] border border-[#E5A93C]/20 rounded-2xl flex gap-3 items-start">
                    <Lock className="w-5 h-5 text-[#E5A93C] shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <h4 className="font-serif text-sm font-bold text-white">Absolute Privacy Guaranteed</h4>
                      <p className="text-[11px] text-[#F7E7D9]/90 leading-normal mt-0.5">
                        We send your order in a 100% blank corrugated box with no labels, references to period health or meONmode branding. Handled with absolute secrecy.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Side: Checkout Form (Integrated WhatsApp functionality) */}
                <div className="lg:col-span-7">
                  <div className="bg-[#FDFEFE] text-neutral-900 rounded-3xl p-6 md:p-8 shadow-2xl border border-amber-light">
                    <div className="space-y-1.5 border-b border-neutral-100 pb-4 mb-6">
                      <h3 className="font-serif text-xl font-bold text-[#4A1D05]">
                        {checkoutStep === 1 ? "Step 1: Fill Delivery Details" : "Step 2: Choose Payment Method"}
                      </h3>
                      <p className="text-xs text-neutral-500">
                        {checkoutStep === 1 
                          ? "Provide shipping details to book your parcel with 100% discreet packaging." 
                          : "Select how you would like to complete your wellness order."}
                      </p>
                    </div>

                    <form onSubmit={handleCheckoutSubmit} className="space-y-5">
                      {checkoutStep === 1 ? (
                        <>
                          {/* Name input */}
                          <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-[#4A1D05] uppercase tracking-wider">
                              Full Name *
                            </label>
                            <input 
                              type="text"
                              placeholder="Enter your full name"
                              value={checkout.fullName}
                              onChange={(e) => {
                                setCheckout({ ...checkout, fullName: e.target.value });
                                if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: '' });
                              }}
                              className={`w-full text-sm bg-neutral-50 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#C86428] ${
                                formErrors.fullName ? 'border-red-500 bg-red-50/50' : 'border-neutral-200'
                              }`}
                            />
                            {formErrors.fullName && (
                              <span className="text-[11px] text-red-500 font-semibold">{formErrors.fullName}</span>
                            )}
                          </div>

                          {/* Phone input */}
                          <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-[#4A1D05] uppercase tracking-wider">
                              Active Mobile Number (WhatsApp Compatible) *
                            </label>
                            <div className="relative">
                              <span className="absolute left-3.5 top-3 text-neutral-400 font-semibold text-sm">+91</span>
                              <input 
                                type="tel"
                                maxLength={10}
                                placeholder="Enter 10-digit mobile number"
                                value={checkout.phone}
                                onChange={(e) => {
                                  // Only allow numbers
                                  const cleaned = e.target.value.replace(/\D/g, '');
                                  setCheckout({ ...checkout, phone: cleaned });
                                  if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' });
                                }}
                                className={`w-full text-sm bg-neutral-50 pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#C86428] ${
                                  formErrors.phone ? 'border-red-500 bg-red-50/50' : 'border-neutral-200'
                                }`}
                              />
                            </div>
                            {formErrors.phone ? (
                              <span className="text-[11px] text-red-500 font-semibold block">{formErrors.phone}</span>
                            ) : (
                              <span className="text-[10px] text-neutral-400 block pl-1">Important: Our courier team calls on this number to confirm dispatch before shipping.</span>
                            )}
                          </div>

                          {/* Address Input */}
                          <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-[#4A1D05] uppercase tracking-wider">
                              Complete Shipping Address *
                            </label>
                            <textarea 
                              rows={3}
                              placeholder="House No, Building, Street, Landmark, Village, City, State"
                              value={checkout.address}
                              onChange={(e) => {
                                setCheckout({ ...checkout, address: e.target.value });
                                if (formErrors.address) setFormErrors({ ...formErrors, address: '' });
                              }}
                              className={`w-full text-sm bg-neutral-50 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#C86428] ${
                                formErrors.address ? 'border-red-500 bg-red-50/50' : 'border-neutral-200'
                              }`}
                            />
                            {formErrors.address && (
                              <span className="text-[11px] text-red-500 font-semibold">{formErrors.address}</span>
                            )}
                          </div>

                          {/* Pincode Input */}
                          <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-[#4A1D05] uppercase tracking-wider">
                              Pincode *
                            </label>
                            <input 
                              type="text"
                              maxLength={6}
                              placeholder="Enter 6-digit Pincode"
                              value={checkout.pincode}
                              onChange={(e) => {
                                // Only allow numbers
                                const cleaned = e.target.value.replace(/\D/g, '');
                                setCheckout({ ...checkout, pincode: cleaned });
                                if (formErrors.pincode) setFormErrors({ ...formErrors, pincode: '' });
                              }}
                              className={`w-full text-sm bg-neutral-50 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#C86428] ${
                                formErrors.pincode ? 'border-red-500 bg-red-50/50' : 'border-neutral-200'
                              }`}
                            />
                            {formErrors.pincode && (
                              <span className="text-[11px] text-red-500 font-semibold">{formErrors.pincode}</span>
                            )}
                          </div>

                          {/* Action trigger button */}
                          <div className="pt-4 border-t border-neutral-100">
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                if (validateForm()) {
                                  setCheckoutStep(2);
                                }
                              }}
                              className="w-full bg-[#C86428] hover:bg-[#8B3B15] text-white font-extrabold text-base py-4 rounded-xl flex items-center justify-center gap-2.5 transition-all hover:shadow-[0_0_15px_rgba(200,100,40,0.5)] shadow-lg active:scale-95 duration-200"
                            >
                              <span>Proceed to Payment</span>
                              <ChevronRight className="w-5 h-5" />
                            </button>
                            
                            <span className="block text-center text-[10px] text-[#C86428] font-bold mt-2.5">
                              *Provide details first. Cash on Delivery requires a ₹150 advance to confirm order.
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Shipping Details Summary */}
                          <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4 space-y-2 relative">
                            <button
                              type="button"
                              onClick={() => setCheckoutStep(1)}
                              className="absolute top-4 right-4 text-xs font-bold text-[#C86428] hover:underline flex items-center gap-1"
                            >
                              <ArrowLeft className="w-3 h-3" /> Edit
                            </button>
                            <h4 className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider">Shipping Destination</h4>
                            <div className="text-sm font-semibold text-[#4A1D05]">{checkout.fullName}</div>
                            <div className="text-xs text-neutral-600 font-medium">+91 {checkout.phone}</div>
                            <div className="text-xs text-neutral-500 leading-relaxed max-w-[85%]">{checkout.address}, {checkout.pincode}</div>
                          </div>

                          {/* Incentive Text */}
                          <div className="bg-amber-50 border border-amber-200/60 p-4 rounded-2xl flex items-start gap-2.5 text-xs text-neutral-800 shadow-sm mb-4">
                            <span className="text-sm">💡</span>
                            <p className="leading-relaxed font-medium">
                              To prevent fraud, a <strong className="text-red-700 font-extrabold">₹150 advance payment is mandatory</strong> for all Cash on Delivery (COD) orders. This ₹150 will be fully deducted from your bill upon delivery.
                            </p>
                          </div>

                          {/* Select Payment Method */}
                          <div className="space-y-3">
                            <label className="block text-xs font-bold text-[#4A1D05] uppercase tracking-wider">
                              Select Payment Method *
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {/* COD Option */}
                              <button
                                type="button"
                                onClick={() => setPaymentMethod('cod')}
                                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                                  paymentMethod === 'cod'
                                    ? 'border-[#C86428] bg-[#C86428]/5 ring-2 ring-[#C86428]'
                                    : 'border-neutral-200 bg-white hover:bg-neutral-50'
                                }`}
                              >
                                <div className={`p-2 rounded-xl mt-0.5 ${paymentMethod === 'cod' ? 'bg-[#C86428]/10 text-[#C86428]' : 'bg-neutral-100 text-neutral-500'}`}>
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                  </svg>
                                </div>
                                <div>
                                  <span className="block text-sm font-bold text-[#4A1D05]">Cash on Delivery (COD)</span>
                                  <span className="block text-[10px] text-neutral-500 mt-0.5">Pay balance upon delivery</span>
                                </div>
                              </button>

                              {/* UPI Option */}
                              <button
                                type="button"
                                onClick={() => setPaymentMethod('upi')}
                                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                                  paymentMethod === 'upi'
                                    ? 'border-[#C86428] bg-[#C86428]/5 ring-2 ring-[#C86428]'
                                    : 'border-neutral-200 bg-white hover:bg-neutral-50'
                                }`}
                              >
                                <div className={`p-2 rounded-xl mt-0.5 ${paymentMethod === 'upi' ? 'bg-[#C86428]/10 text-[#C86428]' : 'bg-neutral-100 text-neutral-500'}`}>
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h2M4 8h16M4 16h16" />
                                  </svg>
                                </div>
                                <div>
                                  <span className="block text-sm font-bold text-[#4A1D05]">Prepaid UPI</span>
                                  <span className="block text-[10px] text-neutral-500 mt-0.5">Pay 100% full amount now</span>
                                </div>
                              </button>
                            </div>
                          </div>

                          {/* Dynamic UPI Details & QR Code display */}
                          <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-5 flex flex-col items-center text-center space-y-4 animate-fade-in">
                            {paymentMethod === 'cod' && (
                              <div className="w-full bg-red-50 border-2 border-red-200 p-4 rounded-xl text-left text-neutral-800 space-y-2 mb-2">
                                <h4 className="font-extrabold text-xs text-red-700 uppercase tracking-wider flex items-center gap-1.5">
                                  <span>⚠️</span>
                                  <span>Mandatory COD Rule</span>
                                </h4>
                                <p className="text-[11px] leading-relaxed font-semibold">
                                  To confirm your COD order, an advance payment of ₹150 is mandatory. This ₹150 will be deducted from your product's total bill amount at delivery. Your order will only be processed after the ₹150 advance is successfully paid.
                                </p>
                                <label className="flex items-center gap-2 pt-1 pb-1 cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={codAcknowledged}
                                    onChange={(e) => setCodAcknowledged(e.target.checked)}
                                    className="w-4 h-4 text-emerald-600 border-neutral-300 rounded focus:ring-emerald-500 cursor-pointer"
                                  />
                                  <span className="text-[11px] font-bold text-neutral-900 leading-tight">
                                    I accept and have paid the ₹150 advance.
                                  </span>
                                </label>
                              </div>
                            )}

                            <span className="text-[10px] uppercase font-bold text-[#E5A93C] bg-amber-950 px-3 py-1 rounded-full tracking-widest font-mono">
                              {paymentMethod === 'cod' ? "Pay ₹150 Advance to Confirm" : `Pay Full Amount ₹${getCartTotal().toLocaleString('en-IN')}`}
                            </span>

                            <div className="bg-white p-3 rounded-2xl shadow-md border border-neutral-100 relative">
                              <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                                  `upi://pay?pa=9350302092m@pnb&pn=MEONMODE ENTERPRISES&am=${paymentMethod === 'cod' ? '150' : getCartTotal()}&cu=INR`
                                )}`} 
                                alt="meONmode UPI QR Code" 
                                className="w-48 h-48 block object-contain"
                              />
                              <div className="absolute inset-0 border border-black/5 rounded-2xl pointer-events-none"></div>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">UPI Merchant</span>
                              <div className="text-sm font-extrabold text-[#4A1D05]">MEONMODE ENTERPRISES</div>
                              <div className="text-xs bg-white border border-neutral-200 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 font-mono text-neutral-700 font-semibold mt-1">
                                <span>9350302092m@pnb</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText('9350302092m@pnb');
                                    alert('UPI ID copied to clipboard!');
                                  }}
                                  className="text-[#C86428] hover:text-[#8B3B15] font-sans text-[10px] font-bold uppercase ml-1 border-l pl-1.5 border-neutral-200 cursor-pointer"
                                >
                                  Copy
                                </button>
                              </div>
                            </div>
                            <div className="text-[11px] text-neutral-500 leading-normal max-w-sm">
                              {paymentMethod === 'cod' 
                                ? "Scan to pay the ₹150 COD Advance via GPay, PhonePe, Paytm, or BHIM. Your order will be confirmed instantly."
                                : `Scan to pay the full product bill of ₹${getCartTotal().toLocaleString('en-IN')} via any UPI app.`}
                            </div>
                          </div>

                          {/* Action trigger button */}
                          <div className="pt-4 border-t border-neutral-100 space-y-4">
                            {!dismissedBanner && (
                              <div className="bg-amber-50 border-l-4 border-amber-500 p-3.5 rounded-r-xl flex items-start gap-2.5 text-xs text-neutral-700 animate-fade-in relative shadow-sm">
                                <span className="shrink-0 text-base">📦</span>
                                <div className="flex-grow pr-6 leading-relaxed font-medium">
                                  Please record an unboxing video when your order arrives — required for any return/refund claims.{' '}
                                  <button 
                                    type="button" 
                                    onClick={() => setCurrentView('refund-policy')} 
                                    className="text-[#C86428] font-extrabold hover:underline"
                                  >
                                    [Read Return Policy]
                                  </button>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setDismissedBanner(true)}
                                  className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-600 font-extrabold text-xs"
                                  aria-label="Dismiss banner"
                                >
                                  ✕
                                </button>
                              </div>
                            )}

                            <button 
                              id="whatsapp-confirm-btn"
                              type="submit"
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base py-4 rounded-xl flex items-center justify-center gap-2.5 transition-all hover:shadow-[0_0_15px_rgba(200,100,40,0.5)] shadow-lg active:scale-95 duration-200"
                            >
                              <Send className="w-5 h-5" />
                              <span>Confirm Order via WhatsApp</span>
                            </button>
                            
                            <span className="block text-center text-[10px] text-neutral-400 mt-2.5">
                              *Upon clicking, your order details will compile instantly. Please hit "Send" in WhatsApp to register. Your screen here will update automatically.
                            </span>
                          </div>
                        </>
                      )}
                    </form>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* ----------------- VIEW 4: ORDER SUCCESS VIEW ----------------- */}
        {currentView === 'success' && (
          <div className="max-w-xl mx-auto space-y-6 text-center py-10">
            
            {/* Big Green/Gold Confirmation Badge */}
            <div className="relative inline-flex items-center justify-center">
              <div className="absolute inset-0 bg-emerald-500/25 rounded-full blur-xl scale-125 animate-pulse"></div>
              <div className="w-24 h-24 bg-[#E5A93C]/10 border-4 border-[#E5A93C] text-[#E5A93C] rounded-full flex items-center justify-center relative z-10 animate-bounce">
                <Check className="w-12 h-12 stroke-[3.5]" />
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-white">Order Passed to WhatsApp!</h1>
              <p className="text-[#E5A93C] font-serif text-base font-bold italic">"Your wellness journey has officially begun."</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 text-sm text-left">
              <p className="text-white/90 leading-relaxed text-xs md:text-sm">
                We have successfully compiled your delivery options and initiated the WhatsApp link. Our meONmode dispatch team is validating pincodes right now.
              </p>

              <div className="p-3 bg-[#5C1D13] border border-white/5 rounded-xl flex gap-3 items-start">
                <Lock className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                <span className="text-[11px] text-[#F7E7D9] font-medium">
                  Shipped in 100% Discreet Packaging for your absolute privacy. No product text or branding is printed on the courier slip.
                </span>
              </div>

              {lastOrderId && (
                <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl space-y-2.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400 font-medium">Generated Order Reference:</span>
                    <span className="font-mono font-black text-[#E5A93C] text-sm bg-black/40 px-2.5 py-1 rounded border border-white/10 flex items-center gap-1.5 shadow-md">
                      {lastOrderId}
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(lastOrderId);
                          setShowToast("Order ID copied!");
                          setTimeout(() => setShowToast(null), 3000);
                        }}
                        className="text-white/60 hover:text-white transition-colors cursor-pointer p-0.5"
                        title="Copy Order ID"
                      >
                        <Clipboard className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  </div>
                </div>
              )}

              <div className="border-t border-white/10 pt-3 space-y-2 text-xs text-neutral-300">
                <div className="flex justify-between">
                  <span>Estimated Dispatch:</span>
                  <span className="font-bold text-white">Within 12 Hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Transit Time:</span>
                  <span className="font-bold text-white">3 to 5 Business Days</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-bold text-emerald-400">
                    {paymentMethod === 'cod' ? "Cash On Delivery (COD)" : "Pay via UPI (Scan & Pay)"}
                  </span>
                </div>
              </div>

              {/* Unboxing Video Reminder Banner */}
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex gap-3 items-start">
                <span className="text-base shrink-0 mt-0.5">🎥</span>
                <p className="text-[11px] md:text-xs text-[#F7E7D9] leading-relaxed">
                  <strong>Reminder:</strong> Please record an unboxing video when your package arrives. This is required for any future return or refund requests.{' '}
                  <button 
                    onClick={() => setCurrentView('refund-policy')}
                    className="text-[#E5A93C] font-extrabold hover:underline cursor-pointer"
                  >
                    [View Return Policy →]
                  </button>
                </p>
              </div>

              {/* GST Tax Invoice Toggle */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowInvoice(!showInvoice)}
                  className="w-full bg-[#E5A93C]/10 hover:bg-[#E5A93C]/20 border border-[#E5A93C]/30 text-[#E5A93C] font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300"
                >
                  <span>📄</span>
                  <span>{showInvoice ? "Hide GST Tax Invoice" : "View GST Tax Invoice"}</span>
                </button>
              </div>

              {showInvoice && (
                <div className="bg-white text-neutral-900 border border-neutral-200 rounded-2xl p-6 space-y-4 text-xs shadow-2xl animate-fade-in text-left">
                  <div className="flex justify-between items-start border-b border-neutral-200 pb-4">
                    <div>
                      <h3 className="font-serif text-base font-black tracking-tight text-[#4A1D05]">meONmode Ayurvedic Wellness</h3>
                      <p className="text-[10px] text-neutral-500 font-medium mt-0.5">meONmode Wellness LLP</p>
                      <p className="text-[10px] text-neutral-500 leading-normal mt-1">
                        Ayurvedic Pharmacy Licence No: DL-3234-A<br />
                        GSTIN: 07AAGCM1314R1ZN
                      </p>
                    </div>
                    <div className="text-right">
                      <h4 className="font-sans font-black text-xs text-neutral-800 uppercase tracking-widest">{t('invoiceTitle')}</h4>
                      <p className="text-[10px] text-neutral-500 font-medium mt-1">
                        Invoice No: <strong>INV/2026-27/{lastOrderId}</strong><br />
                        Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-b border-neutral-200 pb-4">
                    <div>
                      <p className="font-bold text-[10px] text-neutral-400 uppercase tracking-wider">Billed To (Customer):</p>
                      <p className="font-black text-neutral-800 mt-1">{checkout.fullName}</p>
                      <p className="text-neutral-600 leading-normal mt-0.5">
                        {checkout.address}<br />
                        Pincode: <strong>{checkout.pincode}</strong><br />
                        Phone: {checkout.phone}
                      </p>
                    </div>
                    <div className="text-right col-span-1">
                      <p className="font-bold text-[10px] text-neutral-400 uppercase tracking-wider">Place of Supply:</p>
                      <p className="font-bold text-neutral-800 mt-1">Delhi / Haryana / Other (India)</p>
                      <p className="text-neutral-500 leading-normal mt-1">
                        Discreet Courier Shipping<br />
                        Delivery Method: {paymentMethod === 'cod' ? 'Cash On Delivery' : 'Prepaid UPI'}
                      </p>
                    </div>
                  </div>

                  {/* Table with Goods & HSN */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-[11px] text-left border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-300 text-neutral-500 font-bold">
                          <th className="py-2">Description</th>
                          <th className="py-2 text-center">HSN</th>
                          <th className="py-2 text-center">Qty</th>
                          <th className="py-2 text-right">Price (Incl.)</th>
                          <th className="py-2 text-right">Taxable</th>
                          <th className="py-2 text-right">CGST</th>
                          <th className="py-2 text-right">SGST</th>
                          <th className="py-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {translatedCart.map((item, idx) => {
                          const itemTotal = item.product.price * item.quantity;
                          const itemTaxable = Math.round((itemTotal / 1.05) * 100) / 100;
                          const itemGst = Math.round((itemTotal - itemTaxable) * 100) / 100;
                          const itemCgst = Math.round((itemGst / 2) * 100) / 100;
                          const itemSgst = Math.round((itemGst / 2) * 100) / 100;

                          return (
                            <tr key={idx} className="border-b border-neutral-100 text-neutral-700 font-medium">
                              <td className="py-2.5 font-bold text-neutral-800 max-w-[100px] truncate">{item.product.name}</td>
                              <td className="py-2.5 text-center">30049011</td>
                              <td className="py-2.5 text-center">{item.quantity}</td>
                              <td className="py-2.5 text-right">₹{item.product.price.toLocaleString('en-IN')}</td>
                              <td className="py-2.5 text-right">₹{itemTaxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                              <td className="py-2.5 text-right">₹{itemCgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                              <td className="py-2.5 text-right">₹{itemSgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                              <td className="py-2.5 text-right font-bold text-neutral-900">₹{itemTotal.toLocaleString('en-IN')}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Invoice Summary Totals */}
                  <div className="pt-2 border-t border-neutral-200">
                    {(() => {
                      const totalBill = getCartTotal();
                      const taxableValue = Math.round((totalBill / 1.05) * 100) / 100;
                      const totalGst = Math.round((totalBill - taxableValue) * 100) / 100;
                      const cgst = Math.round((totalGst / 2) * 100) / 100;
                      const sgst = Math.round((totalGst / 2) * 100) / 100;

                      return (
                        <div className="space-y-1.5 text-[11px] text-neutral-600 font-medium">
                          <div className="flex justify-between">
                            <span>Total Taxable Value:</span>
                            <span>₹{taxableValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>CGST (2.5%):</span>
                            <span>₹{cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>SGST (2.5%):</span>
                            <span>₹{sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between border-t border-neutral-100 pt-1.5 font-bold text-neutral-800">
                            <span>Total GST (5%):</span>
                            <span>₹{totalGst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between border-t border-neutral-200 pt-2 font-black text-xs text-[#4A1D05]">
                            <span>Grand Total (Total Amount Payable):</span>
                            <span>₹{totalBill.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Footnote Declaration */}
                  <div className="pt-3 border-t border-neutral-100 text-[10px] text-neutral-400 italic text-center leading-normal">
                    This is a computer-generated GST tax invoice and does not require a physical signature.<br />
                    Classified under HSN 30049011 (Ayurvedic Patent Medicines - GST @ 5%).
                  </div>

                  {/* Print Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="w-full bg-[#4A1D05] hover:bg-[#5C1D13] text-white font-bold py-2.5 rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>🖨️</span>
                      <span>Print/Save PDF Invoice</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => {
                  setCart([]);
                  setCurrentView('home');
                }}
                className="flex-grow bg-gradient-to-r from-[#C86428] to-[#E5A93C] text-white font-extrabold text-sm py-4 rounded-xl shadow-md"
              >
                Return to Homepage
              </button>
              
              <a 
                href="https://api.whatsapp.com/send?phone=917290810336&text=Hello%20meONmode%20Team%2C%20I%20wanted%20to%20follow%20up%20on%20my%20order.%20Please%20guide%20me."
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-grow bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm py-4 rounded-xl flex items-center justify-center gap-2"
              >
                <span>Chat with Doctor</span>
              </a>
            </div>

          </div>
        )}

        {/* ----------------- VIEW 5: REFUND & RETURN POLICY VIEW ----------------- */}
        {currentView === 'refund-policy' && (
          <div className="max-w-3xl mx-auto space-y-8 py-4 animate-fade-in text-left">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <button
                onClick={() => setCurrentView('home')}
                className="p-2 hover:bg-white/10 rounded-full text-white transition-colors flex items-center justify-center cursor-pointer"
                aria-label="Back to home"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="font-serif text-3xl font-extrabold text-white">Refund & Return Policy</h1>
                <p className="text-[#E5A93C] text-xs font-semibold tracking-wider uppercase mt-1">meONmode Ayurvedic Wellness Standards</p>
              </div>
            </div>

            <div className="space-y-6 text-sm text-white/90 leading-relaxed bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
              
              {/* Section 1 */}
              <div className="space-y-2">
                <h3 className="font-serif text-lg font-bold text-[#E5A93C] flex items-center gap-2">
                  <span className="text-sm bg-[#E5A93C]/10 px-2.5 py-1 rounded-md text-[#E5A93C] font-sans font-extrabold">01</span>
                  Eligibility & Scope
                </h3>
                <p className="text-white/80 pl-10">
                  At meONmode, we want you to be completely satisfied with your wellness purchase. We offer full refund or replacements only on damaged, incorrect, or defective products. Due to the high-purity, clinical nature of Ayurvedic medicine, personal preference or subjective changes in symptom relief timing do not qualify as defects.
                </p>
              </div>

              {/* Section 2 - Highlighted Callout Box */}
              <div className="space-y-2">
                <h3 className="font-serif text-lg font-bold text-[#E5A93C] flex items-center gap-2">
                  <span className="text-sm bg-[#E5A93C]/10 px-2.5 py-1 rounded-md text-[#E5A93C] font-sans font-extrabold">02</span>
                  Mandatory Unboxing Video Requirement
                </h3>
                <div className="pl-10">
                  <div className="bg-gradient-to-br from-[#5C1D13] to-[#4A1D05] border-2 border-[#E5A93C] rounded-2xl p-5 md:p-6 space-y-3.5 shadow-lg">
                    <div className="flex items-center gap-2.5 text-[#E5A93C] font-serif font-black text-sm uppercase tracking-wide">
                      <span className="text-xl">⚠️</span> IMPORTANT: Unboxing Video Required
                    </div>
                    <p className="text-xs text-[#F7E7D9] leading-relaxed">
                      To qualify for a refund, return, or replacement, you MUST record a continuous unboxing video. No claims will be entertained without this proof under any circumstances.
                    </p>
                    <div className="space-y-2 border-t border-white/10 pt-3">
                      <h4 className="text-xs font-extrabold text-[#E5A93C] uppercase tracking-wider">How to record a valid unboxing video:</h4>
                      <ol className="list-decimal list-inside text-xs text-[#F7E7D9]/90 space-y-1.5 pl-1 leading-relaxed font-medium">
                        <li>Start recording <strong className="text-white font-extrabold underline">BEFORE</strong> opening the outer corrugated box packaging.</li>
                        <li>The shipping courier label showing your name, complete address, and barcode must be clearly visible and in focus.</li>
                        <li>Keep the video completely continuous and unedited. Absolutely NO cuts, pans, or pauses are permitted.</li>
                        <li>Physically show all items inside and inspect them in front of the camera, highlighting any leakage or breakages.</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div className="space-y-2">
                <h3 className="font-serif text-lg font-bold text-[#E5A93C] flex items-center gap-2">
                  <span className="text-sm bg-[#E5A93C]/10 px-2.5 py-1 rounded-md text-[#E5A93C] font-sans font-extrabold">03</span>
                  How to Submit a Claim
                </h3>
                <div className="text-white/80 pl-10 space-y-2">
                  <p>
                    Please submit your claim within <strong className="text-white">48 hours</strong> of package delivery. Send the raw, uncut unboxing video along with your Order ID through either of the channels below:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <a 
                      href="https://api.whatsapp.com/send?phone=917290810336&text=Hello%20meONmode%20Team%2C%20I%20would%20like%20to%20file%20a%20refund%2Freplacement%20claim." 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-emerald-600/25 hover:bg-emerald-600/35 border border-emerald-500/30 p-3 rounded-xl flex items-center gap-2 text-white font-semibold text-xs transition-colors"
                    >
                      <span className="text-base">💬</span>
                      WhatsApp Support: +91 72908 10336
                    </a>
                    <a 
                      href="mailto:meonmodewellness@gmail.com" 
                      className="bg-blue-600/25 hover:bg-blue-600/35 border border-blue-500/30 p-3 rounded-xl flex items-center gap-2 text-white font-semibold text-xs transition-colors"
                    >
                      <span className="text-base">✉️</span>
                      Email: meonmodewellness@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Section 4 */}
              <div className="space-y-2">
                <h3 className="font-serif text-lg font-bold text-[#E5A93C] flex items-center gap-2">
                  <span className="text-sm bg-[#E5A93C]/10 px-2.5 py-1 rounded-md text-[#E5A93C] font-sans font-extrabold">04</span>
                  Review & Processing Timeframe
                </h3>
                <p className="text-white/80 pl-10">
                  Our quality assurance team will inspect your submitted video evidence within <strong className="text-white">2 to 3 business days</strong>. Once approved, a replacement package will be dispatched at zero additional cost, or a direct refund will be credited to your original payment method/bank account within <strong className="text-white">7 business days</strong>.
                </p>
              </div>

              {/* Section 5 */}
              <div className="space-y-2">
                <h3 className="font-serif text-lg font-bold text-[#E5A93C] flex items-center gap-2">
                  <span className="text-sm bg-[#E5A93C]/10 px-2.5 py-1 rounded-md text-[#E5A93C] font-sans font-extrabold">05</span>
                  Non-Returnable & Void Conditions
                </h3>
                <div className="text-white/80 pl-10">
                  <p className="mb-2">A claim is strictly void and rejected if any of the following occur:</p>
                  <ul className="list-disc list-inside space-y-1.5 pl-1 text-white/70">
                    <li>Missing unboxing video, or video with cuts/edits.</li>
                    <li>The unboxing video starts after the outer courier tape/packaging has already been sliced, opened, or tampered with.</li>
                    <li>Claims submitted after the strict 48-hour delivery window.</li>
                    <li>Submitting a cropped or low-resolution video where the package shipping label is illegible.</li>
                  </ul>
                </div>
              </div>

            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setCurrentView('home')}
                className="bg-gradient-to-r from-[#C86428] to-[#E5A93C] text-white font-extrabold text-sm py-3.5 px-8 rounded-xl shadow-lg active:scale-95 transition-all duration-200 cursor-pointer"
              >
                Return to Shop
              </button>
            </div>
          </div>
        )}

        {/* ----------------- VIEW 6: TRACK ORDER LOGISTICS VIEW - DEACTIVATED ----------------- */}
        {false && currentView === 'track-order' && (
          <div className="max-w-3xl mx-auto space-y-8 py-4 animate-fade-in text-left">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <button
                onClick={() => setCurrentView('home')}
                className="p-2 hover:bg-white/10 rounded-full text-white transition-colors flex items-center justify-center cursor-pointer"
                aria-label="Back to home"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="font-serif text-3xl font-extrabold text-white">Track Order Shipment</h1>
                <p className="text-[#E5A93C] text-xs font-semibold tracking-wider uppercase mt-1">meONmode Ayurvedic Logistics & Dispatch Hub</p>
              </div>
            </div>

            {/* Order Tracking Input Card */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
              <div className="space-y-2">
                <label className="block text-xs uppercase font-extrabold text-neutral-300 tracking-wider">
                  Enter WhatsApp Order ID
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-grow">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40">
                      <Package className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. MOM-482910"
                      value={trackingOrderIdInput}
                      onChange={(e) => setTrackingOrderIdInput(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 hover:border-white/20 focus:border-[#E5A93C] focus:ring-1 focus:ring-[#E5A93C] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-all uppercase"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!trackingOrderIdInput.trim()) {
                        alert("Please enter a valid Order ID to track.");
                      } else {
                        saveOrderToHistory(trackingOrderIdInput);
                      }
                    }}
                    className="bg-gradient-to-r from-[#C86428] to-[#E5A93C] hover:brightness-110 text-white font-extrabold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                  >
                    Track Status
                  </button>
                </div>
              </div>

              {/* My Orders History View */}
              {orderHistory.length > 0 && (
                <div className="pt-4 border-t border-white/5 space-y-2.5 text-left">
                  <div className="flex items-center justify-between">
                    <span className="block text-[10px] uppercase font-extrabold text-neutral-400 tracking-wider">
                      📋 My Tracking History ({orderHistory.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setOrderHistory([]);
                        localStorage.removeItem('meonmode_order_history');
                      }}
                      className="text-[10px] text-red-400/70 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      Clear History
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {orderHistory.map((id) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setTrackingOrderIdInput(id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                          trackingOrderIdInput.toUpperCase().trim() === id.toUpperCase().trim()
                            ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-[#E5A93C] scale-105'
                            : 'bg-white/5 border-white/5 text-white/80 hover:bg-white/10 hover:border-white/10'
                        }`}
                      >
                        <Package className="w-3.5 h-3.5 opacity-60" />
                        <span>{id}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Detected recent Order ID suggestion */}
              {lastOrderId && !orderHistory.includes(lastOrderId.toUpperCase().trim()) && (
                <div className="bg-[#E5A93C]/10 border border-[#E5A93C]/20 rounded-xl p-3 flex items-center justify-between text-xs text-[#E5A93C]">
                  <div className="flex items-center gap-2">
                    <span className="animate-pulse">🟢</span>
                    <span>Detected recent order ID: <strong>{lastOrderId}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setTrackingOrderIdInput(lastOrderId);
                      saveOrderToHistory(lastOrderId);
                    }}
                    className="underline hover:text-white transition-colors cursor-pointer font-bold"
                  >
                    Auto-Fill & Save ID
                  </button>
                </div>
              )}
            </div>

            {/* Display Shipment Tracking Results if there's input */}
            {trackingOrderIdInput.trim().length >= 4 ? (() => {
              const details = (() => {
                const cleanId = trackingOrderIdInput.toUpperCase().trim();
                
                // If it matches the user's freshly placed order
                if (lastOrderId && cleanId === lastOrderId.toUpperCase().trim()) {
                  return {
                    orderId: cleanId,
                    status: "Confirmed",
                    statusColor: "bg-amber-500/20 text-[#E5A93C] border-amber-500/30",
                    carrier: "Delhivery Express",
                    trackingNumber: "DEL" + Math.floor(100000000 + Math.random() * 900000000),
                    dispatchDate: "Awaiting Dispatch (Usually within 12 hours)",
                    estimatedDelivery: "2-4 Business Days",
                    destination: "Your Registered Shipping Address",
                    milestones: [
                      { title: "Order Confirmed via WhatsApp", description: "Your order details have been successfully received and validated by our fulfillment desk.", date: "Just now", completed: true, active: true },
                      { title: "Prescription verification & Pharmacist approval", description: "Our certified Ayurvedic experts are checking your order requirements.", date: "Pending Verification", completed: false, active: false },
                      { title: "Packaging & Discreet Labelling", description: "Double-walled cardboard with 100% discreet packaging. No product name displayed on outer label.", date: "Pending packaging", completed: false, active: false },
                      { title: "Dispatched from Delhi Warehouse", description: "Package handed over to carrier partners for fast air-route transit.", date: "Pending dispatch", completed: false, active: false },
                      { title: "Delivered", description: "Package delivered safely. Thank you for choosing meONmode®.", date: "Pending delivery", completed: false, active: false },
                    ]
                  };
                }

                // Generate deterministic details based on the order ID hash
                let numHash = 0;
                for (let i = 0; i < cleanId.length; i++) {
                  numHash += cleanId.charCodeAt(i);
                }
                
                const statusIndex = numHash % 4; // 4 statuses
                const carriers = ["Delhivery Express", "Blue Dart Premium", "Xpressbees Courier", "Shadowfax Air"];
                const carrier = carriers[numHash % carriers.length];
                const trackingNo = "MOM" + (10000000 + (numHash * 1337) % 90000000);
                
                const cities = ["Mumbai, MH", "Bengaluru, KA", "New Delhi, DL", "Pune, MH", "Hyderabad, TG", "Chennai, TN", "Kolkata, WB", "Ahmedabad, GJ"];
                const destination = cities[numHash % cities.length];

                const milestones = [];
                
                if (statusIndex === 0) {
                  milestones.push(
                    { title: "Order Placed & Confirmed", description: "Order verified and processed into our fulfillment queue.", date: "2 days ago", completed: true, active: false },
                    { title: "Pharmacist Verified", description: "Prescription checked and certified by Chief Ayurvedic Officer.", date: "1 day ago", completed: true, active: true },
                    { title: "Awaiting Courier Pickup", description: "Packed in discreet outer cover and catalogued.", date: "Pending", completed: false, active: false },
                    { title: "Dispatched", description: "Dispatched from Delhi central sorting hub.", date: "Pending", completed: false, active: false },
                    { title: "Delivered", description: "Handed over safely.", date: "Pending", completed: false, active: false }
                  );
                  return {
                    orderId: cleanId,
                    status: "Processing & Approved",
                    statusColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
                    carrier: "Awaiting Courier Partner",
                    trackingNumber: "Awaiting Dispatch",
                    dispatchDate: "Scheduled within 12 Hours",
                    estimatedDelivery: "3-5 Business Days",
                    destination,
                    milestones
                  };
                } else if (statusIndex === 1) {
                  milestones.push(
                    { title: "Order Placed & Confirmed", description: "Verified and validated by our fulfillment desk.", date: "3 days ago", completed: true, active: false },
                    { title: "Medical Approval & Quality Passed", description: "Formulations double-checked for sealed freshness.", date: "3 days ago", completed: true, active: false },
                    { title: "Handed Over to Carrier", description: `Dispatched via ${carrier} Air Transport.`, date: "2 days ago", completed: true, active: false },
                    { title: "In Transit - Near Destination Hub", description: "Consignment sorted and routing to final delivery center.", date: "Today", completed: true, active: true },
                    { title: "Delivered", description: "Handed over safely.", date: "Pending", completed: false, active: false }
                  );
                  return {
                    orderId: cleanId,
                    status: "In Transit",
                    statusColor: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
                    carrier,
                    trackingNumber: trackingNo,
                    dispatchDate: "2 days ago",
                    estimatedDelivery: "1-2 Business Days",
                    destination,
                    milestones
                  };
                } else if (statusIndex === 2) {
                  milestones.push(
                    { title: "Order Placed & Confirmed", description: "Fulfillment queue confirmation complete.", date: "4 days ago", completed: true, active: false },
                    { title: "Dispatched from Warehouse", description: `Shipped via ${carrier} Express Priority Air.`, date: "3 days ago", completed: true, active: false },
                    { title: "Reached Local Destination Facility", description: "Received at delivery warehouse near destination.", date: "1 day ago", completed: true, active: false },
                    { title: "Out for Delivery", description: "Dispatched with premium carrier associate. Pay COD amount to dispatch personnel upon receipt.", date: "Today - Active", completed: true, active: true },
                    { title: "Delivered", description: "Handed over safely.", date: "Pending", completed: false, active: false }
                  );
                  return {
                    orderId: cleanId,
                    status: "Out for Delivery",
                    statusColor: "bg-[#E5A93C]/20 text-[#E5A93C] border-[#E5A93C]/30 animate-pulse",
                    carrier,
                    trackingNumber: trackingNo,
                    dispatchDate: "3 days ago",
                    estimatedDelivery: "Today (Before 8 PM)",
                    destination,
                    milestones
                  };
                } else {
                  milestones.push(
                    { title: "Order Placed & Confirmed", description: "Validated by meONmode clinical advisors.", date: "7 days ago", completed: true, active: false },
                    { title: "Dispatched", description: `Dispatched from Central Warehouse with priority handling.`, date: "6 days ago", completed: true, active: false },
                    { title: "In Transit & Sorted", description: "Sorted at local facility and out with delivery agent.", date: "5 days ago", completed: true, active: false },
                    { title: "Delivered Successfully", description: "Consignment delivered in discreet brown packaging. Handed over safely.", date: "4 days ago", completed: true, active: true }
                  );
                  return {
                    orderId: cleanId,
                    status: "Delivered Successfully",
                    statusColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
                    carrier,
                    trackingNumber: trackingNo,
                    dispatchDate: "6 days ago",
                    estimatedDelivery: "Delivered 4 days ago",
                    destination,
                    milestones
                  };
                }
              })();

              return (
                <div className="space-y-6 animate-fade-in text-white">
                  {/* Results Summary Card */}
                  <div className="bg-[#1C110D]/90 border border-white/10 rounded-3xl p-6 shadow-xl space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                      <div>
                        <div className="text-xs text-neutral-400">Order Reference</div>
                        <div className="text-lg font-bold font-serif text-[#E5A93C]">{details.orderId}</div>
                      </div>
                      <div>
                        <span className={`inline-block text-xs font-extrabold px-3 py-1.5 rounded-full border ${details.statusColor}`}>
                          ● {details.status}
                        </span>
                      </div>
                    </div>

                    {/* Meta info grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div className="space-y-1">
                        <span className="text-neutral-400 block">Courier Partner</span>
                        <span className="font-bold text-white flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5 text-[#E5A93C]" />
                          {details.carrier}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-neutral-400 block">AWB Tracking No.</span>
                        <span className="font-bold text-white flex items-center gap-1.5 font-mono">
                          {details.trackingNumber}
                          {details.trackingNumber !== "Pending Dispatch" && details.trackingNumber !== "Awaiting Dispatch" && (
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(details.trackingNumber);
                                setShowToast("AWB tracking number copied!");
                                setTimeout(() => setShowToast(null), 3000);
                              }}
                              className="text-[#E5A93C] hover:text-white transition-colors p-0.5"
                              title="Copy AWB Tracking Number"
                            >
                              <Clipboard className="w-3.5 h-3.5 cursor-pointer" />
                            </button>
                          )}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-neutral-400 block">Estimated Delivery</span>
                        <span className="font-bold text-white flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#E5A93C]" />
                          {details.estimatedDelivery}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-neutral-400 block">Ship To Destination</span>
                        <span className="font-bold text-[#E5A93C] flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {details.destination}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Shipment Milestone Stepper Card */}
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
                    <h3 className="font-serif text-lg font-bold text-white">Live Tracking Log</h3>
                    
                    <div className="relative border-l-2 border-white/10 pl-6 ml-3.5 space-y-8">
                      {details.milestones.map((milestone, idx) => {
                        return (
                          <div key={idx} className="relative">
                            {/* Marker Icon */}
                            <div className={`absolute -left-[35px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 text-[10px] ${
                              milestone.completed 
                                ? milestone.active 
                                  ? 'bg-[#E5A93C] border-[#E5A93C] text-black ring-4 ring-[#E5A93C]/20 animate-pulse'
                                  : 'bg-[#C86428] border-[#C86428] text-white'
                                : 'bg-[#1C110D] border-white/20 text-white/40'
                            }`}>
                              {milestone.completed ? '✓' : idx + 1}
                            </div>

                            {/* Milestone Text Details */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between gap-4">
                                <h4 className={`font-serif text-sm font-bold ${milestone.completed ? 'text-white' : 'text-white/40'}`}>
                                  {milestone.title}
                                </h4>
                                <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                                  milestone.completed 
                                    ? milestone.active 
                                      ? 'bg-[#E5A93C]/20 text-[#E5A93C]'
                                      : 'bg-white/10 text-white/60'
                                    : 'bg-white/5 text-white/20'
                                }`}>
                                  {milestone.date}
                                </span>
                              </div>
                              <p className={`text-xs leading-relaxed ${milestone.completed ? 'text-neutral-300' : 'text-neutral-500'}`}>
                                {milestone.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Logistics Contact Help */}
                  <div className="text-center p-4 bg-gradient-to-r from-emerald-600/10 to-emerald-800/10 border border-emerald-500/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white">
                    <span className="text-left font-medium">
                      🚚 <strong>AWB dispatch mismatch?</strong> Sometimes carriers take 12-24 hours to index newly generated AWB barcodes in their tracking systems.
                    </span>
                    <a
                      href="https://api.whatsapp.com/send?phone=917290810336&text=Hello%20meONmode%20Team%2C%20I%20have%20an%20issue%20with%20my%20order%20shipment%20tracking.%20Please%20help."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                    >
                      <span>Help Desk</span>
                    </a>
                  </div>
                </div>
              );
            })() : (
              <div className="text-center py-16 px-4 bg-white/5 border border-white/10 rounded-3xl space-y-3">
                <span className="text-4xl block">📦</span>
                <h4 className="font-serif text-lg font-bold text-white">Ready for Tracking</h4>
                <p className="text-neutral-400 text-xs max-w-sm mx-auto leading-relaxed">
                  Enter your meONmode WhatsApp Order ID above to request live logistics telemetry, dispatch status, carrier assignments, and milestone tracking logs.
                </p>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Global Bottom Trust Seals */}
      <footer className="bg-black/40 border-t border-white/10 mt-16 py-12 px-4 text-center space-y-6">
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

        <div className="border-t border-white/5 pt-8 text-[11px] text-neutral-400 max-w-2xl mx-auto space-y-3">
          {/* Social Media Buttons */}
          <div className="flex flex-wrap justify-center items-center gap-3 mb-4">
            <a 
              href="https://instagram.com/meonmode_" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#E5A93C]/10 hover:bg-[#E5A93C]/20 border border-[#E5A93C]/30 text-[#E5A93C] font-extrabold text-xs px-4 py-2.5 rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Instagram className="w-4 h-4" />
              <span>Instagram (@meonmode_)</span>
            </a>
            <a 
              href="https://facebook.com/meonmode" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#E5A93C]/10 hover:bg-[#E5A93C]/20 border border-[#E5A93C]/30 text-[#E5A93C] font-extrabold text-xs px-4 py-2.5 rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Facebook className="w-4 h-4" />
              <span>Facebook (Me on mode)</span>
            </a>
          </div>

          <div className="flex justify-center gap-6 text-xs text-[#E5A93C] font-semibold mb-2">
            <button 
              onClick={() => setCurrentView('refund-policy')} 
              className="hover:underline cursor-pointer"
            >
              Refund & Return Policy
            </button>
          </div>
          <p>© 2026 meONmode® Ayurvedic Wellness. All rights reserved.</p>
          <p className="leading-relaxed">
            Disclaimer: Ayurveda is a holistic approach. While our therapeutic claims are supported by ancient texts and clinical audits of selected herbs, individual results can fluctuate depending on underlying health conditions (e.g. chronic metabolic blockages). Consult your Ayurvedic physician.
          </p>
        </div>
      </footer>

      {/* Floating Interactive Chat Desk (meONmode® AI Doctor & WhatsApp Desk) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Expanded Chat Desk Card */}
        {showWhatsAppChat && (
          <div className="mb-4 w-[320px] sm:w-[380px] bg-neutral-950/95 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-left backdrop-blur-md animate-fade-in z-50">
            {/* Widget Header */}
            <div className="bg-gradient-to-r from-emerald-950 via-[#1C110D] to-[#4A1D05] p-4 border-b border-white/10 relative">
              <button
                type="button"
                onClick={() => setShowWhatsAppChat(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white cursor-pointer hover:scale-110 transition-all p-1 rounded-full bg-black/40 border border-white/5"
                aria-label="Close Chat Widget"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B3B15] to-[#4A1D05] flex items-center justify-center border border-white/20 text-white font-serif text-lg font-extrabold shadow-inner overflow-hidden">
                    🌱
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-neutral-950 animate-pulse"></span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-wide">meONmode Wellness Desk</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider font-mono">Advisors Online</span>
                  </div>
                </div>
              </div>

              {/* Tab Selector Buttons */}
              <div className="flex gap-2 mt-4 bg-black/40 p-1 rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() => setChatTab('ai')}
                  className={`flex-grow text-center py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    chatTab === 'ai'
                      ? 'bg-[#E5A93C] text-[#2D120B]'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  🩺 Consult Dr. Ananya (AI)
                </button>
                <button
                  type="button"
                  onClick={() => setChatTab('whatsapp')}
                  className={`flex-grow text-center py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    chatTab === 'whatsapp'
                      ? 'bg-[#E5A93C] text-[#2D120B]'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  💬 WhatsApp Desk
                </button>
              </div>
            </div>

            {/* AI Consultant Chat Mode */}
            {chatTab === 'ai' && (
              <>
                {/* Chat Log Window */}
                <div className="p-4 space-y-4 h-[300px] overflow-y-auto custom-scrollbar flex flex-col">
                  {aiMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col max-w-[85%] ${
                        msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'
                      }`}
                    >
                      <div
                        className={`p-3 rounded-2xl leading-relaxed text-xs leading-normal font-sans shadow-sm border ${
                          msg.role === 'user'
                            ? 'bg-[#5C1D13] border-[#8B3B15]/20 text-[#FAF6F0] rounded-tr-none'
                            : 'bg-white/5 border-white/5 text-neutral-200 rounded-tl-none'
                        }`}
                      >
                        {msg.content}
                      </div>
                      <span className="text-[8px] text-neutral-500 font-mono mt-1 px-1">
                        {msg.role === 'user' ? 'You' : 'Dr. Ananya'}
                      </span>
                    </div>
                  ))}

                  {/* Pulsing Loading dots for AI Typing */}
                  {isAiTyping && (
                    <div className="flex flex-col items-start max-w-[85%] self-start">
                      <div className="bg-white/5 border border-white/5 text-neutral-200 text-xs px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                        <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                      </div>
                      <span className="text-[8px] text-neutral-500 font-mono mt-1 px-1">Dr. Ananya is analyzing...</span>
                    </div>
                  )}
                  
                  {/* Invisible scroll anchor */}
                  <div ref={chatEndRef} />
                </div>

                {/* Quick Helper Suggestion Chips */}
                <div className="px-4 pb-2 pt-1 flex flex-wrap gap-1.5 border-t border-white/5 max-h-[80px] overflow-y-auto custom-scrollbar">
                  {[
                    "🌸 PCOS Treatment Guidance?",
                    "🩸 How to use OVAIRA/FLOWELLE?",
                    "⚡ Men's Vitality/Stamina?",
                    "📦 Mandates for Returns?"
                  ].map((chipText, cidx) => (
                    <button
                      key={cidx}
                      type="button"
                      onClick={() => handleSendAiMessage(chipText)}
                      className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-white/80 hover:text-white px-2.5 py-1 rounded-full text-[9px] font-bold transition-all cursor-pointer"
                    >
                      {chipText}
                    </button>
                  ))}
                </div>

                {/* AI Input Box Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendAiMessage();
                  }}
                  className="p-3 bg-black/40 border-t border-white/5 flex gap-2 items-center"
                >
                  <input
                    type="text"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Ask Dr. Ananya about Ayurvedic wellness..."
                    className="flex-grow bg-white/5 border border-white/10 focus:border-[#E5A93C] focus:ring-1 focus:ring-[#E5A93C] rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none transition-all"
                    disabled={isAiTyping}
                  />
                  <button
                    type="submit"
                    disabled={isAiTyping || !aiInput.trim()}
                    className="bg-[#E5A93C] hover:bg-[#F2B94C] text-[#2D120B] p-2 rounded-xl transition-all active:scale-90 disabled:opacity-40 disabled:scale-100 flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}

            {/* Original WhatsApp Consult Mode */}
            {chatTab === 'whatsapp' && (
              <>
                {/* Widget Chat Body */}
                <div className="p-4 space-y-4 max-h-[340px] overflow-y-auto custom-scrollbar">
                  {/* Doctor Chat Bubble */}
                  <div className="space-y-1">
                    <div className="bg-white/5 border border-white/5 text-neutral-200 text-xs p-3.5 rounded-2xl rounded-tl-none leading-relaxed shadow-sm">
                      <p className="font-serif">Namaste! 🙏</p>
                      <p className="mt-1">I am Dr. Ananya. How may we guide your Ayurvedic hormone balance, PCOS relief, stamina, or order dispatch tracking today?</p>
                    </div>
                    <span className="text-[9px] text-neutral-500 font-mono pl-1 block">Just now • Auto Guidance</span>
                  </div>

                  {/* Support Category Selector List */}
                  <div className="space-y-2">
                    <span className="block text-[9px] uppercase font-extrabold text-[#E5A93C] font-mono tracking-wider">Select a Topic:</span>
                    <div className="grid grid-cols-1 gap-1.5">
                      {[
                        { id: 'general', label: '🌿 General Consult', text: "Hello meONmode Team, I would like to consult with a wellness advisor about my health journey." },
                        { id: 'pcos', label: '🌸 PCOS Specially Formulated', text: "Hello meONmode Team, I want to consult about PCOS Specially Formulated capsules and get custom guidance for hormone regularity." },
                        { id: 'women', label: '🩸 Women\'s Regularity', text: "Hello meONmode Team, I want to inquire about your Ayurvedic solutions for period regularity and uterine wellness." },
                        { id: 'men', label: '⚡ Men\'s Vigor & Stamina', text: "Hello meONmode Team, I want to consult about Premium Men\'s Vitality solutions and daily stamina support." },
                        { id: 'order', label: '📦 Order Shipping Help', text: `Hello meONmode Team, I need help tracking my order status.${lastOrderId ? ` My Order ID is ${lastOrderId}.` : ''}` }
                      ].map((topic) => (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => {
                            setWhatsAppTopic(topic.id);
                            setWhatsAppMessage(topic.text);
                          }}
                          className={`w-full text-left text-xs font-bold px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                            whatsAppTopic === topic.id
                              ? 'bg-[#E5A93C]/10 border-[#E5A93C] text-[#E5A93C]'
                              : 'bg-white/5 text-white/80 border-white/5 hover:bg-white/10 hover:border-white/10'
                          }`}
                        >
                          {topic.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom message field */}
                  <div className="space-y-1">
                    <label className="block text-[9px] uppercase font-extrabold text-neutral-400 font-mono tracking-wider">Or customize your message:</label>
                    <textarea
                      value={whatsAppMessage}
                      onChange={(e) => setWhatsAppMessage(e.target.value)}
                      placeholder="Type your wellness query or tracking request here..."
                      className="w-full bg-white/5 border border-white/10 focus:border-[#E5A93C] focus:ring-1 focus:ring-[#E5A93C] rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none transition-all resize-none min-h-[65px] custom-scrollbar"
                    />
                  </div>
                </div>

                {/* Widget Action Footer */}
                <div className="p-4 bg-black/40 border-t border-white/5">
                  <a
                    href={`https://api.whatsapp.com/send?phone=917290810336&text=${encodeURIComponent(
                      whatsAppMessage.trim() !== ""
                        ? whatsAppMessage
                        : whatsAppTopic === 'pcos'
                          ? "Hello meONmode Team, I want to consult about PCOS Specially Formulated capsules and get custom guidance for hormone regularity."
                          : whatsAppTopic === 'women'
                            ? "Hello meONmode Team, I want to inquire about your Ayurvedic solutions for period regularity and uterine wellness."
                            : whatsAppTopic === 'men'
                              ? "Hello meONmode Team, I want to consult about Premium Men's Vitality solutions and daily stamina support."
                              : whatsAppTopic === 'order'
                                ? `Hello meONmode Team, I need help tracking my order status.${lastOrderId ? ` My Order ID is ${lastOrderId}.` : ''}`
                                : "Hello meONmode Team, I would like to consult with a wellness advisor about my health journey."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      setTimeout(() => setShowWhatsAppChat(false), 500);
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-3 rounded-xl transition-all shadow-lg shadow-emerald-950/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] active:scale-95 flex items-center justify-center gap-2 cursor-pointer border border-emerald-500/20"
                  >
                    <MessageCircle className="w-4.5 h-4.5" />
                    <span>Start Direct Chat on WhatsApp</span>
                  </a>
                  <span className="block text-center text-[8px] text-neutral-500 mt-2 font-mono uppercase tracking-wider">No appointment required • Privacy guaranteed</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Floating Toggle Button */}
        <button
          type="button"
          onClick={() => setShowWhatsAppChat(!showWhatsAppChat)}
          className={`group relative w-14 h-14 rounded-full flex items-center justify-center border-2 shadow-2xl transition-all duration-300 transform active:scale-90 cursor-pointer ${
            showWhatsAppChat
              ? 'bg-neutral-900 border-white/20 text-white rotate-90'
              : 'bg-emerald-600 hover:bg-emerald-500 border-white/10 hover:scale-110 shadow-[0_4px_24px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_32px_rgba(16,185,129,0.5)] text-white'
          }`}
          aria-label="Toggle WhatsApp Chat Desk"
        >
          {showWhatsAppChat ? (
            <X className="w-6 h-6 transition-transform duration-300" />
          ) : (
            <>
              {/* Gold Ring Pulse Outer Glow */}
              <span className="absolute inset-0 rounded-full border-2 border-emerald-400/20 animate-ping pointer-events-none"></span>
              
              <MessageCircle className="w-7 h-7 text-white" />
              
              {/* Online indicator badge */}
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-amber-500 rounded-full border-2 border-neutral-950 flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-neutral-950 rounded-full animate-pulse"></span>
              </span>

              {/* Side tooltip shown on desktop hover */}
              <div className="absolute right-16 bg-neutral-900/95 border border-white/10 backdrop-blur-md text-[#E5A93C] font-extrabold text-[10px] py-2 px-3.5 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap hidden md:flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                <span>Consult Dr. Ananya (AI Expert)</span>
              </div>
            </>
          )}
        </button>
      </div>

      {/* ----------------- INTERACTIVE PRODUCT REVIEWS MODAL ----------------- */}
      {activeReviewProduct && (() => {
        const prodReviews = currentReviews.filter(r => r.productId === activeReviewProduct.id && r.approved);
        const { rating, reviewsCount } = getProductRatingDetails(activeReviewProduct.id);
        
        // Calculate rating bars based on rating
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
                  <p className="text-[11px] text-neutral-500 font-medium">Genuine experiences shared by meONmode® members</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveReviewProduct(null)}
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
                      src={activeReviewProduct.images && activeReviewProduct.images[0]} 
                      alt={activeReviewProduct.name} 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://i.postimg.cc/dtsJKSzc/IMG-2931.png';
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
                    onClick={() => {
                      setWriteReviewProductId(activeReviewProduct.id);
                      setIsWriteReviewOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-[#FAF6F0] hover:bg-[#FAF6F0]/80 text-[#C86428] border-2 border-dashed border-[#C86428]/30 hover:border-[#C86428] font-black text-xs py-3 rounded-2xl transition-all cursor-pointer active:scale-95"
                  >
                    ⭐ Write a Review for {activeReviewProduct.name}
                  </button>
                </div>

                {/* Individual Review Entries */}
                <div className="space-y-4">
                  <h5 className="text-[10px] font-extrabold text-neutral-400 font-mono tracking-wider uppercase">Showing Verified Feedback ({prodReviews.length})</h5>
                  
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
                                    src={url} 
                                    alt="Review Asset" 
                                    className="w-full h-full object-contain cursor-zoom-in"
                                    loading="lazy"
                                    onClick={() => {
                                      setLightboxImage(url);
                                      setLightboxZoom(false);
                                    }}
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = 'https://i.postimg.cc/dtsJKSzc/IMG-2931.png';
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Mid Row: Title & Body */}
                          <div className="space-y-1">
                            <h6 className="font-serif text-sm font-bold text-neutral-950">{rev.title || "Wonderful healing experience"}</h6>
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
                  onClick={() => {
                    setWriteReviewProductId(activeReviewProduct.id);
                    setIsWriteReviewOpen(true);
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs py-3 px-4 rounded-xl transition-all cursor-pointer text-center flex-1 shrink-0"
                >
                  Write a Review
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReviewProduct(null)}
                  className="bg-[#5C1D13] hover:bg-[#4A1D05] text-[#E5A93C] font-extrabold text-xs py-3 px-6 rounded-xl transition-all shadow-md cursor-pointer text-center flex-1"
                >
                  Close Modal
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ----------------- NOTIFY ME RESTOCK ALERT MODAL ----------------- */}
      {notifyMeProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FAF6F0] rounded-3xl border border-[#E5A93C]/30 p-6 md:p-8 max-w-md w-full shadow-2xl relative text-[#4A1D05]">
            <button
              type="button"
              onClick={() => {
                setNotifyMeProduct(null);
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
                  Be the first to know when the premium <strong className="text-[#4A1D05]">{notifyMeProduct.name}</strong> is back in our temperature-controlled Ayurvedic warehouse.
                </p>
              </div>

              {notifySuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl space-y-2 text-left">
                  <p className="text-xs font-bold flex items-center gap-1.5 justify-center">
                    <span>🎉</span> Alert Activated Successfully!
                  </p>
                  <p className="text-[10px] text-emerald-700/90 leading-relaxed font-medium">
                    We've registered <strong className="underline">{notifyEmail}</strong>. You'll receive an instant premium alert the second our herbal extraction process is complete.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setNotifyMeProduct(null);
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
      )}

      {/* ----------------- WRITE A REVIEW DIALOG FORM ----------------- */}
      {isWriteReviewOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-neutral-900">
          <div className="bg-[#FAF6F0] rounded-3xl border border-[#E5A93C]/30 p-6 md:p-8 max-w-lg w-full shadow-2xl relative flex flex-col max-h-[90vh]">
            <button
              type="button"
              onClick={() => {
                setIsWriteReviewOpen(false);
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
                    {([...PRODUCTS, ...MENS_PRODUCTS].find(p => p.id === writeReviewProductId)?.name || 'this remedy')}
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
                      setIsWriteReviewOpen(false);
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
                      productId: writeReviewProductId,
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

                    setAllReviews(prev => [newRev, ...prev]);
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
                            <img src={imgSrc} alt="Preview" className="w-full h-full object-cover" />
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
      )}



      {/* ----------------- PREMIUM DYNAMIC LIGHTBOX WITH ZOOM ----------------- */}
      {lightboxImage && (
        <div className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in p-4">
          {/* Top bar controls */}
          <div className="absolute top-4 left-0 right-0 px-6 flex items-center justify-between z-20">
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-neutral-400 font-mono">
              meONmode® Verified Review Canvas
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setLightboxZoom(!lightboxZoom)}
                className="bg-white/10 hover:bg-white/20 text-[#FAF6F0] px-4 py-2 rounded-full border border-white/20 text-xs font-bold transition-all active:scale-95 cursor-pointer select-none"
              >
                {lightboxZoom ? "🔍 Zoom Out" : "🔍 Zoom In"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setLightboxImage(null);
                  setLightboxZoom(false);
                }}
                className="bg-[#C86428] hover:bg-[#8B3B15] text-[#FAF6F0] p-2.5 rounded-full border border-[#E5A93C]/30 shadow-md transition-all active:scale-95 cursor-pointer"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Fullscreen image container */}
          <div 
            onClick={() => setLightboxZoom(!lightboxZoom)}
            className="w-full h-full max-h-[80vh] flex items-center justify-center relative cursor-zoom-in overflow-auto p-4 md:p-8"
          >
            <img
              src={lightboxImage}
              alt="Customer Review Expanded"
              referrerPolicy="no-referrer"
              className={`max-w-full max-h-full object-contain rounded-2xl transition-all duration-300 ease-out select-none shadow-2xl border border-white/10 ${
                lightboxZoom ? "scale-150 cursor-zoom-out" : "scale-100"
              }`}
            />
          </div>

          <p className="absolute bottom-6 text-[10px] text-neutral-500 font-medium tracking-wide text-center max-w-md px-4 leading-relaxed font-sans">
            This customer testimonial is a verified botanical wellness journey document. Individual results may vary.
          </p>
        </div>
      )}

    </div>
  );
}
