import React from 'react';
import { Heart, Sparkles, CheckCircle, ShieldCheck } from 'lucide-react';

export const BrandStory: React.FC = () => {
  return (
    <section id="brand-story" className="lg:col-span-12 rounded-[2.5rem] bg-white border border-neutral-200/90 p-8 md:p-14 space-y-8 shadow-xl text-neutral-900 overflow-hidden relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
        {/* Left Column: Brand Story Narrative */}
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 bg-[#E8621A]/10 text-[#E8621A] text-xs font-black uppercase tracking-widest py-1.5 px-4 rounded-full border border-[#E8621A]/20">
            <Heart className="w-3.5 h-3.5 fill-[#E8621A]" />
            <span>Our Origin & Purpose</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-neutral-950 tracking-tight leading-tight">
            Authentic Ayurvedic Wisdom, Re-engineered for Modern Living.
          </h2>

          <div className="space-y-4 text-sm md:text-base text-neutral-700 leading-relaxed font-sans">
            <p>
              At <strong>meONmode®</strong>, we observed a troubling reality in modern wellness: millions of individuals dealing with chronic hormonal imbalance, cycle pain, low stamina, and digestive distress were offered either harsh synthetic medications with dependency side effects, or cheap, unstandardized powdered herbs that produced zero tangible results.
            </p>
            <p>
              We established meONmode to bridge this gap. By uniting timeless formulations from classical Ayurvedic Shastras with contemporary scientific extraction methods, we isolate the exact bioactive molecules—such as <em>shatavarins</em>, <em>withanolides</em>, and <em>fulvic acid</em>—that restore your body’s natural equilibrium.
            </p>
            <p>
              Every capsule, drink, and Prash we formulate adheres strictly to AYUSH standards: manufactured in audited GMP facilities, third-party lab tested, completely free from synthetic steroids or heavy metals, and delivered directly to your doorstep in 100% discreet, confidential packaging.
            </p>
          </div>

          {/* Core Values Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
            {[
              "Classical Vedic Formulations",
              "Standardized Bioactive Extracts",
              "100% Discrete Plain Packaging",
              "Zero Heavy Metals or Steroids",
              "Free Personalized Diet Guidance",
              "Made in India, GMP Quality"
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-bold text-neutral-800">
                <CheckCircle className="w-4 h-4 text-[#2D5A2D] shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Visual Trust Card */}
        <div className="lg:col-span-5 bg-[#FAF7F2] rounded-3xl p-6 md:p-8 border border-[#E5A93C]/30 shadow-md space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#E8621A]/15 mx-auto flex items-center justify-center text-3xl shadow-inner">
            🪷
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-2xl font-black text-neutral-950">
              meONmode® Promise
            </h3>
            <p className="text-xs text-neutral-600 font-sans leading-relaxed">
              "We formulate products we would proudly give to our own families. Safe, clean, and genuinely effective."
            </p>
          </div>

          <div className="pt-4 border-t border-neutral-200/80 grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="font-mono text-xl sm:text-2xl font-black text-[#E8621A]">100%</p>
              <p className="text-[10px] font-bold text-neutral-600 uppercase">Herbal Purity</p>
            </div>
            <div>
              <p className="font-mono text-xl sm:text-2xl font-black text-[#2D5A2D]">26K+</p>
              <p className="text-[10px] font-bold text-neutral-600 uppercase">PIN Codes Served</p>
            </div>
            <div>
              <p className="font-mono text-xl sm:text-2xl font-black text-[#965B0A]">4.9★</p>
              <p className="text-[10px] font-bold text-neutral-600 uppercase">Avg Rating</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3 border border-neutral-200/80 text-[11px] text-neutral-600 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-neutral-800">AYUSH Certified Manufacturing Standard</span>
          </div>
        </div>
      </div>
    </section>
  );
};
