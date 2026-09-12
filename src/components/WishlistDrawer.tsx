import React from 'react';
import { Product } from '../types';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveWishlist: (product: Product) => void;
  onMoveToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveWishlist,
  onMoveToCart,
  onSelectProduct
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
        {/* Header */}
        <div className="p-5 border-b border-[#E8DFD5] flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#C08081] fill-[#C08081]" />
            <h3 className="font-serif text-lg font-bold text-[#24211E]">
              Saved Heirloom Pieces ({wishlistProducts.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#E8DFD5]">
          {wishlistProducts.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Heart className="w-12 h-12 text-[#D4C7B5] mx-auto" />
              <p className="font-serif text-lg text-[#24211E]">Your wishlist is currently empty</p>
              <p className="text-xs text-[#736B5E]">Save pieces you adore while browsing our collections.</p>
            </div>
          ) : (
            wishlistProducts.map((p) => {
              const price = p.salePrice || p.price;
              return (
                <div key={p.id} className="py-4 flex gap-4">
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    onClick={() => {
                      onSelectProduct(p);
                      onClose();
                    }}
                    className="w-20 h-24 object-cover bg-[#F5EFE6] cursor-pointer border border-[#E8DFD5]"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#8C6D37]">{p.category}</span>
                      <h4 
                        onClick={() => {
                          onSelectProduct(p);
                          onClose();
                        }}
                        className="font-serif text-sm font-bold text-[#24211E] truncate cursor-pointer hover:text-[#0F4C5C]"
                      >
                        {p.title}
                      </h4>
                      <p className="text-xs font-semibold text-[#0F4C5C] mt-0.5">
                        ₹{price.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => onMoveToCart(p)}
                        className="px-3 py-1.5 bg-[#0F4C5C] text-white text-xs font-medium uppercase tracking-wider flex items-center gap-1.5 shadow-xs"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        Move to Bag
                      </button>

                      <button
                        type="button"
                        onClick={() => onRemoveWishlist(p)}
                        className="p-1.5 text-gray-400 hover:text-rose-600"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[#E8DFD5] bg-[#FAF7F2]">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-[#24211E] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <span>Continue Exploring Collections</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
