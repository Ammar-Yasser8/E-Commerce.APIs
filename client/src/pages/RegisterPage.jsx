import React, { useState } from 'react';
import agent from '../api/agent';
import { useStore } from '../context/StoreContext';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
    const { login } = useStore();
    const navigate = useNavigate();
    const [values, setValues] = useState({
        displayName: '',
        email: '',
        password: '',
        phoneNumber: '',
    });
    const [errors, setErrors] = useState({});

    const validate = () => {
        const temp = {};
        if (!values.displayName) temp.displayName = "Display name is required";
        if (!values.email) temp.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(values.email)) temp.email = "Email is invalid";
        if (!values.password) temp.password = "Password is required";
        // Password complexity checks could go here (e.g. 1 Uppercase, 1 lowercase etc as per backend Identity defaults)
        if (!values.phoneNumber) temp.phoneNumber = "Phone number is required";

        setErrors(temp);
        return Object.keys(temp).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await agent.Account.register(values);
            // Auto login after register or redirect to login? 
            // The backend returns UserDto on register, so we can treat it as login
            await login({ email: values.email, password: values.password });
            navigate('/shop');
        } catch (error) {
            console.log(error);
            if (error.response?.data?.errors) {
                // Validation errors from backend
                setErrors(error.response.data.errors);
            } else if (error.response?.data) {
                setErrors({ api: error.response.data });
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    return (
        <div className="flex justify-center items-center pt-10">
            <div className="max-w-md w-full bg-surface shadow-lg rounded-lg p-8">
                <h2 className="text-3xl font-bold text-center text-secondary mb-8">Create an account</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">Display Name</label>
                        <input
                            type="text"
                            name="displayName"
                            id="displayName"
                            value={values.displayName}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        />
                        {errors.displayName && <p className="text-error text-xs mt-1">{errors.displayName}</p>}
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={values.email}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        />
                        {errors.email && <p className="text-error text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            id="phoneNumber"
                            value={values.phoneNumber}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        />
                        {errors.phoneNumber && <p className="text-error text-xs mt-1">{errors.phoneNumber}</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={values.password}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        />
                        {errors.password && <p className="text-error text-xs mt-1">{errors.password}</p>}
                        {/* Backend password errors often come as array of strings */}
                        {errors.Password && <p className="text-error text-xs mt-1">{errors.Password}</p>}
                    </div>

                    {errors.api && <div className="text-error text-sm bg-red-50 p-2 rounded">{JSON.stringify(errors.api)}</div>}

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-primary hover:text-orange-500">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
