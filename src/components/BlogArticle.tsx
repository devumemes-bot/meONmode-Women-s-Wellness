import React, { useState, useEffect } from 'react';
import { BlogPost, Product } from '../types';
import { PRODUCTS, MENS_PRODUCTS, optimizeCloudinaryUrl } from '../data';
import { BLOG_POSTS } from '../blogData';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  User, 
  Share2, 
  Check, 
  Copy, 
  MessageCircle, 
  Send, 
  Lightbulb, 
  AlertTriangle, 
  FlaskConical, 
  ShoppingCart, 
  ChevronDown, 
  ChevronUp, 
  ArrowUp,
  Sparkles,
  BookOpen,
  Tag
} from 'lucide-react';

interface BlogArticleProps {
  post: BlogPost;
  onGoBackToBlog: () => void;
  onSelectArticle: (slug: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const BlogArticle: React.FC<BlogArticleProps> = ({
  post,
  onGoBackToBlog,
  onSelectArticle,
  onSelectProduct,
  onAddToCart,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [guideName, setGuideName] = useState("");
  const [guidePhone, setGuidePhone] = useState("");
  const [openFaqIndices, setOpenFaqIndices] = useState<number[]>([0]);

  // Find related product
  const allProducts = [...PRODUCTS, ...MENS_PRODUCTS];
  const relatedProduct = allProducts.find(p => p.id === post.relatedProductId) || PRODUCTS[0];

  // Scroll listener for reading progress bar & Back to Top (batched with rAF and passive listener)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0) {
            const currentProgress = (scrollY / totalHeight) * 100;
            setScrollProgress(currentProgress);
          }
          setShowBackToTop(scrollY > 500);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShareCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndices(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleGuideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guidePhone.trim()) {
      alert("Please enter a valid WhatsApp phone number.");
      return;
    }
    const message = `Hello meONmode Team, My Name is ${guideName || 'Customer'} (Phone: ${guidePhone}). Please send me the FREE 30-Day Wellness Guide for ${post.title}.`;
    const url = `https://api.whatsapp.com/send?phone=917290810336&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // Article Schema JSON-LD
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.metaDescription,
    "image": post.featuredImage,
    "datePublished": post.datePublished,
    "author": {
      "@type": "Organization",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "meONmode",
      "url": "https://meonmode.com",
      "logo": "https://meonmode.com/logo.png"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://meonmode.com/blog/${post.slug}`
    }
  };

