import React from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../layout/AdminSidebar';

export default function AdminDashboardPage() {
    // In a real app, fetch these stats from an API
    const stats = [
        { title: 'Total Revenue', value: '$12,345', color: 'bg-green-100 text-green-600' },
        { title: 'Total Orders', value: '156', color: 'bg-blue-100 text-blue-600' },
        { title: 'Total Products', value: '48', color: 'bg-orange-100 text-orange-600' },
        { title: 'Active Customers', value: '1,200', color: 'bg-purple-100 text-purple-600' },
    ];

    return (
        <div className="flex bg-background min-h-screen">
            <AdminSidebar />
            <div className="flex-1 p-8">
                <h1 className="text-3xl font-bold text-secondary mb-8">Dashboard Overview</h1>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-surface rounded-xl shadow-md p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-gray-500 font-medium">{stat.title}</h3>
                                <span className={`p-2 rounded-full ${stat.color} bg-opacity-20`}>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                    </svg>
                                </span>
                            </div>
                            <p className="text-3xl font-bold text-secondary">{stat.value}</p>
                            <p className="text-sm text-green-500 mt-2 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                                +12% from last month
                            </p>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <h2 className="text-xl font-bold text-secondary mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link to="/admin/orders" className="group block">
                        <div className="bg-surface rounded-xl shadow p-6 hover:shadow-lg transition-all border-l-4 border-primary">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Manage Orders</h3>
                            <p className="text-gray-500">View current orders and update their status.</p>
                        </div>
                    </Link>
                    <Link to="/admin/products" className="group block">
                        <div className="bg-surface rounded-xl shadow p-6 hover:shadow-lg transition-all border-l-4 border-secondary">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Manage Products</h3>
                            <p className="text-gray-500">Add, edit, or remove products key details.</p>
                        </div>
                    </Link>
                    <Link to="/admin/users" className="group block">
                        <div className="bg-surface rounded-xl shadow p-6 hover:shadow-lg transition-all border-l-4 border-green-500">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Manage Users</h3>
                            <p className="text-gray-500">View registered users and promote to Admin.</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
