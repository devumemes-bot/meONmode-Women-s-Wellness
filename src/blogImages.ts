/**
 * Centralized Blog and Wellness Hub Image Configuration for meONmode®
 * 
 * ONE centralized place for all blog image URLs.
 * To update an image, replace the string below with your Cloudinary URL.
 */

// Cloudinary Transformation Options
export interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: 'auto' | 'good' | 'eco' | 'low' | number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  crop?: 'fill' | 'fit' | 'limit' | 'thumb' | 'scale';
  dpr?: number | 'auto';
}

/**
 * Optimizes an image URL with Cloudinary or Unsplash parameters.
 * If the URL is Cloudinary, injects f_auto, q_auto, and specified dimensions.
 */
export function getOptimizedImageUrl(
  url: string,
  options: ImageTransformOptions = {}
): string {
  if (!url) {
    return blogImages.fallbackPlaceholder;
  }

  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'limit',
    dpr = 'auto',
  } = options;

  // 1. Cloudinary URLs
  if (url.includes('res.cloudinary.com')) {
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) return url;

    const rest = url.substring(uploadIndex + 8);
    const hasExistingTransforms = /^[a-z]_[^/]+\//.test(rest);

    const transforms: string[] = [
      `f_${format}`,
      `q_${quality}`,
      `dpr_${dpr}`,
    ];

    if (width) transforms.push(`w_${width}`);
    if (height) transforms.push(`h_${height}`);
    if (crop && (width || height)) transforms.push(`c_${crop}`);

    const transformString = transforms.join(',');

    if (hasExistingTransforms) {
      return url.replace(/\/upload\/[^/]+\//, `/upload/${transformString}/`);
    }

    return `${url.substring(0, uploadIndex + 8)}${transformString}/${rest}`;
  }

  // 2. Unsplash URLs
  if (url.includes('images.unsplash.com')) {
    try {
      const parsed = new URL(url);
      parsed.searchParams.set('auto', 'format');
      parsed.searchParams.set('q', typeof quality === 'number' ? quality.toString() : '80');
      if (width) parsed.searchParams.set('w', width.toString());
      if (height) parsed.searchParams.set('h', height.toString());
      if (crop === 'fill') parsed.searchParams.set('fit', 'crop');
      return parsed.toString();
    } catch {
      return url;
    }
  }

  return url;
}

/**
 * Centralized registry of blog image URLs.
 * Paste Cloudinary image URLs into the corresponding fields below.
 */