  // FAQ Schema JSON-LD
  const faqSchema = post.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1A1A1A] font-sans relative pb-16">
      {/* Dynamic SEO JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-neutral-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-[#8B4A5A] to-[#E8621A] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Back To Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 bg-[#E8621A] hover:bg-[#d55210] text-white p-3.5 rounded-full shadow-2xl transition-all cursor-pointer active:scale-95 animate-bounce"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Article Top Nav & Breadcrumb */}
      <div className="bg-white border-b border-[#E0D8D0] sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <button
            onClick={onGoBackToBlog}
            className="flex items-center gap-2 text-xs font-bold text-[#8B4A5A] hover:text-[#E8621A] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </button>

          {/* Breadcrumb Links */}
          <nav className="hidden md:flex items-center gap-1.5 text-[11px] text-neutral-500 font-medium truncate">
            <button onClick={onGoBackToBlog} className="hover:underline">Home</button>
            <span>&gt;</span>
            <button onClick={onGoBackToBlog} className="hover:underline">Blog</button>
            <span>&gt;</span>
            <span className="text-[#8B4A5A] font-bold">{post.category}</span>
            <span>&gt;</span>
            <span className="truncate max-w-[200px] text-neutral-800">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* Article Header Container */}
      <header className="bg-white border-b border-[#E0D8D0] py-8 md:py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-4 text-left">
          {/* Category Badge */}
          <div className="flex items-center gap-2">
            <span className="bg-[#8B4A5A] text-white text-[11px] font-black uppercase px-3.5 py-1 rounded-full tracking-wider font-mono">
              {post.category}
            </span>
            <span className="text-xs text-[#E8621A] font-extrabold bg-[#E8621A]/10 px-2.5 py-0.5 rounded">
              Verified Ayurvedic Guide
            </span>
          </div>

          {/* H1 Title */}
          <h1 className="font-serif text-2xl md:text-4xl font-extrabold text-[#1A1A1A] leading-tight tracking-tight">
            {post.title}
          </h1>

          {/* Subtitle */}
          <p className="text-sm md:text-base text-neutral-600 font-medium leading-relaxed">
            {post.subtitle}
          </p>

          {/* Meta Info Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E0D8D0]/60 text-xs text-neutral-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-bold text-[#1A1A1A]">
                <User className="w-4 h-4 text-[#8B4A5A]" />
                {post.author}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#E8621A]" />
                {post.datePublished}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#8B4A5A]" />
                {post.readTime}
              </span>
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-2">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${post.title} - Read more: ${window.location.href}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-full transition-all cursor-pointer"
                title="Share on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <button
                onClick={handleShareCopy}
                className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 p-2 rounded-full transition-all cursor-pointer"
                title="Copy Article Link"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Featured Banner Image */}
          <div className="pt-4">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#E0D8D0] max-h-[420px]">
              <img
                src={post.featuredImage.includes('unsplash.com') ? post.featuredImage.replace('w=1200', 'w=900') : post.featuredImage}
                alt={post.title}
                loading="lazy"
                decoding="async"
                width="800"
                height="420"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout Grid */}
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          
          {/* ARTICLE BODY (70% on desktop) */}
          <article className="lg:col-span-8 max-w-[680px] mx-auto lg:mx-0 space-y-10 text-[#444] text-base leading-relaxed">
            
            {/* Sections Loop */}
            {post.contentSections.map((section) => (
              <section key={section.id} id={section.id} className="space-y-5 scroll-mt-24">
                {/* H2 Title */}
                <h2 className="font-serif text-xl md:text-2xl font-bold text-[#6B2A3A] border-b-2 border-[#8B4A5A]/20 pb-2">
                  {section.title}
                </h2>

                {/* Paragraphs */}
                {section.paragraphs?.map((p, idx) => (
                  <p key={idx} className="text-[#444] text-base leading-relaxed">
                    {p}
                  </p>
                ))}

                {/* SubSections H3 */}
                {section.subSections?.map((sub, idx) => (
                  <div key={idx} className="space-y-2 pt-2">
                    <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                      {sub.title}
                    </h3>
                    {sub.paragraphs.map((sp, sidx) => (
                      <p key={sidx} className="text-[#444] text-sm leading-relaxed">
                        {sp}
                      </p>
                    ))}
                  </div>
                ))}

                {/* Bullets List */}
                {section.bullets && (
                  <ul className="space-y-2.5 my-4 pl-2">
                    {section.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-[#1A1A1A]">
                        <span className="w-2 h-2 rounded-full bg-[#8B4A5A] mt-2 shrink-0"></span>
                        <span className="leading-relaxed">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Special Content Boxes */}

                {/* a) Tip Box */}
                {section.tipBox && (
                  <div className="bg-[#FFF3EE] border-l-4 border-l-[#E8621A] p-4 md:p-5 rounded-r-xl space-y-1.5 shadow-sm my-6">
                    <h4 className="font-bold text-sm text-[#E8621A] flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-[#E8621A]" />
                      <span>{section.tipBox.title}</span>
                    </h4>
                    <p className="text-xs text-neutral-800 leading-relaxed font-medium">
                      {section.tipBox.text}
                    </p>
                  </div>
                )}

                {/* b) Warning Box */}
                {section.warningBox && (
                  <div className="bg-[#FDF5F3] border-l-4 border-l-[#8B4A5A] p-4 md:p-5 rounded-r-xl space-y-1.5 shadow-sm my-6">
                    <h4 className="font-bold text-sm text-[#8B4A5A] flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-[#8B4A5A]" />
                      <span>{section.warningBox.title}</span>
                    </h4>
                    <p className="text-xs text-neutral-800 leading-relaxed font-medium">
                      {section.warningBox.text}
                    </p>
                  </div>
                )}

                {/* c) Research Box */}
                {section.researchBox && (
                  <div className="bg-[#F5F0EB] border-l-4 border-l-[#1A1A1A] p-4 md:p-5 rounded-r-xl space-y-1.5 shadow-sm my-6">
                    <h4 className="font-bold text-sm text-[#1A1A1A] flex items-center gap-2">
                      <FlaskConical className="w-4 h-4 text-[#1A1A1A]" />
                      <span>{section.researchBox.title}</span>
                    </h4>
                    <p className="text-xs text-neutral-800 leading-relaxed font-medium">
                      {section.researchBox.text}
                    </p>
                  </div>
                )}

                {/* d) Product Mention Card */}
                {section.productMention && (
                  <div className="bg-white border-t-4 border-t-[#E8621A] border-x border-b border-[#E0D8D0] p-5 rounded-2xl shadow-md my-8 flex flex-col sm:flex-row items-center justify-between gap-5">
                    <div className="space-y-2 flex-1 text-left">
                      <span className="text-[10px] uppercase font-black tracking-widest text-[#E8621A] font-mono">
                        Recommended Ayurvedic Remedy
                      </span>
                      <h4 className="font-serif text-lg font-bold text-[#1A1A1A]">
                        {relatedProduct.name}
                      </h4>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        {section.productMention.highlightReason}
                      </p>
                      <div className="flex items-center gap-2 pt-1 font-mono">
                        <span className="text-base font-extrabold text-[#1A1A1A]">₹{relatedProduct.price}</span>
                        <span className="text-xs text-neutral-400 line-through">₹{relatedProduct.mrp}</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">SAVE {Math.round((1 - relatedProduct.price/relatedProduct.mrp)*100)}%</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 shrink-0 w-full sm:w-auto">
                      <img
                        src={optimizeCloudinaryUrl(relatedProduct.images[0], 160)}
                        alt={relatedProduct.name}
                        loading="lazy"
                        decoding="async"
                        width="80"
                        height="80"
                        className="w-20 h-20 object-contain rounded-lg border border-neutral-100 p-1"
                      />
                      <button
                        onClick={() => onSelectProduct(relatedProduct)}
                        className="w-full bg-[#E8621A] hover:bg-[#d55210] text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow transition-all cursor-pointer whitespace-nowrap"
                      >
                        Order Karo →
                      </button>
                    </div>
                  </div>
                )}

                {/* e) Table Styling */}
                {section.table && (
                  <div className="overflow-x-auto my-6 rounded-xl border border-[#E0D8D0]">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-[#8B4A5A] text-white font-bold">
                          {section.table.headers.map((h, hidx) => (
                            <th key={hidx} className="p-3 border-b border-[#E0D8D0]">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.table.rows.map((row, ridx) => (
                          <tr 
                            key={ridx} 
                            className={ridx % 2 === 0 ? 'bg-white' : 'bg-[#FAF7F2]'}
                          >
                            {row.map((cell, cidx) => (
                              <td key={cidx} className="p-3 border-b border-[#E0D8D0]/60 text-neutral-700 font-medium">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              </section>
            ))}

            {/* f) FAQ Accordion Section */}
            {post.faqs.length > 0 && (
              <section className="pt-8 border-t border-[#E0D8D0] space-y-6">
                <h3 className="font-serif text-2xl font-bold text-[#6B2A3A] flex items-center gap-2">
                  <span>Aksar Poochhe Jane Wale Sawaal (FAQ)</span>
                </h3>

                <div className="space-y-3">
                  {post.faqs.map((faq, idx) => {
                    const isOpen = openFaqIndices.includes(idx);
                    return (
                      <div
                        key={idx}
                        className="bg-white border border-[#E0D8D0] rounded-xl overflow-hidden transition-all shadow-sm"
                      >
                        <button
                          onClick={() => toggleFaq(idx)}
                          className="w-full p-4 text-left font-bold text-sm text-[#1A1A1A] flex items-center justify-between gap-3 hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                        >
                          <span>{faq.question}</span>
                          <span className="text-[#E8621A]">
                            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </span>
                        </button>

                        {isOpen && (
                          <div className="p-4 pt-0 text-xs text-neutral-600 leading-relaxed border-t border-[#E0D8D0]/40 bg-[#FAF7F2]/50">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ARTICLE FOOTER INSIDE LEFT COLUMN */}
            <div className="pt-8 border-t-2 border-[#8B4A5A]/20 space-y-8">
              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-neutral-500 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-[#8B4A5A]" />
                  Tags:
                </span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-white border border-[#E0D8D0] text-[#8B4A5A] font-bold px-3 py-1 rounded-full text-xs hover:border-[#8B4A5A] transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Share This Article */}
              <div className="bg-white p-6 rounded-2xl border border-[#E0D8D0] space-y-3 text-center md:text-left">
                <h4 className="font-serif text-base font-bold text-[#1A1A1A]">
                  Yeh Jankari Apne Apno Se Share Karo:
                </h4>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${post.title} - ${window.location.href}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow cursor-pointer transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Par Share Karein</span>
                  </a>

                  <button
                    onClick={handleShareCopy}
                    className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {/* Product CTA Banner */}
              <div className="p-8 bg-gradient-to-r from-[#8B4A5A] to-[#E8621A] text-white rounded-3xl shadow-xl space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase bg-white/20 px-3 py-1 rounded-full font-mono">
                    Special Wellness Offer
                  </span>
                  <h3 className="font-serif text-2xl font-extrabold">
                    {post.category.includes("Women") 
                      ? "OVAIRA aur FLOWELLE try karna chahti hain?" 
                      : "WANTMORE aur ALPHAMAX try karna chahte hain?"}
                  </h3>
                  <p className="text-white/90 text-xs">
                    Aaj order karein aur paayein 30-Day Ayurvedic Wellness Guide FREE saath mein.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => onSelectProduct(relatedProduct)}
                    className="bg-white text-[#8B4A5A] hover:bg-neutral-100 font-extrabold text-xs py-3 px-6 rounded-xl shadow-lg cursor-pointer transition-all active:scale-95"
                  >
                    Order Karo — meonmode.com
                  </button>

                  <a
                    href="https://api.whatsapp.com/send?phone=917290810336&text=Hello%20meONmode%20Team%2C%20mujhe%20order%20place%20karna%20hai."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 px-6 rounded-xl shadow cursor-pointer transition-colors flex items-center gap-2"
                  >
                    <span>WhatsApp Order</span>
                  </a>
                </div>
              </div>

              {/* Comments / WhatsApp Inquiry */}
              <div className="bg-white p-6 rounded-2xl border border-[#E0D8D0] text-center space-y-2">
                <h4 className="font-serif text-base font-bold text-[#1A1A1A]">Koi Sawaal Ya Doubt Hai?</h4>
                <p className="text-xs text-neutral-500">
                  Hamare Certified Ayurvedic Pharmacists se direct WhatsApp par poodhiye:
                </p>
                <a
                  href="https://api.whatsapp.com/send?phone=917290810336&text=Hello%20meONmode%20Team%2C%20mujhe%20is%20article%20par%20sawaal%20hai."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-emerald-700 font-extrabold text-xs hover:underline pt-1"
                >
                  <Send className="w-4 h-4" />
                  <span>+91 72908 10336 Par WhatsApp Karein</span>
                </a>
              </div>

            </div>

          </article>

          {/* ARTICLE SIDEBAR (30% on desktop) */}
          <aside className="lg:col-span-4 space-y-8 sticky top-20">
            
            {/* a) PRODUCT RECOMMENDATION BOX */}
            <div className="bg-white rounded-2xl border border-[#E0D8D0] p-6 shadow-md space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#E8621A] font-mono block">
                Iss Article Se Related Product
              </span>

              <div className="space-y-3 text-center">
                <div className="w-28 h-28 mx-auto p-2 bg-[#FAF7F2] rounded-xl border border-neutral-100">
                  <img
                    src={optimizeCloudinaryUrl(relatedProduct.images[0], 240)}
                    alt={relatedProduct.name}
                    loading="lazy"
                    decoding="async"
                    width="112"
                    height="112"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div>
                  <h4 className="font-serif text-lg font-bold text-[#1A1A1A]">{relatedProduct.name}</h4>
                  <p className="text-xs text-[#8B4A5A] font-semibold">{relatedProduct.subtitle}</p>
                </div>

                <div className="flex items-center justify-center gap-2 font-mono">
                  <span className="text-xl font-black text-[#1A1A1A]">₹{relatedProduct.price}</span>
                  <span className="text-xs text-neutral-400 line-through">₹{relatedProduct.mrp}</span>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => {
                      onAddToCart(relatedProduct);
                    }}
                    className="w-full bg-[#E8621A] hover:bg-[#d55210] text-white font-extrabold text-xs py-3 rounded-xl shadow cursor-pointer transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Cart Mein Daalo</span>
                  </button>

                  <a
                    href={`https://api.whatsapp.com/send?phone=917290810336&text=Hello%20meONmode%20Team%2C%20mujhe%20${encodeURIComponent(relatedProduct.name)}%20order%20karna%20hai.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2.5 rounded-xl shadow cursor-pointer transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Par Order</span>
                  </a>
                </div>
              </div>
            </div>

            {/* b) TABLE OF CONTENTS (Sticky Jump Links) */}
            <div className="bg-white rounded-2xl border border-[#E0D8D0] p-6 shadow-sm space-y-3">
              <h4 className="font-serif text-sm font-bold text-[#1A1A1A] flex items-center gap-2 border-b border-[#E0D8D0] pb-2">
                <BookOpen className="w-4 h-4 text-[#8B4A5A]" />
                <span>Is Article Mein:</span>
              </h4>

              <nav className="space-y-2 text-xs font-medium">
                {post.tableOfContents.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block text-neutral-600 hover:text-[#E8621A] transition-colors truncate"
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </div>

            {/* c) FREE GUIDE BOX */}
            <div className="bg-gradient-to-br from-[#2D120B] to-[#4A1D05] text-white rounded-2xl p-6 shadow-lg space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-[#E8621A] font-mono tracking-widest">
                  FREE Wellness Download
                </span>
                <h4 className="font-serif text-lg font-bold text-white">
                  FREE Wellness Guide Chahiye?
                </h4>
                <p className="text-white/70 text-xs">
                  {post.category.includes("Women") ? "OVAIRA/FLOWELLE" : "WANTMORE/ALPHAMAX"} ke saath 30-Day complete plan aapke WhatsApp par paayein.
                </p>
              </div>

              <form onSubmit={handleGuideSubmit} className="space-y-3 text-xs">
                <input
                  type="text"
                  value={guideName}
                  onChange={(e) => setGuideName(e.target.value)}
                  placeholder="Aapka Naam"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-[#E8621A]"
                />
                <input
                  type="tel"
                  value={guidePhone}
                  onChange={(e) => setGuidePhone(e.target.value)}
                  placeholder="WhatsApp Number (10 digit)"
                  maxLength={10}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-[#E8621A]"
                />
                <button
                  type="submit"
                  className="w-full bg-[#E8621A] hover:bg-[#d55210] text-white font-extrabold py-3 rounded-xl shadow cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Guide Bhejo WhatsApp Par</span>
                </button>
              </form>
            </div>

          </aside>

        </div>

        {/* RELATED ARTICLES SECTION */}
        <div className="mt-16 pt-12 border-t border-[#E0D8D0] space-y-6">
          <h3 className="font-serif text-2xl font-extrabold text-[#1A1A1A] text-center md:text-left">
            Yeh Bhi Padhiye (Related Articles)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {post.relatedSlugs.map((slug) => {
              const relPost = BLOG_POSTS.find(p => p.slug === slug);
              if (!relPost) return null;

              return (
                <div
                  key={relPost.slug}
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    onSelectArticle(relPost.slug);
                  }}
                  className="bg-white rounded-2xl border border-[#E0D8D0] p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase text-[#8B4A5A] font-mono">
                      {relPost.category}
                    </span>
                    <h4 className="font-serif text-base font-bold text-[#1A1A1A] group-hover:text-[#E8621A] transition-colors leading-snug">
                      {relPost.title}
                    </h4>
                    <p className="text-xs text-neutral-500 line-clamp-2">
                      {relPost.excerpt}
                    </p>
                  </div>

                  <span className="text-xs font-bold text-[#E8621A] pt-4 block group-hover:translate-x-1 transition-transform">
                    Padhiye →
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
};
