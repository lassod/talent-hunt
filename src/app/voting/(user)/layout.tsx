'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserLayoutProps {
    children: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        checkToken();
    }, []);

    const checkToken = (): void => {
        // Check for voting token
        const votingToken = localStorage.getItem('voting_token');

        if (!votingToken) {
            // No token found, redirect to home
            router.replace('/');
            return;
        }

        // Token exists, allow access
        setIsLoading(false);
    };

    // Show loading while checking token
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FFF5F5] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#ED120F] border-t-transparent"></div>
            </div>
        );
    }

    // Token verified, render children
    return children;
};

export default UserLayout;