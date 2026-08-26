import { Product } from './types';

/**
 * Optimizes Cloudinary URLs preserving maximum visual fidelity, sharp label text, and high DPI support.
 * Uses visually lossless quality (q_auto:best) and avoids downscaling text or fine packaging details.
 */
export function optimizeCloudinaryUrl(url: string, width?: number): string {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com')) return url;
  
  const uploadIndex = url.indexOf('/image/upload/');
  if (uploadIndex === -1) return url;
  
  const prefix = url.substring(0, uploadIndex + '/image/upload/'.length);
  let rest = url.substring(uploadIndex + '/image/upload/'.length);
  
  // Strip existing transformations if present (including colons, equals, commas)
  rest = rest.replace(/^([a-z0-9_:,=-]+)\/(v\d+\/.*)$/i, '$2');
  
  // Use q_auto:best for crystal-sharp text and packaging labels, c_limit to never distort aspect ratio or upscale
  const transform = width ? `f_auto,q_auto:best,w_${width},c_limit` : 'f_auto,q_auto:best';
  return `${prefix}${transform}/${rest}`;
}

export function getCloudinarySrcSet(url: string, widths: number[] = [480, 720, 960, 1200, 1600]): string {
  if (!url || !url.includes('res.cloudinary.com')) return '';
  return widths.map(w => `${optimizeCloudinaryUrl(url, w)} ${w}w`).join(', ');
}

