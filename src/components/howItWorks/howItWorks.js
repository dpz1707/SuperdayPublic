import React, { useState, useEffect } from 'react';
import SelectionSection from "../selectionSection";
import MailImage from '../../images/message.svg';
import Sent from '../../images/sent.svg';
import User from '../../images/user.svg';



export default function HowItWorks() {

    const [highlightedIndex, setHighlightedIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setHighlightedIndex(prevIndex => (prevIndex + 1) % 3); // Cycle through 0, 1, 2
        }, 2500); // Change the highlighted section every 2 seconds

        return () => clearInterval(interval);
    }, []);


    return (
        <div id = 'howitworks' className='flex items-center justify-center flex-col bg-black w-full text-white py-[100px] text-center'>
            <div className='flex items-center justify-center flex-col bg-black w-full text-white'>
            </div>

            <div className='mb-8'>
                <h1 className='font-medium text-large text-[32px] md:text-[40px] lg:text-[50px] tracking-tight leading-tight mb-4'>How it works</h1>
            </div>

            <div className='flex justify-center items-center'>
                <div className='flex mx-auto flex-wrap items-start justify-center md:max-w-[80%] lg:max-w-full'>
                    <SelectionSection title='Apply to niche firms' isHighlighted={highlightedIndex === 0} image={MailImage} content="Hedge your bets when applying. We help you reach out to smaller firms on your behalf to find you off the market jobs."></SelectionSection>
                    <SelectionSection title='Get notified right when positions open' isHighlighted={highlightedIndex === 1} image={Sent} content='Know when positions open. Recieve summaries of all openings and get alerts when top companies release positions.'></SelectionSection>
                    <SelectionSection title='Send coffee chat emails to alumni' isHighlighted={highlightedIndex === 2} image={User} content="Save time with coffee chats. Mass send coffee chat request emails to your school's alumni at target companies."></SelectionSection>
                </div>
            </div>

            <p className='text-[16px] lg:text-[18px] max-w-[600px] mx-auto mt-12 px-8 opacity-70'>On average these tools have saved our users around 30 hours or more a month.</p>
        </div>
    );
}