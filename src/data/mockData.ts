import { Product, Category, Collection, Order, PromoCode, AnnouncementSettings } from '../types';

export const INITIAL_ANNOUNCEMENT: AnnouncementSettings = {
  text: "Festive Heirloom Edit: Complimentary worldwide express shipping on orders over ₹15,000",
  headline: "Exclusive Atelier Festive Sale: Up to 25% Off Handloom Heirloom Weaves",
  discountCode: "FESTIVE25",
  subtext: "Complimentary worldwide express shipping on orders over ₹15,000 | Code: FESTIVE25",
  linkText: "Explore Now",
  linkUrl: "#collections",
  isActive: true,
  isSaleActive: true,
  saleHighlight: "Mid-Season Atelier Sale: Up to 25% off Curated Weaves"
};

export const CATEGORIES: Category[] = [
  {
    id: 'cat-sarees',
    name: 'Sarees',
    slug: 'sarees',
    description: 'Heritage handloom sarees woven by master artisans in pure silks and natural zari.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85',
    itemCount: 14
  },
  {
    id: 'cat-lehengas',
    name: 'Lehengas',
    slug: 'lehengas',
    description: 'Bespoke bridal and ceremonial lehengas with artisanal hand-embroidered kalis.',
    image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=85',
    itemCount: 8
  },
  {
    id: 'cat-dresses',
    name: 'Dresses',
    slug: 'dresses',
    description: 'Contemporary evening gowns, concept wrap dresses, and pre-pleated luxury drapes.',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=85',
    itemCount: 7
  },
  {
    id: 'cat-kurtas',
    name: 'Kurtas',
    slug: 'kurtas',
    description: 'Artisanal silk and Chanderi kurta sets adorned with delicate gota and threadwork.',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=85',
    itemCount: 11
  },
  {
    id: 'cat-coords',
    name: 'Co-Ords',
    slug: 'co-ords',
    description: 'Modern luxury silhouettes, handwoven tussar capes, and tailored trouser sets.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=85',
    itemCount: 6
  },
  {
    id: 'cat-designer-wear',
    name: 'Designer Wear',
    slug: 'designer-wear',
    description: 'Exclusive runway editions featuring architectural borders and zardozi embellishments.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=85',
    itemCount: 9
  },
  {
    id: 'cat-dress-materials',
    name: 'Dress Materials',
    slug: 'dress-materials',
    description: 'Unstitched pure organza, raw silk, and hand-spun chanderi fabric ensembles.',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=85',
    itemCount: 10
  },
  {
    id: 'cat-occasion-wear',
    name: 'Occasion Wear',
    slug: 'occasion-wear',
    description: 'Grand silhouettes for intimate ceremonies, sangeet nights, and high-evening soirées.',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=85',
    itemCount: 12
  },
  {
    id: 'cat-festive-collections',
    name: 'Festive Collections',
    slug: 'festive-collections',
    description: 'Heirloom celebratory weaves in festive hues of vermilion, emerald, and liquid gold.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85',
    itemCount: 15
  },
  {
    id: 'cat-customized-clothing',
    name: 'Customized Clothing',
    slug: 'customized-clothing',
    description: 'Bespoke couture tailored to your exact measurements, color palette, and drape.',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=85',
    itemCount: 8
  }
];

