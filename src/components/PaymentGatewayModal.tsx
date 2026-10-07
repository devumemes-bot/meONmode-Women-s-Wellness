import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface PaymentGatewayModalProps {
  pendingPaymentOrder: any;
  setShowGatewayModal: (show: boolean) => void;
  setPaymentError: (err: string | null) => void;
  paymentRefInput: string;
  setPaymentRefInput: (val: string) => void;
  isProcessingPayment: boolean;
  verifyPaymentOnServer: (payload: any) => Promise<void>;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  pendingPaymentOrder,
  setShowGatewayModal,
  setPaymentError,
  paymentRefInput,
  setPaymentRefInput,
  isProcessingPayment,
  verifyPaymentOnServer
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 text-neutral-900 shadow-2xl relative border border-amber-200 text-left">
        <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#C86428]" />
            <div>
              <h3 className="font-extrabold text-base text-[#4A1D05]">meONmode® Secure Payment Gateway</h3>
              <p className="text-[10px] text-neutral-500 font-mono">Order Ref: {pendingPaymentOrder.orderId}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowGatewayModal(false);
              setPaymentError("Payment verification cancelled. Your order was NOT confirmed.");
            }}
            className="text-neutral-400 hover:text-neutral-600 font-bold text-lg p-1 cursor-pointer"
            aria-label="Close payment modal"
          >
            ✕
          </button>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-neutral-600 font-semibold">Payment Amount:</span>
            <span className="font-black text-[#C86428] text-sm font-mono">
              ₹{pendingPaymentOrder.amount.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-neutral-600 font-semibold">Payment Purpose:</span>
            <span className="font-bold text-neutral-800">
              {pendingPaymentOrder.paymentMethod === 'cod' ? 'Mandatory ₹150 COD Advance' : '100% Prepaid Full Payment'}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-200 text-center">
          <span className="text-[11px] font-extrabold text-neutral-700 uppercase tracking-wider">Pay via Any UPI App</span>
          
          <a
            href={`upi://pay?pa=9350302092m@pnb&pn=MEONMODE%20ENTERPRISES&am=${pendingPaymentOrder.amount}&cu=INR`}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow cursor-pointer"
          >
            <span>📲 Click to Pay ₹{pendingPaymentOrder.amount} in GPay / PhonePe / Paytm</span>
          </a>

          <div className="bg-white p-2 rounded-xl border border-neutral-200 shadow-inner">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                `upi://pay?pa=9350302092m@pnb&pn=MEONMODE ENTERPRISES&am=${pendingPaymentOrder.amount}&cu=INR`
              )}`}
              alt="meONmode UPI Payment QR Code"
              loading="lazy"
              decoding="async"
              width="160"
              height="160"
              className="w-40 h-40 block object-contain"
            />
          </div>

          <div className="text-xs font-mono font-bold text-[#4A1D05] bg-white px-3 py-1.5 rounded-lg border border-neutral-200">
            UPI ID: 9350302092m@pnb
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-extrabold text-neutral-800">
            Enter 12-Digit UPI Transaction Reference / UTR Number <span className="text-red-500">*</span>
          </label>
          <p className="text-[10px] text-neutral-500 leading-tight">
            After paying in Google Pay, PhonePe, Paytm, or BHIM, copy the 12-digit UTR/Ref No. from the receipt and paste below to confirm your order.
          </p>
          <input
            type="text"
            value={paymentRefInput}
            onChange={(e) => setPaymentRefInput(e.target.value)}
            placeholder="e.g. 423189012345"
            className="w-full px-3.5 py-3 text-sm font-mono border-2 border-neutral-300 rounded-xl focus:border-[#C86428] focus:ring-0 outline-none font-bold"
          />
        </div>

        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={() => {
              if (!paymentRefInput.trim()) {
                alert("Please enter the 12-digit UPI Transaction Reference / UTR number from your payment app.");
                return;
              }
              verifyPaymentOnServer({
                orderId: pendingPaymentOrder.orderId,
                paymentChallengeToken: pendingPaymentOrder.paymentChallengeToken,
                paymentRefId: paymentRefInput.trim()
              });
            }}
            disabled={isProcessingPayment}
            className="w-full bg-[#C86428] hover:bg-[#A8521F] disabled:bg-neutral-400 text-white font-extrabold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            {isProcessingPayment ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Verifying Payment with Gateway...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>VERIFY PAYMENT & CONFIRM ORDER</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setShowGatewayModal(false);
              setPaymentError("Payment verification cancelled. Your order was NOT confirmed.");
            }}
            className="w-full text-center text-xs text-neutral-500 hover:text-neutral-700 py-1 font-semibold cursor-pointer"
          >
            Cancel Payment
          </button>
        </div>
      </div>
    </div>
  );
};
