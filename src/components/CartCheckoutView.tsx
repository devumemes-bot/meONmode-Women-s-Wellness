import React from 'react';
import { 
  ShoppingBag, Sparkles, Minus, Plus, Trash2, Lock, ChevronRight, ArrowLeft 
} from 'lucide-react';
import { CartItem, CheckoutDetails, ViewType } from '../types';

interface CartCheckoutViewProps {
  cart: CartItem[];
  translatedCart: CartItem[];
  getCartTotal: () => number;
  getCartMrpTotal: () => number;
  updateQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  checkout: CheckoutDetails;
  setCheckout: React.Dispatch<React.SetStateAction<CheckoutDetails>>;
  checkoutStep: number;
  setCheckoutStep: (step: number) => void;
  paymentMethod: 'cod' | 'upi';
  setPaymentMethod: (m: 'cod' | 'upi') => void;
  codAcknowledged: boolean;
  setCodAcknowledged: (ack: boolean) => void;
  dismissedBanner: boolean;
  setDismissedBanner: (d: boolean) => void;
  isProcessingPayment: boolean;
  paymentError: string | null;
  formErrors: Partial<CheckoutDetails>;
  setFormErrors: React.Dispatch<React.SetStateAction<Partial<CheckoutDetails>>>;
  handleCheckoutFieldFocus: () => void;
  handleCheckoutSubmit: (e: React.FormEvent) => Promise<void>;
  validateForm: () => boolean;
  setCurrentView: (v: ViewType) => void;
  t: (key: string) => string;
  trackAddShippingInfo: (items: any[], total: number) => void;
  trackAddPaymentInfo: (items: any[], total: number, method: 'cod' | 'upi') => void;
  trackBeginCheckout: (items: any[], total: number) => void;
  hasTrackedBeginCheckoutRef: React.MutableRefObject<boolean>;
}

