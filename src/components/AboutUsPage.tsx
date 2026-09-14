import React from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Leaf, 
  Heart, 
  Zap, 
  Droplet, 
  Activity, 
  Compass, 
  ArrowRight,
  PackageCheck,
  CheckCircle2,
  CalendarCheck2,
  Award
} from 'lucide-react';
import { Product } from '../types';
import { optimizeCloudinaryUrl } from '../data';

interface AboutUsPageProps {
  onBackToHome: () => void;
  onNavigateToView: (view: any) => void;
  onSelectProduct: (product: Product) => void;
  products: Product[];
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({
  onBackToHome,
  onNavigateToView,
  onSelectProduct,
  products
}) => {
  // Categorize products for the view
  const womenProducts = products.filter(p => p.id === 'combo-kit' || p.id === 'ovaira' || p.id === 'flowelle');
  const menProducts = products.filter(p => p.id === 'mens-combo' || p.id === 'wantmore-men' || p.id === 'alphamax-men');
  const digestiveProduct = products.find(p => p.id === 'vayucore');

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-4 animate-fade-in text-left text-white">
      {/* Top Header / Back Navigation */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <button
          onClick={onBackToHome}
          className="p-2.5 hover:bg-white/10 rounded-full text-white transition-colors flex items-center justify-center cursor-pointer"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-[#E5A93C] text-[11px] font-mono font-bold tracking-widest uppercase block">
            Ayurvedic Heritage & Philosophy
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
            About meONmode®
          </h1>
        </div>
      </div>

      {/* SECTION 1: HERO & BRAND MISSION */}
      <section className="relative rounded-3xl bg-gradient-to-br from-[#2A160F] via-[#1C110D] to-[#120A06] border border-white/15 p-6 sm:p-10 md:p-12 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E5A93C]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C86428]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 bg-[#E5A93C]/15 border border-[#E5A93C]/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#E5A93C]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Rooted in Classical Ayurveda • Crafted for Modern Living</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
            Targeted Ayurvedic Formulations for Everyday Life
          </h2>

          <p className="text-white/85 text-sm sm:text-base leading-relaxed">
            <strong className="text-white font-bold">meONmode®</strong> is an Indian wellness brand dedicated to bringing the time-tested wisdom of classical Ayurvedic texts into modern, practical daily routines. Rather than offering generic multi-herbal promises, we design focused, purpose-driven botanical formulations that directly address specific wellness needs across women&apos;s cycle harmony, men&apos;s physical vigor, and daily digestive equilibrium.
          </p>

          <p className="text-white/75 text-sm leading-relaxed">
            In a fast-paced world marked by irregular schedules, nutritional gaps, and persistent stress, our formulations are engineered to help the body restore its natural physiological rhythm through authentic, standardized herbal extracts and time-honored Ayurvedic Rasayanas.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-[#E5A93C]">
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
              <Award className="w-4 h-4 text-[#E5A93C]" />
              <span>GMP-Certified Facilities</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span>Standardized Botanical Extracts</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Zero Synthetic Steroids or Hormones</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: OUR APPROACH TO EVERYDAY WELLNESS */}
      <section className="space-y-6">
        <div className="text-left space-y-1">
          <span className="text-[#E5A93C] text-xs font-mono font-bold tracking-wider uppercase">
            Core Philosophy
          </span>
          <h2 className="font-serif text-2xl font-bold text-white">
            Our Approach to Everyday Wellness
          </h2>
          <p className="text-white/70 text-xs sm:text-sm max-w-2xl">
            True wellness is sustained by balance, gentle consistency, and deep respect for individual physiology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white/5 border border-white/10 hover:border-[#E5A93C]/40 rounded-2xl p-6 space-y-3 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C]">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-white">Targeted by Need</h3>
            <p className="text-white/75 text-xs sm:text-sm leading-relaxed">
              We organize products strictly by functional wellness needs—such as menstrual cycle regularity, hormonal harmony, endurance support, and gut digestive comfort—so you can find exactly what your body requires.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 hover:border-[#E5A93C]/40 rounded-2xl p-6 space-y-3 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-white">Standardized Botanicals</h3>
            <p className="text-white/75 text-xs sm:text-sm leading-relaxed">
              We insist on standardized botanical extracts with verified bioactive markers—such as withanolides in Ashwagandha, shatavarins in Shatavari, and fulvic acid in Shilajit—ensuring consistent batch-to-batch quality.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 hover:border-[#E5A93C]/40 rounded-2xl p-6 space-y-3 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#C86428]/20 border border-[#C86428]/40 flex items-center justify-center text-[#E5A93C]">
              <CalendarCheck2 className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-white">Practical Daily Rituals</h3>
            <p className="text-white/75 text-xs sm:text-sm leading-relaxed">
              Ayurvedic nourishment is not a quick fix; it thrives on gentle, cumulative consistency. Our capsules, herbal syrups, and prash preparations easily fit into a 30-second post-meal morning or evening routine.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: EXPLORE OUR WELLNESS RANGES (WOMEN & MEN) */}
      <section className="space-y-6">
        <div className="text-left space-y-1">
          <span className="text-[#E5A93C] text-xs font-mono font-bold tracking-wider uppercase">
            Collections
          </span>
          <h2 className="font-serif text-2xl font-bold text-white">
            Explore Our Wellness Collections
          </h2>
          <p className="text-white/70 text-xs sm:text-sm max-w-2xl">
            Dedicated herbal collections addressing the distinct physiological and lifestyle demands of women and men.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Women's Range Card */}
          <div className="bg-gradient-to-br from-[#2D141E]/80 to-[#1C110D] border border-pink-500/25 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 bg-pink-500/15 border border-pink-500/30 px-3 py-1 rounded-full text-xs font-semibold text-pink-300">
                  <Heart className="w-3.5 h-3.5 text-pink-400" />
                  <span>Women&apos;s Care</span>
                </span>
                <span className="text-white/50 text-xs font-mono">Hormonal & Cycle Support</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Women&apos;s Wellness Range
              </h3>
              <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                Formulated with revered classical uterine herbs like Shatavari, Ashok Chal, Lodhra, and Kanchnar Guggulu. Designed to support predictable cycle timing, ease monthly pelvic tension and cramps, balance reproductive endocrine rhythms, and support overall vitality throughout life&apos;s phases.
              </p>
              <ul className="space-y-1.5 text-xs text-white/75 font-medium pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                  <span>Cycle regularity & flow balance (FLOWELLE)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                  <span>Ovarian tissue nourishment & LH/FSH balance (OVAIRA)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                  <span>Dual-action 30-day comprehensive care (Combo Kit)</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => onNavigateToView('women')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-pink-900/60 hover:bg-pink-800/80 border border-pink-500/40 text-pink-100 font-bold text-xs py-3 px-6 rounded-xl transition-all cursor-pointer shadow-lg"
              >
                <span>View Women&apos;s Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Men's Range Card */}
          <div className="bg-gradient-to-br from-[#1F2212]/80 to-[#1C110D] border border-[#E5A93C]/25 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 bg-[#E5A93C]/15 border border-[#E5A93C]/30 px-3 py-1 rounded-full text-xs font-semibold text-[#E5A93C]">
                  <Zap className="w-3.5 h-3.5 text-[#E5A93C]" />
                  <span>Men&apos;s Care</span>
                </span>
                <span className="text-white/50 text-xs font-mono">Energy & Stamina</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Men&apos;s Wellness Range
              </h3>
              <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                Featuring classical Ayurvedic Rasayanas including Himalayan Shudh Shilajit, Safed Musli, Ashwagandha, Swaran Bhasma, and Salam Panja. Engineered to combat chronic mental exhaustion, support healthy microcirculation, restore natural cellular stamina, and nurture masculine reproductive vigor.
              </p>
              <ul className="space-y-1.5 text-xs text-white/75 font-medium pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E5A93C] shrink-0" />
                  <span>Cellular energy, ATP, and endurance (ALPHAMAX)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E5A93C] shrink-0" />
                  <span>Precious Bhasma & Rasayana Prash for performance (WANTMORE)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E5A93C] shrink-0" />
                  <span>Ultimate Performance Combo with complimentary VAYUCORE</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => onNavigateToView('men')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#E5A93C]/20 hover:bg-[#E5A93C]/30 border border-[#E5A93C]/40 text-[#E5A93C] font-bold text-xs py-3 px-6 rounded-xl transition-all cursor-pointer shadow-lg"
              >
                <span>View Men&apos;s Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: PRODUCT OVERVIEW & FUNCTIONAL CATEGORIES */}
      <section className="space-y-6">
        <div className="text-left space-y-1">
          <span className="text-[#E5A93C] text-xs font-mono font-bold tracking-wider uppercase">
            Product Catalog
          </span>
          <h2 className="font-serif text-2xl font-bold text-white">
            Our Purpose-Driven Formulations
          </h2>
          <p className="text-white/70 text-xs sm:text-sm max-w-2xl">
            Each remedy is formulated to address specific daily requirements, allowing you to choose the exact path your body needs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* OVAIRA */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 flex flex-col justify-between hover:border-white/20 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-pink-400 font-bold">Women&apos;s Hormone Balance</span>
                <span className="text-white/50">60 Veg Capsules</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-white">meONmode® OVAIRA</h3>
              <p className="text-white/75 text-xs leading-relaxed">
                Formulated to support ovarian wellness, ovarian tissue health, and menstrual cycle balance. Enriched with Shatavari, Lodhra, and Kanchnar Guggulu to nourish female endocrine harmony.
              </p>
              <div className="text-xs text-[#E5A93C] font-semibold">
                Key herbs: Shatavari, Lodhra, Kanchnar
              </div>
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="font-mono font-bold text-sm text-white">₹1,199</span>
              {products.find(p => p.id === 'ovaira') && (
                <button
                  type="button"
                  onClick={() => onSelectProduct(products.find(p => p.id === 'ovaira')!)}
                  className="text-xs font-bold text-[#E5A93C] hover:text-[#f3be5d] flex items-center gap-1 cursor-pointer"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* FLOWELLE */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 flex flex-col justify-between hover:border-white/20 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-pink-400 font-bold">Cycle Regularity & Flow</span>
                <span className="text-white/50">450 ML Syrup</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-white">meONmode® FLOWELLE</h3>
              <p className="text-white/75 text-xs leading-relaxed">
                Herbal restorative syrup formulated with Ashok Chal, Shatavari, and Gokhru to tone uterine muscles, promote comfortable flow volume, and ease monthly pelvic cramping.
              </p>
              <div className="text-xs text-[#E5A93C] font-semibold">
                Key herbs: Ashok Chal, Shatavari, Gokhru
              </div>
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="font-mono font-bold text-sm text-white">₹999</span>
              {products.find(p => p.id === 'flowelle') && (
                <button
                  type="button"
                  onClick={() => onSelectProduct(products.find(p => p.id === 'flowelle')!)}
                  className="text-xs font-bold text-[#E5A93C] hover:text-[#f3be5d] flex items-center gap-1 cursor-pointer"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* COMBO KIT */}
          <div className="bg-white/5 border border-pink-500/30 rounded-2xl p-5 space-y-3 flex flex-col justify-between hover:border-pink-500/50 transition-all relative">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-emerald-400 font-bold">Complete Dual Kit</span>
                <span className="text-white/50">Capsules + Syrup</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Women&apos;s Combo Kit</h3>
              <p className="text-white/75 text-xs leading-relaxed">
                The complete 30-day synergistic routine combining OVAIRA capsules and FLOWELLE syrup for holistic menstrual comfort, hormonal rhythm, and reproductive rejuvenation.
              </p>
              <div className="text-xs text-[#E5A93C] font-semibold">
                Best Value • Dual-Action Routine
              </div>
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="font-mono font-bold text-sm text-white">₹1,999</span>
                <span className="text-[10px] text-white/50 line-through ml-1.5 font-mono">₹3,798</span>
              </div>
              {products.find(p => p.id === 'combo-kit') && (
                <button
                  type="button"
                  onClick={() => onSelectProduct(products.find(p => p.id === 'combo-kit')!)}
                  className="text-xs font-bold text-[#E5A93C] hover:text-[#f3be5d] flex items-center gap-1 cursor-pointer"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* ALPHAMAX */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 flex flex-col justify-between hover:border-white/20 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#E5A93C] font-bold">Men&apos;s Stamina & Vigor</span>
                <span className="text-white/50">60 Veg Capsules</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-white">meONmode® ALPHAMAX</h3>
              <p className="text-white/75 text-xs leading-relaxed">
                Vitality capsules with standardized Himalayan Shilajit, Safed Musli, Ashwagandha, Swaran Bhasma, and Kesar to support cellular energy, stress resilience, and physical vigor.
              </p>
              <div className="text-xs text-[#E5A93C] font-semibold">
                Key herbs: Shilajit, Safed Musli, Ashwagandha
              </div>
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="font-mono font-bold text-sm text-white">₹1,999</span>
              {products.find(p => p.id === 'alphamax-men' || p.id === 'alphamax') && (
                <button
                  type="button"
                  onClick={() => onSelectProduct(products.find(p => p.id === 'alphamax-men' || p.id === 'alphamax')!)}
                  className="text-xs font-bold text-[#E5A93C] hover:text-[#f3be5d] flex items-center gap-1 cursor-pointer"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* WANTMORE */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 flex flex-col justify-between hover:border-white/20 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#E5A93C] font-bold">Performance Prash</span>
                <span className="text-white/50">200 Grams Prash</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-white">meONmode® WANTMORE</h3>
              <p className="text-white/75 text-xs leading-relaxed">
                Ayurvedic herbal Prash enriched with Swaran Bhasma, Chandi Bhasma, Moti Pishti, Salam Panja, and Siddh Makardhwaj for endurance, muscle recovery, and stamina.
              </p>
              <div className="text-xs text-[#E5A93C] font-semibold">
                Precious Rasayana & Bhasma formulation
              </div>
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="font-mono font-bold text-sm text-white">₹4,999</span>
              {products.find(p => p.id === 'wantmore-men' || p.id === 'wantmore') && (
                <button
                  type="button"
                  onClick={() => onSelectProduct(products.find(p => p.id === 'wantmore-men' || p.id === 'wantmore')!)}
                  className="text-xs font-bold text-[#E5A93C] hover:text-[#f3be5d] flex items-center gap-1 cursor-pointer"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* VAYUCORE */}
          <div className="bg-white/5 border border-emerald-500/25 rounded-2xl p-5 space-y-3 flex flex-col justify-between hover:border-emerald-500/40 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-emerald-400 font-bold">Digestive & Gut Health</span>
                <span className="text-white/50">450 ML Liquid</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-white">meONmode® VAYUCORE</h3>
              <p className="text-white/75 text-xs leading-relaxed">
                Ayurvedic digestive wellness liquid with Kutki, Kalmegh, Chirayita, and Turmeric to ease persistent bloating, relieve gas and acidity, and nurture balanced gut flora.
              </p>
              <div className="text-xs text-emerald-300 font-semibold">
                Suitable for both men & women
              </div>
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="font-mono font-bold text-sm text-white">₹999</span>
              {digestiveProduct && (
                <button
                  type="button"
                  onClick={() => onSelectProduct(digestiveProduct)}
                  className="text-xs font-bold text-[#E5A93C] hover:text-[#f3be5d] flex items-center gap-1 cursor-pointer"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: AYURVEDIC FORMULATION & INGREDIENT PHILOSOPHY */}
      <section className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="space-y-2">
          <span className="text-[#E5A93C] text-xs font-mono font-bold tracking-wider uppercase">
            Purity Standards
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Ayurvedic Formulation & Purity Standards
          </h2>
          <p className="text-white/80 text-xs sm:text-sm leading-relaxed max-w-3xl">
            In classical Ayurveda, a formulation is judged not merely by the number of ingredients on the label, but by their extraction purity, energetic compatibility (Virya & Vipaka), and biological assimilation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#E5A93C] flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Standardized Extracts</span>
            </h3>
            <p className="text-white/75 text-xs sm:text-sm leading-relaxed">
              We replace crude powders with standardized botanical extracts. This guarantees that each dose delivers a precise, quantified amount of active herbal compounds without variability.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#E5A93C] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Zero Artificial Additives</span>
            </h3>
            <p className="text-white/75 text-xs sm:text-sm leading-relaxed">
              All our remedies are free from synthetic steroids, chemical hormones, parabens, and artificial binders. Formulated for non-habit-forming, gentle everyday wellness.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#E5A93C] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#E5A93C] shrink-0" />
              <span>GMP Audited Manufacturing</span>
            </h3>
            <p className="text-white/75 text-xs sm:text-sm leading-relaxed">
              Formulated and manufactured strictly in audited Good Manufacturing Practice (GMP) compliant facilities in India following rigorous Ayurvedic pharmacopoeia standards.
            </p>
          </div>
        </div>

        {/* Responsible Disclaimer Notice */}
        <div className="bg-black/40 border border-white/10 rounded-2xl p-4 text-xs text-white/60 leading-relaxed">
          <strong className="text-white/80 block mb-1">🌿 Responsible Wellness Commitment:</strong>
          Our formulations are traditional Ayurvedic wellness products intended to support general vitality, cycle comfort, and natural physiological balance. They are not intended to diagnose, treat, cure, or prevent any medical condition. Please consult your physician or qualified Ayurvedic healthcare practitioner if you have an underlying medical condition, are pregnant, or are taking prescription medication.
        </div>
      </section>

      {/* SECTION 6: CHOOSE YOUR WELLNESS PATH (INTERACTIVE CTA CARDS) */}
      <section className="space-y-6">
        <div className="text-left space-y-1">
          <span className="text-[#E5A93C] text-xs font-mono font-bold tracking-wider uppercase">
            Your Journey
          </span>
          <h2 className="font-serif text-2xl font-bold text-white">
            Choose Your Wellness Path
          </h2>
          <p className="text-white/70 text-xs sm:text-sm max-w-2xl">
            Select the collection that aligns with your current wellness focus, or speak directly with our Ayurvedic support desk.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white/5 border border-white/10 hover:border-pink-500/40 rounded-2xl p-6 text-center space-y-4 flex flex-col justify-between transition-all">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 mx-auto">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-white">Women&apos;s Health</h3>
              <p className="text-white/70 text-xs leading-relaxed">
                Cycle comfort, regular flow timing, ovarian nourishment, and hormonal harmony.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToView('women')}
              className="w-full bg-pink-900/60 hover:bg-pink-800 text-pink-100 font-bold text-xs py-2.5 px-4 rounded-xl border border-pink-500/40 transition-colors cursor-pointer"
            >
              Explore Women&apos;s Range
            </button>
          </div>

          <div className="bg-white/5 border border-white/10 hover:border-[#E5A93C]/40 rounded-2xl p-6 text-center space-y-4 flex flex-col justify-between transition-all">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C] mx-auto">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-white">Men&apos;s Vitality</h3>
              <p className="text-white/70 text-xs leading-relaxed">
                Cellular stamina, daily energy, physical endurance, and Ayurvedic vigor support.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToView('men')}
              className="w-full bg-[#E5A93C]/20 hover:bg-[#E5A93C]/30 text-[#E5A93C] font-bold text-xs py-2.5 px-4 rounded-xl border border-[#E5A93C]/40 transition-colors cursor-pointer"
            >
              Explore Men&apos;s Range
            </button>
          </div>

          <div className="bg-white/5 border border-white/10 hover:border-emerald-500/40 rounded-2xl p-6 text-center space-y-4 flex flex-col justify-between transition-all">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <PackageCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-white">All Products</h3>
              <p className="text-white/70 text-xs leading-relaxed">
                Browse our complete catalog of single formulations, digestive care, and combos.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToView('all-products')}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-2.5 px-4 rounded-xl border border-white/20 transition-colors cursor-pointer"
            >
              Browse All Products
            </button>
          </div>
        </div>

        {/* Doctor Consultation CTA */}
        <div className="bg-gradient-to-r from-emerald-950/60 to-black/60 border border-emerald-500/30 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-serif text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <span>🌿 Need Guidance on Choosing the Right Remedy?</span>
            </h3>
            <p className="text-xs text-neutral-300">
              Chat directly with our Ayurvedic wellness support desk on WhatsApp (+91 72908 10336) for confidential guidance.
            </p>
          </div>
          <a
            href="https://api.whatsapp.com/send?phone=917290810336&text=Hello%20meONmode%20Team%2C%20I%20would%20like%20guidance%20on%20choosing%20the%20right%20Ayurvedic%20wellness%20remedy."
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-5 rounded-xl shadow-md transition-colors cursor-pointer"
          >
            Chat with Wellness Desk
          </a>
        </div>
      </section>

      {/* Bottom Action / Return to Shop */}
      <div className="text-center pt-4 border-t border-white/10">
        <button
          onClick={onBackToHome}
          className="bg-gradient-to-r from-[#C86428] to-[#E5A93C] text-white font-extrabold text-sm py-3.5 px-8 rounded-xl shadow-lg active:scale-95 transition-all duration-200 cursor-pointer"
        >
          Return to Shop
        </button>
      </div>
    </div>
  );
};
