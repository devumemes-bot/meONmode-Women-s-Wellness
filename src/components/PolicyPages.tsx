import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PolicyPageProps {
  onBackToHome: () => void;
}

export const RefundPolicyView: React.FC<PolicyPageProps> = ({ onBackToHome }) => (
  <div className="max-w-3xl mx-auto space-y-8 py-4 animate-fade-in text-left">
    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
      <button
        onClick={onBackToHome}
        className="p-2 hover:bg-white/10 rounded-full text-white transition-colors flex items-center justify-center cursor-pointer"
        aria-label="Back to home"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div>
        <h1 className="font-serif text-3xl font-extrabold text-white">Refund & Return Policy</h1>
        <p className="text-[#E5A93C] text-xs font-semibold tracking-wider uppercase mt-1">meONmode Ayurvedic Wellness Standards</p>
      </div>
    </div>

    <div className="space-y-6 text-sm text-white/90 leading-relaxed bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
      {/* Section 1 */}
      <div className="space-y-2">
        <h2 className="font-serif text-lg font-bold text-[#E5A93C] flex items-center gap-2">
          <span className="text-sm bg-[#E5A93C]/10 px-2.5 py-1 rounded-md text-[#E5A93C] font-sans font-extrabold">01</span>
          Eligibility & Scope
        </h2>
        <p className="text-white/80 pl-10">
          At meONmode, we want you to be completely satisfied with your wellness purchase. We offer full refund or replacements only on damaged, incorrect, or defective products. Due to the high-purity, clinical nature of Ayurvedic medicine, personal preference or subjective changes in symptom relief timing do not qualify as defects.
        </p>
      </div>

      {/* Section 2 - Highlighted Callout Box */}
      <div className="space-y-2">
        <h2 className="font-serif text-lg font-bold text-[#E5A93C] flex items-center gap-2">
          <span className="text-sm bg-[#E5A93C]/10 px-2.5 py-1 rounded-md text-[#E5A93C] font-sans font-extrabold">02</span>
          Mandatory Unboxing Video Requirement
        </h2>
        <div className="pl-10">
          <div className="bg-gradient-to-br from-[#5C1D13] to-[#4A1D05] border-2 border-[#E5A93C] rounded-2xl p-5 md:p-6 space-y-3.5 shadow-lg">
            <div className="flex items-center gap-2.5 text-[#E5A93C] font-serif font-black text-sm uppercase tracking-wide">
              <span className="text-xl">⚠️</span> IMPORTANT: Unboxing Video Required
            </div>
            <p className="text-xs text-[#F7E7D9] leading-relaxed">
              To qualify for a refund, return, or replacement, you MUST record a continuous unboxing video. No claims will be entertained without this proof under any circumstances.
            </p>
            <div className="space-y-2 border-t border-white/10 pt-3">
              <h3 className="text-xs font-extrabold text-[#E5A93C] uppercase tracking-wider">How to record a valid unboxing video:</h3>
              <ol className="list-decimal list-inside text-xs text-[#F7E7D9]/90 space-y-1.5 pl-1 leading-relaxed font-medium">
                <li>Start recording <strong className="text-white font-extrabold underline">BEFORE</strong> opening the outer corrugated box packaging.</li>
                <li>The shipping courier label showing your name, complete address, and barcode must be clearly visible and in focus.</li>
                <li>Keep the video completely continuous and unedited. Absolutely NO cuts, pans, or pauses are permitted.</li>
                <li>Physically show all items inside and inspect them in front of the camera, highlighting any leakage or breakages.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3 */}
      <div className="space-y-2">
        <h2 className="font-serif text-lg font-bold text-[#E5A93C] flex items-center gap-2">
          <span className="text-sm bg-[#E5A93C]/10 px-2.5 py-1 rounded-md text-[#E5A93C] font-sans font-extrabold">03</span>
          How to Submit a Claim
        </h2>
        <div className="text-white/80 pl-10 space-y-2">
          <p>
            Please submit your claim within <strong className="text-white">48 hours</strong> of package delivery. Send the raw, uncut unboxing video along with your Order ID through either of the channels below:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <a 
              href="https://api.whatsapp.com/send?phone=917290810336&text=Hello%20meONmode%20Team%2C%20I%20would%20like%20to%20file%20a%20refund%2Freplacement%20claim." 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-emerald-600/25 hover:bg-emerald-600/35 border border-emerald-500/30 p-3 rounded-xl flex items-center gap-2 text-white font-semibold text-xs transition-colors"
            >
              <span className="text-base">💬</span>
              WhatsApp Support: +91 72908 10336
            </a>
            <a 
              href="mailto:meonmodewellness@gmail.com" 
              className="bg-blue-600/25 hover:bg-blue-600/35 border border-blue-500/30 p-3 rounded-xl flex items-center gap-2 text-white font-semibold text-xs transition-colors"
            >
              <span className="text-base">✉️</span>
              Email: meonmodewellness@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Section 4 */}
      <div className="space-y-2">
        <h2 className="font-serif text-lg font-bold text-[#E5A93C] flex items-center gap-2">
          <span className="text-sm bg-[#E5A93C]/10 px-2.5 py-1 rounded-md text-[#E5A93C] font-sans font-extrabold">04</span>
          Review & Processing Timeframe
        </h2>
        <p className="text-white/80 pl-10">
          Our quality assurance team will inspect your submitted video evidence within <strong className="text-white">2 to 3 business days</strong>. Once approved, a replacement package will be dispatched at zero additional cost, or a direct refund will be credited to your original payment method/bank account within <strong className="text-white">7 business days</strong>.
        </p>
      </div>

      {/* Section 5 */}
      <div className="space-y-2">
        <h2 className="font-serif text-lg font-bold text-[#E5A93C] flex items-center gap-2">
          <span className="text-sm bg-[#E5A93C]/10 px-2.5 py-1 rounded-md text-[#E5A93C] font-sans font-extrabold">05</span>
          Non-Returnable & Void Conditions
        </h2>
        <div className="text-white/80 pl-10">
          <p className="mb-2">A claim is strictly void and rejected if any of the following occur:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-1 text-white/70">
            <li>Missing unboxing video, or video with cuts/edits.</li>
            <li>The unboxing video starts after the outer courier tape/packaging has already been sliced, opened, or tampered with.</li>
            <li>Claims submitted after the strict 48-hour delivery window.</li>
            <li>Submitting a cropped or low-resolution video where the package shipping label is illegible.</li>
          </ul>
        </div>
      </div>
    </div>

    <div className="text-center pt-2">
      <button
        onClick={onBackToHome}
        className="bg-gradient-to-r from-[#C86428] to-[#E5A93C] text-white font-extrabold text-sm py-3.5 px-8 rounded-xl shadow-lg active:scale-95 transition-all duration-200 cursor-pointer"
      >
        Return to Shop
      </button>
    </div>
  </div>
);

