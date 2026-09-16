import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, ArrowRight, ShieldCheck, Tag, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, variantId: string, quantity: number) => void;
  onRemoveItem: (productId: string, variantId: string) => void;
  onProceedToCheckout: () => void;
  appliedPromo: string;
  onApplyPromo: (code: string) => Promise<{ success: boolean; message: string; discount?: number }> | { success: boolean; message: string; discount?: number } | boolean;
  onRemovePromo?: () => void;
  promoDiscount: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedPromo,
  onApplyPromo,
  onRemovePromo,
  promoDiscount
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => {
    const itemPrice = item.product.salePrice || item.product.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  const freeShippingThreshold = 15000;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const safeDiscount = Math.min(subtotal, Math.max(0, Number(promoDiscount) || 0));
  const remainingSubtotal = Math.max(0, subtotal - safeDiscount);
  const shippingFee = subtotal >= freeShippingThreshold || items.length === 0 ? 0 : 500;
  const tax = Math.round(remainingSubtotal * 0.05); // 5% GST on luxury textiles
  const total = Math.max(0, remainingSubtotal + shippingFee + tax);

  const handleApplyPromoCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    setPromoError('');
    setPromoSuccess('');
    setIsApplyingPromo(true);

    try {
      const result = await onApplyPromo(promoInput.trim());
      if (typeof result === 'boolean') {
        if (!result) {
          setPromoError('Invalid or inactive coupon code.');
        } else {
          setPromoSuccess('Coupon applied successfully!');
          setPromoInput('');
        }
      } else if (result && typeof result === 'object') {
        if (!result.success) {
          setPromoError(result.message || 'Invalid or inactive coupon code.');
        } else {
          setPromoSuccess(result.message || 'Privilege discount applied successfully!');
          setPromoInput('');
        }
      }
    } catch (err: any) {
      setPromoError(err.message || 'Error validating coupon code.');
    } finally {
      setIsApplyingPromo(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
        {/* Header */}
        <div className="p-5 border-b border-[#E8DFD5] flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#0F4C5C]" />
            <h3 className="font-serif text-lg font-bold text-[#24211E]">
              Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)})
            </h3>
          </div>
          <button
            type="button"
            aria-label="Close Shopping Bag"
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="px-5 py-3 bg-[#0F4C5C]/5 border-b border-[#0F4C5C]/10 text-xs">
          {remainingForFreeShipping === 0 ? (
            <p className="text-[#2D5A46] font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              You qualify for complimentary express worldwide delivery!
            </p>
          ) : (
            <div>
              <p className="text-[#5C5549]">
                Add <strong className="text-[#0F4C5C]">₹{remainingForFreeShipping.toLocaleString('en-IN')}</strong> more for complimentary delivery.
              </p>
              <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1.5 overflow-hidden">
                <div 
                  className="h-full bg-[#0F4C5C] transition-all duration-300"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#E8DFD5]">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <ShoppingBag className="w-12 h-12 text-[#D4C7B5] mx-auto" />
              <p className="font-serif text-lg text-[#24211E]">Your shopping bag is empty</p>
              <p className="text-xs text-[#736B5E] max-w-xs mx-auto">
                Explore our handcrafted Banarasi weaves, organza sarees, and custom editions.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-[#0F4C5C] text-white text-xs font-semibold uppercase tracking-wider"
              >
                Discover Weaves
              </button>
            </div>
          ) : (
            items.map((item) => {
              const itemPrice = item.product.salePrice || item.product.price;
              return (
                <div key={`${item.product.id}-${item.variant.id}`} className="py-4 flex gap-4">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-20 h-24 object-cover bg-[#F5EFE6] shrink-0 border border-[#E8DFD5]"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif text-sm font-bold text-[#24211E] truncate">
                        {item.product.title}
                      </h4>
                      <p className="text-[11px] text-[#736B5E] mt-0.5">
                        Size: <span className="font-medium text-[#24211E]">{item.variant.size}</span>
                      </p>
                      <p className="text-xs font-semibold text-[#0F4C5C] mt-1">
                        ₹{itemPrice.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity buttons */}
                      <div className="flex items-center border border-[#D4C7B5] bg-[#FAF7F2]">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, item.variant.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs hover:bg-gray-200"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, item.variant.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs hover:bg-gray-200"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        aria-label="Remove item"
                        onClick={() => onRemoveItem(item.product.id, item.variant.id)}
                        className="text-[#C08081] hover:text-rose-700 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Calculations and Checkout */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#E8DFD5] bg-[#FAF7F2] space-y-4">
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromoCode} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Coupon code (e.g. AARU10, SILK5)"
                  value={promoInput}
                  onChange={(e) => {
                    setPromoInput(e.target.value.toUpperCase());
                    setPromoError('');
                  }}
                  className="w-full pl-7 pr-3 py-2 bg-white border border-[#D4C7B5] text-xs font-mono font-bold uppercase placeholder:font-sans placeholder:font-normal placeholder:normal-case focus:outline-none focus:border-[#0F4C5C]"
                />
                <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              </div>
              <button
                type="submit"
                disabled={isApplyingPromo || !promoInput.trim()}
                className="px-4 py-2 bg-[#24211E] hover:bg-[#0F4C5C] disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                {isApplyingPromo ? 'Checking...' : 'Apply'}
              </button>
            </form>

            {promoError && (
              <p className="text-[11px] text-rose-600 font-medium bg-rose-50 p-2 border border-rose-200">{promoError}</p>
            )}

            {promoSuccess && !promoError && (
              <p className="text-[11px] text-emerald-700 font-medium bg-emerald-50 p-2 border border-emerald-200">{promoSuccess}</p>
            )}

            {appliedPromo && (
              <div className="flex items-center justify-between text-xs text-[#2D5A46] bg-emerald-50 px-2.5 py-1.5 border border-emerald-200">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Code <strong className="font-mono font-bold">{appliedPromo}</strong> applied</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">-₹{safeDiscount.toLocaleString('en-IN')}</span>
                  {onRemovePromo && (
                    <button
                      type="button"
                      onClick={() => {
                        onRemovePromo();
                        setPromoSuccess('');
                      }}
                      className="text-gray-400 hover:text-rose-600 text-[10px] underline ml-1 cursor-pointer uppercase tracking-wider"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-[#5C5549] pt-2 border-t border-[#E8DFD5]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {safeDiscount > 0 && (
                <>
                  <div className="flex justify-between text-[#2D5A46]">
                    <span>Privilege Savings ({appliedPromo})</span>
                    <span>-₹{safeDiscount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-[#24211E] font-medium">
                    <span>Remaining Subtotal</span>
                    <span>₹{remainingSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span>Estimated Courier Delivery</span>
                <span>{shippingFee === 0 ? 'Complimentary' : `₹${shippingFee.toLocaleString('en-IN')}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated GST (5%)</span>
                <span>₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-serif text-base font-bold text-[#24211E] pt-2 border-t border-[#E8DFD5]">
                <span>Total Amount</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              type="button"
              id="proceed-checkout-btn"
              onClick={onProceedToCheckout}
              className="w-full py-3.5 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
