import React, { useState, useMemo } from 'react';
import { BLOG_POSTS } from '../blogData';
import { AYURVEDIC_HERBS, AyurvedicHerb } from '../ingredientData';
import { BlogPost, Product } from '../types';
import { PRODUCTS, MENS_PRODUCTS } from '../data';
import { getOptimizedImageUrl } from '../blogImages';
import { 
  Search, 
  Clock, 
  ChevronRight, 
  BookOpen, 
  Sparkles, 
  ArrowLeft,
  Calendar,
  User,
  Tag,
  Leaf,
  FlaskConical,
  Activity,
  ShieldCheck,
  CheckCircle2,
  X,
  Send,
  MessageCircle,
  ExternalLink,
  Layers,
  Sparkle
} from 'lucide-react';

interface BlogListingProps {
  onSelectArticle: (slug: string) => void;
  onGoHome: () => void;
  onSelectProduct: (product: Product) => void;
}

export const BlogListing: React.FC<BlogListingProps> = ({
  onSelectArticle,
  onGoHome,
  onSelectProduct,
}) => {
  // Navigation / Tab state
  const [activeTab, setActiveTab] = useState<'articles' | 'herbs'>('articles');

  // Article filters
  const [selectedCategory, setSelectedCategory] = useState<string>("Saare Articles");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const postsPerPage = 9;

  // Herb filters & modal
  const [selectedHerbCategory, setSelectedHerbCategory] = useState<string>("All Herbs");
  const [activeHerbModal, setActiveHerbModal] = useState<AyurvedicHerb | null>(null);

  // Free Guide Download State
  const [guidePhone, setGuidePhone] = useState<string>("");
  const [guideSubmitted, setGuideSubmitted] = useState<boolean>(false);

  const articleCategories = [
    "Saare Articles",
    "Women's Wellness",
    "Men's Wellness",
    "Digestive Wellness",
    "Ayurvedic Ingredients",
    "Product Guides"
  ];

  const herbCategories = [
    { id: "All Herbs", label: "All Botanicals" },
    { id: "Womens-Health", label: "Women's Cycle & Hormones" },
    { id: "Mens-Vitality", label: "Men's Vitality & Ojas" },
    { id: "Detox-Metabolism", label: "Detox & Metabolism" },
    { id: "Rasayana", label: "Rasayana Rejuvenators" }
  ];

  // Helper to find product from ID
  const allProducts = useMemo(() => [...PRODUCTS, ...MENS_PRODUCTS], []);
  const findProduct = (id: string): Product | undefined => {
    return allProducts.find(p => p.id === id || p.id.includes(id));
  };

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter(post => {
      const matchesCategory = selectedCategory === "Saare Articles" || 
        post.category === selectedCategory ||
        (selectedCategory === "Women's Wellness" && (post.category === "Women's Health" || post.category === "Diet & Nutrition")) ||
        (selectedCategory === "Men's Wellness" && post.category === "Men's Health") ||
        (selectedCategory === "Ayurvedic Ingredients" && post.category === "Ayurvedic Herbs");
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = query === "" || 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(t => t.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Featured post detection
  const featuredPost = useMemo(() => {
    return BLOG_POSTS.find(p => p.featured === true) || BLOG_POSTS[0];
  }, []);

  // Filtered herbs
  const filteredHerbs = useMemo(() => {
    return AYURVEDIC_HERBS.filter(herb => {
      const matchesCategory = selectedHerbCategory === "All Herbs" || herb.category === selectedHerbCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = query === "" ||
        herb.name.toLowerCase().includes(query) ||
        herb.hindiName.toLowerCase().includes(query) ||
        herb.sanskritName.toLowerCase().includes(query) ||
        herb.botanicalName.toLowerCase().includes(query) ||
        herb.targetHealthGoals.some(g => g.toLowerCase().includes(query)) ||
        herb.summary.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [selectedHerbCategory, searchQuery]);

  // Pagination for posts
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage) || 1;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Free Guide Form Handler
  const handleGuideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = guidePhone.replace(/\D/g, '').slice(-10);
    if (cleanNumber.length === 10) {
      setGuideSubmitted(true);
      const text = encodeURIComponent(
        `Namaste meONmode Team! Mujhe 30-Day Ayurvedic Wellness Guide & Diet Plan PDF WhatsApp par chahiye. Phone: ${cleanNumber}`
      );
      window.open(`https://api.whatsapp.com/send?phone=917290810336&text=${text}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1A1A1A] font-sans">
      {/* Schema Markup for Blog Listing & Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Blog",
                "@id": "https://meonmode.com/blog#blog",
                "name": "meONmode Ayurvedic Wellness Content Hub",
                "description": "Expert Ayurvedic health tips in Hindi on PCOD, PCOS, white discharge, men's health, and hormonal balance.",
                "url": "https://meonmode.com/blog",
                "publisher": {
                  "@type": "Organization",
                  "name": "meONmode",
                  "url": "https://meonmode.com/",
                  "logo": "https://res.cloudinary.com/ukqeabxy/image/upload/v1787581390/ChatGPT_Image_Aug_24_2026_07_29_31_PM.png"
                }
              },
              {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Store Home",
                    "item": "https://meonmode.com/"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Ayurvedic Wellness Hub",
                    "item": "https://meonmode.com/blog"
                  }
                ]
              }
            ]
          })
        }}
      />

      {/* Top Header Navigation Bar with Home Link */}
      <nav className="bg-[#1C0D08] border-b border-white/10 text-white/80 py-3 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs">
          <button
            onClick={onGoHome}
            className="flex items-center gap-2 text-[#E5A93C] hover:text-white font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Wapas Store Par Jaayein (meonmode.com)</span>
          </button>

          <div className="flex items-center gap-2 text-[11px] text-white/60">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>AYUSH-Grounded Shastriya Research</span>
          </div>
        </div>
      </nav>

      {/* Hero Banner Section */}
      <header className="bg-gradient-to-b from-[#2D120B] via-[#38160D] to-[#4A1D05] text-white py-12 md:py-16 px-4 border-b border-[#E8621A]/30 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#E8621A]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-[#8B4A5A]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8621A]/20 border border-[#E8621A]/40 text-[#E8621A] text-xs font-black uppercase tracking-widest font-mono shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>meONmode® Ayurvedic Knowledge Hub</span>
          </div>
          
          <h1 className="font-serif text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Ayurvedic Health Ki Puri Jankari — Hindi Mein
          </h1>
          
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto font-medium leading-relaxed">
            PCOD, PCOS, White Discharge, Men's Health & Hormonal Balance — Expert Ayurvedic tips, botanical profiles & proven research free mein.
          </p>

          {/* Search Bar */}
          <div className="pt-3 max-w-lg mx-auto relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={activeTab === 'articles' ? "Search articles: PCOD, PCOS, Safed Pani, Shilajit, Kanchnar..." : "Search botanicals: Bauhinia, Shatavari, Guggul, Ashwagandha..."}
              className="w-full bg-white/10 backdrop-blur-md border border-white/25 hover:border-white/40 focus:border-[#E8621A] focus:bg-white text-white focus:text-[#1A1A1A] text-xs md:text-sm rounded-full pl-10 pr-10 py-3.5 focus:outline-none transition-all placeholder-white/60 focus:placeholder-neutral-400 font-medium shadow-inner"
            />
            <Search className="w-4 h-4 text-white/70 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Suggested Quick Search Chips */}
          <div className="pt-2 flex flex-wrap justify-center items-center gap-2 text-[11px] text-white/70">
            <span className="font-mono uppercase text-[10px] text-[#E5A93C] font-bold">Trending:</span>
            {[
              "PCOS vs PCOD",
              "Kanchnar Guggul",
              "White Discharge",
              "Ashwagandha & Shilajit",
              "PCOD Diet Plan"
            ].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSearchQuery(tag);
                  setActiveTab('articles');
                  setCurrentPage(1);
                }}
                className="bg-white/10 hover:bg-white/20 px-2.5 py-0.5 rounded-full border border-white/15 transition-colors cursor-pointer"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Hub Tabs Selector (Articles vs Botanical Library) */}
      <div className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E0D8D0] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-center gap-3 py-3">
          <button
            onClick={() => setActiveTab('articles')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs md:text-sm transition-all cursor-pointer ${
              activeTab === 'articles'
                ? 'bg-[#8B4A5A] text-white shadow-md'
                : 'bg-white text-neutral-700 border border-[#E0D8D0] hover:bg-neutral-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Health Guides & Deep-Dives ({filteredPosts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('herbs')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs md:text-sm transition-all cursor-pointer ${
              activeTab === 'herbs'
                ? 'bg-[#E8621A] text-white shadow-md'
                : 'bg-white text-neutral-700 border border-[#E0D8D0] hover:bg-neutral-100'
            }`}
          >
            <Leaf className="w-4 h-4" />
            <span>Classical Herb Library ({filteredHerbs.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-10">

        {/* -------------------- TAB 1: HEALTH GUIDES & ARTICLES -------------------- */}
        {activeTab === 'articles' && (
          <div className="space-y-10">

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start md:justify-center">
              {articleCategories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                      isActive
                        ? 'bg-[#E8621A] text-white border-[#E8621A] shadow-md scale-105'
                        : 'bg-white text-[#8B4A5A] border-[#8B4A5A]/30 hover:border-[#8B4A5A] hover:bg-[#8B4A5A]/5'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* FEATURED ARTICLE SPOTLIGHT (Shown on Page 1 when category is 'Saare Articles' or 'Women\'s Wellness' and no query) */}
            {currentPage === 1 && (selectedCategory === "Saare Articles" || selectedCategory === "Women's Wellness" || selectedCategory === "Women's Health") && !searchQuery && featuredPost && (
              <div className="relative bg-white rounded-3xl border-2 border-[#8B4A5A]/30 shadow-xl overflow-hidden hover:border-[#E8621A] transition-all duration-300">
                <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
                  <span className="bg-gradient-to-r from-[#8B4A5A] to-[#E8621A] text-white text-[11px] font-black uppercase px-3.5 py-1 rounded-full shadow font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Flagship Deep-Dive Guide</span>
                  </span>
                  <span className="bg-white/90 backdrop-blur-md text-[#1A1A1A] font-bold text-[10px] uppercase px-3 py-1 rounded-full shadow font-mono">
                    {featuredPost.difficulty || 'Intermediate'} Level
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                  <div className="lg:col-span-6 h-64 lg:h-96 relative overflow-hidden bg-neutral-100">
                    <img
                      src={getOptimizedImageUrl(featuredPost.featuredImage, { width: 640 })}
                      srcSet={`${getOptimizedImageUrl(featuredPost.featuredImage, { width: 400 })} 400w, ${getOptimizedImageUrl(featuredPost.featuredImage, { width: 640 })} 640w, ${getOptimizedImageUrl(featuredPost.featuredImage, { width: 900 })} 900w`}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      alt={featuredPost.title}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      width="640"
                      height="384"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  </div>

                  <div className="lg:col-span-6 p-6 md:p-8 space-y-4 text-left">
                    <div className="flex items-center gap-3 text-xs text-neutral-500 font-medium">
                      <span className="flex items-center gap-1 text-[#E8621A] font-bold">
                        <Calendar className="w-3.5 h-3.5" />
                        {featuredPost.datePublished}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#8B4A5A]" />
                        {featuredPost.readTime}
                      </span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Doctor Reviewed
                      </span>
                    </div>

                    <h2 
                      onClick={() => onSelectArticle(featuredPost.slug)}
                      className="font-serif text-2xl md:text-3xl font-extrabold text-[#1A1A1A] hover:text-[#E8621A] transition-colors leading-snug cursor-pointer"
                    >
                      {featuredPost.title}
                    </h2>

                    <p className="text-xs md:text-sm text-neutral-600 leading-relaxed line-clamp-3">
                      {featuredPost.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {featuredPost.tags.map(t => (
                        <span key={t} className="text-[10px] bg-neutral-100 text-neutral-700 font-semibold px-2.5 py-1 rounded-full border border-neutral-200">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-mono text-neutral-600">
                        <User className="w-4 h-4 text-[#8B4A5A]" />
                        <span>{featuredPost.author}</span>
                      </div>

                      <button
                        onClick={() => onSelectArticle(featuredPost.slug)}
                        className="bg-[#E8621A] hover:bg-[#d55210] text-white font-extrabold text-xs py-3 px-6 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                      >
                        <span>Padhiye Full Article</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Results Counter */}
            <div className="flex items-center justify-between text-xs text-neutral-500 border-b border-[#E0D8D0] pb-3">
              <span>Showing <strong>{filteredPosts.length}</strong> Ayurvedic Health Guide{filteredPosts.length !== 1 ? 's' : ''}</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-[#E8621A] font-bold hover:underline cursor-pointer"
                >
                  Clear Search
                </button>
              )}
            </div>

            {/* Article Grid (2 columns desktop, 1 col mobile) */}
            {currentPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {currentPosts.map((post) => {
                  const isWomens = post.category === "Women's Health";
                  const isMens = post.category === "Men's Health";
                  
                  return (
                    <article
                      key={post.slug}
                      onClick={() => onSelectArticle(post.slug)}
                      className="bg-white rounded-2xl border border-[#E0D8D0] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer border-t-4 border-t-[#8B4A5A] hover:border-t-[#E8621A]"
                    >
                      <div className="p-6 space-y-4">
                        {/* Header Image & Badge */}
                        <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden bg-neutral-100">
                          <img
                            src={getOptimizedImageUrl(post.featuredImage, { width: 480 })}
                            srcSet={`${getOptimizedImageUrl(post.featuredImage, { width: 320 })} 320w, ${getOptimizedImageUrl(post.featuredImage, { width: 480 })} 480w, ${getOptimizedImageUrl(post.featuredImage, { width: 640 })} 640w`}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                            alt={post.title}
                            loading="lazy"
                            decoding="async"
                            width="400"
                            height="192"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                            <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-sm font-mono ${
                              isWomens 
                                ? 'bg-[#8B4A5A] text-white' 
                                : isMens 
                                  ? 'bg-[#1A1A1A] text-white' 
                                  : 'bg-[#E8621A] text-white'
                            }`}>
                              {post.category}
                            </span>
                            {post.difficulty && (
                              <span className="bg-black/60 backdrop-blur-md text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-full font-mono">
                                {post.difficulty}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center gap-3 text-[11px] text-neutral-500 font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#E8621A]" />
                            {post.datePublished}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#8B4A5A]" />
                            {post.readTime}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="font-serif text-xl font-extrabold text-[#1A1A1A] group-hover:text-[#E8621A] transition-colors leading-snug">
                          {post.title}
                        </h2>

                        {/* Excerpt */}
                        <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Card Footer */}
                      <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-[#E0D8D0]/50 mt-2 bg-neutral-50/50">
                        <span className="text-[11px] font-mono text-neutral-500 flex items-center gap-1">
                          <User className="w-3 h-3 text-[#8B4A5A]" />
                          {post.author}
                        </span>

                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#E8621A] group-hover:translate-x-1 transition-transform">
                          <span>Padhiye</span>
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-[#E0D8D0] p-8 space-y-3">
                <BookOpen className="w-10 h-10 text-neutral-400 mx-auto" />
                <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">Koi Article Nahi Mila</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Kripya doosra search term try karein ya 'Saare Articles' category par switch karein.
                </p>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(prev => Math.max(prev - 1, 1));
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 rounded-lg bg-white border border-[#E0D8D0] text-xs font-bold text-[#1A1A1A] hover:bg-[#FAF7F2] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className={`w-9 h-9 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                      currentPage === page
                        ? 'bg-[#E8621A] text-white shadow-md'
                        : 'bg-white border border-[#E0D8D0] text-[#1A1A1A] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(prev => Math.min(prev + 1, totalPages));
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 rounded-lg bg-white border border-[#E0D8D0] text-xs font-bold text-[#1A1A1A] hover:bg-[#FAF7F2] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  Next
                </button>
              </div>
            )}

          </div>
        )}

        {/* -------------------- TAB 2: CLASSICAL AYURVEDIC HERB LIBRARY -------------------- */}
        {activeTab === 'herbs' && (
          <div className="space-y-10 animate-fade-in">
            {/* Herb Library Introduction */}
            <div className="bg-white rounded-3xl border border-[#E0D8D0] p-6 md:p-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 text-xs font-mono uppercase font-bold text-[#E8621A]">
                    <Leaf className="w-4 h-4 text-[#E8621A]" />
                    <span>Classical Dravyaguna Shastra Directory</span>
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-[#1A1A1A]">
                    Shastriya Jadibuti Kosh (Ayurvedic Herb Library)
                  </h2>
                  <p className="text-xs md:text-sm text-neutral-600 max-w-3xl">
                    Discover classical bio-active botanicals, their 5-pillar energetics (Rasa, Guna, Virya, Vipaka, Dosha Karma), modern clinical evidence, and our formulations where they are enriched.
                  </p>
                </div>

                <div className="text-xs bg-[#FAF7F2] p-3 rounded-2xl border border-[#E0D8D0] space-y-1">
                  <span className="font-bold text-[#8B4A5A] block">100% Traditional Sources:</span>
                  <span className="text-neutral-500 font-mono text-[11px]">Bhavaprakasha • Charaka Samhita • API Monograph</span>
                </div>
              </div>

              {/* Herb Category Filters */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-[#E0D8D0]/60">
                {herbCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedHerbCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                      selectedHerbCategory === cat.id
                        ? 'bg-[#8B4A5A] text-white border-[#8B4A5A] shadow-sm'
                        : 'bg-[#FAF7F2] text-neutral-700 border-[#E0D8D0] hover:bg-neutral-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Herb Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHerbs.map((herb) => (
                <div
                  key={herb.id}
                  className="bg-white rounded-2xl border border-[#E0D8D0] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden border-t-4 border-t-[#8B4A5A] group"
                >
                  <div className="p-5 space-y-4">
                    {/* Herb Image & Sanskrit Badge */}
                    <div className="relative h-40 -mx-5 -mt-5 mb-3 overflow-hidden bg-[#FAF7F2]">
                      <img
                        src={getOptimizedImageUrl(herb.image, { width: 360 })}
                        srcSet={`${getOptimizedImageUrl(herb.image, { width: 240 })} 240w, ${getOptimizedImageUrl(herb.image, { width: 360 })} 360w, ${getOptimizedImageUrl(herb.image, { width: 480 })} 480w`}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                        alt={herb.name}
                        loading="lazy"
                        decoding="async"
                        width="300"
                        height="160"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full font-mono shadow">
                          {herb.sanskritName}
                        </span>
                      </div>
                    </div>

                    {/* Herb Headings */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif text-lg font-black text-[#1A1A1A] group-hover:text-[#E8621A] transition-colors">
                          {herb.name} ({herb.hindiName})
                        </h3>
                      </div>
                      <p className="text-xs italic text-[#8B4A5A] font-serif">
                        {herb.botanicalName}
                      </p>
                    </div>

                    {/* Dosha Karma Badge */}
                    <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E0D8D0]/60 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-neutral-500 font-mono block">
                        Dosha Karma:
                      </span>
                      <span className="text-xs font-extrabold text-[#8B4A5A] block">
                        {herb.ayurvedicProperties.doshaKarma}
                      </span>
                    </div>

                    {/* Target Health Goals */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono block">
                        Key Health Applications:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {herb.targetHealthGoals.map((goal) => (
                          <span
                            key={goal}
                            className="bg-neutral-100 text-neutral-700 text-[10px] font-medium px-2.5 py-0.5 rounded-full"
                          >
                            {goal}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Summary */}
                    <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">
                      {herb.summary}
                    </p>

                    {/* Enriched Formulations */}
                    <div className="pt-2 border-t border-[#E0D8D0]/60 space-y-1.5">
                      <span className="text-[10px] font-mono font-bold text-[#E8621A] uppercase tracking-wider block">
                        Enriched In meONmode Products:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {herb.foundInProducts.map(p => {
                          const prodObj = findProduct(p.id);
                          return (
                            <button
                              key={p.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (prodObj) {
                                  onSelectProduct(prodObj);
                                }
                              }}
                              className="text-[10px] font-bold bg-[#E8621A]/10 text-[#E8621A] hover:bg-[#E8621A] hover:text-white px-2.5 py-1 rounded-lg transition-colors cursor-pointer border border-[#E8621A]/30 flex items-center gap-1"
                              title={`View ${p.name}`}
                            >
                              <span>{p.name}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Herb Actions Button */}
                  <div className="p-4 bg-neutral-50 border-t border-[#E0D8D0] flex items-center justify-between gap-2">
                    <button
                      onClick={() => setActiveHerbModal(herb)}
                      className="flex-1 bg-[#8B4A5A] hover:bg-[#6B2A3A] text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-all cursor-pointer text-center"
                    >
                      Classical Monograph
                    </button>

                    {herb.relatedArticleSlug && (
                      <button
                        onClick={() => onSelectArticle(herb.relatedArticleSlug!)}
                        className="bg-white hover:bg-neutral-100 text-[#E8621A] border border-[#E8621A]/30 text-xs font-bold py-2.5 px-3 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                        title="Read In-Depth Guide"
                      >
                        <span>Article</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* -------------------- FREE WELLNESS GUIDE DOWNLOAD BOX -------------------- */}
        <div className="bg-gradient-to-br from-[#2D120B] via-[#4A1D05] to-[#1F0C07] text-white rounded-3xl p-6 md:p-10 shadow-2xl border border-[#E8621A]/30 relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8621A]/20 border border-[#E8621A]/40 text-[#E8621A] text-xs font-mono uppercase font-bold">
              <Sparkle className="w-3.5 h-3.5" />
              <span>Free Downloadable Resource</span>
            </div>

            <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-white">
              Ayurvedic 30-Day Dinacharya & Diet Chart (PDF)
            </h3>

            <p className="text-white/80 text-xs md:text-sm leading-relaxed">
              PCOD/PCOS hormonal balance, period regularity, and stamina enhancement ke liye complete daily routine, pathya-apathya (kya khayein kya nahi), aur herb timing chart apne WhatsApp par bilkul FREE download karein.
            </p>

            {guideSubmitted ? (
              <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-200 text-xs flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Shukriya! Aapka guide WhatsApp par share kiya ja raha hai. Agar chat automatically open na ho to helpline par text karein.</span>
              </div>
            ) : (
              <form onSubmit={handleGuideSubmit} className="pt-2 flex flex-col sm:flex-row gap-3 max-w-lg">
                <input
                  type="tel"
                  required
                  value={guidePhone}
                  onChange={(e) => setGuidePhone(e.target.value)}
                  placeholder="Enter WhatsApp Number (10 digits)"
                  maxLength={10}
                  className="flex-1 bg-white/10 border border-white/25 focus:border-[#E8621A] focus:bg-white text-white focus:text-[#1A1A1A] px-4 py-3 rounded-xl text-xs placeholder-white/50 focus:placeholder-neutral-400 focus:outline-none transition-all"
                />
                <button
                  type="submit"
                  className="bg-[#E8621A] hover:bg-[#d55210] text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>WhatsApp Par Bhejo</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* -------------------- DOCTOR WHATSAPP HELPLINE BANNER -------------------- */}
        <div className="p-8 bg-gradient-to-r from-[#8B4A5A] to-[#6B2A3A] rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-mono font-bold text-[#E5A93C] bg-black/30 px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest inline-block">
              Expert Ayurvedic Consultation
            </span>
            <h3 className="font-serif text-2xl font-extrabold">Kya aapko personal health guidance chahiye?</h3>
            <p className="text-white/80 text-xs">
              Hamare Certified BAMS Ayurvedic Doctors se Direct WhatsApp par free consult karein.
            </p>
          </div>
          <a
            href="https://api.whatsapp.com/send?phone=917290810336&text=Hello%20meONmode%20Doctor%2C%20mujhe%20Ayurvedic%20health%20consultation%20chahiye."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#E8621A] hover:bg-[#d55210] text-white font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Talk to Doctor on WhatsApp</span>
          </a>
        </div>

      </div>

      {/* -------------------- INTERACTIVE HERB MONOGRAPH MODAL -------------------- */}
      {activeHerbModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div 
            className="bg-[#FAF7F2] text-[#1A1A1A] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-neutral-300 max-h-[90vh] flex flex-col text-left my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#2D120B] to-[#4A1D05] text-white p-5 md:p-6 flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#E8621A] font-mono">
                    Classical Ayurvedic Monograph
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-black text-white">
                  {activeHerbModal.name} — {activeHerbModal.sanskritName}
                </h3>
                <p className="text-xs italic text-white/80 font-serif">
                  {activeHerbModal.botanicalName} ({activeHerbModal.hindiName})
                </p>
              </div>

              <button
                onClick={() => setActiveHerbModal(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6 space-y-6 custom-scrollbar">
              
              {/* 5-Pillar Ayurvedic Profile Box */}
              <div className="bg-white rounded-2xl p-5 border border-[#E0D8D0] space-y-3 shadow-sm">
                <h4 className="font-serif text-sm font-bold text-[#8B4A5A] uppercase tracking-wider flex items-center gap-2 border-b border-[#E0D8D0] pb-2">
                  <Activity className="w-4 h-4 text-[#8B4A5A]" />
                  <span>Pancha-Mahabhuta & Dravyaguna Energetics</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E0D8D0]/60">
                    <span className="text-[10px] text-neutral-400 font-mono uppercase block font-bold">Rasa (Taste):</span>
                    <span className="font-bold text-[#1A1A1A]">{activeHerbModal.ayurvedicProperties.rasa}</span>
                  </div>
                  <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E0D8D0]/60">
                    <span className="text-[10px] text-neutral-400 font-mono uppercase block font-bold">Guna (Qualities):</span>
                    <span className="font-bold text-[#1A1A1A]">{activeHerbModal.ayurvedicProperties.guna}</span>
                  </div>
                  <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E0D8D0]/60">
                    <span className="text-[10px] text-neutral-400 font-mono uppercase block font-bold">Virya (Potency):</span>
                    <span className="font-bold text-[#E8621A]">{activeHerbModal.ayurvedicProperties.virya}</span>
                  </div>
                  <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E0D8D0]/60">
                    <span className="text-[10px] text-neutral-400 font-mono uppercase block font-bold">Vipaka (Post-Digest):</span>
                    <span className="font-bold text-[#1A1A1A]">{activeHerbModal.ayurvedicProperties.vipaka}</span>
                  </div>
                  <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E0D8D0]/60 col-span-2">
                    <span className="text-[10px] text-neutral-400 font-mono uppercase block font-bold">Dosha Karma (Action):</span>
                    <span className="font-bold text-[#8B4A5A]">{activeHerbModal.ayurvedicProperties.doshaKarma}</span>
                  </div>
                  {activeHerbModal.ayurvedicProperties.prabhava && (
                    <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E0D8D0]/60 col-span-2 sm:col-span-3">
                      <span className="text-[10px] text-[#E8621A] font-mono uppercase block font-bold">Prabhava (Specific Action):</span>
                      <span className="font-bold text-[#1A1A1A]">{activeHerbModal.ayurvedicProperties.prabhava}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Shastriya Traditional Action */}
              <div className="space-y-2 text-xs">
                <h4 className="font-serif text-sm font-bold text-[#1A1A1A] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#8B4A5A]" />
                  <span>Classical Ayurvedic Action (Shastra Pramana)</span>
                </h4>
                <p className="text-neutral-700 bg-white p-4 rounded-xl border border-[#E0D8D0] leading-relaxed">
                  {activeHerbModal.traditionalAction}
                </p>
              </div>

              {/* Modern Clinical & Phytochemical Validation */}
              <div className="space-y-2 text-xs">
                <h4 className="font-serif text-sm font-bold text-[#1A1A1A] flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-[#1A1A1A]" />
                  <span>Modern Pharmacological & Clinical Validation</span>
                </h4>
                <p className="text-neutral-700 bg-white p-4 rounded-xl border border-[#E0D8D0] leading-relaxed">
                  {activeHerbModal.modernValidation}
                </p>
              </div>

              {/* Formulations where present */}
              <div className="space-y-2 text-xs">
                <h4 className="font-serif text-sm font-bold text-[#1A1A1A] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#E8621A]" />
                  <span>Enriched in meONmode® Formulations</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeHerbModal.foundInProducts.map((p) => {
                    const prodObj = findProduct(p.id);
                    return (
                      <div key={p.id} className="bg-white p-3.5 rounded-xl border border-[#E0D8D0] flex items-center justify-between gap-3">
                        <div>
                          <span className="font-bold text-sm text-[#1A1A1A] block">{p.name}</span>
                          <span className="text-[11px] text-neutral-500 block">{p.role}</span>
                        </div>
                        {prodObj && (
                          <button
                            onClick={() => {
                              setActiveHerbModal(null);
                              onSelectProduct(prodObj);
                            }}
                            className="bg-[#E8621A] hover:bg-[#d55210] text-white text-[11px] font-bold py-1.5 px-3 rounded-lg shadow-sm cursor-pointer whitespace-nowrap"
                          >
                            View →
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-neutral-100 border-t border-[#E0D8D0] flex items-center justify-between">
              {activeHerbModal.relatedArticleSlug ? (
                <button
                  onClick={() => {
                    const slug = activeHerbModal.relatedArticleSlug!;
                    setActiveHerbModal(null);
                    onSelectArticle(slug);
                  }}
                  className="text-xs font-bold text-[#8B4A5A] hover:text-[#E8621A] flex items-center gap-1 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Read Related Blog Guide →</span>
                </button>
              ) : (
                <span></span>
              )}

              <button
                onClick={() => setActiveHerbModal(null)}
                className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-bold py-2 px-5 rounded-xl cursor-pointer"
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
