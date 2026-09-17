import React, { useState, useMemo, useEffect } from 'react';
import { Product, ProductVariant } from '../types';
import { 
  Heart, 
  ShoppingBag, 
  MessageCircle, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Ruler, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  ArrowLeft 
} from 'lucide-react';

interface ProductDetailPageProps {
  product: Product;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onBack: () => void;
  onSelectRelated: (product: Product) => void;
  relatedProducts: Product[];
  onNavigateToPolicy?: (policy: 'shipping-policy' | 'returns-policy') => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  onBack,
  onSelectRelated,
  relatedProducts,
  onNavigateToPolicy
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Check if item is a Saree where size is Free Size
  const isSaree = useMemo(() => {
    const cat = (product.category || '').toLowerCase();
    const title = (product.title || '').toLowerCase();
    const slug = (product.slug || '').toLowerCase();
    return (
      cat === 'sarees' || 
      cat === 'saree' || 
      title.includes('saree') || 
      title.includes('sari') || 
      title.includes('pattu') || 
      slug.includes('saree') ||
      cat === 'dress materials'
    );
  }, [product]);

  // Compute available variants strictly following:
  // "The sizes (XS,S,M,L,XL,XXL) sizes should be available for all the types of dresses where size is mandatory, for sarres the option would be free size."
  const availableVariants = useMemo<ProductVariant[]>(() => {
    if (isSaree) {
      const existing = product.variants.find(v => v.size === 'Free Size') || product.variants[0];
      return [{
        id: existing?.id || `v-${product.id}-free`,
        size: 'Free Size',
        color: existing?.color || 'Pure Silk',
        colorCode: existing?.colorCode || '#0F4C5C',
        inventory: Math.max(existing?.inventory ?? 6, 4),
        sku: existing?.sku || `${product.id.toUpperCase()}-FS`,
        isAvailable: true
      }];
    }

    // For all types of dresses where size is mandatory: XS, S, M, L, XL, XXL
    const standardSizes: Array<'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'> = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const baseVariant = product.variants[0];
    const baseSkuPrefix = (baseVariant?.sku || `AARU-${product.id.toUpperCase()}`).replace(/-[A-Z0-9]+$/, '');

    return standardSizes.map((sz, idx) => {
      const match = product.variants.find(v => v.size === sz);
      if (match) {
        return {
          ...match,
          isAvailable: match.inventory > 0
        };
      }
      return {
        id: `v-${product.id}-${sz.toLowerCase()}`,
        size: sz,
        color: baseVariant?.color || 'Pure Handloom Silk',
        colorCode: baseVariant?.colorCode || '#0F4C5C',
        inventory: 4 + ((idx * 2) % 5),
        sku: `${baseSkuPrefix}-${sz}`,
        isAvailable: true
      };
    });
  }, [product, isSaree]);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(() => {
    if (isSaree) {
      return product.variants.find(v => v.size === 'Free Size') || product.variants[0] || {
        id: 'default',
        size: 'Free Size',
        color: 'Default',
        colorCode: '#9C7C38',
        inventory: 5,
        sku: 'SKU-DEF-FS',
        isAvailable: true
      };
    }
    return product.variants.find(v => v.size === 'M') || product.variants[0] || {
      id: 'default',
      size: 'M',
      color: 'Default',
      colorCode: '#9C7C38',
      inventory: 5,
      sku: 'SKU-DEF-M',
      isAvailable: true
    };
  });

