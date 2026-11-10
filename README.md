# HABRENOIR · Maison de Haute Maroquinerie (MERN Stack)
*Paris · Vienna · Atelier Scandicci Firenze*

Luxury European fashion catalog and PDP modeled after Gucci's European layout architecture, built with the **MERN stack (MongoDB, Express.js, React 19, Node.js)**, **Vite**, **Tailwind CSS**, and **Paystack** payment integration.

---

## 🏛️ Architecture & Requirements Compliance

### 1. Architecture Refactoring
- **Zero Border Radius (`rounded-none`)**: All card containers, drawers, buttons, product frames, and swatches adhere strictly to a 0px right-angle geometry (`border-radius: 0 !important`).
- **Zero Box-Shadows (`shadow-none`)**: Complete removal of artificial drop shadows or blurry elevation (`box-shadow: none !important`). Visual hierarchy and structural definition are established using hairline borders (`border: 1px solid #E8E3DC`).
- **Cream / White Background Split**:
  - `#F9F8F6`: Atelier canvas base background (warm natural linen and archival paper feel).
  - `#FFFFFF`: Studio white museum plinths for high-contrast product image isolation.
- **High-Contrast Serif & Tracked Sans Typography**:
  - Headings & Monogram: High-contrast vertical serif (**Playfair Display**, **Cormorant Garamond**).
  - Metadata, Filters, Pricing & SKUs: Tracked uppercase sans (**Inter**, **Syne**, **Space Grotesk** with `tracking-[0.18em]` to `tracking-[0.26em]`).

### 2. Dynamic Component State
- **Responsive Filter Drawer Component (+ Filter & Refine)**:
  - Triggered via the `+ FILTER & REFINE` button.
  - Faceted filters for **Category** (Top Handle, Shoulder Bags, Totes & Clutches, Clutches & Minaudières).
  - Filters for **Leather Colorway** (sharp 0px square swatches for Bordeaux Profond `#3D0C15`, Noir Florentin `#140002`, Crème Calcaire `#FEDEB2`, Espresso Moro `#281800`, Camel Suede `#725B38`).
  - Filters for **Silhouette & Size** (Petite, Medium, Grande).
  - Filter for **Price Bracket** (interactive slider up to €5,000).
  - Active filter strip with instant item removal `(×)` and one-click global reset.
- **Product Atelier Detail Page (PDP) - Gucci European Layout Architecture**:
  - **Sticky Right-Column Scrolling** (`lg:sticky lg:top-24 lg:self-start`): Pinned right column remains in view as the customer scrolls through the extensive gallery and macro craftsmanship imagery on the left.
  - **Synchronized Image Gallery**: Primary viewport on pure white isolated plinth, 5-view craftsmanship carousel with active counter (`01 / 05`), and vertical editorial cascade showcasing macro details (saddle stitching, lambskin nappa lining, palladium hardware).
- **Shopping Bag State Management & Paystack Checkout**:
  - Reactive `CartContext` state persisted across page reloads via `localStorage`.
  - Luxury slide-over drawer with line items, quantity controls, subtotal, complimentary white-glove courier notice, and VAT calculation.
  - **Secure Paystack Checkout** button connected to backend endpoints `/api/checkout/initialize` & `/api/checkout/verify/:reference`, with inline Paystack Popup integration (`https://js.paystack.co/v2/inline.js`).

---

## 🚀 Quick Start Guide

### 1. Start the Express Backend API
```bash
cd server
npm install
npm run dev
```
*The server listens on [http://localhost:5000](http://localhost:5000). If a local MongoDB instance is not detected, it automatically switches to the high-performance in-memory cache for catalog and orders.*

### 2. Start the React Frontend (Vite)
```bash
cd client
npm install
npm run dev
```
*The application is served at [http://localhost:5173](http://localhost:5173).*

### 3. Run Concurrently from the Root
```bash
npm run dev
```

---

## 💳 Paystack Configuration

Configure your API credentials in [server/.env](file:///c:/Users/kofia/OneDrive/Desktop/Habrenoir/server/.env):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/habrenoir
PAYSTACK_SECRET_KEY=sk_test_your_secret_key
PAYSTACK_PUBLIC_KEY=pk_test_your_public_key
CLIENT_URL=http://localhost:5173
```
*(In sandbox/offline mode without live keys, a high-fidelity modal simulation runs automatically so you can test the full checkout flow end-to-end).*
