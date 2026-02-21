"use client";
import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        phone: '', 
        otp: ''
    });

    // Handle redirect after successful login
    useEffect(() => {
        if (status === 'authenticated') {
            const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
            router.push(callbackUrl);
        }
    }, [status, router, searchParams]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone
                })
            });

            const data = await res.json();
            
            if (res.ok) {
                setShowOtpInput(true);
                alert(data.message);
            } else {
                alert(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpVerification = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const result = await signIn('credentials', {
                redirect: false,
                email: formData.email,
                otp: formData.otp
            });

            if (result?.error) {
                alert('Invalid OTP. Please try again.');
            } else {
                // Login successful, will redirect automatically
            }
        } catch (error) {
            console.error('OTP verification error:', error);
            alert('OTP verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setLoading(true);
        
        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email })
            });

            const data = await res.json();
            
            if (res.ok) {
                alert('OTP resent successfully');
            } else {
                alert(data.error || 'Failed to resend OTP');
            }
        } catch (error) {
            console.error('Resend OTP error:', error);
            alert('Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="auth-wrap min-h-screen flex items-center justify-center relative lg:pt-24 pt-16">
            {/* Background image on the right for lg screens */}
            <div className="absolute top-0 right-0 w-full h-[100vh] bg-auth-image-one bg-cover bg-right xl:flex hidden">
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            <div className="max-w-screen-xl w-full px-3 sm:px-6 md:px-14 lg:px-14 xl:px-18 2xl:px-3 font-dm">
                <div className="login-wrap w-full flex justify-center items-center">
                    <div className="xl:w-2/5 md:w-3/5 w-full lg:p-12 p-6 bg-white rounded-lg z-10 relative">
                        <div className="w-full text-start">
                            {/* Heading */}
                            <div className="mb-3 mt-0">
                                <h1 className="text-gray-900 font-bold text-4xl md:text-5xl mb-2">
                                    Create a <br />
                                    new account
                                </h1>
                                <p className="text-gray-800 font-medium">
                                    Enter your information to get started
                                </p>
                            </div>

                            {/* Form */}
                            {!showOtpInput ? (
                                <form onSubmit={handleRegister} className="mt-5">
                                    {/* Name */}
                                    <div className="mb-3">
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium text-gray-600 mb-2"
                                        >
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                            required
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="mb-3">
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-medium text-gray-600 mb-2"
                                        >
                                            Email address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            placeholder="name@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                            required
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div className="mb-3">
                                        <label
                                            htmlFor="phone"
                                            className="block text-sm font-medium text-gray-600 mb-2"
                                        >
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            placeholder="+1234567890"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                            required
                                        />
                                    </div>

                                    {/* Terms */}
                                    <div className="mb-6">
                                        <label className="flex items-start text-sm text-gray-600 font-medium space-x-2">
                                            <input
                                                type="checkbox"
                                                id="terms"
                                                className="mt-1 accent-primary"
                                                required
                                            />
                                            <span>
                                                By clicking all term and condition apply our
                                                <Link
                                                    href="#"
                                                    className="text-gray-900 underline font-medium"
                                                >
                                                    Privacy policy
                                                </Link>
                                                and
                                                <Link
                                                    href="#"
                                                    className="text-gray-900 underline font-medium"
                                                >
                                                    Terms and Conditions
                                                </Link>
                                                .
                                            </span>
                                        </label>
                                    </div>

                                    {/* Register button */}
                                    <div className="mt-3">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-3 px-4 text-white text-base font-semibold rounded-md bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50"
                                        >
                                            {loading ? 'Creating Account...' : 'Register'}
                                        </button>
                                    </div>

                                    {/* Login link */}
                                    <div className="mt-3 text-center">
                                        <span className="text-gray-700 font-medium">
                                            Already have an account?
                                        </span>
                                        <Link href={`/login?callbackUrl=${searchParams.get('callbackUrl') || '/dashboard'}`} className="text-primary font-medium ml-1">
                                            Login
                                        </Link>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handleOtpVerification} className="mt-5">
                                    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                                        <p className="text-sm text-blue-800">
                                            We've sent a 6-digit OTP to <strong>{formData.email}</strong>
                                        </p>
                                    </div>

                                    {/* OTP Input */}
                                    <div className="mb-4">
                                        <label
                                            htmlFor="otp"
                                            className="block text-sm font-medium text-gray-600 mb-2"
                                        >
                                            Enter OTP
                                        </label>
                                        <input
                                            type="text"
                                            id="otp"
                                            placeholder="Enter 6-digit OTP"
                                            value={formData.otp}
                                            onChange={(e) => setFormData({...formData, otp: e.target.value})}
                                            className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary text-center text-lg font-mono"
                                            maxLength={6}
                                            required
                                        />
                                    </div>

                                    {/* Verify Button */}
                                    <div className="mt-3 mb-3">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-3 px-4 text-white text-base font-semibold rounded-md bg-green-600 hover:bg-green-700 transition disabled:opacity-50"
                                        >
                                            {loading ? 'Verifying...' : 'Verify & Login'}
                                        </button>
                                    </div>

                                    {/* Resend OTP */}
                                    <div className="text-center">
                                        <button
                                            type="button"
                                            onClick={handleResendOtp}
                                            disabled={loading}
                                            className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
                                        >
                                            {loading ? 'Sending...' : 'Resend OTP'}
                                        </button>
                                    </div>

                                    {/* Back to Register */}
                                    <div className="mt-3 text-center">
                                        <button
                                            type="button"
                                            onClick={() => setShowOtpInput(false)}
                                            className="text-sm text-gray-600 hover:text-gray-700"
                                        >
                                            ← Back to Registration
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}