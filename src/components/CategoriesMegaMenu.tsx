import React, { useState } from 'react';
import { Product, Category } from '../types';
import { Sparkles, ArrowRight, ArrowUpRight, CheckCircle2, X, ChevronDown, ShoppingBag } from 'lucide-react';

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

// Curated sub-options for every category's "More" accordion expansion
const CATEGORY_SUBOPTIONS: Record<string, { name: string; tag: string }[]> = {
  'Sarees': [
    { name: 'Pure Kanjeevaram Silk', tag: 'Kanjeevaram' },
    { name: 'Handloom Banarasi Tanchoi', tag: 'Banarasi' },
    { name: 'Chanderi Zari Brocade', tag: 'Chanderi' },
    { name: 'Tussar & Muga Silk Drapes', tag: 'Silk' },
    { name: 'Artisanal Handspun Cotton', tag: 'Cotton' }
  ],
  'Lehengas': [
    { name: 'Bridal Heirloom Lehengas', tag: 'Bridal' },
    { name: 'Hand-Embroidered Organza', tag: 'Organza' },
    { name: 'Monochromatic Velvet Sets', tag: 'Velvet' },
    { name: 'Pastel Festive Lehengas', tag: 'Pastel' },
    { name: 'Cocktail Sangeet Silhouettes', tag: 'Cocktail' }
  ],
  'Kurtas & Sets': [
    { name: 'Anarkali Loom Suits', tag: 'Anarkali' },
    { name: 'Straight-Cut Chanderi Tunics', tag: 'Chanderi' },
    { name: 'Handcrafted Co-ord Sets', tag: 'Co-ord' },
    { name: 'Embroidered Kurta Dupatta', tag: 'Festive' }
  ],
  'Fabrics': [
    { name: 'Pure Mulberry Silk Yardage', tag: 'Silk' },
    { name: 'Tissue & Scalloped Organza', tag: 'Organza' },
    { name: 'Natural Indigo Hand-Block Cotton', tag: 'Cotton' },
    { name: 'Raw Silk & Hand-woven Brocade', tag: 'Brocade' }
  ],
  'Customized Clothing': [
    { name: 'Bridal Trousseau Consultation', tag: 'Bridal' },
    { name: 'Maggam Work & Zardozi Blouses', tag: 'Blouses' },
    { name: 'Made-to-Measure Custom Lehengas', tag: 'Custom' },
    { name: 'Direct Weaver Loom Draping', tag: 'Bespoke' }
  ],
  'Dupattas & Stoles': [
    { name: 'Banarasi Tanchoi Dupattas', tag: 'Banarasi' },
    { name: 'Hand-Painted Kalamkari Drapes', tag: 'Kalamkari' },
    { name: 'Scalloped Border Organza Stoles', tag: 'Organza' },
    { name: 'Chanderi Zari Stoles', tag: 'Chanderi' }
  ],
  'Jewellery & Accents': [
    { name: 'Temple Heritage Jewellery', tag: 'Temple' },
    { name: 'Handcrafted Polki & Kundan', tag: 'Kundan' },
    { name: 'Silver Zari Belts (Kamarbandh)', tag: 'Zari' },
    { name: 'Artisanal Velvet Potlis', tag: 'Potli' }
  ],
  'Ready to Ship': [
    { name: '24-Hour Express Dispatch Sarees', tag: 'Express' },
    { name: 'Pre-Stitched Saree Silhouettes', tag: 'Pre-stitched' },
    { name: 'Immediate Gifting Heirlooms', tag: 'Heirloom' }
  ],
  'Heritage Weaves': [
    { name: 'Authentic Yeola Paithani', tag: 'Paithani' },
    { name: 'Double Ikat Patan Patola', tag: 'Patola' },
    { name: 'Banarasi Jangla Silk', tag: 'Jangla' },
    { name: 'Pochampally Ikat Weaves', tag: 'Ikat' }
  ],
  'Organza Edit': [
    { name: 'Hand-Painted Floral Organza', tag: 'Floral' },
    { name: 'Metallic Tissue Organza Sarees', tag: 'Tissue' },
    { name: 'Cutwork Scalloped Borders', tag: 'Cutwork' }
  ]
};

