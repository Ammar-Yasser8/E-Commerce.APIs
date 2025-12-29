import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function NavBar() {
    const { basket, user, logout } = useStore();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const basketCount = basket?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

    return (
        <nav className="bg-secondary text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-primary">Otlob</Link>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link to="/" className="hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
                                <Link to="/shop" className="hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Shop</Link>
                                <Link to="/contact" className="hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Contact</Link>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6 space-x-4">
                            <Link to="/basket" className="relative group p-2 hover:text-primary transition-colors">
                                <span className="sr-only">Basket</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {basketCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {basketCount}
                                    </span>
                                )}
                            </Link>

                            {user ? (
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm font-medium">Hi, {user.displayName}</span>
                                    {user.role === 'Admin' && (
                                        <Link to="/admin" className="text-orange-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium border border-orange-300 hover:bg-orange-600 transition-colors">Admin</Link>
                                    )}
                                    <Link to="/orders" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Orders</Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            navigate('/');
                                        }}
                                        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                                    <Link to="/register" className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-md">Sign Up</Link>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</Link>
                        <Link to="/shop" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Shop</Link>
                        <Link to="/contact" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Contact</Link>
                    </div>
                    <div className="pt-4 pb-3 border-t border-gray-700">
                        {user ? (
                            <div className="px-5 space-y-3">
                                <div className="text-base font-medium text-white">Hi, {user.displayName}</div>
                                <button
                                    onClick={() => {
                                        logout();
                                        setIsOpen(false);
                                        navigate('/');
                                    }}
                                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center px-5 space-x-3">
                                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">Login</Link>
                                <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-primary hover:bg-orange-600">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
