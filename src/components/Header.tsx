import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User as UserIcon, 
  Menu, 
  X, 
  MessageCircle, 
  ChevronDown, 
  SlidersHorizontal,
  Package, 
  LogOut, 
  ArrowRight, 
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Phone,
  Mail,
  LogIn,
  UserPlus
} from 'lucide-react';
import { Product, AnnouncementSettings, User, Category } from '../types';
import { CategoriesMegaMenu } from './CategoriesMegaMenu';
import { CATEGORIES } from '../data/mockData';
import { AaruLogo, AaruEmblem } from './AaruLogo';

interface HeaderProps {
  announcement: AnnouncementSettings;
  cartCount: number;
  wishlistCount: number;
  currentUser: User | null;
  activeTab?: string;
  activeView?: string;
  setActiveTab?: (tab: string) => void;
  onNavigate?: (tab: any) => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onSignOut?: () => void;
  onOpenOrders: () => void;
  onSearchSelect?: (product: Product) => void;
  products?: Product[];
  categories?: Category[];
  onSelectCategory?: (categoryName: string) => void;
  currentMode?: 'user' | 'admin';
  currentRole?: 'user' | 'admin';
  onToggleMode?: (mode: 'user' | 'admin') => void;
  onRoleSwitch?: (mode: 'user' | 'admin') => void;
}

