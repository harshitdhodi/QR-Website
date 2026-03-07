"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

/* ─────────────────────────────────────────────
   SVG Illustration  (mirrors register style)
───────────────────────────────────────────── */
function LoginIllustration() {
    return (
        <svg
            viewBox="0 0 480 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto block w-full max-w-[380px]"
        >
            <rect x="40" y="50" width="400" height="300" rx="28" fill="white" fillOpacity=".05" stroke="white" strokeOpacity=".1" strokeWidth="1.5" />
            <rect x="55" y="55" width="380" height="40" rx="8" fill="white" fillOpacity=".04" />

            {/* Lock icon center */}
            <circle cx="240" cy="148" r="56" fill="url(#lgA)" />
            <rect x="214" y="148" width="52" height="40" rx="8" fill="white" fillOpacity=".9" />
            <path d="M228 148v-10a12 12 0 0 1 24 0v10" stroke="white" strokeOpacity=".9" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <circle cx="240" cy="170" r="5" fill="url(#lgA)" />

            {/* Verified badge */}
            <rect x="278" y="104" width="76" height="28" rx="14" fill="#22c55e" />
            <text x="291" y="122" fontFamily="sans-serif" fontSize="10.5" fill="white" fontWeight="700">✓ Secure</text>

            {/* Floating dots */}
            <circle cx="100" cy="95" r="4" fill="#818cf8" fillOpacity=".5" />
            <circle cx="380" cy="90" r="6" fill="#a78bfa" fillOpacity=".4" />
            <circle cx="88" cy="300" r="5" fill="#6366f1" fillOpacity=".45" />
            <circle cx="392" cy="310" r="9" fill="#8b5cf6" fillOpacity=".35" />

            {/* Content lines */}
            <rect x="80" y="218" width="320" height="13" rx="6.5" fill="white" fillOpacity=".12" />
            <rect x="80" y="242" width="260" height="13" rx="6.5" fill="white" fillOpacity=".08" />
            <rect x="80" y="266" width="295" height="13" rx="6.5" fill="white" fillOpacity=".08" />

            {/* CTA button */}
            <rect x="80" y="298" width="320" height="38" rx="12" fill="url(#lgB)" />
            <text x="240" y="322" fontFamily="sans-serif" fontSize="12.5" fill="white" fontWeight="700" textAnchor="middle" letterSpacing="2">SIGN IN</text>

            {/* Dashed orbit */}
            <circle cx="240" cy="148" r="74" stroke="white" strokeOpacity=".07" strokeWidth="1" strokeDasharray="5 7" />

            <defs>
                <linearGradient id="lgA" x1="184" y1="92" x2="296" y2="204" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#818cf8" />
                    <stop offset="1" stopColor="#6366f1" />
                </linearGradient>
                <linearGradient id="lgB" x1="80" y1="298" x2="400" y2="336" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6366f1" />
                    <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
            </defs>
        </svg>
    );
}

