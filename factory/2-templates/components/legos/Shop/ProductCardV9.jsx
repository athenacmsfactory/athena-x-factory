import React from 'react';
import { useCart } from '../../../skeletons/webshop/store/CartContext';

/**
 * ProductCardV9
 * Style: Glassmorphism / Tech-Luxury
 * Features: View Details, Add-to-Cart animation, Dock-compliant data binding
 */
export default function ProductCardV9({ data = {}, bind = {} }) {
  const { addToCart } = useCart();
  const {
    id = 'prod_001',
    product_name = 'Quantum Watch',
    product_price = 249.00,
    product_image = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80',
    product_category = 'Luxury'
  } = data;

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart({ id, name: product_name, price: product_price, image: product_image });
  };

  return (
    <div 
      className="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4 transition-all duration-300 hover:bg-white/10 hover:shadow-2xl hover:-translate-y-1"
      data-dock-type="ProductCardV9"
      data-dock-id={id}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden rounded-xl mb-4">
        <img 
          src={product_image} 
          alt={product_name}
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
          data-dock-bind="product_image"
        />
        <div className="absolute top-2 right-2 px-2 py-1 bg-blue-500/80 backdrop-blur-md text-[10px] font-bold text-white uppercase rounded shadow-lg">
          {product_category}
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <h3 
          className="text-lg font-bold text-white tracking-tight leading-tight transition-colors group-hover:text-blue-400"
          data-dock-bind="product_name"
        >
          {product_name}
        </h3>
        <div className="flex items-center justify-between">
          <span 
            className="text-xl font-mono text-blue-400"
            data-dock-bind="product_price"
          >
            €{product_price.toLocaleString('nl-BE', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <button 
          onClick={handleAdd}
          className="flex-1 bg-white hover:bg-blue-500 hover:text-white text-midnight font-bold py-2 px-4 rounded-xl transition-all active:scale-95 text-sm"
          title="Add to Cart"
        >
          Add to Cart
        </button>
        <button className="p-2 border border-white/20 rounded-xl hover:bg-white/10 transition-all text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
