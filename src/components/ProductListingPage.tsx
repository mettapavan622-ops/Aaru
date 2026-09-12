import React, { useState, useMemo, useEffect } from 'react';
import { Product, Category, Collection } from '../types';
import { ProductCard } from './ProductCard';
import { SlidersHorizontal, Sparkles, X, ChevronDown } from 'lucide-react';

interface ProductListingPageProps {
  products: Product[];
  categories?: Category[];
  collections?: Collection[];
  wishlistIds?: string[];
  wishlistProductIds?: string[];
  onSelectProduct: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onQuickAddToCart?: (product: Product) => void;
  initialCategory?: string;
  initialFilter?: 'all' | 'ready-to-ship' | 'sale' | 'designer-wear';
}

export const ProductListingPage: React.FC<ProductListingPageProps> = ({
  products = [],
  categories: externalCategories,
  collections: externalCollections,
  wishlistIds,
  wishlistProductIds,
  onSelectProduct,
  onToggleWishlist,
  onQuickAddToCart,
  initialCategory,
  initialFilter = 'all'
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [readyToShipOnly, setReadyToShipOnly] = useState<boolean>(initialFilter === 'ready-to-ship');
  const [onSaleOnly, setOnSaleOnly] = useState<boolean>(initialFilter === 'sale');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    if (initialFilter === 'ready-to-ship') {
      setReadyToShipOnly(true);
      setOnSaleOnly(false);
    } else if (initialFilter === 'sale') {
      setOnSaleOnly(true);
      setReadyToShipOnly(false);
    } else {
      setReadyToShipOnly(false);
      setOnSaleOnly(false);
    }
  }, [initialFilter]);

  const activeWishlist = useMemo(() => {
    return wishlistIds || wishlistProductIds || [];
  }, [wishlistIds, wishlistProductIds]);

  const categories = useMemo(() => {
    if (externalCategories && externalCategories.length > 0) {
      return ['all', ...externalCategories.map(c => c.name)];
    }
    const set = new Set<string>();
    products.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return ['all', ...Array.from(set)];
  }, [products, externalCategories]);

  const collections = useMemo(() => {
    if (externalCollections && externalCollections.length > 0) {
      return ['all', ...externalCollections.map(c => c.title)];
    }
    const set = new Set<string>();
    products.forEach(p => {
      if (p.collection) set.add(p.collection);
    });
    return ['all', ...Array.from(set)];
  }, [products, externalCollections]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory !== 'all') {
      list = list.filter(p => (p.category || '').toLowerCase() === selectedCategory.toLowerCase());
    }

    if (selectedCollection !== 'all') {
      list = list.filter(p => (p.collection || '').toLowerCase() === selectedCollection.toLowerCase());
    }

    if (readyToShipOnly) {
      list = list.filter(p => p.isReadyToShip);
    }

    if (onSaleOnly) {
      list = list.filter(p => p.isOnSale);
    }

    if (initialFilter === 'designer-wear') {
      list = list.filter(p => 
        (p.category && p.category.toLowerCase().includes('designer')) || 
        (Array.isArray(p.tags) && p.tags.some(t => typeof t === 'string' && (t.toLowerCase().includes('hand embroidered') || t.toLowerCase().includes('designer'))))
      );
    }

    // Sort
    if (sortBy === 'price-asc') {
      list.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    } else if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    return list;
  }, [products, selectedCategory, selectedCollection, readyToShipOnly, onSaleOnly, initialFilter, sortBy]);

  const activeFilterCount = 
    (selectedCategory !== 'all' ? 1 : 0) + 
    (selectedCollection !== 'all' ? 1 : 0) + 
    (readyToShipOnly ? 1 : 0) + 
    (onSaleOnly ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedCollection('all');
    setReadyToShipOnly(false);
    setOnSaleOnly(false);
  };

  return (
    <div className="py-10 bg-[#FAF9F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs & Header */}
        <div className="mb-8">
          <div className="text-xs uppercase tracking-widest text-[#8C6D37] mb-2 font-medium">
            Atelier Catalog • {filteredProducts.length} Curated Weaves
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F4C5C]">
            {selectedCategory !== 'all' 
              ? selectedCategory 
              : readyToShipOnly 
                ? 'Ready to Ship Drapes' 
                : onSaleOnly 
                  ? 'Mid-Season Atelier Sale' 
                  : 'All Atelier Creations'}
          </h1>
          <p className="text-xs sm:text-sm text-[#736B5E] mt-1 font-light max-w-2xl">
            Each drape is hand-woven on heritage pit and jacquard looms, inspected by our senior master weavers, and presented in signature packaging.
          </p>
        </div>

        {/* Filter & Sort Bar */}
        <div className="bg-white border border-[#E8DFD5] p-4 mb-8 flex flex-wrap items-center justify-between gap-4 shadow-xs">
          {/* Quick Filter Buttons (Desktop) */}
          <div className="hidden md:flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#8C6D37] mr-2">Filter:</span>
            
            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 bg-[#FAF7F2] border border-[#D4C7B5] text-xs text-[#24211E] focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.filter(c => c !== 'all').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Collection Select */}
            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="px-3 py-1.5 bg-[#FAF7F2] border border-[#D4C7B5] text-xs text-[#24211E] focus:outline-none"
            >
              <option value="all">All Collections</option>
              {collections.filter(col => col !== 'all').map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>

            {/* Ready to Ship Toggle */}
            <button
              type="button"
              onClick={() => setReadyToShipOnly(!readyToShipOnly)}
              className={`px-3 py-1.5 text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                readyToShipOnly
                  ? 'bg-[#2D5A46] text-white border-[#2D5A46]'
                  : 'bg-[#FAF7F2] text-[#24211E] border-[#D4C7B5] hover:border-[#2D5A46]'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              Ready to Ship
            </button>

            {/* Sale Toggle */}
            <button
              type="button"
              onClick={() => setOnSaleOnly(!onSaleOnly)}
              className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                onSaleOnly
                  ? 'bg-[#C08081] text-white border-[#C08081]'
                  : 'bg-[#FAF7F2] text-[#24211E] border-[#D4C7B5] hover:border-[#C08081]'
              }`}
            >
              Special Sale
            </button>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs text-[#C08081] underline underline-offset-4 ml-2 hover:text-[#A66263]"
              >
                Clear Filters ({activeFilterCount})
              </button>
            )}
          </div>

          {/* Mobile Filter Trigger Button */}
          <button
            type="button"
            onClick={() => setIsFilterDrawerOpen(true)}
            className="md:hidden px-3.5 py-2 bg-[#0F4C5C] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
          </button>

          {/* Sort Menu */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#736B5E] hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 bg-[#FAF7F2] border border-[#D4C7B5] text-xs text-[#24211E] focus:outline-none"
            >
              <option value="featured">Featured Atelier Edit</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                isWishlisted={activeWishlist.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#E8DFD5] p-12 text-center max-w-lg mx-auto my-12 space-y-4">
            <p className="font-serif text-2xl font-bold text-[#0F4C5C]">No Matching Weaves Found</p>
            <p className="text-xs text-[#736B5E]">
              We could not find any products matching your active filters. Try adjusting your category or availability criteria.
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="px-6 py-2.5 bg-[#0F4C5C] text-white text-xs font-semibold uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Mobile Filters Drawer */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-4/5 max-w-xs bg-white h-full p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8DFD5]">
                <h3 className="font-serif text-lg font-bold text-[#0F4C5C]">Filter Products</h3>
                <button
                  type="button"
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="p-1 text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C6D37] mb-2">Category</h4>
                <div className="space-y-1.5">
                  {categories.map((c) => (
                    <label key={c} className="flex items-center gap-2 text-xs text-[#24211E] cursor-pointer">
                      <input
                        type="radio"
                        name="mobileCategory"
                        checked={selectedCategory === c}
                        onChange={() => setSelectedCategory(c)}
                        className="accent-[#0F4C5C]"
                      />
                      <span className="capitalize">{c === 'all' ? 'All Categories' : c}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="pt-4 border-t border-[#E8DFD5]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C6D37] mb-2">Availability</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs text-[#24211E] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={readyToShipOnly}
                      onChange={(e) => setReadyToShipOnly(e.target.checked)}
                      className="accent-[#2D5A46]"
                    />
                    <span>Ready to Ship Drapes Only</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-[#24211E] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onSaleOnly}
                      onChange={(e) => setOnSaleOnly(e.target.checked)}
                      className="accent-[#C08081]"
                    />
                    <span>Special Sale Items Only</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E8DFD5] space-y-2">
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(false)}
                className="w-full py-3 bg-[#0F4C5C] text-white text-xs font-semibold uppercase tracking-wider"
              >
                Apply Filters ({filteredProducts.length})
              </button>
              <button
                type="button"
                onClick={clearAllFilters}
                className="w-full py-2 text-xs text-[#C08081] underline"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
