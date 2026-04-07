import React, { useState, useEffect } from 'react';
import { CartProvider } from './store/CartContext';
import CheckoutHeaderV9 from '../../components/legos/Shop/CheckoutHeaderV9';
import CartOverlayV9 from '../../components/legos/Shop/CartOverlayV9';
import ProductCardV9 from '../../components/legos/Shop/ProductCardV9';

/**
 * Webshop Boilerplate (V9.2)
 * Demo structure showing the combination of SiteType and Shop-Legos.
 */
export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Athena Standard: Loading products from data/products.json
  useEffect(() => {
    fetch('/data/products.json')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load products", err);
        setLoading(false);
      });
  }, []);

  return (
    <CartProvider siteId="demo_shop">
      <div className="min-h-screen bg- midnight text-white font-sans selection:bg-blue-500/30">
        
        {/* Navigation & Overlays */}
        <CheckoutHeaderV9 data={{ logo_text: 'ATHENA LUXURY' }} />
        <CartOverlayV9 />

        {/* Content */}
        <main className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            
            {/* Header Section */}
            <div className="mb-12 space-y-4">
              <h2 className="text-sm font-mono text-blue-500 uppercase tracking-[0.3em]">Exclusive Collection</h2>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">New Arrivals</h1>
              <p className="text-zinc-500 max-w-xl">
                Ontdek onze nieuwste toevoegingen aan de collectie. Elk stuk is zorgvuldig geselecteerd voor de moderne technofiel.
              </p>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse text-zinc-800">
                {[1, 2, 3].map(i => <div key={i} className="aspect-[4/5] bg-zinc-900 rounded-2xl"></div>)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.length > 0 ? (
                  products.map(product => (
                    <ProductCardV9 key={product.id} data={product} />
                  ))
                ) : (
                  <p className="text-zinc-500 font-mono">Geen producten gevonden...</p>
                )}
              </div>
            )}

          </div>
        </main>

        {/* Footer */}
        <footer className="py-10 border-t border-white/5 text-center px-6">
          <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest">
            &copy; 2026 Athena Enterprise &middot; Design by Antigravity
          </p>
        </footer>

      </div>
    </CartProvider>
  );
}
