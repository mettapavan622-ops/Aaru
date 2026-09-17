import React, { useState } from 'react';
import { LOOKBOOK_ITEMS } from '../data/mockData';
import { Product } from '../types';
import { 
  ArrowUpRight, 
  Sparkles, 
  ShoppingBag, 
  Check, 
  ChevronRight 
} from 'lucide-react';

interface ShopTheLookProps {
  products: Product[];
  onSelectProduct?: (product: Product) => void;
  onSelectLookProduct?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onExploreAllLooks?: () => void;
}

export const ShopTheLook: React.FC<ShopTheLookProps> = ({ 
  products, 
  onSelectProduct,
  onSelectLookProduct,
  onAddToCart,
  onExploreAllLooks 
}) => {
  // Current Lookbook Ensemble Selection
  const [selectedLookId, setSelectedLookId] = useState<string>(LOOKBOOK_ITEMS[0]?.id || 'look-1');
  
  // Current active Look entity
  const currentLook = LOOKBOOK_ITEMS.find(l => l.id === selectedLookId) || LOOKBOOK_ITEMS[0];
  const activeProduct = products.find(p => p.id === currentLook.productId) || products[0];

  // Add to Cart Feedback Notification
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Unified product navigation handler
  const handleViewProduct = (product: Product) => {
    if (onSelectProduct) {
      onSelectProduct(product);
    } else if (onSelectLookProduct) {
      onSelectLookProduct(product);
    }
  };

  // Quick Add to Cart
  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
      setAddedProductId(product.id);
      setTimeout(() => {
        setAddedProductId(null);
      }, 2500);
    } else {
      handleViewProduct(product);
    }
  };

  return (
    <section id="shop-the-look" className="py-20 lg:py-28 bg-[#FAF7F2] border-t border-[#E8DFD5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#E8DFD5] shadow-2xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#8C6D37]" />
            <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.22em] text-[#8C6D37]">
              Editorial Lookbook
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F4C5C] tracking-tight">
            Shop the Look
          </h2>
          <p className="text-xs sm:text-sm text-[#736B5E] font-light mt-2 max-w-xl mx-auto leading-relaxed">
            Curated ceremonial ensembles styled by the AARU studio. Explore complete outfits harmonizing handcrafted silk weaves, matching blouses, and heritage jewelry.
          </p>
        </div>

        {/* Main Grid: Visual Stage + Ensemble Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Clean Editorial Lifestyle Canvas (8 cols) - Static Image without Hotspot Pins */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div 
              id="shop-the-look-stage"
              className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden bg-[#F5EFE6] border border-[#E8DFD5] shadow-xl group select-none"
            >
              {/* Static Lifestyle Background Image */}
              <img
                src={currentLook.image}
                alt={currentLook.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-101"
              />
              
              {/* Ambient Subtle Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

              {/* Look Tagline Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 bg-black/60 backdrop-blur-xs text-white text-[10px] uppercase font-bold tracking-widest border border-white/10">
                  {currentLook.tagline}
                </span>
              </div>

              {/* Look Overview Card */}
              {activeProduct && (
                <div 
                  id="look-overview-card"
                  className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-white/95 backdrop-blur-md p-4 sm:p-5 border border-[#D4C7B5] shadow-2xl z-20"
                >
                  <div className="flex gap-4 items-start">
                    {/* Product Thumbnail */}
                    <div 
                      onClick={() => handleViewProduct(activeProduct)}
                      className="w-16 h-20 sm:w-20 sm:h-24 bg-[#FAF7F2] border border-[#E8DFD5] overflow-hidden shrink-0 cursor-pointer group/thumb"
                    >
                      <img
                        src={activeProduct.images[0]}
                        alt={activeProduct.title}
                        className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform"
                      />
                    </div>

                    {/* Details & Actions */}
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C6D37] block mb-1">
                        Featured Piece
                      </span>

                      <h4 
                        onClick={() => handleViewProduct(activeProduct)}
                        className="font-serif text-sm sm:text-base font-bold text-[#24211E] truncate hover:text-[#0F4C5C] transition-colors cursor-pointer"
                      >
                        {activeProduct.title}
                      </h4>

                      <div className="flex items-baseline gap-2 mt-1 mb-3">
                        <span className="text-sm font-serif font-bold text-[#0F4C5C]">
                          ₹{(activeProduct.salePrice || activeProduct.price).toLocaleString('en-IN')}
                        </span>
                        {activeProduct.isOnSale && activeProduct.salePrice && (
                          <span className="text-xs text-[#8A8175] line-through">
                            ₹{activeProduct.price.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons: View Details + Add to Bag */}
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          id="look-view-details-btn"
                          onClick={() => handleViewProduct(activeProduct)}
                          className="px-3.5 py-2 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>View Product</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          id="look-add-to-cart-btn"
                          onClick={(e) => handleAddToCart(e, activeProduct)}
                          className={`px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5 border transition-all cursor-pointer ${
                            addedProductId === activeProduct.id
                              ? 'bg-emerald-700 text-white border-emerald-700'
                              : 'bg-white hover:bg-[#FAF7F2] text-[#24211E] border-[#D4C7B5]'
                          }`}
                        >
                          {addedProductId === activeProduct.id ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added to Bag</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5 text-[#0F4C5C]" />
                              <span>Add to Bag</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Look Description Summary Bar */}
            <div className="bg-white border border-[#E8DFD5] p-3 sm:p-4 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="text-xs font-serif font-bold text-[#24211E]">{currentLook.title}</span>
                <span className="text-xs text-[#736B5E] hidden sm:inline">•</span>
                <span className="text-xs text-[#736B5E] hidden sm:inline">{currentLook.subtitle}</span>
              </div>
              <span className="text-xs font-sans font-semibold text-[#0F4C5C]">{currentLook.price}</span>
            </div>
          </div>

          {/* Right Column: Lookbook Ensembles Switcher & CTA (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-[#8C6D37] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                Curated Looks
              </h4>
              <span className="text-[10px] text-[#736B5E] font-medium">
                {LOOKBOOK_ITEMS.length} Ensembles
              </span>
            </div>

            {/* List of Looks */}
            <div className="space-y-3">
              {LOOKBOOK_ITEMS.map((look) => {
                const isSelected = look.id === selectedLookId;

                return (
                  <div
                    key={look.id}
                    id={`look-selector-${look.id}`}
                    onClick={() => setSelectedLookId(look.id)}
                    className={`p-3.5 border cursor-pointer transition-all flex items-center gap-4 ${
                      isSelected 
                        ? 'bg-white border-[#0F4C5C] shadow-md ring-1 ring-[#0F4C5C]' 
                        : 'bg-white/70 border-[#E8DFD5] hover:bg-white hover:border-[#D4C7B5]'
                    }`}
                  >
                    <img
                      src={look.image}
                      alt={look.title}
                      className="w-16 h-20 object-cover bg-[#F5EFE6] shrink-0 border border-[#E8DFD5]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-[#8C6D37] font-semibold">
                        {look.tagline}
                      </p>
                      <h5 className="font-serif text-sm font-bold text-[#24211E] truncate mt-0.5">
                        {look.title}
                      </h5>
                      <p className="text-xs text-[#736B5E] line-clamp-1 font-light mt-0.5">
                        {look.subtitle}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F0EBE1]">
                        <span className="text-xs font-semibold text-[#0F4C5C]">
                          {look.price}
                        </span>
                        <span className="text-[10px] text-[#8C6D37] uppercase tracking-wider flex items-center gap-0.5 font-medium">
                          {isSelected ? 'Active View' : 'Select Look'}
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Link to Full Lookbook Collection Page */}
            {onExploreAllLooks && (
              <button
                id="explore-all-shop-the-look-btn"
                type="button"
                onClick={onExploreAllLooks}
                className="w-full py-3.5 px-4 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer mt-2"
              >
                <span>Browse Dedicated Lookbook</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