export const PRODUCTS: Product[] = [
  {
    id: 'combo-kit',
    name: "meONmode® Combo Kit",
    subtitle: "OVAIRA Capsules + FLOWELLE Syrup",
    price: 1999,
    mrp: 3798,
    images: [
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787512639/ChatGPT_Image_Jun_20_2026_10_28_24_PM.png',
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787512639/ChatGPT_Image_Jun_20_2026_10_28_22_PM.png',
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787512640/ChatGPT_Image_Jun_20_2026_10_28_26_PM.png',
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787512640/ChatGPT_Image_Jun_20_2026_10_28_29_PM.png',
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787512640/ChatGPT_Image_Jun_20_2026_10_28_34_PM.png',
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787512640/ChatGPT_Image_Jun_20_2026_10_28_37_PM.png',
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787512641/ChatGPT_Image_Jun_20_2026_10_28_42_PM.png',
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787512640/ChatGPT_Image_Jun_20_2026_10_28_47_PM.png',
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787512640/ChatGPT_Image_Jun_20_2026_10_28_40_PM.png'
    ],
    tag: "BEST SELLER - SAVE 47%",
    shortDescription: "The complete 30-second daily Ayurvedic ritual for everyday cycle support, hormonal balance, and painless periods.",
    longDescription: "The ultimate dual-action therapeutic kit designed by Ayurvedic gynecologists to target the root causes of PCOS, PCOD, irregular cycles, and menstrual discomfort. While OVAIRA capsules regulate LH/FSH balance and resolve ovarian cysts, FLOWELLE syrup tones uterine muscles and regularizes flow volume. Combined, they form a perfect, natural, gentle Ayurvedic solution to help you support your daily wellness.",
    volumeOrQty: "60 Capsules + 450 ML Syrup",
    dosage: "• OVAIRA Capsule: Take 1 Capsule in the Morning and 1 Capsule in the Evening (After Meals).\n• FLOWELLE Syrup: Take 5ml in the Morning and 5ml in the Evening (After Meals).",
    benefits: [
      "Normalizes irregular cycles and balances LH/FSH levels naturally",
      "Reduces ovarian cyst size and prevents further cyst formation",
      "Significantly relieves painful cramps, bloating, and backaches",
      "Combats hormonal acne and controls excess facial hair (hirsutism)",
      "Detoxifies blood, purifies skin, and elevates everyday energy levels",
      "Ayurvedic, Soy-Free, Gluten-Free, and clinically tested"
    ],
    keyIngredients: [
      { name: "Shatavari", benefit: "Hormonal Balance", description: "The premier female reproductive tonic that naturally regularizes estrogen and progesterone cycles." },
      { name: "Ashoka Bark", benefit: "Uterine Health", description: "Directly tones the uterine muscles and manages heavy, irregular or painful cycles." },
      { name: "Kanchnar", benefit: "Cyst Reduction", description: "Renowned in Ayurveda for reducing lymphatic swellings and assisting in ovarian cyst management." },
      { name: "Lodhra", benefit: "Flow Regulation", description: "Maintains optimal progesterone levels to stop excess bleeding and normalizes flow volume." }
    ],
    rating: 5.0,
    reviewsCount: 942
  },
  {
    id: 'ovaira',
    name: "meONmode® OVAIRA Capsules",
    subtitle: "PCOS/PCOD Care & Hormonal Wellness",
    price: 1199,
    mrp: 1999,
    images: [
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787512635/ChatGPT_Image_Jun_20_2026_10_27_18_PM_copy.png',
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787512635/ChatGPT_Image_Jun_20_2026_10_27_28_PM.png',
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787512635/ChatGPT_Image_Jun_20_2026_10_27_30_PM.png',
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787512635/ChatGPT_Image_Jun_20_2026_10_27_32_PM.png',
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787512636/ChatGPT_Image_Jun_20_2026_10_27_39_PM.png',
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787512637/ChatGPT_Image_Jun_20_2026_10_27_40_PM.png',
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787512637/ChatGPT_Image_Jun_20_2026_10_27_45_PM.png',
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787512637/ChatGPT_Image_Jun_20_2026_10_27_42_PM.png',
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787512637/ChatGPT_Image_Jun_20_2026_10_27_48_PM.png',
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787512637/ChatGPT_Image_Jun_20_2026_10_27_46_PM.png'
    ],
    tag: "PCOS SPECIALLY FORMULATED",
    shortDescription: "60 Veg Capsules to manage insulin resistance, reduce ovarian cysts, and clear hormonal acne.",
    longDescription: "A specialized Ayurvedic formula crafted to restore healthy ovulation, normalize menstrual flow, and resolve PCOS/PCOD symptoms at the root level. Contains highly purified Shatavari, Kanchnar, and Guggulu to boost metabolic health, reduce insulin resistance, and bring back a natural, monthly cycle without synthetic hormones.",
    volumeOrQty: "60 Veg Capsules",
    dosage: "Take 1 Capsule in the Morning and 1 Capsule in the Evening (After Meals).",
    benefits: [
      "Promotes healthy eggs & timely monthly ovulation",
      "Reduces high levels of free testosterone & clears facial hair",
      "Eliminates deep painful cystic acne & purifies pores",
      "Enhances metabolic rate to aid PCOS-related weight loss",
      "100% natural, non-habit forming capsules"
    ],
    keyIngredients: [
      { name: "Shatavari", benefit: "Egg Quality", description: "Fosters healthy egg development and stabilizes mood and energy swings." },
      { name: "Kanchnar Guggulu", benefit: "Glandular Tonic", description: "A classic Ayurvedic formulation to break down growths, nodules, and fluid-filled cysts." },
      { name: "Lodhra", benefit: "LH/FSH Balance", description: "Assists the pituitary gland in maintaining a healthy ratio of ovulation hormones." }
    ],
    rating: 4.9,
    reviewsCount: 874
  },
  {
    id: 'flowelle',
    name: "meONmode® FLOWELLE Drink",
    subtitle: "Natural Support (Ayurvedic, Safe & Effective)",
    price: 999,
    mrp: 1799,
    images: [
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787512638/ChatGPT_Image_Jun_20_2026_10_28_00_PM.png',
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787512638/ChatGPT_Image_Jun_20_2026_10_28_01_PM.png',
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787512638/ChatGPT_Image_Jun_20_2026_10_28_03_PM.png',
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787512639/ChatGPT_Image_Jun_20_2026_10_28_20_PM.png',
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787512639/ChatGPT_Image_Jun_20_2026_10_28_11_PM.png',
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787512638/ChatGPT_Image_Jun_20_2026_10_28_05_PM.png',
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787512639/ChatGPT_Image_Jun_20_2026_10_28_08_PM.png'
    ],
    tag: "100% PAIN-FREE PERIODS",
    shortDescription: "450 ML Syrup to relieve painful period cramps and restore perfect cycle volume.",
    longDescription: "Formulated specifically to regulate flow, alleviate severe period pains, and purify blood. Sourced as per Bharat Pharmacopoeia standards, FLOWELLE contains highly potent standardised extracts of Ashok Chal, Shatavari, Gokhru, and Ashwagandha. It works as a direct uterine tonic to strengthen reproductive muscles, ease pelvic contractions, and solve multiple hormonal health issues naturally without side effects.",
    volumeOrQty: "450 ML",
    dosage: "Step 1: Pour 5-10ml of FLOWELLE Syrup using the measuring cap.\nStep 2: Mix it well in a glass of water until evenly blended.\nStep 3: Drink it daily after your meals (Morning and Evening) as a part of your wellness routine.",
    benefits: [
      "White Discharge (Leucorrhoea) - Stops abnormal discharge and intimate discomfort",
      "Irregular Periods - Establishes healthy, timely cycle rhythms naturally",
      "Hormonal Imbalance - Balances progesterone, estrogen, and LH/FSH ratios",
      "Menstrual Pain - Significantly reduces pelvic pain, cramping, and severe backaches",
      "Low Energy - Alleviates chronic period fatigue and boosts daytime stamina",
      "Uterine Weakness - Tones uterine muscles and strengthens overall wellness",
      "Mood Swings - Balances neurochemical fluctuations for a calm, happy mind",
      "Excessive Bleeding - Restricts excess flow and preserves healthy hemoglobin"
    ],
    keyIngredients: [
      { name: "Ashok Chal", benefit: "Uterine Health", description: "Supports uterine health, tones reproductive muscles, and balances menstrual cycle." },
      { name: "Shatavari", benefit: "Nourishment", description: "Nourishes the female reproductive system and stabilizes vital hormone levels." },
      { name: "Gokhru", benefit: "Hormonal Balance", description: "Maintains optimal progesterone levels and balances endocrine system." },
      { name: "Ashwagandha", benefit: "Stress & Fatigue", description: "Helps reduce cortisol (stress), anxiety, and menstrual low energy or fatigue." }
    ],
    rating: 4.8,
    reviewsCount: 781
  }
];

