"use client";
import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import PageTitle from "@/components/ui/PageTitle";

export default function CheckoutPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState<number | null>(null);
    const [userAddresses, setUserAddresses] = useState<any[]>([]);

    // Address State
    const [addressData, setAddressData] = useState({
        street: '', city: '', state: '', pincode: '', phone: '',
        name: '', email: ''
    });

    // Mock items for checkout demonstration
    const cartItems = [
        { name: "Vehicle QR Tag", sku: "VQR001", quantity: 1, price: 29 },
    ];

    // Check authentication and redirect if needed
    useEffect(() => {
        if (status === 'loading') return; // Still loading

        if (status === 'unauthenticated') {
            // Store checkout intent in sessionStorage
            sessionStorage.setItem('checkoutIntent', 'true');
            sessionStorage.setItem('checkoutData', JSON.stringify({
                items: cartItems,
                timestamp: Date.now()
            }));

            // Redirect to login with callback URL
            const callbackUrl = encodeURIComponent('/checkout');
            router.push(`/login?callbackUrl=${callbackUrl}`);
            return;
        }

        if (status === 'authenticated' && session?.user) {
            // Auto-fill user data
          setAddressData(prev => ({
    ...prev,
    name: session.user.name || '',
    email: session.user.email || '',
    phone: '' // Set empty string instead of accessing undefined session.user.phone
}));

            // Fetch user addresses
            fetchUserAddresses();
        }
    }, [status, session, router]);

    // Restore checkout data if returning from login
    useEffect(() => {
        const checkoutIntent = sessionStorage.getItem('checkoutIntent');
        if (checkoutIntent && status === 'authenticated') {
            sessionStorage.removeItem('checkoutIntent');
            sessionStorage.removeItem('checkoutData');
        }
    }, [status]);

    const fetchUserAddresses = async () => {
        try {
            const res = await fetch('/api/user/address');
            if (res.ok) {
                const addresses = await res.json();
                setUserAddresses(addresses);

                // Auto-fill first address if available
                if (addresses.length > 0) {
                    const firstAddress = addresses[0];
                    setAddressData(prev => ({
                        ...prev,
                        street: firstAddress.street || '',
                        city: firstAddress.city || '',
                        state: firstAddress.state || '',
                        pincode: firstAddress.pincode || '',
                        phone: firstAddress.phone || prev.phone
                    }));
                }
            }
        } catch (error) {
            console.error('Failed to fetch addresses:', error);
        }
    };

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cartItems,
                    paymentMethod: 'COD',
                    address: addressData
                })
            });
            const data = await res.json();
            if (res.ok) {
                setOrderId(data.orderId);
                alert(`Order placed successfully! Order ID: ${data.orderId}`);
                window.location.href = '/orders';
            } else {
                alert("Checkout failed: " + data.error);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="pt-24 pb-12 max-w-screen-xl mx-auto px-4 font-dm">
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-12 max-w-screen-xl mx-auto px-4 font-dm">
            <PageTitle title="Checkout" subtitle="Complete your purchase" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-8">
                {/* Left Column: Forms */}
                <div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-xl font-semibold mb-4 text-gray-900">Delivery Information</h3>

                        {/* User Info Display */}
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">Logged in as:</p>
                            <p className="font-medium">{session?.user?.email}</p>
                        </div>

                        <form onSubmit={handleCheckout} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    className="w-full border p-3 rounded-lg"
                                    placeholder="Full Name"
                                    value={addressData.name}
                                    onChange={e => setAddressData({ ...addressData, name: e.target.value })}
                                    required
                                />
                                <input
                                    className="w-full border p-3 rounded-lg"
                                    placeholder="Email"
                                    type="email"
                                    value={addressData.email}
                                    onChange={e => setAddressData({ ...addressData, email: e.target.value })}
                                    required
                                    disabled
                                />
                            </div>

                            <input
                                className="w-full border p-3 rounded-lg"
                                placeholder="Phone"
                                value={addressData.phone}
                                onChange={e => setAddressData({ ...addressData, phone: e.target.value })}
                                required
                            />

                            <input
                                className="w-full border p-3 rounded-lg"
                                placeholder="Street Address"
                                value={addressData.street}
                                onChange={e => setAddressData({ ...addressData, street: e.target.value })}
                                required
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    className="w-full border p-3 rounded-lg"
                                    placeholder="City"
                                    value={addressData.city}
                                    onChange={e => setAddressData({ ...addressData, city: e.target.value })}
                                    required
                                />
                                <input
                                    className="w-full border p-3 rounded-lg"
                                    placeholder="State"
                                    value={addressData.state}
                                    onChange={e => setAddressData({ ...addressData, state: e.target.value })}
                                    required
                                />
                            </div>

                            <input
                                className="w-full border p-3 rounded-lg"
                                placeholder="Pincode"
                                value={addressData.pincode}
                                // ✅ Correct
                                onChange={e => setAddressData({ ...addressData, pincode: e.target.value })}
                                required
                            />

                            <button
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
                            >
                                {loading ? 'Processing...' : 'Place Order'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">Order Summary</h3>
                    {cartItems.map((item, idx) => (
                        <div key={idx} className="flex justify-between py-3 border-b">
                            <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium">${item.price}</p>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-between py-3 font-semibold text-lg">
                        <span>Total</span>
                        <span>${cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}