import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';

interface WhatsAppDeskModalProps {
  showWhatsAppChat: boolean;
  setShowWhatsAppChat: (val: boolean) => void;
  lastOrderId: string | null;
}

export const WhatsAppDeskModal: React.FC<WhatsAppDeskModalProps> = ({
  showWhatsAppChat,
  setShowWhatsAppChat,
  lastOrderId
}) => {
  const [chatTab, setChatTab] = useState<'ai' | 'whatsapp'>('whatsapp');
  const [whatsAppTopic, setWhatsAppTopic] = useState<string>('general');
  const [whatsAppMessage, setWhatsAppMessage] = useState<string>('');
  
  // AI Doctor State
  const [aiMessages, setAiMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: "Namaste! 🙏 I am Dr. Ananya. How may we guide your Ayurvedic hormone balance, PCOS relief, stamina, or order dispatch tracking today?"
    }
  ]);
  const [aiInput, setAiInput] = useState<string>('');
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (showWhatsAppChat && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiMessages, isAiTyping, showWhatsAppChat, chatTab]);

  const handleSendAiMessage = async (customText?: string) => {
    const textToSend = customText || aiInput;
    if (!textToSend.trim()) return;

    const updatedMessages = [...aiMessages, { role: 'user' as const, content: textToSend }];
    setAiMessages(updatedMessages);
    if (!customText) setAiInput('');
    setIsAiTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages })
      });

      if (!res.ok) {
        throw new Error('Failed to fetch from wellness engine');
      }

      const data = await res.json();
      setAiMessages(prev => [...prev, { role: 'assistant' as const, content: data.response }]);
    } catch (err) {
      console.error("AI Consult Error:", err);
      // Fallback friendly message
      setAiMessages(prev => [
        ...prev,
        {
          role: 'assistant' as const,
          content: "Thank you for consulting. I'm experiencing a brief connection delay with our AI engine. Feel free to ask about our PCOS Combo Kit (₹1999), OVAIRA (₹1199) or FLOWELLE (₹999) prices, dosages, or unboxing policy, or select the WhatsApp tab to chat directly with our medical support desk!"
        }
      ]);
    } finally {
      setIsAiTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Chat Desk Card */}
      {showWhatsAppChat && (
        <div className="mb-4 w-[320px] sm:w-[380px] bg-neutral-950/95 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-left backdrop-blur-md animate-fade-in z-50">
          {/* Widget Header */}
          <div className="bg-gradient-to-r from-emerald-950 via-[#1C110D] to-[#4A1D05] p-4 border-b border-white/10 relative">
            <button
              type="button"
              onClick={() => setShowWhatsAppChat(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white cursor-pointer hover:scale-110 transition-all p-1 rounded-full bg-black/40 border border-white/5"
              aria-label="Close Chat Widget"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B3B15] to-[#4A1D05] flex items-center justify-center border border-white/20 text-white font-serif text-lg font-extrabold shadow-inner overflow-hidden">
                  🌱
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-neutral-950 animate-pulse"></span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white tracking-wide">meONmode Wellness Desk</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider font-mono">Advisors Online</span>
                </div>
              </div>
            </div>

            {/* Tab Selector Buttons */}
            <div className="flex gap-2 mt-4 bg-black/40 p-1 rounded-xl border border-white/5">
              <button
                type="button"
                onClick={() => setChatTab('ai')}
                className={`flex-grow text-center py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  chatTab === 'ai'
                    ? 'bg-[#E5A93C] text-[#2D120B]'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                🩺 Consult Dr. Ananya (AI)
              </button>
              <button
                type="button"
                onClick={() => setChatTab('whatsapp')}
                className={`flex-grow text-center py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  chatTab === 'whatsapp'
                    ? 'bg-[#E5A93C] text-[#2D120B]'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                💬 WhatsApp Desk
              </button>
            </div>
          </div>

          {/* AI Consultant Chat Mode */}
          {chatTab === 'ai' && (
            <>
              {/* Chat Log Window */}
              <div className="p-4 space-y-4 h-[300px] overflow-y-auto custom-scrollbar flex flex-col">
                {aiMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col max-w-[85%] ${
                      msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'
                    }`}
                  >
                    <div
                      className={`p-3 rounded-2xl leading-relaxed text-xs leading-normal font-sans shadow-sm border ${
                        msg.role === 'user'
                          ? 'bg-[#5C1D13] border-[#8B3B15]/20 text-[#FAF6F0] rounded-tr-none'
                          : 'bg-white/5 border-white/5 text-neutral-200 rounded-tl-none'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[8px] text-neutral-500 font-mono mt-1 px-1">
                      {msg.role === 'user' ? 'You' : 'Dr. Ananya'}
                    </span>
                  </div>
                ))}

                {/* Pulsing Loading dots for AI Typing */}
                {isAiTyping && (
                  <div className="flex flex-col items-start max-w-[85%] self-start">
                    <div className="bg-white/5 border border-white/5 text-neutral-200 text-xs px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                    <span className="text-[8px] text-neutral-500 font-mono mt-1 px-1">Dr. Ananya is analyzing...</span>
                  </div>
                )}
                
                {/* Invisible scroll anchor */}
                <div ref={chatEndRef} />
              </div>

              {/* Quick Helper Suggestion Chips */}
              <div className="px-4 pb-2 pt-1 flex flex-wrap gap-1.5 border-t border-white/5 max-h-[80px] overflow-y-auto custom-scrollbar">
                {[
                  "🌸 PCOS Treatment Guidance?",
                  "🩸 How to use OVAIRA/FLOWELLE?",
                  "⚡ Men's Vitality/Stamina?",
                  "📦 Mandates for Returns?"
                ].map((chipText, cidx) => (
                  <button
                    key={cidx}
                    type="button"
                    onClick={() => handleSendAiMessage(chipText)}
                    className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-white/80 hover:text-white px-2.5 py-1 rounded-full text-[9px] font-bold transition-all cursor-pointer"
                  >
                    {chipText}
                  </button>
                ))}
              </div>

              {/* AI Input Box Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendAiMessage();
                }}
                className="p-3 bg-black/40 border-t border-white/5 flex gap-2 items-center"
              >
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="Ask Dr. Ananya about Ayurvedic wellness..."
                  className="flex-grow bg-white/5 border border-white/10 focus:border-[#E5A93C] focus:ring-1 focus:ring-[#E5A93C] rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none transition-all"
                  disabled={isAiTyping}
                />
                <button
                  type="submit"
                  disabled={isAiTyping || !aiInput.trim()}
                  className="bg-[#E5A93C] hover:bg-[#F2B94C] text-[#2D120B] p-2 rounded-xl transition-all active:scale-90 disabled:opacity-40 disabled:scale-100 flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}

          {/* Original WhatsApp Consult Mode */}
          {chatTab === 'whatsapp' && (
            <>
              {/* Widget Chat Body */}
              <div className="p-4 space-y-4 max-h-[340px] overflow-y-auto custom-scrollbar">
                {/* Doctor Chat Bubble */}
                <div className="space-y-1">
                  <div className="bg-white/5 border border-white/5 text-neutral-200 text-xs p-3.5 rounded-2xl rounded-tl-none leading-relaxed shadow-sm">
                    <p className="font-serif">Namaste! 🙏</p>
                    <p className="mt-1">I am Dr. Ananya. How may we guide your Ayurvedic hormone balance, PCOS relief, stamina, or order dispatch tracking today?</p>
                  </div>
                  <span className="text-[9px] text-neutral-500 font-mono pl-1 block">Just now • Auto Guidance</span>
                </div>

                {/* Support Category Selector List */}
                <div className="space-y-2">
                  <span className="block text-[9px] uppercase font-extrabold text-[#E5A93C] font-mono tracking-wider">Select a Topic:</span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {[
                      { id: 'general', label: '🌿 General Consult', text: "Hello meONmode Team, I would like to consult with a wellness advisor about my health journey." },
                      { id: 'pcos', label: '🌸 PCOS Specially Formulated', text: "Hello meONmode Team, I want to consult about PCOS Specially Formulated capsules and get custom guidance for hormone regularity." },
                      { id: 'women', label: '🩸 Women\'s Regularity', text: "Hello meONmode Team, I want to inquire about your Ayurvedic solutions for period regularity and uterine wellness." },
                      { id: 'men', label: '⚡ Men\'s Vigor & Stamina', text: "Hello meONmode Team, I want to consult about Men\'s Vitality solutions and daily stamina support." },
                      { id: 'order', label: '📦 Order Shipping Help', text: `Hello meONmode Team, I need help tracking my order status.${lastOrderId ? ` My Order ID is ${lastOrderId}.` : ''}` }
                    ].map((topic) => (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => {
                          setWhatsAppTopic(topic.id);
                          setWhatsAppMessage(topic.text);
                        }}
                        className={`w-full text-left text-xs font-bold px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                          whatsAppTopic === topic.id
                            ? 'bg-[#E5A93C]/10 border-[#E5A93C] text-[#E5A93C]'
                            : 'bg-white/5 text-white/80 border-white/5 hover:bg-white/10 hover:border-white/10'
                        }`}
                      >
                        {topic.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom message field */}
                <div className="space-y-1">
                  <label className="block text-[9px] uppercase font-extrabold text-neutral-400 font-mono tracking-wider">Or customize your message:</label>
                  <textarea
                    value={whatsAppMessage}
                    onChange={(e) => setWhatsAppMessage(e.target.value)}
                    placeholder="Type your wellness query or tracking request here..."
                    className="w-full bg-white/5 border border-white/10 focus:border-[#E5A93C] focus:ring-1 focus:ring-[#E5A93C] rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none transition-all resize-none min-h-[65px] custom-scrollbar"
                  />
                </div>
              </div>

              {/* Widget Action Footer */}
              <div className="p-4 bg-black/40 border-t border-white/5">
                <a
                  href={`https://api.whatsapp.com/send?phone=917290810336&text=${encodeURIComponent(
                    whatsAppMessage.trim() !== ""
                      ? whatsAppMessage
                      : whatsAppTopic === 'pcos'
                        ? "Hello meONmode Team, I want to consult about PCOS Specially Formulated capsules and get custom guidance for hormone regularity."
                        : whatsAppTopic === 'women'
                          ? "Hello meONmode Team, I want to inquire about your Ayurvedic solutions for period regularity and uterine wellness."
                          : whatsAppTopic === 'men'
                            ? "Hello meONmode Team, I want to consult about Men's Vitality solutions and daily stamina support."
                            : whatsAppTopic === 'order'
                              ? `Hello meONmode Team, I need help tracking my order status.${lastOrderId ? ` My Order ID is ${lastOrderId}.` : ''}`
                              : "Hello meONmode Team, I would like to consult with a wellness advisor about my health journey."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setTimeout(() => setShowWhatsAppChat(false), 500);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-3 rounded-xl transition-all shadow-lg shadow-emerald-950/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] active:scale-95 flex items-center justify-center gap-2 cursor-pointer border border-emerald-500/20"
                >
                  <MessageCircle className="w-4.5 h-4.5" />
                  <span>Start Direct Chat on WhatsApp</span>
                </a>
                <span className="block text-center text-[8px] text-neutral-500 mt-2 font-mono uppercase tracking-wider">No appointment required • Privacy guaranteed</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setShowWhatsAppChat(!showWhatsAppChat)}
        className={`group relative w-14 h-14 rounded-full flex items-center justify-center border-2 shadow-2xl transition-all duration-300 transform active:scale-90 cursor-pointer ${
          showWhatsAppChat
            ? 'bg-neutral-900 border-white/20 text-white rotate-90'
            : 'bg-emerald-600 hover:bg-emerald-500 border-white/10 hover:scale-110 shadow-[0_4px_24px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_32px_rgba(16,185,129,0.5)] text-white'
        }`}
        aria-label="Toggle WhatsApp Chat Desk"
      >
        {showWhatsAppChat ? (
          <X className="w-6 h-6 transition-transform duration-300" />
        ) : (
          <>
            {/* Gold Ring Pulse Outer Glow */}
            <span className="absolute inset-0 rounded-full border-2 border-emerald-400/20 animate-ping pointer-events-none"></span>
            
            <MessageCircle className="w-7 h-7 text-white" />
            
            {/* Online indicator badge */}
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-amber-500 rounded-full border-2 border-neutral-950 flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-neutral-950 rounded-full animate-pulse"></span>
            </span>

            {/* Side tooltip shown on desktop hover */}
            <div className="absolute right-16 bg-neutral-900/95 border border-white/10 backdrop-blur-md text-[#E5A93C] font-extrabold text-[10px] py-2 px-3.5 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap hidden md:flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              <span>Consult Dr. Ananya (AI Expert)</span>
            </div>
          </>
        )}
      </button>
    </div>
  );
};