export const MENS_PRODUCTS: Product[] = [
  {
    id: 'wantmore-men',
    name: "meONmode® WANTMORE FOR MEN (Prash)",
    subtitle: "Maximum Strength Performance Prash",
    price: 4999,
    mrp: 8999,
    images: [
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787581394/ChatGPT_Image_Aug_24_2026_07_28_33_PM.png',
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787581396/ChatGPT_Image_Aug_24_2026_07_29_06_PM.png',
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787581383/ChatGPT_Image_Aug_24_2026_07_28_45_PM.png',
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787581405/ChatGPT_Image_Aug_24_2026_07_28_58_PM.png'
    ],
    tag: "STAMINA BOOSTER",
    shortDescription: "Clinically balanced Prash formulation designed to optimize strength, stamina, and physical endurance.",
    longDescription: "meONmode® WANTMORE FOR MEN is an Ayurvedic Prash formulated to support daily vitality, physical performance, mental clarity, reproductive wellness, and sustained endurance. It is enriched with Swaran Bhasma, Chandi Bhasma, Moti Pishti, Salam Panja, Siddh Makardhwaj, and Jayfal, with a traditional Prash formulation designed for convenient absorption.",
    volumeOrQty: "200g Prash",
    dosage: "Take 1-2 teaspoons (5g-10g) daily with lukewarm milk or water after meals.",
    benefits: [
      "Boosts natural physical stamina and athletic output",
      "Supports lean muscle recovery and protein synthesis",
      "Reduces fatigue and revitalizes daily physical energy",
      "Ayurvedic, safe & effective gentle formulation"
    ],
    keyIngredients: [
      { name: "Swaran Bhasma", benefit: "Vitality & Strength", description: "Purified gold ash traditionally valued in Rasashastra for enhancing vitality, cellular vigor, and overall resilience." },
      { name: "Chandi Bhasma", benefit: "Cooling & Stamina", description: "Purified silver ash known for its rejuvenating properties that support nervous system balance and physical endurance." },
      { name: "Moti Pishti", benefit: "Mental Clarity", description: "Traditional pearl preparation that helps pacify Pitta, promoting mental clarity and natural physical balance." },
      { name: "Salam Panja", benefit: "Endurance & Vigor", description: "Revered Ayurvedic root traditionally used to support male stamina, physical endurance, and reproductive wellness." },
      { name: "Siddh Makardhwaj", benefit: "Rejuvenating Rasayana", description: "Classical Ayurvedic formulation revered as a potent Rasayana for sustaining peak physical performance and energy." },
      { name: "Jayfal", benefit: "Circulation & Warmth", description: "Nutmeg extract providing aromatic and therapeutic qualities that support digestive fire and physical vitality." }
    ],
    rating: 4.9,
    reviewsCount: 819
  },
  {
    id: 'alphamax-men',
    name: "meONmode® AlphaMax FOR MEN (Capsules)",
    subtitle: "Power & Energy Capsules",
    price: 2499,
    mrp: 4999,
    images: [
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787581390/ChatGPT_Image_Aug_24_2026_07_29_31_PM.png',
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787581393/ChatGPT_Image_Aug_24_2026_07_29_42_PM.png',
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787581394/ChatGPT_Image_Aug_24_2026_07_29_54_PM.png',
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787581396/ChatGPT_Image_Aug_24_2026_07_29_48_PM.png',
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787581398/ChatGPT_Image_Aug_24_2026_07_29_59_PM.png'
    ],
    tag: "ENERGY & VITALITY",
    shortDescription: "60 veg capsules packed with organic extracts to optimize cellular energy, vitality, and health.",
    longDescription: "meONmode® ALPHAMAX is an Ayurvedic vitality formula for men designed to support daily energy, peak performance, confidence and focus, extended stamina, and reproductive wellness. It is enriched with Shilajit Extract, Safed Musli, Ashwagandha, Kaunch Beej, Swaran Bhasma, and Kesar, formulated in capsule form for convenient daily use.",
    volumeOrQty: "60 Veg Capsules",
    dosage: "Take 1 capsule in the morning and 1 capsule in the evening (after meals).",
    benefits: [
      "Maximizes physical performance and peak power",
      "Improves cellular recovery and oxygenation",
      "Fights stress, anxiety, and everyday mental exhaustion",
      "Non-habit forming, safe for daily continuous use"
    ],
    keyIngredients: [
      { name: "Shilajit Extract", benefit: "Cellular Energy", description: "Standardized Himalayan mineral resin rich in fulvic acid, supporting natural cellular ATP energy and stamina." },
      { name: "Safed Musli", benefit: "Physical Vigor", description: "Classic Rasayana herb traditionally celebrated for boosting physical strength, stamina, and reproductive wellness." },
      { name: "Ashwagandha", benefit: "Stress & Stamina", description: "Renowned adaptogen that helps the body adapt to daily stress, supporting calm focus and sustained physical endurance." },
      { name: "Kaunch Beej", benefit: "Vitality & Mood", description: "Traditional botanical source of L-DOPA that supports nervous system health, vitality, and male reproductive wellness." },
      { name: "Swaran Bhasma", benefit: "Precious Rasayana", description: "Traditional gold ash preparation known for its rejuvenating qualities that support overall vitality and vigor." },
      { name: "Kesar", benefit: "Antioxidant & Mood", description: "Pure saffron threads known to support antioxidant defense, mood balance, and healthy microcirculation." }
    ],
    rating: 4.8,
    reviewsCount: 736
  },
  {
    id: 'mens-combo',
    name: "Men's Ultimate Performance Combo",
    subtitle: "WANTMORE Prash + ALPHAMAX Capsules + FREE VAYUCORE",
    price: 6999,
    mrp: 15997,
    images: [
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787581402/ChatGPT_Image_Aug_24_2026_07_42_58_PM.png',
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787581391/ChatGPT_Image_Aug_24_2026_at_07_45_41_PM.png',
      'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787581401/ChatGPT_Image_Aug_24_2026_07_43_06_PM.png'
    ],
    tag: "BEST SELLER - SAVE 56% + FREE VAYUCORE",
    shortDescription: "The ultimate power and performance duo for comprehensive daily stamina, vitality, and physical health, now bundled with a FREE full-size bottle of VAYUCORE Ayurvedic Digestive Liquid (450 ML).",
    longDescription: "meONmode® Men's Performance Combo combines ALPHAMAX Capsules + WANTMORE Prash to provide complementary Ayurvedic support for men's daily vitality and performance. ALPHAMAX is enriched with Shilajit Extract, Safed Musli, Ashwagandha, Kaunch Beej, Swaran Bhasma, and Kesar, while WANTMORE is enriched with Swaran Bhasma, Chandi Bhasma, Moti Pishti, Salam Panja, Siddh Makardhwaj, and Jayfal. Together, the two formulations are positioned to support daily energy, peak performance, focus, sustained stamina, endurance, and reproductive wellness.",
    volumeOrQty: "200g Prash + 60 Capsules + 450ml VAYUCORE (Free)",
    dosage: "• WANTMORE Prash: Take 1 teaspoon daily with milk after dinner.\n• ALPHAMAX Capsules: Take 1 capsule with breakfast and 1 capsule with dinner.\n• VAYUCORE Liquid: Take 7–10 ml daily after meals.",
    benefits: [
      "Dual-action formula targeting complete male vitality and cellular stamina",
      "Includes 1x FREE Full-Size VAYUCORE 450 ML Digestive Tonic (Worth ₹1,999)",
      "Synergistic recovery of muscles and daily energy stores",
      "Enhances blood flow, natural hormonal health, and gut nutrient absorption",
      "Save 56% compared to individual retail purchases"
    ],
    keyIngredients: [
      { name: "Shilajit Extract (ALPHAMAX)", benefit: "Cellular Energy", description: "Standardized mineral resin rich in fulvic acid to support natural energy and stamina in ALPHAMAX Capsules." },
      { name: "Safed Musli (ALPHAMAX)", benefit: "Physical Vigor", description: "Traditional Rasayana herb for strength, endurance, and reproductive wellness in ALPHAMAX Capsules." },
      { name: "Ashwagandha (ALPHAMAX)", benefit: "Stress & Focus", description: "Adaptogenic herb to manage daily stress and support sustained physical endurance in ALPHAMAX Capsules." },
      { name: "Kaunch Beej (ALPHAMAX)", benefit: "Vitality & Mood", description: "Ayurvedic botanical supporting vitality, nervous system health, and vigor in ALPHAMAX Capsules." },
      { name: "Swaran Bhasma (ALPHAMAX)", benefit: "Precious Rasayana", description: "Gold ash preparation for cellular vitality and rejuvenation in ALPHAMAX Capsules." },
      { name: "Kesar (ALPHAMAX)", benefit: "Antioxidant & Mood", description: "Saffron threads supporting antioxidant balance, mood, and microcirculation in ALPHAMAX Capsules." },
      { name: "Swaran Bhasma (WANTMORE)", benefit: "Vitality & Strength", description: "Purified gold ash in WANTMORE Prash for deep cellular vitality and overall stamina." },
      { name: "Chandi Bhasma (WANTMORE)", benefit: "Cooling & Stamina", description: "Purified silver ash in WANTMORE Prash supporting nervous balance and physical endurance." },
      { name: "Moti Pishti (WANTMORE)", benefit: "Mental Clarity", description: "Pearl preparation in WANTMORE Prash to pacify Pitta and promote mind-body equilibrium." },
      { name: "Salam Panja (WANTMORE)", benefit: "Endurance & Vigor", description: "Ayurvedic root in WANTMORE Prash supporting stamina, physical endurance, and male wellness." },
      { name: "Siddh Makardhwaj (WANTMORE)", benefit: "Rejuvenating Rasayana", description: "Classical Ayurvedic Rasayana in WANTMORE Prash for peak physical performance and endurance." },
      { name: "Jayfal (WANTMORE)", benefit: "Circulation & Warmth", description: "Nutmeg extract in WANTMORE Prash supporting vitality, digestive harmony, and warmth." }
    ],
    rating: 5.0,
    reviewsCount: 915
  }
];

