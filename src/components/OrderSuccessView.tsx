import React, { useState } from 'react';
import { ShieldCheck, Check, Clipboard, Send, Lock } from 'lucide-react';
import { CheckoutDetails, CartItem, ViewType } from '../types';

interface OrderSuccessViewProps {
  lastVerifiedOrder: any;
  lastOrderId: string | null;
  paymentMethod: string;
  checkout: CheckoutDetails;
  translatedCart: CartItem[];
  getCartTotal: () => number;
  triggerWhatsAppConfirmation: () => void;
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  setCurrentView: (v: ViewType) => void;
  setShowToast: (msg: string | null) => void;
  t: (key: string) => string;
}

export const OrderSuccessView: React.FC<OrderSuccessViewProps> = ({
  lastVerifiedOrder,
  lastOrderId,
  paymentMethod,
  checkout,
  translatedCart,
  getCartTotal,
  triggerWhatsAppConfirmation,
  setCart,
  setCurrentView,
  setShowToast,
  t
}) => {
  const [showInvoice, setShowInvoice] = useState(false);

  return (
    <div className="max-w-xl mx-auto space-y-6 text-center py-10">
      {/* Big Green/Gold Confirmation Badge */}
      <div className="relative inline-flex items-center justify-center">
        <div className="absolute inset-0 bg-emerald-500/25 rounded-full blur-xl scale-125 animate-pulse"></div>
        <div className="w-24 h-24 bg-[#E5A93C]/10 border-4 border-[#E5A93C] text-[#E5A93C] rounded-full flex items-center justify-center relative z-10 animate-bounce">
          <Check className="w-12 h-12 stroke-[3.5]" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-extrabold uppercase tracking-widest font-mono">
          <ShieldCheck className="w-4 h-4" />
          <span>SERVER PAYMENT VERIFIED</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-white">Order Confirmed & Verified!</h1>
        <p className="text-[#E5A93C] font-serif text-base font-bold italic">"Your wellness journey has officially begun."</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 text-sm text-left">
        <p className="text-white/90 leading-relaxed text-xs md:text-sm">
          Your payment has been cryptographically verified on our backend server. Your order is registered for priority dispatch.
        </p>

        {/* Verified Order & Payment Token Card */}
        {lastVerifiedOrder && (
          <div className="p-4 bg-emerald-950/40 border-2 border-emerald-500/50 rounded-xl space-y-2 text-xs text-white">
            <div className="flex justify-between items-center border-b border-emerald-500/20 pb-2">
              <span className="text-emerald-300 font-bold">Verified Order ID:</span>
              <span className="font-mono font-black text-[#E5A93C] text-sm bg-black/60 px-2.5 py-1 rounded border border-white/10 flex items-center gap-1.5">
                {lastVerifiedOrder.orderId}
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(lastVerifiedOrder.orderId);
                    setShowToast("Order ID copied!");
                    setTimeout(() => setShowToast(null), 3000);
                  }}
                  className="text-white/60 hover:text-white transition-colors cursor-pointer p-0.5"
                  title="Copy Order ID"
                >
                  <Clipboard className="w-3.5 h-3.5" />
                </button>
              </span>
            </div>
            <div className="flex justify-between items-center pt-1 text-[11px]">
              <span className="text-neutral-400">Payment Ref / Txn ID:</span>
              <span className="font-mono font-bold text-emerald-400">{lastVerifiedOrder.paymentId}</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-neutral-400">Payment Verification Status:</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED SUCCESS
              </span>
            </div>
          </div>
        )}

        {/* Pass to WhatsApp Dispatch Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={triggerWhatsAppConfirmation}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-4 rounded-xl flex items-center justify-center gap-2.5 shadow-xl hover:shadow-emerald-900/50 transition-all cursor-pointer"
          >
            <Send className="w-5 h-5" />
            <span>📱 Pass Verified Order to WhatsApp Desk for Dispatch</span>
          </button>
          <span className="block text-center text-[10px] text-neutral-400 mt-2">
            *Clicking opens WhatsApp with your server-verified order receipt pre-filled.
          </span>
        </div>

        <div className="p-3 bg-[#5C1D13] border border-white/5 rounded-xl flex gap-3 items-start">
          <Lock className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
          <span className="text-[11px] text-[#F7E7D9] font-medium">
            Shipped in 100% Discreet Packaging for your absolute privacy. No product text or branding is printed on the courier slip.
          </span>
        </div>

        {lastOrderId && (
          <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl space-y-2.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-neutral-400 font-medium">Generated Order Reference:</span>
              <span className="font-mono font-black text-[#E5A93C] text-sm bg-black/40 px-2.5 py-1 rounded border border-white/10 flex items-center gap-1.5 shadow-md">
                {lastOrderId}
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(lastOrderId);
                    setShowToast("Order ID copied!");
                    setTimeout(() => setShowToast(null), 3000);
                  }}
                  className="text-white/60 hover:text-white transition-colors cursor-pointer p-0.5"
                  title="Copy Order ID"
                >
                  <Clipboard className="w-3.5 h-3.5" />
                </button>
              </span>
            </div>
          </div>
        )}

        <div className="border-t border-white/10 pt-3 space-y-2 text-xs text-neutral-300">
          <div className="flex justify-between">
            <span>Estimated Dispatch:</span>
            <span className="font-bold text-white">Within 12 Hours</span>
          </div>
          <div className="flex justify-between">
            <span>Transit Time:</span>
            <span className="font-bold text-white">3 to 5 Business Days</span>
          </div>
          <div className="flex justify-between">
            <span>Payment Method:</span>
            <span className="font-bold text-emerald-400">
              {paymentMethod === 'cod' ? "Cash On Delivery (COD)" : "Pay via UPI (Scan & Pay)"}
            </span>
          </div>
        </div>

        {/* Unboxing Video Reminder Banner */}
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex gap-3 items-start">
          <span className="text-base shrink-0 mt-0.5">🎥</span>
          <p className="text-[11px] md:text-xs text-[#F7E7D9] leading-relaxed">
            <strong>Reminder:</strong> Please record an unboxing video when your package arrives. This is required for any future return or refund requests.{' '}
            <button 
              onClick={() => setCurrentView('refund-policy')}
              className="text-[#E5A93C] font-extrabold hover:underline cursor-pointer"
            >
              [View Return Policy →]
            </button>
          </p>
        </div>

        {/* GST Tax Invoice Toggle */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowInvoice(!showInvoice)}
            className="w-full bg-[#E5A93C]/10 hover:bg-[#E5A93C]/20 border border-[#E5A93C]/30 text-[#E5A93C] font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
          >
            <span>📄</span>
            <span>{showInvoice ? "Hide GST Tax Invoice" : "View GST Tax Invoice"}</span>
          </button>
        </div>

        {showInvoice && (
          <div className="bg-white text-neutral-900 border border-neutral-200 rounded-2xl p-6 space-y-4 text-xs shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-start border-b border-neutral-200 pb-4">
              <div>
                <h3 className="font-serif text-base font-black tracking-tight text-[#4A1D05]">meONmode Ayurvedic Wellness</h3>
                <p className="text-[10px] text-neutral-500 font-medium mt-0.5">meONmode Wellness LLP</p>
                <p className="text-[10px] text-neutral-500 leading-normal mt-1">
                  Ayurvedic Pharmacy Licence No: DL-3234-A<br />
                  GSTIN: 07AAGCM1314R1ZN
                </p>
              </div>
              <div className="text-right">
                <h4 className="font-sans font-black text-xs text-neutral-800 uppercase tracking-widest">{t('invoiceTitle')}</h4>
                <p className="text-[10px] text-neutral-500 font-medium mt-1">
                  Invoice No: <strong>INV/2026-27/{lastOrderId}</strong><br />
                  Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b border-neutral-200 pb-4">
              <div>
                <p className="font-bold text-[10px] text-neutral-400 uppercase tracking-wider">Billed To (Customer):</p>
                <p className="font-black text-neutral-800 mt-1">{checkout.fullName}</p>
                <p className="text-neutral-600 leading-normal mt-0.5">
                  {checkout.address}<br />
                  Pincode: <strong>{checkout.pincode}</strong><br />
                  Phone: {checkout.phone}
                </p>
              </div>
              <div className="text-right col-span-1">
                <p className="font-bold text-[10px] text-neutral-400 uppercase tracking-wider">Place of Supply:</p>
                <p className="font-bold text-neutral-800 mt-1">Delhi / Haryana / Other (India)</p>
                <p className="text-neutral-500 leading-normal mt-1">
                  Discreet Courier Shipping<br />
                  Delivery Method: {paymentMethod === 'cod' ? 'Cash On Delivery' : 'Prepaid UPI'}
                </p>
              </div>
            </div>

            {/* Table with Goods & HSN */}
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-300 text-neutral-500 font-bold">
                    <th className="py-2">Description</th>
                    <th className="py-2 text-center">HSN</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Price (Incl.)</th>
                    <th className="py-2 text-right">Taxable</th>
                    <th className="py-2 text-right">CGST</th>
                    <th className="py-2 text-right">SGST</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {translatedCart.map((item, idx) => {
                    const itemTotal = item.product.price * item.quantity;
                    const itemTaxable = Math.round((itemTotal / 1.05) * 100) / 100;
                    const itemGst = Math.round((itemTotal - itemTaxable) * 100) / 100;
                    const itemCgst = Math.round((itemGst / 2) * 100) / 100;
                    const itemSgst = Math.round((itemGst / 2) * 100) / 100;

                    return (
                      <tr key={idx} className="border-b border-neutral-100 text-neutral-700 font-medium">
                        <td className="py-2.5 font-bold text-neutral-800 max-w-[100px] truncate">{item.product.name}</td>
                        <td className="py-2.5 text-center">30049011</td>
                        <td className="py-2.5 text-center">{item.quantity}</td>
                        <td className="py-2.5 text-right">₹{item.product.price.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 text-right">₹{itemTaxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        <td className="py-2.5 text-right">₹{itemCgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        <td className="py-2.5 text-right">₹{itemSgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        <td className="py-2.5 text-right font-bold text-neutral-900">₹{itemTotal.toLocaleString('en-IN')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Invoice Summary Totals */}
            <div className="pt-2 border-t border-neutral-200">
              {(() => {
                const totalBill = getCartTotal();
                const taxableValue = Math.round((totalBill / 1.05) * 100) / 100;
                const totalGst = Math.round((totalBill - taxableValue) * 100) / 100;
                const cgst = Math.round((totalGst / 2) * 100) / 100;
                const sgst = Math.round((totalGst / 2) * 100) / 100;

                return (
                  <div className="space-y-1.5 text-[11px] text-neutral-600 font-medium">
                    <div className="flex justify-between">
                      <span>Total Taxable Value:</span>
                      <span>₹{taxableValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CGST (2.5%):</span>
                      <span>₹{cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SGST (2.5%):</span>
                      <span>₹{sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between border-t border-neutral-100 pt-1.5 font-bold text-neutral-800">
                      <span>Total GST (5%):</span>
                      <span>₹{totalGst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between border-t border-neutral-200 pt-2 font-black text-xs text-[#4A1D05]">
                      <span>Grand Total (Total Amount Payable):</span>
                      <span>₹{totalBill.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Footnote Declaration */}
            <div className="pt-3 border-t border-neutral-100 text-[10px] text-neutral-400 italic text-center leading-normal">
              This is a computer-generated GST tax invoice and does not require a physical signature.<br />
              Classified under HSN 30049011 (Ayurvedic Patent Medicines - GST @ 5%).
            </div>

            {/* Print Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full bg-[#4A1D05] hover:bg-[#5C1D13] text-white font-bold py-2.5 rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>🖨️</span>
                <span>Print/Save PDF Invoice</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CTAs */}
      <div className="pt-4 flex flex-col sm:flex-row gap-3">
        <button 
          onClick={() => {
            setCart([]);
            setCurrentView('home');
          }}
          className="flex-grow bg-gradient-to-r from-[#C86428] to-[#E5A93C] text-white font-extrabold text-sm py-4 rounded-xl shadow-md cursor-pointer"
        >
          Return to Homepage
        </button>
        
        <a 
          href="https://api.whatsapp.com/send?phone=917290810336&text=Hello%20meONmode%20Team%2C%20I%20wanted%20to%20follow%20up%20on%20my%20order.%20Please%20guide%20me."
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-grow bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm py-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Chat with Doctor</span>
        </a>
      </div>
    </div>
  );
};
