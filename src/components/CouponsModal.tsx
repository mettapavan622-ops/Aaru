import React, { useState } from 'react';
import { PromoCode } from '../types';
import { X, Tag, Sparkles, Check, Copy, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';

interface CouponsModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupons: PromoCode[];
  onApplyCoupon?: (code: string) => void;
  cartSubtotal?: number;
}

export const CouponsModal: React.FC<CouponsModalProps> = ({
  isOpen,
  onClose,
  coupons = [],
  onApplyCoupon,
  cartSubtotal = 0
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleApply = (code: string) => {
    if (onApplyCoupon) {
      onApplyCoupon(code);
    } else {
      handleCopy(code);
    }
  };

  const activeCoupons = coupons.filter(c => c.isActive !== false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-[#FAF9F5] border border-[#D4C7B5] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E8DFD5] bg-[#FAF7F2] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#0F4C5C]/10 text-[#0F4C5C] flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#24211E]">
                Privilege Coupons & Atelier Offers
              </h3>
              <p className="text-[11px] text-[#736B5E]">
                Exclusive courtesy discounts on handloom weaves and bridal silks
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#736B5E] hover:text-[#24211E] p-1.5 transition-colors cursor-pointer"
            aria-label="Close privileges modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Redemption Guide Banner */}
        <div className="p-3.5 bg-[#0F4C5C]/5 border-b border-[#0F4C5C]/15 px-5 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-[#8C6D37] shrink-0 mt-0.5" />
          <div className="text-[11px] text-[#3D3730] leading-relaxed">
            <strong className="text-[#0F4C5C] font-semibold">How to Redeem:</strong> Select any active code below and click <span className="font-semibold text-[#0F4C5C]">Apply</span> (or copy code). Ensure your bag total satisfies the condition, and the discount will automatically deduct at checkout.
          </div>
        </div>

        {/* Coupons List */}
        <div className="p-5 overflow-y-auto divide-y divide-[#E8DFD5] space-y-4">
          {activeCoupons.length === 0 ? (
            <div className="text-center py-8">
              <Tag className="w-8 h-8 text-[#A89882] mx-auto mb-2 opacity-50" />
              <p className="text-xs text-[#736B5E]">No promotional offers active at this moment.</p>
              <p className="text-[11px] text-[#A89882] mt-1">Check back soon for seasonal festive privileges.</p>
            </div>
          ) : (
            activeCoupons.map((coupon) => {
              const qualifies = cartSubtotal >= (coupon.minOrderValue || 0);
              const remainingToQualify = (coupon.minOrderValue || 0) - cartSubtotal;

              return (
                <div key={coupon.code} className="pt-4 first:pt-0 space-y-2.5">
                  <div className="bg-white border border-[#E8DFD5] p-4 shadow-2xs space-y-3 relative overflow-hidden">
                    {/* Discount Ribbon Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm tracking-wider text-[#0F4C5C] bg-[#FAF7F2] border border-[#0F4C5C]/30 px-2.5 py-0.5">
                            {coupon.code}
                          </span>
                          <span className="bg-[#8C6D37] text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5">
                            {coupon.discountPercent}% OFF
                          </span>
                        </div>
                        <p className="text-xs font-serif font-semibold text-[#24211E] mt-1.5">
                          {coupon.description}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopy(coupon.code)}
                          title="Copy coupon code"
                          className="px-2.5 py-1.5 bg-[#FAF7F2] hover:bg-[#F3ECE0] border border-[#D4C7B5] text-[11px] font-medium text-[#5C5549] flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {copiedCode === coupon.code ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700 font-bold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                        {onApplyCoupon && (
                          <button
                            type="button"
                            onClick={() => handleApply(coupon.code)}
                            className="px-3 py-1.5 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <span>Apply</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Conditions and Eligibility */}
                    <div className="pt-2 border-t border-[#F0EAE1] grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#5C5549]">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#8C6D37] font-semibold">Min Spend:</span>
                        <span>{coupon.minOrderValue > 0 ? `₹${coupon.minOrderValue.toLocaleString('en-IN')}` : 'No minimum requirement'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#8C6D37] font-semibold">Max Savings:</span>
                        <span>{coupon.maxDiscount ? `₹${coupon.maxDiscount.toLocaleString('en-IN')}` : 'Unlimited savings'}</span>
                      </div>
                    </div>

                    {/* Qualification status if cart has items */}
                    {cartSubtotal > 0 && coupon.minOrderValue > 0 && (
                      <div className={`text-[10px] font-medium px-2 py-1 flex items-center gap-1.5 ${
                        qualifies 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {qualifies ? (
                          <>
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>Your current bag (₹{cartSubtotal.toLocaleString('en-IN')}) meets all conditions for this code!</span>
                          </>
                        ) : (
                          <>
                            <span>Add ₹{remainingToQualify.toLocaleString('en-IN')} more to your cart to unlock this offer.</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E8DFD5] bg-[#FAF7F2] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-[#736B5E]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0F4C5C]" />
            <span>Authenticated AARU Luxury Privileges</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#24211E] hover:bg-[#0F4C5C] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Back to Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
