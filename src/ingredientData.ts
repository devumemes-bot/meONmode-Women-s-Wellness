/**
 * meONmode® Classical Ayurvedic Herb & Ingredient Library
 * Detailed botanical profiles, classical properties (Rasa, Guna, Virya, Vipaka, Dosha Karma),
 * scientific evidence, and formulation links.
 */

import { BLOG_IMAGES, getOptimizedImageUrl } from './blogImages';

export interface AyurvedicHerb {
  id: string;
  name: string;
  sanskritName: string;
  hindiName: string;
  botanicalName: string;
  category: 'Womens-Health' | 'Mens-Vitality' | 'Detox-Metabolism' | 'Rasayana';
  targetHealthGoals: string[];
  ayurvedicProperties?: {
    rasa?: string; // Taste
    guna?: string; // Qualities
    virya?: string; // Potency (Heating / Cooling)
    vipaka?: string; // Post-digestive effect
    doshaKarma?: string; // Effect on Vata, Pitta, Kapha
    prabhava?: string; // Special specific action
  };
  traditionalAction: string; // e.g. Granthi-hara, Rasayana, Balya
  modernValidation: string; // Clinical/scientific findings
  foundInProducts: {
    id: string;
    name: string;
    role?: string;
  }[];
  relatedArticleSlug?: string;
  image?: string;
  summary?: string;
  icon?: string;
  productTag?: 'ALPHAMAX' | 'WANTMORE' | 'BOTH' | 'WOMEN';
}