export const ShippingPolicyView: React.FC<PolicyPageProps> = ({ onBackToHome }) => (
  <div className="max-w-3xl mx-auto space-y-8 py-4 animate-fade-in text-left">
    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
      <button
        onClick={onBackToHome}
        className="p-2 hover:bg-white/10 rounded-full text-white transition-colors flex items-center justify-center cursor-pointer"
        aria-label="Back to home"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div>
        <h1 className="font-serif text-3xl font-extrabold text-white">Shipping & Delivery Policy</h1>
        <p className="text-[#E5A93C] text-xs font-semibold tracking-wider uppercase mt-1">meONmode Fast & Discreet Pan-India Delivery</p>
      </div>
    </div>

    <div className="space-y-6 text-sm text-white/90 leading-relaxed bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
      <div className="space-y-2">
        <h2 className="font-serif text-lg font-bold text-[#E5A93C] flex items-center gap-2">
          <span className="text-sm bg-[#E5A93C]/10 px-2.5 py-1 rounded-md text-[#E5A93C] font-sans font-extrabold">01</span>
          Free Shipping All Across India
        </h2>
        <p className="text-white/80 pl-10">
          We offer 100% Free Express Shipping on all prepaid and Cash on Delivery (COD) orders across India with zero hidden delivery charges or surge fees.
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="font-serif text-lg font-bold text-[#E5A93C] flex items-center gap-2">
          <span className="text-sm bg-[#E5A93C]/10 px-2.5 py-1 rounded-md text-[#E5A93C] font-sans font-extrabold">02</span>
          Discreet & Confidential Packaging
        </h2>
        <p className="text-white/80 pl-10">
          Your privacy is our utmost priority. All meONmode orders are shipped in unmarked, plain brown corrugated boxes with no product names, medical descriptions, or logos printed on the outer exterior packaging.
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="font-serif text-lg font-bold text-[#E5A93C] flex items-center gap-2">
          <span className="text-sm bg-[#E5A93C]/10 px-2.5 py-1 rounded-md text-[#E5A93C] font-sans font-extrabold">03</span>
          Dispatch & Delivery Timelines
        </h2>
        <div className="text-white/80 pl-10 space-y-1.5">
          <p>• <strong>Order Processing:</strong> Dispatched within 24 to 48 business hours from our certified Ayurvedic pharmacy hubs.</p>
          <p>• <strong>Metro Cities:</strong> Delivered within 2 to 4 business days.</p>
          <p>• <strong>Rest of India:</strong> Delivered within 3 to 6 business days depending on pin code accessibility.</p>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="font-serif text-lg font-bold text-[#E5A93C] flex items-center gap-2">
          <span className="text-sm bg-[#E5A93C]/10 px-2.5 py-1 rounded-md text-[#E5A93C] font-sans font-extrabold">04</span>
          Order Tracking
        </h2>
        <p className="text-white/80 pl-10">
          Once your parcel is dispatched, you will receive real-time SMS & WhatsApp notifications containing your AWB tracking link from our courier partners (Bluedart, Delhivery, ExpressBees, Xpressbees, Shadowfax).
        </p>
      </div>
    </div>

    <div className="text-center pt-2">
      <button
        onClick={onBackToHome}
        className="bg-gradient-to-r from-[#C86428] to-[#E5A93C] text-white font-extrabold text-sm py-3.5 px-8 rounded-xl shadow-lg active:scale-95 transition-all duration-200 cursor-pointer"
      >
        Return to Shop
      </button>
    </div>
  </div>
);

