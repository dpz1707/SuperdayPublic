import React, { useState, useEffect } from 'react';
import Logo from '../../images/logo.svg'; // Ensure this path is correct
import { Link, NavLink } from 'react-router-dom';
import { IoHomeOutline } from "react-icons/io5";
import { GrUpgrade } from "react-icons/gr";
import { CgProfile } from "react-icons/cg";
import { MdMailOutline } from 'react-icons/md';
import SignInSignOutButton from '../signInSignOut/signInSignOutButton'; // Ensure this path is correct
import { getUserData } from '../../components/awsAuth'; // Ensure this path is correct
import { useAuth0 } from "@auth0/auth0-react";

export default function DashboardMenu(props) {
    const { user, isAuthenticated } = useAuth0();
    const [numberOfNotifs, setNumberOfNotifs] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [labelOpacity, setLabelOpacity] = useState(0); // State to control label opacity


    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user?.email) {
                    const userInformation = await getUserData(user.email);
                    setNumberOfNotifs(userInformation.emails_to_send.filter(email => email.email_status === 'Unconfirmed').length);
                }
            } catch (error) {
                console.error("Error fetching user information:", error);
            }
        };

        fetchData();
    }, [user?.email]);

    useEffect(() => {
        // When menu expands, fade in labels; when collapses, fade them out
        if (isExpanded) {
            setTimeout(() => setLabelOpacity(1), 100); // Delay allows the menu to start expanding before fading in
        } else {
            setLabelOpacity(0); // Instantly start fading out when menu starts collapsing
        }
    }, [isExpanded]);

    const handleMouseEnter = () => setIsExpanded(true);
    const handleMouseLeave = () => setIsExpanded(false);

    const baseStyle = {
        transition: 'width 0.3s ease-in-out',
        whiteSpace: 'nowrap',
        height: '100vh',
        borderRight: '1px solid #ccc',
        backgroundColor: '#fff',
    };

    // Adjust menuItemStyle based on isExpanded state
    const menuItemStyle = isExpanded ? {
        paddingLeft: '15px', // Add indentation when expanded
        display: 'flex',
        alignItems: 'center',
        width: '100%',
    } : {
        justifyContent: 'center', // Center content when not expanded
        display: 'flex',
        alignItems: 'center',
        width: '100%',
    };
    
    const iconStyle = 'text-lg mx-auto'; // Icon style remains the same for simplicity

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ ...baseStyle, width: isExpanded ? '180px' : '80px' }}
        >
            <div className="flex flex-col items-center text-black px-2 overflow-hidden">
                <Link to='/' className={`flex ${isExpanded ? 'justify-center' : 'justify-center'} items-center px-1 py-5 border-b border-gray-300 mb-5 w-full`}>
                    {!isExpanded && <img className="h-[20px]" src={Logo} alt="Logo" />}
                    {isExpanded && <><img className="h-[20px]" src={Logo} alt="Logo" /><h1 className="text-black text-[17px] ml-2">Superday</h1></>}
                </Link>
                {[
                    { to: '/dashboard', icon: <IoHomeOutline className={iconStyle} />, label: 'Dashboard' },
                    { to: '/approve', icon: <MdMailOutline className={iconStyle} />, label: 'Send Emails', notif: numberOfNotifs },
                    { to: '/upgrade', icon: <GrUpgrade className={iconStyle} />, label: 'Premium' },
                    { to: '/settings', icon: <CgProfile className={iconStyle} />, label: 'Settings' },
                ].map(({ to, icon, label, notif }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            isActive ? `bg-black rounded-xl text-white text-sm py-3 w-full` : `text-sm py-4 w-full hover:text-black`
                        }
                        style={menuItemStyle}
                    >
                        <span className={"flex items-center"}>
                            {to === '/approve' ? (
                                <>
                                    {notif === 0 ? icon : null}
                                    {notif > 0 && (
                                        <div className={`relative ${isExpanded ? '-ml-1' : ''}`}>
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500 justify-center items-center text-xs font-medium text-white">
                                                {notif}
                                            </span>
                                        </div>
                                    )}
                                    {isExpanded && <span className='ml-2'>{label}</span>}
                                </>
                            ) : (
                                <>
                                    {icon}
                                    {isExpanded && <span className='ml-2.5'>{label}</span>}
                                </>
                            )}

                        </span>
                    </NavLink>
                ))}
                {/*
                  <div className='w-full relative bottom-0 flex justify-center items-center'>
                    <div className='w-[100%] flex items-center justify-center py-4'>
                        <SignInSignOutButton location='justText'></SignInSignOutButton>
                    </div>
                </div>
                */}
            </div>

        </div>
    );
}