export const AYURVEDIC_HERBS: AyurvedicHerb[] = [
  {
    id: 'kanchnar',
    name: 'Kanchnar',
    sanskritName: 'काञ्चनार (Kāñcanāra)',
    hindiName: 'कचनार की छाल',
    botanicalName: 'Bauhinia variegata',
    category: 'Womens-Health',
    targetHealthGoals: ['Ovarian Cysts', 'PCOD/PCOS Support', 'Thyroid Glands', 'Lymphatic Cleansing'],
    ayurvedicProperties: {
      rasa: 'Kashaya (Astringent)',
      guna: 'Laghu (Light), Ruksha (Dry)',
      virya: 'Sheeta (Cooling)',
      vipaka: 'Katu (Pungent)',
      doshaKarma: 'Kapha-Pitta Shamaka (Balances Kapha & Pitta)',
      prabhava: 'Granthi-bhedana (Breaks down cystic growths)'
    },
    traditionalAction: 'Classical Granthi-hara herb celebrated in Bhavaprakasha for melting deep glandular nodules, pelvic cysts, and thyroid swelling.',
    modernValidation: 'Rich in bioactive flavonoids, quercetin, and tannins that inhibit pro-inflammatory cytokines (TNF-alpha) and reduce follicular ovarian cyst diameter.',
    foundInProducts: [
      { id: 'ovaira', name: 'OVAIRA', role: 'Key Bio-Active Extract (60% weight)' },
      { id: 'combo-kit', name: "Women's Wellness Combo", role: 'Primary Cyst Cleanser' }
    ],
    relatedArticleSlug: 'kanchnar-guggul-fayde-pcod',
    image: getOptimizedImageUrl(BLOG_IMAGES.herbs.kanchnar, { width: 400 }),
    summary: 'The gold-standard Ayurvedic botanical for dissolving benign pelvic cysts, balancing Kapha in the reproductive tract, and promoting healthy ovulation.'
  },
  {
    id: 'guggul',
    name: 'Shuddh Guggul',
    sanskritName: 'गुग्गुलु (Guggulu)',
    hindiName: 'शुद्ध गुग्गुल',
    botanicalName: 'Commiphora mukul',
    category: 'Detox-Metabolism',
    targetHealthGoals: ['Metabolism & Agni', 'Insulin Sensitivity', 'Anti-Inflammatory', 'Deep Channel Detox'],
    ayurvedicProperties: {
      rasa: 'Tikta (Bitter), Katu (Pungent), Kashaya (Astringent)',
      guna: 'Laghu (Light), Ruksha (Dry), Tikshna (Sharp)',
      virya: 'Ushna (Heating)',
      vipaka: 'Katu (Pungent)',
      doshaKarma: 'Kapha-Vata Shamaka (Purges accumulated toxins)',
      prabhava: 'Srotoshodhana (Micro-channel unblocker)'
    },
    traditionalAction: 'A legendary resin known as "Guggulu" (that which protects from diseases). Penetrates micro-capillaries to scrape Ama (metabolic toxins).',
    modernValidation: 'Contains guggulsterones (E and Z isomers) demonstrated in clinical trials to enhance thyroid T3/T4 secretion, downregulate LDL, and improve insulin signaling.',
    foundInProducts: [
      { id: 'ovaira', name: 'OVAIRA', role: 'Synergistic Deep-Scraping Resin' },
      { id: 'combo-kit', name: "Women's Wellness Combo", role: 'Metabolic Re-activator' }
    ],
    relatedArticleSlug: 'kanchnar-guggul-fayde-pcod',
    image: getOptimizedImageUrl(BLOG_IMAGES.herbs.guggul, { width: 400 }),
    summary: 'A potent bio-catalyst resin that clears hardened Kapha deposits, dissolves metabolic congestion, and speeds up the delivery of herbs to target tissues.'
  },
  {
    id: 'shatavari',
    name: 'Shatavari',
    sanskritName: 'शतावरी (Śatāvarī)',
    hindiName: 'शतावर',
    botanicalName: 'Asparagus racemosus',
    category: 'Womens-Health',
    targetHealthGoals: ['Hormonal Harmony', 'Egg Quality & Ovulation', 'Pitta Soothing', 'Uterine Strength'],
    ayurvedicProperties: {
      rasa: 'Madhura (Sweet), Tikta (Bitter)',
      guna: 'Guru (Nourishing), Snigdha (Unctuous)',
      virya: 'Sheeta (Cooling)',
      vipaka: 'Madhura (Sweet)',
      doshaKarma: 'Vata-Pitta Shamaka (Deeply calming for heated tissue)',
      prabhava: 'Stanya & Artava Janana (Female reproductive tonic)'
    },
    traditionalAction: 'The queen of Ayurvedic herbs, traditionally meaning "she who possesses a hundred suitors." Nourishes the entire female endocrine axis.',
    modernValidation: 'Abundant in steroidal saponins (shatavarins I-IV) that act as phytoestrogen modulators, stabilizing LH/FSH ratios and preventing follicular atresia.',
    foundInProducts: [
      { id: 'ovaira', name: 'OVAIRA', role: 'Endocrine Adaptogen' },
      { id: 'flowelle', name: 'FLOWELLE', role: 'Uterine Mucosa Nourisher' },
      { id: 'combo-kit', name: "Women's Wellness Combo", role: 'Core Hormonal Stabilizer' }
    ],
    relatedArticleSlug: 'pcod-diet-plan-hindi',
    image: getOptimizedImageUrl(BLOG_IMAGES.herbs.shatavari, { width: 400 }),
    summary: 'A cooling adaptogen that harmonizes female reproductive hormones, nourishes ovarian follicles, and soothes systemic Pitta-induced inflammation.'
  },
  {
    id: 'ashoka',
    name: 'Ashoka Chhal',
    sanskritName: 'अशोक (Aśoka)',
    hindiName: 'अशोक वृक्ष की छाल',
    botanicalName: 'Saraca asoca',
    category: 'Womens-Health',
    targetHealthGoals: ['Cycle Regularity', 'Period Cramp Relief', 'Excess Bleeding Control', 'Uterine Health'],
    ayurvedicProperties: {
      rasa: 'Kashaya (Astringent), Tikta (Bitter)',
      guna: 'Laghu (Light), Ruksha (Dry)',
      virya: 'Sheeta (Cooling)',
      vipaka: 'Katu (Pungent)',
      doshaKarma: 'Pitta-Kapha Shamaka',
      prabhava: 'Vedanasthapana (Direct pain reliever) & Hridya'
    },
    traditionalAction: 'Ashoka literally translates to "without sorrow." Regarded in Charaka Samhita as the preeminent herb for restoring rhythmic, pain-free menstruation.',
    modernValidation: 'Contains ketosterols, saracin, and flavanoids that directly tone endometrium smooth muscle fibers and inhibit dysmenorrhea prostaglandins.',
    foundInProducts: [
      { id: 'flowelle', name: 'FLOWELLE', role: 'Primary Uterine Tonic' },
      { id: 'ovaira', name: 'OVAIRA', role: 'Menstrual Cycle Regulator' }
    ],
    relatedArticleSlug: 'irregular-periods-ayurvedic-treatment',
    image: getOptimizedImageUrl(BLOG_IMAGES.herbs.ashoka, { width: 400 }),
    summary: 'The foremost Ayurvedic uterine soother, restoring regular monthly cycles, strengthening uterine walls, and reducing acute menstrual spasms.'
  },
  {
    id: 'lodhra',
    name: 'Lodhra',
    sanskritName: 'लोध्र (Lodhra)',
    hindiName: 'लोध',
    botanicalName: 'Symplocos racemosa',
    category: 'Womens-Health',
    targetHealthGoals: ['White Discharge (Shwet Pradar)', 'Vaginal pH Balance', 'Endometrial Toning', 'Pelvic Comfort'],
    ayurvedicProperties: {
      rasa: 'Kashaya (Astringent)',
      guna: 'Laghu (Light), Ruksha (Dry)',
      virya: 'Sheeta (Cooling)',
      vipaka: 'Katu (Pungent)',
      doshaKarma: 'Kapha-Pitta Shamaka',
      prabhava: 'Shonitasthapana & Shravahara (Arrests abnormal discharges)'
    },
    traditionalAction: 'Classified in Sushruta Samhita as supreme among Grahi (absorptive/firming) and Stambhana herbs for stopping pathological pelvic discharge.',
    modernValidation: 'Supplies high concentrations of loturine and colloturine alkaloids that exhibit natural antimicrobial, astringent, and anti-candida activity.',
    foundInProducts: [
      { id: 'flowelle', name: 'FLOWELLE', role: 'Key Shwet-Pradar Buster' },
      { id: 'combo-kit', name: "Women's Wellness Combo", role: 'Vaginal Flora & Tissue Balancer' }
    ],
    relatedArticleSlug: 'white-discharge-shwet-pradar-ayurvedic',
    image: getOptimizedImageUrl(BLOG_IMAGES.herbs.lodhra, { width: 400 }),
    summary: 'Classical Ayurvedic astringent bark that naturally arrests chronic white discharge, reduces pelvic heaviness, and restores healthy mucosal tissue.'
  },
  {
    id: 'ashwagandha',
    name: 'Ashwagandha',
    sanskritName: 'अश्वगन्धा (Aśvagandhā)',
    hindiName: 'अश्वगंधा (नागौरी)',
    botanicalName: 'Withania somnifera',
    category: 'Rasayana',
    targetHealthGoals: ['Stress & Cortisol Reduction', 'Natural Testosterone', 'Physical Stamina', 'Mental Vitality'],
    ayurvedicProperties: {
      rasa: 'Tikta (Bitter), Kashaya (Astringent), Madhura (Sweet)',
      guna: 'Laghu (Light), Snigdha (Unctuous)',
      virya: 'Ushna (Heating)',
      vipaka: 'Madhura (Sweet)',
      doshaKarma: 'Vata-Kapha Shamaka',
      prabhava: 'Balya & Rasayana (Builds strength and deep immunity)'
    },
    traditionalAction: 'Name translates to "the smell of a stallion," symbolizing equine strength, virility, and indomitable physical stamina.',
    modernValidation: 'Standardized withanolides block hypothalamic-pituitary-adrenal (HPA) axis overactivity, reducing cortisol by 28-30% and elevating active testosterone.',
    foundInProducts: [
      { id: 'wantmore-men', name: 'WANTMORE FOR MEN', role: 'Primary Adaptogenic Prash Ingredient' },
      { id: 'alphamax-men', name: 'ALPHAMAX', role: 'High-Concentration Capsule Extract' },
      { id: 'mens-combo', name: "Men's Performance Combo", role: 'Foundational Endurance Builder' }
    ],
    relatedArticleSlug: 'ashwagandha-shilajit-mard-shakti',
    image: getOptimizedImageUrl(BLOG_IMAGES.herbs.ashwagandha, { width: 400 }),
    summary: 'Ancient king of adaptogens, proven to eliminate stress-induced male exhaustion, stimulate protein synthesis, and support natural testosterone production.'
  },
  {
    id: 'shilajit',
    name: 'Shudh Shilajit',
    sanskritName: 'शिलाजीत (Śilājītu)',
    hindiName: 'शुद्ध शिलाजीत',
    botanicalName: 'Asphaltum punjabianum',
    category: 'Rasayana',
    targetHealthGoals: ['Cellular ATP Energy', 'Vascular Blood Flow', 'Stamina & Endurance', 'Trace Mineral Replenishment'],
    ayurvedicProperties: {
      rasa: 'Tikta, Katu, Kashaya, Lavana',
      guna: 'Guru (Heavy), Snigdha (Unctuous)',
      virya: 'Ushna (Heating)',
      vipaka: 'Katu (Pungent)',
      doshaKarma: 'Tridosha Shamaka (Balances all three doshas)',
      prabhava: 'Yogavahi (Amplifies every herb paired with it)'
    },
    traditionalAction: 'Classical texts declare: "There is no curable disease on earth which cannot be aided with Shilajit." A mineral pitch that rejuvenates Dhatus.',
    modernValidation: 'Contains 84+ ionic trace minerals and 80%+ active Fulvic Acid that cross the blood-brain barrier to supercharge mitochondrial ATP synthesis.',
    foundInProducts: [
      { id: 'alphamax-men', name: 'ALPHAMAX', role: 'Core High-Fulvic Mineral Pitch' },
      { id: 'wantmore-men', name: 'WANTMORE FOR MEN', role: 'Vascular Energizer' },
      { id: 'mens-combo', name: "Men's Performance Combo", role: 'Mitochondrial Energy Booster' }
    ],
    relatedArticleSlug: 'ashwagandha-shilajit-mard-shakti',
    image: getOptimizedImageUrl(BLOG_IMAGES.herbs.shilajit, { width: 400 }),
    summary: 'Himalayan mineral pitch loaded with bioactive fulvic acid and ionic minerals, rejuvenating stamina at the cellular level without crashes.'
  },
  {
    id: 'gokshura',
    name: 'Gokshura',
    sanskritName: 'गोक्षुर (Gokṣura)',
    hindiName: 'गोखरू छोटा',
    botanicalName: 'Tribulus terrestris',
    category: 'Mens-Vitality',
    targetHealthGoals: ['Nitric Oxide Synthesis', 'Urinary Tract Flow', 'Vascular Tone', 'Athletic Recovery'],
    ayurvedicProperties: {
      rasa: 'Madhura (Sweet)',
      guna: 'Guru (Heavy), Snigdha (Unctuous)',
      virya: 'Sheeta (Cooling)',
      vipaka: 'Madhura (Sweet)',
      doshaKarma: 'Vata-Pitta Shamaka',
      prabhava: 'Vrishya (Aphrodisiac) & Mutrala (Diuretic)'
    },
    traditionalAction: 'Celebrated in Charaka Samhita as the premier Rasayana for the Mutravaha and Shukravaha Srotas (urinary and reproductive channels).',
    modernValidation: 'Bioactive protodioscin increases endogenous LH secretion and relaxes cavernosal smooth muscles via localized nitric oxide release.',
    foundInProducts: [
      { id: 'wantmore-men', name: 'WANTMORE FOR MEN', role: 'Circulatory & Vascular Tonic' },
      { id: 'alphamax-men', name: 'ALPHAMAX', role: 'Testosterone Support Synergist' }
    ],
    relatedArticleSlug: 'ashwagandha-shilajit-mard-shakti',
    image: getOptimizedImageUrl(BLOG_IMAGES.herbs.gokshura, { width: 400 }),
    summary: 'A revered cooling herb that elevates vascular flow, protects kidney and bladder vitality, and amplifies physical strength.'
  },
  {
    id: 'safed-musli',
    name: 'Safed Musli',
    sanskritName: 'श्वेत मूसली (Śveta Mūsalī)',
    hindiName: 'सफेद मूसली',
    botanicalName: 'Chlorophytum borivilianum',
    category: 'Mens-Vitality',
    targetHealthGoals: ['Shukra Dhatu Nourishment', 'Muscle Mass Recovery', 'Deep Stamina', 'Zero-Crash Energy'],
    ayurvedicProperties: {
      rasa: 'Madhura (Sweet), Tikta (Bitter)',
      guna: 'Guru (Heavy), Snigdha (Nourishing)',
      virya: 'Sheeta (Cooling)',
      vipaka: 'Madhura (Sweet)',
      doshaKarma: 'Vata-Pitta Shamaka',
      prabhava: 'Vajikarana (Peak vitality booster)'
    },
    traditionalAction: 'The cornerstone of Ayurvedic Vajikarana therapy, directly feeding the deepest tissue layer (Shukra Dhatu) for stamina and endurance.',
    modernValidation: 'Rich in spirostanol glycosides, fructans, and polysaccharides that accelerate muscle recovery and combat exercise-induced glycogen depletion.',
    foundInProducts: [
      { id: 'wantmore-men', name: 'WANTMORE FOR MEN', role: 'Key Bio-Active Extract' },
      { id: 'mens-combo', name: "Men's Performance Combo", role: 'Endurance Booster' }
    ],
    relatedArticleSlug: 'ashwagandha-shilajit-mard-shakti',
    image: getOptimizedImageUrl(BLOG_IMAGES.herbs.safedMusli, { width: 400 }),
    summary: 'Known as "White Gold" in classical texts, deeply replenishing male vitality, rebuilding depleted tissue, and providing smooth physical stamina.'
  },
  {
    id: 'swaran-bhasma',
    name: 'Swaran Bhasma (Gold Calcined)',
    sanskritName: 'स्वर्ण भस्म (Svarṇa Bhasma)',
    hindiName: 'शुद्ध स्वर्ण भस्म',
    botanicalName: 'Aurum (Processed Micro-Particle Gold)',
    category: 'Rasayana',
    targetHealthGoals: ['Peak Cellular Rejuvenation', 'Longevity & Ojas', 'Cardio-Vascular Vigor', 'Neurological Sharpness'],
    ayurvedicProperties: {
      rasa: 'Madhura, Tikta, Kashaya',
      guna: 'Laghu (Light), Snigdha (Unctuous)',
      virya: 'Sheeta (Cooling)',
      vipaka: 'Madhura (Sweet)',
      doshaKarma: 'Tridosha Shamaka (Supreme harmony)',
      prabhava: 'Rasayana Shrestha & Medhya (Supreme longevity and intellect agent)'
    },
    traditionalAction: 'The ultimate jewel of Ayurvedic alchemy (Rasa Shastra). Prepared through dozens of Puta firings into biologically assimilable sub-micron particles.',
    modernValidation: 'Engineered nano-gold particles act as free-radical scavengers, protect endothelial lining, and significantly enhance cellular bio-availability.',
    foundInProducts: [
      { id: 'wantmore-men', name: 'WANTMORE FOR MEN', role: 'Enriched Supreme Calx' },
      { id: 'mens-combo', name: "Men's Performance Combo", role: 'Precious Vitality Core' }
    ],
    relatedArticleSlug: 'ashwagandha-shilajit-mard-shakti',
    image: getOptimizedImageUrl(BLOG_IMAGES.herbs.swaranBhasma, { width: 400 }),
    summary: 'The pinnacle of classical Ayurvedic rejuvenation, fortifying Ojas (vital essence), enhancing cellular longevity, and powering peak male endurance.'
  },
  {
    id: 'haritaki',
    name: 'Haritaki',
    sanskritName: 'हरीतकी (Harītakī)',
    hindiName: 'हरड़ / हर्रे',
    botanicalName: 'Terminalia chebula',
    category: 'Detox-Metabolism',
    targetHealthGoals: ['Gut Motility & Agni', 'Bloating & Gas Relief', 'Microbiome Balance', 'Vata Regulation'],
    ayurvedicProperties: {
      rasa: 'Possesses 5 of 6 tastes (lacks only Lavana / Salty)',
      guna: 'Laghu (Light), Ruksha (Dry)',
      virya: 'Ushna (Gentle heating)',
      vipaka: 'Madhura (Sweet)',
      doshaKarma: 'Tridosha Shamaka (Especially pacifies Vata)',
      prabhava: 'Anulomana (Guides downward wind and digestive flow)'
    },
    traditionalAction: 'Referred to in classical texts as "Mother" because it cares for the digestive organs just as a mother cares for her child.',
    modernValidation: 'Potent source of chebulagic acid and ellagitannins that stimulate peristalsis, heal mucosal lining, and regulate gastrointestinal acidity.',
    foundInProducts: [
      { id: 'vayucore', name: 'VAYUCORE', role: 'Digestive Motility Pillar' }
    ],
    relatedArticleSlug: 'pet-sahi-performance-sahi-men-health',
    image: getOptimizedImageUrl(BLOG_IMAGES.herbs.haritaki, { width: 400 }),
    summary: 'The revered queen of digestion, gently eliminating trapped gas, calming abdominal colic, and restoring natural intestinal motility.'
  }
];