export const VAYUCORE_PRODUCT: Product = {
  id: 'vayucore',
  name: "meONmode® VAYUCORE",
  subtitle: "Healthy Gut. Better Life.",
  price: 999,
  mrp: 1999,
  images: [
    'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787581399/ChatGPT_Image_Aug_24_2026_07_30_05_PM.png',
    'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787581398/ChatGPT_Image_Aug_24_2026_07_30_12_PM.png',
    'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto/v1787581401/ChatGPT_Image_Aug_24_2026_07_30_21_PM.png'
  ],
  tag: "BESTSELLER - GUT HEALTH",
  shortDescription: "VAYUCORE is an Ayurvedic digestive wellness liquid formulated with carefully selected herbs to support healthy digestion, reduce gas and bloating, relieve acidity, and maintain overall gut health. Suitable for daily use by adults.",
  longDescription: "VAYUCORE is an Ayurvedic digestive wellness liquid crafted to support healthy digestion, eliminate persistent gas and bloating, soothe acidity, and maintain overall gut health. Formulated by expert Ayurvedic doctors using 100% natural, potent extracts including Kutki, Kalmegh, Palakya, Chirayita, Kasamarda, Kasni Beej, Kakamachi, Bhringraj, Punarnava, Zirak, Vaividang, Nishoth, Jauka, Shankh Drav, Turmeric, and Mulethi. VAYUCORE gently balances Vata, Pitta, and Kapha doshas while promoting daily digestive comfort without synthetic additions or chemicals.",
  volumeOrQty: "450 ml Liquid",
  dosage: "7–10 ml daily or as directed by a physician.",
  benefits: [
    "Supports healthy digestion & optimal nutrient absorption",
    "Reduces persistent gas, bloating, and stomach heaviness",
    "Helps relieve acidity, heartburn, and sour reflux",
    "Supports gut health & liver function",
    "Supports Vata, Pitta & Kapha balance",
    "Natural Ayurvedic ingredients, gentle for daily use",
    "Ayurvedic, Made in India, GMP Quality Manufacturing"
  ],
  keyIngredients: [
    { name: "Kutki & Kalmegh", benefit: "Liver & Digestive Support", description: "Promotes healthy bile secretion and liver metabolism for smooth digestion." },
    { name: "Chirayita & Kasni Beej", benefit: "Gut Health & Detox", description: "Helps detoxify the gastrointestinal tract and supports intestinal health." },
    { name: "Zirak & Vaividang", benefit: "Carminative & Anti-Bloat", description: "Eases gas trapped in the intestines and reduces bloating and discomfort." },
    { name: "Turmeric & Mulethi", benefit: "Acid Relief & Mucosal Care", description: "Soothes the stomach lining, neutralizing acidity and heartburn." }
  ],
  rating: 4.9,
  reviewsCount: 428
};

