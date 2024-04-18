import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUnlockAlt, FaLock } from "react-icons/fa";
import { useAuth0 } from "@auth0/auth0-react";
import { getUserData } from '../../components/awsAuth.js'
import BannerImage1 from '../../images/test4.jpg'
import BannerImage2 from '../../images/test2.jpg'
import BannerImage3 from '../../images/test.jpg'

const DashboardFeatureSection = ({ isEnabled, title, description, featureNumber }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isHovered2, setIsHovered2] = useState(false);
    const { user, isAuthenticated } = useAuth0();
    const [coffeeEmailsCount, setCofeeEmailsCount] = useState()
    const [recruitingEmailsCount, setRecruitingEmailsCount] = useState()
    const [recruitingEmailsSent, setRecruitingEmailsSent] = useState()
    const [coffeeEmailsSent, setCoffeeEmailsSent] = useState()


    {/*
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userInformation = await getUserData(user.email);
                setCofeeEmailsCount(userInformation.emails_to_send.filter((email) => email.email_type == 'coffee').filter(email => email.email_status == 'Unconfirmed').length);
                setRecruitingEmailsCount(userInformation.emails_to_send.filter((email) => email.email_type == 'network').filter(email => email.email_status == 'Unconfirmed').length);
                setCoffeeEmailsSent(userInformation.emails_to_send.filter((email) => email.email_type == 'coffee').filter(email => email.email_status == 'Sent').length);
                setRecruitingEmailsSent(userInformation.emails_to_send.filter((email) => email.email_type == 'network').filter(email => email.email_status == 'Sent').length);
            } catch (error) {
                console.error("Error fetching user information:", error);
            }
        };

        fetchData();
    }, [user.email]);
*/}

    const statsConfig = {
        1: {
            baseline: [],
            additional: [
                { label: 'Total Emails Sent', value: 0 },
            ],
        },
        2: {
            baseline: [],
            additional: [
                { label: 'Total Emails Sent', value: recruitingEmailsSent },
            ],
        },
        3: {
            baseline: [],
            additional: [
                { label: 'Total Emails Sent', value: coffeeEmailsSent },
            ],
        }
    };

    let stats = statsConfig[featureNumber];

    if (!stats) {
        console.error('Invalid feature number');
        stats = { baseline: [], additional: [] };
    }

    return (
        <div
            className={`my-8 h-[300px] bg-white rounded-lgtext-black border-gray-300 border shadow-[0px_0px_15px_0px_rgb(0,0,0,0.1)] rounded-lg`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex flex-col h-full relative">
                {featureNumber !== 1 && (
                    <div className="w-full flex justify-end absolute top-7 right-7 z-10"> {/* Full-width div with content aligned to the right */}
                        {(featureNumber === 2 && recruitingEmailsCount > 0) || (featureNumber === 3 && coffeeEmailsCount > 0) ? (
                            <div className='relative inline-flex items-center' onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} style={{ opacity: isHovered ? 0 : 1, transition: 'opacity 0.5s' }}>
                                <span className="relative flex justify-center items-center top-[140px] -right-1"> {/* Container for the notification */}
                                    <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-red-400 opacity-100"></span> {/* Ping effect */}
                                    <span className="relative inline-flex rounded-full h-8 w-8 bg-red-500 justify-center items-center"> {/* Notification badge */}
                                        <span className="text-md font-medium text-white">{featureNumber === 2 ? recruitingEmailsCount : coffeeEmailsCount}</span> {/* Notification count */}
                                    </span>
                                </span>
                            </div>
                        ) : null}
                    </div>
                )}

                <div className="absolute top-0 left-0 w-full" style={{ opacity: isHovered ? 0 : 1, transition: 'opacity 0.50s' }}>
                    <div className=''>
                        {/*
                        {featureNumber == 1 && (<FaRegBell className='text-4xl text-gray-900' />)}
                        {featureNumber == 2 && (<CgProfile className='text-4xl text-gray-900' />)}
                        {featureNumber == 3 && (<IoMailOutline className='text-4xl text-gray-900' />)}
                        */}
                        <img src={(() => {
                            switch (featureNumber) {
                                case 1: return BannerImage3;
                                case 2: return BannerImage2;
                                case 3: return BannerImage1;
                            }
                        })()} className='rounded-t-md w-full h-[120px] object-cover'></img>
                    </div>
                    <div className='px-7'>
                        <p className={`text-sm mt-5 font-semibold text-[#7FA990]`}>{'Active Now'}</p>
                        <h1 className="text-2xl font-medium mt-2 mb-4">{title}</h1>
                        <div className='border-[grey]'>
                            <p className={`text-sm mt-5 min-h-[80px] leading-6 ${isEnabled ? 'text-gray-500' : 'text-black'}`}>{description}</p>
                        </div>
                    </div>
                </div>

                {isHovered && (
                    <div className='h-full flex justify-center items-center'>
                        <div className='flex flex-col'>
                            <div className='space-y-4 flex flex-col'>
                                {featureNumber === 1 && (
                                    <Link to='/settings/selectedIndustries' className="z-10 text-sm relative inline-block py-3 w-[200px] text-center border-black text-black border rounded-full hover:bg-[black] hover:text-white hover:border-black transition-colors duration-500 ease-in-out">
                                        Edit Industries
                                    </Link>
                                )}
                                {(featureNumber === 2 || featureNumber === 3) && (
                                    ((featureNumber === 2 && recruitingEmailsCount > 0) || (featureNumber === 3 && coffeeEmailsCount > 0)) && (
                                        <Link to='/approve' className="z-10 text-sm relative inline-block py-3 w-[200px] text-center border-black text-black border rounded-full hover:text-white hover:border-black hover:bg-black transition-colors duration-500 ease-in-out">
                                            <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500 justify-center items-center mr-2"> {/* Notification badge */}
                                                <span className="text-sm font-small text-white">{featureNumber === 2 ? recruitingEmailsCount : coffeeEmailsCount}</span> {/* Notification count */}
                                            </span>
                                            Send Emails
                                        </Link>
                                    )
                                )}
                                {featureNumber === 2 && (
                                    <Link to='/settings/recruitingEmail' className="z-10 text-sm relative inline-block py-3 w-[200px] text-center border-black text-black border rounded-full hover:bg-[black] hover:text-white hover:border-black transition-colors duration-500 ease-in-out">
                                        Edit Recruiting Email
                                    </Link>
                                )}
                                {featureNumber === 3 && (
                                    <Link to='/settings/coffeeEmail' className="z-10 text-sm relative inline-block py-3 w-[200px] text-center border-black text-black border rounded-full hover:bg-[black] hover:text-white hover:border-black transition-colors duration-500 ease-in-out">
                                        Edit Coffee Chat Email
                                    </Link>
                                )}
                            </div>

                           
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardFeatureSection;
