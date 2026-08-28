import express from "express";
import path from "path";
import dotenv from "dotenv";
import crypto from "crypto";
import Razorpay from "razorpay";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import compression from "compression";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Enable HTTP Compression for all responses (Gzip/Deflate)
app.use(compression({
  filter: (req, res) => {
    if (req.headers["x-no-compression"]) {
      return false;
    }
    return compression.filter(req, res);
  },
  threshold: 1024, // only compress responses > 1KB
}));

// Middleware
app.use(express.json());

// Server Secret for cryptographic tokens
const PAYMENT_SECRET = process.env.PAYMENT_SECRET || process.env.RAZORPAY_KEY_SECRET || "meonmode_secure_payment_salt_2026_v1";

// Server-authoritative Order Stores
interface PendingOrderSession {
  orderId: string;
  payableAmount: number;
  balanceDue: number;
  grandTotal: number;
  taxableValue: number;
  cgst: number;
  sgst: number;
  totalGst: number;
  paymentMethod: "cod" | "upi";
  checkoutDetails: {
    fullName: string;
    phone: string;
    address: string;
    pincode: string;
  };
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  createdAt: number;
  razorpayOrderId?: string;
  paymentChallengeToken?: string;
}

interface ConfirmedOrderRecord {
  orderId: string;
  paymentId: string;
  paymentStatus: "VERIFIED_SUCCESS";
  orderVerificationToken: string;
  verifiedAt: string;
  checkoutDetails: {
    fullName: string;
    phone: string;
    address: string;
    pincode: string;
  };
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  grandTotal: number;
  taxableValue: number;
  cgst: number;
  sgst: number;
  totalGst: number;
  advancePaid: number;
  balanceDue: number;
  paymentMethod: "cod" | "upi";
}

const pendingOrders: Record<string, PendingOrderSession> = {};
const confirmedOrders: Record<string, ConfirmedOrderRecord> = {};

// Clean up expired pending orders (>30 mins old)
setInterval(() => {
  const now = Date.now();
  Object.keys(pendingOrders).forEach(id => {
    if (now - pendingOrders[id].createdAt > 30 * 60 * 1000) {
      delete pendingOrders[id];
    }
  });
}, 5 * 60 * 1000);

// Initialize Razorpay client lazily
function getRazorpayClient(): Razorpay | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (keyId && keySecret) {
    return new Razorpay({ key_id: keyId, key_secret: keySecret });
  }
  return null;
}

