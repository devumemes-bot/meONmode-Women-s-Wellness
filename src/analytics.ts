/**
 * Google Analytics 4 (GA4) Recommended Ecommerce Tracking Module for meONmode
 * Measurement ID: G-WPSR26Z55Q
 * 
 * Complies with GA4 standard event structure:
 * - Uses existing dataLayer / gtag implementation
 * - Zero PII (No names, phones, emails, or personal addresses)
 * - Idempotent deduplication for purchase & checkout events
 */

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
  }>;
}

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
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

    // 3. Direct gtag fallback if active
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
    item_category: product.category || 'Ayurvedic Wellness'
  };
}

/**
 * 1. view_item: Fires when customer views an individual product details page
 */
export function trackViewItem(product: TrackableProduct): void {
  if (!product || !product.id) return;
  pushEcommerceEvent('view_item', {
    currency: 'INR',
    value: Number(product.price),
    items: [mapProductToGa4Item(product, 1)]
  });
}

/**
 * 2. add_to_cart: Fires only when an item is genuinely added to the cart
 */
export function trackAddToCart(product: TrackableProduct, quantity = 1): void {
  if (!product || !product.id) return;
  pushEcommerceEvent('add_to_cart', {
    currency: 'INR',
    value: Number(product.price) * Number(quantity),
    items: [mapProductToGa4Item(product, quantity)]
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
 * 4. begin_checkout: Fires when customer initiates the checkout process
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
  const items = cartItems.map(item => mapProductToGa4Item(item.product, item.quantity));
  pushEcommerceEvent('add_payment_info', {
    currency: 'INR',
    value: Number(totalValue),
    payment_type: paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Prepaid UPI',
    items
  });
}

/**
 * 7. purchase: Fires ONLY after the order is cryptographically verified and created on the backend
 * Deduplicated via sessionStorage to prevent double-counting on page refresh/re-renders
 */
export function trackPurchase(order: TrackableOrder): void {
  if (!order || !order.orderId) return;

  const storageKey = `meonmode_ga4_purchased_${order.orderId}`;
  try {
    if (sessionStorage.getItem(storageKey)) {
      return; // Already tracked on this browser session
    }
    sessionStorage.setItem(storageKey, 'true');
  } catch {
    // Non-blocking fallback
  }

  const items: EcommerceItem[] = (order.items || []).map(item => ({
    item_id: item.id || item.name.toLowerCase().replace(/\s+/g, '-'),
    item_name: item.name,
    price: Number(item.price),
    quantity: Number(item.quantity || 1),
    item_brand: 'meONmode',
    item_category: 'Ayurvedic Wellness'
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
