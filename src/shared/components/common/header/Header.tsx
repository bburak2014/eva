// src/components/common/header/Header.tsx
import { useLogoutMutation } from '@/features/auth/api/authApi';
import { toastManager } from '@/shared/utils/toastManager';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '@/features/auth/slice/authSlice';
import { RootState } from '@/app/store';

// Function to get the initials from a full name (e.g., "Jane Doe" -> "JD")
function getInitials(name: string) {
    const [firstName = '', lastName = ''] = name.split(' ');
    return (firstName[0] + (lastName[0] || '')).toUpperCase();
}

// Create a separate ProfileMenu component
const ProfileMenu: React.FC<{ userName: string }> = ({ userName }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const initials = getInitials(userName);
    const [logoutMutation] = useLogoutMutation();
    const dispatch = useDispatch()
 
    const toggleProfileMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    const handleLogout = async () => {
        try {
            await logoutMutation().unwrap();
            toastManager.showToast('Logout success!', 'success', 3000);

            dispatch(logout());
        } catch (error) {
            toastManager.showToast('Logout failed!', 'error', 3000);
        }
        setMenuOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={toggleProfileMenu}
                className="focus:outline-none cursor-pointer flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold"
            >
                {initials}
            </button>

            {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-md z-10">
                    <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen((prev) => !prev);
    const user = useSelector((state: RootState) => state.dashboard.user);

    // Define the navigation links for the menu
    const navItems = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Profile', path: '/profile' },
        { name: 'Settings', path: '/settings' },
        { name: 'Contact', path: '/contact' },
    ];

    const userName = `${user?.firstName} ${user?.lastName}`;

    return (
        <header className="relative">
            <div className="bg-gradient-to-r from-purple-50 to-gray-100 shadow-md">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <img
                        src="images/logo.png"
                        alt="eva-logo"
                        height={60}
                        width={60}
                    />

                    {/* Desktop Menu + Profile Avatar */}
                    <div className="hidden md:flex items-center space-x-6">
                        <nav className="flex space-x-6">
                            {navItems.map((item, index) => (
                                <Link
                                    key={index}
                                    to={item.path}
                                    className="relative text-gray-700 font-medium hover:text-purple-700 transition duration-300 cursor-pointer"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    {item.name}
                                    <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-purple-700 transition-all duration-500 hover:w-full"></span>
                                </Link>
                            ))}
                        </nav>
                        {/* Profile Menu Component (Avatar with Initials) */}
                        <ProfileMenu userName={userName} />
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-3">
                        <button
                            onClick={toggleMenu}
                            className="focus:outline-none cursor-pointer"
                        >
                            <svg
                                className={`w-8 h-8 text-purple-700 transition-transform duration-500 ${isOpen ? 'rotate-90' : 'rotate-0'
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {isOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                        {/* Profile Avatar for Mobile */}
                        <ProfileMenu userName={userName} />
                    </div>
                </div>
            </div>

            {/* Mobile Menu (Collapsible) */}
            <div
                className={`md:hidden bg-gradient-to-r from-purple-50 to-purple-100 overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
                    {navItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.path}
                            className="text-gray-700 font-medium hover:text-purple-700 transition duration-300"
                            onClick={() => setIsOpen(false)}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            </div>
        </header>
    );
};

export default Header;
