import React from 'react';
import { Sparkles, Heart, Zap, ShieldCheck, Activity, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PRODUCTS, MENS_PRODUCTS, VAYUCORE_PRODUCT, optimizeCloudinaryUrl } from '../data';

interface ConcernSelectorProps {
  activeCategory: 'all' | 'women' | 'men';
  setActiveCategory: (cat: 'all' | 'women' | 'men') => void;
  onSelectProduct: (product: any) => void;
}

interface ConcernItem {
  id: string;
  productId: string;
  targetCategory: 'women' | 'men' | 'all';
  concernTitle: string;
  concernBadge: string;
  headline: string;
  description: string;
  keyPills: string[];
  productName: string;
  productSubtitle: string;
  price: number;
  mrp: number;
  discountPct: number;
  image: string;
  accentColor: string;
  accentBg: string;
}

const CONCERNS: ConcernItem[] = [
  // Women's Health
  {
    id: 'pcod-pcos-hormones',
    productId: 'ovaira',
    targetCategory: 'women',
    concernBadge: 'Ovarian & Hormonal Balance',
    concernTitle: 'PCOS / PCOD & Irregular Cycles',
    headline: 'Nurture Ovarian Rhythm & Clear Skin',
    description: 'Specialized 60 veg capsules formulated with Kanchnar, Shatavari & Guggulu to balance LH/FSH ratios, regulate monthly ovulation, and calm stubborn hormonal breakouts.',
    keyPills: ['Ovarian Health', 'Ovulation Support', 'Hormonal Balance', 'Anti-Acne'],
    productName: 'OVAIRA Capsules',
    productSubtitle: '60 Veg Capsules',
    price: 1199,
    mrp: 1999,
    discountPct: 40,
    image: 'https://res.cloudinary.com/ukqeabxy/image/upload/v1787512635/ChatGPT_Image_Jun_20_2026_10_27_18_PM_copy.png',
    accentColor: '#E8621A',
    accentBg: 'from-[#2A1208] to-[#160702]'
  },
  {
    id: 'period-pain-discharge',
    productId: 'flowelle',
    targetCategory: 'women',
    concernBadge: 'Uterine Tone & Comfort',
    concernTitle: 'Period Cramps & Flow Regularity',
    headline: 'Soothe Pelvic Spasms & Toned Flow',
    description: 'Ayurvedic 450 ML restorative syrup with Ashok Chal, Lodhra & Shatavari that eases monthly contractions, relieves white discharge discomfort, and revitalizes energy.',
    keyPills: ['Cramp Comfort', 'White Discharge Care', 'Flow Tone', 'Pure Botanical'],
    productName: 'FLOWELLE Drink',
    productSubtitle: '450 ML Herbal Tonic',
    price: 999,
    mrp: 1799,
    discountPct: 44,
    image: 'https://res.cloudinary.com/ukqeabxy/image/upload/v1787512638/ChatGPT_Image_Jun_20_2026_10_28_00_PM.png',
    accentColor: '#E8621A',
    accentBg: 'from-[#261006] to-[#120502]'
  },
  {
    id: 'complete-women-reset',
    productId: 'combo-kit',
    targetCategory: 'women',
    concernBadge: 'Complete 90-Day Reset',
    concernTitle: 'Complete Women’s Wellness Kit',
    headline: 'Dual-Action Synergy for Total Cycle Harmony',
    description: 'The proven combination of OVAIRA Capsules + FLOWELLE Syrup. Restores hormonal balance, normalizes flow volume, and brings lasting peace to your monthly routine.',
    keyPills: ['Best Value (Save 47%)', 'Dual Synergy', 'Free Diet Plan', 'Free Shipping'],
    productName: 'Women’s Combo Kit',
    productSubtitle: '60 Capsules + 450 ML Syrup',
    price: 1999,
    mrp: 3798,
    discountPct: 47,
    image: 'https://res.cloudinary.com/ukqeabxy/image/upload/v1787512639/ChatGPT_Image_Jun_20_2026_10_28_24_PM.png',
    accentColor: '#E5A93C',
    accentBg: 'from-[#34170A] to-[#1A0903]'
  },

  // Men's Health
  {
    id: 'men-stamina-strength',
    productId: 'wantmore-men',
    targetCategory: 'men',
    concernBadge: 'Stamina & Muscle Power',
    concernTitle: 'Endurance & Daily Physical Strength',
    headline: 'High-Impact Ayurvedic Prash for Active Vitality',
    description: 'Traditional Prash enriched with Swaran Bhasma, Chandi Bhasma, Salam Panja, and Siddh Makardhwaj for deep cellular strength, muscle recovery, and long-lasting stamina.',
    keyPills: ['Gold & Silver Ash', 'Salam Panja', 'Athletic Recovery', 'Zero Artificial Sugars'],
    productName: 'WANTMORE FOR MEN (Prash)',
    productSubtitle: '200g Authentic Ayurvedic Prash',
    price: 4999,
    mrp: 8999,
    discountPct: 44,
    image: 'https://res.cloudinary.com/ukqeabxy/image/upload/v1787581394/ChatGPT_Image_Aug_24_2026_07_28_33_PM.png',
    accentColor: '#E5A93C',
    accentBg: 'from-[#231A08] to-[#110D03]'
  },
  {
    id: 'men-cellular-shilajit',
    productId: 'alphamax-men',
    targetCategory: 'men',
    concernBadge: 'Cellular Energy & Shilajit Matrix',
    concernTitle: 'Fatigue, Stress & Baseline Power',
    headline: 'Pure Shudh Shilajit & Safed Musli Capsules',
    description: '60 veg capsules formulated with Grade-A Himalayan Shilajit, Safed Musli, Ashwagandha & Kesar to boost cellular ATP energy, counter stress fatigue, and support male vigor.',
    keyPills: ['Shudh Shilajit', 'Ashwagandha Extract', 'Stress Reduction', '60 Veg Capsules'],
    productName: 'ALPHAMAX FOR MEN',
    productSubtitle: '60 Concentrated Capsules',
    price: 2499,
    mrp: 4999,
    discountPct: 50,
    image: 'https://res.cloudinary.com/ukqeabxy/image/upload/v1787581390/ChatGPT_Image_Aug_24_2026_07_29_31_PM.png',
    accentColor: '#E5A93C',
    accentBg: 'from-[#1E1E1E] to-[#0D0D0D]'
  },
  {
    id: 'men-ultimate-combo',
    productId: 'mens-combo',
    targetCategory: 'men',
    concernBadge: 'Ultimate Male Vitality Stack',
    concernTitle: 'Complete Men’s Performance Protocol',
    headline: 'WANTMORE Prash + ALPHAMAX + FREE VAYUCORE',
    description: 'Comprehensive dual-action stack for men’s physical performance, cardiovascular endurance, and cellular vitality. Bundled with a full-size 450 ML bottle of VAYUCORE at zero cost.',
    keyPills: ['Save 56%', 'Free VAYUCORE (Worth ₹1,999)', 'Free Diet Plan', 'Free Shipping'],
    productName: 'Men’s Ultimate Performance Combo',
    productSubtitle: '200g Prash + 60 Capsules + 450ml Gut Tonic',
    price: 6999,
    mrp: 15997,
    discountPct: 56,
    image: 'https://res.cloudinary.com/ukqeabxy/image/upload/v1787581402/ChatGPT_Image_Aug_24_2026_07_42_58_PM.png',
    accentColor: '#E5A93C',
    accentBg: 'from-[#2A1D0B] to-[#120B04]'
  },

  // Gut & Digestive Health
  {
    id: 'gut-bloating-digestion',
    productId: 'vayucore',
    targetCategory: 'all',
    concernBadge: 'Universal Gut Health',
    concernTitle: 'Gas, Bloating & Digestive Agni',
    headline: 'Soothe Acidity & Restore Natural Digestion',
    description: 'Authentic 450 ML Ayurvedic digestive liquid with Kutki, Kalmegh, Chirayita, Ajwain & Mulethi. Relieves chronic heaviness, gas distension, and sour acid reflux.',
    keyPills: ['Kutki & Kalmegh', 'Liver & Agni Support', 'Gas & Bloat Relief', '450 ML Tonic'],
    productName: 'VAYUCORE Digestive Liquid',
    productSubtitle: '450 ML Ayurvedic Tonic',
    price: 999,
    mrp: 1999,
    discountPct: 50,
    image: 'https://res.cloudinary.com/ukqeabxy/image/upload/v1787581399/ChatGPT_Image_Aug_24_2026_07_30_05_PM.png',
    accentColor: '#2D5A2D',
    accentBg: 'from-[#0D1F10] to-[#050C06]'
  }
];

