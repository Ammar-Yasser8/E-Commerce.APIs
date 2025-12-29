import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col bg-background font-sans text-secondary">
            <NavBar />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
            <footer className="bg-secondary text-gray-300 py-8">
                <div className="container mx-auto px-4 text-center">
                    <p>&copy; {new Date().getFullYear()} Otlob. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
