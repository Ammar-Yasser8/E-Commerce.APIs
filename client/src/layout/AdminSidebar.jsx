import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function AdminSidebar() {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="bg-surface w-64 min-h-screen shadow-lg hidden md:block">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-primary">Admin Panel</h2>
            </div>
            <nav className="mt-6">
                <Link
                    to="/admin"
                    className={`block px-6 py-3 hover:bg-gray-50 transition-colors ${isActive('/admin') ? 'bg-orange-50 text-primary border-r-4 border-primary font-medium' : 'text-gray-600'}`}
                >
                    Dashboard
                </Link>
                <Link
                    to="/admin/products"
                    className={`block px-6 py-3 hover:bg-gray-50 transition-colors ${isActive('/admin/products') ? 'bg-orange-50 text-primary border-r-4 border-primary font-medium' : 'text-gray-600'}`}
                >
                    Products
                </Link>
                <Link
                    to="/admin/orders"
                    className={`block px-6 py-3 hover:bg-gray-50 transition-colors ${isActive('/admin/orders') ? 'bg-orange-50 text-primary border-r-4 border-primary font-medium' : 'text-gray-600'}`}
                >
                    Orders
                </Link>
                <Link
                    to="/admin/users"
                    className={`block px-6 py-3 hover:bg-gray-50 transition-colors ${isActive('/admin/users') ? 'bg-orange-50 text-primary border-r-4 border-primary font-medium' : 'text-gray-600'}`}
                >
                    Users
                </Link>
            </nav>
        </div>
    );
}
