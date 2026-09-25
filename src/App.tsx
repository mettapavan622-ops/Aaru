import React, { useState, useEffect } from 'react';
import { 
  Product, 
  ProductVariant, 
  CartItem, 
  Order, 
  User, 
  AnnouncementSettings, 
  Category, 
  Collection,
  CustomInquiry,
  PromoCode
} from './types';
import { 
  initialProducts, 
  categories as defaultCategories, 
  collections as defaultCollections, 
  defaultAnnouncement, 
  sampleOrders 
} from './data/mockData';

// Component imports
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ProductListingPage } from './components/ProductListingPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { SixthElementSection } from './components/SixthElementSection';
import { FounderStorySection } from './components/FounderStorySection';
import { ShopTheLook } from './components/ShopTheLook';
import { ShopTheLookPage } from './components/ShopTheLookPage';
import { CustomClothingStudio } from './components/CustomClothingStudio';
import { 
  AboutAaruSection, 
  BrandStorySection, 
  FaqSection, 
  ContactSection, 
  Footer 
} from './components/BrandStoryPages';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { realtimeSync, RealtimeSyncEvent } from './services/realtimeSync';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AuthModal } from './components/AuthModal';
import { AuthScreen } from './components/AuthScreen';
import { WhatsAppButton } from './components/WhatsAppButton';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PolicyPage, PolicyType } from './components/PolicyPages';