export const CartCheckoutView: React.FC<CartCheckoutViewProps> = ({
  cart,
  translatedCart,
  getCartTotal,
  getCartMrpTotal,
  updateQuantity,
  removeFromCart,
  checkout,
  setCheckout,
  checkoutStep,
  setCheckoutStep,
  paymentMethod,
  setPaymentMethod,
  codAcknowledged,
  setCodAcknowledged,
  dismissedBanner,
  setDismissedBanner,
  isProcessingPayment,
  paymentError,
  formErrors,
  setFormErrors,
  handleCheckoutFieldFocus,
  handleCheckoutSubmit,
  validateForm,
  setCurrentView,
  t,
  trackAddShippingInfo,
  trackAddPaymentInfo,
  trackBeginCheckout,
  hasTrackedBeginCheckoutRef
}) => {
  return (
    <div className="space-y-8">
      <h2 className="font-serif text-3xl font-extrabold text-white text-center md:text-left">
        Your Wellness Cart & Secured Checkout
      </h2>
      
      {cart.length === 0 ? (
        /* Empty Cart State */
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center space-y-6 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-[#C86428]/10 text-[#E5A93C] rounded-full flex items-center justify-center mx-auto border border-[#C86428]/30">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-xl font-bold text-white">Your Cart is Empty</h3>
            <p className="text-xs text-[#F7E7D9]/80 max-w-sm mx-auto leading-relaxed">
              Choose from our high-converting clinically balanced meONmode formulas to reset your monthly cycle health.
            </p>
          </div>
          <button 
            onClick={() => setCurrentView('home')}
            className="bg-gradient-to-r from-[#C86428] to-[#E5A93C] text-white font-extrabold text-sm py-3 px-6 rounded-xl shadow-md cursor-pointer"
          >
            Browse Wellness Protocols
          </button>
        </div>
      ) : (
        /* Active Cart and Checkout Form Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Side: Cart Items list */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Loyalty Reward Progress Bar Box */}
            {(() => {
              const total = getCartTotal();
              const threshold = 2500;
              const remaining = Math.max(0, threshold - total);
              const percent = Math.min(100, Math.round((total / threshold) * 100));
              
              return (
                <div className="bg-gradient-to-br from-[#4A1D05]/80 to-[#5C1D13]/60 border border-[#E5A93C]/20 rounded-2xl p-4 shadow-xl space-y-3 sticky top-4 z-10 backdrop-blur-md">
                  <div className="flex items-center gap-2 text-white">
                    <Sparkles className="w-4.5 h-4.5 text-[#E5A93C] animate-pulse shrink-0" />
                    <span className="font-serif text-xs font-bold uppercase tracking-wider text-[#E5A93C]">Loyalty Reward Tracker</span>
                  </div>
                  
                  {remaining > 0 ? (
                    <p className="text-xs text-[#F7E7D9] leading-relaxed">
                      Spend <span className="font-black text-amber-300">₹{remaining.toLocaleString('en-IN')}</span> more to unlock <span className="font-bold text-emerald-300 underline">Free Ayurvedic Samples</span> in your shipment!
                    </p>
                  ) : (
                    <p className="text-xs text-emerald-400 font-bold leading-relaxed flex items-center gap-1.5 animate-pulse">
                      🎉 Loyalty Reward Unlocked! Free Ayurvedic samples have been added to your package.
                    </p>
                  )}
                  
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono text-neutral-300">
                      <span>Progress: {percent}%</span>
                      <span>₹{total.toLocaleString('en-IN')} / ₹{threshold.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="w-full h-3 bg-neutral-900/60 rounded-full border border-white/5 overflow-hidden p-0.5">
                      <div 
                        className={`h-full rounded-full transition-all duration-700 ease-out ${
                          remaining > 0 
                            ? 'bg-gradient-to-r from-[#C86428] to-[#E5A93C] shadow-[0_0_8px_rgba(229,169,60,0.5)]' 
                            : 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.7)]'
                        }`} 
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })()}

            <h3 className="font-serif text-lg font-bold text-white">Order Summary</h3>
            
            <div className="space-y-3">
              {translatedCart.map((item) => (
                <div 
                  key={item.product.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4 justify-between items-center"
                >
                  <div className="flex-grow space-y-1">
                    <h4 className="font-serif font-bold text-sm text-white line-clamp-1">{item.product.name}</h4>
                    <p className="text-[10px] text-[#E5A93C] font-semibold">{item.product.volumeOrQty}</p>
                    <p 
                      className="text-xs font-black text-white pt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                      style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)' }}
                    >
                      ₹{item.product.price.toLocaleString('en-IN')} each
                    </p>
                  </div>

                  {/* Quantity Modifier */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center bg-[#4A1D05]/60 rounded-xl border border-white/10 px-1 py-1">
                      <button 
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="p-1 text-white hover:text-[#E5A93C] cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 text-xs font-bold text-white w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="p-1 text-white hover:text-[#E5A93C] cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/10 transition-colors cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* FREE Diet Plan Cart Item Banner */}
            <div className="bg-gradient-to-r from-[#FAF6F0]/10 to-[#E5A93C]/10 border border-[#E5A93C]/30 rounded-2xl p-3.5 flex gap-3 items-center">
              <div className="w-8 h-8 rounded-xl bg-[#E5A93C]/20 border border-[#E5A93C]/30 flex items-center justify-center shrink-0 text-base">
                🥗
              </div>
              <div className="flex-grow space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-black uppercase tracking-wider bg-[#E5A93C] text-[#23120B] px-1.5 py-0.2 rounded font-mono">
                    FREE BONUS
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">Auto-Included</span>
                </div>
                <h4 className="font-serif font-bold text-xs text-white">FREE Personalized Diet Plan based on your body type and weight</h4>
                <p className="text-[10px] text-[#F7E7D9]/80">Formulated around your body weight & Ayurvedic doshas.</p>
              </div>
              <span className="text-xs font-black text-emerald-400 shrink-0">₹0 (FREE)</span>
            </div>

            {/* Price Calculations breakdown */}
            {(() => {
              const totalBill = getCartTotal();
              const taxableValue = Math.round((totalBill / 1.05) * 100) / 100;
              const totalGst = Math.round((totalBill - taxableValue) * 100) / 100;
              const cgst = Math.round((totalGst / 2) * 100) / 100;
              const sgst = Math.round((totalGst / 2) * 100) / 100;

              return (
                <div className="bg-[#4A1D05]/50 border border-white/10 rounded-2xl p-5 space-y-3 text-xs">
                  <div className="flex justify-between text-[#F7E7D9]/80 font-semibold drop-shadow-sm">
                    <span>{t('originalPriceMrp')}</span>
                    <span className="line-through text-white font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>₹{getCartMrpTotal().toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-white font-extrabold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                    <span>{t('herbalDiscountSavings')}</span>
                    <span>-₹{(getCartMrpTotal() - totalBill).toLocaleString('en-IN')}</span>
                  </div>

                  <div className="border-t border-white/10 my-2"></div>

                  <div className="flex justify-between text-[#F7E7D9]/80 font-semibold drop-shadow-sm">
                    <span>{t('subtotal')} ({t('priceInclusiveOfGst')})</span>
                    <span className="text-white font-bold" style={{ textShadow: '0 1.5px 3px rgba(0,0,0,0.8)' }}>₹{totalBill.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between text-[#F7E7D9]/80 font-semibold drop-shadow-sm">
                    <span>{t('delivery')}</span>
                    <span className="text-emerald-400 font-bold uppercase tracking-wider">{t('freeDelivery')}</span>
                  </div>

                  <div className="border-t border-dashed border-white/10 my-2"></div>

                  <div className="flex justify-between text-[#F7E7D9]/70 text-[11px]">
                    <span>{t('taxableValueLabel')}</span>
                    <span className="text-neutral-300 font-medium">₹{taxableValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-[#F7E7D9]/70 text-[11px]">
                    <span>{t('cgstLabel')}</span>
                    <span className="text-neutral-300 font-medium">₹{cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-[#F7E7D9]/70 text-[11px]">
                    <span>{t('sgstLabel')}</span>
                    <span className="text-neutral-300 font-medium">₹{sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-[#F7E7D9]/80 font-semibold text-[11px]">
                    <span>{t('totalGstLabel')}</span>
                    <span className="text-white font-bold">₹{totalGst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  
                  <div className="border-t border-white/10 pt-3 space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="font-serif text-sm font-bold text-white drop-shadow-md">{t('totalProductBill')}</span>
                      <span 
                        className="font-serif text-lg font-black text-white"
                        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                      >
                        ₹{totalBill.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {paymentMethod === 'cod' ? (
                      <>
                        <div className="flex justify-between items-baseline text-xs text-amber-300 font-extrabold">
                          <span>{t('codAdvanceLabel')}</span>
                          <span>-₹150</span>
                        </div>
                        <div className="flex justify-between items-baseline text-sm text-emerald-400 font-extrabold border-t border-dashed border-white/10 pt-1">
                          <span>{t('balanceDueLabel')}</span>
                          <span>₹{(totalBill - 150).toLocaleString('en-IN')}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between items-baseline text-xs text-emerald-400 font-extrabold">
                        <span>{t('paidInFullLabel')}</span>
                        <span>₹{totalBill.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Packaging Guarantee Box */}
            <div className="p-4 bg-[#5C1D13] border border-[#E5A93C]/20 rounded-2xl flex gap-3 items-start">
              <Lock className="w-5 h-5 text-[#E5A93C] shrink-0 mt-0.5 animate-pulse" />
              <div>
                <h4 className="font-serif text-sm font-bold text-white">Absolute Privacy Guaranteed</h4>
                <p className="text-[11px] text-[#F7E7D9]/90 leading-normal mt-0.5">
                  We send your order in a 100% blank corrugated box with no labels, references to period health or meONmode branding. Handled with absolute secrecy.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Checkout Form (Integrated WhatsApp functionality) */}
          <div className="lg:col-span-7">
            <div className="bg-[#FDFEFE] text-neutral-900 rounded-3xl p-6 md:p-8 shadow-2xl border border-amber-light">
              <div className="space-y-1.5 border-b border-neutral-100 pb-4 mb-6">
                <h3 className="font-serif text-xl font-bold text-[#4A1D05]">
                  {checkoutStep === 1 ? "Step 1: Fill Delivery Details" : "Step 2: Choose Payment Method"}
                </h3>
                <p className="text-xs text-neutral-500">
                  {checkoutStep === 1 
                    ? "Provide shipping details to book your parcel with 100% discreet packaging." 
                    : "Select how you would like to complete your wellness order."}
                </p>
              </div>

              <form onSubmit={handleCheckoutSubmit} className="space-y-5">
                {checkoutStep === 1 ? (
                  <>
                    {/* Name input */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#4A1D05] uppercase tracking-wider">
                        Full Name *
                      </label>
                      <input 
                        type="text"
                        placeholder="Enter your full name"
                        value={checkout.fullName}
                        onFocus={handleCheckoutFieldFocus}
                        onChange={(e) => {
                          setCheckout({ ...checkout, fullName: e.target.value });
                          if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: '' });
                        }}
                        className={`w-full text-sm bg-neutral-50 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#C86428] ${
                          formErrors.fullName ? 'border-red-500 bg-red-50/50' : 'border-neutral-200'
                        }`}
                      />
                      {formErrors.fullName && (
                        <span className="text-[11px] text-red-500 font-semibold">{formErrors.fullName}</span>
                      )}
                    </div>

                    {/* Phone input */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#4A1D05] uppercase tracking-wider">
                        Active Mobile Number (WhatsApp Compatible) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-3 text-neutral-400 font-semibold text-sm">+91</span>
                        <input 
                          type="tel"
                          maxLength={10}
                          placeholder="Enter 10-digit mobile number"
                          value={checkout.phone}
                          onFocus={handleCheckoutFieldFocus}
                          onChange={(e) => {
                            const cleaned = e.target.value.replace(/\D/g, '');
                            setCheckout({ ...checkout, phone: cleaned });
                            if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' });
                          }}
                          className={`w-full text-sm bg-neutral-50 pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#C86428] ${
                            formErrors.phone ? 'border-red-500 bg-red-50/50' : 'border-neutral-200'
                          }`}
                        />
                      </div>
                      {formErrors.phone ? (
                        <span className="text-[11px] text-red-500 font-semibold block">{formErrors.phone}</span>
                      ) : (
                        <span className="text-[10px] text-neutral-400 block pl-1">Important: Our courier team calls on this number to confirm dispatch before shipping.</span>
                      )}
                    </div>

                    {/* Address Input */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#4A1D05] uppercase tracking-wider">
                        Complete Shipping Address *
                      </label>
                      <textarea 
                        rows={3}
                        placeholder="House No, Building, Street, Landmark, Village, City, State"
                        value={checkout.address}
                        onFocus={handleCheckoutFieldFocus}
                        onChange={(e) => {
                          setCheckout({ ...checkout, address: e.target.value });
                          if (formErrors.address) setFormErrors({ ...formErrors, address: '' });
                        }}
                        className={`w-full text-sm bg-neutral-50 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#C86428] ${
                          formErrors.address ? 'border-red-500 bg-red-50/50' : 'border-neutral-200'
                        }`}
                      />
                      {formErrors.address && (
                        <span className="text-[11px] text-red-500 font-semibold">{formErrors.address}</span>
                      )}
                    </div>

                    {/* Pincode Input */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#4A1D05] uppercase tracking-wider">
                        Pincode *
                      </label>
                      <input 
                        type="text"
                        maxLength={6}
                        placeholder="Enter 6-digit Pincode"
                        value={checkout.pincode}
                        onFocus={handleCheckoutFieldFocus}
                        onChange={(e) => {
                          const cleaned = e.target.value.replace(/\D/g, '');
                          setCheckout({ ...checkout, pincode: cleaned });
                          if (formErrors.pincode) setFormErrors({ ...formErrors, pincode: '' });
                        }}
                        className={`w-full text-sm bg-neutral-50 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#C86428] ${
                          formErrors.pincode ? 'border-red-500 bg-red-50/50' : 'border-neutral-200'
                        }`}
                      />
                      {formErrors.pincode && (
                        <span className="text-[11px] text-red-500 font-semibold">{formErrors.pincode}</span>
                      )}
                    </div>

                    {/* Action trigger button */}
                    <div className="pt-4 border-t border-neutral-100">
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          if (validateForm()) {
                            if (!hasTrackedBeginCheckoutRef.current && cart.length > 0) {
                              hasTrackedBeginCheckoutRef.current = true;
                              trackBeginCheckout(cart, getCartTotal());
                            }
                            trackAddShippingInfo(cart, getCartTotal());
                            setCheckoutStep(2);
                          }
                        }}
                        className="w-full bg-[#C86428] hover:bg-[#8B3B15] text-white font-extrabold text-base py-4 rounded-xl flex items-center justify-center gap-2.5 transition-all hover:shadow-[0_0_15px_rgba(200,100,40,0.5)] shadow-lg active:scale-95 duration-200 cursor-pointer"
                      >
                        <span>Proceed to Payment</span>
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      
                      <span className="block text-center text-[10px] text-[#C86428] font-bold mt-2.5">
                        *Provide details first. Cash on Delivery requires a ₹150 advance to confirm order.
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Shipping Details Summary */}
                    <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4 space-y-2 relative">
                      <button
                        type="button"
                        onClick={() => setCheckoutStep(1)}
                        className="absolute top-4 right-4 text-xs font-bold text-[#C86428] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowLeft className="w-3 h-3" /> Edit
                      </button>
                      <h4 className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider">Shipping Destination</h4>
                      <div className="text-sm font-semibold text-[#4A1D05]">{checkout.fullName}</div>
                      <div className="text-xs text-neutral-600 font-medium">+91 {checkout.phone}</div>
                      <div className="text-xs text-neutral-500 leading-relaxed max-w-[85%]">{checkout.address}, {checkout.pincode}</div>
                    </div>

                    {/* Incentive Text */}
                    <div className="bg-amber-50 border border-amber-200/60 p-4 rounded-2xl flex items-start gap-2.5 text-xs text-neutral-800 shadow-sm mb-4">
                      <span className="text-sm">💡</span>
                      <p className="leading-relaxed font-medium">
                        To prevent fraud, a <strong className="text-red-700 font-extrabold">₹150 advance payment is mandatory</strong> for all Cash on Delivery (COD) orders. This ₹150 will be fully deducted from your bill upon delivery.
                      </p>
                    </div>

                    {/* Select Payment Method */}
                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-[#4A1D05] uppercase tracking-wider">
                        Select Payment Method *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* COD Option */}
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentMethod('cod');
                            trackAddPaymentInfo(cart, getCartTotal(), 'cod');
                          }}
                          className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                            paymentMethod === 'cod'
                              ? 'border-[#C86428] bg-[#C86428]/5 ring-2 ring-[#C86428]'
                              : 'border-neutral-200 bg-white hover:bg-neutral-50'
                          }`}
                        >
                          <div className={`p-2 rounded-xl mt-0.5 ${paymentMethod === 'cod' ? 'bg-[#C86428]/10 text-[#C86428]' : 'bg-neutral-100 text-neutral-500'}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <div>
                            <span className="block text-sm font-bold text-[#4A1D05]">Cash on Delivery (COD)</span>
                            <span className="block text-[10px] text-neutral-500 mt-0.5">Pay balance upon delivery</span>
                          </div>
                        </button>

                        {/* UPI Option */}
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentMethod('upi');
                            trackAddPaymentInfo(cart, getCartTotal(), 'upi');
                          }}
                          className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                            paymentMethod === 'upi'
                              ? 'border-[#C86428] bg-[#C86428]/5 ring-2 ring-[#C86428]'
                              : 'border-neutral-200 bg-white hover:bg-neutral-50'
                          }`}
                        >
                          <div className={`p-2 rounded-xl mt-0.5 ${paymentMethod === 'upi' ? 'bg-[#C86428]/10 text-[#C86428]' : 'bg-neutral-100 text-neutral-500'}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h2M4 8h16M4 16h16" />
                            </svg>
                          </div>
                          <div>
                            <span className="block text-sm font-bold text-[#4A1D05]">Prepaid UPI</span>
                            <span className="block text-[10px] text-neutral-500 mt-0.5">Pay 100% full amount now</span>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Dynamic UPI Details & QR Code display */}
                    <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-5 flex flex-col items-center text-center space-y-4 animate-fade-in">
                      {paymentMethod === 'cod' && (
                        <div className="w-full bg-red-50 border-2 border-red-200 p-4 rounded-xl text-left text-neutral-800 space-y-2 mb-2">
                          <h4 className="font-extrabold text-xs text-red-700 uppercase tracking-wider flex items-center gap-1.5">
                            <span>⚠️</span>
                            <span>Mandatory COD Rule</span>
                          </h4>
                          <p className="text-[11px] leading-relaxed font-semibold">
                            To confirm your COD order, an advance payment of ₹150 is mandatory. This ₹150 will be deducted from your product's total bill amount at delivery. Your order will only be processed after the ₹150 advance is successfully paid.
                          </p>
                          <label className="flex items-center gap-2 pt-1 pb-1 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={codAcknowledged}
                              onChange={(e) => setCodAcknowledged(e.target.checked)}
                              className="w-4 h-4 text-emerald-600 border-neutral-300 rounded focus:ring-emerald-500 cursor-pointer"
                            />
                            <span className="text-[11px] font-bold text-neutral-900 leading-tight">
                              I accept and have paid the ₹150 advance.
                            </span>
                          </label>
                        </div>
                      )}

                      <span className="text-[10px] uppercase font-bold text-[#E5A93C] bg-amber-950 px-3 py-1 rounded-full tracking-widest font-mono">
                        {paymentMethod === 'cod' ? "Pay ₹150 Advance to Confirm" : `Pay Full Amount ₹${getCartTotal().toLocaleString('en-IN')}`}
                      </span>

                      <div className="bg-white p-3 rounded-2xl shadow-md border border-neutral-100 relative">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                            `upi://pay?pa=9350302092m@pnb&pn=MEONMODE ENTERPRISES&am=${paymentMethod === 'cod' ? '150' : getCartTotal()}&cu=INR`
                          )}`} 
                          alt="meONmode UPI QR Code" 
                          loading="lazy"
                          decoding="async"
                          width="192"
                          height="192"
                          className="w-48 h-48 block object-contain"
                        />
                        <div className="absolute inset-0 border border-black/5 rounded-2xl pointer-events-none"></div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">UPI Merchant</span>
                        <div className="text-sm font-extrabold text-[#4A1D05]">MEONMODE ENTERPRISES</div>
                        <div className="text-xs bg-white border border-neutral-200 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 font-mono text-neutral-700 font-semibold mt-1">
                          <span>9350302092m@pnb</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText('9350302092m@pnb');
                              alert('UPI ID copied to clipboard!');
                            }}
                            className="text-[#C86428] hover:text-[#8B3B15] font-sans text-[10px] font-bold uppercase ml-1 border-l pl-1.5 border-neutral-200 cursor-pointer"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                      <div className="text-[11px] text-neutral-500 leading-normal max-w-sm">
                        {paymentMethod === 'cod' 
                          ? "Scan to pay the ₹150 COD Advance via GPay, PhonePe, Paytm, or BHIM. Your order will be confirmed instantly."
                          : `Scan to pay the full product bill of ₹${getCartTotal().toLocaleString('en-IN')} via any UPI app.`}
                      </div>
                    </div>

                    {/* Action trigger button */}
                    <div className="pt-4 border-t border-neutral-100 space-y-4">
                      {!dismissedBanner && (
                        <div className="bg-amber-50 border-l-4 border-amber-500 p-3.5 rounded-r-xl flex items-start gap-2.5 text-xs text-neutral-700 animate-fade-in relative shadow-sm">
                          <span className="shrink-0 text-base">📦</span>
                          <div className="flex-grow pr-6 leading-relaxed font-medium">
                            Please record an unboxing video when your order arrives — required for any return/refund claims.{' '}
                            <button 
                              type="button" 
                              onClick={() => setCurrentView('refund-policy')} 
                              className="text-[#C86428] font-extrabold hover:underline cursor-pointer"
                            >
                              [Read Return Policy]
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => setDismissedBanner(true)}
                            className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-600 font-extrabold text-xs cursor-pointer"
                            aria-label="Dismiss banner"
                          >
                            ✕
                          </button>
                        </div>
                      )}

                      {/* Payment Error Banner */}
                      {paymentError && (
                        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 text-left text-xs text-red-900 space-y-1 animate-bounce">
                          <div className="font-extrabold flex items-center gap-1.5 text-red-700 text-sm">
                            <span>⚠️</span>
                            <span>Payment Verification Failure</span>
                          </div>
                          <p className="font-semibold text-red-800 leading-relaxed">{paymentError}</p>
                          <p className="text-[11px] text-red-600 font-bold pt-1">
                            Your order was NOT confirmed. Please complete the ₹150 advance / prepaid payment to process your order.
                          </p>
                        </div>
                      )}

                      <button 
                        id="pay-confirm-btn"
                        type="submit"
                        disabled={isProcessingPayment}
                        className="w-full bg-[#C86428] hover:bg-[#A8521F] disabled:bg-neutral-400 text-white font-extrabold text-base py-4 rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-lg active:scale-95 duration-200 cursor-pointer"
                      >
                        {isProcessingPayment ? (
                          <>
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            <span>Securing Payment & Verifying with Server...</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-5 h-5" />
                            <span>
                              {paymentMethod === 'cod' 
                                ? "PAY ₹150 ADVANCE TO CONFIRM ORDER" 
                                : `PAY FULL AMOUNT ₹${getCartTotal().toLocaleString('en-IN')} TO CONFIRM`}
                            </span>
                          </>
                        )}
                      </button>
                      
                      <span className="block text-center text-[10px] text-neutral-500 font-semibold mt-2.5">
                        🔒 256-bit Bank Encrypted Gateway. Orders are confirmed strictly upon verified payment.
                      </span>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
