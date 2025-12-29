import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import agent from '../api/agent';

export default function OrderDetailsPage() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        agent.Orders.details(id)
            .then(order => setOrder(order))
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="text-center mt-20">Loading order...</div>;
    if (!order) return <div className="text-center mt-20">Order not found</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-secondary">Order #{order.id}</h1>
                <Link to="/orders" className="text-primary hover:underline">Back to Orders</Link>
            </div>

            <div className="bg-surface shadow rounded-lg p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Order Status: <span className="text-primary">{order.status}</span></h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h3 className="font-semibold">Shipping Address</h3>
                        <p>{order.shipToAddress.firstName} {order.shipToAddress.lastName}</p>
                        <p>{order.shipToAddress.street}</p>
                        <p>{order.shipToAddress.city}, {order.shipToAddress.state} {order.shipToAddress.zipCode}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Payment Info</h3>
                        <p>Total: ${order.total.toFixed(2)}</p>
                        <p>Shipping: ${order.shippingPrice.toFixed(2)}</p>
                        <p>Subtotal: ${order.subtotal.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            <div className="bg-surface shadow rounded-lg overflow-hidden">
                <ul className="divide-y divide-gray-200">
                    {order.orderItems.map((item) => (
                        <li key={item.productId} className="p-4 flex items-center">
                            <img src={item.pictureUrl} alt={item.productName} className="h-20 w-20 object-cover rounded" />
                            <div className="ml-4 flex-1">
                                <h3 className="font-bold">{item.productName}</h3>
                                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                <p className="text-sm font-medium">${item.price.toFixed(2)}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