export const COLLECTIONS: Collection[] = [
  {
    id: 'col-sixth-element',
    title: 'The Sixth Element',
    slug: 'the-sixth-element',
    tagline: 'Intuition. Softness. Power. Confidence. Strength. Protection.',
    description: 'Inspired by the invisible energy that completes a woman, this capsule pairs ethereal silk organza with hand-beaten gold tissue borders.',
    heroImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=85',
    accentColor: '#0F4C5C',
    isFeatured: true
  },
  {
    id: 'col-moni-atelier',
    title: 'AARU by Moni',
    slug: 'aaru-by-moni',
    tagline: 'Woven with six fingers, crafted with infinite soul.',
    description: 'Our founder Moni infuses her tactile mastery and rare dexterity into intimate limited-edition drapes.',
    heroImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1600&q=85',
    accentColor: '#9C7C38',
    isFeatured: true
  },
  {
    id: 'col-sarees-rts',
    title: 'Sarees – Ready to Ship',
    slug: 'sarees-ready-to-ship',
    tagline: 'Heirloom drapes pre-finished with complimentary fall and pico.',
    description: 'Express dispatched sarees carefully checked, rolled, and packaged in signature velvet boxes.',
    heroImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=85',
    accentColor: '#2D5A46',
    isFeatured: false
  },
  {
    id: 'col-festive-symphony',
    title: 'Festive Symphony',
    slug: 'festive-symphony',
    tagline: 'Vibrant jewel tones rooted in regal temple iconography.',
    description: 'Heirloom Kanjeevarams and Banarasi kadwa brocades designed for celebratory rituals.',
    heroImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=85',
    accentColor: '#C08081',
    isFeatured: true
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    title: 'Kavya Emerald Banarasi Tissue Saree',
    subtitle: 'Woven with real silver zari in floral jaal',
    slug: 'kavya-emerald-banarasi-tissue-saree',
    category: 'Sarees',
    collection: 'The Sixth Element',
    price: 34500,
    salePrice: 28900,
    isOnSale: true,
    isReadyToShip: true,
    description: 'A masterpiece from our Sixth Element capsule. Handcrafted in Varanasi over 28 days, this emerald tissue saree drapes like liquid moonlight. The pallu features heritage meenakari detailing woven with unpolished antique gold zari.',
    fabric: 'Pure Mulberry Silk & Metallic Tissue',
    craft: 'Varanasi Kadwa Handloom Weave with Antique Zari',
    careInstructions: 'Dry clean only. Store wrapped in unbleached muslin. Protect from moisture and direct sunlight.',
    fitAndSizeInfo: 'Length: 5.5 meters, Width: 46 inches. Includes an unstitched contrast blouse piece of 0.9 meters.',
    shippingPolicy: 'Ready to Ship: Dispatched within 24 hours. Complimentary express courier across India; 4-6 business days globally.',
    returnPolicy: 'Eligible for return or exchange within 7 days of delivery in pristine, unworn condition with atelier tags intact.',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85'
    ],
    variants: [
      { id: 'v-001-1', size: 'Free Size', color: 'Deep Peacock Emerald', colorCode: '#0F4C5C', inventory: 6, sku: 'AARU-SAR-001-EM', isAvailable: true }
    ],
    totalInventory: 6,
    tags: ['Bestseller', 'Ready to Ship', 'Kadwa Brocade', 'Festive Edit'],
    occasion: 'Weddings, Reception & Receptions',
    isFeatured: true,
    seo: {
      metaTitle: 'Kavya Emerald Banarasi Tissue Saree | AARU Luxury Handlooms',
      metaDescription: 'Shop the Kavya Emerald Banarasi Tissue Saree handcrafted in pure mulberry silk with antique gold zari.',
      keywords: ['Banarasi Saree', 'Tissue Silk Saree', 'AARU Fashion', 'Designer Handloom']
    },
    createdAt: '2026-09-01T10:00:00Z'
  },
  {
    id: 'prod-002',
    title: 'Noor Pale Rose Organza Saree',
    subtitle: 'Scalloped zardozi border with hand-embroidered French knots',
    slug: 'noor-pale-rose-organza-saree',
    category: 'Designer Wear',
    collection: 'The Sixth Element',
    price: 26800,
    isOnSale: false,
    isReadyToShip: true,
    description: 'Subtle, poetic, and infinitely graceful. The Noor saree is woven from featherlight glass organza in our signature muted rose tone, finished with delicate hand-beaten gold wire embroidery along scalloped edges.',
    fabric: '100% Pure Kora Organza Silk',
    craft: 'Zardozi Hand Needlework & Aari Embroidery',
    careInstructions: 'Strictly dry clean. Do not iron directly on metallic embroidery; use low heat with a damp cloth pressing.',
    fitAndSizeInfo: 'Length: 5.5 meters. Paired with 1 meter raw silk embroidered blouse fabric.',
    shippingPolicy: 'Ready to Ship. Ships within 48 hours in luxury presentation box.',
    returnPolicy: '7-day hassle-free returns on standard items.',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85'
    ],
    variants: [
      { id: 'v-002-1', size: 'Free Size', color: 'Dusty Rose', colorCode: '#C08081', inventory: 9, sku: 'AARU-DES-002-ROSE', isAvailable: true }
    ],
    totalInventory: 9,
    tags: ['Hand Embroidered', 'Ready to Ship', 'Pastel Saree'],
    occasion: 'Cocktails, Day Weddings & Soirées',
    isFeatured: true,
    seo: {
      metaTitle: 'Noor Pale Rose Organza Saree | AARU',
      metaDescription: 'Featherlight pure organza saree with scalloped zardozi border by AARU.',
      keywords: ['Organza Saree', 'Embroidered Saree', 'AARU Sarees']
    },
    createdAt: '2026-09-02T12:00:00Z'
  },
  {
    id: 'prod-003',
    title: 'Atelier Moni Six-Fold Midnight Kanjeevaram',
    subtitle: 'Signature edition woven personally with Moni’s proprietary draft',
    slug: 'atelier-moni-six-fold-midnight-kanjeevaram',
    category: 'Sarees',
    collection: 'AARU by Moni',
    price: 46000,
    salePrice: 39500,
    isOnSale: true,
    isReadyToShip: false,
    description: 'A tribute to Moni’s journey and the power of intuitive touch. Woven in Kanchipuram using heavy 3-ply mulberry silk, this midnight navy drape bears an architectural temple border that transitions into pure woven cosmos.',
    fabric: 'Pure Kanchipuram 3-Ply Silk',
    craft: 'Korvai Interlocking Weave with Solid Zari Petni Border',
    careInstructions: 'Specialist dry clean only. Air out every 6 months.',
    fitAndSizeInfo: 'Length: 5.5 meters, Width: 48 inches. Includes 1m running blouse fabric.',
    shippingPolicy: 'Made to Order / Limited Edition. Ships in 10-14 days with artisan certificates of authenticity.',
    returnPolicy: 'Exchanges allowed within 10 days for store credit or sizing adjustment.',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85'
    ],
    variants: [
      { id: 'v-003-1', size: 'Free Size', color: 'Midnight Indigo', colorCode: '#1A2A3A', inventory: 3, sku: 'AARU-MONI-003-IND', isAvailable: true }
    ],
    totalInventory: 3,
    tags: ['Founder Collection', 'Korvai Weave', 'Collector Item'],
    occasion: 'Weddings & Royal Celebrations',
    isFeatured: true,
    seo: {
      metaTitle: 'Atelier Moni Six-Fold Midnight Kanjeevaram | AARU',
      metaDescription: 'Signature edition Kanjeevaram saree personally supervised by founder Moni.',
      keywords: ['Kanjeevaram Silk', 'Moni Saree', 'AARU Sixth Element']
    },
    createdAt: '2026-09-03T14:30:00Z'
  },
  {
    id: 'prod-004',
    title: 'Roopmati Chanderi Silk Anarkali Suit Set',
    subtitle: '3-piece ensemble with hand-block dabu printed organza dupatta',
    slug: 'roopmati-chanderi-silk-anarkali-suit-set',
    category: 'Kurtas',
    collection: 'Festive Symphony',
    price: 21500,
    isOnSale: false,
    isReadyToShip: true,
    description: 'Tailored from hand-spun Chanderi silk with subtle metallic warp threads. The silhouette features a 28-kalidar flare, gota patti neckline, and a matching hand-block printed sheer organza dupatta.',
    fabric: 'Pure Chanderi Silk with Mulmul Cotton Lining',
    craft: 'Hand Gota Patti & Handblock Indigo Discharge Print',
    careInstructions: 'Dry clean recommended. Gentle hand steam.',
    fitAndSizeInfo: 'Relaxed fit bodice with generous flare. Custom tailoring available upon request.',
    shippingPolicy: 'Ready to Ship: Dispatched within 24 hours.',
    returnPolicy: 'Standard 7-day return policy applies.',
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1000&q=85'
    ],
    variants: [
      { id: 'v-004-1', size: 'XS', color: 'Sage Green', colorCode: '#2D5A46', inventory: 4, sku: 'AARU-ANR-004-XS', isAvailable: true },
      { id: 'v-004-2', size: 'S', color: 'Sage Green', colorCode: '#2D5A46', inventory: 8, sku: 'AARU-ANR-004-S', isAvailable: true },
      { id: 'v-004-3', size: 'M', color: 'Sage Green', colorCode: '#2D5A46', inventory: 5, sku: 'AARU-ANR-004-M', isAvailable: true },
      { id: 'v-004-4', size: 'L', color: 'Sage Green', colorCode: '#2D5A46', inventory: 6, sku: 'AARU-ANR-004-L', isAvailable: true },
      { id: 'v-004-5', size: 'XL', color: 'Sage Green', colorCode: '#2D5A46', inventory: 3, sku: 'AARU-ANR-004-XL', isAvailable: true },
      { id: 'v-004-6', size: 'XXL', color: 'Sage Green', colorCode: '#2D5A46', inventory: 4, sku: 'AARU-ANR-004-XXL', isAvailable: true }
    ],
    totalInventory: 30,
    tags: ['Ready to Ship', '3-Piece Set', 'Anarkali'],
    occasion: 'Mehendi, Sangeet & Festive Gatherings',
    isFeatured: true,
    seo: {
      metaTitle: 'Roopmati Chanderi Silk Anarkali Suit Set | AARU',
      metaDescription: 'Handcrafted Chanderi silk Anarkali suit set with gota patti detailing.',
      keywords: ['Chanderi Anarkali', 'Occasion Wear', 'Festive Kurta Set']
    },
    createdAt: '2026-09-04T09:15:00Z'
  },
  {
    id: 'prod-005',
    title: 'Mehrunisa Raw Silk Heritage Lehenga',
    subtitle: 'Hand-dyed crimson silk with micro-pearl and marodi craftsmanship',
    slug: 'mehrunisa-raw-silk-heritage-lehenga',
    category: 'Lehengas',
    collection: 'Festive Symphony',
    price: 48500,
    salePrice: 42000,
    isOnSale: true,
    isReadyToShip: false,
    description: 'An architectural heirloom bridal lehenga created for ceremonial majesty. Handcrafted from heavy raw silk, featuring 16 kalis embroidered with heritage marodi stitch work, river pearls, and real dabka threads.',
    fabric: 'Heavy Raw Silk, Net Veil Dupatta, Shantoon Inner',
    craft: 'Traditional Marodi Embroidery & Hand Zardozi',
    careInstructions: 'Professional wedding gown preservation and dry clean only.',
    fitAndSizeInfo: 'Semi-stitched skirt with customizable waist up to 42 inches. Unstitched corset blouse piece.',
    shippingPolicy: 'Made to Order: Delivered within 3 weeks. Dedicated atelier concierge tracking.',
    returnPolicy: 'Customized & bridal orders are final sale with complimentary fittings included.',
    images: [
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=85'
    ],
    variants: [
      { id: 'v-005-1', size: 'XS', color: 'Royal Crimson', colorCode: '#7A1C28', inventory: 2, sku: 'AARU-LEH-005-XS', isAvailable: true },
      { id: 'v-005-2', size: 'S', color: 'Royal Crimson', colorCode: '#7A1C28', inventory: 4, sku: 'AARU-LEH-005-S', isAvailable: true },
      { id: 'v-005-3', size: 'M', color: 'Royal Crimson', colorCode: '#7A1C28', inventory: 5, sku: 'AARU-LEH-005-M', isAvailable: true },
      { id: 'v-005-4', size: 'L', color: 'Royal Crimson', colorCode: '#7A1C28', inventory: 3, sku: 'AARU-LEH-005-L', isAvailable: true },
      { id: 'v-005-5', size: 'XL', color: 'Royal Crimson', colorCode: '#7A1C28', inventory: 2, sku: 'AARU-LEH-005-XL', isAvailable: true },
      { id: 'v-005-6', size: 'XXL', color: 'Royal Crimson', colorCode: '#7A1C28', inventory: 2, sku: 'AARU-LEH-005-XXL', isAvailable: true }
    ],
    totalInventory: 18,
    tags: ['Bridal', 'Bespoke', 'Heirloom'],
    occasion: 'Weddings & Bridal Receptions',
    isFeatured: false,
    seo: {
      metaTitle: 'Mehrunisa Raw Silk Heritage Lehenga | AARU Couture',
      metaDescription: 'Heirloom raw silk bridal lehenga with authentic Marodi embroidery.',
      keywords: ['Bridal Lehenga', 'Raw Silk Lehenga', 'AARU Bridal']
    },
    createdAt: '2026-09-05T11:00:00Z'
  },
  {
    id: 'prod-006',
    title: 'Aadya Hand-Spun Chanderi Unstitched Suit Material',
    subtitle: 'Pure zari woven bootis with tissue border dupatta',
    slug: 'aadya-hand-spun-chanderi-unstitched-suit-material',
    category: 'Dress Materials',
    collection: 'The Sixth Element',
    price: 12500,
    isOnSale: false,
    isReadyToShip: true,
    description: 'Curated 3-piece unstitched ensemble featuring a 2.5m handloom Chanderi kurta fabric with golden zari motifs, 2.5m pure silk-cotton bottoms, and a 2.5m shimmering tissue dupatta with handcrafted tassels.',
    fabric: 'Chanderi Silk Cotton with Metallic Zari',
    craft: 'Traditional Handloom Weave with Jaal Pallu',
    careInstructions: 'Dry clean recommended for first three washes.',
    fitAndSizeInfo: 'Unstitched 3-piece cut lengths (2.5m Kurta + 2.5m Bottom + 2.5m Dupatta). Fits sizes up to 3XL.',
    shippingPolicy: 'Ready to Ship: Dispatched within 24 hours.',
    returnPolicy: '7-day returns if uncut and original tags remain intact.',
    images: [
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1000&q=85'
    ],
    variants: [
      { id: 'v-006-1', size: 'Free Size', color: 'Antique Sand Gold', colorCode: '#9C7C38', inventory: 12, sku: 'AARU-MAT-006-GD', isAvailable: true }
    ],
    totalInventory: 12,
    tags: ['Ready to Ship', 'Unstitched', 'Chanderi Silk'],
    occasion: 'Pooja, Festive Dinner & Office Celebrations',
    isFeatured: false,
    seo: {
      metaTitle: 'Aadya Hand-Spun Chanderi Unstitched Suit Material | AARU',
      metaDescription: 'Premium Chanderi unstitched dress material with metallic zari motifs.',
      keywords: ['Chanderi Dress Material', 'Unstitched Suit', 'AARU Handlooms']
    },
    createdAt: '2026-09-06T15:20:00Z'
  },
  {
    id: 'prod-007',
    title: 'Maya Pre-Pleated Concept Saree Dress',
    subtitle: 'Contemporary evening silhouette with structured pleated pallu',
    slug: 'maya-pre-pleated-concept-saree-dress',
    category: 'Dresses',
    collection: 'The Sixth Element',
    price: 24500,
    salePrice: 21000,
    isOnSale: true,
    isReadyToShip: true,
    description: 'An architectural fusion of effortless gown draping and heritage saree elegance. Tailored with a zip-up pleated skirt and integrated shoulder pallu in hammered silk-crepe.',
    fabric: 'Hammered Silk-Crepe & Georgette',
    craft: 'Precision Atelier Draping & Cutwork Embroidery',
    careInstructions: 'Dry clean only. Steam press.',
    fitAndSizeInfo: 'Tailored fit at waist with free-flowing drape. Concealed side zipper.',
    shippingPolicy: 'Ready to Ship: Dispatched within 24 hours.',
    returnPolicy: '7-day standard returns on unworn pieces.',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1000&q=85'
    ],
    variants: [
      { id: 'v-007-1', size: 'XS', color: 'Midnight Indigo', colorCode: '#1A2A3A', inventory: 3, sku: 'AARU-DRS-007-XS', isAvailable: true },
      { id: 'v-007-2', size: 'S', color: 'Midnight Indigo', colorCode: '#1A2A3A', inventory: 5, sku: 'AARU-DRS-007-S', isAvailable: true },
      { id: 'v-007-3', size: 'M', color: 'Midnight Indigo', colorCode: '#1A2A3A', inventory: 4, sku: 'AARU-DRS-007-M', isAvailable: true },
      { id: 'v-007-4', size: 'L', color: 'Midnight Indigo', colorCode: '#1A2A3A', inventory: 4, sku: 'AARU-DRS-007-L', isAvailable: true },
      { id: 'v-007-5', size: 'XL', color: 'Midnight Indigo', colorCode: '#1A2A3A', inventory: 2, sku: 'AARU-DRS-007-XL', isAvailable: true },
      { id: 'v-007-6', size: 'XXL', color: 'Midnight Indigo', colorCode: '#1A2A3A', inventory: 3, sku: 'AARU-DRS-007-XXL', isAvailable: true }
    ],
    totalInventory: 21,
    tags: ['Ready to Ship', 'Concept Dress', 'Evening Wear'],
    occasion: 'Cocktail Gala & Receptions',
    isFeatured: true,
    seo: {
      metaTitle: 'Maya Pre-Pleated Concept Saree Dress | AARU',
      metaDescription: 'Shop Maya pre-pleated concept saree dress in hammered silk-crepe.',
      keywords: ['Concept Saree', 'Saree Dress', 'AARU Evening Dress']
    },
    createdAt: '2026-09-07T12:00:00Z'
  },
  {
    id: 'prod-008',
    title: 'Avani Handwoven Tussar Silk Co-Ord Set',
    subtitle: 'Cape blazer with tailored straight-cut trousers',
    slug: 'avani-handwoven-tussar-silk-co-ord-set',
    category: 'Co-Ords',
    collection: 'The Sixth Element',
    price: 18900,
    isOnSale: false,
    isReadyToShip: true,
    description: 'A striking 2-piece luxury ensemble crafted in wild Tussar silk with subtle metallic thread borders. Features a tailored cape jacket paired with high-waisted cigarette trousers.',
    fabric: '100% Wild Tussar Handloom Silk',
    craft: 'Handloom Weaving with Antique Metallic Pinstripe',
    careInstructions: 'Dry clean only.',
    fitAndSizeInfo: 'Semi-relaxed tailored blazer with comfortable elasticated back waistband.',
    shippingPolicy: 'Ready to Ship: Dispatched within 24-48 hours.',
    returnPolicy: '7-day easy exchange available.',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=85'
    ],
    variants: [
      { id: 'v-008-1', size: 'XS', color: 'Antique Sand Gold', colorCode: '#9C7C38', inventory: 3, sku: 'AARU-CRD-008-XS', isAvailable: true },
      { id: 'v-008-2', size: 'S', color: 'Antique Sand Gold', colorCode: '#9C7C38', inventory: 6, sku: 'AARU-CRD-008-S', isAvailable: true },
      { id: 'v-008-3', size: 'M', color: 'Antique Sand Gold', colorCode: '#9C7C38', inventory: 4, sku: 'AARU-CRD-008-M', isAvailable: true },
      { id: 'v-008-4', size: 'L', color: 'Antique Sand Gold', colorCode: '#9C7C38', inventory: 5, sku: 'AARU-CRD-008-L', isAvailable: true },
      { id: 'v-008-5', size: 'XL', color: 'Antique Sand Gold', colorCode: '#9C7C38', inventory: 2, sku: 'AARU-CRD-008-XL', isAvailable: true },
      { id: 'v-008-6', size: 'XXL', color: 'Antique Sand Gold', colorCode: '#9C7C38', inventory: 3, sku: 'AARU-CRD-008-XXL', isAvailable: true }
    ],
    totalInventory: 23,
    tags: ['Ready to Ship', 'Co-Ord Set', 'Tussar Silk'],
    occasion: 'Intimate Ceremonies, Soirées & Art Openings',
    isFeatured: true,
    seo: {
      metaTitle: 'Avani Handwoven Tussar Silk Co-Ord Set | AARU',
      metaDescription: 'Handcrafted Tussar silk cape blazer and trouser set by AARU.',
      keywords: ['Silk Co-ord', 'Tussar Set', 'AARU Luxury Co-Ords']
    },
    createdAt: '2026-09-08T10:30:00Z'
  },
  {
    id: 'prod-009',
    title: 'Aarohi Vermilion Kadwa Pattu Saree',
    subtitle: 'Celebratory red silk with gold-silver zari meenakari peacocks',
    slug: 'aarohi-vermilion-kadwa-pattu-saree',
    category: 'Festive Collections',
    collection: 'Festive Symphony',
    price: 38000,
    salePrice: 32500,
    isOnSale: true,
    isReadyToShip: true,
    description: 'An ode to auspicious celebrations. Rich vermilion Katan silk woven on traditional pit looms in Varanasi featuring intricate Kadwa meenakari peacocks that take over 45 days to weave.',
    fabric: 'Pure Varanasi Katan Silk',
    craft: 'Kadwa Brocade Weaving with Real Tested Zari',
    careInstructions: 'Specialist dry clean only. Preserve in unbleached cotton muslin.',
    fitAndSizeInfo: 'Standard 5.5 meters length with 1-meter contrast brocade blouse fabric.',
    shippingPolicy: 'Ready to Ship: Dispatched within 24 hours.',
    returnPolicy: '7-day returns on unworn merchandise.',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85'
    ],
    variants: [
      { id: 'v-009-1', size: 'Free Size', color: 'Royal Crimson', colorCode: '#7A1C28', inventory: 4, sku: 'AARU-FEST-009-RED', isAvailable: true }
    ],
    totalInventory: 4,
    tags: ['Ready to Ship', 'Kadwa Brocade', 'Festive Edit'],
    occasion: 'Weddings, Pujas & Festive Celebrations',
    isFeatured: true,
    seo: {
      metaTitle: 'Aarohi Vermilion Kadwa Pattu Saree | AARU',
      metaDescription: 'Varanasi pure silk kadwa brocade saree in auspicious vermilion.',
      keywords: ['Festive Saree', 'Kadwa Pattu', 'AARU Festive Collection']
    },
    createdAt: '2026-09-08T16:00:00Z'
  },
  {
    id: 'prod-010',
    title: 'Bespoke Atelier Bridal Couturier Suite',
    subtitle: 'Made-to-measure bridal silhouette with personalized monogramming',
    slug: 'bespoke-atelier-bridal-couturier-suite',
    category: 'Customized Clothing',
    collection: 'AARU by Moni',
    price: 65000,
    isOnSale: false,
    isReadyToShip: false,
    description: 'A completely bespoke couture commission designed directly with founder Moni. Hand-dyed pure silks, custom kalis, hand-embroidered personal vows or motifs, and tailored fitting consultations.',
    fabric: 'Client Selected Heritage Pure Silk & Hand-Woven Zari',
    craft: 'Zardozi, Marodi & Aari Hand Needlework',
    careInstructions: 'Atelier preservation pack included.',
    fitAndSizeInfo: 'Precision tailored to 12 distinct body measurements.',
    shippingPolicy: 'Handcrafted in 4-6 weeks with priority concierge dispatch.',
    returnPolicy: 'Includes unlimited private salon alterations.',
    images: [
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1000&q=85'
    ],
    variants: [
      { id: 'v-010-1', size: 'Custom', color: 'Deep Peacock Emerald', colorCode: '#0F4C5C', inventory: 10, sku: 'AARU-CUST-010-BESPOKE', isAvailable: true }
    ],
    totalInventory: 10,
    tags: ['Custom Made', 'Bespoke Couture', 'Bridal Suite'],
    occasion: 'Wedding Day & Royal Ceremonies',
    isFeatured: false,
    seo: {
      metaTitle: 'Bespoke Atelier Bridal Couturier Suite | AARU',
      metaDescription: 'Personalized bridal couture tailored to your measurements by AARU.',
      keywords: ['Customized Clothing', 'Bespoke Lehenga', 'AARU Couture']
    },
    createdAt: '2026-09-09T09:00:00Z'
  },
  {
    id: 'prod-011',
    title: 'Kalyani Royal Zari Brocade Ensemble',
    subtitle: 'Heavy woven brocade with scalloped dabka borders',
    slug: 'kalyani-royal-zari-brocade-ensemble',
    category: 'Occasion Wear',
    collection: 'Festive Symphony',
    price: 32000,
    salePrice: 28000,
    isOnSale: true,
    isReadyToShip: true,
    description: 'An opulent high-evening ensemble created for milestone celebrations. Pure silk brocade weave accented with heritage jaal and fine handcrafted metallic fringe details.',
    fabric: 'Pure Silk Brocade with Satin Silk Lining',
    craft: 'Brocade Weaving & Hand Zardozi Trims',
    careInstructions: 'Dry clean only.',
    fitAndSizeInfo: 'Tailored fit. Free Size with room for adjustment.',
    shippingPolicy: 'Ready to Ship: Dispatched within 24 hours.',
    returnPolicy: '7-day standard returns on unworn items.',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85'
    ],
    variants: [
      { id: 'v-011-1', size: 'XS', color: 'Antique Sand Gold', colorCode: '#9C7C38', inventory: 3, sku: 'AARU-OCC-011-XS', isAvailable: true },
      { id: 'v-011-2', size: 'S', color: 'Antique Sand Gold', colorCode: '#9C7C38', inventory: 5, sku: 'AARU-OCC-011-S', isAvailable: true },
      { id: 'v-011-3', size: 'M', color: 'Antique Sand Gold', colorCode: '#9C7C38', inventory: 4, sku: 'AARU-OCC-011-M', isAvailable: true },
      { id: 'v-011-4', size: 'L', color: 'Antique Sand Gold', colorCode: '#9C7C38', inventory: 4, sku: 'AARU-OCC-011-L', isAvailable: true },
      { id: 'v-011-5', size: 'XL', color: 'Antique Sand Gold', colorCode: '#9C7C38', inventory: 2, sku: 'AARU-OCC-011-XL', isAvailable: true },
      { id: 'v-011-6', size: 'XXL', color: 'Antique Sand Gold', colorCode: '#9C7C38', inventory: 3, sku: 'AARU-OCC-011-XXL', isAvailable: true }
    ],
    totalInventory: 21,
    tags: ['Ready to Ship', 'Occasion Wear', 'Heirloom Zari'],
    occasion: 'Sangeet, Reception & High Soirées',
    isFeatured: true,
    seo: {
      metaTitle: 'Kalyani Royal Zari Brocade Ensemble | AARU',
      metaDescription: 'Heirloom brocade ensemble for weddings and receptions by AARU.',
      keywords: ['Occasion Wear', 'Brocade Ensemble', 'AARU Luxury']
    },
    createdAt: '2026-09-09T15:00:00Z'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-89420',
    orderNumber: 'AARU-2026-89420',
    userId: 'user-demo-1',
    customerName: 'Anantha Rao',
    customerEmail: 'anantharao2018@gmail.com',
    customerPhone: '+91 98451 23098',
    items: [
      {
        product: INITIAL_PRODUCTS[1],
        variant: INITIAL_PRODUCTS[1].variants[0],
        quantity: 1,
        price: 26800
      }
    ],
    shippingAddress: {
      id: 'addr-1',
      name: 'Anantha Rao',
      street: '74 Lavelle Road, Richmond Town',
      apartment: 'Suite 402, Crescent Manor',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
      phone: '+91 98451 23098',
      isDefault: true
    },
    subtotal: 26800,
    discount: 0,
    shippingFee: 0,
    tax: 1206,
    total: 28006,
    status: 'Return Approved',
    paymentMethod: 'UPI / Net Banking',
    paymentId: 'pay_test_881230491',
    courierName: 'Blue Dart Luxury Express',
    trackingNumber: 'BD-771239841IN',
    timeline: [
      { status: 'Confirmed', label: 'Order Confirmed', date: '04 Sep 2026, 10:15 AM', completed: true },
      { status: 'Processing', label: 'Atelier Inspection & Packing', date: '05 Sep 2026, 02:30 PM', completed: true },
      { status: 'Shipped', label: 'Dispatched via Blue Dart', date: '06 Sep 2026, 09:00 AM', completed: true },
      { status: 'Delivered', label: 'Delivered to Recipient', date: '08 Sep 2026, 04:20 PM', completed: true },
      { status: 'Return Requested', label: 'Return Request Submitted', date: '11 Sep 2026, 11:30 AM', completed: true },
      { status: 'Return Approved', label: 'Return Approved by Atelier Admin', date: '12 Sep 2026, 03:00 PM', completed: true, current: true, description: 'Return authorized by Atelier Director Moni. Reverse pickup scheduled with Blue Dart Luxury Express.' }
    ],
    canCancel: false,
    canReturn: false,
    returnRequest: {
      id: 'ret-seed-89420',
      orderId: 'ord-89420',
      orderNumber: 'AARU-2026-89420',
      customerName: 'Anantha Rao',
      customerEmail: 'anantharao2018@gmail.com',
      customerPhone: '+91 98451 23098',
      requestType: 'Return',
      reason: 'Sizing or Fit Issue (Blouse fit too snug at bust)',
      clientNote: 'Exquisite silk weave and craftsmanship, requesting reverse pickup for return.',
      status: 'Approved',
      trackingStatus: 'Out for Pickup',
      pickupScheduledDate: 'Tomorrow, 11:00 AM - 02:00 PM',
      reverseCourier: 'Blue Dart Luxury Express - Reverse Logistics',
      reverseTrackingNumber: 'BD-REV-89420IN',
      refundAmount: 28006,
      refundReferenceId: 'REF-89420-UTR',
      adminNote: 'Return authorized by Atelier Director Moni. Blue Dart reverse collection booked.',
      createdAt: '2026-09-11T11:30:00Z',
      updatedAt: '2026-09-12T15:00:00Z',
      items: [
        {
          productTitle: 'Noor Pale Rose Organza Saree',
          size: 'Free Size',
          quantity: 1,
          price: 26800,
          image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85'
        }
      ]
    },
    createdAt: '2026-09-04T10:15:00Z'
  },
  {
    id: 'ord-89421',
    orderNumber: 'AARU-2026-89421',
    userId: 'user-demo-1',
    customerName: 'Anantha Rao',
    customerEmail: 'anantharao2018@gmail.com',
    customerPhone: '+91 98451 23098',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        variant: INITIAL_PRODUCTS[0].variants[0],
        quantity: 1,
        price: 28900
      }
    ],
    shippingAddress: {
      id: 'addr-1',
      name: 'Anantha Rao',
      street: '74 Lavelle Road, Richmond Town',
      apartment: 'Suite 402, Crescent Manor',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
      phone: '+91 98451 23098',
      isDefault: true
    },
    subtotal: 28900,
    discount: 2890,
    shippingFee: 0,
    tax: 1300.50,
    total: 27310.50,
    status: 'Shipped',
    paymentMethod: 'Razorpay Test',
    paymentId: 'pay_test_992134568',
    courierName: 'Blue Dart Luxury Express',
    trackingNumber: 'BD-884219482IN',
    timeline: [
      { status: 'Confirmed', label: 'Order Confirmed', date: '09 Sep 2026, 11:20 AM', completed: true },
      { status: 'Processing', label: 'Atelier Inspection & Packing', date: '10 Sep 2026, 03:45 PM', completed: true },
      { status: 'Shipped', label: 'Dispatched via Blue Dart Luxury', date: '11 Sep 2026, 09:10 AM', completed: true, current: true, description: 'Package in transit to delivery hub: Bengaluru Central.' },
      { status: 'Out for Delivery', label: 'Out for Delivery', completed: false, description: 'Expected delivery by tomorrow afternoon.' },
      { status: 'Delivered', label: 'Delivered to Recipient', completed: false }
    ],
    canCancel: false,
    canReturn: true,
    createdAt: '2026-09-09T11:20:00Z'
  }
];

