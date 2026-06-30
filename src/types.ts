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

export type ViewType = 'home' | 'detail' | 'cart' | 'success' | 'refund-policy';

export interface CheckoutDetails {
  fullName: string;
  phone: string;
  address: string;
  pincode: string;
}
