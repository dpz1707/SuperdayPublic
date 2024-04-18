import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import GreenButton from "../../components/CTAButton";
import FirmCarousel from "../../components/firmCarousel/firmCarousel";
import ExampleInternPhoto from '../../images/exampleintern.png';
import HowItWorks from '../../components/howItWorks/howItWorks';
import { useAuth0 } from "@auth0/auth0-react";
import SignInSignOutButton from '../../components/signInSignOut/signInSignOutButton';
import ValueStats from '../../components/valueProps/valueProps';
import ValuePropStatSection from '../../components/valueProps/valuePropStatSection';
import WorkWithUs from '../../components/workWithUs/workWithUs'


export default function Home() {
    const { isAuthenticated } = useAuth0();

    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location]);

    return (
        <div className='pt-[50px] max-sm:pt-6 flex justify-center items-center flex-col'>
            <div className='my-2 flex flex-col-reverse lg:flex-row justify-center items-start max-w-[1200px]'>
                <div className='w-full lg:w-2/5 text-left mt-4 lg:mt-0 px-8 lg:px-0'>
                    <h1 className='max-sm:my-3 my-5 font-medium text-[32px] md:text-[40px] lg:text-[48px] tracking-tight leading-tight md:leading-snug lg:leading-[115%]'>Send 200+ coffee chat emails in 1 click</h1>
                    <p className='text-[16px] max-sm:mb-8 mb-10 lg:text-[18px] opacity-70'><b>1 referral</b> → <b>5x your odds </b> at an internship. Send personalized emails to hundreds of professionals and get more referrals.</p>
                    {isAuthenticated ? (
                        <Link to='/dashboard' onClick={() => {
                            window.scroll({
                                top: 0,
                                left: 0,
                                behavior: "smooth",
                            });
                        }} className='border-black border bg-black text-white max-sm:px-18 px-24 py-3 font-medium text-md rounded-full hover:bg-transparent hover:text-black transition-colors duration-500 ease-in-out'>
                            View Dashboard
                        </Link>
                    ) : (
                        <SignInSignOutButton title='Sign up'></SignInSignOutButton>
                    )}
                </div>
                <div className='max-sm:justify-start max-sm:pl-8 w-full lg:w-2/5 flex justify-center items-start px-4 lg:px-0'>
                    <img src={ExampleInternPhoto} alt="Example Intern" className='max-sm:w-[250px] max-w-[300px] md:max-w-[300px] lg:max-w-[375px] h-auto' />
                </div>
            </div>
            <FirmCarousel />
            <HowItWorks />
            {/*<ValueStats></ValueStats>
            <ValuePropStatSection></ValuePropStatSection>
            */}
            <WorkWithUs></WorkWithUs>
        </div>
    )
}