export const Header: React.FC<HeaderProps> = ({
  announcement,
  cartCount,
  wishlistCount,
  currentUser,
  activeTab: propActiveTab,
  activeView,
  setActiveTab: propSetActiveTab,
  onNavigate,
  onOpenCart,
  onOpenWishlist,
  onOpenAuth,
  onSignOut = () => {},
  onOpenOrders,
  onSearchSelect,
  products = [],
  categories = CATEGORIES,
  onSelectCategory,
  currentMode: propCurrentMode,
  currentRole,
  onToggleMode: propOnToggleMode,
  onRoleSwitch
}) => {
  const currentMode = propCurrentMode || currentRole || 'user';
  const onToggleMode = propOnToggleMode || onRoleSwitch || (() => {});
  const activeTab = propActiveTab || activeView || 'home';
  const setActiveTab = (tab: string) => {
    if (propSetActiveTab) propSetActiveTab(tab);
    if (onNavigate) onNavigate(tab);
  };

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [isCategoriesMenuOpen, setIsCategoriesMenuOpen] = useState(false);
  const [isCategoriesPinned, setIsCategoriesPinned] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const categoriesMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close account menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when overlay opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Search filtered results (safely guarded against undefined fields)
  const searchResults = searchQuery.trim() === '' ? [] : (products || []).filter(p => {
    if (!p) return false;
    const q = searchQuery.toLowerCase();
    return Boolean(
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.collection && p.collection.toLowerCase().includes(q)) ||
      (p.fabric && p.fabric.toLowerCase().includes(q))
    );
  }).slice(0, 5);

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'Just In', id: 'just-in' },
    { label: 'Designer Wear', id: 'designer-wear' },
    { label: 'Collections', id: 'collections' },
    { label: 'Categories', id: 'categories' },
    { label: 'Ready to Ship', id: 'ready-to-ship' },
    { label: 'Sarees – Ready to Ship', id: 'sarees-rts' },
    { label: 'Sale', id: 'sale', isSale: true },
    { label: 'Shop the Look', id: 'shop-the-look' },
    { label: 'Customised Clothing', id: 'custom-clothing' }
  ];

  const whatsappUrl = "https://wa.me/919876543210?text=Hello%20AARU%20Atelier,%20I%20am%20exploring%20your%20collection%20online%20and%20need%20styling%20assistance.";

  return (
    <header className="sticky top-0 z-30 w-full bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFD5] transition-all">
      {/* Top Presentation Bar & Role Switcher */}
      <div className="bg-[#24211E] text-[#FAF7F2] text-xs px-4 py-1.5 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[#D4C7B5] hidden sm:inline">AARU Luxury Ecosystem:</span>
          <span className="font-medium text-[#FAF7F2]">
            {currentMode === 'user' ? 'Customer Digital Storefront' : 'Atelier CMS & Admin Engine'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#A89882] text-[11px] hidden md:inline">Mode:</span>
          <div className="inline-flex p-0.5 bg-[#38332E] rounded-sm border border-[#4D463F]">
            <button
              id="switch-to-user-btn"
              type="button"
              onClick={() => onToggleMode('user')}
              className={`px-2.5 py-0.5 text-[11px] font-medium rounded-xs transition-colors ${
                currentMode === 'user' ? 'bg-[#0F4C5C] text-white' : 'text-[#D4C7B5] hover:text-white'
              }`}
            >
              User Storefront
            </button>
            <button
              id="switch-to-admin-btn"
              type="button"
              onClick={() => onToggleMode('admin')}
              className={`px-2.5 py-0.5 text-[11px] font-medium rounded-xs transition-colors flex items-center gap-1 ${
                currentMode === 'admin' ? 'bg-[#9C7C38] text-white font-semibold' : 'text-[#D4C7B5] hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-3 h-3" />
              Admin Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Announcement Bar */}
      {announcement.isActive && (
        <div className="bg-[#0F4C5C] text-[#FAF7F2] text-[11px] md:text-xs tracking-wider py-2 px-4 text-center border-b border-[#0F4C5C]/40">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            {announcement.isSaleActive && (
              <span className="bg-[#C08081] text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-none">
                Exclusive
              </span>
            )}
            <p className="truncate font-light text-[#FAF7F2]">
              {announcement.text}
            </p>
            {announcement.linkText && (
              <button 
                type="button" 
                onClick={() => setActiveTab('sale')}
                className="underline underline-offset-4 hover:text-[#D4C7B5] font-medium transition-colors ml-1 cursor-pointer"
              >
                {announcement.linkText}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tier 1: Utility Bar (Logo, Search, Account, Wishlist, Cart, WhatsApp) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-4 relative">
        {/* Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 min-w-0">
          <button
            id="mobile-menu-toggle"
            type="button"
            aria-label="Toggle Navigation Menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 sm:p-2 text-[#24211E] lg:hidden hover:text-[#0F4C5C] -ml-1 rounded-sm active:bg-[#E8DFD5]/40 transition-colors shrink-0"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>

          <div 
            id="aaru-logo"
            onClick={() => setActiveTab('home')}
            className="cursor-pointer group flex items-center select-none shrink-0"
          >
            <AaruLogo size="responsive" />
          </div>
        </div>

        {/* Desktop Search Field */}
        <div className="hidden md:flex flex-1 max-w-md mx-6 relative">
          <div className="relative w-full">
            <input
              id="desktop-search-input"
              type="text"
              placeholder="Search handcrafted sarees, organza, bridal lehengas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full pl-9 pr-4 py-2 bg-white/70 border border-[#D4C7B5] focus:border-[#0F4C5C] rounded-none text-xs text-[#24211E] placeholder:text-[#8A8175] focus:outline-none transition-all"
            />
            <Search className="w-4 h-4 text-[#8A8175] absolute left-3 top-2.5" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>

          {/* Desktop Search Autocomplete Dropdown */}
          {isSearchOpen && searchQuery.trim() !== '' && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#D4C7B5] shadow-xl z-50 p-2 divide-y divide-[#E8DFD5]">
              {searchResults.length > 0 ? (
                <div>
                  <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#8C6D37]">
                    Matching Atelier Creations ({searchResults.length})
                  </div>
                  {searchResults.map(prod => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        onSearchSelect(prod);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="p-2 hover:bg-[#FAF7F2] cursor-pointer flex items-center gap-3 transition-colors"
                    >
                      <img 
                        src={prod.images[0]} 
                        alt={prod.title} 
                        className="w-10 h-12 object-cover rounded-none bg-[#F5EFE6]" 
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-serif font-semibold text-[#24211E] truncate">{prod.title}</p>
                        <p className="text-[11px] text-[#736B5E]">{prod.category} • ₹{prod.price.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-xs text-[#736B5E]">No matching weaves found for "{searchQuery}".</p>
                  <p className="text-[11px] text-[#8C6D37] mt-1">Try searching for "Banarasi", "Organza", "Saree", or "Silk".</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Actions: Mobile Search, WhatsApp (sm+), Wishlist, Cart, Account */}
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 shrink-0">
          {/* Mobile Search Icon */}
          <button
            id="mobile-search-btn"
            type="button"
            aria-label="Open search modal"
            onClick={() => setIsSearchOpen(true)}
            className="p-1.5 sm:p-2 text-[#24211E] hover:text-[#0F4C5C] md:hidden rounded-sm transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* WhatsApp Direct Chat Hyperlink (Visible on sm+ screens; on small mobile, floating button is always present) */}
          <a
            id="header-whatsapp-link"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Chat directly with AARU Atelier Stylist on WhatsApp"
            className="p-1.5 sm:p-2 text-[#0F4C5C] hover:text-[#0b3844] relative hidden sm:flex items-center gap-1 transition-colors rounded-sm"
          >
            <MessageCircle className="w-5 h-5 text-[#0F4C5C]" />
            <span className="hidden xl:inline text-xs font-medium text-[#0F4C5C]">WhatsApp Atelier</span>
          </a>

          {/* Wishlist Icon */}
          <button
            id="header-wishlist-btn"
            type="button"
            aria-label={`Wishlist (${wishlistCount} items)`}
            onClick={onOpenWishlist}
            className="p-1.5 sm:p-2 text-[#24211E] hover:text-[#0F4C5C] relative transition-colors rounded-sm"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 sm:top-0 sm:right-0 min-w-[17px] h-[17px] px-1 rounded-full bg-[#C08081] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Icon */}
          <button
            id="header-cart-btn"
            type="button"
            aria-label={`Shopping Cart (${cartCount} items)`}
            onClick={onOpenCart}
            className="p-1.5 sm:p-2 text-[#24211E] hover:text-[#0F4C5C] relative flex items-center gap-1.5 transition-colors rounded-sm"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 sm:top-0 sm:right-0 min-w-[17px] h-[17px] px-1 rounded-full bg-[#0F4C5C] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
            <span className="hidden lg:inline text-xs font-semibold text-[#24211E]">
              Cart
            </span>
          </button>

          {/* Account Dropdown */}
          <div className="relative" ref={accountMenuRef}>
            <button
              id="account-dropdown-btn"
              type="button"
              aria-label="Account options"
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              className="p-1.5 sm:p-2 text-[#24211E] hover:text-[#0F4C5C] flex items-center gap-1 transition-colors rounded-sm"
            >
              <UserIcon className="w-5 h-5" />
              <ChevronDown className="w-3.5 h-3.5 hidden sm:block text-[#8A8175]" />
            </button>

            {isAccountMenuOpen && (
              <div 
                id="account-dropdown-menu"
                className="absolute right-0 mt-2 w-72 bg-white border border-[#E8DFD5] shadow-2xl z-50 overflow-hidden divide-y divide-[#E8DFD5]"
              >
                {currentUser ? (
                  <>
                    {/* User Profile Details: Name, Mobile, Mail ID */}
                    <div className="p-4 bg-[#FAF7F2]">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#0F4C5C] text-white flex items-center justify-center font-serif text-base font-bold shadow-xs shrink-0">
                          {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-serif font-bold text-[#24211E] truncate">{currentUser.name}</p>
                          <span className="inline-block px-1.5 py-0.5 text-[9px] font-sans font-semibold tracking-wider uppercase bg-[#0F4C5C]/10 text-[#0F4C5C] mt-0.5">
                            {currentUser.role === 'admin' ? 'Atelier Administrator' : 'Privilege Client'}
                          </span>
                        </div>
                      </div>

                      {/* Contact Credentials: Phone and Mail */}
                      <div className="space-y-1.5 pt-2.5 border-t border-[#E8DFD5]/80 text-[11px]">
                        <div className="flex items-center gap-2 text-[#5C5549]">
                          <Phone className="w-3.5 h-3.5 text-[#8C6D37] shrink-0" />
                          <span className="text-[#8C6D37] font-medium">Mobile:</span>
                          <span className="font-mono text-[#24211E] font-medium truncate">
                            {currentUser.phone || '+91 98451 23098'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[#5C5549]">
                          <Mail className="w-3.5 h-3.5 text-[#8C6D37] shrink-0" />
                          <span className="text-[#8C6D37] font-medium">Email:</span>
                          <span className="text-[#24211E] font-medium truncate">
                            {currentUser.email}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Actions: Orders & Tracking only (Bespoke & Admin buttons removed) */}
                    <div className="py-1">
                      <button
                        id="account-orders-link"
                        type="button"
                        onClick={() => {
                          onOpenOrders();
                          setIsAccountMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#24211E] hover:bg-[#FAF7F2] flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          <Package className="w-4 h-4 text-[#0F4C5C]" />
                          <span>Your Orders & Tracking</span>
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#8A8175]" />
                      </button>
                    </div>

                    {/* Sign Out Action */}
                    <div className="py-1">
                      <button
                        id="account-signout-btn"
                        type="button"
                        onClick={() => {
                          onSignOut();
                          setIsAccountMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-[#C08081] hover:bg-rose-50 flex items-center gap-2.5 cursor-pointer transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Guest State: Clear SignIn & SignUp Options */}
                    <div className="p-4 bg-[#FAF7F2]">
                      <div className="flex items-center gap-2 mb-1">
                        <UserIcon className="w-4 h-4 text-[#0F4C5C]" />
                        <p className="text-xs font-serif font-bold text-[#24211E] tracking-wide">Welcome to AARU Atelier</p>
                      </div>
                      <p className="text-[11px] text-[#736B5E] leading-relaxed">
                        Sign in to track orders in real-time or create an account for bespoke consultations.
                      </p>
                    </div>

                    <div className="p-3 space-y-2">
                      {/* Option 1: Sign In */}
                      <button
                        id="header-signin-btn"
                        type="button"
                        onClick={() => {
                          onOpenAuth('login');
                          setIsAccountMenuOpen(false);
                        }}
                        className="w-full py-2.5 px-4 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Sign In</span>
                      </button>

                      {/* Option 2: Sign Up */}
                      <button
                        id="header-signup-btn"
                        type="button"
                        onClick={() => {
                          onOpenAuth('signup');
                          setIsAccountMenuOpen(false);
                        }}
                        className="w-full py-2.5 px-4 bg-white hover:bg-[#FAF7F2] border border-[#0F4C5C] text-[#0F4C5C] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Sign Up / Register</span>
                      </button>
                    </div>

                    <div className="px-4 py-2 bg-white text-[10px] text-[#8C6D37] flex items-center justify-center gap-1.5 border-t border-[#E8DFD5]/60">
                      <ShieldCheck className="w-3 h-3 text-[#8C6D37]" />
                      <span>Instant Mobile OTP & Google Access</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Overlay Bar when search icon is clicked */}
        {isSearchOpen && (
          <div className="md:hidden absolute inset-0 z-40 bg-[#FAF7F2] px-3 flex items-center gap-2 border-b border-[#D4C7B5]">
            <div className="relative flex-1">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search handcrafted sarees, organza, silks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-white border border-[#D4C7B5] focus:border-[#0F4C5C] text-xs text-[#24211E] placeholder:text-[#8A8175] focus:outline-none"
              />
              <Search className="w-4 h-4 text-[#8A8175] absolute left-3 top-2.5" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-xs text-[#8A8175] hover:text-[#24211E]"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery('');
              }}
              className="text-xs font-semibold text-[#0F4C5C] px-2 py-1.5 shrink-0 cursor-pointer"
            >
              Cancel
            </button>

            {/* Mobile Autocomplete Results Dropdown */}
            {searchQuery.trim() !== '' && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#D4C7B5] shadow-xl z-50 p-2 divide-y divide-[#E8DFD5] max-h-72 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div>
                    <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#8C6D37]">
                      Matching Creations ({searchResults.length})
                    </div>
                    {searchResults.map(prod => (
                      <div
                        key={prod.id}
                        onClick={() => {
                          if (onSearchSelect) onSearchSelect(prod);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="p-2 hover:bg-[#FAF7F2] cursor-pointer flex items-center gap-3 transition-colors"
                      >
                        <img 
                          src={prod.images[0]} 
                          alt={prod.title} 
                          className="w-10 h-12 object-cover bg-[#F5EFE6]" 
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-serif font-semibold text-[#24211E] truncate">{prod.title}</p>
                          <p className="text-[11px] text-[#736B5E]">{prod.category} • ₹{prod.price.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 text-center">
                    <p className="text-xs text-[#736B5E]">No matching weaves found for "{searchQuery}".</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tier 2: Category & Curated Navigation (Desktop) */}
      <nav className="hidden lg:block border-t border-[#E8DFD5]/60 bg-[#FAF7F2] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-center gap-6 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-[#4A4339]">
            <li>
              <button
                id="nav-link-home"
                type="button"
                onClick={() => setActiveTab('home')}
                className={`relative py-1 transition-all cursor-pointer ${
                  activeTab === 'home' ? 'text-[#0F4C5C] font-semibold' : 'hover:text-[#0F4C5C]'
                }`}
              >
                Home
                {activeTab === 'home' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F4C5C] -mb-1" />}
              </button>
            </li>

            {/* Categories Showcase with Hover & Click Trigger (Fixed/Pinned on click) */}
            <li 
              className="relative"
              onMouseEnter={() => {
                if (categoriesMenuTimeoutRef.current) clearTimeout(categoriesMenuTimeoutRef.current);
                setIsCategoriesMenuOpen(true);
              }}
              onMouseLeave={() => {
                if (!isCategoriesPinned) {
                  categoriesMenuTimeoutRef.current = setTimeout(() => {
                    setIsCategoriesMenuOpen(false);
                  }, 200);
                }
              }}
            >
              <button
                id="nav-link-categories"
                type="button"
                onClick={() => {
                  if (categoriesMenuTimeoutRef.current) clearTimeout(categoriesMenuTimeoutRef.current);
                  if (isCategoriesPinned) {
                    setIsCategoriesPinned(false);
                    setIsCategoriesMenuOpen(false);
                  } else {
                    setIsCategoriesPinned(true);
                    setIsCategoriesMenuOpen(true);
                  }
                }}
                className={`relative py-1 flex items-center gap-1 transition-all cursor-pointer ${
                  isCategoriesMenuOpen || activeTab === 'categories' ? 'text-[#0F4C5C] font-semibold' : 'hover:text-[#0F4C5C]'
                }`}
              >
                <span>Categories</span>
                {isCategoriesPinned && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C5C] inline-block" title="Pinned Open" />
                )}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCategoriesMenuOpen ? 'rotate-180 text-[#0F4C5C]' : ''}`} />
                {activeTab === 'categories' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F4C5C] -mb-1" />}
              </button>
            </li>

            <li>
              <button
                id="nav-link-shop-the-look"
                type="button"
                onClick={() => setActiveTab('shop-the-look')}
                className={`relative py-1 transition-all cursor-pointer ${
                  activeTab === 'shop-the-look' ? 'text-[#0F4C5C] font-semibold' : 'hover:text-[#0F4C5C]'
                }`}
              >
                Shop to Look
                {activeTab === 'shop-the-look' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F4C5C] -mb-1" />}
              </button>
            </li>

            <li>
              <button
                id="nav-link-sarees-rts"
                type="button"
                onClick={() => setActiveTab('sarees-rts')}
                className={`relative py-1 transition-all cursor-pointer ${
                  activeTab === 'sarees-rts' ? 'text-[#0F4C5C] font-semibold' : 'hover:text-[#0F4C5C]'
                }`}
              >
                <span className="flex items-center gap-1">
                  <span>Sarees – Ready to Ship</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
                </span>
                {activeTab === 'sarees-rts' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F4C5C] -mb-1" />}
              </button>
            </li>

            <li>
              <button
                id="nav-link-custom-clothing"
                type="button"
                onClick={() => setActiveTab('custom-clothing')}
                className={`relative py-1 transition-all cursor-pointer ${
                  activeTab === 'custom' || activeTab === 'custom-clothing' ? 'text-[#0F4C5C] font-semibold' : 'hover:text-[#0F4C5C]'
                }`}
              >
                Customised Clothing
                {(activeTab === 'custom' || activeTab === 'custom-clothing') && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F4C5C] -mb-1" />
                )}
              </button>
            </li>

            <li>
              <button
                id="nav-link-story"
                type="button"
                onClick={() => setActiveTab('story')}
                className={`relative py-1 transition-all cursor-pointer ${
                  activeTab === 'story' ? 'text-[#0F4C5C] font-semibold' : 'hover:text-[#0F4C5C]'
                }`}
              >
                The Sixth Element Story
                {activeTab === 'story' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F4C5C] -mb-1" />}
              </button>
            </li>

            <li>
              <button
                id="nav-link-about"
                type="button"
                onClick={() => setActiveTab('about')}
                className={`relative py-1 transition-all cursor-pointer ${
                  activeTab === 'about' ? 'text-[#0F4C5C] font-semibold' : 'hover:text-[#0F4C5C]'
                }`}
              >
                About AARU
                {activeTab === 'about' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F4C5C] -mb-1" />}
              </button>
            </li>

            <li>
              <button
                id="nav-link-sale"
                type="button"
                onClick={() => setActiveTab('sale')}
                className={`relative py-1 transition-all cursor-pointer text-[#C08081] font-semibold hover:text-[#A66263] ${
                  activeTab === 'sale' ? 'underline underline-offset-4' : ''
                }`}
              >
                Sale
                <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-[#C08081] align-top" />
              </button>
            </li>
          </ul>
        </div>

        {/* Categories Mega Menu Dropdown */}
        <CategoriesMegaMenu
          isOpen={isCategoriesMenuOpen}
          isPinned={isCategoriesPinned}
          onTogglePin={() => setIsCategoriesPinned(!isCategoriesPinned)}
          onClose={() => {
            setIsCategoriesPinned(false);
            setIsCategoriesMenuOpen(false);
          }}
          categories={categories}
          products={products}
          onSelectCategory={(catName) => {
            setIsCategoriesPinned(false);
            setIsCategoriesMenuOpen(false);
            if (onSelectCategory) {
              onSelectCategory(catName);
            } else {
              setActiveTab(catName);
            }
          }}
          onSelectProduct={(prod) => {
            setIsCategoriesPinned(false);
            setIsCategoriesMenuOpen(false);
            if (onSearchSelect) onSearchSelect(prod);
          }}
          onNavigateCustom={() => {
            setIsCategoriesPinned(false);
            setIsCategoriesMenuOpen(false);
            setActiveTab('custom-clothing');
          }}
        />
      </nav>

      {/* Mobile Push-Down Accordion Menu - Occupies horizontal width and seamlessly pushes main website content downwards in normal document flow */}
      {isMobileMenuOpen && (
        <div 
          id="mobile-pushdown-menu"
          className="lg:hidden w-full bg-[#FAF9F5] border-t border-b border-[#E8DFD5] shadow-xs animate-in slide-in-from-top duration-300 overflow-hidden"
        >
          <div className="px-4 py-4 sm:px-6 space-y-4 max-w-2xl mx-auto">
            {/* Mobile Search input */}
            <div className="relative">
              <input
                id="mobile-pushdown-search"
                type="text"
                placeholder="Search sarees, weaves, crafts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#D4C7B5] text-xs text-[#24211E] placeholder:text-[#8A8175] focus:outline-none focus:border-[#0F4C5C]"
              />
              <Search className="w-4 h-4 text-[#8A8175] absolute left-3 top-3" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-[#8A8175] hover:text-[#24211E]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* If there's an active search query, show live search results */}
            {searchQuery.trim().length > 0 && (
              <div className="bg-white border border-[#E8DFD5] max-h-48 overflow-y-auto divide-y divide-[#FAF7F2]">
                {searchResults.slice(0, 4).map(prod => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      if (onSearchSelect) onSearchSelect(prod);
                      setIsMobileMenuOpen(false);
                      setSearchQuery('');
                    }}
                    className="p-2.5 flex items-center gap-3 hover:bg-[#FAF7F2] cursor-pointer"
                  >
                    <img src={prod.images[0]} alt={prod.name} className="w-8 h-8 object-cover border border-[#E8DFD5]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-serif font-semibold text-[#24211E] truncate">{prod.name}</p>
                      <p className="text-[10px] text-[#8C6D37] font-sans font-bold">₹{prod.price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Navigation Links with 44px min touch targets */}
            <nav className="space-y-1 text-xs uppercase tracking-wider font-semibold text-[#24211E]">
              {/* 1. Home */}
              <button
                id="mobile-nav-home"
                type="button"
                onClick={() => {
                  setActiveTab('home');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full min-h-[44px] px-3 py-2.5 text-left flex items-center justify-between border-b border-[#E8DFD5]/60 hover:bg-white transition-colors ${
                  activeTab === 'home' ? 'text-[#0F4C5C] bg-white font-bold border-l-3 border-[#0F4C5C]' : ''
                }`}
              >
                <span>Home</span>
                <ArrowRight className="w-4 h-4 text-[#8A8175]" />
              </button>

              {/* 2. Shop to Look */}
              <button
                id="mobile-nav-shop-the-look"
                type="button"
                onClick={() => {
                  setActiveTab('shop-the-look');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full min-h-[44px] px-3 py-2.5 text-left flex items-center justify-between border-b border-[#E8DFD5]/60 hover:bg-white transition-colors ${
                  activeTab === 'shop-the-look' ? 'text-[#0F4C5C] bg-white font-bold border-l-3 border-[#0F4C5C]' : ''
                }`}
              >
                <span>Shop to Look</span>
                <ArrowRight className="w-4 h-4 text-[#8A8175]" />
              </button>

              {/* 3. Categories with Expandable Subcategories Accordion */}
              <div className="border-b border-[#E8DFD5]/60">
                <button
                  id="mobile-nav-categories-toggle"
                  type="button"
                  onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                  className="w-full min-h-[44px] px-3 py-2.5 text-left flex items-center justify-between hover:bg-white transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>Categories</span>
                    <span className="text-[10px] font-mono font-normal bg-[#F5EFE6] px-1.5 py-0.5 text-[#8C6D37]">
                      {categories.length}
                    </span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-[#8A8175] transition-transform duration-200 ${isMobileCategoriesOpen ? 'rotate-180 text-[#0F4C5C]' : ''}`} />
                </button>

                {isMobileCategoriesOpen && (
                  <div id="mobile-categories-accordion" className="bg-white/90 border-t border-[#E8DFD5] pl-3 pr-1 py-1 divide-y divide-[#FAF7F2] max-h-60 overflow-y-auto">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        id={`mobile-cat-${cat.slug}`}
                        type="button"
                        onClick={() => {
                          if (cat.name === 'Customized Clothing') {
                            setActiveTab('custom-clothing');
                          } else if (onSelectCategory) {
                            onSelectCategory(cat.name);
                          } else {
                            setActiveTab(cat.name);
                          }
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full min-h-[44px] px-2 py-2 text-left flex items-center justify-between text-[11px] font-medium text-[#4A4339] hover:text-[#0F4C5C] hover:bg-white transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={cat.image} 
                            alt={cat.name} 
                            className="w-6 h-6 object-cover border border-[#E8DFD5] bg-[#FAF7F2]" 
                          />
                          <span>{cat.name}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[#8A8175]" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. Sarees – Ready to Ship */}
              <button
                id="mobile-nav-sarees-rts"
                type="button"
                onClick={() => {
                  setActiveTab('sarees-rts');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full min-h-[44px] px-3 py-2.5 text-left flex items-center justify-between border-b border-[#E8DFD5]/60 hover:bg-white transition-colors ${
                  activeTab === 'sarees-rts' ? 'text-[#0F4C5C] bg-white font-bold border-l-3 border-[#0F4C5C]' : ''
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span>Sarees – Ready to Ship</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
                </span>
                <ArrowRight className="w-4 h-4 text-[#8A8175]" />
              </button>

              {/* 5. Customised Clothing */}
              <button
                id="mobile-nav-custom-clothing"
                type="button"
                onClick={() => {
                  setActiveTab('custom-clothing');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full min-h-[44px] px-3 py-2.5 text-left flex items-center justify-between border-b border-[#E8DFD5]/60 hover:bg-white transition-colors ${
                  activeTab === 'custom' || activeTab === 'custom-clothing' ? 'text-[#0F4C5C] bg-white font-bold border-l-3 border-[#0F4C5C]' : ''
                }`}
              >
                <span>Customised Clothing</span>
                <ArrowRight className="w-4 h-4 text-[#8A8175]" />
              </button>

              {/* 6. The Sixth Element Story */}
              <button
                id="mobile-nav-story"
                type="button"
                onClick={() => {
                  setActiveTab('story');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full min-h-[44px] px-3 py-2.5 text-left flex items-center justify-between border-b border-[#E8DFD5]/60 hover:bg-white transition-colors ${
                  activeTab === 'story' ? 'text-[#0F4C5C] bg-white font-bold border-l-3 border-[#0F4C5C]' : ''
                }`}
              >
                <span>The Sixth Element Story</span>
                <ArrowRight className="w-4 h-4 text-[#8A8175]" />
              </button>

              {/* 7. About AARU */}
              <button
                id="mobile-nav-about"
                type="button"
                onClick={() => {
                  setActiveTab('about');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full min-h-[44px] px-3 py-2.5 text-left flex items-center justify-between border-b border-[#E8DFD5]/60 hover:bg-white transition-colors ${
                  activeTab === 'about' ? 'text-[#0F4C5C] bg-white font-bold border-l-3 border-[#0F4C5C]' : ''
                }`}
              >
                <span>About AARU</span>
                <ArrowRight className="w-4 h-4 text-[#8A8175]" />
              </button>

              {/* 8. Orders & Tracking */}
              <button
                id="mobile-nav-orders"
                type="button"
                onClick={() => {
                  onOpenOrders();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full min-h-[44px] px-3 py-2.5 text-left flex items-center justify-between border-b border-[#E8DFD5]/60 hover:bg-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#0F4C5C]" />
                  <span>Orders & Tracking</span>
                </span>
                <ArrowRight className="w-4 h-4 text-[#8A8175]" />
              </button>
            </nav>

            {/* Mobile Pushdown Actions: WhatsApp & Admin Dashboard */}
            <div className="pt-3 border-t border-[#E8DFD5] space-y-2.5">
              <a
                id="mobile-whatsapp-btn"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[44px] px-4 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Atelier Concierge</span>
              </a>

              <button
                id="mobile-admin-switch-btn"
                type="button"
                onClick={() => {
                  if (onToggleMode) onToggleMode('admin');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full min-h-[44px] px-4 bg-white border border-[#9C7C38] text-[#9C7C38] hover:bg-[#F5EFE6] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Switch to Admin Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
