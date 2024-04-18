import React from 'react';
import PricingTableColumn from "../../components/PricingTableColumn";

const starterFeatures = [
    'Send a 30+ coffee chat and recruiting emails per month',
    'Store up to 50 emails in reserve',
    'Receive email summaries of new positions',
    'Source data from 5+ job boards',
];

const essentialsFeatures = [
    'Send 120+ coffee chat and recruiting emails per month',
    'Store up to 100 emails in reserve',
    'Everything included in Starter tier',
];

const premiumFeatures = [
    'Everything included in Essentials tier',
    'Automatically email coffee chat requests to school alumni by company'
];

export default function UpgradePage() {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="max-w-lg mb-8 px-4 text-center lg:max-w-2xl">
                <h1 className='my-5 font-medium text-[32px] md:text-[40px] lg:text-[50px] tracking-tight leading-tight md:leading-snug lg:leading-[115%]'>Your edge for recruiting.</h1>
                <p className='text-[16px] lg:text-[18px] opacity-70'>Give yourself the best chance at landing your dream internship or job with our premium feature suite.</p>
            </div>
            <div className='w-full flex flex-wrap items-center justify-center px-12'>
                <PricingTableColumn title={'Starter'} price={0.00} subtitle={`Just getting started applying to internship positions.`} features={starterFeatures} />
                <PricingTableColumn title={'Premium'} price={9.99} subtitle={'Land an internship without ever having to apply.'} features={essentialsFeatures} recommended={true} priceID={'price_1P08GUGgKK69nhANTPoA4hQ2'} />
                {/*
                <PricingTableColumn title={'Premium'} price={49.99} subtitle={'The ultimate tool to get ahead in the internship process.'} features={premiumFeatures} priceID={''} />
                */}
            </div>
        </div>
    );
}
