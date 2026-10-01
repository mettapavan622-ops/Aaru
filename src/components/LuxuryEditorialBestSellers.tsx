import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface LuxuryEditorialBestSellersProps {
  products: Product[];
  onSelectProduct?: (product: Product) => void;
  onExploreAll?: () => void;
}

/**
 * LuxuryEditorialBestSellers:
 * High-fashion asymmetric editorial lookbook grid inspired by the reference recording.
 * Features numbered badges (01, 02, 03, 04), refined photography, and quiet luxury typography.
 */
export const LuxuryEditorialBestSellers: React.FC<LuxuryEditorialBestSellersProps> = ({
  products,
  onSelectProduct,
  onExploreAll
}) => {
  // Select 4 hero products from the catalog or fallback mock items
  const bestSellers = [
    {
      num: '01',
      title: 'Embroidered Sarees',
      subtitle: 'Grace in every drape.',
      image: products[0]?.images[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85',
      price: products[0]?.salePrice || products[0]?.price || 28900,
      product: products[0]
    },
    {
      num: '02',
      title: 'Heirloom Kurta Sets',
      subtitle: 'Everyday elegance, redefined.',
      image: products[3]?.images[0] || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=85',
      price: products[3]?.salePrice || products[3]?.price || 21500,
      product: products[3]
    },
    {
      num: '03',
      title: 'Metallic Tissue Sarees',
      subtitle: 'Art in every thread.',
      image: products[2]?.images[0] || 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=85',
      price: products[2]?.salePrice || products[2]?.price || 28500,
      product: products[2]
    },
    {
      num: '04',
      title: 'Kadwa Brocades',
      subtitle: 'Stories woven in pure gold zari.',
      image: products[1]?.images[0] || 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=85',
      price: products[1]?.salePrice || products[1]?.price || 39500,
      product: products[1]
    }
  ];

  return (
    <section className="relative w-full bg-[#FAF7F2] py-20 lg:py-28 overflow-hidden select-none border-b border-[#E8DFD5]">
      {/* Background Subtle Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#8C6D37_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

      {/* Side Editorial Annotations */}
      <div className="absolute top-1/2 left-6 -translate-y-1/2 hidden xl:block pointer-events-none">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#736B5E]/50 [writing-mode:vertical-lr] rotate-180 font-serif">
          Stories · Timeless In Every Thread
        </p>
      </div>

      <div className="absolute top-1/2 right-6 -translate-y-1/2 hidden xl:block pointer-events-none">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#736B5E]/50 [writing-mode:vertical-lr] font-serif">
          A Legacy · Tradition For Today
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 lg:mb-18 space-y-3">
          <span className="text-[10px] sm:text-xs font-serif tracking-[0.32em] uppercase text-[#8C6D37] font-semibold block">
            AARU Select
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#1A2E26] tracking-tight">
            Best Sellers
          </h2>
          <p className="text-xs sm:text-sm text-[#5C5549] font-light tracking-wide max-w-md mx-auto">
            The pieces our patrons reach for most. Handwoven stories of intuition and grace.
          </p>
        </div>

        {/* 4 Editorial Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {bestSellers.map((item) => (
            <div
              key={item.num}
              onClick={() => item.product && onSelectProduct && onSelectProduct(item.product)}
              className="group cursor-pointer flex flex-col bg-white border border-[#D4C7B5]/60 hover:border-[#0F4C5C] shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
            >
              {/* Image Area with Zoom */}
              <div className="relative aspect-[3/4.2] overflow-hidden bg-[#F5EFE6]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-top filter brightness-98 group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                
                {/* Numbered Pill Header (e.g. 01, 02) */}
                <div className="absolute top-3.5 left-3.5 bg-black/60 backdrop-blur-md px-2.5 py-1 border border-white/20">
                  <span className="text-[10px] font-mono tracking-widest text-[#FAF7F2] font-semibold">
                    {item.num}
                  </span>
                </div>

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-[#0F4C5C]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Text Area */}
              <div className="p-5 flex flex-col justify-between flex-1 bg-white space-y-3">
                <div className="space-y-1">
                  <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#24211E] group-hover:text-[#0F4C5C] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#736B5E] font-light line-clamp-1">
                    {item.subtitle}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#E8DFD5] flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-sans font-semibold text-[#0F4C5C] font-price">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                  
                  <span className="inline-flex items-center gap-1 text-[11px] tracking-wider uppercase font-semibold text-[#8C6D37] group-hover:text-[#0F4C5C] transition-colors">
                    <span>Shop Piece</span>
                    <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Button */}
        <div className="mt-14 text-center">
          <button
            type="button"
            onClick={onExploreAll}
            className="group px-8 py-3.5 bg-transparent hover:bg-[#0F4C5C] text-[#0F4C5C] hover:text-[#FAF7F2] border border-[#0F4C5C] text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 inline-flex items-center gap-3 cursor-pointer shadow-xs"
          >
            <span>Shop All Best Sellers</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default LuxuryEditorialBestSellers;
