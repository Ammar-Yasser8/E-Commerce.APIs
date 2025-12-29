import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export default function LoginPage() {
    const { login } = useStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [values, setValues] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const from = location.state?.from?.pathname || '/shop';

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(values);
            navigate(from);
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || 'Invalid email or password');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    return (
        <div className="flex justify-center items-center pt-10">
            <div className="max-w-md w-full bg-surface shadow-lg rounded-lg p-8">
                <h2 className="text-3xl font-bold text-center text-secondary mb-8">Sign in to your account</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            required
                            value={values.email}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            required
                            value={values.password}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        />
                    </div>
                    {error && <p className="text-error text-sm">{error}</p>}
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-primary hover:text-orange-500">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
