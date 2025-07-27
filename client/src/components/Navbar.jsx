import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import assets from '../assets/assets';
import { useClerk, UserButton } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext.jsx";

const BookIcon = () => (
    <svg
        className="w-4 h-4 text-gray-700"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
    >
        <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4"
        />
    </svg>
);

const UserMenuItems = ({ navigate }) => (
    <UserButton.MenuItems>
        <UserButton.Action
            label="My Bookings"
            labelIcon={<BookIcon />}
            onClick={() => navigate('/my-bookings')}
        />
    </UserButton.MenuItems>
);

const Navbar = () => {
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Hotels', path: '/rooms' },
        { name: 'Experience', path: '/experience' },
        { name: 'About', path: '/about' },
    ];

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { openSignIn } = useClerk();
    const { user, isOwner, setShowHotelReg } = useAppContext();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(location.pathname !== '/' || window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Initial check
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${
                isScrolled ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"
            }`}
        >
            {/* Logo */}
            <Link to='/'>
                <img
                    src={assets.logo}
                    alt="Logo"
                    className={`h-9 ${isScrolled ? "filter-invert" : ""}`}
                />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-4 lg:gap-8">
                {navLinks.map((link, i) => (
                    <Link
                        key={i}
                        to={link.path}
                        className={`group flex flex-col gap-0.5 ${isScrolled ? "text-gray-700" : "text-white"}`}
                    >
                        {link.name}
                        <div
                            className={`${
                                isScrolled ? "bg-gray-700" : "bg-white"
                            } h-0.5 w-0 group-hover:w-full transition-all duration-300`}
                        />
                    </Link>
                ))}
                {user && (
                    <button
                        onClick={() => isOwner ? navigate('/owner') : setShowHotelReg(true)}
                        className={`border px-4 py-1 text-sm font-light rounded-full cursor-pointer ${
                            isScrolled ? 'text-black' : 'text-white'
                        } transition-colors duration-300`}
                    >
                        {isOwner ? 'Dashboard' : 'List your hotel'}
                    </button>
                )}
            </div>

            {/* Desktop Right */}
            <div className="hidden md:flex items-center gap-4">
                <img
                    src={assets.searchIcon}
                    alt="Search"
                    className={`h-7 ${isScrolled ? 'filter-invert' : ''}`}
                />
                {user ? (
                    <UserButton>
                        <UserMenuItems navigate={navigate} />
                    </UserButton>
                ) : (
                    <button
                        onClick={() => openSignIn()}
                        className="bg-black text-white px-8 py-2.5 rounded-full ml-4 transition-colors duration-300"
                    >
                        Login
                    </button>
                )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 md:hidden">
                {user && (
                    <UserButton>
                        <UserMenuItems navigate={navigate} />
                    </UserButton>
                )}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle mobile menu"
                    aria-expanded={isMenuOpen}
                >
                    <img
                        src={assets.menuIcon}
                        alt="Menu"
                        className={`h-4 ${isScrolled ? "filter-invert" : ""}`}
                    />
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-transform duration-500 ${
                    isMenuOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <button
                    className="absolute top-4 right-4"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Close mobile menu"
                >
                    <img src={assets.closeIcon} alt="Close menu" className="h-6" />
                </button>

                {navLinks.map((link, i) => (
                    <Link
                        key={i}
                        to={link.path}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        {link.name}
                    </Link>
                ))}

                {user && (
                    <button
                        onClick={() => {
                            isOwner ? navigate('/owner') : setShowHotelReg(true);
                            setIsMenuOpen(false);
                        }}
                        className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-colors duration-300"
                    >
                        {isOwner ? 'Dashboard' : 'List your hotel'}
                    </button>
                )}

                {!user && (
                    <button
                        onClick={() => {
                            openSignIn();
                            setIsMenuOpen(false);
                        }}
                        className="bg-black text-white px-8 py-2.5 rounded-full transition-colors duration-300"
                    >
                        Login
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;