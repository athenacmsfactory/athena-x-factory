# 🧱 Athena V9.2 Lego Registry (Batch 1)

Dit document registreert de eerste officiële set van herbruikbare UI-secties ("Legoblokken") voor de Athena V9.2 engine, geoptimaliseerd voor de **Modern Midnight Tech** esthetiek.

## 🎨 Design System: Modern Midnight Tech
- **Primary Color**: `#6366f1` (Indigo-500)
- **Secondary Color**: `#1e293b` (Slate-800)
- **Background**: `#020024` (Deep Midnight Blue)
- **Text (Content)**: `'JetBrains Mono', monospace` (Tech/Monospace vibe)
- **Text (Buttons)**: `'Inter', sans-serif` (Strakke, vette labels)
- **Buttons**: Linear Gradient (`#6366f1` to `#a855f7`), rounded-md, shadow-lg.

---

## 📦 Geregistreerde Legoblokken

### 1. `HeroLegoV9`
- **Doel**: High-impact introductie met achtergrondafbeelding.
- **Visuals**: 
  - Robuuste `<img>` tag layering voor gegarandeerde visibility.
  - Subtiele gradient overlay van links naar rechts.
  - Grote typografie (`text-7xl`) in uppercase.
- **Props**: `hoofdtitel`, `ondertitel`, `knop_tekst`, `knop_link`, `afbeelding`.

### 2. `BenefitsLegoV9` (Our Features)
- **Doel**: Overzicht van diensten of voordelen in een grid.
- **Visuals**:
  - Cards met achtergrond `#1e293b` en border `#334155`.
  - Kleine afbeelding thumbnails (`w-24 h-14`) links uitgelijnd.
  - Titels in Indigo `#818cf8` (Normal Case).
  - Grotere body tekst (`text-xl`) voor maximale leesbaarheid.
- **Props**: `sectie_titel`, `items` (Array: `titel`, `tekst`, `icoon`, `afbeelding`).

### 3. `TextLegoV9` (Over Ons)
- **Doel**: Grote tekstblokken of storytelling secties.
- **Visuals**:
  - Centraal uitgelijnde, minimalistische typografie.
  - Geen achtergrond glows (strak midnight).
- **Props**: `sectie_titel`, `tekst`.

### 4. `ContactLegoV9` (Webform)
- **Doel**: Lead generatie en contactopname.
- **Visuals**:
  - "Onzichtbare" inputs (bg-transparent, border-slate-800).
  - Geen zware kaartranden om het formulier.
  - Verzendknop in sans-serif `Inter` font.
- **Interactie**: Ingebouwde `sending` en `success` states met animaties.

### 5. `ContactInfoLegoV9`
- **Doel**: Directe weergave van bedrijfsgegevens.
- **Visuals**:
  - Grote, vette monospaced tekst voor directe autoriteit.
- **Props**: `email`, `phone`, `address`.

---

## 🛒 Webshop Batch (Nieuw: 7 April 2026)

De webshop componenten zijn ontworpen voor high-end e-commerce met directe Firebase en Stripe integratie.

### 6. `ProductCardV9`
- **Doel**: Weergave van een enkel product met "Add to Cart" actie.
- **Visuals**: Glassmorphism card, hover-zoom op productafbeelding, blauwe accenten.
- **Props**: `product_name`, `product_price`, `product_image`, `product_category`.

### 7. `CartOverlayV9`
- **Doel**: Slide-out winkelmandje met live Firestore synchronisatie.
- **Visuals**: Donkere transparante overlay, geanimeerde itemlijst, checkout-knop.
- **Props**: Geen (gebruikt `CartContext`).

### 8. `CheckoutHeaderV9`
- **Doel**: Navigatiebalk voor webshops met live cart-teller en auth status.
- **Visuals**: Glassmorphism nav met logo en cart icon.
- **Props**: `logo_text`.

---

## 🚀 Implementatie Details
- **Framework**: React 19
- **Styling**: Tailwind CSS v4.2+
- **Database**: Firebase Firestore (Carts/Orders)
- **Betalingssysteem**: Stripe Checkout
- **Playground**: `skeletons/webshop/App.jsx`

*Vastgelegd op 7 april 2026 voor Athena V9.2 Core.*
