import React, { useState } from 'react';
import { LOOKBOOK_ITEMS } from '../data/mockData';
import { Product, LookbookItem } from '../types';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  Sparkles, 
  Check, 
  ShoppingBag 
} from 'lucide-react';

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

  const tags: Array<'All' | 'Bridal Legacy' | 'Regal Evening' | 'Festive Grandeur' | 'Cocktail & Contemporary' | 'Heritage Heirloom'> = [
    'All',
    'Bridal Legacy',
    'Regal Evening',
    'Festive Grandeur',
    'Cocktail & Contemporary',
    'Heritage Heirloom'
  ];

  const filteredLooks = selectedTag === 'All'
    ? LOOKBOOK_ITEMS
    : LOOKBOOK_ITEMS.filter(l => 
        l.theme === selectedTag ||
        l.tagline.toLowerCase().includes(selectedTag.toLowerCase()) || 
        l.title.toLowerCase().includes(selectedTag.toLowerCase())
      );

  return (
    <div id="shop-the-look-collection-page" className="min-h-screen bg-[#FAF7F2] py-8 lg:py-14 animate-in fade-in duration-300">
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
            <span>Dedicated Studio Lookbook</span>
          </div>
        </div>

        {/* Page Hero Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-sans font-semibold tracking-[0.25em] uppercase text-[#8C6D37] block mb-2">
            Designer Curations • 2026 Collection
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#24211E] tracking-tight">
            Shop the Look
          </h1>
          <p className="font-sans text-sm sm:text-base text-[#5C5549] font-light leading-relaxed mt-3">
            Immerse yourself in complete styled outfits direct from the AARU studio. Each look harmonizes heirloom Banarasi silk weaves, tailored blouses, handcrafted temple jewelry, and artisan drapes.
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
          {filteredLooks.map((look, idx) => (
            <LookbookCard
              key={look.id}
              look={look}
              idx={idx}
              products={products}
              onSelectProduct={onSelectProduct}
              onQuickAddToCart={onQuickAddToCart}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

interface LookbookCardProps {
  look: LookbookItem;
  idx: number;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onQuickAddToCart?: (product: Product) => void;
}

const LookbookCard: React.FC<LookbookCardProps> = ({
  look,
  idx,
  products,
  onSelectProduct,
  onQuickAddToCart
}) => {
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const activeProduct = products.find(p => p.id === look.productId) || products[0];

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (onQuickAddToCart) {
      onQuickAddToCart(product);
      setAddedProductId(product.id);
      setTimeout(() => setAddedProductId(null), 2500);
    }
  };

  return (
    <div
      id={`lookbook-ensemble-${look.id}`}
      className="bg-white border border-[#E8DFD5] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12">
        
        {/* Editorial Image - Clean Static View */}
        <div className="lg:col-span-7 relative aspect-[4/3] sm:aspect-[16/10] bg-[#F5EFE6] overflow-hidden select-none">
          <img
            src={look.image}
            alt={look.title}
            className="w-full h-full object-cover object-center"
          />

          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
          
          {/* Editorial Watermark Overlay */}
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-xs text-white px-3 py-1 text-[10px] uppercase font-bold tracking-widest z-10">
            Look {String(idx + 1).padStart(2, '0')} • {look.tagline}
          </div>

          {/* Floating Product Tag */}
          {activeProduct && (
            <div 
              className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm bg-white/95 backdrop-blur-md p-3 shadow-xl border border-[#D4C7B5] z-20"
            >
              <div className="flex items-center gap-3">
                <img
                  src={activeProduct.images[0]}
                  alt={activeProduct.title}
                  className="w-12 h-16 object-cover bg-[#F5EFE6] border border-[#E8DFD5] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] text-[#8C6D37] uppercase font-bold tracking-wider block truncate">
                    Signature Piece
                  </span>
                  <h4 className="text-xs font-serif font-bold text-[#24211E] truncate">
                    {activeProduct.title}
                  </h4>
                  <p className="text-xs font-serif font-semibold text-[#0F4C5C] mt-0.5">
                    ₹{(activeProduct.salePrice || activeProduct.price).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Styling Narrative & Shoppable Breakdown (5 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#FAF7F2]">
          <div>
            <div className="flex items-center justify-between mb-2">
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
              {look.subtitle}. Designed for ceremonial celebrations with custom tailored finishing.
            </p>

            {/* Featured Product Box */}
            {activeProduct && (
              <div className="bg-white p-4 border border-[#E8DFD5] mb-6">
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#8C6D37] mb-2">
                  Featured Garment
                </p>
                <div className="flex items-center justify-between gap-3">
                  <div className="truncate">
                    <p className="text-xs font-serif font-semibold text-[#24211E] truncate">
                      {activeProduct.title}
                    </p>
                    <p className="text-[10px] text-[#736B5E] tracking-wider uppercase font-medium">
                      {activeProduct.category}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-serif font-bold text-[#0F4C5C]">
                      ₹{(activeProduct.salePrice || activeProduct.price).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CTAs for the piece */}
          <div className="space-y-2.5 pt-4 border-t border-[#E8DFD5]">
            {activeProduct && (
              <>
                <button
                  type="button"
                  onClick={() => onSelectProduct(activeProduct)}
                  className="w-full py-3.5 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <span>View Details & Specifications</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                {onQuickAddToCart && (
                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(e, activeProduct)}
                    className={`w-full py-2.5 text-xs font-semibold uppercase tracking-wider border flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                      addedProductId === activeProduct.id
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-transparent hover:bg-white text-[#24211E] border-[#D4C7B5]'
                    }`}
                  >
                    {addedProductId === activeProduct.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Bag</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5 text-[#0F4C5C]" />
                        <span>Quick Add To Bag (₹{(activeProduct.salePrice || activeProduct.price).toLocaleString('en-IN')})</span>
                      </>
                    )}
                  </button>
                )}
              </>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
