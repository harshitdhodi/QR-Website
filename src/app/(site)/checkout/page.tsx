"use client";
import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import PageTitle from "@/components/ui/PageTitle";
import { useCart } from "@/components/providers/CartProvider";
import { ShippingAddress } from '@/types';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

const STATE_MAP: Record<string, string> = {
  AN: 'Andaman & Nicobar Islands', AP: 'Andhra Pradesh', AR: 'Arunachal Pradesh',
  AS: 'Assam', BR: 'Bihar', CG: 'Chhattisgarh', CH: 'Chandigarh', DD: 'Daman & Diu',
  DL: 'Delhi', DN: 'Dadra & Nagar Haveli', GA: 'Goa', GJ: 'Gujarat',
  HP: 'Himachal Pradesh', HR: 'Haryana', JH: 'Jharkhand', JK: 'Jammu & Kashmir',
  KA: 'Karnataka', KL: 'Kerala', LA: 'Ladakh', LD: 'Lakshadweep', MH: 'Maharashtra',
  ML: 'Meghalaya', MN: 'Manipur', MP: 'Madhya Pradesh', MZ: 'Mizoram', NL: 'Nagaland',
  OD: 'Odisha', PB: 'Punjab', PY: 'Puducherry', RJ: 'Rajasthan', SK: 'Sikkim',
  TG: 'Telangana', TN: 'Tamil Nadu', TR: 'Tripura', UK: 'Uttarakhand',
  UP: 'Uttar Pradesh', WB: 'West Bengal',
};

const normalizeState = (state: string): string => {
  if (!state) return '';
  if (!state.includes(',') && state.length > 2) return state;
  const parts = state.split(',').map((p) => p.trim());
  const stateCode = parts[parts.length - 1].toUpperCase();
  return STATE_MAP[stateCode] ?? state;
};

const normalizeCity = (city: string): string => {
  if (!city) return '';
  return city.replace(/\s*\(.*?\)$/g, '').trim();
};

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD"); // COD or ONLINE

  const [addressData, setAddressData] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    name: '',
    email: '',
    country: 'India',
  });

  const cartItems = useMemo(() => cart.map(item => ({
    name: item.product.title,
    sku: `SKU-${item.product.id}`,
    quantity: item.quantity,
    price: item.product.price
  })), [cart]);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      sessionStorage.setItem('checkoutIntent', 'true');
      sessionStorage.setItem('checkoutData', JSON.stringify({ items: cartItems, timestamp: Date.now() }));
      router.push(`/login?callbackUrl=${encodeURIComponent('/checkout')}`);
      return;
    }

    if (status === 'authenticated' && session?.user) {
      setAddressData(prev => ({
        ...prev,
        name: session.user?.name || '',
        email: session.user?.email || '',
      }));
      fetchUserAddresses();
    }
  }, [status, session, router, cartItems]);

  useEffect(() => {
    if (status === 'authenticated') {
      sessionStorage.removeItem('checkoutIntent');
      sessionStorage.removeItem('checkoutData');
    }
  }, [status]);

  const fetchUserAddresses = async () => {
    try {
      const res = await fetch('/api/user/address');
      if (res.ok) {
        const addresses = await res.json();
        // setUserAddresses(addresses); // Removed unused state

        if (addresses.length > 0) {
          const first = addresses[0];
          setAddressData(prev => ({
            ...prev,
            street: first.street || '',
            city: normalizeCity(first.city || ''),
            state: normalizeState(first.state || ''),
            pincode: first.pincode || '',
            phone: first.phone || prev.phone,
          }));
        }
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    }
  };

  const loadRazorpayScript = () => new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    setLoading(true);

    const normalizedAddress = {
      ...addressData,
      city: normalizeCity(addressData.city),
      state: normalizeState(addressData.state),
      pincode: addressData.pincode.trim(),
      street: addressData.street.trim(),
    };

    if (paymentMethod === "ONLINE") {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert("Razorpay failed to load");
        setLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_dummykey12345",
        amount: cartTotal * 100, // paise
        currency: "INR",
        name: "QR Website",
        description: "Payment for products",
        handler: async function () {
          // Send to checkout API after success
          await completeOrder(normalizedAddress, "PREPAID");
        },
        prefill: {
          name: addressData.name,
          email: addressData.email,
          contact: addressData.phone,
        },
        theme: {
          color: "#3399cc"
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on('payment.failed', function () {
        alert("Payment failed");
        setLoading(false);
      });
      razorpayInstance.open();
    } else {
      await completeOrder(normalizedAddress, "COD");
    }
  };

  const completeOrder = async (address: ShippingAddress, completePaymentMethod: string) => {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          paymentMethod: completePaymentMethod,
          address: address,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        clearCart();
        alert(`Order placed successfully! Order ID: ${data.orderId}`);
        router.push('/orders'); // replace window.location
      } else {
        alert("Checkout failed: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

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
    <>
      <div className="pt-24 pb-12 max-w-screen mx-auto font-dm">

        <PageTitle title="Checkout" subtitle="Complete your purchase" />
      </div>
      <div className="pt-12 pb-12 max-w-screen-xl mx-auto px-4 font-dm">

        {cartItems.length === 0 ? (
          <div className="text-center mt-12">
            <h2 className="text-xl">Your cart is empty.</h2>
            <button onClick={() => router.push('/shop')} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded">Go to Shop</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-8">
            <div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Delivery Information</h3>

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

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      className="w-full border p-3 rounded-lg"
                      placeholder="Pincode"
                      value={addressData.pincode}
                      onChange={e => setAddressData({ ...addressData, pincode: e.target.value })}
                      required
                    />
                    <input
                      className="w-full border p-3 rounded-lg"
                      placeholder="Country"
                      value={addressData.country}
                      onChange={e => setAddressData({ ...addressData, country: e.target.value })}
                      required
                    />
                  </div>

                  <div className="pt-4 pb-2 border-t">
                    <h3 className="font-semibold mb-3">Payment Method</h3>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer border px-4 py-2 rounded-lg data-[active=true]:border-blue-500 data-[active=true]:bg-blue-50" data-active={paymentMethod === 'COD'}>
                        <input type="radio" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} />
                        Cash on Delivery
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer border px-4 py-2 rounded-lg data-[active=true]:border-blue-500 data-[active=true]:bg-blue-50" data-active={paymentMethod === 'ONLINE'}>
                        <input type="radio" value="ONLINE" checked={paymentMethod === 'ONLINE'} onChange={(e) => setPaymentMethod(e.target.value)} />
                        Razorpay (Online)
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-lg transition"
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </button>
                </form>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Order Summary</h3>
              {cartItems.map((item: { name: string; quantity: number; price: number }, idx: number) => (
                <div key={idx} className="flex justify-between py-3 border-b">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{item.price}</p>
                  </div>
                </div>
              ))}
              <div className="flex justify-between py-3 font-semibold text-lg">
                <span>Total</span>
                <span>₹{cartTotal}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}