import React, { useState, useEffect } from 'react';
import { Product, ProductVariant } from '../../types';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Save, 
  X, 
  Globe, 
  Tag, 
  Layers, 
  Image as ImageIcon, 
  PackageCheck, 
  CheckCircle, 
  ExternalLink 
} from 'lucide-react';

interface ProductEditorProps {
  productToEdit?: Product | null;
  onSaveProduct: (productData: Partial<Product>) => Promise<void>;
  onCancel: () => void;
  categories: string[];
  collections: string[];
}

export const ProductEditor: React.FC<ProductEditorProps> = ({
  productToEdit,
  onSaveProduct,
  onCancel,
  categories,
  collections
}) => {
  // 1. Basic Info State
  const [title, setTitle] = useState(productToEdit?.title || '');
  const [subtitle, setSubtitle] = useState(productToEdit?.subtitle || '');
  const [category, setCategory] = useState(productToEdit?.category || categories[0] || 'Sarees');
  const [collection, setCollection] = useState(productToEdit?.collection || collections[0] || 'The Sixth Element');
  const [price, setPrice] = useState<number>(productToEdit?.price || 28500);
  const [salePrice, setSalePrice] = useState<string>(productToEdit?.salePrice ? String(productToEdit.salePrice) : '');
  const [isOnSale, setIsOnSale] = useState(productToEdit?.isOnSale || false);

  // 2. Media Uploads & Descriptions
  const [images, setImages] = useState<string[]>(
    productToEdit?.images && productToEdit.images.length > 0 
      ? productToEdit.images 
      : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85']
  );
  const [newImageUrl, setNewImageUrl] = useState('');
  const [description, setDescription] = useState(productToEdit?.description || '');
  const [fabric, setFabric] = useState(productToEdit?.fabric || 'Pure Mulberry Silk');
  const [craft, setCraft] = useState(productToEdit?.craft || 'Kadwa Handloom Brocade');

  // 3. Variants & Attributes
  const [variants, setVariants] = useState<ProductVariant[]>(
    productToEdit?.variants && productToEdit.variants.length > 0
      ? productToEdit.variants
      : [
          { id: 'v-1', size: 'Free Size', color: 'Royal Peacock Emerald', colorCode: '#0F4C5C', inventory: 8, sku: 'AARU-SAR-001', isAvailable: true }
        ]
  );

  // 4. Inventory & Dispatch Status
  const [isReadyToShip, setIsReadyToShip] = useState(productToEdit?.isReadyToShip ?? true);
  const [careInstructions, setCareInstructions] = useState(
    productToEdit?.careInstructions || 'Specialist dry clean only. Store wrapped in unbleached pure cotton muslin.'
  );
  const [shippingPolicy, setShippingPolicy] = useState(
    productToEdit?.shippingPolicy || 'Ready to Ship: Dispatched within 24-48 hours via Blue Dart Luxury Express.'
  );
  const [returnPolicy, setReturnPolicy] = useState(
    productToEdit?.returnPolicy || '7-day standard atelier returns on unworn items with security tags intact.'
  );

  // 5. SEO Engine
  const [slug, setSlug] = useState(productToEdit?.slug || '');
  const [metaTitle, setMetaTitle] = useState(productToEdit?.seo.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(productToEdit?.seo.metaDescription || '');
  const [keywords, setKeywords] = useState<string>(productToEdit?.seo.keywords.join(', ') || 'Saree, Handloom, AARU, Luxury Silk');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Auto-generate slug and meta title if blank
  useEffect(() => {
    if (!productToEdit && title) {
      const generatedSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setSlug(generatedSlug);
      setMetaTitle(`${title} | AARU Luxury Handlooms`);
      if (!metaDescription) {
        setMetaDescription(`Handcrafted ${title} in ${fabric}. Woven with timeless precision for the woman of the Sixth Element.`);
      }
    }
  }, [title, fabric, productToEdit]);

  // Calculations
  const parsedSalePrice = salePrice ? parseFloat(salePrice) : undefined;
  const discountPercent = parsedSalePrice && price > parsedSalePrice
    ? Math.round(((price - parsedSalePrice) / price) * 100)
    : 0;
  const totalInventory = variants.reduce((sum, v) => sum + (v.inventory || 0), 0);

  // Handlers for variants
  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: `v-${Date.now()}`,
      size: 'Free Size',
      color: 'Emerald & Gold',
      colorCode: '#0F4C5C',
      inventory: 5,
      sku: `AARU-${Math.floor(1000 + Math.random() * 9000)}`,
      isAvailable: true
    };
    setVariants([...variants, newVariant]);
  };

  const updateVariant = (index: number, field: keyof ProductVariant, val: any) => {
    const updated = [...variants];
    (updated[index] as any)[field] = val;
    setVariants(updated);
  };

  const removeVariant = (index: number) => {
    if (variants.length <= 1) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  // Image handlers
  const addImage = () => {
    if (!newImageUrl) return;
    setImages([...images, newImageUrl]);
    setNewImageUrl('');
  };

  const removeImage = (index: number) => {
    if (images.length <= 1) return;
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload: Partial<Product> = {
      title,
      subtitle,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      collection,
      price,
      salePrice: parsedSalePrice,
      isOnSale: Boolean(isOnSale && parsedSalePrice && parsedSalePrice < price),
      isReadyToShip,
      description,
      fabric,
      craft,
      careInstructions,
      shippingPolicy,
      returnPolicy,
      images,
      variants,
      totalInventory,
      seo: {
        metaTitle: metaTitle || `${title} | AARU`,
        metaDescription: metaDescription || description.slice(0, 150),
        keywords: keywords.split(',').map(k => k.trim())
      }
    };

    try {
      await onSaveProduct(payload);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onCancel();
      }, 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-[#D4C7B5] shadow-xl p-6 sm:p-8 space-y-10">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8DFD5] pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C6D37]">
            Atelier Product Operations
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F4C5C]">
            {productToEdit ? `Edit Weave: ${productToEdit.title}` : 'Create New Luxury Creation'}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-[#D4C7B5] text-xs font-semibold uppercase tracking-wider text-[#5C5549] hover:bg-[#FAF7F2]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer"
          >
            {saveSuccess ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-300" />
                Saved to Catalog!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {productToEdit ? 'Save Changes' : 'Publish Product'}
              </>
            )}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* ================================================================= */}
        {/* SECTION 1: BASIC INFORMATION */}
        {/* ================================================================= */}
        <div className="space-y-5">
          <h3 className="font-serif text-lg font-bold text-[#24211E] flex items-center gap-2 border-b border-[#E8DFD5] pb-2">
            <span className="w-5 h-5 rounded-full bg-[#0F4C5C] text-white text-xs flex items-center justify-center font-sans">1</span>
            Basic Information & Pricing
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C5549] mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Kavya Emerald Banarasi Tissue Saree"
                className="w-full p-2.5 bg-[#FAF7F2] border border-[#D4C7B5] text-xs font-medium focus:outline-none focus:border-[#0F4C5C]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C5549] mb-1">Subtitle / Lineage</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Woven with real silver zari in floral jaal"
                className="w-full p-2.5 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none focus:border-[#0F4C5C]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C5549] mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none focus:border-[#0F4C5C]"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C5549] mb-1">Curated Collection *</label>
              <select
                value={collection}
                onChange={(e) => setCollection(e.target.value)}
                className="w-full p-2.5 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none focus:border-[#0F4C5C]"
              >
                {collections.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="p-4 bg-[#FAF7F2] border border-[#E8DFD5] grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C5549] mb-1">Base Boutique Price (₹) *</label>
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full p-2 bg-white border border-[#D4C7B5] text-xs font-semibold focus:outline-none focus:border-[#0F4C5C]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C5549] mb-1">Promotional Sale Price (₹)</label>
              <input
                type="number"
                min={0}
                placeholder="Optional sale price"
                value={salePrice}
                onChange={(e) => {
                  setSalePrice(e.target.value);
                  setIsOnSale(Boolean(e.target.value && Number(e.target.value) < price));
                }}
                className="w-full p-2 bg-white border border-[#D4C7B5] text-xs focus:outline-none focus:border-[#0F4C5C]"
              />
            </div>

            <div className="pt-3">
              <label className="flex items-center gap-2 text-xs font-semibold text-[#24211E] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isOnSale}
                  onChange={(e) => setIsOnSale(e.target.checked)}
                  className="accent-[#C08081] w-4 h-4"
                />
                <span>Active on Sale Banner</span>
              </label>
              {discountPercent > 0 && (
                <p className="text-[11px] text-[#C08081] font-bold mt-1">
                  Customer Saves {discountPercent}% off base price
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* SECTION 2: MEDIA UPLOADS & DESCRIPTIONS */}
        {/* ================================================================= */}
        <div className="space-y-5">
          <h3 className="font-serif text-lg font-bold text-[#24211E] flex items-center gap-2 border-b border-[#E8DFD5] pb-2">
            <span className="w-5 h-5 rounded-full bg-[#0F4C5C] text-white text-xs flex items-center justify-center font-sans">2</span>
            Media Gallery & Textile Descriptions
          </h3>

          {/* Image URLs & Previews */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C5549] mb-2">High-Resolution Textile Images</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-[3/4] border border-[#D4C7B5] bg-[#F5EFE6] group overflow-hidden">
                  <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-black/60 text-white hover:bg-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="url"
                placeholder="Add image URL (https://images.unsplash.com/...)"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1 p-2 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none focus:border-[#0F4C5C]"
              />
              <button
                type="button"
                onClick={addImage}
                className="px-4 py-2 bg-[#24211E] text-white text-xs font-semibold uppercase tracking-wider"
              >
                Add Image
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C5549] mb-1">Artisanal Story & Product Description *</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the handloom origin, weaver cadence, and mood of the piece..."
              className="w-full p-2.5 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none focus:border-[#0F4C5C]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C5549] mb-1">Fabric & Warp/Weft Purity *</label>
              <input
                type="text"
                required
                value={fabric}
                onChange={(e) => setFabric(e.target.value)}
                placeholder="e.g. 100% Pure Mulberry Silk & Antique Metallic Tissue"
                className="w-full p-2 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none focus:border-[#0F4C5C]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C5549] mb-1">Craftsmanship Technique *</label>
              <input
                type="text"
                required
                value={craft}
                onChange={(e) => setCraft(e.target.value)}
                placeholder="e.g. Varanasi Kadwa Handloom Weave with Meenakari Borders"
                className="w-full p-2 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none focus:border-[#0F4C5C]"
              />
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* SECTION 3: VARIANTS & ATTRIBUTES */}
        {/* ================================================================= */}
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-[#E8DFD5] pb-2">
            <h3 className="font-serif text-lg font-bold text-[#24211E] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#0F4C5C] text-white text-xs flex items-center justify-center font-sans">3</span>
              Variants, SKUs & Inventory ({totalInventory} Units Total)
            </h3>
            <button
              type="button"
              onClick={addVariant}
              className="px-3 py-1 bg-[#FAF7F2] border border-[#0F4C5C] text-[#0F4C5C] hover:bg-[#0F4C5C] hover:text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Variant
            </button>
          </div>

          <div className="space-y-3">
            {variants.map((variant, idx) => (
              <div key={variant.id || idx} className="p-4 bg-[#FAF7F2] border border-[#E8DFD5] grid grid-cols-1 sm:grid-cols-6 gap-3 items-center">
                <div>
                  <label className="block text-[10px] font-bold text-[#8C6D37] mb-0.5">Size / Cut</label>
                  <input
                    type="text"
                    value={variant.size}
                    onChange={(e) => updateVariant(idx, 'size', e.target.value)}
                    className="w-full p-1.5 bg-white border border-[#D4C7B5] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#8C6D37] mb-0.5">Color Shade</label>
                  <input
                    type="text"
                    value={variant.color}
                    onChange={(e) => updateVariant(idx, 'color', e.target.value)}
                    className="w-full p-1.5 bg-white border border-[#D4C7B5] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#8C6D37] mb-0.5">Color Hex</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="color"
                      value={variant.colorCode || '#0F4C5C'}
                      onChange={(e) => updateVariant(idx, 'colorCode', e.target.value)}
                      className="w-6 h-6 p-0 border border-[#D4C7B5] rounded-none cursor-pointer"
                    />
                    <input
                      type="text"
                      value={variant.colorCode}
                      onChange={(e) => updateVariant(idx, 'colorCode', e.target.value)}
                      className="w-full p-1.5 bg-white border border-[#D4C7B5] text-xs font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#8C6D37] mb-0.5">SKU Barcode</label>
                  <input
                    type="text"
                    value={variant.sku}
                    onChange={(e) => updateVariant(idx, 'sku', e.target.value)}
                    className="w-full p-1.5 bg-white border border-[#D4C7B5] text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#8C6D37] mb-0.5">Inventory</label>
                  <input
                    type="number"
                    min={0}
                    value={variant.inventory}
                    onChange={(e) => updateVariant(idx, 'inventory', Number(e.target.value))}
                    className="w-full p-1.5 bg-white border border-[#D4C7B5] text-xs font-semibold"
                  />
                </div>
                <div className="flex items-center justify-end pt-3">
                  <button
                    type="button"
                    onClick={() => removeVariant(idx)}
                    className="text-gray-400 hover:text-rose-600 p-1"
                    title="Remove variant"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================================================================= */}
        {/* SECTION 4: INVENTORY & DISPATCH STATUS */}
        {/* ================================================================= */}
        <div className="space-y-5">
          <h3 className="font-serif text-lg font-bold text-[#24211E] flex items-center gap-2 border-b border-[#E8DFD5] pb-2">
            <span className="w-5 h-5 rounded-full bg-[#0F4C5C] text-white text-xs flex items-center justify-center font-sans">4</span>
            Inventory & Dispatch Status
          </h3>

          <div className="p-4 bg-emerald-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-[#2D5A46]">Ready to Ship Status</p>
              <p className="text-[11px] text-[#5C5549]">
                Enable if this piece is already inspected, rolled, and pre-finished in our atelier for 24-hour dispatch.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isReadyToShip}
                onChange={(e) => setIsReadyToShip(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D5A46]" />
              <span className="ml-3 text-xs font-bold text-[#24211E]">
                {isReadyToShip ? 'Ready to Ship (24h SLA)' : 'Made to Order (2-3 Weeks)'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C5549] mb-1">Care & Preservation Policy</label>
              <input
                type="text"
                value={careInstructions}
                onChange={(e) => setCareInstructions(e.target.value)}
                className="w-full p-2 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C5549] mb-1">Return & Alteration Policy</label>
              <input
                type="text"
                value={returnPolicy}
                onChange={(e) => setReturnPolicy(e.target.value)}
                className="w-full p-2 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* SECTION 5: SEO ENGINE */}
        {/* ================================================================= */}
        <div className="space-y-5">
          <h3 className="font-serif text-lg font-bold text-[#24211E] flex items-center gap-2 border-b border-[#E8DFD5] pb-2">
            <span className="w-5 h-5 rounded-full bg-[#0F4C5C] text-white text-xs flex items-center justify-center font-sans">5</span>
            SEO Engine & Metadata
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C5549] mb-1">URL Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="kavya-emerald-banarasi-tissue-saree"
                className="w-full p-2 bg-[#FAF7F2] border border-[#D4C7B5] font-mono text-xs focus:outline-none focus:border-[#0F4C5C]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C5549] mb-1">Search Keywords (comma-separated)</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Banarasi Saree, Pure Silk, AARU"
                className="w-full p-2 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C5549] mb-1">Meta Title</label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="w-full p-2 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none focus:border-[#0F4C5C]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C5549] mb-1">Meta Description</label>
            <textarea
              rows={2}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className="w-full p-2 bg-[#FAF7F2] border border-[#D4C7B5] text-xs focus:outline-none focus:border-[#0F4C5C]"
            />
          </div>

          {/* Live Google SERP Simulation Preview */}
          <div className="p-4 bg-white border border-[#E8DFD5] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D37] block mb-1">Live Google Search Preview</span>
            <p className="text-xs text-blue-800 hover:underline font-medium cursor-pointer">
              {metaTitle || `${title} | AARU Luxury Fashion`}
            </p>
            <p className="text-[11px] text-emerald-800 font-mono">
              https://aaru.luxury/products/{slug || 'product-slug'}
            </p>
            <p className="text-xs text-[#5C5549] line-clamp-2">
              {metaDescription || description}
            </p>
          </div>
        </div>

        {/* ================================================================= */}
        {/* SECTION 6: FORM SUBMISSION */}
        {/* ================================================================= */}
        <div className="pt-6 border-t border-[#E8DFD5] flex items-center justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-[#D4C7B5] text-xs font-semibold uppercase tracking-wider text-[#5C5549] hover:bg-[#FAF7F2]"
          >
            Discard Changes
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3.5 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-[0.16em] flex items-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            {isSubmitting ? (
              'Synchronizing with Database...'
            ) : (
              <>
                <Save className="w-4 h-4" />
                {productToEdit ? 'Save and Publish Weave' : 'Create & List in Storefront'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
