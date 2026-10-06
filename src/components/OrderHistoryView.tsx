import React from 'react';
import { ArrowLeft, Package, Phone, Search, ShieldCheck, Send, Clipboard } from 'lucide-react';

interface OrderHistoryViewProps {
  orderHistoryPhoneInput: string;
  setOrderHistoryPhoneInput: (val: string) => void;
  orderHistoryOrders: any[];
  setOrderHistoryOrders: React.Dispatch<React.SetStateAction<any[]>>;
  isLoadingOrderHistory: boolean;
  orderHistorySearchError: string | null;
  selectedInvoiceModalOrder: any | null;
  setSelectedInvoiceModalOrder: (val: any) => void;
  handleLookupOrdersByPhone: (phone?: string) => Promise<void>;
  lastVerifiedOrder: any | null;
  orderHistory: string[];
  onBackToHome: () => void;
}

export const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({
  orderHistoryPhoneInput,
  setOrderHistoryPhoneInput,
  orderHistoryOrders,
  setOrderHistoryOrders,
  isLoadingOrderHistory,
  orderHistorySearchError,
  selectedInvoiceModalOrder,
  setSelectedInvoiceModalOrder,
  handleLookupOrdersByPhone,
  lastVerifiedOrder,
  orderHistory,
  onBackToHome
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 animate-fade-in text-left">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <button
          onClick={onBackToHome}
          className="p-2 hover:bg-white/10 rounded-full text-white transition-colors flex items-center justify-center cursor-pointer"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-[#E5A93C]" />
            <span>Order History & Verification</span>
          </h1>
          <p className="text-[#E5A93C] text-xs font-semibold tracking-wider uppercase mt-0.5">
            meONmode Verified Customer Order Hub
          </p>
        </div>
      </div>

      {/* Search Box Card */}
      <div className="bg-gradient-to-br from-[#4A1D05] to-[#2D120B] border border-[#E5A93C]/30 rounded-3xl p-6 md:p-8 shadow-2xl space-y-5">
        <div className="space-y-1">
          <h2 className="text-base font-serif font-extrabold text-white flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#E5A93C]" />
            <span>Look Up Orders by Registered Phone Number</span>
          </h2>
          <p className="text-xs text-white/70 leading-relaxed">
            Enter your 10-digit mobile number used during checkout to view all server-verified orders, payment status, dispatch receipts, and tax invoices.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLookupOrdersByPhone();
          }}
          className="space-y-3"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-sm font-bold font-mono">
                +91
              </span>
              <input
                type="tel"
                value={orderHistoryPhoneInput}
                onChange={(e) => setOrderHistoryPhoneInput(e.target.value)}
                placeholder="e.g. 98765 43210"
                maxLength={13}
                className="w-full bg-black/40 border-2 border-white/20 focus:border-[#E5A93C] rounded-2xl pl-14 pr-4 py-3 text-sm font-mono text-white placeholder-white/40 focus:outline-none transition-all font-bold"
              />
            </div>

            <button
              type="submit"
              disabled={isLoadingOrderHistory}
              className="bg-[#C86428] hover:bg-[#A8521F] disabled:bg-neutral-600 text-white font-extrabold text-sm px-6 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer whitespace-nowrap"
            >
              {isLoadingOrderHistory ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Searching Server...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Search My Orders</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Chip Badges for Recently Saved Local Orders */}
          {(lastVerifiedOrder || orderHistory.length > 0) && (
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-white/60 font-medium text-[11px]">Recent Orders on Device:</span>
              {lastVerifiedOrder && (
                <button
                  type="button"
                  onClick={() => {
                    if (lastVerifiedOrder.checkoutDetails?.phone) {
                      setOrderHistoryPhoneInput(lastVerifiedOrder.checkoutDetails.phone);
                      handleLookupOrdersByPhone(lastVerifiedOrder.checkoutDetails.phone);
                    } else {
                      setOrderHistoryOrders([lastVerifiedOrder]);
                    }
                  }}
                  className="bg-[#E5A93C]/20 hover:bg-[#E5A93C]/30 text-[#E5A93C] border border-[#E5A93C]/40 px-3 py-1 rounded-full font-mono font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lastVerifiedOrder.orderId} (Verified)</span>
                </button>
              )}
              {orderHistory.filter(id => id !== lastVerifiedOrder?.orderId).map((oid) => (
                <button
                  key={oid}
                  type="button"
                  onClick={() => {
                    setOrderHistoryPhoneInput(oid);
                    handleLookupOrdersByPhone(oid);
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white/90 border border-white/15 px-2.5 py-1 rounded-full font-mono font-medium text-[11px] cursor-pointer transition-colors"
                  title="Click to track this order"
                >
                  {oid}
                </button>
              ))}
            </div>
          )}
        </form>
      </div>

      {/* Search Error / Notice Banner */}
      {orderHistorySearchError && (
        <div className="bg-amber-950/60 border-2 border-amber-500/40 rounded-2xl p-4 text-xs text-amber-200 leading-relaxed space-y-1">
          <div className="font-extrabold flex items-center gap-1.5 text-amber-400 text-sm">
            <span>ℹ️</span>
            <span>Order Search Notice</span>
          </div>
          <p>{orderHistorySearchError}</p>
        </div>
      )}

      {/* Order Results Cards */}
      {orderHistoryOrders.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h2 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <span>Found {orderHistoryOrders.length} Verified Order{orderHistoryOrders.length > 1 ? 's' : ''}</span>
            </h2>
            <span className="text-xs text-[#E5A93C] font-mono font-semibold">
              Server-Authoritative Status
            </span>
          </div>

          {orderHistoryOrders.map((ord: any, index: number) => {
            const isCod = ord.paymentMethod === 'cod';
            return (
              <div
                key={ord.orderId || index}
                className="bg-white/5 border border-white/15 hover:border-[#E5A93C]/40 rounded-3xl p-5 md:p-7 space-y-5 shadow-2xl transition-all text-white text-xs"
              >
                {/* Order Header Badge & ID */}
                <div className="flex flex-wrap justify-between items-start gap-3 border-b border-white/10 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-lg font-black text-[#E5A93C] font-mono tracking-tight">
                        {ord.orderId}
                      </span>
                      <span className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 font-mono">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Verified Payment</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Verified Date: {ord.verifiedAt ? new Date(ord.verifiedAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Verified'}
                    </p>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-[10px] text-neutral-400 block uppercase font-sans">Payment Reference / UTR</span>
                    <span className="text-xs font-bold text-emerald-300 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-500/30 inline-block mt-0.5">
                      {ord.paymentId || 'Verified'}
                    </span>
                  </div>
                </div>

                {/* Customer & Shipping Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/30 p-4 rounded-2xl border border-white/5">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-extrabold text-[#E5A93C] font-mono tracking-wider">
                      Customer Delivery Address
                    </span>
                    <p className="font-bold text-sm text-white">{ord.checkoutDetails?.fullName}</p>
                    <p className="text-neutral-300 leading-relaxed text-[11px]">
                      {ord.checkoutDetails?.address}<br />
                      Pincode: <strong className="text-white">{ord.checkoutDetails?.pincode}</strong><br />
                      Phone: <span className="font-mono">{ord.checkoutDetails?.phone}</span>
                    </p>
                  </div>

                  <div className="space-y-1 md:text-right border-t md:border-t-0 md:border-l border-white/10 pt-3 md:pt-0 md:pl-4">
                    <span className="text-[10px] uppercase font-extrabold text-[#E5A93C] font-mono tracking-wider">
                      Payment Breakdown
                    </span>
                    <p className="text-neutral-200 font-medium">
                      Method: <strong className="text-white uppercase">{isCod ? 'Cash on Delivery (COD)' : 'Prepaid UPI'}</strong>
                    </p>
                    <p className="text-emerald-400 font-bold">
                      {isCod 
                        ? `COD Advance Paid: ₹150 (Verified)` 
                        : `Full Amount Paid: ₹${(ord.grandTotal || 0).toLocaleString('en-IN')} (Verified)`}
                    </p>
                    {isCod && (
                      <p className="text-amber-300 font-extrabold">
                        Balance Due at Delivery: ₹{(ord.balanceDue || 0).toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Items Table */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-extrabold text-[#E5A93C] font-mono tracking-wider block">
                    Purchased Remedies & Items
                  </span>
                  <div className="space-y-2">
                    {ord.items && ord.items.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 text-xs"
                      >
                        <div>
                          <span className="font-bold text-white text-sm">{item.name}</span>
                          <span className="text-neutral-400 text-[11px] block">
                            Qty: {item.quantity} × ₹{Number(item.price).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-[#E5A93C] text-sm">
                          ₹{(Number(item.price) * Number(item.quantity)).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tax Breakdown */}
                <div className="border-t border-white/10 pt-3 flex flex-wrap justify-between items-center text-[11px] text-neutral-300 gap-2">
                  <div>
                    <span>Taxable Value: ₹{(ord.taxableValue || 0).toLocaleString('en-IN')} | </span>
                    <span>GST (5%): ₹{(ord.totalGst || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="text-sm font-extrabold text-white font-mono">
                    Grand Total: <span className="text-[#E5A93C] text-base">₹{(ord.grandTotal || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const cartSummary = ord.items.map((item: any) => 
                        `${item.name} x ${item.quantity} - Rs. ${(item.price * item.quantity).toLocaleString('en-IN')}`
                      ).join('\n');

                      const paymentLine = isCod 
                        ? `• Mandatory COD Advance Paid: Rs. 150 (Verified Txn Ref: ${ord.paymentId})\n• Balance Due at Delivery: Rs. ${ord.balanceDue.toLocaleString('en-IN', {minimumFractionDigits: 2})}`
                        : `• Prepaid Full Amount Paid: Rs. ${ord.grandTotal.toLocaleString('en-IN', {minimumFractionDigits: 2})} (Verified Txn Ref: ${ord.paymentId})`;

                      const textPayload = `*VERIFIED ORDER - meONmode*
*Order ID:* ${ord.orderId}
*Payment Status:* VERIFIED SUCCESS ✓ (Ref: ${ord.paymentId})
───────────────────────
*Customer Delivery Details:*
• Name: ${ord.checkoutDetails.fullName}
• Phone Number: ${ord.checkoutDetails.phone}
• Full Address: ${ord.checkoutDetails.address}
• Pincode: ${ord.checkoutDetails.pincode}

*Order Summary:*
${cartSummary}

Taxable Value: Rs. ${ord.taxableValue.toLocaleString('en-IN', {minimumFractionDigits: 2})}
CGST (2.5%): Rs. ${ord.cgst.toLocaleString('en-IN', {minimumFractionDigits: 2})}
SGST (2.5%): Rs. ${ord.sgst.toLocaleString('en-IN', {minimumFractionDigits: 2})}
Total GST (5%): Rs. ${ord.totalGst.toLocaleString('en-IN', {minimumFractionDigits: 2})}
*Grand Total: Rs. ${ord.grandTotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}*

*Payment Breakdown:*
${paymentLine}

*Payment Method:* ${isCod ? 'Cash on Delivery (COD)' : 'Prepaid UPI'}
───────────────────────
Payment has been cryptographically verified on the backend server. Please dispatch this parcel.`;

                      const whatsappUrl = `https://api.whatsapp.com/send?phone=917290810336&text=${encodeURIComponent(textPayload)}`;
                      window.open(whatsappUrl, '_blank');
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>📱 Pass Receipt to WhatsApp Dispatch</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedInvoiceModalOrder(ord)}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Clipboard className="w-4 h-4 text-[#E5A93C]" />
                    <span>📄 View GST Tax Invoice</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="text-center pt-4">
        <button
          onClick={onBackToHome}
          className="bg-gradient-to-r from-[#C86428] to-[#E5A93C] text-white font-extrabold text-sm py-3.5 px-8 rounded-xl shadow-lg active:scale-95 transition-all duration-200 cursor-pointer"
        >
          Return to Shop
        </button>
      </div>

      {/* Tax Invoice Modal for Order History */}
      {selectedInvoiceModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white text-neutral-900 rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-4 text-xs shadow-2xl relative border border-neutral-200 text-left my-8">
            <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[#C86428]" />
                <div>
                  <h3 className="font-serif text-base font-black tracking-tight text-[#4A1D05]">GST Tax Invoice - meONmode®</h3>
                  <p className="text-[10px] text-neutral-500 font-mono">Order ID: {selectedInvoiceModalOrder.orderId}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoiceModalOrder(null)}
                className="text-neutral-400 hover:text-neutral-600 font-bold text-xl p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex justify-between items-start border-b border-neutral-200 pb-4">
              <div>
                <h4 className="font-serif text-sm font-black text-[#4A1D05]">meONmode Wellness LLP</h4>
                <p className="text-[10px] text-neutral-500 leading-normal mt-1">
                  Ayurvedic Pharmacy Licence No: DL-3234-A<br />
                  GSTIN: 07AAGCM1314R1ZN
                </p>
              </div>
              <div className="text-right">
                <h5 className="font-sans font-black text-xs text-neutral-800 uppercase tracking-widest">OFFICIAL TAX INVOICE</h5>
                <p className="text-[10px] text-neutral-500 font-medium mt-1">
                  Invoice No: <strong>INV/2026-27/{selectedInvoiceModalOrder.orderId}</strong><br />
                  Verified Payment Txn ID: <strong className="text-emerald-700">{selectedInvoiceModalOrder.paymentId}</strong>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b border-neutral-200 pb-4">
              <div>
                <p className="font-bold text-[10px] text-neutral-400 uppercase tracking-wider">Billed To (Customer):</p>
                <p className="font-black text-neutral-800 mt-1">{selectedInvoiceModalOrder.checkoutDetails?.fullName}</p>
                <p className="text-neutral-600 leading-normal mt-0.5 text-[11px]">
                  {selectedInvoiceModalOrder.checkoutDetails?.address}<br />
                  Pincode: <strong>{selectedInvoiceModalOrder.checkoutDetails?.pincode}</strong><br />
                  Phone: {selectedInvoiceModalOrder.checkoutDetails?.phone}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-[10px] text-neutral-400 uppercase tracking-wider">Payment Method:</p>
                <p className="font-bold text-neutral-800 mt-1 uppercase">{selectedInvoiceModalOrder.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Prepaid UPI'}</p>
                <p className="text-emerald-700 font-extrabold text-[11px] mt-0.5">
                  Verified Status: ✓ VERIFIED SUCCESS
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-300 text-neutral-500 font-bold">
                    <th className="py-2">Description</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Price</th>
                    <th className="py-2 text-right">Taxable</th>
                    <th className="py-2 text-right">CGST</th>
                    <th className="py-2 text-right">SGST</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoiceModalOrder.items?.map((item: any, idx: number) => {
                    const itemTotal = Number(item.price) * Number(item.quantity);
                    const itemTaxable = Math.round((itemTotal / 1.05) * 100) / 100;
                    const itemGst = Math.round((itemTotal - itemTaxable) * 100) / 100;
                    const itemCgst = Math.round((itemGst / 2) * 100) / 100;
                    const itemSgst = Math.round((itemGst / 2) * 100) / 100;

                    return (
                      <tr key={idx} className="border-b border-neutral-100 text-neutral-700 font-medium">
                        <td className="py-2 font-bold text-neutral-800">{item.name}</td>
                        <td className="py-2 text-center">{item.quantity}</td>
                        <td className="py-2 text-right">₹{Number(item.price).toLocaleString('en-IN')}</td>
                        <td className="py-2 text-right">₹{itemTaxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        <td className="py-2 text-right">₹{itemCgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        <td className="py-2 text-right">₹{itemSgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        <td className="py-2 text-right font-bold text-neutral-900">₹{itemTotal.toLocaleString('en-IN')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="space-y-1.5 text-[11px] text-neutral-600 font-medium pt-2 border-t border-neutral-200">
              <div className="flex justify-between">
                <span>Taxable Value:</span>
                <span>₹{(selectedInvoiceModalOrder.taxableValue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span>CGST (2.5%):</span>
                <span>₹{(selectedInvoiceModalOrder.cgst || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span>SGST (2.5%):</span>
                <span>₹{(selectedInvoiceModalOrder.sgst || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-[#4A1D05] pt-1 border-t border-neutral-200">
                <span>Grand Total (Inclusive of 5% GST):</span>
                <span>₹{(selectedInvoiceModalOrder.grandTotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-[#C86428] hover:bg-[#A8521F] text-white font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow cursor-pointer"
              >
                <span>🖨️ Print Invoice</span>
              </button>
              <button
                onClick={() => setSelectedInvoiceModalOrder(null)}
                className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-extrabold text-xs py-3 px-6 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
