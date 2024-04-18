import { BsArrowRight } from "react-icons/bs";
import { IoIosCloseCircle } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import InternExample from '../../images/internExampleVertical.png'
import { MdAccountCircle } from "react-icons/md";
import ValuePropStatSection from "./valuePropStatSection";

const ValueStats = () => {
    return (
        <div className="py-[75px] bg-white w-screen">
            <div className="w-full flex-col px-24 justify-start items-start">
                <div className="w-full flex items-center justify-between mb-12 felx-wrap">
                    <div className="mb-4 text-start w-[55%]">
                        <h1 className='my-5 font-medium text-[32px] md:text-[40px] lg:text-[50px] tracking-tight leading-tight md:leading-snug lg:leading-[115%]'>
                            See your odds at landing your dream internship.
                        </h1>
                        <p className='text-[16px] lg:text-[18px] opacity-70'>
                            Get real with your odds at landing your dream position. See your expectations vs reality for internship stats.
                        </p>
                        <a href="https://calendly.com/superday-outreach/30min" target="_blank" rel="noopener noreferrer" className="inline-block text-sm border px-14 py-3 border-black rounded-full bg-black text-white font-medium mt-8 hover:bg-transparent hover:text-black">
                            Calculate Your Odds
                        </a>
                    </div>
                    <div className="flex-shrink-0 w-[40%] h-[300px] relative overflow-hidden rounded-xl">
                        <img src={InternExample} alt="Internship Example" className="absolute w-full h-full object-cover" />
                    </div>
                </div>

                <ValuePropStatSection statType='numberOfApplications'></ValuePropStatSection>
                
            </div>
        </div>
    )
}

export default ValueStats