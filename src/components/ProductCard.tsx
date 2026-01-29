import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onCook?: (productName: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onCook }) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'red': return 'bg-red-100 text-red-600 border-red-200';
      case 'yellow': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'green': return 'bg-green-100 text-green-600 border-green-200';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'red': return 'Crítico';
      case 'yellow': return 'Atención';
      case 'green': return 'Óptimo';
      default: return 'Normal';
    }
  };

  return (
    <div className="group bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all border border-slate-100 flex flex-col justify-between h-48 relative overflow-hidden">
      <div className="space-y-1 z-10">
        <div className="flex justify-between items-start">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {product.category || 'General'}
          </span>
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusStyles(product.status)}`}>
            {getStatusLabel(product.status)}
          </span>
        </div>
        <h3 className="text-xl font-bold text-slate-800 capitalize truncate">
          {product.name}
        </h3>
        <p className="text-sm text-slate-500">
          Vence en {product.days_left} días
        </p>
      </div>

      <div className="mt-4 flex gap-2 z-10">
        {product.status === 'red' && onCook && (
          <button 
            onClick={() => onCook(product.name)}
            className="flex-1 bg-gradient-to-r from-orange-400 to-pink-500 text-white py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:opacity-90 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Cocinar
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