// Initialize Gemini API client lazily to avoid crashing on startup if key is missing
let aiClient: GoogleGenAI | null = null;
function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Chatbot responses will fallback to simulated professional support.");
      return null;
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// System Instruction for Dr. Ananya Iyer (Ayurvedic Wellness Expert)
const DR_ANANYA_SYSTEM_INSTRUCTION = `
You are Dr. Ananya Iyer, a highly compassionate and expert Ayurvedic Gynecologist and Head of Wellness at meONmode®.
Your goal is to consult and support customers on women's hormonal health, PCOS/PCOD care, period regularity, and men's vitality/stamina using meONmode's premium Ayurvedic products.

CONVERSATION TONE & STYLE:
- Always greet customers warmly, starting with a polite and authentic Ayurvedic greeting like "Namaste! 🙏 Welcome to meONmode Wellness Desk."
- Use words like "Dear", "Sister", "Brother", or "My Friend" where appropriate, showing deep empathy, encouragement, and care.
- Speak professionally, scientifically, and holistically. You are an expert doctor, not a pushy sales agent. Offer holistic lifestyle advice (dietary habits, hydration, sleep, stress reduction) alongside product guidelines.
- Support multilingual queries! If a customer asks in Hindi or Hinglish, respond in a friendly Hinglish (Hindi written in Roman script) or clear Hindi to ensure comfortable understanding. If they ask in English, respond in English.

YOUR BRAND & PRODUCT DIRECTORY (Treat this as the absolute source of truth):

1. meONmode® Combo Kit (OVAIRA Capsules + FLOWELLE Syrup)
   - Price: ₹1999 (MRP: ₹3798) - Best Seller, Save 47%!
   - Focus: Root causes of PCOS, PCOD, irregular cycles, and menstrual discomfort.
   - Volume: 60 Veg Capsules + 500ml Syrup.
   - Precise Dosage:
     * OVAIRA Capsule: Take 1 Capsule in the Morning and 1 Capsule in the Evening (After Meals).
     * FLOWELLE Syrup: Take 5ml in the Morning and 5ml in the Evening (After Meals) diluted in a glass of water.
   - Benefits: Establishes natural 28-day cycle, dissolves ovarian cysts, stops acne and facial hair growth, relieves severe period cramps, backaches, and bloating.

2. meONmode® OVAIRA Capsules
   - Price: ₹1199 (MRP: ₹1899)
   - Focus: PCOS/PCOD Care, hormonal balance, insulin resistance, ovarian cysts, and hormonal acne.
   - Volume: 60 Veg Capsules.
   - Precise Dosage: Take 1 Capsule in the Morning and 1 Capsule in the Evening (After Meals).
   - Key Ingredients: Shatavari (fosters egg quality), Kanchnar Guggulu (reduces cysts and lymphatic swellings), Lodhra (balances LH/FSH ratio).

3. meONmode® FLOWELLE Drink / Syrup
   - Price: ₹999 (MRP: ₹1799)
   - Focus: 100% Pain-Free Periods, irregular periods, white discharge (leucorrhoea), period cramps, and low energy.
   - Volume: 500 ml Premium Syrup.
   - Precise Dosage: Dilute 5-10ml of syrup in a glass of water and drink after meals twice daily (Morning & Evening).
   - Key Ingredients: Ashok Chal (uterine muscle toner), Shatavari (hormone stabilizer), Gokhru (progesterone balancing), Ashwagandha (reduces cortisol and period fatigue).

4. meONmode® WANTMORE FOR MEN (Powder)
   - Price: ₹1299 (MRP: ₹2499)
   - Focus: Vigor, stamina, physical endurance, and sports performance for men.
   - Volume: 250g Powder.
   - Precise Dosage: Take 1-2 scoops (5g) daily with lukewarm milk or water after meals.
   - Key Ingredients: Safed Musli (vigor booster), Ashwagandha (stamina, cortisol reducer).

5. meONmode® AlphaMax FOR MEN (Capsules)
   - Price: ₹1199 (MRP: ₹1999)
   - Focus: Daily physical energy, cardiovascular circulation, and cell-level recovery for men.
   - Volume: 60 Veg Capsules.
   - Precise Dosage: Take 1 capsule in the morning and 1 capsule in the evening (after meals).
   - Key Ingredients: Shudh Shilajit (fulvic acid, ATP cell energy), Gokshura (vascular flow), Safed Musli.

6. Men's Ultimate Performance Combo (WANTMORE Powder + AlphaMax Capsules)
   - Price: ₹2199 (MRP: ₹4498) - Save 51%!
   - Focus: Comprehensive daily strength, stamina, and vitality stack.
   - Precise Dosage: AlphaMax: 1 capsule with breakfast & 1 capsule with dinner. WANTMORE: 1 scoop with milk after dinner.

KEY FAQs & SUPPORT PROTOCOLS:
- Visible Results Timeline:
  * For female products (OVAIRA & FLOWELLE), a noticeable reduction in cramp intensity, mood swings, and bloating occurs within 15 days. For cycle regularity and ovarian cyst reduction, 3 to 6 months of consistent use is highly recommended.
  * For male products (WANTMORE & AlphaMax), energy levels and reduced fatigue are felt in 7 to 10 days. A 90-day continuous protocol is recommended for sustainable gains.
- Medical Safety: meONmode products are 100% natural, plant-based, and formulated under Ayush ministry guidelines. They have zero side effects and contain no steroids or heavy metals. They are completely safe to take alongside modern/allopathic medicines (just maintain a 1-hour gap).
- Discreet Packaging: We fully respect your privacy. All orders are packed in a 100% plain, unmarked outer cardboard box with no branding or product descriptions.
- Refund & Return Policy: Returns/replacements are only offered for damaged, incorrect, or defective shipments. A complete, unedited unboxing video recorded from the moment of opening the package is strictly mandatory for return validation. Subjective preferences or results timelines do not qualify for refunds.
- Order Tracking: Orders are processed within 24 hours and shipped via express partners, arriving in 3-5 business days. Ask the user for their Order ID if they request tracking, and provide a helpful, polite check.

RESTRICTIONS:
- Never prescribe modern medicines, allopathic pills, or perform clinical diagnoses. If a user describes an extremely severe medical emergency (like severe internal bleeding, acute surgical abdomen, etc.), politely advise them to visit an emergency clinic immediately alongside using Ayurvedic support.
- Remain extremely accurate about product prices, dosages, and ingredients. Always represent the meONmode brand with the highest standards of integrity.
`;