// Include VAYUCORE in both collections
PRODUCTS.push(VAYUCORE_PRODUCT);
MENS_PRODUCTS.push(VAYUCORE_PRODUCT);

export const TESTIMONIALS = [
  {
    name: "Priyanka Sharma",
    age: 28,
    location: "Mumbai",
    rating: 5,
    title: "Regulated my 2-year irregular periods!",
    comment: "I had PCOS since 2021. Periods would only come with pills. After using the meONmode Combo Kit for 3 months, my cycles are back to a regular 28 days naturally! Best part? My severe cramps are 90% gone."
  },
  {
    name: "Ananya Iyer",
    age: 31,
    location: "Bangalore",
    rating: 5,
    title: "No more heavy flow and agonizing pain",
    comment: "Flowelle Syrup has been a lifesaver. I used to miss work on Day 1 of my period due to pain and vomiting. Now, I feel energetic and the pain is extremely mild. I strongly recommend this to every woman."
  },
  {
    name: "Dr. Meenakshi Nair",
    age: 45,
    location: "Kochi",
    rating: 5,
    title: "Ayurvedic Physician Recommended",
    comment: "I recommend the OVAIRA + FLOWELLE combo to my patients experiencing PCOD, hormonal imbalance, and stubborn acne. The ratio of Shatavari to Ashoka in these products is exceptionally balanced and highly effective."
  }
];

export const MENS_TESTIMONIALS = [
  {
    name: "Rajesh Varma",
    age: 34,
    location: "Delhi",
    rating: 5,
    title: "My strength and stamina have doubled!",
    comment: "I was feeling constantly tired after my long office shifts. After taking the meONmode Men's Ultimate Combo for just 30 days, my recovery is super fast and my daily physical stamina has improved incredibly. 100% worth it!"
  },
  {
    name: "Vikram Malhotra",
    age: 29,
    location: "Pune",
    rating: 5,
    title: "No more fatigue or energy crashes",
    comment: "AlphaMax Capsules are unbelievable. I take one capsule with breakfast and have high, sustained energy throughout the day. Best natural supplement I've found that actually works without side effects."
  },
  {
    name: "Dr. Karan Mehta",
    age: 42,
    location: "Ahmedabad",
    rating: 5,
    title: "Clinically Superior Men's Health",
    comment: "The concentration of pure Shudh Shilajit and Safed Musli in meONmode's Men's formulations is remarkable. It supports healthy circulation, reduces daily stress markers, and restores baseline male vitality safely."
  }
];

