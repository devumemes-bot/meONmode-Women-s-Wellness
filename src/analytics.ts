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
export const META_PIXEL_ID = '1110041358399519';

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
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

/**
 * Sanitized product category mapping for Meta Pixel.
 * Adheres strictly to Meta's Health and Wellness policy:
 * NEVER transmits medical conditions, diagnoses, or symptoms (e.g., PCOS, hormonal disorder, uterine issue).
 */
export function getSanitizedMetaCategory(productIdOrName: string): string {
  const str = (productIdOrName || '').toLowerCase();
  if (str.includes('mens-combo') || (str.includes('men') && str.includes('combo'))) {
    return "Men's Wellness Combos";
  }
  if (str.includes('combo')) {
    return "Women's Wellness Combos";
  }
  if (str.includes('ovaira') || str.includes('flowelle')) {
    return "Women's Wellness";
  }
  if (str.includes('alphamax') || str.includes('wantmore') || str.includes('shilajit')) {
    return "Men's Wellness";
  }
  if (str.includes('vayu')) {
    return "Digestive Wellness";
  }
  return "Ayurvedic Wellness";
}

/**
 * Safe dispatcher for Meta Pixel (fbq) tracking calls.
 * Protects against missing window.fbq, ensures non-blocking error handling,
 * and safeguards against transmitting personal identifying customer information (zero PII).
 */
export function trackMetaEvent(eventName: string, params?: Record<string, any>): void {
  if (typeof window === 'undefined') return;

  try {
    if (typeof window.fbq === 'function') {
      if (params) {
        window.fbq('track', eventName, params);
      } else {
        window.fbq('track', eventName);
      }
    }
  } catch (err) {
    console.debug('[Meta Pixel Tracking]', eventName, err);
  }
}

let lastTrackedPagePath: string | null = null;
let lastTrackedPageTime = 0;

/**
 * PageView tracking for Meta Pixel and GA4/GTM in React SPA.
 * Deduplicates rapid re-renders and pathname changes within 400ms to guarantee exactly one event.
 */
export function trackPageView(path?: string): void {
  if (typeof window === 'undefined') return;

  const currentPath = path || window.location.pathname || '/';
  const now = Date.now();

  if (lastTrackedPagePath === currentPath && now - lastTrackedPageTime < 400) {
    return;
  }
  lastTrackedPagePath = currentPath;
  lastTrackedPageTime = now;

  // 1. Meta Pixel PageView
  trackMetaEvent('PageView');

  // 2. Google Tag Manager / GA4 dataLayer page_view
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'page_view',
      page_path: currentPath,
      page_location: window.location.href
    });
  } catch {
    // Non-blocking fallback
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
 * 1. view_item & ViewContent: Fires ONCE when a customer opens an individual product or combo page
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

  // GA4 Ecommerce view_item
  const item = mapProductToGa4Item(product, 1);
  pushEcommerceEvent('view_item', {
    currency: 'INR',
    value: Number(product.price),
    items: [item]
  });

  // Meta Pixel ViewContent
  trackMetaEvent('ViewContent', {
    content_name: product.name,
    content_category: getSanitizedMetaCategory(product.id || product.name),
    content_ids: [product.id],
    content_type: 'product',
    value: Number(product.price),
    currency: 'INR'
  });
}

/**
 * 2. add_to_cart & AddToCart: Fires ONCE only after an item is genuinely added to the cart
 */
export function trackAddToCart(product: TrackableProduct, quantity = 1): void {
  if (!product || !product.id) return;
  const qty = Number(quantity) || 1;
  const price = Number(product.price) || 0;
  const item = mapProductToGa4Item(product, qty);

  // GA4 Ecommerce add_to_cart
  pushEcommerceEvent('add_to_cart', {
    currency: 'INR',
    value: price * qty,
    items: [item]
  });

  // Meta Pixel AddToCart
  trackMetaEvent('AddToCart', {
    content_name: product.name,
    content_category: getSanitizedMetaCategory(product.id || product.name),
    content_ids: [product.id],
    content_type: 'product',
    value: price * qty,
    currency: 'INR'
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
 * 4. begin_checkout & InitiateCheckout: Fires ONCE when customer initiates the checkout process
 */
export function trackBeginCheckout(cartItems: TrackableCartItem[], totalValue: number): void {
  if (!cartItems || cartItems.length === 0) return;
  const items = cartItems.map(item => mapProductToGa4Item(item.product, item.quantity));

  // GA4 Ecommerce begin_checkout
  pushEcommerceEvent('begin_checkout', {
    currency: 'INR',
    value: Number(totalValue),
    items
  });

  // Meta Pixel InitiateCheckout
  const metaContentIds = cartItems.map(ci => ci.product.id);
  const metaContents = cartItems.map(ci => ({
    id: ci.product.id,
    quantity: ci.quantity,
    item_price: Number(ci.product.price)
  }));
  const totalNumItems = cartItems.reduce((acc, ci) => acc + (ci.quantity || 1), 0);

  trackMetaEvent('InitiateCheckout', {
    content_ids: metaContentIds,
    contents: metaContents,
    content_type: 'product',
    num_items: totalNumItems,
    value: Number(totalValue),
    currency: 'INR'
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

  // GA4 Ecommerce purchase
  pushEcommerceEvent('purchase', {
    transaction_id: order.orderId,
    value: Number(order.grandTotal),
    currency: 'INR',
    tax: Number(order.totalGst || 0),
    shipping: 0,
    payment_type: order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Prepaid UPI',
    items
  });

  // Meta Pixel Purchase (Sanitized, confirmed orders only, zero PII, zero medical claims)
  const metaOrderContentIds = (order.items || []).map(item => item.id || item.name.toLowerCase().replace(/\s+/g, '-'));
  const metaOrderContents = (order.items || []).map(item => ({
    id: item.id || item.name.toLowerCase().replace(/\s+/g, '-'),
    quantity: Number(item.quantity || 1),
    item_price: Number(item.price)
  }));
  const metaOrderNumItems = (order.items || []).reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);

  trackMetaEvent('Purchase', {
    content_ids: metaOrderContentIds,
    contents: metaOrderContents,
    content_type: 'product',
    num_items: metaOrderNumItems,
    value: Number(order.grandTotal),
    currency: 'INR',
    order_id: order.orderId
  });
}
