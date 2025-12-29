import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import agent from '../api/agent';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';

const stripePromise = loadStripe('pk_test_51Pmb9FJt2nhlheoU0YTyMPzNFcvcRAUARddpq23nzmZNaTX25f1IZAl2DbTql4qOq1xLO6W3xhE0tnAndHHNuZx400ZBXdkkPd');

const CheckoutForm = ({ basket, address, deliveryMethod }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [cardError, setCardError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const { setBasket } = useStore();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);

        if (!stripe || !elements) return;

        try {
            // 1. Create Payment Intent (Client Secret)
            const createdBasket = await agent.Payments.createPaymentIntent(basket.id);
            const clientSecret = createdBasket.clientSecret;

            // 2. Confirm Card Payment
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: address.firstName + ' ' + address.lastName,
                        email: 'user@example.com', // Get from user context if available
                        address: {
                            line1: address.street,
                            city: address.city,
                            state: address.state,
                            postal_code: address.zipCode,
                            country: 'EG' // Defaulting for now
                        }
                    }
                }
            });

            if (result.error) {
                setCardError(result.error.message);
                setProcessing(false);
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    // 3. Create Order
                    // Note: In a real app we might do this via webhook or after confirmation
                    await agent.Orders.create({
                        basketId: basket.id,
                        deliveryMethodId: deliveryMethod.id,
                        shipppingAddress: address
                    });

                    // Clear Basket
                    // StoreContext logout() clears it but we just want to empty it
                    // The simplest is to remove the local basket ID and reload
                    localStorage.removeItem('basket_id');
                    setBasket(null); // Clear context

                    setProcessing(false);
                    navigate('/', { state: { message: 'Order created successfully!' } });
                }
            }
        } catch (error) {
            console.log(error);
            setCardError('Payment failed: ' + error.message);
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
                <div className="p-3 border border-gray-300 rounded-md">
                    <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
                </div>
                {cardError && <p className="text-error text-sm mt-1">{cardError}</p>}
            </div>
            <button
                type="submit"
                disabled={!stripe || processing}
                className="w-full bg-primary text-white py-3 rounded-md font-bold hover:bg-orange-600 disabled:opacity-50"
            >
                {processing ? 'Processing...' : `Pay Now`}
            </button>
        </form>
    );
}


export default function CheckoutPage() {
    const { basket, user } = useStore();
    const [step, setStep] = useState(1);
    const [address, setAddress] = useState({
        firstName: '', lastName: '', street: '', city: '', state: '', zipCode: ''
    });
    const [deliveryMethods, setDeliveryMethods] = useState([]);
    const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return; // Wait for auth or redirect handled by effect? 
        // Ideally fetch user address
        agent.Account.address()
            .then(addr => {
                if (addr) setAddress(addr);
            })
            .catch(() => { /* Ignore if no address */ });

        agent.Orders.deliveryMethods()
            .then(dm => setDeliveryMethods(dm))
            .catch(console.log)
            .finally(() => setLoading(false));
    }, [user]);

    const handleAddressChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    }

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        setStep(2);
    }

    if (!user) return <div className="text-center mt-20">Please <a href="/login" className="text-primary">log in</a> to checkout.</div>
    if (loading) return <div>Loading...</div>

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-8 text-secondary">Checkout</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Col: Steps */}
                <div className="space-y-6">
                    {/* Step 1: Address */}
                    <div className={`p-6 bg-surface shadow rounded-lg ${step !== 1 ? 'opacity-50 pointer-events-none' : ''}`}>
                        <h2 className="text-xl font-bold mb-4">1. Shipping Address</h2>
                        <form id="addressForm" onSubmit={handleAddressSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                                <input name="firstName" placeholder="First Name" value={address.firstName} onChange={handleAddressChange} className="border p-2 rounded" required />
                                <input name="lastName" placeholder="Last Name" value={address.lastName} onChange={handleAddressChange} className="border p-2 rounded" required />
                                <input name="street" placeholder="Street" value={address.street} onChange={handleAddressChange} className="border p-2 rounded col-span-2" required />
                                <input name="city" placeholder="City" value={address.city} onChange={handleAddressChange} className="border p-2 rounded" required />
                                <input name="state" placeholder="State" value={address.state} onChange={handleAddressChange} className="border p-2 rounded" required />
                                <input name="zipCode" placeholder="Zip Code" value={address.zipCode} onChange={handleAddressChange} className="border p-2 rounded" required />
                            </div>
                            <button type="submit" className="mt-4 bg-secondary text-white px-4 py-2 rounded">Next: Delivery</button>
                        </form>
                    </div>

                    {/* Step 2: Delivery */}
                    <div className={`p-6 bg-surface shadow rounded-lg ${step !== 2 ? 'opacity-50 pointer-events-none' : ''}`}>
                        <h2 className="text-xl font-bold mb-4">2. Delivery Method</h2>
                        <div className="space-y-2">
                            {deliveryMethods.map(dm => (
                                <div key={dm.id} className={`flex items-center justify-between p-3 border rounded cursor-pointer ${selectedDeliveryMethod?.id === dm.id ? 'border-primary bg-orange-50' : ''}`}
                                    onClick={() => setSelectedDeliveryMethod(dm)}
                                >
                                    <div>
                                        <span className="font-bold">{dm.shortName}</span>
                                        <p className="text-sm text-gray-500">{dm.description}</p>
                                    </div>
                                    <span className="font-bold">${dm.price}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-between">
                            <button onClick={() => setStep(1)} type="button" className="text-gray-600">Back</button>
                            <button
                                onClick={() => setStep(3)}
                                disabled={!selectedDeliveryMethod}
                                className="bg-secondary text-white px-4 py-2 rounded disabled:opacity-50"
                            >
                                Next: Payment
                            </button>
                        </div>
                    </div>

                    {/* Step 3: Payment */}
                    <div className={`p-6 bg-surface shadow rounded-lg ${step !== 3 ? 'opacity-50 pointer-events-none' : ''}`}>
                        <h2 className="text-xl font-bold mb-4">3. Payment</h2>
                        <Elements stripe={stripePromise}>
                            <CheckoutForm basket={basket} address={address} deliveryMethod={selectedDeliveryMethod} />
                        </Elements>
                        <button onClick={() => setStep(2)} type="button" className="mt-4 text-gray-600">Back</button>
                    </div>

                </div>

                {/* Right Col: Summary */}
                <div className="bg-gray-50 p-6 rounded-lg h-fit">
                    <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                    <ul className="divide-y divide-gray-200 mb-4">
                        {basket?.items.map(item => (
                            <li key={item.id} className="py-2 flex justify-between">
                                <span className="text-sm">{item.productName} x {item.quantity}</span>
                                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${basket?.items.reduce((a, b) => a + (b.price * b.quantity), 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>${selectedDeliveryMethod ? selectedDeliveryMethod.price : 0}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                            <span>Total</span>
                            <span>${(basket?.items.reduce((a, b) => a + (b.price * b.quantity), 0) + (selectedDeliveryMethod ? selectedDeliveryMethod.price : 0)).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
