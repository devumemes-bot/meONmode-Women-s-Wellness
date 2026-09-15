import React from 'react';
import { ShieldCheck, Leaf, Package, Truck, Sparkles, Award, Utensils, Check } from 'lucide-react';

export const WhyMeonmode: React.FC = () => {
  const pillars = [
    {
      icon: <Award className="w-6 h-6 text-[#E5A93C]" />,
      title: "AYUSH Ministry Compliant",
      subtitle: "Vedic Formulations",
      desc: "Rooted in authentic classical Ayurvedic Shastras (Charaka & Bhavaprakasha Samhita), formulated and manufactured inside audited GMP-certified facilities."
    },
    {
      icon: <Leaf className="w-6 h-6 text-[#2D5A2D]" />,
      title: "Standardized Herbal Extracts",
      subtitle: "Maximum Bio-Availability",
      desc: "We use high-concentration, standardized botanical extracts (rich in active withanolides, shatavarins & fulvic acid), not crude low-grade powder."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#E8621A]" />,
      title: "Zero Hidden Chemicals",
      subtitle: "Clean & Non-Habit Forming",
      desc: "Free from synthetic steroids, chemical hormones, heavy metals, parabens, and artificial binders. Safe for daily continuous consumption."
    },
    {
      icon: <Package className="w-6 h-6 text-[#E5A93C]" />,
      title: "100% Discreet Packaging",
      subtitle: "Absolute Personal Privacy",
      desc: "Delivered in plain, unmarked brown corrugated boxes with zero product names or wellness categories printed outside. Complete privacy guaranteed."
    },
    {
      icon: <Truck className="w-6 h-6 text-[#2D5A2D]" />,
      title: "Free Express Shipping & COD",
      subtitle: "All India Coverage",
      desc: "Fast delivery across 26,000+ PIN codes in India. Pay with secure online payments or Cash on Delivery (COD) with zero extra hidden fees."
    },
    {
      icon: <Utensils className="w-6 h-6 text-[#E8621A]" />,
      title: "Free Personalized Diet Plan",
      subtitle: "Holistic Health Bonus",
      desc: "Included with every single product or combo: an individualized Ayurvedic meal plan tailored specifically to your body type, weight, and health goals."
    }
  ];

  return (
    <section id="why-meonmode" className="lg:col-span-12 rounded-[2.5rem] bg-gradient-to-br from-[#1C110D] via-[#2A160F] to-[#140B07] border-2 border-[#FAF6F0]/20 p-8 md:p-12 space-y-10 shadow-2xl relative overflow-hidden text-white content-auto">
      {/* Soft glowing ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E5A93C]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#E8621A]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Heading Block */}
      <div className="text-center space-y-3 max-w-2xl mx-auto relative z-10">
        <div className="inline-flex items-center gap-2 bg-[#FAF6F0]/10 border border-[#FAF6F0]/20 text-[#FAF6F0] text-xs font-black uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
          <span>The meONmode® Standard</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#FAF6F0] tracking-tight">
          Why Modern India Chooses meONmode
        </h2>
        <p className="text-[#FAF6F0]/80 text-xs sm:text-sm font-medium leading-relaxed font-sans">
          Where thousand-year-old Vedic botanicals unite with rigorous modern clinical safety standards for reliable, daily wellness.
        </p>
      </div>

      {/* 6-Pillar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {pillars.map((pillar, idx) => (
          <div
            key={idx}
            id={`why-pillar-${idx}`}
            className="bg-[#FAF6F0]/5 border border-white/10 rounded-2xl p-6 space-y-3 hover:bg-[#FAF6F0]/10 hover:border-[#E5A93C]/40 transition-all duration-300 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shadow-inner">
                {pillar.icon}
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest font-extrabold text-[#E5A93C] block">
                  {pillar.subtitle}
                </span>
                <h3 className="font-serif font-black text-lg sm:text-xl text-white mt-0.5">
                  {pillar.title}
                </h3>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                {pillar.desc}
              </p>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
              <Check className="w-3 h-3 stroke-[3]" />
              <span>Verified Standard</span>
            </div>
          </div>
        ))}
      </div>

      {/* Safety Statement Banner */}
      <div className="pt-4 border-t border-white/10 text-center relative z-10">
        <p className="text-[11px] text-white/70 max-w-2xl mx-auto leading-relaxed font-sans">
          🛡️ <strong className="text-white font-bold">100% Quality Assured:</strong> Every batch is tested for microbiological purity, heavy metals, and active phytochemical concentration. These dietary wellness products are designed to support your daily well-being and do not claim to treat, cure, or diagnose any medical disease.
        </p>
      </div>
    </section>
  );
};