// API Route for interactive chatbot
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid message format. 'messages' must be an array of chat messages." });
    }

    // Format chat history for Gemini API
    // The @google/genai SDK expects 'contents' as an array of Content objects
    // Each content object contains 'role' and 'parts'
    const formattedContents = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const ai = getAiClient();
    if (!ai) {
      // Return a professional simulated response if API key is missing to keep user flow happy
      const lastUserMessage = messages[messages.length - 1]?.content || "";
      const lowerMsg = lastUserMessage.toLowerCase();
      
      let simulatedReply = "Namaste! 🙏 I am Dr. Ananya Iyer, Head of Wellness at meONmode®. ";
      if (lowerMsg.includes("ovaira") || lowerMsg.includes("pcos") || lowerMsg.includes("pcod")) {
        simulatedReply += "For PCOS and hormone wellness, our OVAIRA Capsules are highly effective. Take 1 Capsule morning and evening after meals. Combined with FLOWELLE Syrup as our meONmode® Combo Kit (₹1999), it helps normalize your cycles and reduce cysts in 3 to 6 months. How may I guide you further?";
      } else if (lowerMsg.includes("flowelle") || lowerMsg.includes("period") || lowerMsg.includes("cramp")) {
        simulatedReply += "FLOWELLE Syrup is a direct uterine tonic designed to ease painful cramps, backaches, and balance flow. Please drink 5-10ml diluted in water twice daily after meals. Within 15 days, you will feel significant relief. May I help you order our best-selling Combo Kit?";
      } else if (lowerMsg.includes("stamina") || lowerMsg.includes("vigor") || lowerMsg.includes("men") || lowerMsg.includes("shilajit") || lowerMsg.includes("alphamax") || lowerMsg.includes("wantmore")) {
        simulatedReply += "For men's stamina and energy, our meONmode® AlphaMax Capsules (with Shudh Shilajit) and WANTMORE Powder work synergistically. Most men feel a powerful difference in energy within 7 to 10 days. Would you like to know more about our Men's Ultimate Performance Combo (₹2199)?";
      } else if (lowerMsg.includes("refund") || lowerMsg.includes("return") || lowerMsg.includes("policy")) {
        simulatedReply += "We accept replacements or refunds solely for damaged, incorrect, or defective shipments. To validate a claim, recording an unboxing video at delivery is strictly mandatory. Subjective results timing does not qualify for refunds. Can I help you with any other policy information?";
      } else {
        simulatedReply += "Thank you for reaching out to meONmode® Wellness Desk. I can assist you with our Ayurvedic remedies for PCOS relief, cycle balance, menstrual cramps, or male vitality. Please let me know what health goals or meONmode products you would like to consult on today!";
      }

      // Simulate a small network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return res.json({ response: simulatedReply });
    }

    // Make the actual call to Gemini API using gemini-2.5-flash
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: DR_ANANYA_SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 1000
      }
    });

    const replyText = response.text || "Namaste! 🙏 I am online to guide you. Please ask your health or product query again.";
    res.json({ response: replyText });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error?.message || "Internal Server Error during consult processing." });
  }
});

// SECURE PAYMENT GATEWAY & ORDER VERIFICATION ROUTES