export const INITIAL_PROMOS: PromoCode[] = [
  { code: 'AARU10', discountPercent: 10, minOrderValue: 10000, description: '10% off your inaugural AARU order', isActive: true },
  { code: 'SIXTHELEMENT', discountPercent: 15, maxDiscount: 5000, minOrderValue: 25000, description: '15% privilege discount on Sixth Element Collection', isActive: true },
  { code: 'FESTIVE20', discountPercent: 20, minOrderValue: 35000, description: '20% off high-festive celebratory weaves', isActive: true }
];

export const LOOKBOOK_ITEMS = [
  {
    id: 'look-1',
    title: 'The Sovereign Drape',
    subtitle: 'Kavya Banarasi Saree styled with beaten antique temple jewelry',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
    tagline: 'An ode to timeless grace',
    productId: 'prod-001',
    productName: 'Kavya Emerald Banarasi Tissue Saree',
    price: '₹28,900'
  },
  {
    id: 'look-2',
    title: 'Poetry in Organza',
    subtitle: 'Noor Pale Rose Saree with pearl drop veil',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85',
    tagline: 'Ethereal lightness for twilight celebrations',
    productId: 'prod-002',
    productName: 'Noor Pale Rose Organza Saree',
    price: '₹26,800'
  },
  {
    id: 'look-3',
    title: 'The Atelier Legacy',
    subtitle: 'Six-Fold Midnight Kanjeevaram with handcrafted bullion tassels',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85',
    tagline: 'Precision engineered by founder Moni',
    productId: 'prod-003',
    productName: 'Atelier Moni Six-Fold Midnight Kanjeevaram',
    price: '₹39,500'
  }
];

