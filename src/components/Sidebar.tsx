'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    MdBarChart,
    MdPeople,
    MdConfirmationNumber,
    MdHowToVote,
    MdChevronRight,
    MdPerson
} from 'react-icons/md';
import logo from "@public/Logo.png"

interface MenuItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    path: string;
}

interface AdminUser {
    name: string;
    email: string;
    avatar?: string;
}

interface AdminSidebarProps {
    activeItem?: string;
    user?: AdminUser;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
                                                       activeItem = 'results',
                                                       user = {
                                                           name: 'Segun Williams',
                                                           email: 'segunwilliams@gmail.com'
                                                       }
                                                   }) => {
    const [selectedItem, setSelectedItem] = useState<string>(activeItem);

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
            id: 'tickets',
            label: 'Tickets',
            icon: <MdConfirmationNumber className="w-5 h-5" />,
            path: '/voting/admin/tickets'
        },
        {
            id: 'voters',
            label: 'Voters',
            icon: <MdHowToVote className="w-5 h-5" />,
            path: '/voting/admin/voters'
        }
    ];

    return (
        <div className="fixed left-0 top-0 h-screen w-64 bg-[#011308] text-white flex flex-col shadow-xl z-50">

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
                                        onClick={() => setSelectedItem(item.id)}
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
                    {user.avatar ? (
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center">
                            <MdPerson className="w-5 h-5 text-white" />
                        </div>
                    )}

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user.name}</p>
                        <p className="text-xs text-green-200 truncate">{user.email}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;
