import React, { useState } from 'react';
import { Product, Category } from '../types';
import { Sparkles, ArrowRight, ArrowUpRight, CheckCircle2, X, ShoppingBag } from 'lucide-react';

interface CategoriesMegaMenuProps {
  categories: Category[];
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (categoryName: string) => void;
  onSelectProduct: (product: Product) => void;
  onNavigateCustom: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const CategoriesMegaMenu: React.FC<CategoriesMegaMenuProps> = ({
  categories,
  products,
  isOpen,
  onClose,
  onSelectCategory,
  onSelectProduct,
  onNavigateCustom,
  onMouseEnter,
  onMouseLeave
}) => {
  const [activeCategoryName, setActiveCategoryName] = useState<string>(
    categories[0]?.name || 'Sarees'
  );

  if (!isOpen) return null;

  // Filter products for currently active category
  const activeProducts = products.filter(p => {
    if (!p) return false;
    if (activeCategoryName === 'Customized Clothing') {
      return (p.category === 'Customized Clothing') || (p.tags && p.tags.includes('Custom Made'));
    }
    return (p.category || '').toLowerCase() === activeCategoryName.toLowerCase();
  });

  const activeCategoryObj = categories.find(c => c.name === activeCategoryName);

  const handleCategoryClick = (catName: string) => {
    if (catName === 'Customized Clothing') {
      onClose();
      onNavigateCustom();
    } else {
      onClose();
      onSelectCategory(catName);
    }
  };

  return (
    <div 
      id="categories-showcase-megamenu"
      className="absolute top-full left-0 w-full bg-[#FAF7F2] border-b border-[#D4C7B5] shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave || onClose}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between pb-3.5 border-b border-[#E8DFD5] mb-5 gap-3">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-sans font-semibold tracking-[0.25em] uppercase text-[#8C6D37]">
              Atelier Collections Showcase
            </span>
            <span className="h-3 w-[1px] bg-[#D4C7B5]" />
            <span className="text-xs text-[#5C5549] hidden sm:inline">
              Hover over categories to preview weaves or click "More" next to any category to expand sub-styles
            </span>
          </div>

          <button
            type="button"
            id="close-categories-megamenu"
            onClick={onClose}
            className="text-xs text-[#736B5E] hover:text-[#0F4C5C] uppercase tracking-wider font-semibold cursor-pointer flex items-center gap-1.5 px-2 py-1 hover:bg-[#E8DFD5]/40 rounded-sm transition-colors"
          >
            <span>Close Menu</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Structured Grid: Left Categories + Right Products */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Categories List with "More" Accordions + "Shop" section */}
          <div className="lg:col-span-5 bg-white border border-[#E8DFD5] shadow-xs divide-y divide-[#FAF7F2]">
            
            {/* Shop Curated Quick Access */}
            <div className="p-3 bg-[#FAF7F2]/80 border-b border-[#E8DFD5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#0F4C5C]" />
                <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#24211E]">
                  Shop Atelier Curations
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSelectCategory('all');
                }}
                className="text-[11px] font-semibold text-[#0F4C5C] hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Categories Heading */}
            <div className="px-3 py-2 bg-[#FAF9F5] flex items-center justify-between border-b border-[#E8DFD5]">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8C6D37]">
                Categories & Drapes ({categories.length})
              </span>
            </div>

            {/* Scrollable standard clean list of categories */}
            <div className="divide-y divide-[#FAF7F2] max-h-[460px] overflow-y-auto pr-1">
              {categories.map((cat) => {
                const isActive = cat.name === activeCategoryName;
                const count = products.filter(p => (p.category || '').toLowerCase() === cat.name.toLowerCase()).length;
                
                return (
                  <div
                    key={cat.id || cat.name}
                    id={`category-item-${cat.slug || cat.id}`}
                    onMouseEnter={() => setActiveCategoryName(cat.name)}
                    onClick={() => handleCategoryClick(cat.name)}
                    className={`w-full text-left px-3 py-2.5 flex items-center justify-between transition-all cursor-pointer group ${
                      isActive 
                        ? 'bg-[#F5EFE6] text-[#0F4C5C] font-semibold border-l-2 border-[#0F4C5C]' 
                        : 'text-[#24211E] hover:bg-[#FAF7F2] hover:text-[#0F4C5C]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <img 
                        src={cat.image} 
                        alt={cat.name} 
                        className="w-7 h-7 object-cover border border-[#E8DFD5] bg-[#F5EFE6] shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-xs tracking-wide block truncate">{cat.name}</span>
                        <span className="text-[10px] text-[#8A8175] font-normal block truncate max-w-[170px]">
                          {cat.description}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {count > 0 && (
                        <span className="font-mono text-[9px] bg-white px-1.5 py-0.5 border border-[#E8DFD5] text-[#8A8175]">
                          {count}
                        </span>
                      )}
                      <ArrowRight className={`w-3 h-3 text-[#8A8175] transition-transform ${isActive ? 'text-[#0F4C5C] translate-x-0.5' : 'opacity-0 group-hover:opacity-100'}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Category Showcase & Weaves (7 cols) */}
          <div className="lg:col-span-7">
            {/* Active Category Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD5] mb-4">
              <div>
                <h3 className="font-serif text-base font-bold text-[#24211E] flex items-center gap-2">
                  <span>{activeCategoryName}</span>
                  <span className="text-xs font-sans font-normal text-[#8A8175]">
                    ({activeProducts.length} weaves ready)
                  </span>
                </h3>
                <p className="text-xs text-[#736B5E] mt-0.5">
                  {activeCategoryObj?.description || 'Curated handcrafted heirlooms ready for exploration.'}
                </p>
              </div>

              <button
                type="button"
                id="view-all-category-creations-btn"
                onClick={() => handleCategoryClick(activeCategoryName)}
                className="text-xs font-semibold text-[#0F4C5C] hover:text-[#083540] flex items-center gap-1 uppercase tracking-wider group cursor-pointer"
              >
                <span>View All {activeCategoryName}</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>

            {/* Products Grid */}
            {activeProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {activeProducts.slice(0, 3).map((prod) => (
                  <div
                    key={prod.id}
                    id={`megamenu-product-${prod.id}`}
                    onClick={() => {
                      onClose();
                      onSelectProduct(prod);
                    }}
                    className="bg-white border border-[#E8DFD5] p-2.5 hover:border-[#0F4C5C] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5EFE6] mb-2.5">
                      <img
                        src={prod.images[0]}
                        alt={prod.title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      {prod.isReadyToShip && (
                        <span className="absolute top-1.5 left-1.5 bg-emerald-700 text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5">
                          Ready to Ship
                        </span>
                      )}
                      {prod.isOnSale && prod.salePrice && (
                        <span className="absolute top-1.5 right-1.5 bg-[#C08081] text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5">
                          Sale
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-[9px] text-[#8C6D37] uppercase tracking-wider font-medium block">
                        {prod.collection || 'AARU Atelier'}
                      </span>
                      <h4 className="font-serif text-xs font-bold text-[#24211E] line-clamp-1 group-hover:text-[#0F4C5C]">
                        {prod.title}
                      </h4>
                      <p className="text-[10px] text-[#736B5E] line-clamp-1 mt-0.5 font-light">
                        {prod.fabric}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#FAF7F2]">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs font-serif font-bold text-[#0F4C5C]">
                            ₹{(prod.salePrice || prod.price).toLocaleString('en-IN')}
                          </span>
                          {prod.isOnSale && prod.salePrice && (
                            <span className="text-[9px] text-[#8A8175] line-through">
                              ₹{prod.price.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                        <span className="text-[9px] uppercase font-bold text-[#8C6D37] tracking-wider group-hover:underline">
                          View
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-[#E8DFD5] p-8 text-center">
                <Sparkles className="w-6 h-6 text-[#8C6D37] mx-auto mb-2" />
                <p className="text-xs font-semibold text-[#24211E]">New Creations In Looming</p>
                <p className="text-[11px] text-[#736B5E] mt-1 max-w-sm mx-auto">
                  Our master artisans are presently weaving new {activeCategoryName} additions on Varanasi pit looms.
                </p>
                <button
                  type="button"
                  onClick={() => handleCategoryClick(activeCategoryName)}
                  className="mt-4 px-4 py-2 bg-[#0F4C5C] text-white text-xs font-semibold tracking-wider uppercase"
                >
                  Explore Collection
                </button>
              </div>
            )}

            {/* Custom Clothing Banner if customized clothing selected */}
            {activeCategoryName === 'Customized Clothing' && (
              <div className="mt-3 p-3.5 bg-[#F5EFE6] border border-[#D4C7B5] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0F4C5C] shrink-0" />
                  <div>
                    <p className="text-xs font-serif font-bold text-[#24211E]">Bespoke Moni Atelier Tailoring</p>
                    <p className="text-[11px] text-[#5C5549]">Work directly with Moni on bridal & festive drapes tailored to your measurements.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateCustom();
                  }}
                  className="px-3 py-1.5 bg-[#0F4C5C] text-white text-xs font-semibold uppercase tracking-wider shrink-0 cursor-pointer"
                >
                  Start Custom Order
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
