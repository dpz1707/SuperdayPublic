import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getUserData } from "../../components/awsAuth";
import DashboardMenu from "../../components/dashboard/dashboardMenu";
import DashboardProfile from "../../components/dashboard/dashboardProfile";
import DashboardFeatureSection from '../../components/dashboard/dashboardFeatureSection';
import { useAuth0 } from "@auth0/auth0-react";
import SignInSignOutButton from '../../components/signInSignOut/signInSignOutButton';
import EditInfo from '../../components/dashboard/editInfo';
import { useNavigate } from 'react-router-dom';
import LogoWhite from '../../images/logoWhite.svg'
import Logo from '../../images/logo.svg'
import Nav from '../../pages/nav/nav';
import InternWithUs from '../../components/InternWithUs'
import DashboardStatCard from '../../components/DashboardStatCard';
import EmailsToSendPopup from '../../components/emailsToSendPopup/emailsToSendPopup';

let feature1Title = 'Position Alerts';
let feature2Title = 'Auto Recruiting';
let feature3Title = 'Coffee Chats';

let feature1Description = 'Get summaries of all internship openings in your niche.';
let feature2Description = 'Auto reach out to smaller and niche firms for off the market jobs.';
let feature3Description = "Auto send coffee chat requests to alumni at target companies.";

export default function Dashboard(props) {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth0();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const editProfilePage = location.pathname === '/dashboard/profile';
    const [isMobile, setIsMobile] = useState(false);
    const [needsUploadCoffeeChat, setNeedsUploadCoffeeChat] = useState(false);
    const [needsUploadNetwork, setNeedsUploadNetwork] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            getUserData(user?.email)
                .then(data => {
                    setUserData(data); // Assuming data contains the user data you want to use
                    setIsLoading(false); // Update loading state    
                    if (!data?.industry) {
                        navigate('/onboard'); // Navigate to the onboard route
                        window.location.reload(); // Refresh the page
                    }

                    // Check if a premium user does not have data uploaded
                    if (data.subscription == 1 || data.subscription == 2) {
                        if (data.paragraph_coffee_chat === '') {
                            setNeedsUploadCoffeeChat(true);
                        } else {
                            setNeedsUploadCoffeeChat(false);
                        }
                        if (data.paragraph_network === '') {
                            setNeedsUploadNetwork(true);
                        } else {
                            setNeedsUploadNetwork(false);
                        }
                    }
                })
                .catch(err => {
                    return (<div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
                        <div className="bg-[#f8fbff] rounded-xl shadow-lg text-gray-800 p-12 relative flex justify-center flex-col items-center" style={{ maxWidth: '500px' }}>
                            Log in to view dashboard
                            <br></br>
                            <br></br>
                            <SignInSignOutButton title='Sign in or create account'></SignInSignOutButton>
                        </div></div>)
                });
        } else {
            setIsLoading(authLoading); // Reflect auth loading state
        }
    }, [user?.email, isAuthenticated, authLoading, navigate]);

    if (window.innerWidth < 600) {
        return (<div>
            <Nav></Nav>
            <div className='flex justify-center items-center h-[90vh] flex-col px-16'>
                <img src={Logo} className='h-16 block'></img>
                <br></br>
                <h1 className='text-3xl font-medium'>Sorry about this</h1>
                <p className='flex justify-center items-center text-center mt-3'>To access your dashboard, please visit this page on your computer.</p>
            </div>
        </div>)
    }

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen bg-black text-white">
            <img src={LogoWhite}></img>
        </div>;
    }

    if (editProfilePage) return (
        <EditInfo></EditInfo>
    )

    if (!editProfilePage) return (
        <div className="flex min-w-[1200px]">
            <DashboardMenu></DashboardMenu>
            {userData.emails_to_send.length > 0 && (
                <EmailsToSendPopup emailsAvailable={userData.emails_to_send.length}></EmailsToSendPopup>
            )
            }

            {isLoading ? (
                <div>Loading user data...</div>
            ) : (
                <div className='w-full'>
                    <DashboardProfile userData={userData}></DashboardProfile>
                    <div className='px-12 pb-12'>
                        <div className='flex w-full mt-8'>
                            <DashboardStatCard></DashboardStatCard>
                            <InternWithUs></InternWithUs>
                        </div>
                        <div className="grid grid-cols-3" style={{ gap: '40px' }}>
                            <DashboardFeatureSection featureNumber={1} title={feature1Title} description={feature1Description} />
                            <DashboardFeatureSection featureNumber={2} title={feature2Title} description={feature2Description} />
                            <DashboardFeatureSection featureNumber={3} title={feature3Title} description={feature3Description} />
                        </div>
                    </div>
                </div>
            )}
            {(needsUploadCoffeeChat || needsUploadNetwork) && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div className="bg-[#f8fbff] rounded-xl shadow-lg text-gray-800 p-12 relative flex justify-start flex-col items-start" style={{ maxWidth: '500px' }}>
                        <h1 className='text-3xl mb-4'>Missing Information</h1>
                        <p className='mb-4'>Please upload the missing info to continue:</p>
                        <div className='w-full flex justify-center items-center'>
                            <ul className="list-disc my-4 text-lg font-medium">
                                {needsUploadCoffeeChat && <li>Coffee chat email</li>}
                                {needsUploadNetwork && <li>Recruiting email</li>}
                            </ul>
                        </div>
                        <Link to='/settings' className="z-10 mt-4 text-sm relative inline-block py-3 w-[175px] text-center border-white bg-black text-white border rounded-full hover:bg-[#f8fbff] hover:text-black hover:border-black">
                            Update profile
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