export const blogImages = {
  // Global fallback placeholder
  // PASTE CLOUDINARY BLOG IMAGE URL HERE
  fallbackPlaceholder:
    'https://res.cloudinary.com/ukqeabxy/image/upload/f_auto,q_auto,w_800/v1787512639/ChatGPT_Image_Jun_20_2026_10_28_24_PM.png',

  // ----------------------------------------------------
  // WANTMORE & MEN'S REJUVENATION INGREDIENTS
  // ----------------------------------------------------

  // 1. WANTMORE Ingredient Guide
  wantmoreGuide: {
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    hero: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    supporting1: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    supporting2: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80'
  },

  // 2. Swaran Bhasma in Ayurveda
  swaranBhasma: {
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    hero: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80',
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    supporting1: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'
  },

  // 3. Chandi Bhasma in Ayurveda
  chandiBhasma: {
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    hero: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    supporting1: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80'
  },

  // 4. Moti Pishti Explained
  motiPishti: {
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    hero: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    supporting1: 'https://images.unsplash.com/photo-1512290900676-26c2a4d48dc1?auto=format&fit=crop&w=800&q=80'
  },

  // 5. Salam Panja Traditional Ayurvedic Context
  salamPanja: {
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    hero: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    supporting1: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80'
  },

  // 6. Siddh Makardhwaj Traditional Context
  siddhMakardhwaj: {
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    hero: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80',
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    supporting1: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80'
  },

  // 7. Jayfal in Ayurveda
  jayfal: {
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    hero: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    supporting1: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=800&q=80'
  },

  // 8. What Is an Ayurvedic Prash?
  ayurvedicPrash: {
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    hero: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    supporting1: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80'
  },

  // ----------------------------------------------------
  // ALPHAMAX & VITALITY INGREDIENTS
  // ----------------------------------------------------

  // 9. ALPHAMAX Ingredient Guide
  alphamaxGuide: {
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    hero: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    supporting1: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    supporting2: 'https://images.unsplash.com/photo-1546842931-886c185b4c8c?auto=format&fit=crop&w=800&q=80'
  },

  // 10. Shilajit Explained
  shilajit: {
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    hero: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    supporting1: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'
  },

  // 11. Ashwagandha Explained
  ashwagandha: {
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    hero: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80',
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    supporting1: 'https://images.unsplash.com/photo-1546842931-886c185b4c8c?auto=format&fit=crop&w=800&q=80'
  },

  // 12. Safed Musli Explained
  safedMusli: {
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    hero: 'https://images.unsplash.com/photo-1546842931-886c185b4c8c?auto=format&fit=crop&w=1200&q=80',
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    supporting1: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'
  },

  // 13. Kaunch Beej Ayurvedic Guide
  kaunchBeej: {
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    hero: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    supporting1: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80'
  },

  // 14. Kesar in Ayurveda
  kesar: {
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    hero: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    supporting1: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80'
  },

  // 15. Ashwagandha vs Shilajit
  ashwagandhaVsShilajit: {
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    hero: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    supporting1: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80'
  },

  // 16. Safed Musli vs Ashwagandha
  safedMusliVsAshwagandha: {
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    hero: 'https://images.unsplash.com/photo-1546842931-886c185b4c8c?auto=format&fit=crop&w=1200&q=80',
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    supporting1: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80'
  },

  // ----------------------------------------------------
  // WOMEN'S WELLNESS & HORMONAL HEALTH
  // ----------------------------------------------------

  // 17. PCOS Kya Hai? Simple Hindi Guide
  pcosGuide: {
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    hero: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    supporting1: 'https://images.unsplash.com/photo-1512290900676-26c2a4d48dc1?auto=format&fit=crop&w=800&q=80',
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    supporting2: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80'
  },

  // 18. PCOS vs PCOD
  pcosVsPcod: {
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    hero: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    supporting1: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80'
  },

  // 19. Irregular Periods
  irregularPeriods: {
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    hero: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    supporting1: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80'
  },

  // 20. Women's Daily Hormonal Wellness Habits
  womensDailyHormonalHabits: {
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    hero: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    supporting1: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80'
  },

  // 21. Shatavari in Ayurveda
  shatavari: {
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    hero: 'https://images.unsplash.com/photo-1546842931-886c185b4c8c?auto=format&fit=crop&w=1200&q=80',
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    supporting1: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80'
  },

  // 22. Ashoka and Lodhra in Traditional Ayurveda
  ashokaLodhra: {
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    hero: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=80',
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    supporting1: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'
  },

  // 23. Menstrual Cycle Basics
  menstrualCycleBasics: {
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    hero: 'https://images.unsplash.com/photo-1512290900676-26c2a4d48dc1?auto=format&fit=crop&w=1200&q=80',
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    supporting1: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80'
  },

  // 24. Everyday Women's Wellness Routine
  everydayWomensWellnessRoutine: {
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    hero: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    supporting1: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80'
  },

  // ----------------------------------------------------
  // DIGESTIVE WELLNESS & AGNI
  // ----------------------------------------------------

  // 25. Why Digestive Wellness Matters
  whyDigestiveWellnessMatters: {
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    hero: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=1200&q=80',
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    supporting1: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80'
  },

  // 26. Understanding Bloating
  understandingBloating: {
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    hero: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=1200&q=80',
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    supporting1: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'
  },

  // 27. Everyday Habits for Digestive Comfort
  everydayHabitsDigestiveComfort: {
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    hero: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    supporting1: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=800&q=80'
  },

  // 28. Ayurvedic View of Digestion
  ayurvedicViewOfDigestion: {
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    hero: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=1200&q=80',
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    supporting1: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'
  },

  // 29. VAYUCORE Ingredient Guide
  vayucoreGuide: {
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    hero: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=1200&q=80',
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    supporting1: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    supporting2: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'
  },

  // ----------------------------------------------------
  // PRESERVED POPULAR HEALTH GUIDES
  // ----------------------------------------------------

  // White Discharge (Shwet Pradar)
  whiteDischarge: {
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    hero: 'https://images.unsplash.com/photo-1512290900676-26c2a4d48dc1?auto=format&fit=crop&w=1200&q=80',
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    supporting1: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80'
  },

  // PCOD Diet Plan Hindi
  pcodDietPlan: {
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    hero: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    supporting1: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=800&q=80'
  },

  // Kanchnar Guggul Cysts Guide
  kanchnarGuggul: {
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    hero: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    // PASTE CLOUDINARY BLOG IMAGE URL HERE
    supporting1: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80'
  },

  // Author Portraits
  authors: {
    wellnessTeam:
      'https://images.unsplash.com/photo-1594824813627-df21f45610d4?auto=format&fit=crop&w=300&q=80',
    womensHealthBoard:
      'https://images.unsplash.com/photo-1594824813627-df21f45610d4?auto=format&fit=crop&w=300&q=80',
    mensHealthDivision:
      'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80',
  },

  // Convenient aliases for article images
  digestiveWellness: {
    hero: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=1200&q=80',
    supporting1: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80'
  },
  digestiveHabits: {
    hero: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
    supporting1: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=800&q=80'
  },
  ayurvedicDigestion: {
    hero: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=1200&q=80',
    supporting1: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'
  },
  pcodDiet: {
    hero: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
    supporting1: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=800&q=80'
  },
  hormonalHabits: {
    hero: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    supporting1: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80'
  },
  cycleBasics: {
    hero: 'https://images.unsplash.com/photo-1512290900676-26c2a4d48dc1?auto=format&fit=crop&w=1200&q=80',
    supporting1: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80'
  },
  everydayRoutine: {
    hero: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    supporting1: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80'
  },

  // Ayurvedic Herbs & Botanicals (Ingredient Library)
  herbs: {
    kanchnar: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
    guggul: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
    shatavari: 'https://images.unsplash.com/photo-1546842931-886c185b4c8c?auto=format&fit=crop&w=600&q=80',
    ashoka: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
    lodhra: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    ashwagandha: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
    shilajit: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
    safedMusli: 'https://images.unsplash.com/photo-1546842931-886c185b4c8c?auto=format&fit=crop&w=600&q=80',
    kaunchBeej: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
    swaranBhasma: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
    chandiBhasma: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
    motiPishti: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
    salamPanja: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
    siddhMakardhwaj: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
    jayfal: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    kesar: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    kutki: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=600&q=80',
    kalmegh: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
    gokshura: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    haritaki: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
  },

  // Backward compatibility alias for articles mapping
  articles: {
    pcosVsPcod: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
    whiteDischarge: 'https://images.unsplash.com/photo-1512290900676-26c2a4d48dc1?auto=format&fit=crop&w=1200&q=80',
    pcodDietPlan: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
    kanchnarGuggul: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    irregularPeriods: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
    ashwagandhaShilajit: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    gutHealth: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=1200&q=80',
    hormonalImbalance: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
  }
};

// Backward-compatible named export alias
export const BLOG_IMAGES = blogImages;
