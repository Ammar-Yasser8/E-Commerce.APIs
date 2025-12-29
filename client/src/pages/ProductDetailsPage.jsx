import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import agent from '../api/agent';
import { useStore } from '../context/StoreContext';

export default function ProductDetailsPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { addItemToBasket } = useStore();

    useEffect(() => {
        if (id) {
            agent.Products.details(id)
                .then(response => setProduct(response))
                .catch(error => console.log(error))
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleAddItem = () => {
        if (product) {
            addItemToBasket(product, quantity);
        }
    }

    const handleInputChange = (event) => {
        const value = parseInt(event.target.value);
        if (value > 0) {
            setQuantity(value);
        }
    }

    if (loading) return <div className="text-center mt-20 text-xl">Loading...</div>;
    if (!product) return <div className="text-center mt-20 text-xl text-error">Product not found</div>;

    return (
        <div className="bg-surface rounded-lg shadow-lg p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {/* Image Section */}
                <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-100">
                    <img
                        src={product.pictureUrl || "https://placehold.co/600x400"}
                        alt={product.name}
                        className="w-full h-full object-cover object-center"
                    />
                </div>

                {/* Details Section */}
                <div className="flex flex-col justify-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">{product.name}</h1>
                    <p className="text-xl text-primary font-bold mb-4">${product.price.toFixed(2)}</p>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-secondary mb-2">Description</h3>
                        <p className="text-gray-600 leading-relaxed">{product.description}</p>
                    </div>

                    <div className="mb-6">
                        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                            {product.brand}
                        </span>
                        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                            {product.category}
                        </span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="w-24">
                            <label htmlFor="quantity" className="sr-only">Quantity</label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                min="1"
                                value={quantity}
                                onChange={handleInputChange}
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2 border"
                            />
                        </div>
                        <button
                            onClick={handleAddItem}
                            className="flex-1 bg-primary text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-orange-600 transition-colors duration-200"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
