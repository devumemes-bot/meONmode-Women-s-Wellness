import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'combo-kit',
    name: "meONmode® Combo Kit",
    subtitle: "OVAIRA Capsules + FLOWELLE Syrup",
    price: 1999,
    mrp: 3798,
    image: '1000166076.jpg',
    tag: "BEST SELLER - SAVE 47%",
    shortDescription: "The complete 30-second daily Ayurvedic ritual for everyday cycle support, hormonal balance, and painless periods.",
    longDescription: "The ultimate dual-action therapeutic kit designed by Ayurvedic gynecologists to target the root causes of PCOS, PCOD, irregular cycles, and menstrual discomfort. While OVAIRA capsules regulate LH/FSH balance and resolve ovarian cysts, FLOWELLE syrup tones uterine muscles and regularizes flow volume. Combined, they form a perfect, natural, 100% side-effect-free solution to help you regain control over your life.",
    volumeOrQty: "60 Capsules + 200ml Syrup",
    dosage: "• OVAIRA Capsule: Take 1 Capsule in the Morning and 1 Capsule in the Evening (After Meals).\n• FLOWELLE Syrup: Take 5ml in the Morning and 5ml in the Evening (After Meals).",
    benefits: [
      "Normalizes irregular cycles and balances LH/FSH levels naturally",
      "Reduces ovarian cyst size and prevents further cyst formation",
      "Significantly relieves painful cramps, bloating, and backaches",
      "Combats hormonal acne and controls excess facial hair (hirsutism)",
      "Detoxifies blood, purifies skin, and elevates everyday energy levels",
      "100% Ayurvedic, Soy-Free, Gluten-Free, and clinically tested"
    ],
    keyIngredients: [
      { name: "Shatavari", benefit: "Hormonal Balance", description: "The premier female reproductive tonic that naturally regularizes estrogen and progesterone cycles." },
      { name: "Ashoka Bark", benefit: "Uterine Health", description: "Directly tones the uterine muscles and manages heavy, irregular or painful cycles." },
      { name: "Kanchnar", benefit: "Cyst Reduction", description: "Renowned in Ayurveda for reducing lymphatic swellings and assisting in ovarian cyst management." },
      { name: "Lodhra", benefit: "Flow Regulation", description: "Maintains optimal progesterone levels to stop excess bleeding and normalizes flow volume." }
    ],
    rating: 4.9,
    reviewsCount: 14820
  },
  {
    id: 'ovaira',
    name: "meONmode® OVAIRA Capsules",
    subtitle: "PCOS/PCOD Care & Hormonal Wellness",
    price: 1199,
    mrp: 1899,
    image: 'ovaira_capsules.jpg', // can fall back or use nice graphics
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
    rating: 4.8,
    reviewsCount: 8940
  },
  {
    id: 'flowelle',
    name: "meONmode® FLOWELLE Drink",
    subtitle: "Natural Support (100% Ayurvedic, Safe & Effective)",
    price: 999,
    mrp: 1799,
    image: 'https://i.postimg.cc/hf0kMP18/Chat-GPT-Image-Jun-20-2026-10-28-00-PM.png',
    tag: "100% PAIN-FREE PERIODS",
    shortDescription: "500ml Premium Syrup to relieve painful period cramps and restore perfect cycle volume.",
    longDescription: "Formulated specifically to regulate flow, alleviate severe period pains, and purify blood. Sourced as per Bharat Pharmacopoeia standards, FLOWELLE contains highly potent standardised extracts of Ashok Chal, Shatavari, Gokhru, and Ashwagandha. It works as a direct uterine tonic to strengthen reproductive muscles, ease pelvic contractions, and solve multiple hormonal health issues naturally without side effects.",
    volumeOrQty: "500 ml",
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
    reviewsCount: 6540
  }
];

export const TESTIMONIALS = [
  {
    name: "Priyanka Sharma",
    age: 28,
    location: "Mumbai",
    rating: 5,
    title: "Cured my 2-year irregular periods!",
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
