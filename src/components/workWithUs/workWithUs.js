const WorkWithUs = () => {
    return (
        <div className="py-[75px]">
            <div className="max-w-lg mb-4 px-4 text-center lg:max-w-2xl">
                <h1 className='my-5 font-medium text-[32px] md:text-[40px] lg:text-[50px] tracking-tight leading-tight md:leading-snug lg:leading-[115%]'>We're hiring at Superday.</h1>
                <p className='text-[16px] lg:text-[18px] opacity-70'>We’re always on the lookout for people who are ready to jump in and make a difference. If that sounds like you, let's talk!</p>
            </div>
            <div className="w-full flex items-center justify-center">
                <a href="https://calendly.com/superday-outreach/30min" target="_blank" rel="noopener noreferrer" className="inline-block text-sm border px-10 py-3 border-black rounded-full bg-black text-white font-medium mt-5 hover:bg-transparent hover:text-black transition-colors duration-500 ease-in-out">
                    Schedule a Call
                </a>
            </div>
        </div>
    )
}

export default WorkWithUs;