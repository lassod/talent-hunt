'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    MdBarChart,
    MdPeople,
    MdHowToVote,
    MdChevronRight,
    MdPerson,
    MdMenu,
    MdClose
} from 'react-icons/md';
import {FaRegClock} from 'react-icons/fa6';
import logo from "@public/Logo.png"

interface MenuItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    path: string;
}

interface AdminUser {
    user_id: string;
    email: string;
    first_name: string;
    last_name: string;
    image_url?: string;
}

interface AdminSidebarProps {
    activeItem?: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
                                                       activeItem = 'results',
                                                   }) => {
    const [selectedItem, setSelectedItem] = useState<string>(activeItem);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [user, setUser] = useState<AdminUser | null>(null);

    const menuItems: MenuItem[] = [
        {
            id: 'results',
            label: 'Results',
            icon: <MdBarChart className="w-5 h-5" />,
            path: '/voting/admin/results'
        },
        {
            id: 'contestants',
            label: 'Contestants',
            icon: <MdPeople className="w-5 h-5" />,
            path: '/voting/admin/contestants'
        },
        {
            id: 'timeline',
            label: 'Timeline',
            icon: <FaRegClock className="w-5 h-5" />,
            path: '/voting/admin/timeline'
        },
        {
            id: 'voters',
            label: 'Voters',
            icon: <MdHowToVote className="w-5 h-5" />,
            path: '/voting/admin/voters'
        }
    ];

    // Get user data from localStorage
    useEffect(() => {
        try {
            const adminUser = localStorage.getItem('admin_user');
            if (adminUser) {
                const userData: AdminUser = JSON.parse(adminUser);
                setUser(userData);
            }
        } catch (error) {
            console.error('Error parsing admin user data:', error);
        }
    }, []);

    // Generate initials from first and last name
    const getInitials = (firstName: string, lastName: string): string => {
        return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
    };

    // Close mobile menu when clicking on a menu item
    const handleMenuItemClick = (itemId: string) => {
        setSelectedItem(itemId);
        setIsMobileMenuOpen(false);
    };

    // Close mobile menu when clicking overlay
    const handleOverlayClick = () => {
        setIsMobileMenuOpen(false);
    };

    const SidebarContent = () => (
        <div className="h-full bg-[#011308] text-white flex flex-col shadow-xl">
            {/* Header */}
            <div className="p-6 border-b border-green-900/50">
                <div className="flex items-center gap-3 mb-2">
                    <Image
                        src={logo}
                        alt="Logo"
                        className="w-8 h-8"
                    />
                    <div>
                        <h1 className="text-lg font-semibold text-white">
                            Oyoyo Star Hunt
                        </h1>
                        <p className="text-xs text-green-200 mt-1">
                            Admin dashboard
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 py-6">
                <ul className="space-y-2 px-4">
                    {menuItems.map((item) => {
                        const isActive = selectedItem === item.id;
                        return (
                            <li key={item.id}>
                                <Link href={item.path} passHref>
                                    <button
                                        onClick={() => handleMenuItemClick(item.id)}
                                        className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 relative group ${
                                            isActive
                                                ? 'bg-[#033515] text-white shadow-md'
                                                : 'text-green-100 hover:bg-[#033515]/50 hover:text-white'
                                        }`}
                                    >
                                        {/* White bar on active */}
                                        {isActive && (
                                            <span className="absolute left-0 top-0 h-full w-1 bg-white rounded-r"></span>
                                        )}

                                        <div className="flex items-center gap-3 pl-2">
                                            <span className={isActive ? 'text-white' : 'text-green-300'}>
                                                {item.icon}
                                            </span>
                                            <span className="font-medium">{item.label}</span>
                                        </div>

                                        <MdChevronRight
                                            className={`w-4 h-4 transition-transform duration-200 ${
                                                isActive
                                                    ? 'text-white transform translate-x-1'
                                                    : 'text-green-400 group-hover:text-white group-hover:translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-green-900/50 mt-auto">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#033515]/40">
                    {user?.image_url ? (
                        <img
                            src={user.image_url}
                            alt={`${user.first_name} ${user.last_name}`}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : user ? (
                        <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                                {getInitials(user.first_name ?? 'n', user.last_name ?? 'n')}
                            </span>
                        </div>
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center">
                            <MdPerson className="w-5 h-5 text-white" />
                        </div>
                    )}

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                            {user ? `${user.first_name} ${user.last_name}` : 'Admin User'}
                        </p>
                        <p className="text-xs text-green-200 truncate">
                            {user?.email || 'admin@example.com'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#011308]/30 text-black rounded-lg shadow-lg hover:bg-[#033515] transition-colors"
                aria-label="Open menu"
            >
                <MdMenu className="w-6 h-6" />
            </button>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block fixed left-0 top-0 h-screen w-64 z-40">
                <SidebarContent />
            </div>

            {/* Mobile Sidebar */}
            <div
                className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
                    isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
            >
                {/* Overlay */}
                <div
                    className="absolute inset-0 bg-black bg-opacity-50"
                    onClick={handleOverlayClick}
                />

                {/* Sidebar */}
                <div
                    className={`absolute left-0 top-0 h-full w-64 transform transition-transform duration-300 ease-in-out ${
                        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <SidebarContent />

                    {/* Close Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="absolute top-4 right-4 p-2 text-white hover:bg-[#033515]/50 rounded-lg transition-colors"
                        aria-label="Close menu"
                    >
                        <MdClose className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Main Content Spacer for Desktop */}
            <div className="hidden lg:block w-64 flex-shrink-0"></div>
        </>
    );
};

export default AdminSidebar;