/**
 * Standardized 6 core herbs spotlighted on the Women's page
 */
export const WOMEN_TRANSPARENCY_HERBS: AyurvedicHerb[] = AYURVEDIC_HERBS.slice(0, 6);

/**
 * Verified Men's Ayurvedic Ingredients for ALPHAMAX & WANTMORE
 * Strictly separated from female hormonal herbs.
 * ALPHAMAX: Shilajit Extract, Safed Musli, Ashwagandha, Kaunch Beej, Swaran Bhasma, Kesar (6 items)
 * WANTMORE: Swaran Bhasma, Chandi Bhasma, Moti Pishti, Salam Panja, Siddh Makardhwaj, Jayfal (6 items)
 * Swaran Bhasma is explicitly associated with BOTH ALPHAMAX and WANTMORE.
 */
export const MEN_TRANSPARENCY_HERBS: AyurvedicHerb[] = [
  {
    id: 'shilajit-extract',
    name: 'Shilajit Extract',
    sanskritName: 'शुद्ध शिलाजीत (Śilājītu)',
    hindiName: 'शुद्ध शिलाजीत',
    botanicalName: 'Asphaltum punjabianum (Purified Mineral Pitch)',
    category: 'Mens-Vitality',
    productTag: 'ALPHAMAX',
    targetHealthGoals: ['Cellular ATP Energy', 'Physical Stamina', 'Endurance', 'Vitality'],
    traditionalAction: 'Celebrated in classical Ayurvedic treatises as a premier Rasayana and Balya. Rejuvenates deep bodily tissues (Dhatus) and functions as an amplifier (Yogavahi) for formulation synergy.',
    modernValidation: 'Standardized Himalayan mineral pitch rich in active fulvic acid and ionic trace minerals that support natural mitochondrial cellular energy without synthetic crashes.',
    foundInProducts: [
      { id: 'alphamax-men', name: 'ALPHAMAX', role: 'Vitality & Endurance Capsule' }
    ],
    icon: '🏔️'
  },
  {
    id: 'safed-musli',
    name: 'Safed Musli',
    sanskritName: 'श्वेत मूसली (Śveta Mūsalī)',
    hindiName: 'सफेद मूसली',
    botanicalName: 'Chlorophytum borivilianum',
    category: 'Mens-Vitality',
    productTag: 'ALPHAMAX',
    targetHealthGoals: ['Physical Vigor', 'Shukra Dhatu Nourishment', 'Muscle Stamina', 'Endurance'],
    traditionalAction: 'Cornerstone of Ayurvedic Vajikarana and Rasayana therapy. Traditionally used to nourish deep reproductive and muscular tissues for lasting stamina and strength.',
    modernValidation: 'Supplies natural spirostanol glycosides, saponins, and polysaccharides that combat daily physical fatigue and promote muscle recovery.',
    foundInProducts: [
      { id: 'alphamax-men', name: 'ALPHAMAX', role: 'Vitality & Endurance Capsule' }
    ],
    icon: '🌱'
  },
  {
    id: 'ashwagandha',
    name: 'Ashwagandha',
    sanskritName: 'अश्वगन्धा (Aśvagandhā)',
    hindiName: 'अश्वगंधा (नागौरी)',
    botanicalName: 'Withania somnifera',
    category: 'Mens-Vitality',
    productTag: 'ALPHAMAX',
    targetHealthGoals: ['Stress Resilience', 'Physical Endurance', 'Calm Focus', 'Ojas Vitality'],
    traditionalAction: 'Foremost Balya (strength-giver) and Rasayana adaptogen traditionally used to build enduring physical capacity, reduce daily fatigue, and fortify vital Ojas.',
    modernValidation: 'Standardized withanolides help maintain physiological homeostasis during stress and support continuous daily stamina.',
    foundInProducts: [
      { id: 'alphamax-men', name: 'ALPHAMAX', role: 'Vitality & Endurance Capsule' }
    ],
    icon: '🌿'
  },
  {
    id: 'kaunch-beej',
    name: 'Kaunch Beej',
    sanskritName: 'कपिकच्छू (Kapikacchū / Kauñca Bīja)',
    hindiName: 'कौंच बीज',
    botanicalName: 'Mucuna pruriens',
    category: 'Mens-Vitality',
    productTag: 'ALPHAMAX',
    targetHealthGoals: ['Vitality & Mood', 'Dhatu Nourishment', 'Nervous System Health', 'Vigor'],
    traditionalAction: 'Celebrated Ayurvedic botanical known for deep Dhatu nourishment, supporting motor nervous system harmony and natural male vigor.',
    modernValidation: 'Natural botanical source of L-DOPA that supports healthy neurotransmitter synthesis, mood equilibrium, and physical vitality.',
    foundInProducts: [
      { id: 'alphamax-men', name: 'ALPHAMAX', role: 'Vitality & Endurance Capsule' }
    ],
    icon: '🌰'
  },
  {
    id: 'swaran-bhasma',
    name: 'Swaran Bhasma',
    sanskritName: 'स्वर्ण भस्म (Svarṇa Bhasma)',
    hindiName: 'शुद्ध स्वर्ण भस्म',
    botanicalName: 'Purified Sub-Micron Calx of Gold (Aurum)',
    category: 'Rasayana',
    productTag: 'BOTH',
    targetHealthGoals: ['Peak Cellular Rejuvenation', 'Longevity & Ojas', 'Endurance', 'Supreme Rasayana'],
    traditionalAction: 'The ultimate jewel of Ayurvedic alchemy (Rasa Shastra). Prepared through traditional repeated Puta firings into sub-micron particles to nourish Ojas and core stamina.',
    modernValidation: 'Traditional calcined nano-particle gold ash acting as a cellular bio-carrier that protects vital tissues and enhances formulation bioavailability.',
    foundInProducts: [
      { id: 'alphamax-men', name: 'ALPHAMAX', role: 'Precious Cellular Rasayana' },
      { id: 'wantmore-men', name: 'WANTMORE', role: 'Supreme Vitality Prash Core' }
    ],
    icon: '✨'
  },
  {
    id: 'kesar',
    name: 'Kesar',
    sanskritName: 'कुङ्कुम (Kuṅkuma / Kesar)',
    hindiName: 'केसर / जाफरान',
    botanicalName: 'Crocus sativus (Pure Saffron Stigma)',
    category: 'Mens-Vitality',
    productTag: 'ALPHAMAX',
    targetHealthGoals: ['Micro-Circulation', 'Mood Uplift', 'Varnya Harmonizer', 'Vital Energy'],
    traditionalAction: 'Revered Tridoshic harmonizer and Varnya herb celebrated in Ayurvedic treatises for uplifting vitality, circulation, and mental poise.',
    modernValidation: 'Rich in bioactive crocin, crocetin, and safranal that provide natural antioxidant protection and cellular support.',
    foundInProducts: [
      { id: 'alphamax-men', name: 'ALPHAMAX', role: 'Vitality & Endurance Capsule' }
    ],
    icon: '🌺'
  },
  {
    id: 'chandi-bhasma',
    name: 'Chandi Bhasma',
    sanskritName: 'रजत भस्म (Rajata Bhasma)',
    hindiName: 'शुद्ध चांदी भस्म',
    botanicalName: 'Purified Sub-Micron Calx of Silver (Argentum)',
    category: 'Rasayana',
    productTag: 'WANTMORE',
    targetHealthGoals: ['Cooling Endurance', 'Pitta Pacification', 'Nervous Equilibrium', 'Physical Stamina'],
    traditionalAction: 'Classical Sheeta Virya (cooling potency) mineral preparation traditionally used to soothe Pitta, calm the nervous system, and build sustained physical endurance.',
    modernValidation: 'Traditional silver calx incinerated into bio-compatible micro-particles, supporting physical stamina and nervous resilience.',
    foundInProducts: [
      { id: 'wantmore-men', name: 'WANTMORE', role: 'Cooling Stamina & Endurance Prash' }
    ],
    icon: '🌙'
  },
  {
    id: 'moti-pishti',
    name: 'Moti Pishti',
    sanskritName: 'मुक्ता पिष्टी (Muktā Piṣṭī)',
    hindiName: 'मोती पिष्टी',
    botanicalName: 'Purified Calx of Natural Pearl (Pinctada margaritifera)',
    category: 'Rasayana',
    productTag: 'WANTMORE',
    targetHealthGoals: ['Calm Vitality', 'Pitta Balance', 'Mental Clarity', 'Endurance'],
    traditionalAction: 'Celebrated in Rasashastra as the supreme cooling, heart-soothing (Hridya) jewel preparation for pacifying Pitta and promoting steady physical composure.',
    modernValidation: 'Bio-assimilable natural calcium and marine trace elements gently processed with rose water, promoting nervous balance and vitality.',
    foundInProducts: [
      { id: 'wantmore-men', name: 'WANTMORE', role: 'Calm Vitality & Balance Prash' }
    ],
    icon: '🦪'
  },
  {
    id: 'salam-panja',
    name: 'Salam Panja',
    sanskritName: 'सालम पंजा (Sālama Pañjā)',
    hindiName: 'सालम पंजा',
    botanicalName: 'Dactylorhiza hatagirea',
    category: 'Mens-Vitality',
    productTag: 'WANTMORE',
    targetHealthGoals: ['Dhatu Vardhak', 'Endurance', 'Physical Stamina', 'Strength'],
    traditionalAction: 'Rare high-altitude Ayurvedic botanical historically prized as a premier Dhatu Vardhak for male vigor, muscle strength, and athletic endurance.',
    modernValidation: 'Rich in natural bioactive mucilages, polysaccharides, and nutrients that support muscle energy recovery and continuous physical stamina.',
    foundInProducts: [
      { id: 'wantmore-men', name: 'WANTMORE', role: 'Dhatu Vardhak Strength Core' }
    ],
    icon: '🌿'
  },
  {
    id: 'siddh-makardhwaj',
    name: 'Siddh Makardhwaj',
    sanskritName: 'सिद्ध मकरध्वज (Siddha Makaradhvaja)',
    hindiName: 'सिद्ध मकरध्वज',
    botanicalName: 'Classical Ayurvedic Kupipakwa Rasayana',
    category: 'Rasayana',
    productTag: 'WANTMORE',
    targetHealthGoals: ['Peak Vigor', 'Cellular Rejuvenation', 'Yogavahi Potency', 'Performance'],
    traditionalAction: 'Legendary Kupipakwa formulation prepared with purified minerals and gold, celebrated across classical treatises as an unparalleled Yogavahi Rasayana.',
    modernValidation: 'Prepared through traditional controlled temperature sand-bath heating (Valuka Yantra), acting as a potent bio-enhancer for formulation synergy.',
    foundInProducts: [
      { id: 'wantmore-men', name: 'WANTMORE', role: 'Classical Yogavahi Rasayana' }
    ],
    icon: '⚡'
  },
  {
    id: 'jayfal',
    name: 'Jayfal',
    sanskritName: 'जातीफल (Jātīphala)',
    hindiName: 'जायफल',
    botanicalName: 'Myristica fragrans (Nutmeg)',
    category: 'Mens-Vitality',
    productTag: 'WANTMORE',
    targetHealthGoals: ['Formulation Synergy', 'Deepana & Digestion', 'Absorption', 'Evening Recovery'],
    traditionalAction: 'Classical aromatic spice with Deepana (digestive fire) and Vrishya properties, promoting optimal assimilation of heavy Rasayanas.',
    modernValidation: 'Supplies natural essential aromatic compounds like myristicin that support gastrointestinal absorption and soothe the nervous system.',
    foundInProducts: [
      { id: 'wantmore-men', name: 'WANTMORE', role: 'Deepana & Formulation Synergist' }
    ],
    icon: '🍂'
  }
];
