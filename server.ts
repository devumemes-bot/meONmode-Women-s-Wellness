import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

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

// SEO Sitemap & Robots.txt endpoints
app.get("/sitemap.xml", (req, res) => {
  res.header("Content-Type", "application/xml");
  res.sendFile(path.join(process.cwd(), "public", "sitemap.xml"));
});

app.get("/robots.txt", (req, res) => {
  res.header("Content-Type", "text/plain");
  res.sendFile(path.join(process.cwd(), "public", "robots.txt"));
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
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[meONmode Server] Running on http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer();