export const FAQS = [
  {
    question: "How long does it take to see visible results?",
    answer: "Most women see a noticeable reduction in cramp intensity and mood swings within the first 15 days. For regular cycles and cyst reduction, we highly recommend continuing the Combo Kit consistently for 3 to 6 months."
  },
  {
    question: "Is meONmode safe to take alongside modern medicine?",
    answer: "Yes, our products are 100% natural, plant-based herbs and do not interfere with other treatments. However, we recommend maintaining a 1-hour gap between taking Ayurvedic and allopathic medicines."
  },
  {
    question: "What is discreet packaging?",
    answer: "We fully respect your privacy. All orders are packed in a 100% plain, unmarked outer cardboard box with no branding or product descriptions. No one, not even the delivery person, can guess what is inside."
  }
];

export const MENS_FAQS = [
  {
    question: "How long does it take to feel a difference?",
    answer: "Most men notice an increase in energy levels and reduced fatigue within 7 to 10 days of starting WANTMORE and AlphaMax. For sustainable stamina gains and muscle recovery, we recommend a 90-day continuous reset protocol."
  },
  {
    question: "Is meONmode Men's collection safe?",
    answer: "Absolutely. Our products are made of pure Ayurvedic herbs, contain no steroids, heavy metals, or artificial compounds, and are formulated under Ayush ministry guidelines for safe, daily, long-term consumption."
  },
  {
    question: "Can I use both WANTMORE and AlphaMax together?",
    answer: "Yes, they are designed to work synergistically. AlphaMax Capsules support continuous cellular recovery and vascular health, while WANTMORE Prash provides high-impact energy and power for peak performance."
  }
];

export interface CustomerReview {
  productId: string;
  name: string;
  rating: number;
  review: string;
  image?: string | string[];
  verified: boolean;
  date?: string;
  title?: string;
  approved: boolean;
  featured?: boolean;
  email?: string;
  phone?: string;
  location?: string;
}

