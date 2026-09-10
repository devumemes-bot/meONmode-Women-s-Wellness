import React from 'react';
import { Sparkles, ShoppingBag, ArrowRight, ShieldCheck, Leaf, Flower2, Check, Zap, Award } from 'lucide-react';
import { Product } from '../types';
import { optimizeCloudinaryUrl } from '../data';

interface HeroProps {
  activeCategory: 'all' | 'women' | 'men';
  setActiveCategory: (cat: 'all' | 'women' | 'men') => void;
  onQuickBuy: (product: Product) => void;
  onProductClick: (product: Product) => void;
  womenProducts: Product[];
  menProducts: Product[];
  scrollToCatalog: () => void;
  t: (key: string) => string;
}

export const Hero: React.FC<HeroProps> = ({
  activeCategory,
  setActiveCategory,
  onQuickBuy,
  onProductClick,
  womenProducts,
  menProducts,
  scrollToCatalog,
  t
}) => {
  const womenCombo = womenProducts[0]; // combo-kit
  const menCombo = menProducts[2] || menProducts[0]; // mens-combo

  // ----------------------------------------------------
  // HERO 1: BRAND-FIRST NEUTRAL HERO (When activeCategory === 'all')
  // ----------------------------------------------------
  if (activeCategory === 'all') {
    return (
      <section 
        id="brand-neutral-hero" 
        className="lg:col-span-12 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-[#1c0e08] via-[#160a05] to-[#0f0603] border-2 border-[#FAF6F0]/15 p-6 sm:p-10 md:p-14 shadow-2xl text-white space-y-10"
      >
        {/* Soft Ambient Depth Glows */}
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-[#E8621A]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-80 h-80 bg-[#E5A93C]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-[#2D5A2D]/15 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Header: Brand Tagline & Headline */}
        <div className="text-center max-w-3xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#FAF6F0]/10 border border-[#E5A93C]/30 text-[#E5A93C] text-[11px] font-extrabold uppercase tracking-widest py-1.5 px-4 rounded-full shadow-sm font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
            <span>Ayurvedic Botanical Science • Made in India</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.12]">
            Ancient Ayurvedic Wisdom. <br />
            <span className="bg-gradient-to-r from-[#E5A93C] via-[#F7D28B] to-[#C86428] bg-clip-text text-transparent">
              Targeted Modern Restorations.
            </span>
          </h1>

          <p className="text-[#FAF6F0]/85 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-sans font-normal">
            Pure, standardized herbal extracts crafted to restore internal rhythm, cellular vitality, and hormonal harmony for women and men — with zero synthetic additives.
          </p>
        </div>

        {/* Two-Door Category Gateway Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 max-w-5xl mx-auto">
          
          {/* Card 1: Women's Wellness Gateway */}
          <div 
            id="hero-gateway-women"
            className="group relative rounded-3xl bg-gradient-to-br from-[#2D1610] to-[#1F0D08] border-2 border-[#B5706A]/30 hover:border-[#E5A93C] p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-all duration-300 shadow-xl hover:shadow-[0_15px_40px_rgba(181,112,106,0.2)] transform hover:-translate-y-1"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest font-black font-mono text-[#F5EDE9] bg-[#B5706A]/40 border border-[#B5706A]/50 px-3 py-1 rounded-full">
                  🌸 Women's Wellness
                </span>
                <span className="text-xs font-bold text-[#E5A93C]">Formulated for Her</span>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl sm:text-3xl font-black text-white group-hover:text-[#F5EDE9] transition-colors">
                  Hormonal & Cycle Balance
                </h3>
                <p className="text-xs sm:text-sm text-[#FAF6F0]/80 leading-relaxed font-sans">
                  Targeted Ayurvedic care for PCOS/PCOD management, cycle regularity, period cramps, and uterine rejuvenation with OVAIRA & FLOWELLE.
                </p>
              </div>

              {/* Key Highlights */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs text-[#FAF6F0]/90">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#E5A93C] shrink-0" />
                  <span>Shatavari & Ashoka</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#E5A93C] shrink-0" />
                  <span>30-Day Cycle Reset</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#E5A93C] shrink-0" />
                  <span>No Heavy Metals</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#E5A93C] shrink-0" />
                  <span>Personalized Diet Plan</span>
                </div>
              </div>
            </div>

            {/* Bottom Action Row */}
            <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('women');
                  scrollToCatalog();
                }}
                className="w-full bg-gradient-to-r from-[#B5706A] to-[#C86428] hover:brightness-110 text-white font-extrabold text-xs sm:text-sm py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
              >
                <span>Explore Women's Care</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Men's Vitality Gateway */}
          <div 
            id="hero-gateway-men"
            className="group relative rounded-3xl bg-gradient-to-br from-[#1C1A17] to-[#121110] border-2 border-[#E5A93C]/30 hover:border-[#E5A93C] p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-all duration-300 shadow-xl hover:shadow-[0_15px_40px_rgba(229,169,60,0.2)] transform hover:-translate-y-1"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest font-black font-mono text-[#E5A93C] bg-[#E5A93C]/10 border border-[#E5A93C]/30 px-3 py-1 rounded-full">
                  ⚡ Men's Vitality
                </span>
                <span className="text-xs font-bold text-amber-300">Formulated for Him</span>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl sm:text-3xl font-black text-white group-hover:text-amber-200 transition-colors">
                  Cellular Energy & Stamina
                </h3>
                <p className="text-xs sm:text-sm text-[#FAF6F0]/80 leading-relaxed font-sans">
                  Clinically balanced Rasayana herbs for peak physical stamina, cellular recovery, and muscular endurance with ALPHAMAX & WANTMORE.
                </p>
              </div>

              {/* Key Highlights */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs text-[#FAF6F0]/90">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#E5A93C] shrink-0" />
                  <span>Grade-A Shudh Shilajit</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#E5A93C] shrink-0" />
                  <span>Ashwagandha & Musli</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#E5A93C] shrink-0" />
                  <span>Zero Caffeine Rebound</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#E5A93C] shrink-0" />
                  <span>Personalized Diet Plan</span>
                </div>
              </div>
            </div>

            {/* Bottom Action Row */}
            <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('men');
                  scrollToCatalog();
                }}
                className="w-full bg-gradient-to-r from-[#C86428] to-[#E5A93C] hover:brightness-110 text-[#1C1A17] font-extrabold text-xs sm:text-sm py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
              >
                <span>Explore Men's Vitality</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* High-Trust Strip */}
        <div id="hero-trust-strip" className="pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10 max-w-5xl mx-auto">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-3 shadow-sm">
            <span className="text-[#E5A93C] font-black text-sm">✓</span>
            <span className="text-xs font-bold text-white/90">100% Ayurvedic Standardized</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-3 shadow-sm">
            <span className="text-[#E5A93C] font-black text-sm">✓</span>
            <span className="text-xs font-bold text-white/90">Zero Synthetic Fillers</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-3 shadow-sm">
            <span className="text-[#E5A93C] font-black text-sm">✓</span>
            <span className="text-xs font-bold text-white/90">Free Body-Type Diet Plan</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-3 shadow-sm">
            <span className="text-[#E5A93C] font-black text-sm">✓</span>
            <span className="text-xs font-bold text-white/90">Discreet Delivery & COD</span>
          </div>
        </div>

      </section>
    );
  }

  // ----------------------------------------------------
  // HERO 2: DEDICATED WOMEN'S WELLNESS HERO
  // ----------------------------------------------------
  if (activeCategory === 'women') {
    return (
      <section 
        id="women-dedicated-hero" 
        className="lg:col-span-12 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-[#25120C] via-[#190B06] to-[#0E0503] border-2 border-[#FAF6F0]/20 p-6 sm:p-10 md:p-14 shadow-2xl text-white"
      >
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#C86428]/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#E5A93C]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Text Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#FAF6F0]/10 border border-[#FAF6F0]/20 text-[#FAF6F0] text-[10px] font-extrabold uppercase tracking-widest py-1.5 px-4 rounded-full font-mono shadow-sm">
              <Flower2 className="w-3.5 h-3.5 text-[#E5A93C]" />
              <span>Women's Hormonal & Cycle Health</span>
            </div>

            <div className="space-y-3">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#FAF6F0] tracking-tight leading-[1.1]">
                Targeted Care for Every Stage of Womanhood.
              </h2>
              <p className="text-[#FAF6F0]/85 text-xs sm:text-sm md:text-base leading-relaxed font-sans max-w-xl">
                A daily 30-second Ayurvedic protocol formulated with Shatavari, Lodhra, Ashoka, and Kanchnar to support balanced hormones, cycle regularity, and pelvic comfort without chemical dependency.
              </p>
            </div>

            {/* Spec Checks */}
            <div className="grid grid-cols-2 gap-3 max-w-md pt-1 text-xs text-[#FAF6F0]/90">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#E5A93C] shrink-0" />
                <span>Supports Cycle Regularity</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#E5A93C] shrink-0" />
                <span>Relieves Severe Cramps</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#E5A93C] shrink-0" />
                <span>PCOS / PCOD Care</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#E5A93C] shrink-0" />
                <span>Zero Synthetic Hormones</span>
              </div>
            </div>

            {/* Free Bonus Diet Plan Box */}
            <div className="bg-white/5 border border-white/15 rounded-2xl p-3.5 flex items-center gap-3.5 max-w-md shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-[#E5A93C]/20 border border-[#E5A93C]/40 flex items-center justify-center shrink-0 text-base">
                🥗
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-wider bg-[#E5A93C] text-[#23120B] px-2 py-0.5 rounded-full font-mono">
                    FREE BONUS
                  </span>
                  <span className="text-[11px] font-bold text-[#E5A93C]">Included with every order</span>
                </div>
                <p className="text-xs font-bold text-white mt-0.5">
                  Personalized Ayurvedic Diet Plan based on your body weight and Prakriti
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <button
                id="women-hero-primary-btn"
                onClick={() => {
                  if (womenCombo) onQuickBuy(womenCombo);
                }}
                className="bg-gradient-to-r from-[#C86428] via-[#E5A93C] to-[#C86428] hover:brightness-110 text-[#23120B] font-extrabold text-xs sm:text-sm py-4 px-8 rounded-full shadow-xl shadow-black/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 text-center flex items-center justify-center gap-2.5 cursor-pointer uppercase tracking-wider"
              >
                <ShoppingBag className="w-4.5 h-4.5" />
                <span>Shop Women's Kit — ₹1,999</span>
              </button>
              <button
                id="women-hero-secondary-btn"
                onClick={scrollToCatalog}
                className="bg-transparent hover:bg-white/5 border-2 border-[#FAF6F0]/60 hover:border-[#FAF6F0] text-[#FAF6F0] font-extrabold text-xs sm:text-sm py-3.5 px-8 rounded-full transition-all duration-300 text-center cursor-pointer hover:scale-[1.02] active:scale-95 uppercase tracking-wider"
              >
                View All Formulations
              </button>
            </div>
          </div>

          {/* Right Column: Visual Product Showcase */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-[340px] md:max-w-md aspect-[4/5] rounded-[2.5rem] overflow-hidden p-6 shadow-2xl border-2 border-[#E5A93C]/25 bg-gradient-to-b from-[#2A130B] to-[#120502] flex flex-col justify-end">
              <div className="absolute top-6 left-6 bg-[#4A1D05] text-[#E5A93C] px-3 py-1 rounded-md border border-[#E5A93C]/30 z-20 shadow-md">
                <span className="text-[9px] uppercase tracking-widest font-black font-mono flex items-center gap-1">
                  ✨ Gold Batch Harvest
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (womenCombo) onProductClick(womenCombo);
                }}
                className="w-full relative z-20 focus:outline-none cursor-pointer overflow-hidden block group/hero-img rounded-2xl mt-auto"
                title="Click to view details"
              >
                <img 
                  src={optimizeCloudinaryUrl("https://res.cloudinary.com/ukqeabxy/image/upload/v1787512641/ChatGPT_Image_Jun_27_2026_at_04_11_06_PM.png", 480)} 
                  alt="meONmode Women's Combo Kit"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  width="320"
                  height="320"
                  className="w-full h-auto max-w-[280px] md:max-w-[320px] object-contain block mx-auto rounded-2xl transform transition-transform duration-700 ease-out group-hover/hero-img:scale-105 filter drop-shadow-[0_25px_25px_rgba(0,0,0,0.6)]"
                />
              </button>

              <div className="absolute bottom-6 left-6 bg-[#4A1D05] text-white text-[9px] font-black tracking-wider uppercase px-3 py-1.5 rounded-full shadow-lg border border-[#E5A93C]/30 z-20">
                🌿 Standardized Shastras
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ----------------------------------------------------
  // HERO 3: DEDICATED MEN'S VITALITY HERO
  // ----------------------------------------------------
  return (
    <section 
      id="men-dedicated-hero" 
      className="lg:col-span-12 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-[#1E1C1A] via-[#141312] to-[#0A0A0A] border-2 border-amber-500/25 p-6 sm:p-10 md:p-14 shadow-2xl text-white"
    >
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-500/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#C86428]/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Column: Text Copy */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#E5A93C]/10 border border-[#E5A93C]/30 text-[#E5A93C] text-[10px] font-extrabold uppercase tracking-widest py-1.5 px-4 rounded-full font-mono shadow-sm">
            <Zap className="w-3.5 h-3.5 text-[#E5A93C]" />
            <span>Men's Vitality & Physical Stamina</span>
          </div>

          <div className="space-y-3">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Uncompromising Strength & Cellular Stamina.
            </h2>
            <p className="text-neutral-300 text-xs sm:text-sm md:text-base leading-relaxed font-sans max-w-xl">
              Restore physical vigor, optimize testosterone synthesis, and elevate cellular ATP with Grade-A Himalayan Shudh Shilajit, KSM-66 Ashwagandha, and Safed Musli.
            </p>
          </div>

          {/* Spec Checks */}
          <div className="grid grid-cols-2 gap-3 max-w-md pt-1 text-xs text-neutral-200">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#E5A93C] shrink-0" />
              <span>Certified Shudh Shilajit</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#E5A93C] shrink-0" />
              <span>Muscular Endurance</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#E5A93C] shrink-0" />
              <span>Zero Synthetic Rebound</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#E5A93C] shrink-0" />
              <span>Personalized Diet Plan</span>
            </div>
          </div>

          {/* Free Bonus Diet Plan Box */}
          <div className="bg-white/5 border border-white/15 rounded-2xl p-3.5 flex items-center gap-3.5 max-w-md shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-base">
              🥗
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-wider bg-[#E5A93C] text-[#23120B] px-2 py-0.5 rounded-full font-mono">
                  FREE BONUS
                </span>
                <span className="text-[11px] font-bold text-[#E5A93C]">Included with every order</span>
              </div>
              <p className="text-xs font-bold text-white mt-0.5">
                Personalized Ayurvedic Strength & Nutrition Diet Guide
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-4">
            <button
              id="men-hero-primary-btn"
              onClick={() => {
                if (menCombo) onQuickBuy(menCombo);
              }}
              className="bg-gradient-to-r from-[#C86428] to-[#E5A93C] hover:brightness-110 text-[#1C1A17] font-extrabold text-xs sm:text-sm py-4 px-8 rounded-full shadow-xl shadow-black/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 text-center flex items-center justify-center gap-2.5 cursor-pointer uppercase tracking-wider"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              <span>Shop Men's Kit — ₹6,999</span>
            </button>
            <button
              id="men-hero-secondary-btn"
              onClick={scrollToCatalog}
              className="bg-transparent hover:bg-white/5 border-2 border-white/40 hover:border-white text-white font-extrabold text-xs sm:text-sm py-3.5 px-8 rounded-full transition-all duration-300 text-center cursor-pointer hover:scale-[1.02] active:scale-95 uppercase tracking-wider"
            >
              View All Formulations
            </button>
          </div>
        </div>

        {/* Right Column: Visual Product Showcase */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="relative w-full max-w-[340px] md:max-w-md aspect-[4/5] rounded-[2.5rem] overflow-hidden p-6 shadow-2xl border-2 border-amber-500/25 bg-gradient-to-b from-[#2A2825] to-[#121110] flex flex-col justify-end">
            <div className="absolute top-6 left-6 bg-[#2B221B] text-[#E5A93C] px-3 py-1 rounded-md border border-[#E5A93C]/30 z-20 shadow-md">
              <span className="text-[9px] uppercase tracking-widest font-black font-mono flex items-center gap-1">
                ⚡ Himalayan Certified Shilajit
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                if (menCombo) onProductClick(menCombo);
              }}
              className="w-full relative z-20 focus:outline-none cursor-pointer overflow-hidden block group/hero-img rounded-2xl mt-auto"
              title="Click to view details"
            >
              <img 
                src={optimizeCloudinaryUrl("https://res.cloudinary.com/ukqeabxy/image/upload/v1787581402/ChatGPT_Image_Aug_24_2026_07_42_58_PM.png", 480)} 
                alt="meONmode Men's Combo"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                width="320"
                height="320"
                className="w-full h-auto max-w-[280px] md:max-w-[320px] object-contain block mx-auto rounded-2xl transform transition-transform duration-700 ease-out group-hover/hero-img:scale-105 filter drop-shadow-[0_25px_25px_rgba(0,0,0,0.6)]"
              />
            </button>

            <div className="absolute bottom-6 left-6 bg-[#2B221B] text-white text-[9px] font-black tracking-wider uppercase px-3 py-1.5 rounded-full shadow-lg border border-[#E5A93C]/30 z-20">
              🌿 Standardized Rasayana
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
