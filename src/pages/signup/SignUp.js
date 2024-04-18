import { useState, componentDidMount } from 'react';
import InternExampleVertical from '../../images/internExampleVertical.png';
import WhiteLogo from '../../images/logoWhite.svg'
import { Link } from 'react-router-dom'
import { addUser, getAllData, getUserData } from '../../components/awsAuth';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import SignInSignOutButton from '../../components/signInSignOut/signInSignOutButton';



export default function SignUp() {

    const navigate = useNavigate();
    // State to track the email
    const [email, setEmail] = useState('');
    // State to keep track of the selected features
    const [selectedJobTypes, setSelectedJobTypes] = useState([]);

    const handleJobTypeSelect = (jobType) => {
        setSelectedJobTypes(prevSelectedJobTypes => {
            if (prevSelectedJobTypes.includes(jobType)) {
                return prevSelectedJobTypes.filter(item => item !== jobType);
            } else {
                return [...prevSelectedJobTypes, jobType];
            }
        });
    };

    return (
        <div className="flex flex-col items-center justify-center relative h-screen w-full">
            <div className="w-full h-full grid grid-cols-1 md:grid-cols-2">
                <Link to={'/'} onClick={window.scroll({
                    top: 0,
                    left: 0,
                    behavior: "smooth",
                })}>
                    <div className="relative w-full h-[250px] md:h-full">
                        <div className='bg-black py-4 absolute bottom-0 w-full flex items-center justify-center z-30'>
                            <div className='flex items-center justify-center'>
                                <img className="h-[23px]" src={WhiteLogo}></img>
                                <h1 className="text-white text-[25px] ml-3">Superday</h1>
                            </div>
                        </div>
                        <img src={InternExampleVertical} alt="Intern Example" className="absolute w-full h-full object-cover" />
                    </div>
                </Link>

                <div className="flex items-center justify-center bg-[#f8fbff] py-12">
                    <div className="w-full max-w-lg px-6">
                        <div className="space-y-7">
                            <h1 className='font-medium text-[32px] md:text-[40px] lg:text-[50px] tracking-tight leading-tight md:leading-snug lg:leading-[115%]'>Sign up</h1>
                            <div className="flex flex-wrap -mx-3 mb-2">
                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <input className="max-sm:text-sm appearance-none block w-full border rounded-sm py-3 px-4 leading-tight" placeholder="First name"></input>
                                </div>
                                <div className="w-full md:w-1/2 px-3">
                                    <input className="max-sm:text-sm appearance-none block w-full border rounded-sm py-3 px-4 leading-tight" placeholder="Last name"></input>
                                </div>
                            </div>
                            <p>Select all positions you're looking to recruit for.</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="max-sm:text-xs max-sm:py-3 hover:cursor-pointer border border-black rounded-md py-2 flex justify-center items-center" onClick={() => handleJobTypeSelect('Software Engineering')} style={{ backgroundColor: selectedJobTypes.includes('Software Engineering') ? 'black' : 'transparent' }}>
                                    <span className={` ${selectedJobTypes.includes('Software Engineering') ? 'text-white' : 'text-gray-600'}`}>Software Engineering</span>
                                </div>
                                <div className="max-sm:text-xs max-sm:py-3 hover:cursor-pointer border border-black rounded-md py-2 flex justify-center items-center" onClick={() => handleJobTypeSelect('Investment Banking')} style={{ backgroundColor: selectedJobTypes.includes('Investment Banking') ? 'black' : 'transparent' }}>
                                    <span className={` ${selectedJobTypes.includes('Investment Banking') ? 'text-white' : 'text-gray-600'}`}>Investment Banking</span>
                                </div>
                                <div className="max-sm:text-xs max-sm:py-3 hover:cursor-pointer border border-black rounded-md py-2 flex justify-center items-center" onClick={() => handleJobTypeSelect('Private Equity')} style={{ backgroundColor: selectedJobTypes.includes('Private Equity') ? 'black' : 'transparent' }}>
                                    <span className={`${selectedJobTypes.includes('Private Equity') ? 'text-white' : 'text-gray-600'}`}>Private Equity</span>
                                </div>
                                <div className="max-sm:text-xs max-sm:py-3 hover:cursor-pointer border border-black rounded-md py- flex justify-center items-center" onClick={() => handleJobTypeSelect('Product Management')} style={{ backgroundColor: selectedJobTypes.includes('Product Management') ? 'black' : 'transparent' }}>
                                    <span className={` ${selectedJobTypes.includes('Product Management') ? 'text-white' : 'text-gray-600'}`}>Product Management</span>
                                </div>
                                <div className="max-sm:text-xs max-sm:py-3 hover:cursor-pointer border border-black rounded-md py-2 flex justify-center items-center" onClick={() => handleJobTypeSelect('UI/UX Design')} style={{ backgroundColor: selectedJobTypes.includes('UI/UX Design') ? 'black' : 'transparent' }}>
                                    <span className={` ${selectedJobTypes.includes('UI/UX Design') ? 'text-white' : 'text-gray-600'}`}>UI/UX Design</span>
                                </div>
                                <div className="max-sm:text-xs max-sm:py-3 hover:cursor-pointer border border-black rounded-md py-2 flex justify-center items-center" onClick={() => handleJobTypeSelect('Venture Capital')} style={{ backgroundColor: selectedJobTypes.includes('Venture Capital') ? 'black' : 'transparent' }}>
                                    <span className={` ${selectedJobTypes.includes('Venture Capital') ? 'text-white' : 'text-gray-600'}`}>Venture Capital</span>
                                </div>
                                <div className="max-sm:text-xs max-sm:py-3 hover:cursor-pointer border border-black rounded-md py-2 flex justify-center items-center" onClick={() => handleJobTypeSelect('Machine Learning')} style={{ backgroundColor: selectedJobTypes.includes('Machine Learning') ? 'black' : 'transparent' }}>
                                    <span className={` ${selectedJobTypes.includes('Machine Learning') ? 'text-white' : 'text-gray-600'}`}>Machine Learning</span>
                                </div>
                            </div>
                            {selectedJobTypes.length > 0 ?
                                <div>
                                    <p>Sign in with a .edu email address</p>
                                    <br></br>
                                    <SignInSignOutButton></SignInSignOutButton>


                                </div>
                                : <div></div>}

                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
