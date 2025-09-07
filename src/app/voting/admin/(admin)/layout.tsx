'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('admin_access_token');
        if (!token) {
            router.replace('/voting/admin');   // kick out
        } else {
            setAuthorized(true);
        }
    }, [router]);

    // still loading → prevent flicker
    if (!authorized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <div className="lg:ml-64">
                <div>{children}</div>
            </div>
        </div>
    );
};

export default AdminLayout;