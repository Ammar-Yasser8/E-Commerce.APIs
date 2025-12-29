import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout'
import ShopPage from './pages/ShopPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import BasketPage from './pages/BasketPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminProductEditorPage from './pages/admin/AdminProductEditorPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ShopPage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="shop/:id" element={<ProductDetailsPage />} />
        <Route path="basket" element={<BasketPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:id" element={<OrderDetailsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Admin Routes - In real app, wrap in ProtectedRoute checking role */}
        <Route path="admin" element={<AdminDashboardPage />} />
        <Route path="admin/orders" element={<AdminOrdersPage />} />
        <Route path="admin/users" element={<AdminUsersPage />} />
        <Route path="admin/products" element={<AdminProductsPage />} />
        <Route path="admin/product/:id" element={<AdminProductEditorPage />} />
        <Route path="admin/product/new" element={<AdminProductEditorPage />} />
      </Route>
    </Routes>
  );
}

export default App