export const reviews: CustomerReview[] = [
  {
    productId: "ovaira",
    name: "Priya Sharma",
    rating: 5,
    review: "I've been using OVAIRA consistently and it has become an important part of my daily wellness routine.",
    image: "https://i.postimg.cc/0y5tTYHw/IMG-3015.jpg",
    verified: true,
    date: "12 July 2026",
    title: "Essential Daily Wellness",
    approved: true
  },
  {
    productId: "flowelle",
    name: "Anjali Verma",
    rating: 5,
    review: "FLOWELLE is easy to take and fits perfectly into my daily wellness routine.",
    image: "https://i.postimg.cc/P5f6gWFD/IMG-3016.jpg",
    verified: true,
    date: "15 July 2026",
    title: "Very easy to take",
    approved: true
  },
  {
    productId: "combo-kit",
    name: "Karuna",
    rating: 5,
    review: "After using OVAIRA and FLOWELLE consistently, I feel more energetic and my daily wellness routine has become much better.",
    image: "https://i.postimg.cc/CL0J83kT/IMG-3021.jpg",
    verified: true,
    date: "16 June 2026",
    title: "More energetic every day",
    approved: true
  },
  {
    productId: "combo-kit",
    name: "Deepika Sangwan",
    rating: 5,
    review: "The products are easy to use, beautifully packed, and fit perfectly into my daily wellness routine.",
    image: "https://i.postimg.cc/ZKx7s7jB/IMG-3013.jpg\nhttps://i.postimg.cc/Z5YfG8D9/IMG-3014.jpg",
    verified: true,
    date: "25 June 2026",
    title: "Beautifully packed & effective",
    approved: true
  },
  {
    productId: "combo-kit",
    name: "Priyanka Sharma",
    rating: 5,
    review: "I had severe PCOS since 2021. Periods would only come with synthetic pills. After using the meONmode Combo Kit (OVAIRA + FLOWELLE) for 3 months, my cycles are back to a regular 28 days naturally! Best part? My agonizing cramps are 90% gone. Unbelievable results!",
    verified: true,
    date: "May 12, 2026",
    title: "Regulated my 2-year irregular periods!",
    approved: true,
    location: "Mumbai"
  },
  {
    productId: "combo-kit",
    name: "Ananya Iyer",
    rating: 5,
    review: "This combo kit has been an absolute savior. I used to suffer from extreme heavy flow, vomiting, and unbearable pain during the first two days of my periods. Now, I feel so much more energetic and active. Strongly recommended to every woman!",
    verified: true,
    date: "June 2, 2026",
    title: "Life-changing period support",
    approved: true,
    location: "Bangalore"
  },
  {
    productId: "combo-kit",
    name: "Sneha Patel",
    rating: 5,
    review: "My latest ultrasound shows a significant reduction in ovarian cysts! My doctor was genuinely surprised. The combination of capsules and syrup has balanced my hormones completely. I don't feel bloated or moody anymore.",
    verified: true,
    date: "April 28, 2026",
    title: "Cysts reduced on ultrasound!",
    approved: true,
    location: "Ahmedabad"
  },
  {
    productId: "combo-kit",
    name: "Dr. Meenakshi Nair",
    rating: 5,
    review: "As an Ayurvedic physician, I recommend this precise OVAIRA and FLOWELLE combination to my patients experiencing PCOD and severe hormonal imbalances. The combination of Shatavari, Ashoka, and Kanchnar works synergistically.",
    verified: true,
    date: "June 18, 2026",
    title: "Highly balanced Ayurvedic ratio",
    approved: true,
    location: "Kochi"
  },
  {
    productId: "ovaira",
    name: "Kavitha R.",
    rating: 5,
    review: "I have been taking OVAIRA capsules for my irregular menstrual cycle and hormonal acne. Within 6 weeks, my acne has cleared up completely and my period came exactly on time. It has no side effects and is completely natural.",
    verified: true,
    date: "May 20, 2026",
    title: "Excellent hormone balancer",
    approved: true,
    location: "Chennai"
  },
  {
    productId: "ovaira",
    name: "Meera Sen",
    rating: 4,
    review: "Took about a month to show visible results, but it did wonders for my ovulation tracking. My cycles are finally regularizing and the constant pelvic pain has reduced. Highly pure formulation.",
    verified: true,
    date: "June 10, 2026",
    title: "Very effective, but took some time",
    approved: true,
    location: "Kolkata"
  },
  {
    productId: "ovaira",
    name: "Divya Kapoor",
    rating: 5,
    review: "These capsules are amazing. The weight gain and facial hair issues I was facing due to PCOS have finally started stabilizing. Feel light and healthy again.",
    verified: true,
    date: "April 15, 2026",
    title: "PCOS symptoms are under control",
    approved: true,
    location: "Delhi"
  },
  {
    productId: "flowelle",
    name: "Aditi Joshi",
    rating: 5,
    review: "I used to take painkiller injections every month during my periods. FLOWELLE syrup has regularized the blood flow and eliminated my period pain entirely. The taste is authentic and pleasant too.",
    verified: true,
    date: "June 15, 2026",
    title: "Zero cramps on Day 1!",
    approved: true,
    location: "Pune"
  },
  {
    productId: "flowelle",
    name: "Ridhi Gupta",
    rating: 5,
    review: "I was facing very scanty and dark flow for the past year. After taking this syrup for two cycles, my flow is healthy, normal, and bright. Truly a blessing.",
    verified: true,
    date: "May 3, 2026",
    title: "Regularized my scanty flow",
    approved: true,
    location: "Jaipur"
  },
  {
    productId: "flowelle",
    name: "Shalini M.",
    rating: 4,
    review: "Extremely helpful for PMS bloating. I used to get severe mood swings and bloating 5 days before my cycle. This syrup keeps me calm and helps digest food better during those difficult days.",
    verified: true,
    date: "April 29, 2026",
    title: "Relief from bloating & mood swings",
    approved: true,
    location: "Hyderabad"
  },
  {
    productId: "wantmore-men",
    name: "Vikram Malhotra",
    rating: 5,
    review: "WANTMORE Prash has completely upgraded my daily workouts and stamina levels. I consume it with milk post-workout, and the recovery rate is phenomenally fast. No sugar crashes, just pure natural strength.",
    verified: true,
    date: "June 1, 2026",
    title: "Incredible athletic stamina boost",
    approved: true,
    location: "Pune"
  },
  {
    productId: "wantmore-men",
    name: "Dr. Karan Mehta",
    rating: 5,
    review: "Clinically speaking, the concentration of active L-arginine and Safed Musli in meONmode is pristine. It supports natural vascular circulation, decreases cortisol buildup, and enhances daily physical vigor.",
    image: "https://i.postimg.cc/cH0TznDc/IMG-3906.jpg",
    verified: true,
    date: "May 25, 2026",
    title: "Exceptional pure adaptogens",
    approved: true,
    location: "Ahmedabad"
  },
  {
    productId: "wantmore-men",
    name: "Sandeep Yadav",
    rating: 5,
    review: "Great quality Prash that tastes smooth and natural. I feel much less fatigued during my high-stress corporate job and have sustained energy for evening gym sessions. Highly recommend this formulation.",
    verified: true,
    date: "April 18, 2026",
    title: "Tastes extremely natural & organic",
    approved: true,
    location: "Gurugram"
  },
  {
    productId: "alphamax-men",
    name: "Rajesh Varma",
    rating: 5,
    review: "I was experiencing continuous post-work fatigue. After taking AlphaMax capsules daily for 4 weeks, my endurance has risen dramatically. I wake up fresh every single morning without feeling sluggish.",
    image: "https://i.postimg.cc/tgpD76hS/IMG-3901.jpg",
    verified: true,
    date: "June 12, 2026",
    title: "Double the power and energy!",
    approved: true,
    location: "Delhi"
  },
  {
    productId: "alphamax-men",
    name: "Amit Deshmukh",
    rating: 5,
    review: "It contains Shudh Shilajit which gives an amazing, clean energy boost throughout the day. It doesn't cause any palpitations or digestive discomfort. Highly satisfied with my purchase.",
    verified: true,
    date: "May 19, 2026",
    title: "Great everyday energy capsules",
    approved: true,
    location: "Nagpur"
  },
  {
    productId: "alphamax-men",
    name: "Nikhil Fernandes",
    rating: 5,
    review: "These capsules are stellar. My recovery after endurance cycling is incredibly fast, and I feel a distinct sharpness in my daily physical strength. Completely natural and non-habit forming.",
    verified: true,
    date: "April 25, 2026",
    title: "Best natural vitality booster",
    approved: true,
    location: "Goa"
  },
  {
    productId: "mens-combo",
    name: "Arun Nair",
    rating: 5,
    review: "This dual synergy works flawlessly. The AlphaMax capsules provide consistent cellular energy throughout the day, while the WANTMORE Prash fuels peak athletic vascular flow. My gym gains and stamina have doubled!",
    image: "https://i.postimg.cc/T1WJB3JS/IMG-3897.jpg",
    verified: true,
    date: "June 22, 2026",
    title: "The Ultimate Male Vitality Stack",
    approved: true,
    location: "Bengaluru"
  },
  {
    productId: "mens-combo",
    name: "Jaspreet Singh",
    rating: 5,
    review: "I have tried multiple supplements, but meONmode's Men's Combo is on another level. My chronic physical fatigue and brain fog are gone. I feel like I'm in my early 20s again. Clean and high quality.",
    image: "https://i.postimg.cc/zDjzRFwn/IMG-3896.jpg",
    verified: true,
    date: "June 5, 2026",
    title: "Worth every single rupee!",
    approved: true,
    location: "Chandigarh"
  },
  {
    productId: "mens-combo",
    name: "Rohit Saxena",
    rating: 5,
    review: "Excellent combination. I take the capsules with breakfast and the Prash post-workout. I have seen clear improvements in muscle mass recovery and sustained energy during long business trips. Best stack out there.",
    image: "https://i.postimg.cc/SN1zchLL/IMG-3899.jpg",
    verified: true,
    date: "May 14, 2026",
    title: "Highly energetic and powerful",
    approved: true,
    location: "Noida"
  },
  {
    productId: "mens-combo",
    name: "Dr. Vivek Chawla",
    rating: 5,
    review: "I recommend this combo stack to working professionals suffering from executive stress and fatigue. The Gokshura and Shudh Shilajit dosage is perfectly calibrated for cardiovascular health and cell vitality.",
    image: "https://i.postimg.cc/9fjB49jf/IMG-3905.jpg",
    verified: true,
    date: "April 30, 2026",
    title: "Clinically superior strength formulation",
    approved: true,
    location: "Delhi"
  },
  {
    productId: "vayucore",
    name: "Siddharth Rao",
    rating: 5,
    review: "VAYUCORE has transformed my gut health. Persistent gas and bloating after meals have disappeared within two weeks of drinking it daily. Feels very soothing and gentle.",
    image: "https://i.postimg.cc/RVtzL1wr/IMG-3898.jpg",
    verified: true,
    date: "July 2, 2026",
    title: "Relief from severe bloating & gas",
    approved: true,
    location: "Hyderabad"
  },
  {
    productId: "vayucore",
    name: "Meenakshi Kulkarni",
    rating: 5,
    review: "An outstanding Ayurvedic digestive liquid. My acidity and post-dinner heaviness are completely under control. The 450 ML bottle lasts a long time and is worth every rupee.",
    image: "https://i.postimg.cc/C5V9vXjH/image.jpg",
    verified: true,
    date: "June 28, 2026",
    title: "Exceptional gut and liver support",
    approved: true,
    location: "Pune"
  },
  {
    productId: "vayucore",
    name: "Rohan Kulkarni",
    rating: 5,
    review: "I used to suffer from hyperacidity and stomach burning every night. Drinking VAYUCORE after dinner has given me complete relief. Completely natural and easy on the stomach.",
    verified: true,
    date: "June 14, 2026",
    title: "Great natural digestive remedy",
    approved: true,
    location: "Mumbai"
  }
];

// Helper to support legacy structures during transition
export const PRODUCT_REVIEWS: Record<string, CustomerReview[]> = reviews.reduce((acc, rev) => {
  if (!acc[rev.productId]) {
    acc[rev.productId] = [];
  }
  acc[rev.productId].push(rev);
  return acc;
}, {} as Record<string, CustomerReview[]>);

export const reviewImages = [
  'https://i.postimg.cc/ZKx7s7jB/IMG-3013.jpg',
  'https://i.postimg.cc/Z5YfG8D9/IMG-3014.jpg',
  'https://i.postimg.cc/0y5tTYHw/IMG-3015.jpg',
  'https://i.postimg.cc/P5f6gWFD/IMG-3016.jpg'
];

