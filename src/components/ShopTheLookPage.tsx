import React, { useState } from 'react';
import { LOOKBOOK_ITEMS } from '../data/mockData';
import { Product } from '../types';
import { ArrowLeft, ArrowUpRight, Sparkles, Check, Heart, Eye } from 'lucide-react';

interface ShopTheLookPageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onBackToHome: () => void;
  onQuickAddToCart?: (product: Product) => void;
}

export const ShopTheLookPage: React.FC<ShopTheLookPageProps> = ({
  products,
  onSelectProduct,
  onBackToHome,
  onQuickAddToCart
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [activeLookId, setActiveLookId] = useState<string>(LOOKBOOK_ITEMS[0]?.id || '');

  const tags = ['All', 'Bridal Legacy', 'Regal Evening', 'Festive Grandeur', 'Contemporary Minimal'];

  const filteredLooks = selectedTag === 'All'
    ? LOOKBOOK_ITEMS
    : LOOKBOOK_ITEMS.filter(l => l.tagline.toLowerCase().includes(selectedTag.toLowerCase()) || l.title.toLowerCase().includes(selectedTag.toLowerCase()));

  return (
    <div id="shop-to-look-collection-page" className="min-h-screen bg-[#FAF7F2] py-8 lg:py-14 animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between pb-6 border-b border-[#E8DFD5] mb-8">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#5C5549] hover:text-[#0F4C5C] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Boutique Home</span>
          </button>

          <div className="flex items-center gap-2 text-[11px] text-[#8C6D37] tracking-wider uppercase font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dedicated Atelier Lookbook</span>
          </div>
        </div>

        {/* Page Hero Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-sans font-semibold tracking-[0.25em] uppercase text-[#8C6D37] block mb-2">
            Haute Couture Curations • 2026 Collection
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#24211E] tracking-tight">
            Shop the Look
          </h1>
          <p className="font-sans text-sm sm:text-base text-[#5C5549] font-light leading-relaxed mt-3">
            Immerse yourself in complete styled ensembles direct from the AARU atelier. Each look harmonizes heirloom Banarasi silk weaves, tailored blouses, handcrafted temple jewelry, and artisan drapes.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2.5 pb-8 mb-8 border-b border-[#E8DFD5]">
          <span className="text-xs font-medium uppercase tracking-wider text-[#736B5E] mr-2">
            Style Edit:
          </span>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                selectedTag === tag
                  ? 'bg-[#0F4C5C] text-white shadow-xs'
                  : 'bg-white border border-[#E8DFD5] text-[#5C5549] hover:border-[#0F4C5C] hover:text-[#0F4C5C]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Editorial Looks Showcase Grid */}
        <div className="space-y-16">
          {filteredLooks.map((look, idx) => {
            const linkedProduct = products.find(p => p.id === look.productId);

            return (
              <div
                key={look.id}
                id={`lookbook-ensemble-${look.id}`}
                className="bg-white border border-[#E8DFD5] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  
                  {/* High-Impact Editorial Image (7 cols) */}
                  <div className="lg:col-span-7 relative aspect-[4/3] sm:aspect-[16/10] bg-[#F5EFE6] overflow-hidden group">
                    <img
                      src={look.image}
                      alt={look.title}
                      className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700"
                    />
                    
                    {/* Editorial Watermark Overlay */}
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-xs text-white px-3 py-1 text-[10px] uppercase font-bold tracking-widest">
                      Look {String(idx + 1).padStart(2, '0')} • {look.tagline}
                    </div>

                    {/* Shoppable Hotspot */}
                    {linkedProduct && (
                      <div 
                        className="absolute bottom-6 left-6 cursor-pointer"
                        onClick={() => onSelectProduct(linkedProduct)}
                      >
                        <div className="bg-white/95 backdrop-blur-xs px-4 py-2.5 shadow-lg border border-[#E8DFD5] flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <div>
                            <span className="text-[10px] text-[#8C6D37] uppercase font-bold tracking-wider block">Featured Piece</span>
                            <span className="text-xs font-serif font-bold text-[#24211E]">{linkedProduct.title}</span>
                          </div>
                          <span className="text-xs font-serif font-semibold text-[#0F4C5C]">
                            ₹{(linkedProduct.salePrice || linkedProduct.price).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Styling Narrative & Shoppable Breakdown (5 cols) */}
                  <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#FAF7F2]">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C6D37]">
                          {look.tagline}
                        </span>
                        <span className="text-sm font-serif font-bold text-[#0F4C5C]">
                          {look.price}
                        </span>
                      </div>

                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#24211E] mb-2">
                        {look.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#5C5549] leading-relaxed mb-6 font-light">
                        {look.subtitle}. Designed for timeless ceremonial stature with architectural borders and pure gold zari motifs.
                      </p>

                      {/* Ensemble Breakdown Checklist */}
                      <div className="bg-white p-4 border border-[#E8DFD5] mb-6 space-y-2.5">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-[#8C6D37]">
                          Curated Ensemble Components:
                        </p>
                        <div className="flex items-start gap-2 text-xs text-[#24211E]">
                          <Check className="w-4 h-4 text-[#0F4C5C] shrink-0 mt-0.5" />
                          <span>Primary Drape: Handwoven Kadwa brocade on certified pure silk loom</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-[#24211E]">
                          <Check className="w-4 h-4 text-[#0F4C5C] shrink-0 mt-0.5" />
                          <span>Blouse: Tailored unstitched pure brocade fabric (included)</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-[#24211E]">
                          <Check className="w-4 h-4 text-[#0F4C5C] shrink-0 mt-0.5" />
                          <span>Packaging: Complimentary heirloom unbleached cotton storage bag</span>
                        </div>
                      </div>
                    </div>

                    {/* CTAs */}
                    <div className="space-y-2.5 pt-4 border-t border-[#E8DFD5]">
                      {linkedProduct ? (
                        <>
                          <button
                            type="button"
                            onClick={() => onSelectProduct(linkedProduct)}
                            className="w-full py-3.5 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                          >
                            <span>Shop This Look & Product Details</span>
                            <ArrowUpRight className="w-4 h-4" />
                          </button>

                          {onQuickAddToCart && (
                            <button
                              type="button"
                              onClick={() => onQuickAddToCart(linkedProduct)}
                              className="w-full py-2.5 bg-transparent hover:bg-white text-[#24211E] text-xs font-semibold uppercase tracking-wider border border-[#D4C7B5] transition-colors cursor-pointer"
                            >
                              Quick Add To Bag (₹{(linkedProduct.salePrice || linkedProduct.price).toLocaleString('en-IN')})
                            </button>
                          )}
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={onBackToHome}
                          className="w-full py-3.5 bg-[#0F4C5C] text-white text-xs font-semibold uppercase tracking-wider"
                        >
                          Explore Full Catalog
                        </button>
                      )}
                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