export const ConcernSelector: React.FC<ConcernSelectorProps> = ({
  activeCategory,
  setActiveCategory,
  onSelectProduct,
}) => {
  const allAvailable = [...PRODUCTS, ...MENS_PRODUCTS, VAYUCORE_PRODUCT];

  const handleConcernClick = (concern: ConcernItem) => {
    // Switch active category if needed
    if (concern.targetCategory === 'women' && activeCategory !== 'women') {
      setActiveCategory('women');
    } else if (concern.targetCategory === 'men' && activeCategory !== 'men') {
      setActiveCategory('men');
    }
    
    // Find target product
    const found = allAvailable.find(p => p.id === concern.productId);
    if (found) {
      onSelectProduct(found);
    }
  };

  const filteredConcerns = CONCERNS.filter(c => {
    if (activeCategory === 'women') return c.targetCategory === 'women' || c.targetCategory === 'all';
    if (activeCategory === 'men') return c.targetCategory === 'men' || c.targetCategory === 'all';
    return true; // 'all' displays all
  });

  return (
    <section id="what-are-you-looking-for" className="lg:col-span-12 space-y-6 pt-4">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 bg-[#FAF6F0]/10 border border-[#FAF6F0]/20 text-[#E5A93C] text-[11px] font-black uppercase tracking-widest py-1 px-4 rounded-full backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
          <span>Tailored Ayurvedic Protocols</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          What are you looking for?
        </h2>
        <p className="text-[#FAF6F0]/80 text-xs sm:text-sm font-medium leading-relaxed">
          Select your primary wellness goal to find the targeted, doctor-formulated Ayurvedic solution crafted for your body.
        </p>
      </div>

      {/* Grid of Concern Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredConcerns.map((concern) => (
          <div
            key={concern.id}
            id={`concern-card-${concern.id}`}
            onClick={() => handleConcernClick(concern)}
            className={`group cursor-pointer relative rounded-3xl p-5 md:p-6 border border-white/10 hover:border-[#E5A93C]/50 transition-all duration-300 bg-gradient-to-br ${concern.accentBg} shadow-xl hover:shadow-[0_12px_36px_rgba(0,0,0,0.5)] flex flex-col justify-between overflow-hidden transform hover:-translate-y-1`}
          >
            {/* Ambient Corner Glow */}
            <div 
              className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-30 group-hover:opacity-60 transition-opacity"
              style={{ backgroundColor: concern.accentColor }}
            />

            <div>
              {/* Badge & Target Collection */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/10 text-[#E5A93C] border border-white/15 px-2.5 py-1 rounded-full">
                  {concern.concernBadge}
                </span>
                <span className="text-[10px] font-bold text-neutral-400">
                  {concern.targetCategory === 'women' ? '👩 Women' : concern.targetCategory === 'men' ? '👨 Men' : '🌿 Everyday'}
                </span>
              </div>

              {/* Concern Title */}
              <h3 className="font-serif text-xl sm:text-2xl font-black text-white group-hover:text-[#E5A93C] transition-colors leading-tight mb-2">
                {concern.concernTitle}
              </h3>

              {/* Description */}
              <p className="text-xs text-neutral-300 line-clamp-3 leading-relaxed mb-4">
                {concern.description}
              </p>

              {/* Key Benefit Pills */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {concern.keyPills.map((pill, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/90 flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-2.5 h-2.5 text-[#E5A93C]" />
                    <span>{pill}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Product Snippet & CTA */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    src={optimizeCloudinaryUrl(concern.image, 160)}
                    alt={concern.productName}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                    width="48"
                    height="48"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{concern.productName}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-black text-[#E5A93C]">₹{concern.price.toLocaleString('en-IN')}</span>
                    <span className="line-through text-[10px] text-neutral-400">₹{concern.mrp.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-[#E8621A] text-white group-hover:bg-[#E5A93C] group-hover:text-[#1A1A1A] transition-colors shadow-md">
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
