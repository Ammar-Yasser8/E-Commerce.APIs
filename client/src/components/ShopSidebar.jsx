import React from 'react';

export default function ShopSidebar({
    sort,
    onSortChange,
    brands,
    brandId,
    onBrandChange,
    types,
    typeId,
    onTypeChange,
    onReset
}) {
    return (
        <div className="space-y-8">
            {/* Sort Section */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 text-lg mb-4 uppercase tracking-wider border-b pb-2">Sort By</h3>
                <div className="space-y-2">
                    {[
                        { value: 'name', label: 'Alphabetical' },
                        { value: 'priceAsc', label: 'Price: Low to High' },
                        { value: 'priceDesc', label: 'Price: High to Low' },
                    ].map((option) => (
                        <label key={option.value} className="flex items-center space-x-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${sort === option.value ? 'border-primary' : 'border-gray-300 group-hover:border-primary'}`}>
                                {sort === option.value && <div className="w-3 h-3 rounded-full bg-primary" />}
                            </div>
                            <span className={`text-sm transition-colors ${sort === option.value ? 'text-primary font-medium' : 'text-gray-600 group-hover:text-primary'}`}>
                                {option.label}
                            </span>
                            <input
                                type="radio"
                                name="sort"
                                value={option.value}
                                checked={sort === option.value}
                                onChange={onSortChange}
                                className="hidden"
                            />
                        </label>
                    ))}
                </div>
            </div>

            {/* Brands Section */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 text-lg mb-4 uppercase tracking-wider border-b pb-2">Brands</h3>
                <div className="flex flex-wrap gap-2">
                    {brands.map(brand => (
                        <button
                            key={brand.id}
                            onClick={() => onBrandChange(brand.id)}
                            className={`px-3 py-1.5 text-sm rounded-full transition-all duration-200 border ${brandId === brand.id
                                ? 'bg-primary text-white border-primary shadow-md transform scale-105'
                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
                                }`}
                        >
                            {brand.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Types Section */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 text-lg mb-4 uppercase tracking-wider border-b pb-2">Categories</h3>
                <div className="space-y-1">
                    {types.map(type => (
                        <div
                            key={type.id}
                            onClick={() => onTypeChange(type.id)}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${typeId === type.id
                                ? 'bg-orange-50 text-primary font-medium border-l-4 border-primary'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                                }`}
                        >
                            <span>{type.name}</span>
                            {typeId === type.id && (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Reset Filters */}
            <button
                onClick={onReset}
                className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-gray-600 font-medium hover:bg-gray-50 hover:text-red-500 hover:border-red-500 transition-all flex items-center justify-center gap-2"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filters
            </button>
        </div>
    );
}