export const PrivacyPolicyView: React.FC<PolicyPageProps> = ({ onBackToHome }) => (
  <div className="max-w-3xl mx-auto space-y-8 py-4 animate-fade-in text-left">
    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
      <button
        onClick={onBackToHome}
        className="p-2 hover:bg-white/10 rounded-full text-white transition-colors flex items-center justify-center cursor-pointer"
        aria-label="Back to home"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div>
        <h1 className="font-serif text-3xl font-extrabold text-white">Privacy Policy</h1>
        <p className="text-[#E5A93C] text-xs font-semibold tracking-wider uppercase mt-1">meONmode Data Protection & Security</p>
      </div>
    </div>

    <div className="space-y-6 text-sm text-white/90 leading-relaxed bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
      <div className="space-y-2">
        <h2 className="font-serif text-lg font-bold text-[#E5A93C] flex items-center gap-2">
          <span className="text-sm bg-[#E5A93C]/10 px-2.5 py-1 rounded-md text-[#E5A93C] font-sans font-extrabold">01</span>
          Commitment to Privacy
        </h2>
        <p className="text-white/80 pl-10">
          meONmode is committed to safeguarding the privacy and confidentiality of our customers. Any personal details, contact numbers, or health consultation inquiries shared with us are treated with strict confidentiality.
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="font-serif text-lg font-bold text-[#E5A93C] flex items-center gap-2">
          <span className="text-sm bg-[#E5A93C]/10 px-2.5 py-1 rounded-md text-[#E5A93C] font-sans font-extrabold">02</span>
          Data We Collect
        </h2>
        <p className="text-white/80 pl-10">
          We collect basic order fulfillment information including your name, delivery address, phone number, and email. We do not store financial payment credentials or card details on our servers — all transactions are processed via bank-grade 256-bit SSL encrypted payment gateways.
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="font-serif text-lg font-bold text-[#E5A93C] flex items-center gap-2">
          <span className="text-sm bg-[#E5A93C]/10 px-2.5 py-1 rounded-md text-[#E5A93C] font-sans font-extrabold">03</span>
          Zero Third-Party Sharing
        </h2>
        <p className="text-white/80 pl-10">
          We strictly never sell, rent, lease, or trade your personal or medical inquiry data with unauthorized third parties or marketing brokers. Information is shared strictly with verified courier delivery partners solely for doorstep order delivery.
        </p>
      </div>
    </div>

    <div className="text-center pt-2">
      <button
        onClick={onBackToHome}
        className="bg-gradient-to-r from-[#C86428] to-[#E5A93C] text-white font-extrabold text-sm py-3.5 px-8 rounded-xl shadow-lg active:scale-95 transition-all duration-200 cursor-pointer"
      >
        Return to Shop
      </button>
    </div>
  </div>
);