export const FAQS = [
  {
    category: 'Ordering & Customisation',
    question: 'How does AARU’s Customised Clothing service work?',
    answer: 'Our bespoke atelier service allows you to customize sarees, bridal lehengas, Anarkali gowns, and blouses. After submitting your measurements and fabric choices online, our master patternmaker will review your specifications. You can also chat directly with our atelier stylist via WhatsApp for consultations and embroidery samples.'
  },
  {
    category: 'Fabric & Craft',
    question: 'Are all AARU sarees handwoven with authentic natural fibers?',
    answer: 'Yes. Every drape is certified 100% natural silk, fine cotton, or pure organza, directly woven on traditional pit and jacquard looms by registered master weavers across Varanasi, Kanchipuram, and Chanderi. We provide Silk Mark certifications with all heirloom sarees.'
  },
  {
    category: 'Shipping & Delivery',
    question: 'What is the dispatch timeline for Ready to Ship items?',
    answer: 'Items tagged "Ready to Ship" and "Sarees – Ready to Ship" are already inspected, finished with complimentary fall and pico, and packaged in our atelier. They are dispatched within 24 to 48 hours via express courier with real-time tracking.'
  },
  {
    category: 'Payments & Security',
    question: 'What payment methods are supported and is it secure?',
    answer: 'We support all major payment modes including UPI (Google Pay, PhonePe), Net Banking, International Credit/Debit Cards, and Razorpay. All transactions are 256-bit SSL encrypted with server-side signature verification to prevent duplicate deductions.'
  },
  {
    category: 'Returns & Alterations',
    question: 'What is AARU’s exchange and return policy?',
    answer: 'Unworn catalog items with security tags intact can be returned or exchanged within 7 days of receipt. Made-to-measure customized clothing and bridal pieces include complimentary fitting adjustments at our atelier.'
  }
];

