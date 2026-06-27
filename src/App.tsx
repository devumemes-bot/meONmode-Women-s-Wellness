/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
import { PRODUCTS, TESTIMONIALS, FAQS } from './data';
import { Product, CartItem, ViewType, CheckoutDetails } from './types';

export default function App() {
  // Navigation & Cart States
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Form Details
  const [checkout, setCheckout] = useState<CheckoutDetails>({
    fullName: '',
    phone: '',
    address: '',
    pincode: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<CheckoutDetails>>({});

  // Auto scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedProduct]);

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

    // Check if Flowelle is purchased
    const hasFlowelle = cart.some(item => item.product.id === 'flowelle');
    let flowelleProductLine = '';
    if (hasFlowelle) {
      flowelleProductLine = `Product: FLOWELLE Syrup (500ml)\n`;
    }

    // Generate cart text details
    const cartDetailsText = cart.map(item => 
      `• ${item.product.name} (${item.product.volumeOrQty}) x ${item.quantity} - ₹${(item.product.price * item.quantity).toLocaleString('en-IN')}`
    ).join('\n');

    const totalToPay = getCartTotal();

    // Create the specified WhatsApp payload
    const textPayload = `Hello meONmode Team, I want to place an order:
${flowelleProductLine}- Items: 
${cartDetailsText}
- Total Price: ₹${totalToPay.toLocaleString('en-IN')}
- Name: ${checkout.fullName.trim()}
- Mobile: ${checkout.phone.trim()}
- Address: ${checkout.address.trim()}, Pincode: ${checkout.pincode.trim()}

Please confirm my order. Thank you!`;

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
    <div className="min-h-screen bg-gradient-to-b from-[#C86428] via-[#8B3B15] to-[#4A1D05] text-[#FDFEFE] font-sans antialiased selection:bg-[#E5A93C] selection:text-[#4A1D05]">
      
      {/* 100% Privacy Sticky Alert Bar */}
      <div className="bg-[#5C1D13] text-center py-2 px-4 text-xs font-medium tracking-wide flex items-center justify-center gap-2 border-b border-white/10">
        <Lock className="w-3.5 h-3.5 text-[#E5A93C]" />
        <span>100% Discreet Packaging. Free Shipping across India. Cash on Delivery Available.</span>
      </div>

      {/* Global Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#4A1D05]/90 backdrop-blur-md border-b border-white/10 px-4 py-3 shadow-lg">
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
            </nav>

            {/* Cart Button */}
            <button 
              id="header-cart-btn"
              onClick={() => currentView !== 'success' && setCurrentView('cart')}
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
            onClick={() => setCurrentView('cart')}
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Bento Block 1: Hero Banner Section (Col Span 8) */}
            <section className="lg:col-span-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#8B3B15] to-[#4A1D05] border border-white/10 shadow-2xl flex flex-col justify-between">
              {/* Fallback pattern background */}
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#C86428_1px,transparent_1px)] [background-size:16px_16px]"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-10 items-center relative z-10 h-full">
                {/* Text Sales Copy */}
                <div className="md:col-span-7 space-y-5">
                  <div className="inline-flex items-center gap-2 bg-[#5C1D13] border border-[#E5A93C]/30 text-[#E5A93C] py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    Premium Ayurvedic Restoration
                  </div>
                  
                  <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                    Your Body. <br />
                    <span className="text-[#E5A93C]">ON Mode.</span>
                  </h1>

                  <p className="text-white/90 text-xs sm:text-sm md:text-base leading-relaxed">
                    Say goodbye to irregular periods, painful cramps, and PCOS/PCOD issues. Nourish your system with clinically balanced herbs that target root issues for lifelong uterine wellness.
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
                      onClick={() => handleQuickBuy(PRODUCTS[0])}
                      className="bg-gradient-to-r from-[#C86428] to-[#E5A93C] hover:brightness-110 text-white font-extrabold text-xs sm:text-sm py-3.5 px-6 rounded-xl shadow-lg shadow-[#4A1D05]/50 transition-all hover:shadow-[0_0_15px_rgba(200,100,40,0.5)] active:scale-95 text-center flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4.5 h-4.5" />
                      <span>Shop Combo Kit - <span className="text-white font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>₹1,999</span></span>
                    </button>
                    <button 
                      id="hero-view-details-btn"
                      onClick={() => handleProductClick(PRODUCTS[0])}
                      className="bg-white/10 hover:bg-white/25 border border-white/20 text-white font-bold text-xs sm:text-sm py-3.5 px-6 rounded-xl transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] text-center"
                    >
                      Learn More
                    </button>
                  </div>
                </div>

                {/* Right Hero Image Column representing 1000166066_2.jpg / Product Hero */}
                <div className="md:col-span-5 relative flex justify-center">
                  <div className="relative w-full max-w-[240px] md:max-w-xs aspect-square bg-gradient-to-br from-[#C86428] to-[#5C1D13] rounded-2xl overflow-hidden p-1 shadow-2xl border border-white/20">
                    {/* The image requested */}
                    <img 
                      src="https://i.postimg.cc/vcnzsNV5/Chat-GPT-Image-Jun-20-2026-10-27-35-PM.png" 
                      alt="meONmode Combo Kit" 
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => {
                        // Safe elegant fallback styling if local file doesn't exist
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const fallbackDiv = document.createElement('div');
                          fallbackDiv.className = "absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-br from-[#4A1D05] to-[#C86428] text-white";
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
                          parent.appendChild(fallbackDiv);
                        }
                      }}
                    />
                    {/* Glassmorphic price tag pill */}
                    <div className="absolute top-3 right-3 bg-[#5C1D13]/90 backdrop-blur-md border-2 border-amber-400 text-white font-extrabold px-3 py-1 rounded-full text-[10px] shadow-[0_0_10px_rgba(251,191,36,0.5)] drop-shadow-md">
                      Save 47%
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
                  5 Lakh+ Indian Women Trust meONmode®
                </h2>

                <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-black/20">
                  <img 
                    src="https://i.postimg.cc/sQTb4nr9/Chat-GPT-Image-Jun-20-2026-10-27-18-PM.png" 
                    alt="5 Lakh+ Women Trust meONmode" 
                    className="w-full h-auto object-cover"
                  />
                </div>

                <p className="text-[#F7E7D9] text-xs sm:text-sm leading-relaxed">
                  Ayurveda treats the deep tissue level, regularizing cycles, stopping excruciating muscle spasms, and cleansing follicular blockages in just <span className="text-[#E5A93C] font-semibold">30 seconds a day</span>.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center gap-2 mt-4">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">90-Day Cycle Restoration Reset</span>
              </div>
            </section>

            {/* Bento Block 3: Daily 30-Second Ritual Timeline (Col Span 12) */}
            <section className="lg:col-span-12 bg-black/20 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
              <div className="text-center md:text-left space-y-1">
                <span className="text-[#E5A93C] uppercase text-xs tracking-widest font-bold">The Protocol</span>
                <h3 className="font-serif text-xl md:text-2xl font-bold text-white">Your Simple Daily Ayurvedic Ritual</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3 p-5 bg-[#4A1D05]/50 rounded-2xl border border-white/5 flex flex-col justify-between">
                  <div>
                    <div className="w-9 h-9 bg-[#C86428]/25 text-[#E5A93C] rounded-full flex items-center justify-center font-bold text-sm border border-[#C86428]/30 mb-2">
                      1
                    </div>
                    <h4 className="font-serif font-bold text-white text-base">OVAIRA Capsule</h4>
                  </div>
                  <p className="text-xs text-[#F7E7D9]/80 leading-relaxed">
                    Take 1 Capsule in the Morning and 1 Capsule in the Evening (After Meals).
                  </p>
                </div>

                <div className="space-y-3 p-5 bg-[#4A1D05]/50 rounded-2xl border border-white/5 flex flex-col justify-between">
                  <div>
                    <div className="w-9 h-9 bg-[#C86428]/25 text-[#E5A93C] rounded-full flex items-center justify-center font-bold text-sm border border-[#C86428]/30 mb-2">
                      2
                    </div>
                    <h4 className="font-serif font-bold text-white text-base">FLOWELLE Syrup</h4>
                  </div>
                  <p className="text-xs text-[#F7E7D9]/80 leading-relaxed">
                    Take 5ml in the Morning and 5ml in the Evening (After Meals).
                  </p>
                </div>

                <div className="space-y-3 p-5 bg-[#4A1D05]/50 rounded-2xl border border-white/5 flex flex-col justify-between">
                  <div>
                    <div className="w-9 h-9 bg-[#C86428]/25 text-[#E5A93C] rounded-full flex items-center justify-center font-bold text-sm border border-[#C86428]/30 mb-2">
                      3
                    </div>
                    <h4 className="font-serif font-bold text-white text-base">The 90-Day Reset</h4>
                  </div>
                  <p className="text-xs text-[#F7E7D9]/80 leading-relaxed">
                    Enjoy flawless ovulation schedules, clear cystic-free facial skin, and standard painless flows.
                  </p>
                </div>
              </div>
            </section>

            {/* Bento Block 4: Product Catalog Section (Col Span 12) */}
            <section className="lg:col-span-12 space-y-6 pt-4">
              <div className="text-center space-y-2">
                <span className="text-[#E5A93C] uppercase text-xs tracking-widest font-bold font-sans">Our Treatment Catalogue</span>
                <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-white">Choose Your Wellness Protocol</h2>
                <p className="text-[#F7E7D9]/90 max-w-lg mx-auto text-sm">
                  Whether you need comprehensive restoration or targeted balance, choose our clinically verified herbal regimens.
                </p>
              </div>

              {/* Women's Catalog Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                  <span className="text-xl">👩</span>
                  <h3 className="font-serif text-lg font-bold text-white tracking-wide">Women's Hormonal Reset Protocol</h3>
                </div>
                  
                  {/* Grid of Product Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {PRODUCTS.filter(p => ['combo-kit', 'ovaira', 'flowelle'].includes(p.id)).map((prod) => (
                      <div 
                        key={prod.id}
                        className={`rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between transform transition-transform hover:-translate-y-1 duration-300 border ${
                          prod.id === 'combo-kit' 
                            ? 'bg-[#FDFEFE] text-neutral-900 border-b-8 border-[#C86428] border-neutral-200' 
                            : 'bg-white/5 backdrop-blur-md text-white border-white/10'
                        }`}
                      >
                        {/* Top banner image fallback or real image */}
                        <div className="relative h-56 bg-gradient-to-br from-[#8B3B15] to-[#4A1D05] overflow-hidden">
                          {prod.tag && (
                            <span className="absolute top-4 left-4 z-10 bg-[#5C1D13] text-[#E5A93C] text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-md tracking-wider border border-[#E5A93C]/30">
                              {prod.tag}
                            </span>
                          )}
                          
                          <img 
                            src={prod.image} 
                            alt={prod.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                const overlay = document.createElement('div');
                                overlay.className = "absolute inset-0 flex flex-col justify-center items-center p-6 text-center text-white";
                                let iconSvg = '';
                                if (prod.id === 'combo-kit') {
                                  iconSvg = `<span class="p-3 bg-[#C86428]/20 rounded-full text-[#E5A93C] mb-2 border border-[#C86428]/40"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"></path></svg></span>`;
                                } else if (prod.id === 'ovaira') {
                                  iconSvg = `<span class="p-3 bg-[#C86428]/20 rounded-full text-[#E5A93C] mb-2 border border-[#C86428]/40"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l.707-.707m2.828 9.9a5 5 0 113.536 0V21h-3.536v-5.1z"></path></svg></span>`;
                                } else {
                                  iconSvg = `<span class="p-3 bg-[#C86428]/20 rounded-full text-[#E5A93C] mb-2 border border-[#C86428]/40"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg></span>`;
                                }
                                overlay.innerHTML = `
                                  ${iconSvg}
                                  <h4 class="font-serif font-bold text-lg text-[#E5A93C]">${prod.volumeOrQty}</h4>
                                  <p class="text-[10px] uppercase tracking-widest text-[#F7E7D9] mt-1">meONmode Certified</p>
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
                              <span className={prod.id === 'combo-kit' ? 'text-neutral-400' : 'text-neutral-300'}>
                                ({prod.reviewsCount.toLocaleString('en-IN')} reviews)
                              </span>
                            </div>

                            <h3 className={`font-serif text-xl font-extrabold ${prod.id === 'combo-kit' ? 'text-[#4A1D05]' : 'text-white'}`}>
                              {prod.name}
                            </h3>
                            <p className={`text-xs tracking-wider uppercase font-medium mt-0.5 ${prod.id === 'combo-kit' ? 'text-neutral-500' : 'text-neutral-300'}`}>
                              {prod.subtitle}
                            </p>
                            <p className={`text-sm mt-2.5 line-clamp-3 leading-relaxed ${prod.id === 'combo-kit' ? 'text-neutral-600' : 'text-[#F7E7D9]'}`}>
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
                                prod.id === 'combo-kit' 
                                  ? 'text-red-700 bg-red-50 border-red-600/50 shadow-[0_0_8px_rgba(185,28,28,0.2)]' 
                                  : 'text-amber-400 bg-amber-950/50 border-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                              }`}>
                                {Math.round(((prod.mrp - prod.price) / prod.mrp) * 100)}% Off
                              </span>
                            </div>

                            {/* CTAs */}
                            <div className={`flex flex-col gap-2 pt-2 border-t ${prod.id === 'combo-kit' ? 'border-neutral-100' : 'border-white/10'}`}>
                              <div className="grid grid-cols-2 gap-2">
                                <button 
                                  onClick={() => handleProductClick(prod)}
                                  className={`text-xs font-bold py-2.5 px-3 rounded-xl border transition-all hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] text-center cursor-pointer ${
                                    prod.id === 'combo-kit' 
                                      ? 'border-neutral-200 text-neutral-700 bg-neutral-50 hover:bg-neutral-100' 
                                      : 'border-white/10 text-white bg-white/5 hover:bg-white/10'
                                  }`}
                                >
                                  View Details
                                </button>
                                <button 
                                  onClick={() => addToCart(prod, 1)}
                                  className={`text-xs font-bold py-2.5 px-3 rounded-xl transition-all hover:shadow-[0_0_15px_rgba(200,100,40,0.5)] text-center cursor-pointer ${
                                    prod.id === 'combo-kit' 
                                      ? 'bg-[#C86428] text-white hover:bg-[#8B3B15]' 
                                      : 'bg-[#C86428] text-white hover:bg-[#8B3B15]'
                                  }`}
                                >
                                  Add to Cart
                                </button>
                              </div>
                              
                              <button 
                                onClick={() => handleQuickBuy(prod)}
                                className={`w-full text-xs font-extrabold py-3 px-4 rounded-xl transition-all hover:shadow-[0_0_15px_rgba(200,100,40,0.5)] text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                                  prod.id === 'combo-kit' 
                                    ? 'bg-[#5C1D13] text-white hover:bg-[#4A1D05]' 
                                    : 'bg-gradient-to-r from-[#C86428] to-[#E5A93C] text-white hover:brightness-110 shadow-lg shadow-[#4A1D05]/30'
                                }`}
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Quick Buy Now (COD Free)</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
            </section>

            {/* Bento Block 5: Reassuring Medical Statement (Col Span 7) */}
            <section className="lg:col-span-7 bg-[#5C1D13]/70 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-3xl flex flex-col justify-between shadow-2xl space-y-6">
              <div className="space-y-4">
                <span className="text-[#E5A93C] text-xs font-bold tracking-widest uppercase block">Clinically Certified Wellness</span>
                <h2 className="font-serif text-2xl md:text-3.5xl font-extrabold text-white leading-tight">
                  No Synthetic Pills. Just Pure, Standardized Ayurvedic Shastras.
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
                  <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black/20">
                    <span className="block text-[10px] uppercase font-bold text-[#E5A93C] p-2 bg-[#5C1D13]/60 text-center border-b border-white/5">100% Raw Roots & Bark</span>
                    <img 
                      src="https://i.postimg.cc/K34wqnG9/Chat-GPT-Image-Jun-20-2026-10-27-28-PM.png" 
                      alt="100% Ayurvedic Ingredients / Roots & Bark" 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black/20">
                    <span className="block text-[10px] uppercase font-bold text-[#E5A93C] p-2 bg-[#5C1D13]/60 text-center border-b border-white/5">Ayurveda vs Synthetic Pills</span>
                    <img 
                      src="https://i.postimg.cc/zH36tnz2/Chat-GPT-Image-Jun-20-2026-10-27-39-PM.png" 
                      alt="Why Ayurvedic capsules are better Comparison" 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>

                <p className="text-[#F7E7D9] text-xs sm:text-sm leading-relaxed">
                  Most hormonal pills are packed with heavy doses of synthetic estrogen which trigger high weight gain, blood pressure spikes, and mental anxiety. meONmode® relies purely on bio-active phytoestrogens and uterine toners processed inside GMP certified facilities.
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
                <h4 className="font-serif text-lg font-bold text-white text-center border-b border-white/10 pb-3">Clinical Period Support Score</h4>
                <p className="text-[11px] text-[#F7E7D9]/80 text-center">Observed improvements over 90 days</p>
              </div>

              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-black/20">
                <img 
                  src="https://i.postimg.cc/KRTN2HMB/Chat-GPT-Image-Jun-20-2026-10-27-45-PM.png" 
                  alt="Bye Bye Period Problems / 87% & 95% Results" 
                  className="w-full h-auto object-cover"
                />
              </div>
              
              <div className="space-y-4 text-xs font-semibold">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Irregular Flow Regularized (Within 45 Days)</span>
                    <span className="text-[#E5A93C]">94%</span>
                  </div>
                  <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[#C86428] to-[#E5A93C] h-full rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Agonizing Pelvic Cramps Reduced</span>
                    <span className="text-[#E5A93C]">97%</span>
                  </div>
                  <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[#C86428] to-[#E5A93C] h-full rounded-full" style={{ width: '97%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Cyst Clearance & LH/FSH Balanced</span>
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
                <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-white">Hear from our meONmode® Sisters</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                {/* Featured Video / Visual Testimonial from Sneha Patel */}
                <div className="md:col-span-5 bg-[#5C1D13]/40 backdrop-blur-md border border-[#E5A93C]/20 rounded-3xl p-6 flex flex-col justify-center space-y-4 shadow-lg hover:bg-[#5C1D13]/55 transition-colors">
                  <h4 className="font-serif font-bold text-[#E5A93C] text-xs uppercase tracking-widest text-center">Featured Sister Story</h4>
                  <div className="rounded-2xl overflow-hidden border border-white/10 shadow-md bg-black/40">
                    <img 
                      src="https://i.postimg.cc/JHtv6br6/Chat-GPT-Image-Jun-20-2026-10-27-30-PM.png" 
                      alt="Sneha Patel Testimonial" 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <p className="text-xs text-white/90 leading-relaxed text-center italic">
                    "My ovarian cysts reduced completely and cycles returned within 90 days!"
                  </p>
                </div>

                {/* Grid of Text Testimonials */}
                <div className="md:col-span-7 grid grid-cols-1 gap-4 flex flex-col justify-between">
                  {TESTIMONIALS.map((t, idx) => (
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
                    You are not alone in this journey. Connect with 10,000+ sisters, get daily Ayurvedic lifestyle tips, diet plans, and direct expert consultations inside our exclusive Wellness Club.
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
                      className="w-full h-auto object-cover max-h-64" 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const fb = document.createElement('div');
                          fb.className = "p-8 text-center text-white/80 font-medium text-xs flex flex-col items-center justify-center min-h-[180px]";
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
                <h3 className="font-serif text-2xl md:text-3.5xl font-extrabold text-white">Period Health Queries Answered</h3>
                <p className="text-[#F7E7D9]/80 text-xs sm:text-sm">Empowering you with complete, transparent Ayurvedic clinical facts.</p>
              </div>

              <div className="space-y-3 max-w-3xl mx-auto pt-4 border-t border-white/5">
                {FAQS.map((faq, idx) => (
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
              const isMens = false;
              return (
                <div className={`rounded-3xl overflow-hidden shadow-2xl border ${
                  isMens 
                    ? 'bg-[#4A1D05]/95 text-white border-[#E5A93C]/40 shadow-[#4A1D05]/50' 
                    : 'bg-[#FDFEFE] text-neutral-900 border-amber-light'
                }`}>
                  <div className="grid grid-cols-1 md:grid-cols-12">
                    
                    {/* Image Column */}
                    <div className="md:col-span-5 h-80 md:h-auto min-h-[350px] relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#8B3B15] to-[#4A1D05]">
                      {selectedProduct.tag && (
                        <span className={`absolute top-4 left-4 z-10 text-[10px] font-extrabold px-3 py-1.5 rounded-full tracking-wider shadow-md ${
                          isMens 
                            ? 'bg-[#E5A93C] text-neutral-900 border border-neutral-900/10' 
                            : 'bg-[#5C1D13] text-[#E5A93C]'
                        }`}>
                          {selectedProduct.tag}
                        </span>
                      )}

                      <img 
                        src={selectedProduct.image} 
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const fallback = document.createElement('div');
                            fallback.className = "absolute inset-0 flex flex-col justify-center items-center p-8 text-center text-white";
                            fallback.innerHTML = `
                              <span class="p-4 ${isMens ? 'bg-[#E5A93C]/10 border-[#E5A93C]/30 text-[#E5A93C]' : 'bg-[#C86428]/30 border-[#E5A93C]/30 text-[#E5A93C]'} rounded-full mb-3 border">
                                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                              </span>
                              <h4 class="font-serif font-extrabold text-2xl text-[#E5A93C]">${selectedProduct.name}</h4>
                              <p class="text-xs text-neutral-300 mt-1 uppercase tracking-widest">${selectedProduct.volumeOrQty}</p>
                              <div class="mt-4 ${isMens ? 'bg-[#E5A93C] text-neutral-950 font-black' : 'bg-[#5C1D13] text-white font-bold'} border border-white/10 px-4 py-2 rounded-xl text-xs">100% Doctor Approved Herbal Formula</div>
                            `;
                            parent.appendChild(fallback);
                          }
                        }}
                      />
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
                          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
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
                          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
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
                              className="w-full h-auto object-contain max-h-[220px] transition-transform duration-500 group-hover:scale-105"
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
                              className="w-full h-auto object-contain max-h-[220px] transition-transform duration-500 group-hover:scale-105"
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
                      className="w-full h-auto object-cover animate-pulse-slow"
                    />
                  </div>

                  <div className="space-y-4">
                    {selectedProduct.keyIngredients.map((ing, iIdx) => {
                      const isMens = false;
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
                    <div className="flex justify-between text-[#F7E7D9]/80 font-semibold drop-shadow-sm">
                      <span>Discreet Delivery Shipping</span>
                      <span className="text-emerald-400 font-bold uppercase tracking-wider">FREE</span>
                    </div>
                    <div className="flex justify-between text-[#F7E7D9]/80 font-semibold drop-shadow-sm">
                      <span>Cash On Delivery (COD) charges</span>
                      <span className="text-emerald-400 font-bold uppercase tracking-wider">FREE</span>
                    </div>
                    
                    <div className="border-t border-white/10 pt-3 flex justify-between items-baseline">
                      <span className="font-serif text-sm font-bold text-white drop-shadow-md">Net Price to Pay (On COD)</span>
                      <span 
                        className="font-serif text-lg font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                      >
                        ₹{getCartTotal().toLocaleString('en-IN')}
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
                      <h3 className="font-serif text-xl font-bold text-[#4A1D05]">Fill Delivery Details</h3>
                      <p className="text-xs text-neutral-500">Provide shipping details to book your parcel with Cash on Delivery (COD).</p>
                    </div>

                    <form onSubmit={handleCheckoutSubmit} className="space-y-5">
                      
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
                  <span className="font-bold text-emerald-400">Cash On Delivery (COD)</span>
                </div>
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

        <div className="border-t border-white/5 pt-8 text-[11px] text-neutral-400 max-w-2xl mx-auto space-y-2">
          <p>© 2026 meONmode® Ayurvedic Wellness. All rights reserved.</p>
          <p className="leading-relaxed">
            Disclaimer: Ayurveda is a holistic approach. While our therapeutic claims are supported by ancient texts and clinical audits of selected herbs, individual results can fluctuate depending on underlying health conditions (e.g. chronic metabolic blockages). Consult your Ayurvedic physician.
          </p>
        </div>
      </footer>

    </div>
  );
}
