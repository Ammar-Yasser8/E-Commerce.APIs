import React, { useEffect, useState } from 'react';
import agent from '../../api/agent';
import { Link } from 'react-router-dom';

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = () => {
        agent.Products.list({ pageSize: 50 }) // Fetch more for admin list
            .then(response => setProducts(response.data))
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            agent.Products.delete(id)
                .then(() => {
                    setProducts(products.filter(p => p.id !== id));
                })
                .catch(error => console.log(error));
        }
    };

    if (loading) return <div className="text-center mt-20">Loading products...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-secondary">Manage Products</h1>
                <div className="space-x-4">
                    <Link to="/admin/product/new" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-orange-600">Add New Product</Link>
                    <Link to="/admin" className="text-primary hover:underline">Back to Dashboard</Link>
                </div>
            </div>

            <div className="bg-surface shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type / Brand</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <img className="h-10 w-10 rounded-full object-cover" src={product.pictureUrl} alt={product.name} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category} / {product.brand}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                    <Link to={`/admin/product/${product.id}`} className="text-indigo-600 hover:text-indigo-900">Edit</Link>
                                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
