/**
 * Google Analytics 4 (GA4) Recommended Ecommerce Tracking Module for meONmode
 * Measurement ID: G-WPSR26Z55Q
 * 
 * Complies with Google GA4 standard ecommerce event specification:
 * - Direct dataLayer ecommerce integration for Google Tag Manager & gtag
 * - Always clears previous ecommerce object ({ ecommerce: null }) before each event push
 * - Zero PII transmitted (No names, phones, emails, or delivery addresses)
 * - Strict idempotency & deduplication for purchase & checkout funnel events
 * - Dynamic product data and categories across all individual products & combos
 */

export const GA4_MEASUREMENT_ID = 'G-WPSR26Z55Q';

export interface EcommerceItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
  item_brand?: string;
  item_category?: string;
}

export interface TrackableProduct {
  id: string;
  name: string;
  price: number;
  category?: string;
}

export interface TrackableCartItem {
  product: TrackableProduct;
  quantity: number;
}

export interface TrackableOrder {
  orderId: string;
  grandTotal: number;
  totalGst?: number;
  paymentMethod?: string;
  items: Array<{
    id?: string;
    name: string;
    price: number;
    quantity: number;
    category?: string;
  }>;
}

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Helper to dynamically assign the correct Ayurvedic product category
 */
export function getProductCategory(productIdOrName: string): string {
  const str = (productIdOrName || '').toLowerCase();
  if (str.includes('mens-combo') || (str.includes('men') && str.includes('combo'))) {
    return "Men's Combos & Kits";
  }
  if (str.includes('combo')) {
    return "Women's Combos & Kits";
  }
  if (str.includes('ovaira')) {
    return "Women's Hormonal & PCOS Care";
  }
  if (str.includes('flowelle')) {
    return "Women's Period & Uterine Wellness";
  }
  if (str.includes('alphamax') || str.includes('shilajit')) {
    return "Men's Vitality & Stamina";
  }
  if (str.includes('wantmore')) {
    return "Men's Performance & Energy";
  }
  if (str.includes('vayu')) {
    return "Digestive Wellness";
  }
  return "Ayurvedic Wellness";
}

/**
 * Universal dispatcher for Google Tag Manager & GA4 dataLayer
 * Clears previous ecommerce state to prevent parameter pollution per Google's official specification
 */
export function pushEcommerceEvent(eventName: string, ecommerceData: Record<string, any>): void {
  if (typeof window === 'undefined') return;

  try {
    window.dataLayer = window.dataLayer || [];

    // 1. Clear previous ecommerce object per Google Tag Manager GA4 recommendations
    window.dataLayer.push({ ecommerce: null });

    // 2. Push event with structured ecommerce payload
    window.dataLayer.push({
      event: eventName,
      ecommerce: ecommerceData
    });

    // 3. Direct gtag fallback if active in the browser environment
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, ecommerceData);
    }
  } catch (err) {
    // Fail-safe: analytics failure must never block consumer checkout or UI
    console.debug('[GA4 Tracking]', eventName, err);
  }
}

export function mapProductToGa4Item(product: TrackableProduct, quantity = 1): EcommerceItem {
  return {
    item_id: product.id,
    item_name: product.name,
    price: Number(product.price),
    quantity: Number(quantity),
    item_brand: 'meONmode',
    item_category: product.category || getProductCategory(product.id || product.name)
  };
}

// In-memory deduplication guards
let lastTrackedViewItemId: string | null = null;
let lastTrackedViewItemTime = 0;
let lastTrackedPaymentMethod: string | null = null;
let lastTrackedPaymentMethodTime = 0;
const trackedPurchases = new Set<string>();

/**
 * 1. view_item: Fires ONCE when a customer opens an individual product or combo page
 * Dynamic across all products and combos using real prices and IDs
 */
export function trackViewItem(product: TrackableProduct): void {
  if (!product || !product.id) return;

  const now = Date.now();
  if (lastTrackedViewItemId === product.id && now - lastTrackedViewItemTime < 1000) {
    return; // Prevent duplicate rapid firing within 1 second for the same product
  }
  lastTrackedViewItemId = product.id;
  lastTrackedViewItemTime = now;

  const item = mapProductToGa4Item(product, 1);
  pushEcommerceEvent('view_item', {
    currency: 'INR',
    value: Number(product.price),
    items: [item]
  });
}