// Curated Shop by Filters for the "Shop" More accordion
const SHOP_MORE_CATEGORIES = [
  {
    title: 'Shop by Fabric',
    items: ['Pure Mulberry Silk', 'Tissue Organza', 'Handspun Cotton', 'Chanderi Brocade']
  },
  {
    title: 'Shop by Occasion',
    items: ['Bridal & Wedding', 'Festive Pooja', 'Cocktail & Sangeet', 'Everyday Luxury']
  },
  {
    title: 'Shop by Drape',
    items: ['Classic 6-Yard Saree', 'Pre-draped Saree', 'Lehenga Choli', 'Trousseau Sets']
  },
  {
    title: 'Price Filter',
    items: ['Under ₹5,000', '₹5,000 – ₹15,000', 'Heirloom Luxury (₹15,000+)']
  }
];

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

  // Accordion expansion state: maps category id or name to boolean
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<Record<string, boolean>>({});
  // Shop section More accordion toggle state
  const [isShopMoreExpanded, setIsShopMoreExpanded] = useState<boolean>(false);

  if (!isOpen) return null;

  const toggleCategoryMore = (catKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategoryIds(prev => ({
      ...prev,
      [catKey]: !prev[catKey]
    }));
  };

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
            
            {/* Shop Curated Collections with "More" Expansion Toggle */}
            <div className="p-3 bg-[#FAF7F2]/80 border-b border-[#E8DFD5]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#0F4C5C]" />
                  <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#24211E]">
                    Shop Atelier Curations
                  </span>
                </div>
                <button
                  type="button"
                  id="megamenu-shop-more-btn"
                  onClick={() => setIsShopMoreExpanded(!isShopMoreExpanded)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-xs border transition-all cursor-pointer ${
                    isShopMoreExpanded
                      ? 'bg-[#0F4C5C] text-white border-[#0F4C5C]'
                      : 'bg-white text-[#8C6D37] border-[#D4C7B5] hover:border-[#0F4C5C] hover:text-[#0F4C5C]'
                  }`}
                  title="Expand or collapse more shopping options"
                >
                  <span>More</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isShopMoreExpanded ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Shop Section "More" Accordion Expansion */}
              {isShopMoreExpanded && (
                <div 
                  id="megamenu-shop-more-panel"
                  className="mt-3 pt-3 border-t border-[#E8DFD5] grid grid-cols-2 gap-3 animate-in fade-in duration-200"
                >
                  {SHOP_MORE_CATEGORIES.map((catGroup) => (
                    <div key={catGroup.title} className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D37]">
                        {catGroup.title}
                      </p>
                      <ul className="space-y-1">
                        {catGroup.items.map((item) => (
                          <li key={item}>
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onSelectCategory(item);
                              }}
                              className="text-[11px] text-[#5C5549] hover:text-[#0F4C5C] hover:underline cursor-pointer block text-left"
                            >
                              • {item}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Categories Heading */}
            <div className="px-3 py-2 bg-[#FAF9F5] flex items-center justify-between border-b border-[#E8DFD5]">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8C6D37]">
                Categories & Drapes ({categories.length})
              </span>
              <span className="text-[10px] text-[#8A8175] font-light">Click 'More' to view sub-options</span>
            </div>

            {/* Scrollable list of categories with individual "More" toggle */}
            <div className="divide-y divide-[#FAF7F2] max-h-[460px] overflow-y-auto pr-1">
              {categories.map((cat) => {
                const isActive = cat.name === activeCategoryName;
                const isExpanded = !!expandedCategoryIds[cat.id || cat.name];
                const subOptions = CATEGORY_SUBOPTIONS[cat.name] || [
                  { name: `All ${cat.name}`, tag: cat.name },
                  { name: `Artisanal ${cat.name}`, tag: 'Artisanal' },
                  { name: `Festive ${cat.name}`, tag: 'Festive' }
                ];
                const count = products.filter(p => (p.category || '').toLowerCase() === cat.name.toLowerCase()).length;
                
                return (
                  <div key={cat.id || cat.name} className="flex flex-col">
                    {/* Category Row */}
                    <div
                      id={`category-item-${cat.slug || cat.id}`}
                      onMouseEnter={() => setActiveCategoryName(cat.name)}
                      onClick={() => handleCategoryClick(cat.name)}
                      className={`w-full text-left px-3 py-2.5 flex items-center justify-between transition-all cursor-pointer ${
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
                          <span className="text-[10px] text-[#8A8175] font-normal block truncate max-w-[150px]">
                            {cat.description}
                          </span>
                        </div>
                      </div>

                      {/* Right Action: "More" Accordion Expansion Button + Count */}
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {count > 0 && (
                          <span className="font-mono text-[9px] bg-white px-1.5 py-0.5 border border-[#E8DFD5] text-[#8A8175]">
                            {count}
                          </span>
                        )}

                        {/* Dedicated 'More' Accordion Button next to Category */}
                        <button
                          type="button"
                          id={`cat-more-btn-${cat.slug || cat.id}`}
                          onClick={(e) => toggleCategoryMore(cat.id || cat.name, e)}
                          className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-xs border transition-colors flex items-center gap-0.5 cursor-pointer ${
                            isExpanded 
                              ? 'bg-[#0F4C5C] text-white border-[#0F4C5C]' 
                              : 'bg-white text-[#8C6D37] border-[#D4C7B5] hover:border-[#0F4C5C] hover:text-[#0F4C5C]'
                          }`}
                          title={`Explore more sub-options for ${cat.name}`}
                        >
                          <span>More</span>
                          <ChevronDown className={`w-2.5 h-2.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Category "More" Accordion Sub-options */}
                    {isExpanded && (
                      <div 
                        id={`cat-suboptions-${cat.slug || cat.id}`}
                        className="bg-[#FAF9F5] px-4 py-2.5 border-t border-b border-[#E8DFD5]/70 space-y-1.5 animate-in fade-in duration-150"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-[#8C6D37]">
                            {cat.name} Sub-Weaves & Styles
                          </span>
                          <span className="text-[9px] text-[#8A8175]">Click to explore</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {subOptions.map((sub) => (
                            <button
                              key={sub.name}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                                onSelectCategory(sub.name);
                              }}
                              className="px-2 py-1 bg-white border border-[#D4C7B5] text-[10px] text-[#4A4339] hover:bg-[#0F4C5C] hover:text-white hover:border-[#0F4C5C] transition-colors cursor-pointer rounded-xs"
                            >
                              {sub.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
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