export const TermsAndConditionsView: React.FC<PolicyPageProps> = ({ onBackToHome }) => (
  <div className="max-w-3xl mx-auto space-y-8 py-4 animate-fade-in text-left">
    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
      <button
        onClick={onBackToHome}
        className="p-2 hover:bg-white/10 rounded-full text-white transition-colors flex items-center justify-center cursor-pointer"
        aria-label="Back to home"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div>
        <h1 className="font-serif text-3xl font-extrabold text-white">Terms & Conditions</h1>
        <p className="text-[#E5A93C] text-xs font-semibold tracking-wider uppercase mt-1">meONmode Official Terms of Service</p>
      </div>
    </div>

    <div className="space-y-6 text-sm text-white/90 leading-relaxed bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
      <div className="space-y-2">
        <h2 className="font-serif text-lg font-bold text-[#E5A93C] flex items-center gap-2">
          <span className="text-sm bg-[#E5A93C]/10 px-2.5 py-1 rounded-md text-[#E5A93C] font-sans font-extrabold">01</span>
          Ayurvedic Product Information
        </h2>
        <p className="text-white/80 pl-10">
          meONmode products (OVAIRA, FLOWELLE, ALPHAMAX, WANTMORE, VAYUCORE) are authentic proprietary Ayurvedic wellness formulations manufactured in GMP-certified facilities compliant with AYUSH guidelines. They are formulated to support natural bodily balance and hormonal harmony.
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="font-serif text-lg font-bold text-[#E5A93C] flex items-center gap-2">
          <span className="text-sm bg-[#E5A93C]/10 px-2.5 py-1 rounded-md text-[#E5A93C] font-sans font-extrabold">02</span>
          Dosage & Holistic Health
        </h2>
        <p className="text-white/80 pl-10">
          Please follow the recommended dosages as printed on the product pack or guided by Ayurvedic physicians. Individual results may vary depending on diet, sleep, and lifestyle habits.
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="font-serif text-lg font-bold text-[#E5A93C] flex items-center gap-2">
          <span className="text-sm bg-[#E5A93C]/10 px-2.5 py-1 rounded-md text-[#E5A93C] font-sans font-extrabold">03</span>
          Order Confirmation & Verification
        </h2>
        <p className="text-white/80 pl-10">
          Orders placed on meONmode are verified via automated SMS/WhatsApp and customer care verification. For Cash on Delivery orders, an advance payment of ₹150 is collected to confirm intentional delivery booking and prevent transit wastage.
        </p>
      </div>
    </div>

    <div className="text-center pt-2">
      <button
        onClick={onBackToHome}
        className="bg-gradient-to-r from-[#C86428] to-[#E5A93C] text-white font-extrabold text-sm py-3.5 px-8 rounded-xl shadow-lg active:scale-95 transition-all duration-200 cursor-pointer"
      >
        Return to Shop
      </button>
    </div>
  </div>
);
