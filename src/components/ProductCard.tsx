import React, { useState } from 'react';
import { Heart, Sparkles, ArrowUpRight } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const primaryImage = product.images[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85';
  const secondaryImage = product.images[1] || primaryImage;

  const discountPercent = product.salePrice 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100) 
    : 0;

  return (
    <div 
      id={`product-card-${product.id}`}
      className="group relative flex flex-col bg-white/60 border border-[#E8DFD5] hover:border-[#0F4C5C]/40 rounded-sm transition-all duration-300 hover:shadow-lg overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelectProduct(product)}
    >
      {/* Image Canvas */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5EFE6]">
        <img
          src={isHovered ? secondaryImage : primaryImage}
          alt={product.title}
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isReadyToShip && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase bg-[#2D5A46] text-white rounded-none shadow-xs">
              <Sparkles className="w-2.5 h-2.5 text-emerald-200" />
              Ready to Ship
            </span>
          )}
          {product.isOnSale && discountPercent > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-[#C08081] text-white rounded-none shadow-xs">
              Save {discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          id={`wishlist-btn-${product.id}`}
          type="button"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#24211E] hover:text-[#0F4C5C] shadow-sm transition-all duration-200 hover:scale-110 active:scale-95"
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-[#C08081] text-[#C08081]' : 'text-[#5C5549]'
            }`} 
          />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            type="button"
            className="w-full py-2.5 bg-[#FAF7F2]/95 backdrop-blur-md text-[#0F4C5C] text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-md hover:bg-[#E8B4B8] hover:text-black transition-colors duration-200 border border-[#0F4C5C]/20 cursor-pointer"
          >
            Product Details
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-2 bg-[#FAF7F2]">
        <div>
          <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-widest text-[#8C6D37] mb-1">
            <span>{product.category}</span>
            <span className="text-[#8A8175] text-[10px]">{product.variants.length} {product.variants.length === 1 ? 'Variant' : 'Variants'}</span>
          </div>

          <h3 className="font-serif text-lg font-semibold text-[#24211E] leading-snug line-clamp-1 group-hover:text-[#0F4C5C] transition-colors">
            {product.title}
          </h3>

          {product.subtitle && (
            <p className="text-xs text-[#736B5E] line-clamp-1 mt-0.5 font-light">
              {product.subtitle}
            </p>
          )}
        </div>

        {/* Price Row */}
        <div className="pt-2 border-t border-[#E8DFD5]/60 flex items-baseline gap-2">
          {product.isOnSale && product.salePrice ? (
            <>
              <span className="text-base font-semibold text-[#0F4C5C]">
                ₹{product.salePrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-[#8A8175] line-through">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            </>
          ) : (
            <span className="text-base font-semibold text-[#24211E]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
