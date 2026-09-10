import React, { useState, useMemo } from 'react';
import { Leaf, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { 
  AyurvedicHerb, 
  WOMEN_TRANSPARENCY_HERBS, 
  MEN_TRANSPARENCY_HERBS 
} from '../ingredientData';

interface IngredientTransparencyProps {
  category?: 'women' | 'men' | 'all';
  ingredients?: AyurvedicHerb[];
  onHerbClick?: (slug: string) => void;
}

export const IngredientTransparency: React.FC<IngredientTransparencyProps> = ({ 
  category = 'women', 
  ingredients,
  onHerbClick 
}) => {
  const isMen = category === 'men';
  
  // Base list of herbs based on category if not explicitly passed
  const baseHerbs = useMemo(() => {
    if (ingredients && ingredients.length > 0) return ingredients;
    return isMen ? MEN_TRANSPARENCY_HERBS : WOMEN_TRANSPARENCY_HERBS;
  }, [ingredients, isMen]);

  // Product-specific filter tab for Men's page (All, ALPHAMAX, WANTMORE)
  const [activeProductFilter, setActiveProductFilter] = useState<'ALL' | 'ALPHAMAX' | 'WANTMORE'>('ALL');

  // Filtered herb list
  const filteredHerbs = useMemo(() => {
    if (!isMen || activeProductFilter === 'ALL') return baseHerbs;
    return baseHerbs.filter(herb => {
      if (activeProductFilter === 'ALPHAMAX') {
        return herb.productTag === 'ALPHAMAX' || herb.productTag === 'BOTH';
      }
      if (activeProductFilter === 'WANTMORE') {
        return herb.productTag === 'WANTMORE' || herb.productTag === 'BOTH';
      }
      return true;
    });
  }, [baseHerbs, isMen, activeProductFilter]);

  // Selected herb ID state so switching tabs preserves or gracefully updates selection
  const [selectedHerbId, setSelectedHerbId] = useState<string>(() => baseHerbs[0]?.id || '');

  // Resolve active herb
  const activeHerb = useMemo(() => {
    const found = filteredHerbs.find(h => h.id === selectedHerbId);
    return found || filteredHerbs[0] || baseHerbs[0];
  }, [filteredHerbs, selectedHerbId, baseHerbs]);

  return (
    <section id="ingredient-transparency" className="lg:col-span-12 rounded-[2.5rem] bg-[#FAF8F5] border border-neutral-200/80 p-8 md:p-12 space-y-8 shadow-xl text-neutral-900">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#2D5A2D]/10 text-[#2D5A2D] text-xs font-black uppercase tracking-widest py-1.5 px-4 rounded-full border border-[#2D5A2D]/20">
          <Leaf className="w-3.5 h-3.5" />
          <span>Full Ingredient Transparency</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-950 tracking-tight">
          Pure Botanical Potency. Zero Fillers.
        </h2>
        <p className="text-neutral-600 text-xs sm:text-sm font-medium leading-relaxed">
          {isMen
            ? "Explore the authentic Ayurvedic herbs, purified mineral pitches, and classical Bhasmas powering meONmode® Men's formulations. No synthetic stimulants, no artificial dyes."
            : "Explore the authentic Ayurvedic herbs and standardized bioactive compounds powering meONmode® formulations. No synthetic chemicals, no artificial dyes."
          }
        </p>

        {/* Product Filter Tabs for Men's Section */}
        {isMen && (
          <div className="pt-3 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveProductFilter('ALL');
                if (baseHerbs[0]) setSelectedHerbId(baseHerbs[0].id);
              }}
              className={`text-xs font-extrabold px-4 py-2 rounded-full transition-all cursor-pointer ${
                activeProductFilter === 'ALL'
                  ? 'bg-neutral-900 text-white shadow-md'
                  : 'bg-neutral-200/70 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              All Men&apos;s Bioactives ({baseHerbs.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveProductFilter('ALPHAMAX');
                const firstAlpha = baseHerbs.find(h => h.productTag === 'ALPHAMAX' || h.productTag === 'BOTH');
                if (firstAlpha) setSelectedHerbId(firstAlpha.id);
              }}
              className={`text-xs font-extrabold px-4 py-2 rounded-full transition-all cursor-pointer ${
                activeProductFilter === 'ALPHAMAX'
                  ? 'bg-[#E8621A] text-white shadow-md'
                  : 'bg-[#E8621A]/10 text-[#E8621A] hover:bg-[#E8621A]/20'
              }`}
            >
              ALPHAMAX (6)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveProductFilter('WANTMORE');
                const firstWant = baseHerbs.find(h => h.productTag === 'WANTMORE' || h.productTag === 'BOTH');
                if (firstWant) setSelectedHerbId(firstWant.id);
              }}
              className={`text-xs font-extrabold px-4 py-2 rounded-full transition-all cursor-pointer ${
                activeProductFilter === 'WANTMORE'
                  ? 'bg-[#8B3B15] text-white shadow-md'
                  : 'bg-[#8B3B15]/10 text-[#8B3B15] hover:bg-[#8B3B15]/20'
              }`}
            >
              WANTMORE (6)
            </button>
          </div>
        )}
      </div>

      {/* Interactive Showcase: Left Herb Tabs, Right Herb Detail Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
        {/* Herb Selector List */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
          {filteredHerbs.map((herb) => {
            const isSelected = activeHerb?.id === herb.id;
            
            // Badge text calculation
            let badgeText = 'Rasayana';
            if (isMen) {
              if (herb.productTag === 'BOTH') {
                badgeText = 'ALPHAMAX & WANTMORE';
              } else if (herb.productTag === 'ALPHAMAX') {
                badgeText = 'ALPHAMAX';
              } else if (herb.productTag === 'WANTMORE') {
                badgeText = 'WANTMORE';
              }
            } else {
              badgeText = herb.category === 'Womens-Health' ? 'Women' : herb.category === 'Mens-Vitality' ? 'Men' : 'Rasayana';
            }

            return (
              <button
                key={herb.id}
                type="button"
                onClick={() => setSelectedHerbId(herb.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#E8621A] shadow-md ring-2 ring-[#E8621A]/20'
                    : 'bg-white/60 hover:bg-white border-neutral-200/80 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-black transition-colors ${
                    isSelected ? 'bg-[#E8621A] text-white' : 'bg-neutral-100 text-neutral-700'
                  }`}>
                    {herb.icon || '🌿'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-serif text-base font-bold text-neutral-900 truncate">
                      {herb.name}
                    </p>
                    <p className="text-[11px] text-neutral-500 font-sans italic truncate">
                      {herb.botanicalName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                    isSelected ? 'bg-[#E8621A]/10 text-[#E8621A]' : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {badgeText}
                  </span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${
                    isSelected ? 'text-[#E8621A] translate-x-1' : 'text-neutral-400'
                  }`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Herb Spotlight Box */}
        {activeHerb && (
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-neutral-200 shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
              <div>
                <span className="text-[10px] font-mono font-black uppercase tracking-wider text-[#E8621A] block">
                  {activeHerb.sanskritName} {activeHerb.hindiName ? `• ${activeHerb.hindiName}` : ''}
                </span>
                <h3 className="font-serif text-2xl md:text-3xl font-black text-neutral-950 mt-0.5">
                  {activeHerb.name}
                </h3>
                <p className="text-xs font-mono text-neutral-500 italic mt-0.5">
                  {activeHerb.botanicalName}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 self-start sm:self-auto text-xs font-extrabold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Standardized Bioactive</span>
              </span>
            </div>

            <div className="space-y-4 text-xs md:text-sm text-neutral-700 leading-relaxed font-sans">
              <div>
                <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-neutral-900 mb-1">
                  Traditional Classical Action:
                </h4>
                <p className="text-neutral-600 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200/60 leading-relaxed">
                  {activeHerb.traditionalAction}
                </p>
              </div>

              <div>
                <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-neutral-900 mb-1">
                  Modern Phytochemical / Ingredient Information:
                </h4>
                <p className="text-neutral-600 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200/60 leading-relaxed">
                  {activeHerb.modernValidation}
                </p>
              </div>
            </div>

            {/* Formulations where this herb is found */}
            <div className="pt-2 border-t border-neutral-100">
              <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                Found In meONmode® Formulations:
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeHerb.foundInProducts.map((prod, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 bg-[#FAF7F2] border border-[#E5A93C]/30 text-neutral-800 text-xs font-bold px-3 py-1.5 rounded-xl"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#E8621A]" />
                    <span>{prod.name} {prod.role ? `(${prod.role})` : ''}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
