import React, { useState } from 'react';
import { Product, Category } from '../types';
import { Sparkles, ArrowRight, ArrowUpRight, CheckCircle2, Pin, X } from 'lucide-react';

interface CategoriesMegaMenuProps {
  categories: Category[];
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (categoryName: string) => void;
  onSelectProduct: (product: Product) => void;
  onNavigateCustom: () => void;
  isPinned?: boolean;
  onTogglePin?: () => void;
}

export const CategoriesMegaMenu: React.FC<CategoriesMegaMenuProps> = ({
  categories,
  products,
  isOpen,
  onClose,
  onSelectCategory,
  onSelectProduct,
  onNavigateCustom,
  isPinned = false,
  onTogglePin
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
    // If pinned, clicking previews the category products on the right so the user can easily browse!
    setActiveCategoryName(catName);
    if (!isPinned) {
      if (catName === 'Customized Clothing') {
        onClose();
        onNavigateCustom();
      } else {
        onClose();
        onSelectCategory(catName);
      }
    }
  };

  const handleCategoryNavigate = (catName: string) => {
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
      className="absolute top-full left-0 w-full bg-[#FAF7F2] border-b border-[#D4C7B5] shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200"
      onMouseLeave={() => {
        if (!isPinned) {
          onClose();
        }
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Title & Pin Status */}
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#E8DFD5] mb-6 gap-3">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-sans font-semibold tracking-[0.25em] uppercase text-[#8C6D37]">
              Atelier Collections Showcase
            </span>
            <span className="h-3 w-[1px] bg-[#D4C7B5]" />
            <span className="text-xs text-[#5C5549]">
              Explore 10 curated categories handcrafted on traditional Indian looms
            </span>
          </div>

          <div className="flex items-center gap-3">
            {onTogglePin && (
              <button
                type="button"
                id="toggle-pin-menu-btn"
                onClick={onTogglePin}
                className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border ${
                  isPinned 
                    ? 'bg-[#0F4C5C] text-white border-[#0F4C5C] shadow-xs' 
                    : 'bg-white text-[#736B5E] border-[#D4C7B5] hover:text-[#0F4C5C]'
                }`}
                title={isPinned ? "Menu is fixed open. Click to unpin." : "Pin menu open to browse freely."}
              >
                <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-current' : ''}`} />
                <span>{isPinned ? 'Fixed Open (Pinned)' : 'Pin Open'}</span>
              </button>
            )}

            <button
              type="button"
              id="close-categories-megamenu"
              onClick={onClose}
              className="text-xs text-[#736B5E] hover:text-[#0F4C5C] uppercase tracking-wider font-semibold cursor-pointer flex items-center gap-1"
            >
              <span>Close</span>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Pinned Info Banner */}
        {isPinned && (
          <div className="mb-4 py-2 px-3 bg-[#F5EFE6] border border-[#D4C7B5] text-xs text-[#0F4C5C] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Pin className="w-3.5 h-3.5 fill-[#0F4C5C] shrink-0" />
              <span>
                <strong>Menu Fixed in Open State:</strong> Select any category on the left to preview fabrics & drapes without closing.
              </span>
            </div>
            <span className="text-[10px] text-[#736B5E] uppercase tracking-wider font-semibold">
              Click any drape or 'View All' to open full catalog
            </span>
          </div>
        )}

        {/* Structured 2-Column Grid: Categories Navigation on Left, Corresponding Products on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: 10 Categories List / Grid (5 cols) */}
          <div className="lg:col-span-4 bg-white border border-[#E8DFD5] p-3 shadow-xs">
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8C6D37] px-3 py-2 border-b border-[#FAF7F2]">
              Select Category ({categories.length})
            </p>
            <div className="divide-y divide-[#FAF7F2] max-h-[440px] overflow-y-auto">
              {categories.map((cat) => {
                const isActive = cat.name === activeCategoryName;
                const count = products.filter(p => (p.category || '').toLowerCase() === cat.name.toLowerCase()).length;
                
                return (
                  <button
                    key={cat.id}
                    id={`category-item-${cat.slug}`}
                    type="button"
                    onMouseEnter={() => setActiveCategoryName(cat.name)}
                    onClick={() => handleCategoryClick(cat.name)}
                    className={`w-full text-left px-3 py-2.5 flex items-center justify-between transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[#F5EFE6] text-[#0F4C5C] font-semibold border-l-2 border-[#0F4C5C]' 
                        : 'text-[#24211E] hover:bg-[#FAF7F2] hover:text-[#0F4C5C]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={cat.image} 
                        alt={cat.name} 
                        className="w-8 h-8 object-cover border border-[#E8DFD5] bg-[#F5EFE6]"
                      />
                      <div>
                        <span className="text-xs tracking-wide block">{cat.name}</span>
                        <span className="text-[10px] text-[#8A8175] font-normal block truncate max-w-[170px]">
                          {cat.description}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-[#8A8175]">
                      {count > 0 && <span className="font-mono text-[10px] bg-white px-1.5 py-0.5 border border-[#E8DFD5]">{count}</span>}
                      <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'translate-x-0.5 text-[#0F4C5C]' : 'opacity-40'}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Corresponding Products Showcase for Active Category (8 cols) */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#0F4C5C] flex items-center gap-2">
                  <span>{activeCategoryName}</span>
                  {activeCategoryName === 'Customized Clothing' && (
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 bg-[#8C6D37] text-white">
                      Bespoke Atelier
                    </span>
                  )}
                </h3>
                <p className="text-xs text-[#736B5E] mt-0.5">
                  {activeCategoryObj?.description || `Handcrafted ${activeCategoryName} created with certified natural fibers.`}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleCategoryNavigate(activeCategoryName)}
                className="text-xs font-semibold text-[#0F4C5C] hover:text-[#0b3844] flex items-center gap-1 uppercase tracking-wider cursor-pointer border-b border-[#0F4C5C]/40 pb-0.5"
              >
                <span>View All {activeCategoryName}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Product Cards Grid */}
            {activeProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeProducts.slice(0, 3).map((prod) => (
                  <div
                    key={prod.id}
                    id={`megamenu-product-${prod.id}`}
                    onClick={() => {
                      onClose();
                      onSelectProduct(prod);
                    }}
                    className="bg-white border border-[#E8DFD5] p-3 hover:border-[#0F4C5C] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5EFE6] mb-3">
                      <img
                        src={prod.images[0]}
                        alt={prod.title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      {prod.isReadyToShip && (
                        <span className="absolute top-2 left-2 bg-emerald-700 text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5">
                          Ready to Ship
                        </span>
                      )}
                      {prod.isOnSale && prod.salePrice && (
                        <span className="absolute top-2 right-2 bg-[#C08081] text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5">
                          Sale
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] text-[#8C6D37] uppercase tracking-wider font-medium block">
                        {prod.collection || 'AARU Atelier'}
                      </span>
                      <h4 className="font-serif text-xs font-bold text-[#24211E] line-clamp-1 group-hover:text-[#0F4C5C]">
                        {prod.title}
                      </h4>
                      <p className="text-[11px] text-[#736B5E] line-clamp-1 mt-0.5 font-light">
                        {prod.fabric}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#FAF7F2]">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs font-serif font-bold text-[#0F4C5C]">
                            ₹{(prod.salePrice || prod.price).toLocaleString('en-IN')}
                          </span>
                          {prod.isOnSale && prod.salePrice && (
                            <span className="text-[10px] text-[#8A8175] line-through">
                              ₹{prod.price.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] uppercase font-bold text-[#8C6D37] tracking-wider group-hover:underline">
                          View Drape
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
              <div className="mt-4 p-4 bg-[#F5EFE6] border border-[#D4C7B5] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#0F4C5C] shrink-0" />
                  <div>
                    <p className="text-xs font-serif font-bold text-[#24211E]">Bespoke Moni Atelier Tailoring</p>
                    <p className="text-[11px] text-[#5C5549]">Work directly with Moni on personal bridal & festive drapes tailored to your exact measurements.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateCustom();
                  }}
                  className="px-4 py-2 bg-[#0F4C5C] text-white text-xs font-semibold uppercase tracking-wider shrink-0 cursor-pointer"
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