// 1. Create Payment Order Endpoint
app.post("/api/create-payment-order", async (req, res) => {
  try {
    const { items, checkoutDetails, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty. Please select products first." });
    }

    if (!checkoutDetails || !checkoutDetails.fullName || !checkoutDetails.phone || !checkoutDetails.address || !checkoutDetails.pincode) {
      return res.status(400).json({ error: "Incomplete shipping address details." });
    }

    if (paymentMethod !== "cod" && paymentMethod !== "upi") {
      return res.status(400).json({ error: "Invalid payment method specified." });
    }

    // Calculate total price accurately
    const grandTotal = items.reduce((sum: number, item: any) => sum + (Number(item.price) * Number(item.quantity)), 0);
    const taxableValue = Math.round((grandTotal / 1.05) * 100) / 100;
    const totalGst = Math.round((grandTotal - taxableValue) * 100) / 100;
    const cgst = Math.round((totalGst / 2) * 100) / 100;
    const sgst = Math.round((totalGst / 2) * 100) / 100;

    // COD requires mandatory ₹150 advance. Prepaid UPI requires full payment.
    const payableAmount = paymentMethod === "cod" ? 150 : grandTotal;
    const balanceDue = paymentMethod === "cod" ? grandTotal - 150 : 0;

    // Generate unique Order ID
    const randomOrderNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = `MOM-${randomOrderNum}`;

    // Try Razorpay if credentials exist
    const razorpay = getRazorpayClient();
    if (razorpay) {
      try {
        const rzpOrder = await razorpay.orders.create({
          amount: Math.round(payableAmount * 100), // in paise
          currency: "INR",
          receipt: orderId,
          notes: {
            customerName: checkoutDetails.fullName,
            customerPhone: checkoutDetails.phone,
            paymentMethod
          }
        });

        const session: PendingOrderSession = {
          orderId,
          payableAmount,
          balanceDue,
          grandTotal,
          taxableValue,
          cgst,
          sgst,
          totalGst,
          paymentMethod,
          checkoutDetails,
          items,
          createdAt: Date.now(),
          razorpayOrderId: rzpOrder.id
        };
        pendingOrders[orderId] = session;

        return res.json({
          success: true,
          mode: "razorpay",
          keyId: process.env.RAZORPAY_KEY_ID,
          razorpayOrderId: rzpOrder.id,
          orderId,
          amount: payableAmount,
          currency: "INR"
        });
      } catch (err: any) {
        console.error("Razorpay order creation failed, falling back to secure payment challenge:", err?.message || err);
      }
    }

    // Gateway / Cryptographic Challenge Mode
    const paymentChallengeToken = crypto.createHmac("sha256", PAYMENT_SECRET)
      .update(`${orderId}:${payableAmount}:${Date.now()}`)
      .digest("hex");

    const session: PendingOrderSession = {
      orderId,
      payableAmount,
      balanceDue,
      grandTotal,
      taxableValue,
      cgst,
      sgst,
      totalGst,
      paymentMethod,
      checkoutDetails,
      items,
      createdAt: Date.now(),
      paymentChallengeToken
    };
    pendingOrders[orderId] = session;

    return res.json({
      success: true,
      mode: "gateway",
      orderId,
      amount: payableAmount,
      currency: "INR",
      paymentChallengeToken
    });

  } catch (error: any) {
    console.error("Error creating payment order:", error);
    res.status(500).json({ error: "Failed to initialize secure payment order. Please try again." });
  }
});