/* ─────────────────────────────────────────────
   Step indicator  (same as register)
───────────────────────────────────────────── */
function StepIndicator({ step }: { step: 1 | 2 }) {
    return (
        <div className="flex items-center gap-3 mb-8">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all duration-300 ${step >= 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40' : 'bg-gray-100 text-gray-400 dark:bg-white/10 dark:text-white/40'}`}>1</div>
            <div className={`h-px flex-1 transition-all duration-500 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-200 dark:bg-white/10'}`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all duration-300 ${step >= 2 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40' : 'bg-gray-100 text-gray-400 dark:bg-white/10 dark:text-white/40'}`}>2</div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Spinner
───────────────────────────────────────────── */
function Spinner() {
    return (
        <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        </span>
    );
}

/* ─────────────────────────────────────────────
   Logo Mark
───────────────────────────────────────────── */
function LogoMark({ size = 'md' }: { size?: 'sm' | 'md' }) {
    const box = size === 'sm' ? 'h-8 w-8 rounded-lg' : 'h-9 w-9 rounded-xl';
    const icon = size === 'sm' ? 16 : 18;
    return (
        <div className={`${box} flex flex-shrink-0 items-center justify-center bg-blue-500/25 ring-1 ring-blue-400/35`}>
            <svg width={icon} height={icon} viewBox="0 0 24 24" fill="none">
                <path
                    d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                />
            </svg>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Inline field builder  (same pattern as register)
───────────────────────────────────────────── */
function field(
    id: string, label: string, type: string, placeholder: string,
    value: string, onChange: (v: string) => void, extra?: object
) {
    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="block text-xs font-semibold tracking-widest uppercase text-gray-500 dark:text-white/50">{label}</label>
            <input
                id={id} type={type} placeholder={placeholder} value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20
                           focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-white/8 focus:ring-1 focus:ring-blue-500/50
                           transition-all duration-200 text-sm shadow-sm dark:shadow-none"
                {...extra}
            />
        </div>
    );
}

/* ─────────────────────────────────────────────
   Main Content
───────────────────────────────────────────── */
function LoginContent() {
    const { status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [formData, setFormData] = useState({ email: '', otp: '' });

    useEffect(() => {
        if (status === 'authenticated') {
            const callbackUrl = searchParams.get('callbackUrl') || '/';
            router.push(callbackUrl);
        }
    }, [status, router, searchParams]);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const adminApiUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3060/api';
            const res = await fetch(`${adminApiUrl}/auth/otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, isCustomer: "true" }),
            });
            const data = await res.json();
            if (res.ok) {
                setShowOtpInput(true);
                alert('OTP "sent"! For demo/testing, use the default OTP: 123456');
            } else {
                alert(data.error || 'Failed to send OTP');
            }
        } catch (error) {
            console.error('Send OTP error:', error);
            alert('Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await signIn('credentials', {
                redirect: false,
                email: formData.email,
                otp: formData.otp,
                isCustomer: "true",
            });
            if (result?.error) {
                alert('Invalid OTP. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/auth/otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, isCustomer: "true" }),
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
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a1a]">
                <div className="w-10 h-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        /* ── Page wrapper ── */
        <div className="flex min-h-[80%] items-center justify-center bg-gray-50 dark:bg-[#0a0a1a] px-4 py-20 mesh-bg">

            {/* ── Card ── */}
            <div className="flex w-full max-w-5xl mt-10 flex-col overflow-hidden rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.5)] glass-card lg:flex-row">

                {/* ════════════════════════════
                    LEFT PANEL
                ════════════════════════════ */}
                <div className="relative hidden flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#1e1b4b] p-12 lg:flex lg:w-[45%]">

                    {/* Dot grid overlay */}
                    <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(circle,rgba(255,255,255,0.065)_1px,transparent_1px)] [background-size:28px_28px]" />

                    {/* Radial glow overlays */}
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_30%_30%,rgba(129,140,248,0.18),transparent),radial-gradient(ellipse_50%_50%_at_70%_70%,rgba(167,139,250,0.14),transparent)]" />

                    {/* Corner blur blob */}
                    <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-blue-500/10 blur-[60px]" />

                    {/* Content */}
                    <div className="relative z-10 flex w-full flex-col items-center gap-8">

                        {/* Logo */}
                        <div className="flex items-center gap-3 self-start">
                            <LogoMark size="md" />
                            <span className="font-['Syne',sans-serif] text-lg font-bold tracking-tight text-white">
                                YourBrand
                            </span>
                        </div>

                        {/* Floating illustration */}
                        <div className="w-full animate-[float_5s_ease-in-out_infinite] [animation-name:float]">
                            <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}`}</style>
                            <LoginIllustration />
                        </div>

                        {/* Heading */}
                        <div className="space-y-3 text-center">
                            <h2 className="font-['Syne',sans-serif] text-2xl font-bold leading-snug text-white">
                                Welcome back —<br />glad to see you!
                            </h2>
                            <p className="mx-auto max-w-[270px] text-sm leading-relaxed text-white/40">
                                Sign in securely with your email and a one-time code.
                            </p>
                        </div>

                        {/* Social proof */}
                        <div className="flex items-center gap-3 rounded-2xl border border-white/[0.09] bg-white/[0.05] px-5 py-3">
                            <div className="flex">
                                {[
                                    { bg: 'bg-blue-400', letter: 'A' },
                                    { bg: 'bg-blue-400', letter: 'D' },
                                    { bg: 'bg-violet-300', letter: 'G' },
                                    { bg: 'bg-blue-500', letter: 'J' },
                                ].map(({ bg, letter }, i) => (
                                    <div
                                        key={letter}
                                        className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#1e1b4b] text-[10px] font-bold text-white ${bg} ${i !== 0 ? '-ml-2' : ''}`}
                                    >
                                        {letter}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-white">12,000+ members</p>
                                <p className="text-[10px] text-white/35">growing every day</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ════════════════════════════
                    RIGHT PANEL
                ════════════════════════════ */}
                <div className="flex-1 flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12 bg-white/50 dark:bg-transparent rounded-r-3xl">

                    {/* Mobile logo */}
                    <div className="flex items-center gap-2 mb-8 lg:hidden">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-500/30 border border-blue-500/20 dark:border-blue-400/40 flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="stroke-blue-600 dark:stroke-white">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="font-display text-gray-900 dark:text-white font-bold">YourBrand</span>
                    </div>

                    {/* Step indicator */}
                    <StepIndicator step={showOtpInput ? 2 : 1} />

                    {/* Heading */}
                    <div className="mb-7">
                        <h1 className="font-display text-3xl font-extrabold text-gray-900 dark:text-white mb-1.5">
                            {showOtpInput ? 'Check your inbox' : 'Sign in'}
                        </h1>
                        <p className="text-gray-500 dark:text-white/40 text-sm">
                            {showOtpInput
                                ? `Enter the 6-digit code sent to ${formData.email}`
                                : 'Enter your email address to receive a one-time code'}
                        </p>
                    </div>

                    {/* ── EMAIL FORM ── */}
                    {!showOtpInput ? (
                        <form onSubmit={handleSendOtp} className="space-y-4">
                            {field(
                                "email", "Email Address", "email", "you@example.com",
                                formData.email, (v) => setFormData({ ...formData, email: v }), { required: true }
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-1 w-full rounded-xl bg-blue-900 py-3.5 text-sm font-bold uppercase tracking-widest text-white shadow-[0_4px_24px_rgba(99,102,241,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(99,102,241,0.5)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading ? <Spinner /> : 'Send OTP →'}
                            </button>
                        </form>
                    ) : (
                        /* ── OTP FORM ── */
                        <form onSubmit={handleLogin} className="space-y-5">

                            {/* OTP notice */}
                            <div className="rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 p-4 flex gap-3 items-start">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" stroke="#6366f1" className="dark:stroke-[#818cf8]" strokeWidth="2" />
                                        <path d="M22 6l-10 7L2 6" stroke="#6366f1" className="dark:stroke-[#818cf8]" strokeWidth="2" />
                                    </svg>
                                </div>
                                <p className="text-blue-900 dark:text-blue-300 text-sm leading-relaxed">
                                    Check your inbox at <strong className="text-blue-700 dark:text-blue-200">{formData.email}</strong> for your one-time code.
                                    <br />
                                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1 block">
                                        💡 Default demo OTP: <strong>123456</strong>
                                    </span>
                                </p>
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="otp" className="block text-xs font-semibold tracking-widest uppercase text-gray-500 dark:text-white/50">6-Digit Code</label>
                                <input
                                    id="otp" type="text" placeholder="••••••"
                                    value={formData.otp} maxLength={6} required
                                    onChange={e => setFormData({ ...formData, otp: e.target.value })}
                                    className="w-full px-4 py-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/15
                                               focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-transparent focus:ring-1 focus:ring-blue-500/50 transition-all duration-200
                                               text-center text-xl font-mono tracking-[0.5em]"
                                />
                            </div>

                            <button type="submit" disabled={loading}
                                className="mt-1 w-full rounded-xl bg-blue-900 py-3.5 text-sm font-bold uppercase tracking-widest text-white shadow-[0_4px_24px_rgba(99,102,241,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(99,102,241,0.5)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50">
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Verifying…
                                    </span>
                                ) : 'Sign In →'}
                            </button>

                            <div className="flex items-center justify-between text-sm pt-1">
                                <button type="button" onClick={handleResendOtp} disabled={loading}
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition disabled:opacity-50 text-xs">
                                    Resend code
                                </button>
                                <button type="button" onClick={() => setShowOtpInput(false)}
                                    className="text-gray-500 dark:text-white/30 hover:text-gray-800 dark:hover:text-white/60 font-medium transition text-xs">
                                    ← Back
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Divider */}
                    {/* <div className="flex items-center gap-4 my-7">
                        <div className="flex-1 h-px bg-gray-200 dark:bg-white/8" />
                        <span className="text-gray-400 dark:text-white/25 text-xs font-semibold tracking-widest uppercase">or continue with</span>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-white/8" />
                    </div> */}

                    {/* Social buttons */}
                    {/* <div className="flex gap-3">
                        <button type="button" className="flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-200 shadow-sm dark:shadow-none text-sm font-medium">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                            </svg>
                            <span className="font-semibold text-gray-700 dark:text-white/70 text-xs">Google</span>
                        </button>
                        <button type="button" className="flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-200 shadow-sm dark:shadow-none text-sm font-medium">
                            <svg className="w-4 h-4 fill-gray-800 dark:fill-white/80" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                            </svg>
                            <span className="font-semibold text-gray-700 dark:text-white/70 text-xs">GitHub</span>
                        </button>
                    </div> */}

                    {/* Sign up link */}
                    <p className="text-center text-gray-500 dark:text-white/30 text-sm mt-8">
                        Don&apos;t have an account?{' '}
                        <Link
                            href={`/register?callbackUrl=${searchParams.get('callbackUrl') || ''}`}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition underline underline-offset-2">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginContent />
        </Suspense>
    );
}   