export default function App() {
  // Authentication State: Loaded from verified session
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('aaru_user_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isGuestBrowsing, setIsGuestBrowsing] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // Top Level Navigation & Presentation Role Switcher
  const [currentDashboard, setCurrentDashboard] = useState<'user' | 'admin'>(() => {
    try {
      const saved = localStorage.getItem('aaru_user_session');
      if (saved) {
        const u = JSON.parse(saved);
        if (u && (u.role === 'admin' || u.email?.toLowerCase() === 'aarubymoni@admin.co.in')) {
          return 'admin';
        }
      }
    } catch {}
    return 'user';
  });
  const [activeUserView, setActiveUserView] = useState<
    'home' | 'catalog' | 'pdp' | 'custom' | 'story' | 'about' | 'contact' | 'shop-the-look' | 'returns-policy' | 'shipping-policy' | 'privacy-policy' | 'terms-of-use'
  >(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('returns-policy')) return 'returns-policy';
      if (path.includes('shipping-policy')) return 'shipping-policy';
      if (path.includes('privacy-policy')) return 'privacy-policy';
      if (path.includes('terms-of-use')) return 'terms-of-use';
    }
    return 'home';
  });

  // Sync browser back/forward history with policy views and admin route protection
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/admin') {
        if (currentUser && currentUser.role === 'admin') {
          setCurrentDashboard('admin');
        } else {
          setCurrentDashboard('user');
          setActiveUserView('home');
          window.history.replaceState(null, '', '/');
        }
      } else if (path.includes('returns-policy')) setActiveUserView('returns-policy');
      else if (path.includes('shipping-policy')) setActiveUserView('shipping-policy');
      else if (path.includes('privacy-policy')) setActiveUserView('privacy-policy');
      else if (path.includes('terms-of-use')) setActiveUserView('terms-of-use');
      else if (path === '/' || path === '') setActiveUserView('home');
    };

    window.addEventListener('popstate', handlePopState);

    // Initial check on mount for direct /admin URL typing
    if (typeof window !== 'undefined' && window.location.pathname.toLowerCase() === '/admin') {
      if (currentUser && currentUser.role === 'admin') {
        setCurrentDashboard('admin');
      } else {
        setCurrentDashboard('user');
        setActiveUserView('home');
        window.history.replaceState(null, '', '/');
      }
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentUser]);

  const navigateToView = (view: typeof activeUserView) => {
    setActiveUserView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      if (view === 'returns-policy') window.history.pushState(null, '', '/returns-policy');
      else if (view === 'shipping-policy') window.history.pushState(null, '', '/shipping-policy');
      else if (view === 'privacy-policy') window.history.pushState(null, '', '/privacy-policy');
      else if (view === 'terms-of-use') window.history.pushState(null, '', '/terms-of-use');
      else if (view === 'home') window.history.pushState(null, '', '/');
    } catch {
      // Safe fallback if history API restricted in iframe
    }
  };
  const [catalogCategory, setCatalogCategory] = useState<string>('all');
  const [catalogFilter, setCatalogFilter] = useState<'all' | 'ready-to-ship' | 'handloom' | 'bridal'>('all');

  // Core Commerce State
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>([]);
  const [announcement, setAnnouncement] = useState<AnnouncementSettings>(defaultAnnouncement);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [collections, setCollections] = useState<Collection[]>(defaultCollections);

  // Bag, Checkout, Wishlist, Tracking Drawers/Modals - start clean and empty
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [wishlistProductIds, setWishlistProductIds] = useState<string[]>([]);

  // Active Product for PDP
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(initialProducts[0]);

  // Promo Code State
  const [appliedPromo, setAppliedPromo] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [coupons, setCoupons] = useState<PromoCode[]>([]);

  // Real-Time Live Notification Toast
  const [liveUpdateNotice, setLiveUpdateNotice] = useState<string | null>(null);

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/coupons');
      const data = await res.json();
      if (Array.isArray(data)) {
        setCoupons(data);
      }
    } catch (err) {
      console.error('Failed to load coupons:', err);
    }
  };

  const handleAuthSuccess = (
    user: User,
    initialData?: { cart?: any[]; wishlist?: string[]; orders?: any[] }
  ) => {
    setCurrentUser(user);

    // Explicitly initialize state from backend user session data (empty for new users)
    setCartItems(Array.isArray(initialData?.cart) ? initialData.cart : []);
    setWishlistProductIds(Array.isArray(initialData?.wishlist) ? initialData.wishlist : []);
    setOrders(Array.isArray(initialData?.orders) ? initialData.orders : []);
    setAppliedPromo('');
    setPromoDiscount(0);

    // Strict Role-Based Redirection:
    if (user.role === 'admin' || user.email?.toLowerCase() === 'aarubymoni@admin.co.in') {
      setCurrentDashboard('admin');
      const token = localStorage.getItem('aaru_auth_token');
      fetch('/api/orders', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setOrders(data);
        })
        .catch(() => {});
    } else {
      setCurrentDashboard('user');
      setActiveUserView('home');
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('aaru_user_session');
    localStorage.removeItem('aaru_auth_token');
    setCurrentUser(null);
    setCartItems([]);
    setWishlistProductIds([]);
    setOrders([]);
    setAppliedPromo('');
    setPromoDiscount(0);
    setCurrentDashboard('user');
    setActiveUserView('home');
    setIsGuestBrowsing(false);
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
  };

  // Synchronize with backend API on mount
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(err => console.error('Failed to load products from API:', err));

    fetch('/api/cms/announcement')
      .then(res => res.json())
      .then(data => {
        if (data && data.text) {
          setAnnouncement(data);
        }
      })
      .catch(err => console.error('Failed to load announcement from API:', err));

    fetchCoupons();

    // Hydrate user cart, wishlist, and orders from database session if authenticated
    const token = localStorage.getItem('aaru_auth_token');
    if (currentUser && token) {
      fetch('/api/user/data', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.success) {
            if (Array.isArray(data.cart)) setCartItems(data.cart);
            if (Array.isArray(data.wishlist)) setWishlistProductIds(data.wishlist);
            if (Array.isArray(data.orders)) setOrders(data.orders);
          }
        })
        .catch(err => console.error('Failed to hydrate user data:', err));
    } else if (currentUser && (currentUser.role === 'admin' || currentUser.email?.toLowerCase() === 'aarubymoni@admin.co.in')) {
      fetch('/api/orders', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setOrders(data);
        })
        .catch(() => {});
    }
  }, []);

  // Real-Time Admin-to-User Synchronization Engine (WebSocket + SSE + Cross-Tab)
  useEffect(() => {
    const showLiveNotice = (msg: string) => {
      setLiveUpdateNotice(msg);
      setTimeout(() => setLiveUpdateNotice(null), 3500);
    };

    const unsubscribe = realtimeSync.subscribe((event: RealtimeSyncEvent) => {
      // 1. Full Catalog Refresh / Initialization
      if (event.type === 'INIT' || event.type === 'CATALOG_UPDATED') {
        if (Array.isArray(event.products) && event.products.length > 0) {
          setProducts(event.products);
          setSelectedProduct(prev => {
            if (!prev) return event.products![0];
            return event.products!.find(p => p.id === prev.id) || prev;
          });
        }
        if (event.announcement) {
          setAnnouncement(event.announcement);
        }
      }

      // 2. Real-Time Product Update (e.g. inventory, price, sale, availability)
      if (event.type === 'PRODUCT_UPDATED' && event.product) {
        const updated = event.product;
        setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
        
        // Instantly reflect on PDP if currently viewed by active user
        setSelectedProduct(prev => prev?.id === updated.id ? updated : prev);

        // Instantly reflect on Cart items if in user's active bag
        setCartItems(prev => prev.map(item => {
          if (item.product.id === updated.id) {
            const matchedVariant = updated.variants.find(v => v.id === item.variant.id) || item.variant;
            return {
              ...item,
              product: updated,
              variant: matchedVariant
            };
          }
          return item;
        }));

        showLiveNotice(`Catalog updated: "${updated.title}" changes reflected live.`);
      }

      // 3. Real-Time Product Creation
      if (event.type === 'PRODUCT_CREATED' && event.product) {
        const created = event.product;
        setProducts(prev => {
          if (prev.some(p => p.id === created.id)) return prev;
          return [created, ...prev];
        });
        showLiveNotice(`New arrival: "${created.title}" added to the boutique.`);
      }

      // 4. Real-Time Product Deletion
      if (event.type === 'PRODUCT_DELETED' && event.productId) {
        const pid = event.productId;
        setProducts(prev => prev.filter(p => p.id !== pid));
        setSelectedProduct(prev => prev?.id === pid ? null : prev);
        setCartItems(prev => prev.filter(item => item.product.id !== pid));
        showLiveNotice('A piece was archived and updated across all storefronts.');
      }

      // 5. Real-Time Order Status Update
      if (event.type === 'ORDER_STATUS_UPDATED' && event.order) {
        const updatedOrder = event.order;
        setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
        showLiveNotice(`Order #${updatedOrder.id.slice(-6).toUpperCase()} status updated to ${updatedOrder.status}.`);
      }

      // 6. Real-Time Announcement Update
      if (event.type === 'ANNOUNCEMENT_UPDATED' && event.announcement) {
        setAnnouncement(event.announcement);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Persist shopping cart changes to backend for authenticated patron
  useEffect(() => {
    const token = localStorage.getItem('aaru_auth_token');
    if (currentUser && token) {
      fetch('/api/user/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cart: cartItems })
      }).catch(() => {});
    }
  }, [cartItems, currentUser]);

  // Persist wishlist changes to backend for authenticated patron
  useEffect(() => {
    const token = localStorage.getItem('aaru_auth_token');
    if (currentUser && token) {
      fetch('/api/user/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ wishlist: wishlistProductIds })
      }).catch(() => {});
    }
  }, [wishlistProductIds, currentUser]);

  // Cart Operations
  const handleAddToCart = (product: Product, variant: ProductVariant, quantity: number) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        i => i.product.id === product.id && i.variant.id === variant.id
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, variant, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, variantId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId, variantId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId && item.variant.id === variantId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string, variantId: string) => {
    setCartItems(prev =>
      prev.filter(item => !(item.product.id === productId && item.variant.id === variantId))
    );
  };

  // Dynamic Promo Code Validation with Backend API
  const handleApplyPromo = async (code: string): Promise<{ success: boolean; message: string; discount?: number }> => {
    const cleanCode = code.trim().toUpperCase();
    const currentSubtotal = cartItems.reduce((s, i) => s + (i.product.salePrice || i.product.price) * i.quantity, 0);

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleanCode, subtotal: currentSubtotal, orderSubtotal: currentSubtotal })
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        return {
          success: false,
          message: data.error || data.message || `Coupon code '${cleanCode}' is invalid or inactive.`
        };
      }

      const calculatedDiscount = Number(data.discountAmount !== undefined ? data.discountAmount : data.discount);
      const safeDiscount = Number.isFinite(calculatedDiscount) ? Math.min(currentSubtotal, Math.max(0, calculatedDiscount)) : 0;
      const couponCode = data.code || data.coupon?.code || cleanCode;

      setAppliedPromo(couponCode);
      setPromoDiscount(safeDiscount);
      return {
        success: true,
        message: data.message || `${data.discountPercent || 10}% OFF coupon applied successfully! (Saved ₹${safeDiscount.toLocaleString('en-IN')})`,
        discount: safeDiscount
      };
    } catch (err: any) {
      console.error('Coupon validation error:', err);
      if (cleanCode === 'AARU10') {
        const discount = Math.round(currentSubtotal * 0.1);
        setAppliedPromo('AARU10');
        setPromoDiscount(discount);
        return { success: true, message: '10% discount applied!', discount };
      }
      return { success: false, message: 'Could not validate coupon code at this time.' };
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo('');
    setPromoDiscount(0);
  };

  // Keep promo discount in sync when cart items change
  useEffect(() => {
    if (!appliedPromo) return;
    const currentSubtotal = cartItems.reduce(
      (s, i) => s + (i.product.salePrice || i.product.price) * i.quantity,
      0
    );
    if (currentSubtotal === 0) {
      setPromoDiscount(0);
      return;
    }

    fetch('/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: appliedPromo, subtotal: currentSubtotal, orderSubtotal: currentSubtotal })
    })
      .then(res => res.json())
      .then(data => {
        if (data.valid) {
          const calculatedDiscount = Number(data.discountAmount !== undefined ? data.discountAmount : data.discount);
          setPromoDiscount(Number.isFinite(calculatedDiscount) ? Math.min(currentSubtotal, Math.max(0, calculatedDiscount)) : 0);
        } else {
          setAppliedPromo('');
          setPromoDiscount(0);
        }
      })
      .catch(() => {});
  }, [cartItems, appliedPromo]);

  // Wishlist Operations
  const handleToggleWishlist = (product: Product) => {
    setWishlistProductIds(prev =>
      prev.includes(product.id)
        ? prev.filter(id => id !== product.id)
        : [...prev, product.id]
    );
  };

  const handleMoveWishlistToCart = (product: Product) => {
    handleAddToCart(product, product.variants[0], 1);
    handleToggleWishlist(product);
  };

  // Checkout and Order Lifecycle
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product.salePrice || item.product.price) * item.quantity,
    0
  );
  const safeDiscount = Math.min(subtotal, Math.max(0, Number(promoDiscount) || 0));
  const remainingSubtotal = Math.max(0, subtotal - safeDiscount);
  const shippingFee = subtotal >= 15000 || cartItems.length === 0 ? 0 : 500;
  const tax = Math.round(remainingSubtotal * 0.05);
  const total = Math.max(0, remainingSubtotal + shippingFee + tax);

  const handleOrderSuccess = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    setCartItems([]);
    setAppliedPromo('');
    setPromoDiscount(0);
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, { method: 'POST' });
      const updated = await res.json();
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRequestReturn = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/return`, { method: 'POST' });
      const updated = await res.json();
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRequestReturnWithDetails = async (
    orderId: string,
    details: {
      requestType: 'Return' | 'Exchange';
      reason: string;
      clientNote: string;
      exchangeSize?: string;
    }
  ) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/return-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details)
      });
      const data = await res.json();
      if (data.order) {
        setOrders(prev => prev.map(o => o.id === orderId ? data.order : o));
      }
    } catch (err) {
      console.error('Error submitting return request:', err);
      throw err;
    }
  };

  // Admin Actions
  const handleAdminSaveProduct = async (productData: Partial<Product>) => {
    if (productData.id) {
      // Update existing
      const res = await fetch(`/api/products/${productData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      const updated = await res.json();
      setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
      if (selectedProduct?.id === updated.id) {
        setSelectedProduct(updated);
      }
      realtimeSync.broadcastLocally({ type: 'PRODUCT_UPDATED', product: updated });
    } else {
      // Create new
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      const created = await res.json();
      setProducts(prev => [created, ...prev]);
      realtimeSync.broadcastLocally({ type: 'PRODUCT_CREATED', product: created });
    }
  };

  const handleAdminDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to remove this piece from the atelier catalog?')) return;
    await fetch(`/api/products/${productId}`, { method: 'DELETE' });
    setProducts(prev => prev.filter(p => p.id !== productId));
    realtimeSync.broadcastLocally({ type: 'PRODUCT_DELETED', productId });
  };

  const handleAdminUpdateAnnouncement = async (newSettings: Partial<AnnouncementSettings>) => {
    const res = await fetch('/api/cms/announcement', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings)
    });
    const updated = await res.json();
    setAnnouncement(updated);
    realtimeSync.broadcastLocally({ type: 'ANNOUNCEMENT_UPDATED', announcement: updated });
  };

  const handleAdminUpdateOrderStatus = async (
    orderId: string, 
    status: Order['status'], 
    trackingNumber?: string
  ) => {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, trackingNumber })
    });
    const updated = await res.json();
    setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    realtimeSync.broadcastLocally({ type: 'ORDER_STATUS_UPDATED', order: updated });
  };

  const handleRefreshOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to sync orders:', err);
    }
  };

  const handleCustomInquirySubmit = async (inquiry: CustomInquiry) => {
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiry)
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Nav actions
  const navigateToProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveUserView('pdp');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const wishlistProducts = (products || []).filter(p => p && (wishlistProductIds || []).includes(p.id));

  // =========================================================================
  // ROUTE PROTECTION & ADMIN DASHBOARD:
  // Strictly enforce that only authenticated users with role === 'admin'
  // can view the Admin Dashboard. Standard customers and unauthenticated users
  // are immediately redirected to the Customer Storefront.
  // =========================================================================
  if (currentDashboard === 'admin') {
    if (!currentUser || currentUser.role !== 'admin') {
      // Route Protection: prevent unauthorized access
      setCurrentDashboard('user');
      setActiveUserView('home');
      return null;
    }

    return (
      <AdminDashboard
        products={products}
        orders={orders}
        coupons={coupons}
        onRefreshCoupons={fetchCoupons}
        announcement={announcement}
        categories={categories}
        collections={collections}
        onSaveProduct={handleAdminSaveProduct}
        onDeleteProduct={handleAdminDeleteProduct}
        onUpdateAnnouncement={handleAdminUpdateAnnouncement}
        onUpdateOrderStatus={handleAdminUpdateOrderStatus}
        onSwitchToUser={() => setCurrentDashboard('user')}
        onSignOut={handleSignOut}
        onRefreshOrders={handleRefreshOrders}
      />
    );
  }

  // =========================================================================
  // AUTHENTICATION GATE:
  // Displayed before the user logs into the website
  // =========================================================================
  if (!currentUser && !isGuestBrowsing) {
    return (
      <AuthScreen
        onLoginSuccess={handleAuthSuccess}
        onContinueAsGuest={() => {
          setIsGuestBrowsing(true);
        }}
      />
    );
  }

  // =========================================================================
  // USER STOREFRONT MODE:
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#24211E] flex flex-col selection:bg-[#0F4C5C]/20 selection:text-[#0F4C5C]">
      {/* Header with Live Announcement Bar & Role Switcher */}
      <Header
        announcement={announcement}
        currentRole={currentDashboard}
        currentMode={currentDashboard}
        onRoleSwitch={setCurrentDashboard}
        onToggleMode={setCurrentDashboard}
        cartCount={cartItems.reduce((s, i) => s + i.quantity, 0)}
        wishlistCount={(wishlistProductIds || []).length}
        currentUser={currentUser}
        products={products}
        categories={categories}
        onSearchSelect={navigateToProduct}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenAuth={(mode) => {
          setAuthModalMode(mode === 'signup' ? 'signup' : 'login');
          setIsAuthModalOpen(true);
        }}
        onSignOut={handleSignOut}
        onSelectCategory={(categoryName) => {
          if (categoryName === 'Customized Clothing') {
            setActiveUserView('custom');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            setCatalogCategory(categoryName);
            setCatalogFilter('all');
            setActiveUserView('catalog');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onNavigate={(view) => {
          if (view === 'shop-the-look') {
            setActiveUserView('shop-the-look');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (view === 'sarees-rts') {
            setCatalogCategory('Sarees');
            setCatalogFilter('ready-to-ship');
            setActiveUserView('catalog');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (view === 'ready-to-ship') {
            setCatalogCategory('all');
            setCatalogFilter('ready-to-ship');
            setActiveUserView('catalog');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (view === 'designer-wear') {
            setCatalogCategory('Designer Wear');
            setCatalogFilter('all');
            setActiveUserView('catalog');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (view === 'just-in') {
            setCatalogCategory('all');
            setCatalogFilter('all');
            setActiveUserView('catalog');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (view === 'sale') {
            setCatalogCategory('all');
            setCatalogFilter('sale' as any);
            setActiveUserView('catalog');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (view === 'custom-clothing' || view === 'custom') {
            setActiveUserView('custom');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (view === 'story' || view === 'sixth-element' || view === 'the-sixth-element') {
            setActiveUserView('story');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (view === 'about') {
            setActiveUserView('about');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (view === 'categories' || view === 'collections') {
            const el = document.getElementById('shop-by-category');
            if (el && activeUserView === 'home') {
              el.scrollIntoView({ behavior: 'smooth' });
            } else {
              setCatalogCategory('all');
              setCatalogFilter('all');
              setActiveUserView('catalog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          } else if (view === 'home') {
            setActiveUserView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            setActiveUserView(view as any);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        activeView={activeUserView}
        activeTab={activeUserView}
        setActiveTab={(view) => {
          if (view === 'custom-clothing' || view === 'custom') {
            setActiveUserView('custom');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (view === 'story' || view === 'sixth-element' || view === 'the-sixth-element') {
            setActiveUserView('story');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (view === 'about') {
            setActiveUserView('about');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (view === 'categories' || view === 'just-in' || view === 'designer-wear' || view === 'ready-to-ship' || view === 'sale') {
            const el = document.getElementById('shop-by-category');
            el?.scrollIntoView({ behavior: 'smooth' });
          } else {
            setActiveUserView(view as any);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeUserView === 'pdp' && selectedProduct ? (
          /* Product Detail Page View */
          <ProductDetailPage
            product={selectedProduct}
            onAddToCart={handleAddToCart}
            isWishlisted={Boolean(selectedProduct && (wishlistProductIds || []).includes(selectedProduct.id))}
            onToggleWishlist={handleToggleWishlist}
            onBack={() => {
              setActiveUserView('home');
              window.scrollTo({ top: 400, behavior: 'smooth' });
            }}
            onSelectRelated={navigateToProduct}
            relatedProducts={products.filter(p => p.id !== selectedProduct.id)}
            onNavigateToPolicy={(pol) => {
              setActiveUserView(pol);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : activeUserView === 'shop-the-look' ? (
          /* Dedicated Shop the Look Editorial Lookbook */
          <ShopTheLookPage
            products={products}
            onSelectProduct={navigateToProduct}
            onBackToHome={() => {
              setActiveUserView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onQuickAddToCart={(prod) => handleAddToCart(prod, prod.variants[0], 1)}
          />
        ) : activeUserView === 'catalog' ? (
          /* Filtered Catalog Page */
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setActiveUserView('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs font-semibold uppercase tracking-wider text-[#0F4C5C] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                ← Back to Home Showcase
              </button>
              <span className="text-xs text-[#736B5E] font-medium">
                Browsing: <strong className="text-[#24211E]">{catalogCategory !== 'all' ? catalogCategory : 'All Categories'}</strong>
                {catalogFilter === 'ready-to-ship' && ' • Ready to Ship'}
              </span>
            </div>
            <ProductListingPage
              products={products}
              categories={categories}
              collections={collections}
              wishlistIds={wishlistProductIds}
              wishlistProductIds={wishlistProductIds}
              onSelectProduct={navigateToProduct}
              onToggleWishlist={handleToggleWishlist}
              onQuickAddToCart={(prod) => handleAddToCart(prod, prod.variants[0], 1)}
              initialCategory={catalogCategory}
              initialFilter={catalogFilter as any}
            />
          </div>
        ) : activeUserView === 'custom' ? (
          /* Bespoke Atelier Inquiries */
          <div className="py-8">
            <CustomClothingStudio onSubmitInquiry={handleCustomInquirySubmit} />
          </div>
        ) : activeUserView === 'story' ? (
          /* Full Editorial Storytelling View - Brand Manifesto */
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setActiveUserView('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs font-semibold uppercase tracking-wider text-[#0F4C5C] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                ← Back to Home Showcase
              </button>
              <span className="text-xs text-[#8C6D37] font-semibold tracking-widest uppercase">
                Brand Manifesto • The Sixth Element Story
              </span>
            </div>
            <div className="space-y-16">
              <SixthElementSection onExploreCollection={() => {
                setCatalogCategory('all');
                setCatalogFilter('all');
                setActiveUserView('catalog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} />
              <FounderStorySection onDiscoverStory={() => {
                setActiveUserView('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} />
              <BrandStorySection />
            </div>
          </div>
        ) : activeUserView === 'about' ? (
          /* Brand Heritage & About AARU */
          <div className="py-8 space-y-12">
            <AboutAaruSection />
            <FounderStorySection onDiscoverStory={() => {
              setActiveUserView('story');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} />
            <FaqSection />
          </div>
        ) : activeUserView === 'contact' ? (
          /* Concierge & Atelier Consultations */
          <div className="py-8 space-y-12">
            <ContactSection />
            <FaqSection />
          </div>
        ) : activeUserView === 'returns-policy' || activeUserView === 'shipping-policy' || activeUserView === 'privacy-policy' || activeUserView === 'terms-of-use' ? (
          /* Four Dedicated Static Legal & Policy Documentation Pages */
          <PolicyPage
            type={activeUserView as PolicyType}
            onNavigateHome={() => navigateToView('home')}
            onNavigatePolicy={(policy) => navigateToView(policy)}
          />
        ) : (
          /* Complete Editorial Home & Storytelling-first Commerce Flow:
             1. Hero Banner
             2. Shop by Category (Product Listing with filters & instant search)
             3. The Sixth Element Narrative
             4. Founder Story & Artisanal Lineage
             5. Shop The Look
             6. Customised Clothing Studio
             7. About AARU & FAQ
          */
          <div className="space-y-20 lg:space-y-28">
            {/* 1. Hero Banner */}
            <HeroBanner
              onExplore={() => {
                const el = document.getElementById('shop-by-category');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onExploreClick={() => {
                setCatalogCategory('all');
                setCatalogFilter('all');
                setActiveUserView('catalog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onShopNewArrivals={() => {
                setCatalogCategory('all');
                setCatalogFilter('all');
                setActiveUserView('catalog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onStoryClick={() => {
                setActiveUserView('story');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSixthElementStory={() => {
                setActiveUserView('story');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onCustomStudio={() => {
                setActiveUserView('custom');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onShopLookClick={() => {
                setActiveUserView('shop-the-look');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSareesRTSClick={() => {
                setCatalogCategory('Sarees');
                setCatalogFilter('ready-to-ship');
                setActiveUserView('catalog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* 2. Shop by Category & Product Catalog Section */}
            <div id="shop-by-category">
              <ProductListingPage
                products={products}
                categories={categories}
                collections={collections}
                wishlistIds={wishlistProductIds}
                wishlistProductIds={wishlistProductIds}
                onSelectProduct={navigateToProduct}
                onToggleWishlist={handleToggleWishlist}
                onQuickAddToCart={(prod) => handleAddToCart(prod, prod.variants[0], 1)}
              />
            </div>

            {/* 3. The Sixth Element Philosophy Section */}
            <SixthElementSection onExploreCollection={() => {
              setActiveUserView('story');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} />

            {/* 4. Founder Story & Craft Lineage */}
            <FounderStorySection onDiscoverStory={() => {
              setActiveUserView('about');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} />

            {/* 5. Shop The Look Editorial Hotspots */}
            <ShopTheLook
              products={products}
              onSelectProduct={navigateToProduct}
              onSelectLookProduct={navigateToProduct}
              onAddToCart={(prod) => handleAddToCart(prod, prod.variants[0], 1)}
              onExploreAllLooks={() => {
                setActiveUserView('shop-the-look');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* 6. Customised Clothing Studio */}
            <CustomClothingStudio onSubmitInquiry={handleCustomInquirySubmit} />

            {/* 7. About AARU & Brand Essence */}
            <AboutAaruSection />

            {/* 8. Frequently Asked Questions */}
            <FaqSection />

            {/* 9. Atelier Concierge Contact */}
            <ContactSection />
          </div>
        )}
      </main>

      {/* Luxury Brand Footer */}
      <Footer onNavigate={(v) => {
        navigateToView(v as any);
      }} />

      {/* Floating WhatsApp Concierge */}
      <WhatsAppButton />

      {/* Slide-out Shopping Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        appliedPromo={appliedPromo}
        onApplyPromo={handleApplyPromo}
        onRemovePromo={handleRemovePromo}
        promoDiscount={promoDiscount}
      />

      {/* Bespoke Multi-Step Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        subtotal={subtotal}
        discount={promoDiscount}
        shippingFee={shippingFee}
        tax={tax}
        total={total}
        onOrderSuccess={handleOrderSuccess}
        userEmail={currentUser?.email}
        userName={currentUser?.name}
        appliedPromo={appliedPromo}
        onApplyPromo={handleApplyPromo}
        onRemovePromo={handleRemovePromo}
      />

      {/* Live Order History & Tracking Modal */}
      <OrderHistoryModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
        onCancelOrder={handleCancelOrder}
        onRequestReturn={handleRequestReturn}
        onRequestReturnWithDetails={handleRequestReturnWithDetails}
        onRefreshOrders={handleRefreshOrders}
      />

      {/* Saved Heirloom Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveWishlist={handleToggleWishlist}
        onMoveToCart={handleMoveWishlistToCart}
        onSelectProduct={navigateToProduct}
      />

      {/* Email / OTP Login Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleAuthSuccess}
      />

      {/* Real-Time Atelier Live Sync Toast Notification */}
      {liveUpdateNotice && (
        <aside aria-label="Real-time live synchronization notification" className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300 max-w-sm pointer-events-none">
          <div className="bg-[#0F4C5C] text-white px-4 py-2.5 shadow-xl border border-white/20 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-xs font-medium tracking-wide">
              {liveUpdateNotice}
            </span>
          </div>
        </aside>
      )}
    </div>
  );
}
