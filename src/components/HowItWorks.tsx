import React from 'react';
import { Calendar, Utensils, Award, ArrowRight, ShieldCheck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: "01",
      icon: <Calendar className="w-6 h-6 text-[#E8621A]" />,
      title: "Daily Herbal Protocol",
      timing: "30-Second Morning & Evening Habit",
      desc: "Take your capsules, Prash, or herbal tonic consistently after meals. Natural bio-active phytochemicals gently absorb into the bloodstream to nourish internal tissues without stomach distress."
    },
    {
      step: "02",
      icon: <Utensils className="w-6 h-6 text-[#E5A93C]" />,
      title: "Personalized Diet Plan",
      timing: "Free With Every Order",
      desc: "Follow your complimentary Ayurvedic dietary guide tailored to your unique Prakriti (body type) and weight. Proper food combinations ignite digestive agni and multiply the absorption of the herbs."
    },
    {
      step: "03",
      icon: <Award className="w-6 h-6 text-emerald-400" />,
      title: "90-Day Deep Transformation",
      timing: "Sustained Natural Balance",
      desc: "Ayurvedic herbs work progressively from Rasa (plasma) to Shukra/Artava (reproductive vitality). Experience regular monthly rhythms, boundless stamina, and radiant health with zero synthetic rebound."
    }
  ];

  return (
    <section id="how-it-works" className="lg:col-span-12 rounded-[2.5rem] bg-[#140B07] border-2 border-[#FAF6F0]/15 p-8 md:p-12 space-y-10 shadow-2xl relative overflow-hidden text-white content-auto">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#E8621A]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto relative z-10">
        <span className="inline-flex items-center gap-1.5 bg-[#FAF6F0]/10 text-[#E5A93C] uppercase text-[10px] tracking-widest font-extrabold font-mono px-4 py-1.5 rounded-full border border-[#E5A93C]/20 shadow-sm">
          ✨ The meONmode Method
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#FAF6F0] tracking-tight">
          How It Works
        </h2>
        <p className="text-[#FAF6F0]/80 text-xs sm:text-sm font-medium leading-relaxed font-sans">
          Achieving real, lasting wellness isn’t an overnight magic pill. It’s a simple, reliable 90-day daily Ayurvedic rhythm.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {steps.map((item, idx) => (
          <div
            key={idx}
            id={`how-step-${idx + 1}`}
            className="rounded-3xl bg-[#FAF6F0]/5 border border-white/10 p-6 md:p-8 space-y-4 hover:border-[#E5A93C]/40 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-2xl"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shadow-inner">
                  {item.icon}
                </div>
                <span className="font-mono text-2xl font-black text-[#E5A93C]/50">
                  {item.step}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#E5A93C] block">
                  {item.timing}
                </span>
                <h3 className="font-serif font-black text-xl text-white mt-1">
                  {item.title}
                </h3>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                {item.desc}
              </p>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center gap-1 text-[11px] font-bold text-neutral-400">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E5A93C]" />
              <span>Step {idx + 1} of 3</span>
            </div>
          </div>
        ))}
      </div>

      {/* WhatsApp Diet Support callout */}
      <div className="bg-[#FAF6F0]/5 border border-[#E5A93C]/30 rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#E5A93C]/20 border border-[#E5A93C]/30 flex items-center justify-center shrink-0 text-xl">
            💬
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-white">
              Questions about your dosage or personalized diet plan?
            </h4>
            <p className="text-xs text-neutral-300">
              Our Ayurvedic wellness consultants are available on WhatsApp for direct guidance.
            </p>
          </div>
        </div>

        <a
          href="https://api.whatsapp.com/send?phone=917290810336&text=Hello%20meONmode%20Team%2C%20I%20have%20questions%20about%20my%20wellness%20plan."
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-2 bg-[#E8621A] hover:bg-[#E5A93C] hover:text-[#140B07] text-white font-extrabold text-xs py-3 px-5 rounded-full transition-all shadow-md"
        >
          <span>Chat with Expert</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
};
