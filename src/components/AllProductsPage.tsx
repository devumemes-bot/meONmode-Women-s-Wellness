import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { Star, ShieldCheck, ShoppingCart, Zap, ArrowRight, SlidersHorizontal, Search, X } from 'lucide-react';
import { optimizeCloudinaryUrl } from '../data';

interface AllProductsPageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onQuickBuy: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBackToHome?: () => void;
}

export const AllProductsPage: React.FC<AllProductsPageProps> = ({
  products,
  onSelectProduct,
  onQuickBuy,
  onAddToCart,
  onBackToHome
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'women' | 'men' | 'combos'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [search, setSearch] = useState<string>('');

  // Helper to categorize products
  const isMen = (p: Product) => p.id === 'wantmore-men' || p.id === 'alphamax-men' || p.id === 'mens-combo';
  const isWomen = (p: Product) => p.id === 'ovaira' || p.id === 'flowelle' || p.id === 'combo-kit';
  const isCombo = (p: Product) => p.id === 'combo-kit' || p.id === 'mens-combo';

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter(p => {
      if (filterCategory === 'women') return isWomen(p);
      if (filterCategory === 'men') return isMen(p);
      if (filterCategory === 'combos') return isCombo(p);
      return true;
    });

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.benefits.some(b => b.toLowerCase().includes(q))
      );
    }

    switch (sortBy) {
      case 'price-low':
        return [...result].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...result].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...result].sort((a, b) => b.rating - a.rating);
      case 'featured':
      default:
        return result;
    }
  }, [products, filterCategory, sortBy, search]);

  return (
    <div className="min-h-screen py-8 sm:py-12 space-y-8 animate-fade-in text-white max-w-7xl mx-auto px-4 sm:px-6">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-neutral-400">
        <button
          type="button"
          onClick={onBackToHome}
          className="hover:text-[#E5A93C] transition-colors cursor-pointer"
        >
          Home
        </button>
        <span>/</span>
        <span className="text-white font-medium">All Products</span>
      </nav>

      {/* Clean, Product-Focused Header */}
      <header className="space-y-3 border-b border-white/10 pb-6">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          All Products
        </h1>
        <p className="text-neutral-300 text-sm sm:text-base max-w-2xl leading-relaxed font-sans">
          Explore authentic Ayurvedic formulations crafted with standardized botanical extracts for daily wellness. Pure, lab-tested, and chemical-free.
        </p>
      </header>

      {/* Control Bar: Category Filters & Sorting */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase font-mono tracking-wider text-neutral-400 mr-1 hidden sm:inline">
            Filter:
          </span>
          <button
            type="button"
            onClick={() => setFilterCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-[#E5A93C] text-[#23120B] shadow-md'
                : 'bg-white/5 text-white/70 hover:text-white border border-white/10'
            }`}
          >
            All ({products.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('women')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterCategory === 'women'
                ? 'bg-[#C86428] text-white shadow-md'
                : 'bg-white/5 text-white/70 hover:text-white border border-white/10'
            }`}
          >
            👩 Women
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('men')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterCategory === 'men'
                ? 'bg-[#D4AF37] text-white shadow-md'
                : 'bg-white/5 text-white/70 hover:text-white border border-white/10'
            }`}
          >
            👨 Men
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('combos')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterCategory === 'combos'
                ? 'bg-[#8C5D3A] text-white shadow-md'
                : 'bg-white/5 text-white/70 hover:text-white border border-white/10'
            }`}
          >
            ✨ Combos
          </button>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E5A93C] transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-[#E5A93C]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E5A93C] cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Count indicator */}
      <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
        <span>Showing {filteredAndSortedProducts.length} results</span>
        {search && <span>Filtered by: "{search}"</span>}
      </div>

      {/* Product Grid */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-white/5 border border-white/10 rounded-3xl p-6">
          <span className="text-4xl block">🔍</span>
          <h3 className="font-serif text-xl font-bold text-white">No products found</h3>
          <p className="text-neutral-400 text-xs max-w-md mx-auto">
            We couldn't find any products matching your selected criteria. Try adjusting your search query or clear the filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setFilterCategory('all');
              setSearch('');
            }}
            className="bg-[#E5A93C] text-[#23120B] text-xs font-bold px-5 py-2.5 rounded-full hover:bg-[#C86428] hover:text-white transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedProducts.map((product) => {
            const discount = product.mrp > product.price 
              ? Math.round(((product.mrp - product.price) / product.mrp) * 100) 
              : 0;

            return (
              <div
                key={product.id}
                id={`all-prod-${product.id}`}
                className="group bg-[#1A0F0A] border border-white/10 rounded-3xl overflow-hidden shadow-lg hover:border-[#E5A93C]/50 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Product Image Area */}
                <div 
                  className="relative bg-black/40 p-6 flex items-center justify-center cursor-pointer overflow-hidden border-b border-white/5"
                  onClick={() => onSelectProduct(product)}
                >
                  {/* Tag badge if present */}
                  {product.tag && (
                    <span className="absolute top-4 left-4 z-10 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-[#E5A93C] text-[#23120B] shadow-md">
                      {product.tag}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="absolute top-4 right-4 z-10 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {discount}% OFF
                    </span>
                  )}
                  <img
                    src={optimizeCloudinaryUrl(product.images[0], 480)}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    width="320"
                    height="280"
                    className="w-full h-56 sm:h-64 object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Product Details Area */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    {/* Rating & Volume */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-[#E5A93C]">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-bold text-white">{product.rating}</span>
                        <span className="text-neutral-400 text-[11px]">({product.reviewsCount})</span>
                      </div>
                      <span className="text-[11px] font-mono text-neutral-400">
                        {product.volumeOrQty}
                      </span>
                    </div>

                    {/* Title & Subtitle */}
                    <div 
                      className="cursor-pointer"
                      onClick={() => onSelectProduct(product)}
                    >
                      <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#E5A93C] transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-neutral-400 line-clamp-2 mt-1 font-sans">
                        {product.shortDescription || product.subtitle}
                      </p>
                    </div>

                    {/* Key Benefits (Top 2) */}
                    {product.benefits && product.benefits.length > 0 && (
                      <ul className="space-y-1 pt-1">
                        {product.benefits.slice(0, 2).map((b, bIdx) => (
                          <li key={bIdx} className="text-[11px] text-neutral-300 flex items-start gap-1.5 line-clamp-1">
                            <span className="text-emerald-400 shrink-0">✓</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Pricing and Action Buttons */}
                  <div className="space-y-3 pt-3 border-t border-white/10">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-white font-serif">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.mrp > product.price && (
                          <span className="text-xs text-neutral-400 line-through">
                            ₹{product.mrp.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-400 font-medium">
                        Free Express Delivery
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => onAddToCart(product)}
                        className="w-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2.5 rounded-xl border border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onQuickBuy(product)}
                        className="w-full bg-[#E5A93C] hover:bg-[#C86428] text-[#23120B] hover:text-white text-xs font-extrabold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>Quick Buy</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
