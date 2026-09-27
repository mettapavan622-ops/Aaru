# Implementation Plan - Styling Update, User State Hydration & Admin Synchronization

Implement secure, production-ready solutions for the four requested user requirements:
1. **Global Styling Update**: Eliminate custom serif old-style figures across all prices and numbers, replacing with clean modern lining numerals.
2. **New User Registration State**: Initialize session correctly with explicitly empty `cart: []` and `wishlist: []` in the database, ensuring clean zero-state on initial login.
3. **Existing User Data Hydration**: Immediately hydrate authenticated users with their specific persisted cart, wishlist, and order history from the server upon token validation.
4. **Admin-to-User Data Synchronization**: Implement real-time catalog synchronization (Server-Sent Events + BroadcastChannel + version polling) so any admin product addition, update, or deletion reflects instantly across all user-facing dashboards.

---

## User Review Required

> [!IMPORTANT]
> No breaking changes to existing accounts or API contracts. New users will now start with a clean empty cart, wishlist, and order history, while existing patrons (like Aditi Sharma) immediately load their saved items and past orders.

---

## Proposed Changes

### 1. Global Styling Update: Number & Price Fonts
- In `src/index.css`:
  - Enforce `font-variant-numeric: lining-nums tabular-nums` and `font-feature-settings: "lnum" 1` across `:root`, `body`, `.font-serif`, `.font-cinzel`, and `.font-sans` to banish dropping old-style medieval numerals.
  - Define `.font-price`, `.font-num` utility classes explicitly mapped to `Plus Jakarta Sans` (`font-sans`) with lining numerals.
- In `src/components/admin/AdminDashboard.tsx`:
  - Replace `font-serif` with `font-sans` on revenue metrics (`₹{totalRevenue}`) and order counts.
- In `src/components/ProductDetailPage.tsx`:
  - Replace `font-serif` on price display (`₹{product.price}`, `₹{product.salePrice}`) with `font-sans font-bold`.
- In `src/components/CheckoutModal.tsx`, `src/components/CartDrawer.tsx`, `src/components/HeroBanner.tsx`, `src/components/ShopTheLook.tsx`, `src/components/AuthScreen.tsx`:
  - Replace `font-serif` on prices, subtotal/total rows, and OTP code inputs with clean `font-sans` / `font-mono`.

### 2. New User Registration State
- In `server.ts`:
  - Update `DbUser` interface to include `cart: CartItem[]` and `wishlist: string[]`.
  - In `handleManualSignUpRoute`, `/api/auth/signup/verify-otp`, and `/api/auth/google`, explicitly initialize `cart: []` and `wishlist: []`.
  - Return `{ user, cart: [], wishlist: [], orders: [] }` on initial registration.
- In `src/App.tsx`:
  - Remove hardcoded sample cart item and hardcoded wishlist item from initial state.
  - On new user registration, ensure `cartItems = []`, `wishlistProductIds = []`, and `orders = []`.

### 3. Existing User Data Hydration
- In `server.ts`:
  - Update `POST /api/auth/login`, `/api/auth/signup/*`, and `GET /api/auth/me` to return `{ authenticated: true, user, cart, wishlist, orders }`.
  - Add authenticated endpoints `GET /api/user/data`, `POST /api/user/cart`, and `POST /api/user/wishlist` with secure session token validation.
  - In `POST /api/orders`, associate new orders with `user.id` and `user.email`, clearing the user's active cart.
- In `src/App.tsx` & `src/components/AuthScreen.tsx`:
  - On login or session restore, validate token against `/api/auth/me` or `/api/user/data` and immediately hydrate `setCartItems`, `setWishlistProductIds`, and `setOrders`.
  - Persist user cart and wishlist updates to the backend when logged in.
  - On logout, clear cart, wishlist, and orders from client memory.

### 4. Admin-to-User Data Synchronization
- In `server.ts`:
  - Track `catalogVersion = Date.now()`.
  - Provide `GET /api/products/stream` (Server-Sent Events) and `GET /api/products/version`.
  - Whenever an admin creates (`POST /api/products`), updates (`PUT /api/products/:id`), or deletes (`DELETE /api/products/:id`), increment `catalogVersion` and broadcast the new product catalog to all connected SSE clients.
- In `src/App.tsx`:
  - Connect to `/api/products/stream` via `EventSource` with auto-reconnect.
  - Listen on `BroadcastChannel('aaru_catalog_sync')` for immediate cross-tab synchronization.
  - Fallback: poll `/api/products/version` periodically and refetch on window focus.
  - When updated catalog arrives, seamlessly update `products`, refresh PDP if the active product changed, and remove deleted items from cart/wishlist if applicable.

---

## Security Threat Model

### Entry Points & Untrusted Inputs
1. `GET /api/auth/me` & `GET /api/user/data`: Session token from `Authorization` header or `aaru_session` cookie. Untrusted token input must be parsed safely, verified, and not susceptible to prototype pollution or injection.
2. `POST /api/user/cart` & `POST /api/user/wishlist`: Cart items and wishlist IDs submitted by client. Validate structure, enforce array boundaries, sanitize strings, and disallow malicious object keys.
3. `POST/PUT/DELETE /api/products`: Admin routes. Restrict product mutation strictly to verified users with `role: 'admin'`. Prevent unauthorized patrons or unauthenticated callers from modifying the catalog.
4. `GET /api/products/stream`: SSE endpoint. Ensure connections are handled cleanly with proper heartbeat and cleanup on client disconnect to prevent connection exhaustion.

### Trust Boundaries & Auth Enforcement
- Customers can only read and mutate their own cart, wishlist, and orders.
- User identity is determined strictly by the cryptographically verified session token, never by trusting client-provided `userId` in the request body.
- Admin catalog mutations require verified admin session credentials.

---

## Verification Plan

### Security Verification
- **Security Scan**: Inspect all newly created and modified files for CWE vulnerabilities (improper authorization, token tampering, broken access control, XSS, prototype pollution).
- **Security Audit**: Audit implementation against the threat model and document findings and remediations in `walkthrough.md` using the `generate-security-audit-report` skill.
- **PoC Verification**: Validate using `run-poc` that unauthorized product mutations and cross-user data access are blocked.

### Functional Verification
1. Verify number and price typography: Inspect CSS rules and component classes ensuring no old-style falling numerals appear.
2. Verify new user registration: Sign up a new user; check that DB stores `cart: []` and `wishlist: []`, and frontend initializes in a pristine empty state.
3. Verify existing user hydration: Sign in as Aditi Sharma; verify cart, wishlist, and order history hydrate immediately from the backend.
4. Verify admin synchronization: Create, update, and delete a product via admin portal; verify that public catalog and user dashboards update immediately via SSE and broadcast sync.
