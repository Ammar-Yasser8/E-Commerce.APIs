import React, { useEffect, useState } from 'react';
import agent from '../api/agent';
import ProductCard from '../components/ProductCard';
import ShopSidebar from '../components/ShopSidebar';

export default function ShopPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [brands, setBrands] = useState([]);
    const [types, setTypes] = useState([]);

    // Filter States
    const [brandId, setBrandId] = useState(0);
    const [typeId, setTypeId] = useState(0);
    const [sort, setSort] = useState('name');
    const [search, setSearch] = useState('');
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(6); // Default page size
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const brandsRes = await agent.Products.brands();
                const typesRes = await agent.Products.types();
                setBrands([{ id: 0, name: 'All' }, ...brandsRes]);
                setTypes([{ id: 0, name: 'All' }, ...typesRes]);
            } catch (e) {
                console.log(e);
            }
        }
        fetchFilters();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = {
                    pageIndex,
                    pageSize,
                    sort,
                    search: search || undefined, // Send undefined if empty to avoid backend issues
                    brandId: brandId > 0 ? brandId : undefined,
                    categoryId: typeId > 0 ? typeId : undefined // Backend uses CategoryId
                };

                const response = await agent.Products.list(params);
                // Adjust based on actual API response structure (pagination wrapper vs direct array)
                // Assuming response structure might be { data: [], count: 0, pageIndex: 1, pageSize: 6 }
                // or just the array if standard list. Let's assume standard wrapper is missing and check response.
                // If response.data is the array:
                if (response.data) {
                    setProducts(response.data);
                    setTotalCount(response.count); // If API returns count
                } else {
                    // Fallback if response itself is the wrapper (common in some patterns)
                    setProducts(response.data || response);
                }
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [pageIndex, pageSize, sort, brandId, typeId, search]);

    const handleSearch = (event) => {
        setSearch(event.target.value);
        setPageIndex(1);
    };

    const handleSort = (event) => {
        setSort(event.target.value);
    };

    const handleBrandChange = (id) => {
        setBrandId(id);
        setPageIndex(1);
    };

    const handleTypeChange = (id) => {
        setTypeId(id);
        setPageIndex(1);
    };

    const handleReset = () => {
        setBrandId(0);
        setTypeId(0);
        setSort('name');
        setSearch('');
        setPageIndex(1);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
                <ShopSidebar
                    sort={sort}
                    onSortChange={handleSort}
                    brands={brands}
                    brandId={brandId}
                    onBrandChange={handleBrandChange}
                    types={types}
                    typeId={typeId}
                    onTypeChange={handleTypeChange}
                    onReset={handleReset}
                />
            </div>

            <div className="md:col-span-3">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <h2 className="text-2xl font-bold text-secondary">Shop Output</h2>

                    <div className="relative w-full md:w-auto md:min-w-[300px]">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={handleSearch}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <div className="mb-4 text-gray-500 text-sm font-medium">
                    {totalCount > 0 ? `Showing ${(pageIndex - 1) * pageSize + 1} - ${Math.min(pageIndex * pageSize, totalCount)} of ${totalCount} results` : 'No results found'}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-xl">
                        <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                        <button onClick={handleReset} className="mt-4 text-primary font-semibold hover:underline">Clear Filters</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalCount > 0 && (
                    <div className="mt-12 flex items-center justify-center gap-4">
                        <button
                            disabled={pageIndex === 1}
                            onClick={() => setPageIndex(prev => prev - 1)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 hover:text-primary hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                            Previous
                        </button>

                        <div className="flex items-center gap-1">
                            {/* Simple page indicator - can be expanded to full pagination logic later */}
                            <span className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-bold shadow-md">
                                {pageIndex}
                            </span>
                        </div>

                        <button
                            disabled={products.length < pageSize && (pageIndex * pageSize) >= totalCount}
                            onClick={() => setPageIndex(prev => prev + 1)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 hover:text-primary hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            Next
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