export const INITIAL_COUPONS: PromoCode[] = [
  {
    id: 'coup-001',
    code: 'AARU10',
    discountPercent: 10,
    minOrderValue: 0,
    description: '10% privilege discount on all signature handloom weaves',
    isActive: true,
    usageCount: 18,
    createdAt: '2026-09-01T10:00:00Z'
  },
  {
    id: 'coup-002',
    code: 'SILK5',
    discountPercent: 5,
    minOrderValue: 0,
    description: '5% welcome privilege across ready-to-ship silks',
    isActive: true,
    usageCount: 29,
    createdAt: '2026-09-05T12:00:00Z'
  },
  {
    id: 'coup-003',
    code: 'FESTIVE20',
    discountPercent: 20,
    minOrderValue: 15000,
    description: '20% festive celebratory discount on orders above ₹15,000',
    isActive: true,
    usageCount: 12,
    createdAt: '2026-09-08T09:00:00Z'
  },
  {
    id: 'coup-004',
    code: 'ROYAL15',
    discountPercent: 15,
    minOrderValue: 25000,
    description: '15% off royal bridal handlooms above ₹25,000',
    isActive: false,
    usageCount: 0,
    createdAt: '2026-09-10T15:30:00Z'
  }
];

export const initialProducts = INITIAL_PRODUCTS;
export const categories = CATEGORIES;
export const collections = COLLECTIONS;
export const defaultAnnouncement = INITIAL_ANNOUNCEMENT;
export const sampleOrders = INITIAL_ORDERS;
export const initialCoupons = INITIAL_COUPONS;