/**
 * 2. add_to_cart: Fires ONCE only after an item is genuinely added to the cart
 */
export function trackAddToCart(product: TrackableProduct, quantity = 1): void {
  if (!product || !product.id) return;
  const qty = Number(quantity) || 1;
  const price = Number(product.price) || 0;
  const item = mapProductToGa4Item(product, qty);
  pushEcommerceEvent('add_to_cart', {
    currency: 'INR',
    value: price * qty,
    items: [item]
  });
}

/**
 * 3. view_cart: Fires when the cart drawer/view is opened with contents
 */
export function trackViewCart(cartItems: TrackableCartItem[], totalValue: number): void {
  if (!cartItems || cartItems.length === 0) return;
  const items = cartItems.map(item => mapProductToGa4Item(item.product, item.quantity));
  pushEcommerceEvent('view_cart', {
    currency: 'INR',
    value: Number(totalValue),
    items
  });
}

/**
 * 4. begin_checkout: Fires ONCE when customer initiates the checkout process
 */
export function trackBeginCheckout(cartItems: TrackableCartItem[], totalValue: number): void {
  if (!cartItems || cartItems.length === 0) return;
  const items = cartItems.map(item => mapProductToGa4Item(item.product, item.quantity));
  pushEcommerceEvent('begin_checkout', {
    currency: 'INR',
    value: Number(totalValue),
    items
  });
}

/**
 * 5. add_shipping_info: Fires when delivery address validation passes and customer advances to payment
 */
export function trackAddShippingInfo(cartItems: TrackableCartItem[], totalValue: number): void {
  if (!cartItems || cartItems.length === 0) return;
  const items = cartItems.map(item => mapProductToGa4Item(item.product, item.quantity));
  pushEcommerceEvent('add_shipping_info', {
    currency: 'INR',
    value: Number(totalValue),
    shipping_tier: 'Free Delivery Across India',
    items
  });
}

/**
 * 6. add_payment_info: Fires when customer selects/submits payment method
 */
export function trackAddPaymentInfo(
  cartItems: TrackableCartItem[],
  totalValue: number,
  paymentMethod: 'cod' | 'upi'
): void {
  if (!cartItems || cartItems.length === 0) return;

  const now = Date.now();
  if (lastTrackedPaymentMethod === paymentMethod && now - lastTrackedPaymentMethodTime < 2000) {
    return; // Don't fire duplicate within 2 seconds for identical payment selection
  }
  lastTrackedPaymentMethod = paymentMethod;
  lastTrackedPaymentMethodTime = now;

  const items = cartItems.map(item => mapProductToGa4Item(item.product, item.quantity));
  pushEcommerceEvent('add_payment_info', {
    currency: 'INR',
    value: Number(totalValue),
    payment_type: paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Prepaid UPI',
    items
  });
}

/**
 * 7. purchase: Fires ONCE only after the order is cryptographically verified and created on the backend
 * Deduplicated via sessionStorage & memory set to prevent double-counting on page refresh/re-renders
 */
export function trackPurchase(order: TrackableOrder): void {
  if (!order || !order.orderId) return;

  if (trackedPurchases.has(order.orderId)) {
    return; // In-memory deduplication
  }

  const storageKey = `meonmode_ga4_purchased_${order.orderId}`;
  try {
    if (sessionStorage.getItem(storageKey)) {
      trackedPurchases.add(order.orderId);
      return; // SessionStorage deduplication across reloads
    }
    sessionStorage.setItem(storageKey, 'true');
  } catch {
    // Non-blocking fallback
  }

  trackedPurchases.add(order.orderId);

  const items: EcommerceItem[] = (order.items || []).map(item => ({
    item_id: item.id || item.name.toLowerCase().replace(/\s+/g, '-'),
    item_name: item.name,
    price: Number(item.price),
    quantity: Number(item.quantity || 1),
    item_brand: 'meONmode',
    item_category: item.category || getProductCategory(item.id || item.name)
  }));

  pushEcommerceEvent('purchase', {
    transaction_id: order.orderId,
    value: Number(order.grandTotal),
    currency: 'INR',
    tax: Number(order.totalGst || 0),
    shipping: 0,
    payment_type: order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Prepaid UPI',
    items
  });
}
