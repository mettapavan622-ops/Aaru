import React, { useState } from 'react';
import { LOOKBOOK_ITEMS } from '../data/mockData';
import { Product, LookTheme } from '../types';
import { 
  ArrowUpRight, 
  Sparkles, 
  ShoppingBag, 
  Check, 
  ChevronRight,
  Layers,
  Filter
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
  // Thematic Filtering State
  const [selectedTheme, setSelectedTheme] = useState<'All' | LookTheme>('All');

  // Filter definitions with dynamic count calculations
  const filterThemes: Array<{ id: 'All' | LookTheme; label: string; count: number; description: string }> = [
    { 
      id: 'All', 
      label: 'All Ensembles', 
      count: LOOKBOOK_ITEMS.length,
      description: 'Complete atelier lookbook portfolio'
    },
    { 
      id: 'Bridal Legacy', 
      label: 'Bridal Legacy', 
      count: LOOKBOOK_ITEMS.filter(l => l.theme === 'Bridal Legacy').length,
      description: 'Auspicious heirloom weaves for the wedding altar'
    },
    { 
      id: 'Regal Evening', 
      label: 'Regal Evening', 
      count: LOOKBOOK_ITEMS.filter(l => l.theme === 'Regal Evening').length,
      description: 'Opulent evening silks for high gala receptions'
    },
    { 
      id: 'Festive Grandeur', 
      label: 'Festive Grandeur', 
      count: LOOKBOOK_ITEMS.filter(l => l.theme === 'Festive Grandeur').length,
      description: 'Celebratory tissue & organza drapes'
    },
    { 
      id: 'Cocktail & Contemporary', 
      label: 'Cocktail & Contemporary', 
      count: LOOKBOOK_ITEMS.filter(l => l.theme === 'Cocktail & Contemporary').length,
      description: 'Modern silhouettes & metallic tissue drapes'
    },
    { 
      id: 'Heritage Heirloom', 
      label: 'Heritage Heirloom', 
      count: LOOKBOOK_ITEMS.filter(l => l.theme === 'Heritage Heirloom').length,
      description: 'Museum-caliber antique brocades & archival weaves'
    },
  ];

  // Filtered Looks according to the active theme
  const displayedLooks = selectedTheme === 'All'
    ? LOOKBOOK_ITEMS
    : LOOKBOOK_ITEMS.filter(l => l.theme === selectedTheme);

  // Current Lookbook Ensemble Selection
  const [selectedLookId, setSelectedLookId] = useState<string>(LOOKBOOK_ITEMS[0]?.id || 'look-1');
  
  // Current active Look entity (fallback if current look is outside filtered theme)
  const currentLook = displayedLooks.find(l => l.id === selectedLookId) || displayedLooks[0] || LOOKBOOK_ITEMS[0];
  const activeProduct = products.find(p => p.id === currentLook?.productId) || products[0];

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

  // Handle Theme Selection
  const handleThemeChange = (theme: 'All' | LookTheme) => {
    setSelectedTheme(theme);
    const targetLooks = theme === 'All' 
      ? LOOKBOOK_ITEMS 
      : LOOKBOOK_ITEMS.filter(l => l.theme === theme);
    if (targetLooks.length > 0) {
      setSelectedLookId(targetLooks[0].id);
    }
  };

  const activeThemeMeta = filterThemes.find(t => t.id === selectedTheme);

  return (
    <section id="shop-the-look" className="py-20 lg:py-28 bg-[#FAF7F2] border-t border-[#E8DFD5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
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
            Curated ceremonial ensembles styled by the AARU atelier. Explore complete outfits harmonizing handcrafted silk weaves, matching blouses, and heritage temple jewelry.
          </p>
        </div>

        {/* Thematic Filtering System: Tabs / Pill Buttons & Mobile Dropdown */}
        <div className="mb-10 sm:mb-14 max-w-5xl mx-auto">
          {/* Mobile Dropdown Selector (visible on small screens) */}
          <div className="sm:hidden mb-4">
            <label htmlFor="mobile-theme-dropdown" className="block text-[11px] font-semibold uppercase tracking-wider text-[#8C6D37] mb-1.5 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" />
              <span>Select Curated Theme:</span>
            </label>
            <div className="relative">
              <select
                id="mobile-theme-dropdown"
                value={selectedTheme}
                onChange={(e) => handleThemeChange(e.target.value as 'All' | LookTheme)}
                className="w-full appearance-none bg-white border border-[#0F4C5C] text-[#0F4C5C] py-2.5 px-3.5 pr-8 text-xs font-semibold uppercase tracking-wider rounded-none focus:outline-none focus:ring-1 focus:ring-[#0F4C5C] shadow-2xs"
              >
                {filterThemes.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.label} ({theme.count})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#0F4C5C]">
                <ChevronRight className="w-4 h-4 rotate-90" />
              </div>
            </div>
          </div>

          {/* Desktop & Tablet Pill Tabs */}
          <div className="hidden sm:flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            {filterThemes.map((theme) => {
              const isActive = selectedTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  id={`shop-the-look-filter-${theme.id.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  type="button"
                  onClick={() => handleThemeChange(theme.id)}
                  className={`px-4 sm:px-4.5 py-2 sm:py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition-all cursor-pointer flex items-center gap-2 border ${
                    isActive
                      ? 'bg-[#0F4C5C] text-white border-[#0F4C5C] shadow-sm ring-1 ring-[#0F4C5C]'
                      : 'bg-white text-[#5C5549] border-[#E8DFD5] hover:border-[#0F4C5C] hover:text-[#0F4C5C]'
                  }`}
                >
                  <span>{theme.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#FAF7F2] text-[#8C6D37]'
                  }`}>
                    {theme.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Theme Description Banner */}
          {activeThemeMeta && (
            <p className="text-center text-[11px] text-[#8C6D37] tracking-wider uppercase font-medium mt-3 italic">
              — {activeThemeMeta.description} —
            </p>
          )}
        </div>

        {/* Main Grid: Visual Stage + Ensemble Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Clean Editorial Lifestyle Canvas (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div 
              id="shop-the-look-stage"
              className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden bg-[#F5EFE6] border border-[#E8DFD5] shadow-xl group select-none"
            >
              {/* Static Lifestyle Background Image */}
              <img
                src={currentLook?.image}
                alt={currentLook?.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-101"
              />
              
              {/* Ambient Subtle Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

              {/* Look Tagline & Theme Badge */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                {currentLook?.theme && (
                  <span className="px-2.5 py-0.5 bg-[#0F4C5C] text-white text-[10px] uppercase font-bold tracking-[0.2em] shadow-xs w-fit">
                    {currentLook.theme}
                  </span>
                )}
                <div className="bg-[#FAF7F2]/95 backdrop-blur-md px-3 py-1.5 border border-[#8C6D37]/30 shadow-md">
                  <span className="text-[10px] sm:text-xs font-serif italic text-[#8C6D37] tracking-wider block">
                    "{currentLook?.tagline}"
                  </span>
                </div>
              </div>

              {/* Bottom Canvas Overlay Information */}
              <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 bg-[#FAF7F2]/95 backdrop-blur-md p-4 sm:p-5 border border-[#E8DFD5] shadow-lg">
                <div className="space-y-1 max-w-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-[#8C6D37]">
                      Styled Ensemble
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#8C6D37]" />
                    <span className="text-[10px] uppercase tracking-wider text-[#5C5549]">
                      Curated by AARU Atelier
                    </span>
                  </div>
                  <h3 className="font-serif text-lg sm:text-2xl font-bold text-[#0F4C5C]">
                    {currentLook?.title}
                  </h3>
                  <p className="text-xs text-[#5C5549] font-light">
                    {currentLook?.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E8DFD5]">
                  {activeProduct && (
                    <button
                      id="view-featured-piece-btn"
                      type="button"
                      onClick={() => handleViewProduct(activeProduct)}
                      className="flex-1 sm:flex-initial py-2.5 px-4 bg-white border border-[#0F4C5C] text-[#0F4C5C] hover:bg-[#0F4C5C] hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Explore Drape</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {activeProduct && (
                    <button
                      id="add-ensemble-lead-btn"
                      type="button"
                      onClick={(e) => handleAddToCart(e, activeProduct)}
                      className="flex-1 sm:flex-initial py-2.5 px-4 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      {addedProductId === activeProduct.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Bag</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Hotspot / Curated Ensemble Pieces Row */}
            {currentLook?.hotspots && currentLook.hotspots.length > 0 && (
              <div className="bg-white p-4 sm:p-5 border border-[#E8DFD5] shadow-xs">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#F0EBE1]">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-[#8C6D37] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    Ensemble Components & Pairing
                  </span>
                  <span className="text-[10px] text-[#736B5E]">
                    {currentLook.hotspots.length} Harmonized Pieces
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {currentLook.hotspots.map((hs) => {
                    const hsProduct = products.find(p => p.id === hs.productId);
                    return (
                      <div 
                        key={hs.id}
                        onClick={() => hsProduct && handleViewProduct(hsProduct)}
                        className="p-3 bg-[#FAF7F2] border border-[#E8DFD5] hover:border-[#0F4C5C] transition-colors cursor-pointer group flex flex-col justify-between"
                      >
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-[#8C6D37] font-semibold block">
                            {hs.role}
                          </span>
                          <h6 className="font-serif text-xs font-bold text-[#24211E] group-hover:text-[#0F4C5C] line-clamp-1 mt-0.5">
                            {hs.name}
                          </h6>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#E8DFD5]/50 text-xs">
                          <span className="font-semibold text-[#0F4C5C]">{hs.price}</span>
                          <span className="text-[10px] text-[#8C6D37] uppercase tracking-wider flex items-center gap-0.5 group-hover:underline">
                            View <ArrowUpRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Lookbook Ensembles Switcher & CTA (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-[#8C6D37] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                {selectedTheme === 'All' ? 'Curated Looks' : `${selectedTheme} Looks`}
              </h4>
              <span className="text-[10px] text-[#736B5E] font-medium">
                {displayedLooks.length} Ensembles
              </span>
            </div>

            {/* List of Looks for Selected Theme */}
            <div className="space-y-3">
              {displayedLooks.map((look) => {
                const isSelected = look.id === currentLook?.id;

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
                      <div className="flex items-center gap-2">
                        {look.theme && (
                          <span className="text-[9px] uppercase tracking-wider text-[#0F4C5C] font-semibold bg-[#0F4C5C]/10 px-1.5 py-0.5">
                            {look.theme}
                          </span>
                        )}
                        <span className="text-[9px] uppercase tracking-wider text-[#8C6D37] font-semibold truncate">
                          {look.tagline}
                        </span>
                      </div>
                      <h5 className="font-serif text-sm font-bold text-[#24211E] truncate mt-1">
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
