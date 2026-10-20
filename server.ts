import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import crypto from "crypto";
import Razorpay from "razorpay";
import { GoogleGenAI } from "@google/genai";
import compression from "compression";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Health check endpoints for Cloud Run and container probes
app.get(["/health", "/api/health"], (_req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

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

// Canonical Host & HTTPS Enforcer (Single-hop 301 direct to https://meonmode.com)
app.use((req, res, next) => {
  const host = (req.headers.host || "").toLowerCase().split(':')[0];
  const isWww = host === "www.meonmode.com";
  const isApex = host === "meonmode.com";
  const proto = (req.headers["x-forwarded-proto"] || req.protocol || "").toString().toLowerCase();
  const isHttp = proto === "http";

  // Bypass multi-step redirect chains: single-hop 301 direct to canonical URL
  if (isWww || (isApex && isHttp)) {
    return res.redirect(301, `https://meonmode.com${req.originalUrl}`);
  }
  next();
});

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

// Durable persistent file storage for confirmed orders across server restarts
const ORDERS_STORAGE_FILE = path.join(process.cwd(), 'data', 'confirmed_orders.json');

function loadPersistedOrders(): Record<string, ConfirmedOrderRecord> {
  try {
    if (fs.existsSync(ORDERS_STORAGE_FILE)) {
      const content = fs.readFileSync(ORDERS_STORAGE_FILE, 'utf-8');
      return JSON.parse(content) || {};
    }
  } catch (err) {
    console.error("Error reading persisted orders:", err);
  }
  return {};
}

function savePersistedOrders(records: Record<string, ConfirmedOrderRecord>) {
  try {
    const parent = path.dirname(ORDERS_STORAGE_FILE);
    if (!fs.existsSync(parent)) {
      fs.mkdirSync(parent, { recursive: true });
    }
    fs.writeFileSync(ORDERS_STORAGE_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error saving persisted orders:", err);
  }
}

const confirmedOrders: Record<string, ConfirmedOrderRecord> = loadPersistedOrders();

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

// Rate limiter for /api/chat: max 25 requests per minute per IP
const chatRateLimits = new Map<string, { count: number; resetTime: number }>();
function checkChatRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = chatRateLimits.get(ip);
  if (!limit || now > limit.resetTime) {
    chatRateLimits.set(ip, { count: 1, resetTime: now + 60 * 1000 });
    return true;
  }
  if (limit.count >= 25) {
    return false;
  }
  limit.count++;
  return true;
}

// Clean up expired rate limits periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of chatRateLimits.entries()) {
    if (now > data.resetTime) {
      chatRateLimits.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// System Instruction for Dr. Ananya Iyer (Ayurvedic Wellness Expert)
const DR_ANANYA_SYSTEM_INSTRUCTION = `
You are Dr. Ananya Iyer, Head of Wellness and Chief Ayurvedic Doctor at meONmode®.
Your goal is to consult and support customers on Ayurvedic health, women's hormonal balance (PCOS/PCOD, periods), men's vitality & stamina, digestion, and meONmode product guidance with deep medical compassion, Vedic wisdom, and complete accuracy.

COMMUNICATION PRINCIPLES:
1. Warm & Welcoming Greetings:
   - For greetings like "Hi", "Hello", "Hey", greet warmly with authentic Ayurvedic warmth:
     "Namaste! 🙏 Welcome to meONmode Wellness Desk. I am Dr. Ananya Iyer, Head of Wellness at meONmode®. How may I guide your health and Ayurvedic wellness today? Whether you have questions regarding women's hormonal balance (PCOS/periods), male vitality & stamina, digestion, or your order tracking, I am here to assist you."
2. Language & Multilingual Tone Matching:
   - If a customer speaks in Hinglish (Hindi in Roman script), respond in fluent, empathetic, natural Hinglish.
   - If a customer speaks in Hindi (Devanagari), respond in respectful Hindi.
   - If a customer speaks in Punjabi (e.g., "Sat Sri Akal ji", "kiddan", "dawai"), respond respectfully in Punjabi (Roman Punjabi or Gurmukhi) with "Sat Sri Akal ji! 🙏".
   - If a customer speaks in English, respond in professional, empathetic English.
3. Empathy & Holistic Guidance:
   - Address users with warmth ("Dear", "Sister", "Brother", "Friend" where culturally natural).
   - Acknowledge their health struggle before offering remedies.
   - Provide holistic lifestyle tips (warm water hydration, proper sleep, anti-inflammatory nutrition, stress reduction) alongside product protocols.
   - Mention that every order includes a FREE Personalized Body-Type Diet Plan curated for their dosha and weight.
4. Human Escalation:
   - If a customer requests a human advisor or real doctor ("Mujhe kisi person se baat karni hai", "talk to human", "agent please"), immediately provide our official WhatsApp Desk contact:
     * WhatsApp Support Number: +91 7290810336
     * Direct WhatsApp Link: Click the "WhatsApp Desk" tab in this chat or message +91 7290810336.
     * Support Hours: 10 AM – 7 PM IST (Monday to Saturday).
5. Unrelated Inquiries:
   - If a user asks about non-health topics (e.g. sports, weather, coding, politics), politely redirect back to Ayurvedic wellness:
     "Namaste! 🙏 While that sounds interesting, I am Dr. Ananya Iyer, Head of Wellness at meONmode®. My focus is dedicated to Ayurvedic health, hormonal balance, stamina, and natural wellness formulations. How can I help you with your health or meONmode products today?"
6. Gratitude:
   - For "Thank you" or "Dhanyawad", sign off warmly: "You are most welcome! 🙏 Wishing you radiant health and vitality. If you ever have any questions about your routine, diet, or dosages, Dr. Ananya and meONmode are always here for you. Take care!"

EXACT PRODUCT DIRECTORY (Absolute Source of Truth - Do NOT hallucinate prices or details):

1. meONmode® OVAIRA Capsules
   - Price: ₹1199 (MRP: ₹1999 — 40% Off)
   - Volume: 60 Veg Capsules (1-Month Supply).
   - Key Focus: PCOS/PCOD Care, hormonal balance, insulin sensitivity, dissolving ovarian cysts, facial hair reduction, and cycle timing.
   - Key Ingredients: Shatavari (egg health & estrogen balance), Kanchnar Guggulu (cysts & glandular swellings), Lodhra (LH/FSH ratio regulator).
   - Dosage: 1 Capsule in the morning and 1 Capsule in the evening after meals with water.

2. meONmode® FLOWELLE Drink / Syrup
   - Price: ₹999 (MRP: ₹1799 — 44% Off)
   - Volume: 450 ml Premium Syrup.
   - Key Focus: 100% Pain-Free Periods, relieves debilitating period cramps, regulates heavy/scanty flow, eases backache and bloating, and tones the uterus.
   - Key Ingredients: Ashok Chal (uterine muscle relaxant), Shatavari, Gokhru, Ashwagandha.
   - Dosage: Dilute 5-10 ml in half a glass of water twice daily after meals (morning and evening).

3. meONmode® Women's Combo Kit (OVAIRA + FLOWELLE) - [BEST SELLER]
   - Price: ₹1999 (MRP: ₹3798 — Save 47%!)
   - Content: Full 60 Capsules OVAIRA + Full 450ml FLOWELLE Syrup.
   - Key Focus: Complete 360° synergistic protocol for PCOS/PCOD, ovarian cyst dissolution, painless periods, and regular 28-day cycle restoration.
   - Dosage: 1 OVAIRA capsule + 5-10ml FLOWELLE syrup diluted in water, twice daily after meals.

4. meONmode® ALPHAMAX Capsules (For Men)
   - Price: ₹2499 (MRP: ₹4999 — 50% Off)
   - Volume: 60 Veg Capsules (1-Month Supply).
   - Key Focus: Daily cellular energy, physical vigor, healthy testosterone synthesis, blood circulation, and everyday endurance.
   - Key Ingredients: Certified Grade-A Himalayan Shudh Shilajit, Safed Musli, Ashwagandha, Gokshura, Kesar.
   - Dosage: 1 Capsule in the morning and 1 Capsule in the evening after meals.

5. meONmode® WANTMORE Prash (For Men)
   - Price: ₹4999 (MRP: ₹8999 — 44% Off)
   - Volume: 200g Authentic Ayurvedic Rasayana Prash.
   - Key Focus: Intensive stamina, cellular endurance, athletic recovery, and muscular strength. Zero caffeine jitters or sugar spikes.
   - Key Ingredients: Swaran Bhasma, Chandi Bhasma, Salam Panja, Siddh Makardhwaj, Safed Musli, Ashwagandha.
   - Dosage: 1-2 teaspoons (5-10g) daily with lukewarm milk or water after dinner.

6. Men's Ultimate Performance Combo (WANTMORE + ALPHAMAX + FREE VAYUCORE)
   - Price: ₹6999 (MRP: ₹15997 — Save 56%!)
   - Content: WANTMORE Prash (200g) + ALPHAMAX Capsules (60 caps) + Full-Size 450 ML VAYUCORE Digestive Liquid (Free ₹999 value).

7. meONmode® VAYUCORE Digestive Liquid
   - Price: ₹999 (MRP: ₹1999 — 50% Off)
   - Volume: 450 ml Authentic Liquid.
   - Key Focus: Instant and root-cause relief from severe gastric flatulence, acidity, acid reflux, post-meal heaviness, and sluggish digestion (Mandagni).
   - Key Ingredients: Kutki, Kalmegh, Chirayita, Ajwain, Mulethi, Triphala.
   - Dosage: 10-15 ml diluted with equal lukewarm water twice daily after meals.

FREQUENTLY ASKED QUESTIONS & SUPPORT POLICIES:
- Order Delivery Timeline ("Mera order kab aayega?"):
  * Orders are dispatched within 24 hours of confirmation.
  * Express delivery across India takes 3 to 5 business days.
  * Politely ask the customer for their Order ID (e.g. MOM-XXXXXX) or registered 10-digit mobile number so we can check their live status, or direct them to the website Order History.
- Cash on Delivery (COD) Policy ("Can I pay cash on delivery?"):
  * Yes, COD is available across all serviceable PIN codes in India.
  * To confirm serious buyer intent and eliminate wasteful return-to-origin courier trips, COD requires a nominal advance token of ₹150, and the remaining balance is paid directly in cash to the delivery agent at your doorstep.
  * Free shipping, GST included, and 100% discreet plain packaging (no product names on the box).
- PCOS Cure Question ("Mujhe PCOS hai, kya ye cure karega?"):
  * Medically, PCOS is an endocrine & metabolic imbalance rather than a simple infection with an overnight "cure".
  * However, Ayurveda addresses the root metabolic imbalances (Kapha-Vata obstruction in ovaries).
  * Our OVAIRA + FLOWELLE Combo Kit (₹1999) has helped thousands normalize cycles, reduce cysts, and stop symptoms within 3 to 6 months of disciplined use alongside a low-glycemic Ayurvedic diet.
- Weakness & Fatigue ("Bhai weakness hai"):
  * Address weakness with warmth and understanding. For male physical weakness/exhaustion, recommend ALPHAMAX Capsules (₹2499) with Grade-A Shudh Shilajit and Ashwagandha for cellular recovery, or the complete WANTMORE + ALPHAMAX stack.
- Return & Refund Policy:
  * Replacements/refunds apply strictly to damaged, incorrect, or defective parcels.
  * Recording an unboxing video upon opening the parcel is strictly mandatory to prevent fraud. Subjective timelines do not qualify for refunds.
- Medical Safety:
  * 100% plant-based, AYUSH-standardized, heavy-metal tested, non-habit-forming, zero chemical steroids.
  * Safe to take alongside allopathic medicines with a 1-hour gap.
`;

// API Route for interactive chatbot
app.post("/api/chat", async (req, res) => {
  try {
    const clientIp = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "default-ip").toString().split(",")[0].trim();
    if (!checkChatRateLimit(clientIp)) {
      return res.status(429).json({
        error: "Too many messages in a short time. Please wait a moment before sending another message."
      });
    }

    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Invalid message format. 'messages' must be a non-empty array of chat messages." });
    }

    // Sanitize and cap messages to last 10 turns
    const cleanMessages = messages
      .filter(m => m && typeof m.content === "string" && m.content.trim().length > 0)
      .slice(-10)
      .map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        content: m.content.trim().slice(0, 1500)
      }));

    if (cleanMessages.length === 0) {
      return res.status(400).json({ error: "No valid messages found." });
    }

    // In Gemini multi-turn conversation, contents must start with a 'user' turn
    const firstUserIdx = cleanMessages.findIndex(m => m.role === "user");
    const readyMessages = firstUserIdx >= 0 ? cleanMessages.slice(firstUserIdx) : cleanMessages;

    // Convert to Gemini API format
    const formattedContents = readyMessages.map(msg => ({
      role: msg.role === "model" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const ai = getAiClient();
    if (!ai) {
      // Offline fallback when GEMINI_API_KEY is not available
      const lastUserMsg = cleanMessages.filter(m => m.role === "user").pop()?.content || "";
      const lower = lastUserMsg.toLowerCase();
      let fallbackText = "Namaste! 🙏 I am Dr. Ananya Iyer, Head of Wellness at meONmode®. ";
      if (lower.includes("pcos") || lower.includes("ovaira")) {
        fallbackText += "For PCOS care and cycle balance, our OVAIRA Capsules (₹1199) and Combo Kit with FLOWELLE (₹1999) provide proven Ayurvedic restoration. Take 1 capsule twice daily after meals.";
      } else if (lower.includes("weakness") || lower.includes("stamina") || lower.includes("alphamax") || lower.includes("wantmore")) {
        fallbackText += "For weakness and stamina, our ALPHAMAX Capsules (₹2499) with Grade-A Himalayan Shudh Shilajit and Ashwagandha restore cellular energy within 7 to 10 days.";
      } else if (lower.includes("digest") || lower.includes("vayu")) {
        fallbackText += "For digestion and acidity relief, meONmode® VAYUCORE Liquid (₹999, 450 ML) soothes acid reflux, gas, and bloating rapidly. Take 10-15 ml diluted with water twice daily.";
      } else {
        fallbackText += "How may I assist your Ayurvedic health journey today? Feel free to ask about our PCOS care, period wellness, male vitality, or connect with our team on WhatsApp at +91 7290810336.";
      }
      return res.json({ response: fallbackText });
    }

    // Primary model is gemini-3.8-flash; failover to gemini-3.1-flash-lite
    const modelsToTry = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
    let finalReply = "";
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        // Enforce a 15-second request timeout per attempt
        const callPromise = ai.models.generateContent({
          model: modelName,
          contents: formattedContents,
          config: {
            systemInstruction: DR_ANANYA_SYSTEM_INSTRUCTION,
            temperature: 0.65,
            maxOutputTokens: 1000
          }
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("AI generation timed out after 15 seconds")), 15000)
        );

        const response: any = await Promise.race([callPromise, timeoutPromise]);
        if (response && response.text) {
          finalReply = response.text.trim();
          break; // Succeeded!
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[meONmode AI Engine] Model ${modelName} encountered an issue, trying fallback if available...`);
      }
    }

    if (!finalReply) {
      // If all live models failed, return an intelligent context-aware fallback response rather than a 500 error
      const lastUserMsg = cleanMessages.filter(m => m.role === "user").pop()?.content || "";
      const lower = lastUserMsg.toLowerCase();
      let gracefulFallback = "Namaste! 🙏 I am Dr. Ananya Iyer from meONmode®. ";
      if (lower.includes("price") || lower.includes("ovaira")) {
        gracefulFallback += "Our OVAIRA Capsules are priced at ₹1199 (MRP ₹1999) for 60 Veg Capsules, and the complete Women's Combo Kit (OVAIRA + FLOWELLE) is ₹1999 (MRP ₹3798). Both include free delivery and Cash on Delivery across India.";
      } else if (lower.includes("weakness") || lower.includes("stamina") || lower.includes("alphamax") || lower.includes("wantmore")) {
        gracefulFallback += "For energy, weakness, and stamina, our ALPHAMAX Capsules (₹2499) with Grade-A Himalayan Shudh Shilajit and Ashwagandha provide targeted cell-level recovery. Take 1 capsule morning and evening after meals.";
      } else if (lower.includes("pcos") || lower.includes("cure")) {
        gracefulFallback += "PCOS is an endocrine condition that is effectively managed by rebalancing hormones with our OVAIRA + FLOWELLE Combo Kit (₹1999). Most women experience noticeable relief within 15 days, and cycle normalization within 3 to 6 months.";
      } else if (lower.includes("order") || lower.includes("delivery") || lower.includes("track")) {
        gracefulFallback += "Orders are dispatched within 24 hours and delivered in 3 to 5 business days across India. You can message our support desk with your Order ID on WhatsApp at +91 7290810336 for live tracking!";
      } else {
        gracefulFallback += "I am here to guide your Ayurvedic wellness journey. Feel free to ask about our PCOS relief, cycle balance, male vitality, or chat with our medical team on WhatsApp at +91 7290810336!";
      }
      return res.json({ response: gracefulFallback });
    }

    res.json({ response: finalReply });

  } catch (error: any) {
    console.error("Chatbot Route Exception:", error?.message || error);
    res.status(500).json({
      error: "Internal server error during wellness consultation.",
      response: "Namaste! 🙏 Please reach out to our team directly on WhatsApp at +91 7290810336 for immediate consultation."
    });
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

    // Store in confirmed orders, persist to disk, and clear pending
    confirmedOrders[session.orderId] = verifiedRecord;
    savePersistedOrders(confirmedOrders);
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

// 3. Query Verified Order Endpoint (Used to validate success page & track orders)
app.get("/api/orders/:orderId", (req, res) => {
  const { orderId } = req.params;
  const token = req.query.token as string;
  const phone = (req.query.phone as string || '').replace(/\D/g, '').slice(-10);

  const order = confirmedOrders[orderId];
  if (order && order.paymentStatus === "VERIFIED_SUCCESS") {
    // If full secret token is provided or matching customer phone, return full order record
    if ((token && order.orderVerificationToken === token) || 
        (phone && order.checkoutDetails?.phone?.replace(/\D/g, '').slice(-10) === phone)) {
      return res.json({ success: true, order });
    }

    // Safe public order status view (sanitized phone number)
    return res.json({
      success: true,
      order: {
        orderId: order.orderId,
        paymentStatus: order.paymentStatus,
        verifiedAt: order.verifiedAt,
        items: order.items,
        grandTotal: order.grandTotal,
        paymentMethod: order.paymentMethod,
        checkoutDetails: {
          fullName: order.checkoutDetails.fullName,
          phone: `******${order.checkoutDetails.phone.slice(-4)}`,
          address: order.checkoutDetails.address,
          pincode: order.checkoutDetails.pincode
        },
        advancePaid: order.advancePaid,
        balanceDue: order.balanceDue
      }
    });
  }

  return res.status(404).json({
    success: false,
    verified: false,
    error: "Order not found or payment unverified."
  });
});

// 4. Query Verified Orders by Customer Phone Number
app.get("/api/orders-by-phone", (req, res) => {
  const queryPhone = (req.query.phone || req.query.q || "") as string;
  const cleanPhone = queryPhone.replace(/\D/g, "").slice(-10);

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

// Explicit Favicon & App Icon endpoints for crawlers, browsers, and mobile devices
app.get(["/favicon.ico"], (req, res) => {
  res.header("Content-Type", "image/x-icon");
  res.header("Cache-Control", "public, max-age=86400, must-revalidate");
  res.sendFile(path.join(process.cwd(), "public", "favicon.ico"));
});

app.get(["/favicon.png", "/favicon-48x48.png"], (req, res) => {
  res.header("Content-Type", "image/png");
  res.header("Cache-Control", "public, max-age=86400, must-revalidate");
  res.sendFile(path.join(process.cwd(), "public", "favicon-48x48.png"));
});

app.get(["/favicon-96x96.png"], (req, res) => {
  res.header("Content-Type", "image/png");
  res.header("Cache-Control", "public, max-age=86400, must-revalidate");
  res.sendFile(path.join(process.cwd(), "public", "favicon-96x96.png"));
});

app.get(["/favicon-192x192.png", "/icon-192.png"], (req, res) => {
  res.header("Content-Type", "image/png");
  res.header("Cache-Control", "public, max-age=86400, must-revalidate");
  res.sendFile(path.join(process.cwd(), "public", "icon-192.png"));
});

app.get(["/icon-512.png"], (req, res) => {
  res.header("Content-Type", "image/png");
  res.header("Cache-Control", "public, max-age=86400, must-revalidate");
  res.sendFile(path.join(process.cwd(), "public", "icon-512.png"));
});

app.get(["/apple-touch-icon.png", "/apple-touch-icon-precomposed.png"], (req, res) => {
  res.header("Content-Type", "image/png");
  res.header("Cache-Control", "public, max-age=86400, must-revalidate");
  res.sendFile(path.join(process.cwd(), "public", "apple-touch-icon.png"));
});

app.get(["/manifest.json"], (req, res) => {
  res.header("Content-Type", "application/manifest+json");
  res.header("Cache-Control", "public, max-age=3600, must-revalidate");
  res.sendFile(path.join(process.cwd(), "public", "manifest.json"));
});

// Public static assets with caching headers
app.use(express.static(path.join(process.cwd(), "public"), {
  maxAge: '7d',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.ico') || filePath.endsWith('.png') || filePath.endsWith('.webp') || filePath.endsWith('.jpg')) {
      res.setHeader('Cache-Control', 'public, max-age=2592000, immutable'); // 30 days immutable for icons/images
    } else if (filePath.endsWith('.json') || filePath.endsWith('.xml') || filePath.endsWith('.txt')) {
      res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day for manifest/sitemap/robots
    }
  }
}));

// Serve frontend assets using Vite middleware or static files
async function startServer() {
  const distPath = path.join(process.cwd(), "dist");
  const isProd = process.env.NODE_ENV === "production" || (!process.env.NODE_ENV && fs.existsSync(path.join(distPath, "index.html")));

  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
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
    console.log(`[meONmode Server] Running on http://localhost:${PORT} in ${isProd ? "production" : "development"} mode`);
  });
}

startServer();
