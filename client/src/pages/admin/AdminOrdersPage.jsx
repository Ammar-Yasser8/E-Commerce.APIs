import React, { useEffect, useState } from 'react';
import agent from '../../api/agent';
import { Link } from 'react-router-dom';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = () => {
        agent.Orders.listAll()
            .then(orders => setOrders(orders))
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    };

    const handleStatusUpdate = (id, newStatus) => {
        // Optimistic update or waiting? Let's wait
        agent.Orders.updateStatus(id, newStatus)
            .then(updatedOrder => {
                setOrders(orders.map(o => o.id === id ? updatedOrder : o));
            })
            .catch(error => console.log(error));
    };

    if (loading) return <div className="text-center mt-20">Loading orders...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-secondary">Manage Orders</h1>
                <Link to="/admin" className="text-primary hover:underline">Back to Dashboard</Link>
            </div>

            <div className="bg-surface shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.buyerEmail}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.total.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                            order.status === 'PaymentReceived' ? 'bg-green-100 text-green-800' :
                                                order.status === 'PaymentFailed' ? 'bg-red-100 text-red-800' :
                                                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    {order.status !== 'Shipped' && (
                                        <button onClick={() => handleStatusUpdate(order.id, 'Shipped')} className="text-indigo-600 hover:text-indigo-900">Mark Shipped</button>
                                    )}
                                    {/* Add logic for other statuses or a dropdown if needed */}
                                    <Link to={`/orders/${order.id}`} className="text-gray-600 hover:text-gray-900 ml-2">View</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
