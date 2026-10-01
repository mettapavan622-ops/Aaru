import React, { useState } from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

/**
 * ProductCard:
 * Redesigned luxury fashion product card.
 * Replaces generic marketplace cards with clean photography, quiet typography,
 * refined hover interactions, and zero-pill discipline.
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const primaryImage = product.images[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85';
  const secondaryImage = product.images[1] || primaryImage;

  return (
    <div 
      id={`product-card-${product.id}`}
      className="group relative flex flex-col bg-white border border-[#D4C7B5]/50 hover:border-[#0F4C5C]/60 transition-all duration-500 overflow-hidden cursor-pointer select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelectProduct(product)}
    >
      {/* Editorial Image Canvas (3:4 ratio) */}
      <div className="relative aspect-[3/4.2] w-full overflow-hidden bg-[#F5EFE6]">
        <img
          src={isHovered ? secondaryImage : primaryImage}
          alt={product.title}
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          loading="lazy"
        />

        {/* Minimal Unboxed Status Kicker (No Pill Enclosures) */}
        {product.isReadyToShip && (
          <div className="absolute top-3 left-3 z-10 bg-[#0D261E]/85 backdrop-blur-xs px-2.5 py-1 border border-[#B49A62]/30">
            <span className="text-[9px] font-serif tracking-[0.2em] uppercase text-[#F5F0E7]">
              Ready to Ship
            </span>
          </div>
        )}

        {/* Subtle Wishlist Trigger */}
        <button
          id={`wishlist-btn-${product.id}`}
          type="button"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-[#24211E] hover:text-[#0F4C5C] shadow-xs transition-all duration-200 hover:scale-105 active:scale-95 border border-white/40 cursor-pointer"
        >
          <Heart 
            className={`w-3.5 h-3.5 transition-colors ${
              isWishlisted ? 'fill-[#C08081] text-[#C08081]' : 'text-[#5C5549]'
            }`} 
          />
        </button>

        {/* Quiet Editorial "View Piece" Hover Bar */}
        <div className="absolute inset-x-0 bottom-0 z-10 py-2.5 px-4 bg-[#0D261E]/90 backdrop-blur-md border-t border-[#B49A62]/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-between text-[#F5F0E7]">
          <span className="text-[10px] tracking-[0.2em] uppercase font-serif">
            Explore Piece
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-[#B49A62]" />
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-2.5 bg-white">
        <div>
          {/* Category & Variant Count */}
          <div className="flex items-center justify-between text-[10px] tracking-[0.2em] uppercase text-[#8C6D37] mb-1 font-serif">
            <span>{product.category}</span>
            {product.fabric && (
              <span className="text-[#8A8175] text-[9.5px] font-sans lowercase tracking-normal">
                {product.fabric}
              </span>
            )}
          </div>

          {/* Product Title in High-Character Serif */}
          <h3 className="font-serif text-base sm:text-lg font-semibold text-[#24211E] leading-snug line-clamp-1 group-hover:text-[#0F4C5C] transition-colors">
            {product.title}
          </h3>

          {product.subtitle && (
            <p className="text-[11px] text-[#736B5E] line-clamp-1 mt-0.5 font-light">
              {product.subtitle}
            </p>
          )}
        </div>

        {/* Pricing Row in Clean Lining Digits */}
        <div className="pt-2 border-t border-[#E8DFD5]/50 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            {product.isOnSale && product.salePrice ? (
              <>
                <span className="text-sm sm:text-base font-semibold text-[#0F4C5C] font-price">
                  ₹{product.salePrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-[#8A8175] line-through font-price">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              </>
            ) : (
              <span className="text-sm sm:text-base font-semibold text-[#24211E] font-price">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <span className="text-[10px] tracking-wider uppercase text-[#8C6D37] font-serif opacity-0 group-hover:opacity-100 transition-opacity">
            Details →
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