  useEffect(() => {
    if (availableVariants.length > 0) {
      const match = availableVariants.find(v => v.size === selectedVariant?.size) || 
                    availableVariants.find(v => v.size === 'M') || 
                    availableVariants[0];
      setSelectedVariant(match);
    }
  }, [availableVariants]);
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('fabric-craft');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const discountPercent = product.salePrice 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100) 
    : 0;

  const handleAddToCartClick = () => {
    onAddToCart(product, selectedVariant, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const whatsappInquiryMessage = `Hello AARU Studio, I am inquiring about the ${product.title} (SKU: ${selectedVariant.sku}, Size: ${selectedVariant.size}). Price: ₹${(product.salePrice || product.price).toLocaleString('en-IN')}. Is this available for styling consultation?`;
  const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(whatsappInquiryMessage)}`;

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="py-8 lg:py-12 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation & Category Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#0F4C5C] hover:text-[#0b3844] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Collections
          </button>

          <span className="text-[11px] uppercase tracking-wider text-[#8C6D37]">
            {product.category} • {product.collection}
          </span>
        </div>

        {/* Product PDP Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Multi-Image Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:w-20 shrink-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative aspect-[3/4] w-16 sm:w-full overflow-hidden border cursor-pointer transition-all ${
                    selectedImageIndex === idx 
                      ? 'border-[#0F4C5C] ring-1 ring-[#0F4C5C]' 
                      : 'border-[#E8DFD5] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.title} thumb ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Stage View - Clean High-Resolution Display */}
            <div className="flex-1 relative aspect-[3/4] overflow-hidden bg-[#F5EFE6] border border-[#E8DFD5] shadow-sm">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover object-center"
              />

              {/* Status Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none z-10">
                {product.isReadyToShip && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-semibold tracking-wider uppercase bg-[#2D5A46] text-white shadow-xs">
                    <Sparkles className="w-3 h-3 text-emerald-300" />
                    Ready to Ship
                  </span>
                )}
                {product.isOnSale && discountPercent > 0 && (
                  <span className="px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase bg-[#C08081] text-white shadow-xs">
                    Save {discountPercent}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Title, Pricing, Variant Selection, Actions, Accordions */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8C6D37] mb-1">
                {product.collection}
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#24211E] leading-tight">
                {product.title}
              </h1>
              {product.subtitle && (
                <p className="text-xs sm:text-sm text-[#736B5E] font-light mt-1">
                  {product.subtitle}
                </p>
              )}
            </div>

            {/* Pricing */}
            <div className="py-3 border-y border-[#E8DFD5] flex items-baseline gap-3">
              {product.isOnSale && product.salePrice ? (
                <>
                  <span className="text-2xl sm:text-3xl font-sans font-bold text-[#0F4C5C]">
                    ₹{product.salePrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-[#8A8175] line-through">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-semibold text-[#C08081] ml-auto">
                    (Includes all taxes & duty)
                  </span>
                </>
              ) : (
                <>
                  <span className="text-2xl sm:text-3xl font-sans font-bold text-[#24211E]">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-[#8A8175] ml-auto">
                    (Includes all taxes & duty)
                  </span>
                </>
              )}
            </div>

            {/* Variants / Sizes Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#24211E]">
                  Available Sizes & Cuts: {isSaree ? '(Free Size for Sarees)' : '(XS–XXL Available)'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-xs font-semibold text-[#0F4C5C] hover:text-[#C08081] transition-colors underline flex items-center gap-1 cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  Size Guide
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {availableVariants.map((v) => {
                  const isSelected = selectedVariant.id === v.id || selectedVariant.size === v.size;
                  const isOutOfStock = v.inventory === 0;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      disabled={isOutOfStock}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#0F4C5C] bg-[#0F4C5C] text-white shadow-xs'
                          : isOutOfStock
                            ? 'border-gray-200 bg-gray-100 text-gray-400 line-through cursor-not-allowed'
                            : 'border-[#D4C7B5] bg-white text-[#24211E] hover:border-[#0F4C5C] hover:bg-[#FAF7F0]'
                      }`}
                    >
                      {v.size} {v.inventory > 0 && v.inventory <= 3 ? `(${v.inventory} Left)` : ''}
                    </button>
                  );
                })}
              </div>

              {/* SKU and Inventory Stock Indicator */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-[#736B5E]">
                <span>SKU: {selectedVariant.sku}</span>
                <span className={`font-semibold ${selectedVariant.inventory > 0 ? 'text-[#2D5A46]' : 'text-rose-600'}`}>
                  {selectedVariant.inventory > 0 
                    ? `In Stock (${selectedVariant.inventory} units available)` 
                    : 'Out of Stock / Made to Order'}
                </span>
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-[#D4C7B5] bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2.5 text-xs text-[#24211E] hover:bg-[#FAF7F2]"
                  >
                    -
                  </button>
                  <span className="px-3 py-2.5 text-xs font-semibold text-[#24211E] min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(selectedVariant.inventory || 10, quantity + 1))}
                    className="px-3 py-2.5 text-xs text-[#24211E] hover:bg-[#FAF7F2]"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart with Muted Rose Hover Effect */}
                <button
                  type="button"
                  onClick={handleAddToCartClick}
                  disabled={selectedVariant.inventory === 0}
                  className={`flex-1 py-3 px-6 text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer border border-transparent ${
                    addedAnimation 
                      ? 'bg-[#2D5A46] text-white' 
                      : 'bg-[#0F4C5C] text-white hover:bg-[#E8B4B8] hover:text-black hover:border-[#E8B4B8]'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-200" />
                      Added to Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      Add to Shopping Bag
                    </>
                  )}
                </button>

                {/* Wishlist Icon */}
                <button
                  type="button"
                  aria-label="Save to Wishlist"
                  onClick={() => onToggleWishlist(product)}
                  className={`p-3 border border-[#D4C7B5] bg-white transition-colors hover:border-[#0F4C5C] cursor-pointer ${
                    isWishlisted ? 'text-[#C08081]' : 'text-[#24211E]'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#C08081]' : ''}`} />
                </button>
              </div>

              {/* Direct WhatsApp Consultation Button with Muted Rose Hover Effect */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-white border border-[#2D5A46] text-[#2D5A46] hover:bg-[#E8B4B8] hover:text-black hover:border-[#E8B4B8] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                Ask Stylist on WhatsApp About This Weave
              </a>
            </div>

            {/* Quick Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#E8DFD5] text-[11px] text-[#5C5549]">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#0F4C5C]" />
                <span>Complimentary Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#9C7C38]" />
                <span>100% Pure Silk Mark</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-[#2D5A46]" />
                <span>7-Day Return SLA</span>
              </div>
            </div>

            {/* Accordions */}
            <div className="divide-y divide-[#E8DFD5] border-t border-b border-[#E8DFD5]">
              {/* Description */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('desc')}
                  className="w-full py-3 text-left text-xs font-bold uppercase tracking-wider text-[#24211E] flex items-center justify-between"
                >
                  <span>Description & Narrative</span>
                  {openAccordion === 'desc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === 'desc' && (
                  <div className="pb-3 text-xs text-[#5C5549] leading-relaxed font-light">
                    <p>{product.description}</p>
                    <p className="mt-2 text-[11px] font-medium text-[#8C6D37]">Occasion: {product.occasion}</p>
                  </div>
                )}
              </div>

              {/* Fabric & Craft */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('fabric-craft')}
                  className="w-full py-3 text-left text-xs font-bold uppercase tracking-wider text-[#24211E] flex items-center justify-between"
                >
                  <span>Fabric & Artisanal Craft</span>
                  {openAccordion === 'fabric-craft' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === 'fabric-craft' && (
                  <div className="pb-3 text-xs text-[#5C5549] space-y-2 leading-relaxed font-light">
                    <p><strong className="font-semibold text-[#24211E]">Fabric:</strong> {product.fabric}</p>
                    <p><strong className="font-semibold text-[#24211E]">Craft Heritage:</strong> {product.craft}</p>
                  </div>
                )}
              </div>

              {/* Fabric Care */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('care')}
                  className="w-full py-3 text-left text-xs font-bold uppercase tracking-wider text-[#24211E] flex items-center justify-between"
                >
                  <span>Care & Preservation</span>
                  {openAccordion === 'care' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === 'care' && (
                  <div className="pb-3 text-xs text-[#5C5549] leading-relaxed font-light">
                    <p>{product.careInstructions}</p>
                  </div>
                )}
              </div>

              {/* Fit & Dimensions */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('fit')}
                  className="w-full py-3 text-left text-xs font-bold uppercase tracking-wider text-[#24211E] flex items-center justify-between"
                >
                  <span>Fit & Dimensions</span>
                  {openAccordion === 'fit' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === 'fit' && (
                  <div className="pb-3 text-xs text-[#5C5549] leading-relaxed font-light">
                    <p>{product.fitAndSizeInfo}</p>
                  </div>
                )}
              </div>

              {/* Shipping & Returns */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full py-3 text-left text-xs font-bold uppercase tracking-wider text-[#24211E] flex items-center justify-between"
                >
                  <span>Shipping & Returns</span>
                  {openAccordion === 'shipping' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === 'shipping' && (
                  <div className="pb-3 text-xs text-[#5C5549] space-y-2.5 leading-relaxed font-light">
                    <p><strong className="font-semibold text-[#24211E]">Dispatch:</strong> {product.shippingPolicy}</p>
                    <p><strong className="font-semibold text-[#24211E]">Returns:</strong> {product.returnPolicy}</p>
                    {onNavigateToPolicy && (
                      <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-[#0F4C5C]">
                        <button
                          type="button"
                          onClick={() => onNavigateToPolicy('shipping-policy')}
                          className="hover:underline hover:text-[#C08081] transition-colors cursor-pointer"
                        >
                          View Full Shipping Policy →
                        </button>
                        <button
                          type="button"
                          onClick={() => onNavigateToPolicy('returns-policy')}
                          className="hover:underline hover:text-[#C08081] transition-colors cursor-pointer"
                        >
                          View Full Returns Policy →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Creations */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#E8DFD5]">
            <div className="text-center mb-10">
              <span className="text-xs uppercase tracking-widest text-[#8C6D37] font-medium">Complete The Ensemble</span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F4C5C] mt-1">
                You May Also Admire
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.slice(0, 3).map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectRelated(rel)}
                  className="group bg-white border border-[#E8DFD5] p-4 cursor-pointer hover:border-[#0F4C5C] transition-all"
                >
                  <img src={rel.images[0]} alt={rel.title} className="aspect-[3/4] w-full object-cover mb-3" />
                  <p className="text-[10px] uppercase tracking-wider text-[#8C6D37]">{rel.category}</p>
                  <h4 className="font-serif text-sm font-bold text-[#24211E] group-hover:text-[#0F4C5C] truncate">{rel.title}</h4>
                  <p className="text-xs font-semibold text-[#0F4C5C] mt-1">₹{(rel.salePrice || rel.price).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 border border-[#D4C7B5] shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsSizeGuideOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-lg"
            >
              ✕
            </button>
            <h3 className="font-serif text-2xl font-bold text-[#0F4C5C] mb-2">AARU Size Guide</h3>
            <p className="text-xs text-[#736B5E] mb-6 font-light">
              All our standard silhouettes adhere to the following measurements in inches. For custom tailoring, visit our Customised Clothing studio.
            </p>

            <table className="w-full text-xs text-left border border-[#E8DFD5]">
              <thead className="bg-[#FAF7F2] font-semibold text-[#24211E]">
                <tr>
                  <th className="p-2.5 border-b">Size</th>
                  <th className="p-2.5 border-b">Bust (in)</th>
                  <th className="p-2.5 border-b">Waist (in)</th>
                  <th className="p-2.5 border-b">Hip (in)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFD5] text-[#5C5549]">
                <tr><td className="p-2.5 font-bold">XS</td><td className="p-2.5">32 - 34</td><td className="p-2.5">26 - 28</td><td className="p-2.5">36 - 38</td></tr>
                <tr><td className="p-2.5 font-bold">S</td><td className="p-2.5">34 - 36</td><td className="p-2.5">28 - 30</td><td className="p-2.5">38 - 40</td></tr>
                <tr><td className="p-2.5 font-bold">M</td><td className="p-2.5">36 - 38</td><td className="p-2.5">30 - 32</td><td className="p-2.5">40 - 42</td></tr>
                <tr><td className="p-2.5 font-bold">L</td><td className="p-2.5">38 - 40</td><td className="p-2.5">32 - 34</td><td className="p-2.5">42 - 44</td></tr>
                <tr><td className="p-2.5 font-bold">XL</td><td className="p-2.5">40 - 42</td><td className="p-2.5">34 - 36</td><td className="p-2.5">44 - 46</td></tr>
                <tr><td className="p-2.5 font-bold">XXL</td><td className="p-2.5">42 - 44</td><td className="p-2.5">36 - 38</td><td className="p-2.5">46 - 48</td></tr>
              </tbody>
            </table>

            <div className="mt-6 pt-4 border-t border-[#E8DFD5] text-[11px] text-[#736B5E] space-y-1.5">
              <p><strong>Sarees:</strong> Available in <strong>Free Size</strong>. Standard length is 5.5 meters with an unstitched 0.9–1.0 meter contrast or running blouse piece.</p>
              <p><strong>Dresses & Garments:</strong> Available in standard sizes <strong>XS, S, M, L, XL, XXL</strong> with room for tailor adjustments.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
