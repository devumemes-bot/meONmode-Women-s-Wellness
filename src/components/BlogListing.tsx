import React, { useState } from 'react';
import { BLOG_POSTS } from '../blogData';
import { BlogPost, Product } from '../types';
import { 
  Search, 
  Clock, 
  ChevronRight, 
  BookOpen, 
  Sparkles, 
  ArrowLeft,
  Calendar,
  User,
  Tag
} from 'lucide-react';

interface BlogListingProps {
  onSelectArticle: (slug: string) => void;
  onGoHome: () => void;
  onSelectProduct: (product: Product) => void;
}

export const BlogListing: React.FC<BlogListingProps> = ({
  onSelectArticle,
  onGoHome,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Saare Articles");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const postsPerPage = 6;

  const categories = [
    "Saare Articles",
    "Women's Health",
    "Men's Health",
    "Diet & Nutrition",
    "Ayurvedic Herbs"
  ];

  // Filter logic
  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesCategory = selectedCategory === "Saare Articles" || post.category === selectedCategory;
    const matchesSearch = searchQuery.trim() === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage) || 1;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1A1A1A] font-sans">
      {/* Schema Markup for Blog Listing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "meONmode Ayurvedic Wellness Blog",
            "description": "Expert Ayurvedic health tips in Hindi on PCOD, PMOS, white discharge, men's health, and hormonal balance.",
            "url": "https://meonmode.com/blog",
            "publisher": {
              "@type": "Organization",
              "name": "meONmode",
              "logo": "https://meonmode.com/logo.png"
            }
          })
        }}
      />

      {/* Hero Banner Section */}
      <div className="bg-gradient-to-b from-[#2D120B] to-[#4A1D05] text-white py-12 md:py-16 px-4 border-b border-[#E8621A]/30 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#E8621A]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-5xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8621A]/20 border border-[#E8621A]/40 text-[#E8621A] text-xs font-black uppercase tracking-widest font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>meONmode® Knowledge Hub</span>
          </div>
          
          <h1 className="font-serif text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Ayurvedic Health Ki Puri Jankari — Hindi Mein
          </h1>
          
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto font-medium leading-relaxed">
            PCOD, PMOS, White Discharge, Men's Health & Hormonal Balance — Expert Ayurvedic tips & proven research free mein.
          </p>

          {/* Search Bar */}
          <div className="pt-2 max-w-md mx-auto relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search e.g. PCOD, Safed Pani, Shilajit..."
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 focus:border-[#E8621A] focus:bg-white text-white focus:text-[#1A1A1A] text-xs md:text-sm rounded-full pl-10 pr-4 py-3 focus:outline-none transition-all placeholder-white/50 focus:placeholder-neutral-400 font-medium"
            />
            <Search className="w-4 h-4 text-white/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-8">
        
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start md:justify-center">
          {categories.map((cat) => {
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

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-neutral-500 border-b border-[#E0D8D0] pb-3">
          <span>Showing <strong>{filteredPosts.length}</strong> Article{filteredPosts.length !== 1 ? 's' : ''}</span>
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
                        src={post.featuredImage.includes('unsplash.com') ? post.featuredImage.replace('w=1200', 'w=600') : post.featuredImage}
                        alt={post.title}
                        loading="lazy"
                        decoding="async"
                        width="400"
                        height="192"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-sm ${
                          isWomens 
                            ? 'bg-[#8B4A5A] text-white' 
                            : isMens 
                              ? 'bg-[#1A1A1A] text-white' 
                              : 'bg-[#E8621A] text-white'
                        }`}>
                          {post.category}
                        </span>
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
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-4 py-2 rounded-lg bg-white border border-[#E0D8D0] text-xs font-bold text-[#1A1A1A] hover:bg-[#FAF7F2] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
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
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="px-4 py-2 rounded-lg bg-white border border-[#E0D8D0] text-xs font-bold text-[#1A1A1A] hover:bg-[#FAF7F2] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {/* Bottom Banner */}
        <div className="p-8 bg-gradient-to-r from-[#8B4A5A] to-[#6B2A3A] rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-mono font-bold text-[#E8621A] bg-black/30 px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest inline-block">
              Ayurvedic Consultation
            </span>
            <h3 className="font-serif text-2xl font-extrabold">Kya aapko personal health guidance chahiye?</h3>
            <p className="text-white/80 text-xs">
              Hamare Chief Ayurvedic Doctor se Direct WhatsApp par free consult karein.
            </p>
          </div>
          <a
            href="https://api.whatsapp.com/send?phone=917290810336&text=Hello%20meONmode%20Doctor%2C%20mujhe%20health%20consultation%20chahiye."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#E8621A] hover:bg-[#d55210] text-white font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-lg transition-all cursor-pointer whitespace-nowrap"
          >
            📱 Talk to Doctor on WhatsApp
          </a>
        </div>

      </div>
    </div>
  );
};
