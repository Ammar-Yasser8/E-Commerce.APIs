import React from 'react';
import { useStore } from '../context/StoreContext';
import { Link } from 'react-router-dom';

export default function BasketPage() {
    const { basket, addItemToBasket, removeItemFromBasket, loading } = useStore();

    if (loading) return <div className="text-center mt-20">Loading basket...</div>;

    if (!basket || basket.items.length === 0) {
        return (
            <div className="text-center mt-20">
                <h2 className="text-2xl font-bold mb-4">Your basket is empty</h2>
                <Link to="/shop" className="text-primary hover:underline">Go back to shop</Link>
            </div>
        );
    }

    const subtotal = basket.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    // Shipping could be calculated here or fetched. Assuming free for now or calculated at checkout.
    const shipping = 0;
    const total = subtotal + shipping;

    return (
        <div className="bg-surface rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-secondary">Shopping Basket</h2>
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3">
                    <ul className="divide-y divide-gray-200">
                        {basket.items.map(item => (
                            <li key={item.id} className="py-6 flex">
                                <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                                    <img
                                        src={item.pictureUrl || "https://placehold.co/200"}
                                        alt={item.productName}
                                        className="w-full h-full object-center object-cover"
                                    />
                                </div>

                                <div className="ml-4 flex-1 flex flex-col">
                                    <div>
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                            <h3><Link to={`/shop/${item.id}`}>{item.productName}</Link></h3>
                                            <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">{item.brand} / {item.category}</p>
                                    </div>
                                    <div className="flex-1 flex items-end justify-between text-sm">
                                        <div className="flex items-center border rounded">
                                            <button
                                                onClick={() => removeItemFromBasket(item.id, 1)}
                                                className="px-3 py-1 hover:bg-gray-100 text-gray-600"
                                            >-</button>
                                            <span className="px-3 py-1 border-l border-r font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => addItemToBasket({ id: item.id, name: item.productName, price: item.price, productBrand: item.brand, productType: item.category, pictureUrl: item.pictureUrl })}
                                                className="px-3 py-1 hover:bg-gray-100 text-gray-600"
                                            >+</button>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeItemFromBasket(item.id, item.quantity)}
                                            className="font-medium text-error hover:text-red-700 flex items-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="lg:w-1/3">
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                        <div className="flow-root">
                            <dl className="-my-4 divide-y divide-gray-200">
                                <div className="py-4 flex items-center justify-between">
                                    <dt className="text-sm text-gray-600">Subtotal</dt>
                                    <dd className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</dd>
                                </div>
                                <div className="py-4 flex items-center justify-between">
                                    <dt className="text-sm text-gray-600">Shipping</dt>
                                    <dd className="text-sm font-medium text-gray-900">${shipping.toFixed(2)}</dd>
                                </div>
                                <div className="py-4 flex items-center justify-between">
                                    <dt className="text-base font-bold text-gray-900">Total</dt>
                                    <dd className="text-base font-bold text-gray-900">${total.toFixed(2)}</dd>
                                </div>
                            </dl>
                        </div>
                        <div className="mt-6">
                            <Link
                                to="/checkout"
                                className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-orange-600"
                            >
                                Checkout
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
