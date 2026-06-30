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
  Leaf
} from 'lucide-react';
import { PRODUCTS, MENS_PRODUCTS, TESTIMONIALS, FAQS, MENS_TESTIMONIALS, MENS_FAQS } from './data';
import { Product, CartItem, ViewType, CheckoutDetails } from './types';

export default function App() {
  // Navigation & Cart States
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'women' | 'men' | 'all'>('women');

  const isMenProduct = (prod: Product | null) => {
    if (!prod) return false;
    return MENS_PRODUCTS.some(m => m.id === prod.id);
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
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [dismissedBanner, setDismissedBanner] = useState<boolean>(false);

  // Auto scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedProduct]);

  // Reset active image index when selected product changes
  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedProduct?.id]);

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

    // Generate cart text details
    const cartSummary = cart.map(item => 
      `${item.product.name} x ${item.quantity} - Rs. ${(item.product.price * item.quantity).toLocaleString('en-IN')}`
    ).join('\n');

    const subtotal = Math.round(getCartTotal() / 1.18);
    const gst = getCartTotal() - subtotal;
    const deliveryCharge = paymentMethod === 'cod' ? 150 : 0;
    const finalTotal = getCartTotal() + deliveryCharge;

    const codChargeLine = paymentMethod === 'cod' ? `\nCOD Charge: Rs. 150` : ``;

    // Create the specified WhatsApp payload
    const textPayload = `*NEW ORDER - meONmode*
───────────────────────
*Customer Delivery Details:*
• Name: ${checkout.fullName.trim()}
• Phone Number: ${checkout.phone.trim()}
• Full Address: ${checkout.address.trim()}
• Pincode: ${checkout.pincode.trim()}

*Order Summary:*
${cartSummary}

Subtotal: Rs. ${subtotal.toLocaleString('en-IN')}
GST (18%): Rs. ${gst.toLocaleString('en-IN')}${codChargeLine}
*Total Amount: Rs. ${finalTotal.toLocaleString('en-IN')}*

*Payment Method:* ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI Paid'}
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
        <span>100% Discreet Packaging. Free Shipping across India. Cash on Delivery Available.</span>
      </div>

      {/* Global Navigation Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b border-white/10 px-4 py-3 shadow-lg transition-colors duration-500 ${
        activeCategory === 'all'
          ? 'bg-[#1C110D]/95 border-amber-500/15 shadow-amber-950/10'
          : activeCategory === 'men' 
            ? 'bg-[#0A0A0A]/95 border-amber-500/20 shadow-amber-950/5' 
            : 'bg-[#4A1D05]/90'
      }`}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
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
                  }
                }}
                className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors flex items-center justify-center"
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
                className="text-left"
              >
                <span className="font-serif text-xl md:text-2xl font-black tracking-wide text-white flex items-center gap-1">
                  meONmode<span className="text-[#E5A93C] text-sm align-super">®</span>
                </span>
                <span className="block text-[8px] md:text-[9px] tracking-[0.2em] uppercase text-[#E5A93C] font-semibold -mt-1 font-sans">
                  A y u r v e d i c &nbsp; W e l l n e s s
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Nav links for desktop */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <button 
                onClick={() => currentView !== 'success' && setCurrentView('home')} 
                className={`transition-colors hover:text-[#E5A93C] ${currentView === 'home' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
              >
                Home
              </button>
              <button 
                onClick={() => currentView !== 'success' && setCurrentView('refund-policy')} 
                className={`transition-colors hover:text-[#E5A93C] ${currentView === 'refund-policy' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
              >
                Return Policy
              </button>
              {activeCategory === 'all' ? (
                <>
                  <button 
                    onClick={() => handleProductClick(PRODUCTS[0])} 
                    className={`transition-colors hover:text-[#E5A93C] ${selectedProduct?.id === 'combo-kit' && currentView === 'detail' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
                  >
                    Women's Combo
                  </button>
                  <button 
                    onClick={() => handleProductClick(MENS_PRODUCTS[2])} 
                    className={`transition-colors hover:text-[#E5A93C] ${selectedProduct?.id === 'mens-combo' && currentView === 'detail' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
                  >
                    Men's Combo
                  </button>
                </>
              ) : activeCategory === 'men' ? (
                <>
                  <button 
                    onClick={() => handleProductClick(MENS_PRODUCTS[2])} 
                    className={`transition-colors hover:text-[#E5A93C] ${selectedProduct?.id === 'mens-combo' && currentView === 'detail' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
                  >
                    Men's Combo
                  </button>
                  <button 
                    onClick={() => handleProductClick(MENS_PRODUCTS[0])} 
                    className={`transition-colors hover:text-[#E5A93C] ${selectedProduct?.id === 'wantmore-men' && currentView === 'detail' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
                  >
                    WANTMORE Powder
                  </button>
                  <button 
                    onClick={() => handleProductClick(MENS_PRODUCTS[1])} 
                    className={`transition-colors hover:text-[#E5A93C] ${selectedProduct?.id === 'shaktimax-men' && currentView === 'detail' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
                  >
                    SHAKTIMAX Capsules
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => handleProductClick(PRODUCTS[0])} 
                    className={`transition-colors hover:text-[#E5A93C] ${selectedProduct?.id === 'combo-kit' && currentView === 'detail' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
                  >
                    Combo Kit
                  </button>
                  <button 
                    onClick={() => handleProductClick(PRODUCTS[1])} 
                    className={`transition-colors hover:text-[#E5A93C] ${selectedProduct?.id === 'ovaira' && currentView === 'detail' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
                  >
                    OVAIRA Capsules
                  </button>
                  <button 
                    onClick={() => handleProductClick(PRODUCTS[2])} 
                    className={`transition-colors hover:text-[#E5A93C] ${selectedProduct?.id === 'flowelle' && currentView === 'detail' ? 'text-[#E5A93C] font-semibold' : 'text-white/80'}`}
                  >
                    FLOWELLE Syrup
                  </button>
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
                  setCurrentView('cart');
                }
              }}
              className="relative p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center group"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-white group-hover:text-[#E5A93C] transition-colors" />
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
                  className={`relative z-10 px-4 md:px-6 py-2.5 rounded-full text-xs sm:text-sm font-extrabold tracking-wide uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
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
                  className={`relative z-10 px-4 md:px-6 py-2.5 rounded-full text-xs sm:text-sm font-extrabold tracking-wide uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                    activeCategory === 'men'
                      ? 'text-white shadow-lg bg-gradient-to-r from-[#D4AF37] to-[#8A6D1C] border border-[#D4AF37]/25'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span>🧔</span>
                  <span>Men's</span>
                </button>
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`relative z-10 px-4 md:px-6 py-2.5 rounded-full text-xs sm:text-sm font-extrabold tracking-wide uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
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
            
            {/* Bento Block 1: Hero Banner Section (Col Span 8) */}
            <section className={`lg:col-span-8 relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl flex flex-col justify-between transition-all duration-700 ${
              activeCategory === 'all'
                ? 'bg-gradient-to-br from-[#2B1B15] to-[#120B09]'
                : activeCategory === 'men'
                  ? 'bg-gradient-to-br from-[#1C1C1C] to-[#0A0A0A]'
                  : 'bg-gradient-to-br from-[#8B3B15] to-[#4A1D05]'
            }`}>
              {/* Fallback pattern background */}
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#C86428_1px,transparent_1px)] [background-size:16px_16px]"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-10 items-center relative z-10 h-full">
                {/* Text Sales Copy */}
                <div className="md:col-span-7 space-y-5">
                  <div className={`inline-flex items-center gap-2 border text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full transition-colors duration-500 ${
                    activeCategory === 'all'
                      ? 'bg-[#3B2314] border-[#E5A93C]/30 text-[#E5A93C]'
                      : activeCategory === 'men'
                        ? 'bg-[#E5A93C]/10 border-amber-500/30 text-[#E5A93C]'
                        : 'bg-[#5C1D13] border-[#E5A93C]/30 text-[#E5A93C]'
                  }`}>
                    <Sparkles className="w-3 h-3" />
                    {activeCategory === 'all' ? "Premium Complete Rejuvenation" : activeCategory === 'men' ? "Premium Men's Vitality" : "Premium Ayurvedic Restoration"}
                  </div>
                  
                  <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                    {activeCategory === 'all' ? (
                      <>
                        Peak Wellness. <br />
                        <span className="text-[#E5A93C]">All ON Mode.</span>
                      </>
                    ) : activeCategory === 'men' ? (
                      <>
                        Unleash Your <br />
                        <span className="text-[#E5A93C]">MAX Mode.</span>
                      </>
                    ) : (
                      <>
                        Your Body. <br />
                        <span className="text-[#E5A93C]">ON Mode.</span>
                      </>
                    )}
                  </h1>

                  <p className="text-white/90 text-xs sm:text-sm md:text-base leading-relaxed">
                    {activeCategory === 'all'
                      ? "Nourish your entire system with our complete medical-grade Ayurvedic formulations. Experience hormone synergy, period regularity, robust stamina, and complete vigor."
                      : activeCategory === 'men'
                        ? "Elevate your strength, physical stamina, and performance with clinically tested Ayurvedic herbs that support cellular energy and vital restoration."
                        : "Say goodbye to irregular periods, painful cramps, and PCOS/PCOD issues. Nourish your system with clinically balanced herbs that target root issues for lifelong uterine wellness."}
                  </p>

                  {/* Highlight Specs */}
                  <div className="grid grid-cols-2 gap-3 max-w-md pt-1">
                    <div className="flex items-center gap-2 text-xs text-white/80">
                      <Check className="w-4 h-4 text-[#E5A93C] shrink-0" />
                      <span>AYUSH Certified</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/80">
                      <Check className="w-4 h-4 text-[#E5A93C] shrink-0" />
                      <span>100% Plant-Based</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/80">
                      <Check className="w-4 h-4 text-[#E5A93C] shrink-0" />
                      <span>No Heavy Metals</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/80">
                      <Check className="w-4 h-4 text-[#E5A93C] shrink-0" />
                      <span>Zero Side Effects</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button 
                      id="hero-buy-combo-btn"
                      onClick={() => handleQuickBuy(activeCategory === 'men' ? MENS_PRODUCTS[2] : PRODUCTS[0])}
                      className="bg-gradient-to-r from-[#C86428] to-[#E5A93C] hover:brightness-110 text-white font-extrabold text-xs sm:text-sm py-3.5 px-6 rounded-xl shadow-lg shadow-[#4A1D05]/50 transition-all hover:shadow-[0_0_15px_rgba(200,100,40,0.5)] active:scale-95 text-center flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingBag className="w-4.5 h-4.5" />
                      <span>Shop Combo Kit - <span className="text-white font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>{activeCategory === 'men' ? '₹2,199' : '₹1,999'}</span></span>
                    </button>
                    <button 
                      id="hero-view-details-btn"
                      onClick={() => handleProductClick(activeCategory === 'men' ? MENS_PRODUCTS[2] : PRODUCTS[0])}
                      className="bg-white/10 hover:bg-white/25 border border-white/20 text-white font-bold text-xs sm:text-sm py-3.5 px-6 rounded-xl transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] text-center cursor-pointer"
                    >
                      Learn More
                    </button>
                  </div>
                </div>

                {/* Right Hero Image Column representing 1000166066_2.jpg / Product Hero */}
                <div className="md:col-span-5 relative flex justify-center">
                  <div className={`relative w-full max-w-[240px] md:max-w-xs rounded-2xl overflow-hidden p-1 shadow-2xl border border-white/20 transition-all duration-500 bg-gradient-to-br ${
                    activeCategory === 'all'
                      ? 'from-[#3B2314] to-[#1F120B]'
                      : activeCategory === 'men'
                        ? 'from-[#333333] to-[#121212]'
                        : 'from-[#C86428] to-[#5C1D13]'
                  }`}>
                    {/* The image requested */}
                    <img 
                      src={activeCategory === 'men' ? 'mens-combo.jpg' : 'https://i.postimg.cc/vcnzsNV5/Chat-GPT-Image-Jun-20-2026-10-27-35-PM.png'} 
                      alt={activeCategory === 'men' ? "meONmode Men's Combo" : "meONmode Combo Kit"} 
                      className="w-full h-auto max-w-full object-contain block mx-auto rounded-xl crisp-img"
                      style={{ imageRendering: 'crisp-edges', WebkitImageRendering: '-webkit-optimize-contrast' }}
                      onError={(e) => {
                        // Safe elegant fallback styling if local file doesn't exist
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const existingFallback = parent.querySelector('.hero-fallback-overlay');
                          if (existingFallback) {
                            existingFallback.remove();
                          }
                          const fallbackDiv = document.createElement('div');
                          fallbackDiv.className = "hero-fallback-overlay absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-br from-[#4A1D05] to-[#C86428] text-white";
                          if (activeCategory === 'men') {
                            fallbackDiv.className = "hero-fallback-overlay absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-br from-[#111111] to-[#333333] text-white";
                            fallbackDiv.innerHTML = `
                              <div class="flex justify-between items-start">
                                <span class="text-[9px] bg-amber-500/20 text-amber-300 font-extrabold tracking-wider border border-amber-500/30 px-1.5 py-0.5 rounded">WANTMORE + SHAKTIMAX</span>
                                <span class="text-[#E5A93C] text-[10px] font-semibold">Ayurvedic Vitality</span>
                              </div>
                              <div class="text-center my-auto space-y-1">
                                <h3 class="font-serif text-2xl font-bold text-white tracking-wide">meONmode®</h3>
                                <p class="text-amber-200 text-[10px] tracking-widest uppercase">Men's Combo</p>
                                <div class="inline-block bg-black/60 px-3 py-1 rounded-xl border border-white/10 mt-1">
                                  <span class="text-[9px] text-white font-bold line-through drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style="text-shadow: 0 2px 4px rgba(0,0,0,0.8);">₹4,498</span>
                                  <span class="text-white text-sm font-bold ml-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style="text-shadow: 0 2px 4px rgba(0,0,0,0.8);">₹2,199</span>
                                </div>
                              </div>
                              <div class="flex items-center justify-center gap-1 text-[10px] text-amber-200">
                                <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                                <span>Premium Men's Pack</span>
                              </div>
                            `;
                          } else {
                            fallbackDiv.innerHTML = `
                              <div class="flex justify-between items-start">
                                <span class="text-[9px] bg-amber-500/20 text-amber-300 font-extrabold tracking-wider border border-amber-500/30 px-1.5 py-0.5 rounded">OVAIRA + FLOWELLE</span>
                                <span class="text-[#E5A93C] text-[10px] font-semibold">Ayurvedic Treatment</span>
                              </div>
                              <div class="text-center my-auto space-y-1">
                                <h3 class="font-serif text-2xl font-bold text-white tracking-wide">meONmode®</h3>
                                <p class="text-amber-200 text-[10px] tracking-widest uppercase">Combo Kit</p>
                                <div class="inline-block bg-[#5C1D13]/60 px-3 py-1 rounded-xl border border-white/10 mt-1">
                                  <span class="text-[9px] text-white font-bold line-through drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style="text-shadow: 0 2px 4px rgba(0,0,0,0.8);">₹3,798</span>
                                  <span class="text-white text-sm font-bold ml-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style="text-shadow: 0 2px 4px rgba(0,0,0,0.8);">₹1,999</span>
                                </div>
                              </div>
                              <div class="flex items-center justify-center gap-1 text-[10px] text-amber-200">
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                                <span>Special Promo Pack</span>
                              </div>
                            `;
                          }
                          parent.appendChild(fallbackDiv);
                        }
                      }}
                    />
                    {/* Glassmorphic price tag pill */}
                    <div className="absolute top-3 right-3 bg-[#5C1D13]/90 backdrop-blur-md border-2 border-amber-400 text-white font-extrabold px-3 py-1 rounded-full text-[10px] shadow-[0_0_10px_rgba(251,191,36,0.5)] drop-shadow-md">
                      {activeCategory === 'all' ? 'Save Up to 51%' : activeCategory === 'men' ? 'Save 51%' : 'Save 47%'}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Bento Block 2: Trust Rating & Fast Statement (Col Span 4) */}
            <section className="lg:col-span-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-2xl relative">
              <div className="space-y-4">
                <div className="flex text-[#E5A93C] gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                
                <h2 className="font-serif text-xl sm:text-2xl font-extrabold text-white leading-tight">
                  {activeCategory === 'all' ? "6 Lakh+ Indians Trust meONmode®" : activeCategory === 'men' ? "1 Lakh+ Indian Men Trust meONmode®" : "5 Lakh+ Indian Women Trust meONmode®"}
                </h2>

                <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-black/20">
                  <img 
                    src={activeCategory === 'men' ? 'shaktimax-men.jpg' : 'https://i.postimg.cc/sQTb4nr9/Chat-GPT-Image-Jun-20-2026-10-27-18-PM.png'} 
                    alt={activeCategory === 'men' ? "Men Trust meONmode" : "5 Lakh+ Women Trust meONmode"} 
                    className="w-full h-auto max-w-full object-contain block mx-auto crisp-img"
                    style={{ imageRendering: 'crisp-edges', WebkitImageRendering: '-webkit-optimize-contrast' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const existingFallback = parent.querySelector('.trust-fallback-overlay');
                        if (existingFallback) {
                          existingFallback.remove();
                        }
                        const fallback = document.createElement('div');
                        fallback.className = "trust-fallback-overlay p-4 text-center text-white/90 font-serif text-sm flex flex-col items-center justify-center min-h-[140px]";
                        fallback.innerHTML = `
                          <div class="p-2 bg-amber-500/10 rounded-full border border-amber-500/20 mb-2">
                            <svg class="w-6 h-6 text-[#E5A93C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                          </div>
                          <span class="font-bold">meONmode® Quality Assured</span>
                        `;
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                </div>

                <p className="text-[#F7E7D9] text-xs sm:text-sm leading-relaxed">
                  {activeCategory === 'all' ? (
                    "Ayurveda treats physical energy and hormones at the deep cellular level, balancing the entire system, optimizing cycle rhythm and daily vigor in just 30 seconds a day."
                  ) : activeCategory === 'men' ? (
                    "Ayurveda treats physical energy at the cellular level, optimizing stamina, strengthening vascular health, and restoring baseline vigor in just 30 seconds a day."
                  ) : (
                    "Ayurveda treats the deep tissue level, regularizing cycles, stopping excruciating muscle spasms, and cleansing follicular blockages in just 30 seconds a day."
                  )}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center gap-2 mt-4">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  {activeCategory === 'all' ? "90-Day Full System Restoration Reset" : activeCategory === 'men' ? "90-Day Vitality Restoration Reset" : "90-Day Cycle Restoration Reset"}
                </span>
              </div>
            </section>

            {/* Bento Block 3: Daily 30-Second Ritual Timeline (Col Span 12) */}
            <section className="lg:col-span-12 bg-black/20 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
              <div className="text-center md:text-left space-y-1">
                <span className="text-[#E5A93C] uppercase text-xs tracking-widest font-bold">The Protocol</span>
                <h3 className="font-serif text-xl md:text-2xl font-bold text-white">Your Simple Daily Ayurvedic Ritual</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`space-y-3 p-5 rounded-2xl border border-white/5 flex flex-col justify-between transition-colors duration-500 ${
                  activeCategory === 'all' ? 'bg-[#2B1B15]/40' : activeCategory === 'men' ? 'bg-[#1C1C1C]' : 'bg-[#4A1D05]/50'
                }`}>
                  <div>
                    <div className="w-9 h-9 bg-[#C86428]/25 text-[#E5A93C] rounded-full flex items-center justify-center font-bold text-sm border border-[#C86428]/30 mb-2">
                      1
                    </div>
                    <h4 className="font-serif font-bold text-white text-base">
                      {activeCategory === 'all' ? "OVAIRA / SHAKTIMAX" : activeCategory === 'men' ? "SHAKTIMAX Capsule" : "OVAIRA Capsule"}
                    </h4>
                  </div>
                  <p className="text-xs text-[#F7E7D9]/80 leading-relaxed">
                    {activeCategory === 'all'
                      ? "Take Capsules in the Morning and Evening (After Meals). Highly recommended for balanced recovery."
                      : activeCategory === 'men'
                        ? "Take 1 Capsule in the Morning and 1 Capsule in the Evening (After Meals) with water."
                        : "Take 1 Capsule in the Morning and 1 Capsule in the Evening (After Meals)."}
                  </p>
                </div>

                <div className={`space-y-3 p-5 rounded-2xl border border-white/5 flex flex-col justify-between transition-colors duration-500 ${
                  activeCategory === 'all' ? 'bg-[#2B1B15]/40' : activeCategory === 'men' ? 'bg-[#1C1C1C]' : 'bg-[#4A1D05]/50'
                }`}>
                  <div>
                    <div className="w-9 h-9 bg-[#C86428]/25 text-[#E5A93C] rounded-full flex items-center justify-center font-bold text-sm border border-[#C86428]/30 mb-2">
                      2
                    </div>
                    <h4 className="font-serif font-bold text-white text-base">
                      {activeCategory === 'all' ? "FLOWELLE / WANTMORE" : activeCategory === 'men' ? "WANTMORE Powder" : "FLOWELLE Syrup"}
                    </h4>
                  </div>
                  <p className="text-xs text-[#F7E7D9]/80 leading-relaxed">
                    {activeCategory === 'all'
                      ? "Take liquids/powders in the Evening (After Dinner). Supports deep muscle and blood cleansing."
                      : activeCategory === 'men'
                        ? "Take 1 scoop (approx. 5g) mixed in warm milk or lukewarm water daily after dinner."
                        : "Take 5ml in the Morning and 5ml in the Evening (After Meals)."}
                  </p>
                </div>

                <div className={`space-y-3 p-5 rounded-2xl border border-white/5 flex flex-col justify-between transition-colors duration-500 ${
                  activeCategory === 'all' ? 'bg-[#2B1B15]/40' : activeCategory === 'men' ? 'bg-[#1C1C1C]' : 'bg-[#4A1D05]/50'
                }`}>
                  <div>
                    <div className="w-9 h-9 bg-[#C86428]/25 text-[#E5A93C] rounded-full flex items-center justify-center font-bold text-sm border border-[#C86428]/30 mb-2">
                      3
                    </div>
                    <h4 className="font-serif font-bold text-white text-base">The 90-Day Reset</h4>
                  </div>
                  <p className="text-xs text-[#F7E7D9]/80 leading-relaxed">
                    {activeCategory === 'all'
                      ? "Optimized cycle rhythm, standard ovulation, clear skin, and high muscle vitality."
                      : activeCategory === 'men'
                        ? "Enjoy restored baseline energy levels, optimized vascular physical power, and maximum strength."
                        : "Enjoy flawless ovulation schedules, clear cystic-free facial skin, and standard painless flows."}
                  </p>
                </div>
              </div>
            </section>

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
                    ? "Restore physical vigor, elevate stamina, balance hormones, and regularize your natural system with clinical-grade Ayurvedic formulations."
                    : activeCategory === 'men'
                      ? "Restore physical vigor, elevate stamina, and optimize cellular energy with clinical-grade Ayurvedic formulations."
                      : "Whether you need comprehensive restoration or targeted balance, choose our clinically verified herbal regimens."}
                </p>
              </div>

              {/* Dynamic Catalog Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                  <span className="text-xl">{activeCategory === 'all' ? "✨" : activeCategory === 'men' ? "🧔" : "👩"}</span>
                  <h3 className="font-serif text-lg font-bold text-white tracking-wide">
                    {activeCategory === 'all' ? "Complete Ayurvedic Reset Protocol" : activeCategory === 'men' ? "Men's Premium Vitality Protocol" : "Women's Hormonal Reset Protocol"}
                  </h3>
                </div>
                  
                {/* Grid of Product Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(activeCategory === 'all' 
                    ? [PRODUCTS[1], PRODUCTS[2], MENS_PRODUCTS[0], MENS_PRODUCTS[1], PRODUCTS[0], MENS_PRODUCTS[2]] 
                    : activeCategory === 'men' 
                      ? MENS_PRODUCTS 
                      : PRODUCTS
                  ).map((prod) => {
                    const isCombo = prod.id === 'combo-kit' || prod.id === 'mens-combo';
                    const textThemeDark = prod.id === 'combo-kit';
                    const isMen = isMenProduct(prod);
                    
                    return (
                      <div 
                        key={prod.id}
                        className={`rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between transform transition-transform hover:-translate-y-1 duration-300 border ${
                          isCombo 
                            ? textThemeDark 
                              ? 'bg-[#FDFEFE] text-neutral-900 border-b-8 border-[#C86428] border-neutral-200' 
                              : 'bg-[#181818] text-white border-b-8 border-amber-500 border-amber-500/30 shadow-amber-500/5'
                            : 'bg-white/5 backdrop-blur-md text-white border-white/10'
                        }`}
                      >
                        {/* Top banner image fallback or real image */}
                        <div className={`relative w-full h-auto overflow-hidden flex items-center justify-center bg-gradient-to-br ${
                          isMen ? 'from-[#222222] to-[#0D0D0D]' : 'from-[#8B3B15] to-[#4A1D05]'
                        }`}>
                          {prod.tag && (
                            <span className={`absolute top-4 left-4 z-10 text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-md tracking-wider border ${
                              isMen
                                ? 'bg-black text-[#E5A93C] border-amber-500/30'
                                : 'bg-[#5C1D13] text-[#E5A93C] border-[#E5A93C]/30'
                            }`}>
                              {prod.tag}
                            </span>
                          )}
                          
                          <img 
                            src={prod.images && prod.images[0]} 
                            alt={prod.name}
                            className="w-full h-auto max-w-full object-contain block mx-auto crisp-img"
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
                                overlay.className = "card-fallback-overlay absolute inset-0 flex flex-col justify-center items-center p-6 text-center text-white";
                                let iconSvg = '';
                                if (prod.id === 'combo-kit' || prod.id === 'mens-combo') {
                                  iconSvg = `<span class="p-3 bg-amber-500/20 rounded-full text-[#E5A93C] mb-2 border border-amber-500/40"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"></path></svg></span>`;
                                } else if (prod.id === 'ovaira' || prod.id === 'shaktimax-men') {
                                  iconSvg = `<span class="p-3 bg-amber-500/20 rounded-full text-[#E5A93C] mb-2 border border-amber-500/40"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l.707-.707m2.828 9.9a5 5 0 113.536 0V21h-3.536v-5.1z"></path></svg></span>`;
                                } else {
                                  iconSvg = `<span class="p-3 bg-amber-500/20 rounded-full text-[#E5A93C] mb-2 border border-amber-500/40"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg></span>`;
                                }
                                overlay.innerHTML = `
                                  ${iconSvg}
                                  <h4 class="font-serif font-bold text-lg text-[#E5A93C]">${prod.volumeOrQty}</h4>
                                  <p class="text-[10px] uppercase tracking-widest text-neutral-300 mt-1">meONmode Certified</p>
                                `;
                                parent.appendChild(overlay);
                              }
                            }}
                          />
                        </div>

                        {/* Product Metadata */}
                        <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                          <div>
                            {/* Rating block */}
                            <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold mb-1">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span>{prod.rating}</span>
                              <span className={textThemeDark ? 'text-neutral-400' : 'text-neutral-300'}>
                                ({prod.reviewsCount.toLocaleString('en-IN')} reviews)
                              </span>
                            </div>

                            <h3 className={`font-serif text-xl font-extrabold ${textThemeDark ? 'text-[#4A1D05]' : 'text-white'}`}>
                              {prod.name}
                            </h3>
                            <p className={`text-xs tracking-wider uppercase font-medium mt-0.5 ${textThemeDark ? 'text-neutral-500' : 'text-neutral-300'}`}>
                              {prod.subtitle}
                            </p>
                            <p className={`text-sm mt-2.5 line-clamp-3 leading-relaxed ${textThemeDark ? 'text-neutral-600' : 'text-[#F7E7D9]'}`}>
                              {prod.shortDescription}
                            </p>
                          </div>

                          <div className="space-y-4 pt-2">
                            {/* Pricing element */}
                            <div className="flex items-baseline gap-2.5">
                              <span 
                                className="text-2xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                                style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)' }}
                              >
                                ₹{prod.price.toLocaleString('en-IN')}
                              </span>
                              <span className="text-sm line-through text-white font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)' }}>
                                ₹{prod.mrp.toLocaleString('en-IN')}
                              </span>
                              <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full border-2 ${
                                textThemeDark 
                                  ? 'text-red-700 bg-red-50 border-red-600/50 shadow-[0_0_8px_rgba(185,28,28,0.2)]' 
                                  : 'text-amber-400 bg-amber-950/50 border-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                              }`}>
                                {Math.round(((prod.mrp - prod.price) / prod.mrp) * 100)}% Off
                              </span>
                            </div>

                            {/* CTAs */}
                            <div className={`flex flex-col gap-2 pt-2 border-t ${textThemeDark ? 'border-neutral-100' : 'border-white/10'}`}>
                              <div className="grid grid-cols-2 gap-2">
                                <button 
                                  onClick={() => handleProductClick(prod)}
                                  className={`text-xs font-bold py-2.5 px-3 rounded-xl border transition-all hover:shadow-[0_0_10px_rgba(255,255,255,0.15)] text-center cursor-pointer ${
                                    textThemeDark 
                                      ? 'border-neutral-200 text-neutral-700 bg-neutral-50 hover:bg-neutral-100' 
                                      : 'border-white/10 text-white bg-white/5 hover:bg-white/10'
                                  }`}
                                >
                                  View Details
                                </button>
                                <button 
                                  onClick={() => addToCart(prod, 1)}
                                  className={`text-xs font-bold py-2.5 px-3 rounded-xl transition-all text-center cursor-pointer ${
                                    isMen
                                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#8A6D1C] text-black font-extrabold hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                                      : 'bg-[#C86428] text-white hover:bg-[#8B3B15] hover:shadow-[0_0_15px_rgba(200,100,40,0.5)]'
                                  }`}
                                >
                                  Add to Cart
                                </button>
                              </div>
                              
                              <button 
                                onClick={() => handleQuickBuy(prod)}
                                className={`w-full text-xs font-extrabold py-3 px-4 rounded-xl transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                                  textThemeDark 
                                    ? 'bg-[#5C1D13] text-white hover:bg-[#4A1D05]' 
                                    : isMen
                                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#8A6D1C] text-black hover:brightness-110 shadow-lg shadow-black/50 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                                      : 'bg-gradient-to-r from-[#C86428] to-[#E5A93C] text-white hover:brightness-110 shadow-lg shadow-[#4A1D05]/30 hover:shadow-[0_0_15px_rgba(200,100,40,0.5)]'
                                }`}
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Quick Buy Now (COD Free)</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
                  <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black/20">
                    <span className="block text-[10px] uppercase font-bold text-[#E5A93C] p-2 bg-black/30 text-center border-b border-white/5">100% Raw Roots & Bark</span>
                    <img 
                      src="https://i.postimg.cc/K34wqnG9/Chat-GPT-Image-Jun-20-2026-10-27-28-PM.png" 
                      alt="100% Ayurvedic Ingredients / Roots & Bark" 
                      className="w-full h-auto max-w-full object-contain block mx-auto crisp-img"
                      style={{ imageRendering: 'crisp-edges', WebkitImageRendering: '-webkit-optimize-contrast' }}
                    />
                  </div>
                  <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black/20">
                    <span className="block text-[10px] uppercase font-bold text-[#E5A93C] p-2 bg-black/30 text-center border-b border-white/5">Ayurveda vs Synthetic Pills</span>
                    <img 
                      src="https://i.postimg.cc/zH36tnz2/Chat-GPT-Image-Jun-20-2026-10-27-39-PM.png" 
                      alt="Why Ayurvedic capsules are better Comparison" 
                      className="w-full h-auto max-w-full object-contain block mx-auto crisp-img"
                      style={{ imageRendering: 'crisp-edges', WebkitImageRendering: '-webkit-optimize-contrast' }}
                    />
                  </div>
                </div>

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
                  src={activeCategory === 'men' ? 'wantmore-men.jpg' : 'https://i.postimg.cc/KRTN2HMB/Chat-GPT-Image-Jun-20-2026-10-27-45-PM.png'} 
                  alt={activeCategory === 'men' ? "meONmode Men's Results" : "Bye Bye Period Problems / 87% & 95% Results"} 
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

            {/* Bento Block 7: Testimonials Section (Col Span 12) */}
            <section className="lg:col-span-12 space-y-6">
              <div className="text-center space-y-1">
                <span className="text-[#E5A93C] uppercase text-xs tracking-widest font-bold">Real Stories, Real Relief</span>
                <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-white">
                  {activeCategory === 'all' ? "Hear from our meONmode® Community" : activeCategory === 'men' ? "Hear from our meONmode® Brothers" : "Hear from our meONmode® Sisters"}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                {/* Featured Video / Visual Testimonial */}
                <div className={`md:col-span-5 backdrop-blur-md rounded-3xl p-6 flex flex-col justify-center space-y-4 shadow-lg transition-colors border ${
                  activeCategory === 'all'
                    ? 'bg-[#1C110D]/60 border-amber-500/15 hover:bg-[#1C110D]/80'
                    : activeCategory === 'men'
                      ? 'bg-[#181818]/60 border-amber-500/20 hover:bg-[#181818]/80'
                      : 'bg-[#5C1D13]/40 border-[#E5A93C]/20 hover:bg-[#5C1D13]/55'
                }`}>
                  <h4 className="font-serif font-bold text-[#E5A93C] text-xs uppercase tracking-widest text-center">
                    {activeCategory === 'all' ? "Featured Community Story" : activeCategory === 'men' ? "Featured Brother Story" : "Featured Sister Story"}
                  </h4>
                  <div className="rounded-2xl overflow-hidden border border-white/10 shadow-md bg-black/40">
                    <img 
                      src={activeCategory === 'men' ? 'wantmore-men.jpg' : 'https://i.postimg.cc/JHtv6br6/Chat-GPT-Image-Jun-20-2026-10-27-30-PM.png'} 
                      alt={activeCategory === 'men' ? "Rajesh Varma Testimonial" : "Sneha Patel Testimonial"} 
                      className="w-full h-auto max-w-full object-contain block mx-auto crisp-img"
                      style={{ imageRendering: 'crisp-edges', WebkitImageRendering: '-webkit-optimize-contrast' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const existingFallback = parent.querySelector('.featured-fallback-overlay');
                          if (existingFallback) {
                            existingFallback.remove();
                          }
                          const fallback = document.createElement('div');
                          fallback.className = "featured-fallback-overlay p-4 text-center text-white/90 font-serif text-xs flex flex-col items-center justify-center min-h-[140px]";
                          fallback.innerHTML = `
                            <div class="p-2 bg-amber-500/10 rounded-full border border-amber-500/20 mb-2">
                              <svg class="w-6 h-6 text-[#E5A93C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <span class="font-bold">Featured Video Testimonial</span>
                          `;
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  </div>
                  <p className="text-xs text-white/90 leading-relaxed text-center italic">
                    {activeCategory === 'all'
                      ? "\"My entire physical vitality, cellular strength, and hormone cycles restored completely!\""
                      : activeCategory === 'men' 
                        ? "\"My fatigue reduced completely and daily recovery returned within 30 days!\""
                        : "\"My ovarian cysts reduced completely and cycles returned within 90 days!\""}
                  </p>
                </div>

                {/* Grid of Text Testimonials */}
                <div className="md:col-span-7 grid grid-cols-1 gap-4 flex flex-col justify-between">
                  {(activeCategory === 'all'
                    ? [TESTIMONIALS[0], MENS_TESTIMONIALS[0], TESTIMONIALS[1]]
                    : activeCategory === 'men' 
                      ? MENS_TESTIMONIALS 
                      : TESTIMONIALS
                  ).map((t, idx) => (
                    <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 flex flex-col justify-between space-y-2 shadow-sm hover:bg-white/10 transition-colors">
                      <div className="space-y-1">
                        <div className="flex text-amber-500">
                          {[...Array(t.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <h4 className="font-serif font-bold text-[#E5A93C] text-sm">{t.title}</h4>
                        <p className="text-xs text-white/95 leading-normal">"{t.comment}"</p>
                      </div>
                      <div className="pt-2 flex justify-between items-center text-[10px] text-[#F7E7D9]/80 border-t border-white/5">
                        <span>{t.name}, {t.age} yrs</span>
                        <span className="bg-white/10 px-2 py-0.5 rounded text-neutral-300 font-bold">{t.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
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
                {(activeCategory === 'all' ? [...FAQS, ...MENS_FAQS] : activeCategory === 'men' ? MENS_FAQS : FAQS).map((faq, idx) => (
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
        {selectedProduct && currentView === 'detail' && (
          <div className="space-y-12">
            
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
              const isMens = isMenProduct(selectedProduct);
              return (
                <div className={`rounded-3xl overflow-hidden shadow-2xl border ${
                  isMens 
                    ? 'bg-[#4A1D05]/95 text-white border-[#E5A93C]/40 shadow-[#4A1D05]/50' 
                    : 'bg-[#FDFEFE] text-neutral-900 border-amber-light'
                }`}>
                  <div className="grid grid-cols-1 md:grid-cols-12">
                    
                    {/* Image Column */}
                    <div className="md:col-span-5 relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#8B3B15] to-[#4A1D05] p-6 min-h-[350px] md:min-h-[450px]">
                      {selectedProduct.tag && (
                        <span className={`absolute top-4 left-4 z-10 text-[10px] font-extrabold px-3 py-1.5 rounded-full tracking-wider shadow-md ${
                          isMens 
                            ? 'bg-[#E5A93C] text-neutral-900 border border-neutral-900/10' 
                            : 'bg-[#5C1D13] text-[#E5A93C]'
                        }`}>
                          {selectedProduct.tag}
                        </span>
                      )}

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
                              <img 
                                src={imgSrc} 
                                alt={`${selectedProduct.name} - View ${idx + 1}`}
                                className="w-full h-auto max-h-[250px] md:max-h-[350px] object-contain block mx-auto crisp-img"
                                style={{ imageRendering: 'crisp-edges', WebkitImageRendering: '-webkit-optimize-contrast' }}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    const existing = parent.querySelector('.slider-fallback');
                                    if (!existing) {
                                      const fallback = document.createElement('div');
                                      fallback.className = "slider-fallback absolute inset-0 flex flex-col justify-center items-center p-6 text-center text-white";
                                      fallback.innerHTML = `
                                        <span class="p-3 ${isMens ? 'bg-[#E5A93C]/10 border-[#E5A93C]/30 text-[#E5A93C]' : 'bg-[#C86428]/30 border-[#E5A93C]/30 text-[#E5A93C]'} rounded-full mb-2 border">
                                          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                          </svg>
                                        </span>
                                        <h4 class="font-serif font-extrabold text-lg text-[#E5A93C]">${selectedProduct.name}</h4>
                                        <p class="text-[10px] text-neutral-300 mt-0.5 uppercase tracking-widest">${selectedProduct.volumeOrQty}</p>
                                      `;
                                      parent.appendChild(fallback);
                                    }
                                  }
                                }}
                              />
                            </div>
                          ))}
                        </div>

                        {/* Left and Right Navigation Arrows (Visible only if more than 1 image) */}
                        {(selectedProduct.images || []).length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={() => setActiveImageIndex((prev) => (prev === 0 ? (selectedProduct.images || []).length - 1 : prev - 1))}
                              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-all border border-white/10 active:scale-95 flex items-center justify-center cursor-pointer"
                              aria-label="Previous image"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveImageIndex((prev) => (prev === (selectedProduct.images || []).length - 1 ? 0 : prev + 1))}
                              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-all border border-white/10 active:scale-95 flex items-center justify-center cursor-pointer"
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
                                    ? 'w-5 bg-[#E5A93C]' 
                                    : 'w-1.5 bg-white/40 hover:bg-white/60'
                                  }`}
                                aria-label={`Go to slide ${idx + 1}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Info and Purchase Column */}
                    <div className="md:col-span-7 p-6 md:p-10 flex flex-col justify-between space-y-6">
                      
                      {/* Title & Metadata */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                          <Star className="w-4 h-4 fill-current" />
                          <span>{selectedProduct.rating} Stars</span>
                          <span className="text-neutral-400">({selectedProduct.reviewsCount.toLocaleString('en-IN')} verified orders)</span>
                        </div>

                        <h2 className={`font-serif text-3xl font-extrabold ${isMens ? 'text-[#E5A93C]' : 'text-[#4A1D05]'}`}>
                          {selectedProduct.name}
                        </h2>
                        <p className={`font-bold text-sm tracking-wide ${isMens ? 'text-white/80' : 'text-[#C86428]'}`}>
                          {selectedProduct.subtitle} • {selectedProduct.volumeOrQty}
                        </p>
                      </div>

                      {/* Pricing and Quick details */}
                      <div className={`p-4 rounded-2xl border flex justify-between items-center ${
                        isMens 
                          ? 'bg-[#5C1D13]/60 border-[#E5A93C]/20 text-white' 
                          : 'bg-amber-light/30 border-amber-light'
                      }`}>
                        <div>
                          <span className={`block text-[10px] uppercase tracking-widest font-bold ${isMens ? 'text-[#E5A93C]' : 'text-neutral-500'}`}>Offer Price</span>
                          <div className="flex items-baseline gap-2 mt-0.5">
                            <span 
                              className="text-3xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                              style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)' }}
                            >
                              ₹{selectedProduct.price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-base text-white font-bold line-through drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)' }}>
                              ₹{selectedProduct.mrp.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className={`text-xs font-extrabold px-3 py-1.5 rounded-full border-2 ${
                            isMens 
                              ? 'bg-amber-950/50 text-white border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.2)]' 
                              : 'bg-red-50 text-red-700 border-red-600 shadow-[0_0_10px_rgba(220,38,38,0.2)]'
                          }`}>
                            Save {Math.round(((selectedProduct.mrp - selectedProduct.price) / selectedProduct.mrp) * 100)}% Immediately
                          </span>
                          <span className="block text-[10px] text-neutral-500 mt-1.5 font-medium">Inclusive of all Indian Taxes</span>
                        </div>
                      </div>

                      {/* Long Description */}
                      <div className="space-y-2">
                        <h4 className={`font-serif text-sm font-bold uppercase tracking-wider ${isMens ? 'text-[#E5A93C]' : 'text-neutral-800'}`}>Product Therapy Summary</h4>
                        <p className={`text-xs leading-relaxed md:text-sm ${isMens ? 'text-neutral-300' : 'text-neutral-600'}`}>
                          {selectedProduct.longDescription}
                        </p>
                      </div>

                      {/* Dosage Guidelines - MUST BE COMPLIANT */}
                      <div className={`p-4 rounded-2xl space-y-2 border ${
                        isMens 
                          ? 'bg-[#E5A93C]/5 border-[#E5A93C]/20' 
                          : 'bg-[#5C1D13]/5 border-[#5C1D13]/10'
                      }`}>
                        <h4 className={`font-serif text-sm font-bold flex items-center gap-1.5 ${isMens ? 'text-[#E5A93C]' : 'text-[#5C1D13]'}`}>
                          <Clock className={`w-4 h-4 ${isMens ? 'text-[#E5A93C]' : 'text-[#C86428]'}`} />
                          <span>Compliant Dosage Guidelines</span>
                        </h4>
                        <div className={`text-xs leading-relaxed font-medium whitespace-pre-line pl-1.5 ${isMens ? 'text-[#FDFEFE]' : 'text-neutral-700'}`}>
                          {selectedProduct.dosage}
                        </div>
                      </div>

                      {/* Purchase Controls */}
                      <div className={`space-y-3 pt-3 border-t ${isMens ? 'border-[#E5A93C]/10' : 'border-neutral-100'}`}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <button 
                            onClick={() => addToCart(selectedProduct, 1)}
                            className={`font-bold text-sm py-3.5 px-6 rounded-xl transition-all hover:shadow-[0_0_15px_rgba(200,100,40,0.5)] flex items-center justify-center gap-2 border ${
                              isMens 
                                ? 'bg-[#5C1D13] hover:bg-[#8B3B15] text-white border-white/10' 
                                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-300'
                            }`}
                          >
                            <ShoppingBag className="w-4 h-4" />
                            <span>Add To Cart Bag</span>
                          </button>

                          <button 
                            onClick={() => handleQuickBuy(selectedProduct)}
                            className={`font-extrabold text-sm py-3.5 px-6 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_15px_rgba(200,100,40,0.5)] ${
                              isMens 
                                ? 'bg-[#E5A93C] text-neutral-950 hover:bg-[#C86428] hover:text-white shadow-lg shadow-[#E5A93C]/10' 
                                : 'bg-gradient-to-r from-[#C86428] to-[#E5A93C] hover:brightness-110 text-white'
                            }`}
                          >
                            <span>Buy Now & Check Out</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>

                        <div className={`flex justify-center items-center gap-5 text-[11px] pt-1 font-medium ${isMens ? 'text-neutral-400' : 'text-neutral-500'}`}>
                          <span className="flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5 text-emerald-600" /> Secure Checkout
                          </span>
                          <span>•</span>
                          <span>Free COD across India</span>
                          <span>•</span>
                          <span>Shipped in 24 Hrs</span>
                        </div>
                      </div>

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
                          src="https://i.postimg.cc/crcpT4BF/Chat-GPT-Image-Jun-20-2026-10-28-01-PM.png" 
                          alt="8 Feminine Health Solutions" 
                          className="w-full h-auto max-w-full object-contain block mx-auto transition-transform duration-500 group-hover:scale-105 crisp-img"
                          style={{ imageRendering: 'crisp-edges', WebkitImageRendering: '-webkit-optimize-contrast' }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://i.postimg.cc/dLCBYxyy/Chat-GPT-Image-Jun-20-2026-10-27-43-PM.png';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                          <p className="text-xs text-[#E5A93C] font-semibold tracking-wider uppercase font-mono">meONmode Women's Trust Grid</p>
                        </div>
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
                          src="https://i.postimg.cc/zVkspXFd/Chat-GPT-Image-Jun-20-2026-10-28-03-PM.png" 
                          alt="33-Herb Pure Formulation" 
                          className="w-full h-auto max-w-full object-contain block mx-auto transition-transform duration-500 group-hover:scale-105 crisp-img"
                          style={{ imageRendering: 'crisp-edges', WebkitImageRendering: '-webkit-optimize-contrast' }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://i.postimg.cc/dLCBYxyy/Chat-GPT-Image-Jun-20-2026-10-27-43-PM.png';
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
                              src="https://i.postimg.cc/BXCrNQBw/Chat-GPT-Image-Jun-20-2026-10-28-08-PM.png" 
                              alt="Dosage Info" 
                              className="w-full h-auto max-w-full object-contain block mx-auto transition-transform duration-500 group-hover:scale-105 crisp-img"
                              style={{ imageRendering: 'crisp-edges', WebkitImageRendering: '-webkit-optimize-contrast' }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://i.postimg.cc/dLCBYxyy/Chat-GPT-Image-Jun-20-2026-10-27-43-PM.png';
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
                              src="https://i.postimg.cc/tYzKDCNS/Chat-GPT-Image-Jun-20-2026-10-28-06-PM.png" 
                              alt="Certification badge" 
                              className="w-full h-auto max-w-full object-contain block mx-auto transition-transform duration-500 group-hover:scale-105 crisp-img"
                              style={{ imageRendering: 'crisp-edges', WebkitImageRendering: '-webkit-optimize-contrast' }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://i.postimg.cc/dLCBYxyy/Chat-GPT-Image-Jun-20-2026-10-27-43-PM.png';
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
                      src="https://i.postimg.cc/dLCBYxyy/Chat-GPT-Image-Jun-20-2026-10-27-43-PM.png" 
                      alt="Powerful Ingredients" 
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

          </div>
        )}

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
                  <h3 className="font-serif text-lg font-bold text-white">Order Summary</h3>
                  
                  <div className="space-y-3">
                    {cart.map((item) => (
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
                  <div className="bg-[#4A1D05]/50 border border-white/10 rounded-2xl p-5 space-y-3 text-xs">
                    <div className="flex justify-between text-[#F7E7D9]/80 font-semibold drop-shadow-sm">
                      <span>Total Original Price (MRP)</span>
                      <span className="line-through text-white font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>₹{getCartMrpTotal().toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-white font-extrabold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                      <span>Herbal Combo Discount Savings</span>
                      <span>-₹{(getCartMrpTotal() - getCartTotal()).toLocaleString('en-IN')}</span>
                    </div>

                    <div className="border-t border-white/10 my-2"></div>

                    <div className="flex justify-between text-[#F7E7D9]/80 font-semibold drop-shadow-sm">
                      <span>Subtotal</span>
                      <span className="text-white font-bold" style={{ textShadow: '0 1.5px 3px rgba(0,0,0,0.8)' }}>₹{Math.round(getCartTotal() / 1.18).toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between text-[#F7E7D9]/80 font-semibold drop-shadow-sm">
                      <span>Delivery</span>
                      {paymentMethod === 'cod' ? (
                        <span className="text-amber-300 font-bold" style={{ textShadow: '0 1.5px 3px rgba(0,0,0,0.8)' }}>₹150 (COD charge)</span>
                      ) : (
                        <span className="text-emerald-400 font-bold uppercase tracking-wider">FREE</span>
                      )}
                    </div>

                    <div className="flex justify-between text-[#F7E7D9]/80 font-semibold drop-shadow-sm">
                      <span>GST (18%)</span>
                      <span className="text-white font-bold" style={{ textShadow: '0 1.5px 3px rgba(0,0,0,0.8)' }}>₹{(getCartTotal() - Math.round(getCartTotal() / 1.18)).toLocaleString('en-IN')}</span>
                    </div>
                    
                    <div className="border-t border-white/10 pt-3 flex justify-between items-baseline">
                      <span className="font-serif text-sm font-bold text-white drop-shadow-md">Total</span>
                      <span 
                        className="font-serif text-lg font-black text-white"
                        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                      >
                        ₹{(getCartTotal() + (paymentMethod === 'cod' ? 150 : 0)).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

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
                              placeholder="Your First & Last Name"
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
                                placeholder="10-digit mobile number"
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
                              placeholder="6-digit Indian Postal Pin"
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
                            
                            <span className="block text-center text-[10px] text-neutral-400 mt-2.5">
                              *Provide details first. Absolutely NO upfront payment or QR code is required to proceed.
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
                              Choose UPI/Net Banking for <strong className="text-emerald-700 font-extrabold">FREE delivery</strong>. COD orders include ₹150 handling charge.
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
                                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
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
                                  <span className="block text-sm font-bold text-[#4A1D05]">Cash on Delivery</span>
                                  <span className="block text-[10px] text-neutral-500 mt-0.5">Pay in cash upon delivery</span>
                                </div>
                              </button>

                              {/* UPI Option */}
                              <button
                                type="button"
                                onClick={() => setPaymentMethod('upi')}
                                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
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
                                  <span className="block text-sm font-bold text-[#4A1D05]">Pay via UPI</span>
                                  <span className="block text-[10px] text-neutral-500 mt-0.5">Scan QR & Pay instantly</span>
                                </div>
                              </button>
                            </div>
                          </div>

                          {/* Dynamic UPI Details & QR Code display */}
                          {paymentMethod === 'upi' && (
                            <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-5 flex flex-col items-center text-center space-y-4 animate-fade-in">
                              <div className="bg-white p-3 rounded-2xl shadow-md border border-neutral-100 relative">
                                {/* Paste your own QR code link in the src below if you want to replace it */}
                                <img 
                                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi%3A%2F%2Fpay%3Fpa%3D9350302092m%40pnb%26pn%3DMEONMODE%2520ENTERPRISES" 
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
                                    className="text-[#C86428] hover:text-[#8B3B15] font-sans text-[10px] font-bold uppercase ml-1 border-l pl-1.5 border-neutral-200"
                                  >
                                    Copy
                                  </button>
                                </div>
                              </div>
                              <div className="text-[11px] text-neutral-500 leading-normal max-w-sm">
                                Scan the QR code using GPay, PhonePe, Paytm, or BHIM to pay instantly. Once paid, click the button below to confirm.
                              </div>
                            </div>
                          )}

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

              <div className="border-t border-white/10 pt-3 space-y-2 text-xs text-neutral-300">
                <div className="flex justify-between">
                  <span>Estimated Dispatch:</span>
                  <span className="font-bold text-white">Within 24 Hours</span>
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

    </div>
  );
}
