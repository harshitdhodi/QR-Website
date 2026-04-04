"use client";
import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import PageTitle from "@/components/ui/PageTitle";
import { useCart } from "@/components/providers/CartProvider";
import { ShippingAddress } from '@/types';
import { MapPin, CreditCard, ShoppingBag, CheckCircle, Package } from 'react-feather';
import { Breadcrumb } from "@/components/ui/Breadcrumb";

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
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: (session?.user as { id?: string })?.id || null,
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
      <div className="pt-24 pb-12 max-w-screen-xl mx-auto px-4 font-dm flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="pt-24 max-w-screen mx-auto font-dm">
        <PageTitle title="Checkout" subtitle="Securely complete your purchase">
          <div className="flex justify-center text-center">
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: "Checkout" }]} variant="light" />
          </div>
        </PageTitle>
      </div>

      <div className="pt-12 pb-20 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 font-dm">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="w-20 h-20 bg-blue-50 text-blue-900 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md text-center">Looks like you haven&apos;t added anything to your cart yet. Browse our products and find something you love!</p>
            <button
              onClick={() => router.push('/shop')}
              className="px-8 py-3 bg-blue-900 hover:bg-blue-800 text-white font-medium rounded-xl transition-all shadow-md shadow-blue-900/20 flex items-center gap-2"
            >
              <Package size={20} />
              Return to Shop
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

            {/* Left Column: Delivery & Payment Details */}
            <div className="lg:col-span-7 space-y-8">

              {/* Login Info Card */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Account Connected</h3>
                  <p className="text-gray-600">You are securely checked in as <span className="font-medium text-gray-900">{session?.user?.email}</span></p>
                </div>
              </div>

              {/* Delivery Information Form */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg shadow-gray-200/40 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-900"></div>

                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-blue-50 text-blue-900 rounded-xl flex items-center justify-center">
                    <MapPin size={20} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Shipping Details</h3>
                </div>

                <form id="checkout-form" onSubmit={handleCheckout} className="space-y-2">

                  {/* Personal Info Group */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2 border-gray-100">Personal Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <input
                          className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 outline-none transition-all bg-gray-50/50 hover:bg-white"
                          placeholder="John Doe"
                          value={addressData.name}
                          onChange={e => setAddressData({ ...addressData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <input
                          className="w-full border border-gray-200 px-4 py-3 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
                          placeholder="john@example.com"
                          type="email"
                          value={addressData.email}
                          onChange={e => setAddressData({ ...addressData, email: e.target.value })}
                          required
                          disabled
                        />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                          className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 outline-none transition-all bg-gray-50/50 hover:bg-white"
                          placeholder="+91 9876543210"
                          value={addressData.phone}
                          onChange={e => setAddressData({ ...addressData, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Group */}
                  <div className="pt-4">
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2 border-b pb-2 border-gray-100">Address details</h4>
                    <div className="space-y-2">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Street Address</label>
                        <input
                          className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 outline-none transition-all bg-gray-50/50 hover:bg-white"
                          placeholder="House No, Building, Street Area"
                          value={addressData.street}
                          onChange={e => setAddressData({ ...addressData, street: e.target.value })}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-gray-700">City</label>
                          <input
                            className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 outline-none transition-all bg-gray-50/50 hover:bg-white"
                            placeholder="New Delhi"
                            value={addressData.city}
                            onChange={e => setAddressData({ ...addressData, city: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-gray-700">State</label>
                          <input
                            className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 outline-none transition-all bg-gray-50/50 hover:bg-white"
                            placeholder="Delhi"
                            value={addressData.state}
                            onChange={e => setAddressData({ ...addressData, state: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-gray-700">Pincode</label>
                          <input
                            className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 outline-none transition-all bg-gray-50/50 hover:bg-white"
                            placeholder="110001"
                            value={addressData.pincode}
                            onChange={e => setAddressData({ ...addressData, pincode: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-gray-700">Country</label>
                          <input
                            className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 outline-none transition-all bg-gray-50/50 hover:bg-white"
                            placeholder="India"
                            value={addressData.country}
                            onChange={e => setAddressData({ ...addressData, country: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="pt-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-50 text-blue-900 rounded-xl flex items-center justify-center">
                        <CreditCard size={20} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Payment Method</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label
                        className={`flex items-center gap-3 cursor-pointer border-2 px-5 py-4 rounded-xl transition-all ${paymentMethod === 'COD'
                          ? 'border-blue-900 bg-blue-50/50'
                          : 'border-gray-100 hover:border-gray-200 bg-white'
                          }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === 'COD' ? 'border-blue-900' : 'border-gray-300'}`}>
                          {paymentMethod === 'COD' && <div className="w-2.5 h-2.5 bg-blue-900 rounded-full" />}
                        </div>
                        <input className="hidden" type="radio" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} />
                        <div>
                          <p className={`font-semibold ${paymentMethod === 'COD' ? 'text-blue-900' : 'text-gray-900'}`}>Cash on Delivery</p>
                          <p className="text-xs text-gray-500 mt-0.5">Pay when you receive</p>
                        </div>
                      </label>

                      <label
                        className={`flex items-center gap-3 cursor-pointer border-2 px-5 py-4 rounded-xl transition-all ${paymentMethod === 'ONLINE'
                          ? 'border-blue-900 bg-blue-50/50'
                          : 'border-gray-100 hover:border-gray-200 bg-white'
                          }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === 'ONLINE' ? 'border-blue-900' : 'border-gray-300'}`}>
                          {paymentMethod === 'ONLINE' && <div className="w-2.5 h-2.5 bg-blue-900 rounded-full" />}
                        </div>
                        <input className="hidden" type="radio" value="ONLINE" checked={paymentMethod === 'ONLINE'} onChange={(e) => setPaymentMethod(e.target.value)} />
                        <div>
                          <p className={`font-semibold ${paymentMethod === 'ONLINE' ? 'text-blue-900' : 'text-gray-900'}`}>Pay Online</p>
                          <p className="text-xs text-gray-500 mt-0.5">UPI, Cards, NetBanking</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5 relative">
              <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-200 sticky top-28">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h3>

                <div className="space-y-4 mb-6">
                  {cartItems.map((item, idx) => {
                    const unit = Number(item.price);
                    return (
                    <div key={idx} className="flex gap-4 items-start bg-white p-4 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                      <div className="w-16 h-16 bg-blue-50/50 rounded-lg flex items-center justify-center flex-shrink-0 text-blue-900">
                        <Package size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1 line-clamp-2">{item.name}</h4>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">₹{unit * item.quantity}</p>
                        {item.quantity > 1 && <p className="text-xs text-gray-500 mt-1">₹{unit} each</p>}
                      </div>
                    </div>
                    );
                  })}
                </div>

                <div className="border-t border-gray-200 pt-5 space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Taxes</span>
                    <span className="font-medium text-gray-900">Included</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-5 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-3xl font-bold text-blue-900">₹{cartTotal}</span>
                  </div>
                  <p className="text-right text-sm text-gray-500 mt-1">Includes all applicable taxes</p>
                </div>

                <button
                  onClick={() => {
                    const form = document.getElementById('checkout-form') as HTMLFormElement;
                    if (form.checkValidity()) {
                      if (typeof form.requestSubmit === 'function') {
                        form.requestSubmit();
                      } else {
                        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                      }
                    } else {
                      form.reportValidity();
                    }
                  }}
                  disabled={loading}
                  className="w-full bg-blue-900 hover:bg-blue-800 disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium py-4 rounded-xl transition-all shadow-md shadow-blue-900/20 flex justify-center items-center gap-3 text-lg"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      {paymentMethod === 'ONLINE' ? 'Pay Now & Place Order' : 'Place Order via COD'}
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 mt-5 text-sm text-gray-500 bg-white py-2 px-4 rounded-lg border border-gray-100">
                  <CheckCircle size={16} className="text-green-500" />
                  Secure and encrypted checkout
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  );
}