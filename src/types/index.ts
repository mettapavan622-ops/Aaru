export interface ProductVariant {
  id: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'Free Size' | 'Custom';
  color: string;
  colorCode: string;
  inventory: number;
  sku: string;
  isAvailable: boolean;
}

export interface Product {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  category: string;
  collection: string;
  price: number;
  salePrice?: number;
  isOnSale?: boolean;
  isReadyToShip: boolean;
  description: string;
  fabric: string;
  craft: string;
  careInstructions: string;
  fitAndSizeInfo: string;
  shippingPolicy: string;
  returnPolicy: string;
  images: string[];
  variants: ProductVariant[];
  totalInventory: number;
  tags: string[];
  occasion?: string;
  isFeatured?: boolean;
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl?: string;
    keywords?: string[];
  };
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
}

export interface Collection {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  heroImage: string;
  accentColor: string;
  isFeatured: boolean;
}

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export type CustomInquiry = CustomClothingRequest;

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface Address {
  id: string;
  name: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

export type OrderStatus = 
  | 'Confirmed' 
  | 'Processing' 
  | 'Shipped' 
  | 'Out for Delivery' 
  | 'Delivered' 
  | 'Cancelled' 
  | 'Returned'
  | 'Return Requested'
  | 'Return Approved'
  | 'Exchange Requested'
  | 'Exchange Approved'
  | 'Return Rejected';

export interface ReturnExchangeRequest {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  requestType: 'Return' | 'Exchange';
  reason: string;
  clientNote: string;
  status: 'Pending' | 'Approved' | 'Cancelled' | 'Rejected';
  adminNote?: string;
  exchangeSize?: string;
  pickupScheduledDate?: string;
  createdAt: string;
  updatedAt?: string;
  items?: {
    productTitle: string;
    size: string;
    quantity: number;
    price: number;
    image?: string;
  }[];
}

export interface OrderTimelineStep {
  status: OrderStatus | string;
  label: string;
  date?: string;
  completed: boolean;
  current?: boolean;
  description?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: {
    product: Product;
    variant: ProductVariant;
    quantity: number;
    price: number;
  }[];
  shippingAddress: Address;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentId?: string;
  trackingNumber?: string;
  courierName?: string;
  timeline: OrderTimelineStep[];
  canCancel: boolean;
  canReturn: boolean;
  returnRequest?: ReturnExchangeRequest;
  createdAt: string;
}

export interface CustomClothingRequest {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  garmentType: 'Saree & Blouse' | 'Bridal Lehenga' | 'Anarkali Gown' | 'Festive Kurta Set' | 'Bespoke Indo-Western';
  fabricPreference: string;
  colorPreference: string;
  measurements: {
    bust?: string;
    waist?: string;
    hip?: string;
    shoulder?: string;
    blouseLength?: string;
    height?: string;
    specialNotes?: string;
  };
  budgetRange?: string;
  status: 'New' | 'Consultation Scheduled' | 'In Atelier' | 'Completed';
  createdAt: string;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  maxDiscount?: number;
  minOrderValue: number;
  description: string;
  isActive: boolean;
  expiryDate?: string;
}

export interface AnnouncementSettings {
  text: string;
  linkText?: string;
  linkUrl?: string;
  isActive: boolean;
  saleHighlight?: string;
  isSaleActive: boolean;
  headline?: string;
  discountCode?: string;
  subtext?: string;
}

export interface CustomerInquiry {
  id: string;
  source: 'Homepage Inquiry' | 'Customisation Inquiry';
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  message?: string;
  designPreferences?: {
    garmentType?: string;
    fabricPreference?: string;
    colorPreference?: string;
    budgetRange?: string;
  };
  specifications?: Record<string, string | undefined>;
  status: 'New' | 'In Review' | 'Resolved';
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'customer' | 'admin';
  addresses: Address[];
}
