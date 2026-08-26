export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  mrp: number;
  images: string[];
  tag?: string;
  shortDescription: string;
  longDescription: string;
  benefits: string[];
  keyIngredients: { name: string; benefit: string; description: string }[];
  dosage: string;
  volumeOrQty: string;
  rating: number;
  reviewsCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type ViewType = 
  | 'home' 
  | 'detail' 
  | 'cart' 
  | 'success' 
  | 'refund-policy' 
  | 'shipping-policy' 
  | 'privacy-policy' 
  | 'terms-and-conditions' 
  | 'about' 
  | 'contact' 
  | 'track-order' 
  | 'order-history' 
  | 'blog' 
  | 'blog-article'
  | 'not-found';

export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  category: "Women's Health" | "Men's Health" | "Diet & Nutrition" | "Ayurvedic Herbs";
  author: string;
  datePublished: string;
  readTime: string;
  wordCount: number;
  targetKeyword: string;
  relatedProductId: string;
  featuredImage: string;
  excerpt: string;
  tags: string[];
  metaDescription: string;
  tableOfContents: { id: string; text: string }[];
  contentSections: {
    id: string;
    title: string;
    paragraphs?: string[];
    subSections?: { title: string; paragraphs: string[] }[];
    bullets?: string[];
    tipBox?: { title: string; text: string };
    warningBox?: { title: string; text: string };
    researchBox?: { title: string; text: string };
    productMention?: { productId: string; highlightReason: string };
    table?: { headers: string[]; rows: string[][] };
  }[];
  faqs: { question: string; answer: string }[];
  relatedSlugs: string[];
}

export interface CheckoutDetails {
  fullName: string;
  phone: string;
  address: string;
  pincode: string;
}
