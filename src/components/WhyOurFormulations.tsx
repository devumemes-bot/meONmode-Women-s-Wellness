import React from 'react';
import { Leaf, Award, Eye, Clock, ShieldCheck, Check } from 'lucide-react';

export const WhyOurFormulations: React.FC = () => {
  const points = [
    {
      id: 'point-ayurvedic',
      icon: <Leaf className="w-6 h-6 text-[#E5A93C]" />,
      title: "Ayurvedic Formulation",
      subtitle: "Classical Shastric Heritage",
      description: "Formulated according to time-honored Ayurvedic principles (Charaka & Bhavaprakasha Samhita), harmonizing bio-energies for balanced, sustained well-being."
    },
    {
      id: 'point-quality',
      icon: <Award className="w-6 h-6 text-[#48BB78]" />,
      title: "Quality-Focused Ingredients",
      subtitle: "Standardized Botanical Extracts",
      description: "Crafted exclusively using potent, standardized plant extracts and purified bhasmas produced inside audited, certified GMP facilities with batch testing."
    },
    {
      id: 'point-transparency',
      icon: <Eye className="w-6 h-6 text-[#E5A93C]" />,
      title: "Transparent Ingredient Information",
      subtitle: "Zero Hidden Adulterants",
      description: "Every herb, mineral, and botanical component is openly declared on our labels. Completely free from synthetic steroids, chemical hormones, and artificial fillers."
    },
    {
      id: 'point-modern',
      icon: <Clock className="w-6 h-6 text-[#48BB78]" />,
      title: "Designed for Modern Wellness Routines",
      subtitle: "Convenient Daily Regimens",
      description: "Standardized into easy-to-take vegetarian capsules and measured syrups, seamlessly adapting ancient Ayurvedic discipline into busy contemporary lifestyles."
    }
  ];

  return (
    <section 
      id="why-our-formulations" 
      className="lg:col-span-12 rounded-[2.5rem] bg-gradient-to-br from-[#1C110D] via-[#2A160F] to-[#140B07] border-2 border-white/10 p-6 sm:p-8 md:p-12 space-y-8 shadow-2xl relative overflow-hidden text-white content-auto"
    >
      {/* Soft ambient lighting */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#E5A93C]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#E8621A]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Heading Block */}
      <div className="text-center space-y-3 max-w-2xl mx-auto relative z-10">
        <span className="text-[#E5A93C] text-xs font-bold tracking-widest uppercase block">
          Purity • Science • Tradition
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#FAF6F0] tracking-tight">
          Why Our Formulations?
        </h2>
        <p className="text-[#FAF6F0]/80 text-xs sm:text-sm font-medium leading-relaxed font-sans">
          Honest Ayurvedic science designed for daily restoration without compromise.
        </p>
      </div>

      {/* 4 Clean Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {points.map((pt) => (
          <div
            key={pt.id}
            id={pt.id}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:bg-white/10 hover:border-[#E5A93C]/40 transition-all duration-300 shadow-md group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                {pt.icon}
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-[#E5A93C] block">
                  {pt.subtitle}
                </span>
                <h3 className="font-serif font-bold text-lg text-white mt-1 leading-snug">
                  {pt.title}
                </h3>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                {pt.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-white/5 flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
              <Check className="w-3 h-3 stroke-[3]" />
              <span>Standard of Care</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Assurance Note */}
      <div className="pt-4 border-t border-white/10 text-center relative z-10">
        <div className="inline-flex items-center gap-2 text-[11px] text-neutral-300 bg-black/30 border border-white/5 px-4 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4 text-[#E5A93C]" />
          <span>Formulated with 100% pure botanical extracts &bull; Non-habit forming &bull; Safe for daily consumption</span>
        </div>
      </div>
    </section>
  );
};
