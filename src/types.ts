export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  mrp: number;
  image: string;
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

export type ViewType = 'home' | 'detail' | 'cart' | 'success';

export interface CheckoutDetails {
  fullName: string;
  phone: string;
  address: string;
  pincode: string;
}