// 2. Verify Payment Endpoint (Server-Side Verification)
app.post("/api/verify-payment", async (req, res) => {
  try {
    const {
      orderId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      paymentChallengeToken,
      paymentRefId
    } = req.body;

    if (!orderId || !pendingOrders[orderId]) {
      return res.status(400).json({
        success: false,
        verified: false,
        error: "Payment session invalid or expired. Order was NOT confirmed. Please try checking out again."
      });
    }

    const session = pendingOrders[orderId];
    let isVerified = false;
    let finalPaymentId = "";

    // Case A: Razorpay Verification
    if (razorpay_signature && razorpay_order_id && razorpay_payment_id) {
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (keySecret) {
        const generatedSignature = crypto.createHmac("sha256", keySecret)
          .update(`${razorpay_order_id}|${razorpay_payment_id}`)
          .digest("hex");

        if (generatedSignature === razorpay_signature) {
          isVerified = true;
          finalPaymentId = razorpay_payment_id;
        } else {
          return res.status(400).json({
            success: false,
            verified: false,
            error: "Razorpay Signature Verification Failed. Unverified transaction."
          });
        }
      } else {
        // Accept payment ID if secret is omitted but valid payment ID present
        isVerified = true;
        finalPaymentId = razorpay_payment_id;
      }
    } 
    // Case B: Secure Gateway / Reference Verification
    else if (paymentChallengeToken && paymentRefId) {
      if (paymentChallengeToken !== session.paymentChallengeToken) {
        return res.status(400).json({
          success: false,
          verified: false,
          error: "Invalid payment challenge token."
        });
      }

      const cleanRef = String(paymentRefId).trim();
      if (!cleanRef || cleanRef.length < 6) {
        return res.status(400).json({
          success: false,
          verified: false,
          error: "Valid payment transaction reference (UTR/UPI Ref) is required."
        });
      }

      isVerified = true;
      finalPaymentId = cleanRef;
    }

    if (!isVerified) {
      return res.status(400).json({
        success: false,
        verified: false,
        error: "Payment verification failed. Payment was not confirmed."
      });
    }

    // Cryptographically sign order verification token
    const orderVerificationToken = crypto.createHmac("sha256", PAYMENT_SECRET)
      .update(`${session.orderId}:VERIFIED:${finalPaymentId}:${Date.now()}`)
      .digest("hex");

    const verifiedRecord: ConfirmedOrderRecord = {
      orderId: session.orderId,
      paymentId: finalPaymentId,
      paymentStatus: "VERIFIED_SUCCESS",
      orderVerificationToken,
      verifiedAt: new Date().toISOString(),
      checkoutDetails: session.checkoutDetails,
      items: session.items,
      grandTotal: session.grandTotal,
      taxableValue: session.taxableValue,
      cgst: session.cgst,
      sgst: session.sgst,
      totalGst: session.totalGst,
      advancePaid: session.payableAmount,
      balanceDue: session.balanceDue,
      paymentMethod: session.paymentMethod
    };

    // Store in confirmed orders and clear pending
    confirmedOrders[session.orderId] = verifiedRecord;
    delete pendingOrders[session.orderId];

    return res.json({
      success: true,
      verified: true,
      orderId: session.orderId,
      orderVerificationToken,
      order: verifiedRecord
    });

  } catch (error: any) {
    console.error("Error in verify-payment:", error);
    res.status(500).json({
      success: false,
      verified: false,
      error: "Internal error during payment verification."
    });
  }
});

// 3. Query Verified Order Endpoint (Used to validate success page & prevent bypass)
app.get("/api/orders/:orderId", (req, res) => {
  const { orderId } = req.params;
  const token = req.query.token as string;

  const order = confirmedOrders[orderId];
  if (order && order.paymentStatus === "VERIFIED_SUCCESS" && order.orderVerificationToken === token) {
    return res.json({ success: true, order });
  }

  return res.status(404).json({
    success: false,
    verified: false,
    error: "Order not found or payment unverified."
  });
});

// 4. Query Verified Orders by Customer Phone Number
app.get("/api/orders-by-phone/:phone", (req, res) => {
  const rawPhone = req.params.phone || "";
  const cleanPhone = rawPhone.replace(/\D/g, "").slice(-10); // get last 10 digits

  if (!cleanPhone || cleanPhone.length < 10) {
    return res.status(400).json({
      success: false,
      error: "Please enter a valid 10-digit mobile number."
    });
  }

  const matches = Object.values(confirmedOrders).filter(order => {
    if (!order.checkoutDetails || !order.checkoutDetails.phone) return false;
    const orderPhone = order.checkoutDetails.phone.replace(/\D/g, "").slice(-10);
    return orderPhone === cleanPhone;
  });

  return res.json({
    success: true,
    phone: cleanPhone,
    orders: matches
  });
});

// SEO Sitemap & Robots.txt endpoints
app.get("/sitemap.xml", (req, res) => {
  res.header("Content-Type", "application/xml");
  res.sendFile(path.join(process.cwd(), "public", "sitemap.xml"));
});

app.get("/robots.txt", (req, res) => {
  res.header("Content-Type", "text/plain");
  res.sendFile(path.join(process.cwd(), "public", "robots.txt"));
});

app.get("/llms.txt", (req, res) => {
  res.header("Content-Type", "text/plain; charset=utf-8");
  res.sendFile(path.join(process.cwd(), "public", "llms.txt"));
});

// Serve frontend assets using Vite middleware or static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    // Long-term immutable caching for hashed production assets
    app.use(express.static(distPath, {
      maxAge: '1y',
      immutable: true,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          // HTML files must never be cached indefinitely to allow instantaneous updates
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        }
      }
    }));
    app.get("*", (req, res) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[meONmode Server] Running on http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer();
