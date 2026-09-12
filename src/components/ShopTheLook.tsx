import React, { useState } from 'react';
import { LOOKBOOK_ITEMS } from '../data/mockData';
import { Product } from '../types';
import { ArrowUpRight, Sparkles, Eye } from 'lucide-react';

interface ShopTheLookProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onExploreAllLooks?: () => void;
}

export const ShopTheLook: React.FC<ShopTheLookProps> = ({ 
  products, 
  onSelectProduct,
  onExploreAllLooks 
}) => {
  const [selectedLookId, setSelectedLookId] = useState<string>(LOOKBOOK_ITEMS[0].id);

  const currentLook = LOOKBOOK_ITEMS.find(l => l.id === selectedLookId) || LOOKBOOK_ITEMS[0];
  const linkedProduct = products.find(p => p.id === currentLook.productId) || products[0];

  return (
    <section id="shop-the-look" className="py-20 lg:py-28 bg-[#FAF7F2] border-t border-[#E8DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-sans font-medium uppercase tracking-[0.25em] text-[#8C6D37]">
            Editorial Lookbook
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F4C5C] mt-2">
            Shop the Look
          </h2>
          <p className="text-xs sm:text-sm text-[#736B5E] font-light mt-2">
            Immersive editorial stylings curated by the AARU atelier. Explore complete ensembles from jewelry pairings to drape silhouettes.
          </p>
        </div>

        {/* Lookbook Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Selected Look with Interactive Shoppable Hotspot */}
          <div className="lg:col-span-8 relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-[#F5EFE6] border border-[#E8DFD5] shadow-xl group">
            <img
              src={currentLook.image}
              alt={currentLook.title}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-102"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

            {/* Interactive Shoppable Pulse Hotspot */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
              onClick={() => linkedProduct && onSelectProduct(linkedProduct)}
            >
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-white opacity-60" />
                <button
                  type="button"
                  aria-label="View Shoppable Ensemble"
                  className="relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/95 text-[#0F4C5C] shadow-2xl border border-[#0F4C5C] hover:scale-110 transition-transform"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Look Captions */}
            <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-sans tracking-[0.2em] text-[#D4C7B5]">
                  {currentLook.tagline}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold">{currentLook.title}</h3>
                <p className="text-xs text-white/80 font-light mt-0.5">{currentLook.subtitle}</p>
              </div>

              {linkedProduct && (
                <button
                  type="button"
                  onClick={() => onSelectProduct(linkedProduct)}
                  className="px-5 py-2.5 bg-white text-[#0F4C5C] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-[#FAF7F2] transition-colors shadow-md self-start sm:self-auto cursor-pointer"
                >
                  <span>Shop This Ensemble ({currentLook.price})</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Look Thumbnails Selector */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#8C6D37] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              Curated Lookbook Ensembles
            </h4>

            {LOOKBOOK_ITEMS.map((look) => {
              const isSelected = look.id === selectedLookId;
              return (
                <div
                  key={look.id}
                  onClick={() => setSelectedLookId(look.id)}
                  className={`p-3.5 border cursor-pointer transition-all flex items-center gap-4 ${
                    isSelected 
                      ? 'bg-white border-[#0F4C5C] shadow-md ring-1 ring-[#0F4C5C]' 
                      : 'bg-white/60 border-[#E8DFD5] hover:bg-white hover:border-[#D4C7B5]'
                  }`}
                >
                  <img
                    src={look.image}
                    alt={look.title}
                    className="w-16 h-20 object-cover bg-[#F5EFE6]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-[#8C6D37] font-medium">
                      {look.tagline}
                    </p>
                    <h5 className="font-serif text-sm font-bold text-[#24211E] truncate">
                      {look.title}
                    </h5>
                    <p className="text-xs font-semibold text-[#0F4C5C] mt-1">
                      {look.price}
                    </p>
                  </div>
                </div>
              );
            })}

            {onExploreAllLooks && (
              <button
                id="explore-all-shop-the-look-btn"
                type="button"
                onClick={onExploreAllLooks}
                className="w-full py-3 px-4 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer mt-2"
              >
                <span>Explore Dedicated Lookbook Ensembles</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
