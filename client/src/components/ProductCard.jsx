import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

/**
 * Premium Product Card
 * Features:
 * - "Stage" layout for image (bg-gray-50)
 * - Object-contain for perfect image visibility
 * - Hover zoom effect
 * - Clean typography
 */
export default function ProductCard({ product }) {
    const { addItemToBasket } = useStore();

    // Guard Clause to prevent crash if product is missing
    if (!product) return null;

    // Helper to get full image URL
    const getImageUrl = (url) => {
        if (!url) return "https://placehold.co/400x300";
        if (url.startsWith('http')) return url;
        // Prepend API Base URL (assumed from env or default)
        const baseUrl = import.meta.env.VITE_API_URL || 'https://localhost:7250/';
        return `${baseUrl}${url}`;
    };

    return (
        <div className="group bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)] transition-all duration-300 border border-gray-100 flex flex-col h-full overflow-hidden">

            {/* The Image Stage */}
            <Link to={`/shop/${product.id}`} className="relative h-[280px] bg-gray-50 overflow-hidden flex items-center justify-center p-6 group-hover:bg-gray-100 transition-colors duration-300">
                <img
                    src={getImageUrl(product.pictureUrl)}
                    alt={product.name || "Product"}
                    className="w-full h-full object-contain object-center transform group-hover:scale-110 transition-transform duration-500 ease-out will-change-transform drop-shadow-sm"
                    loading="lazy"
                    onError={(e) => { e.target.src = "https://placehold.co/400x300?text=No+Image"; }}
                />

                {/* Sale Badge */}
                {product.price < 50 && (
                    <div className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm tracking-wide uppercase">
                        Sale
                    </div>
                )}

                {/* Quick Add Overlay (Desktop) */}
                <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            addItemToBasket(product);
                        }}
                        className="bg-white text-gray-900 w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-primary hover:text-white transition-colors"
                        title="Quick Add"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </Link>

            {/* Info Section */}
            <div className="p-5 flex flex-col flex-1 bg-white">
                <div className="mb-1">
                    <Link to={`/shop/${product.id}`} className="text-gray-900 font-bold text-lg leading-tight hover:text-primary transition-colors line-clamp-1">
                        {product.name || 'Product Name'}
                    </Link>
                </div>

                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    {product.brand || 'Brand'}
                </div>

                <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed opacity-80 min-h-[2.5rem]">
                    {product.description || product.category || 'No description available for this amazing product.'}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Price</span>
                        <div className="flex items-center">
                            <span className="text-xl font-bold text-gray-900">${product.price?.toFixed(2) || '0.00'}</span>
                            {product.price < 50 && (
                                <span className="text-xs text-gray-400 line-through ml-2 decoration-2">${((product.price || 0) * 1.2).toFixed(2)}</span>
                            )}
                        </div>
                    </div>

                    {/* Mobile-friendly Add Button (Visible always or distinct from hover) */}
                    <button
                        className="md:hidden bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-primary hover:text-white transition-colors"
                        onClick={(e) => {
                            e.preventDefault();
                            addItemToBasket(product);
                        }}
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}
