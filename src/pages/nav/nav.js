import * as React from 'react';
import { Link } from 'react-router-dom';
import './nav.css';
import { useState } from 'react';
import Logo from '../../images/logo.svg';
import SignInSignOutButton from '../../components/signInSignOut/signInSignOutButton.js'
import { useAuth0 } from "@auth0/auth0-react";

export default function Nav() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, isAuthenticated, isLoading: authLoading } = useAuth0();


    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        window.scroll({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
    };

    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className='border-b bg-white border-gray-300'>
            <div className='flex items-center pr-4 md:pr-10 lg:pr-15 xl:pr-30 2xl:pr-50'>
                <Link to='/' className='border-r border-gray-300 px-4 md:px-8 py-[18px] flex items-center justify-center' onClick={() => {
                    window.scroll({
                        top: 0,
                        left: 0,
                        behavior: "smooth",
                    });
                }}>
                    <div className='flex justify-center items-center'>
                        <img className='h-[24px]' src={Logo} alt="Logo"></img>
                        <h1 className='font-medium text-[21px] ml-[12px]'>Superday</h1>
                    </div>
                </Link>
                {/* Mobile View - SignIn Button next to Hamburger */}
                <div className='md:hidden ml-auto flex items-center'>
                    <div className='ml-2' onClick={toggleMobileMenu}>
                        {/* Conditionally render the SVG for the hamburger menu or "X" */}
                        {isMobileMenuOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-16 6h16" />
                            </svg>
                        )}
                    </div>
                </div>
                {/* Desktop View */}
                <div className='hidden md:flex flex-1 justify-end items-center'>
                    <div className='flex space-x-9 justify-center items-center'>
                        {isAuthenticated ? <Link to='/dashboard'>Dashboard</Link> : <></>}
                        <Link to="/#howitworks" className="text-inherit">How it Works</Link>

                        <Link to='/upgrade' onClick={() => {
                            window.scroll({
                                top: 0,
                                left: 0,
                                behavior: "smooth",
                            });
                        }}>Premium</Link>
                        <Link to="/contact" className="text-inherit">Contact</Link>
                        <SignInSignOutButton title='Sign In' location='nav'></SignInSignOutButton>
                    </div>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="flex justify-center w-full absolute bg-[#f8fbff] mt-[1px] py-4 border-b border-black">
                    <div className='flex flex-col items-center'>
                        <Link to='/' onClick={toggleMobileMenu}>Home</Link>
                        <Link to='/upgrade' onClick={toggleMobileMenu} className='my-4'>Upgrade</Link>
                        {isAuthenticated ? <Link to='/dashboard'>Dashboard</Link> : <></>}
                    </div>
                </div>
            )}
        </div>
    );
}
