'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';   // <-- shadcn
import {
    MdOutlineVerifiedUser,
    MdVisibility,
    MdVisibilityOff,
    MdEmail,
    MdLock,
} from 'react-icons/md';
import logo from '@public/Logo.png';
import { ApiHelper } from '@/utlis/ApiHelper';
import type { ApiResponse } from '@/utlis/api.dtos';

/* ---------- types ---------- */
interface LoginUserData {
    user: { id: string; email: string };
    tokens: { accessToken: string; refreshToken: string };
}
interface LoginForm {
    email: string;
    password: string;
}
type LoginResponse = ApiResponse<LoginUserData>;

/* ---------- API ---------- */
const baseUrl = ApiHelper.getApiUrl();
const loginAdmin = async (credentials: LoginForm): Promise<LoginResponse> => {
    const res = await fetch(`${baseUrl}/v1/auth/login/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    const data: LoginResponse = await res.json();
    if (!res.ok) throw new Error(data.message || `HTTP error! status: ${res.status}`);
    return data;
};

/* ---------- component ---------- */
const AdminLogin: React.FC = () => {
    const router = useRouter();
    const { toast } = useToast();

    const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            toast({ title: 'Please fill in all fields', variant: 'destructive' });
            return;
        }

        try {
            setLoading(true);
            const res = await loginAdmin(form);

            if (res.success && res.data) {
                localStorage.setItem('admin_access_token', res.data.tokens.accessToken);
                localStorage.setItem('admin_refresh_token', res.data.tokens.refreshToken);
                localStorage.setItem('admin_user', JSON.stringify(res.data.user));

                toast({ title: 'Login successful! Welcome back.' });
                router.push('/voting/admin/results');
            } else {
                toast({ title: res.message || 'Login failed', variant: 'destructive' });
            }
        } catch (err: any) {
            console.error(err);
            toast({
                title: err.message || 'Network error',
                description: 'Check your connection and try again.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const togglePassword = () => setShowPassword((p) => !p);

    /* ── UI unchanged except error banner removed ── */
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage:
                        'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23f1f5f9\'%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'2\'/%3E%3C/g%3E%3C/svg%3E")',
                }}
            />

            <div className="w-full max-w-md relative z-10">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                                <Image src={logo} alt="Oyoyo Star Hunt Logo" width={40} height={40} />
                            </div>
                        </div>
                        <h1 className="text-2xl text-center font-bold text-white mb-2">Admin Portal</h1>
                        <div className="flex items-center justify-center gap-2 text-red-100">
                            <MdOutlineVerifiedUser className="w-5 h-5" />
                            <span className="text-sm font-medium">Oyoyo Star Hunt</span>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome back</h2>
                            <p className="text-gray-600 text-sm">
                                Sign in to access the admin dashboard
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MdEmail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="admin@oyoyostarhunt.com"
                                        disabled={loading}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MdLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        disabled={loading}
                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePassword}
                                        disabled={loading}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPassword ? (
                                            <MdVisibilityOff className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <MdVisibility className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center font-medium"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                        Signing in…
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-xs text-gray-500">
                                © 2024 Oyoyo Star Hunt. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        🔒 This is a secure admin portal. Unauthorized access is prohibited.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;