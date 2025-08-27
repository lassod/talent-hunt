'use client'
import React from 'react';
import Sidebar from "@/components/Sidebar";

interface AdminUser {
    name: string;
    email: string;
    avatar?: string;
}

interface AdminLayoutProps {
    children: React.ReactNode;
    activeMenuItem?: string;
    onNavigate?: (path: string) => void;
    user?: AdminUser;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
                                                     children,

                                                 }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar

            />

            {/* Main Content Area */}
            <div className="ml-64">
                {/* Content Container with Padding */}
                <div className="">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;