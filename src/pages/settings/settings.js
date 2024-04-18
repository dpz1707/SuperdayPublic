import React, { useEffect, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { getUserData } from "../../components/awsAuth";
import DashboardMenu from "../../components/dashboard/dashboardMenu";
import { useAuth0 } from "@auth0/auth0-react";
import SignInSignOutButton from '../../components/signInSignOut/signInSignOutButton';
import { useNavigate } from 'react-router-dom';
import LogoWhite from '../../images/logoWhite.svg'
import { IoAlertCircle } from "react-icons/io5";
import { addUser, addUserIndustries, updateInfo } from "../../components/awsAuth";
import { FiCopy } from "react-icons/fi"; // For the copy icon
import OnSuccessPopup from '../../components/OnSuccessPopup.js'

const { S3 } = require('aws-sdk');
const { DynamoDBClient, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");

const awsCredentials = {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_REGION,
};

export default function Settings(props) {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth0();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Consolidated loading state
    const location = useLocation();
    const editProfilePage = location.pathname === '/dashboard/profile';
    const navigate = useNavigate();
    const [selectedJobTypes, setSelectedJobTypes] = useState([]);
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [university, setUniversity] = useState('');
    const [year_in_school, setYearInSchool] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const { settingName } = useParams();
    const [selectedSetting, setSelectedSetting] = useState(settingName)

    const dynamoDBClient = new DynamoDBClient({
        credentials: awsCredentials,
        region: awsCredentials.region,
    });
    const s3 = new S3({
        credentials: awsCredentials,
        region: awsCredentials.region,
    });

    const handleJobTypeSelect = (jobType) => {
        setSelectedJobTypes(prevSelectedJobTypes => {
            if (prevSelectedJobTypes.includes(jobType)) {
                return prevSelectedJobTypes.filter(item => item !== jobType);
            } else {
                return [...prevSelectedJobTypes, jobType];
            }
        });
    };

    const [copySuccess, setCopySuccess] = useState('');
    const [copyStatus, setCopyStatus] = useState({});

    const copyToClipboard = async (text, variableKey) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopyStatus(prevStatus => ({ ...prevStatus, [variableKey]: true }));

            setTimeout(() => {
                setCopyStatus(prevStatus => ({ ...prevStatus, [variableKey]: false }));
            }, 1000);
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    };

    const variables = [
        { key: '[their_first_name]', description: "Recipient's first name" },
        { key: '[their_last_name]', description: "Recipient's last name" },
        { key: '[first_name]', description: "Your first name" },
        { key: '[last_name]', description: "Your last name" },
        { key: '[year_in_school]', description: "Grade level (i.e., freshman)" },
        { key: '[university]', description: "Your school's name" },
        { key: '[relevant_industry]', description: "Recipient industry (i.e. investment banking)" },
        { key: '[their_company]', description: "Recipient's company (i.e. Goldman Sachs)" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (isAuthenticated && user) {
                    const userData = await getUserData(user.email);
                    const industries = userData.industry;
                    setSelectedJobTypes(industries);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchData();
    }, [isAuthenticated, user]);


    const submitToDB = () => {
        addUserIndustries(user.email, 0, selectedJobTypes).then(() => {
            console.log("Success");
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
        }).catch(error => console.error("Error adding user industries:", error));
    };

    const [userParagraphCoffeeChat, setUserParagraphCoffeeChat] = useState('');
    const [userSubjectLine, setUserSubjectLine] = useState('');
    const [userParagraphNetwork, setUserParagraphNetwork] = useState('');
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeFilename, setResumeFilename] = useState('');

    const extractFilenameFromS3Uri = (s3Uri) => {
        if (!s3Uri) return '';
        const parts = s3Uri.split('/');
        return parts.pop();
    };

    const viewResume = async () => {
        if (!resumeFilename) {
            alert('No resume uploaded.');
            return;
        }

        const params = {
            Bucket: 'internify-resumes', // Your S3 Bucket name
            Key: `resumes/${resumeFilename}`, // Construct the file key within your bucket
            Expires: 60, // Link expiration time in seconds
        };

        try {
            const url = await s3.getSignedUrlPromise('getObject', params);
            window.open(url, '_blank'); // Open the URL in a new tab
        } catch (error) {
            console.error('Error generating signed URL:', error);
            console.log('Failed to generate resume link.');
        }
    };


    useEffect(() => {
        if (isAuthenticated) {
            getUserData(user?.email)
                .then(data => {
                    setUserData(data); // Assuming data contains the user data you want to use
                    setIsLoading(false); // Update loading state 

                    const filename = extractFilenameFromS3Uri(data?.s3Uri);
                    setResumeFilename(filename);

                    // Check if data.industry does not exist
                    if (!data?.industry) {
                        navigate('/onboard'); // Navigate to the onboard route
                        window.location.reload(); // Refresh the page
                    }
                    setUserParagraphCoffeeChat(data.paragraph_coffee_chat || ''); // Use empty string if not available
                    setUserSubjectLine(data.paragraph_subject_line || ''); // Use empty string if not available
                    setUserParagraphNetwork(data.paragraph_network || ''); // Use empty string if not available
                    setFirstName(data.first_name || ''); // Use empty string if not available
                    setLastName(data.last_name || ''); // Use empty string if not available
                    setUniversity(data.custom_university || ''); // Use empty string if not available
                    setYearInSchool(data.year_in_school || ''); // Use empty string if not available
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


    if (!isAuthenticated) {
        return (<div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-[#f8fbff] rounded-xl shadow-lg text-gray-800 p-12 relative flex justify-center flex-col items-center text-center" style={{ maxWidth: '700px' }}>
                <h1 className='text-3xl mb-4'>Login Error</h1>
                You're currently not signed in or do not have an account.
                <br></br>
                <br></br>
                <SignInSignOutButton title='Sign in or create account'></SignInSignOutButton>
            </div></div>)
    }

    const handleParagraphSubmitCoffeeChat = async (event) => {
        event.preventDefault();

        const params = {
            TableName: "internify",
            Key: {
                client_email: { S: user.email }
            },
            UpdateExpression: "set paragraph_coffee_chat = :p, paragraph_subject_line = :s",
            ExpressionAttributeValues: {
                ":p": { S: userParagraphCoffeeChat },
                ":s": { S: userSubjectLine }
            },
            ReturnValues: "UPDATED_NEW"
        };

        try {
            const command = new UpdateItemCommand(params);
            const response = await dynamoDBClient.send(command);
            console.log("Success", response);
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
        } catch (error) {
            console.error(error);
            console.log("Error");
        }
    };

    const handleParagraphSubmitNetwork = async (event) => {
        event.preventDefault();

        const params = {
            TableName: "internify",
            Key: {
                client_email: { S: user.email }
            },
            UpdateExpression: "set paragraph_network = :p",
            ExpressionAttributeValues: {
                ":p": { S: userParagraphNetwork }
            },
            ReturnValues: "UPDATED_NEW"
        };

        try {
            const command = new UpdateItemCommand(params);
            const response = await dynamoDBClient.send(command);
            console.log("Success", response);
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
        } catch (error) {
            console.error(error);
            console.log("Error");
        }
    };

    const handleResumeSubmit = async (event) => {
        event.preventDefault();

        if (resumeFile) {
            const fileName = `resumes/${user.email}-${Date.now()}.pdf`;

            const params_s3 = {
                Bucket: 'internify-resumes',
                Key: fileName,
                Body: resumeFile,
                ContentType: 'application/pdf',
            };

            try {
                const uploadResponse = await s3.upload(params_s3).promise();
                console.log('Upload Successful', uploadResponse);
                const s3Uri = `s3://${params_s3.Bucket}/${params_s3.Key}`;

                // 2. Update user DB entry using email to add s3URI
                const params_dynamoDB = {
                    TableName: 'internify',
                    Key: {
                        client_email: { S: user.email },
                    },
                    UpdateExpression: 'set s3Uri = :s',
                    ExpressionAttributeValues: {
                        ':s': { S: s3Uri },
                    },
                    ReturnValues: 'ALL_NEW',
                };

                const command = new UpdateItemCommand(params_dynamoDB);
                const response = await dynamoDBClient.send(command);
                setShowSuccessMessage(true);
                setTimeout(() => setShowSuccessMessage(false), 3000);
            } catch (err) {
                console.error("Error:", err);
                console.log("Error");
            }

        }
    };

    const updateBasicInfo = async () => {
        await updateInfo(user.email, 'first_name', first_name)
        await updateInfo(user.email, 'last_name', last_name)
        await updateInfo(user.email, 'university', university)
        await updateInfo(user.email, 'year_in_school', year_in_school)
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
    }

    const handleFileChange = (event) => {
        setResumeFile(event.target.files[0]);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen bg-black text-white">
            <img src={LogoWhite}></img>
        </div>;
    }

    return (
        <div className="flex overflow-x-hidden min-w-[1200px]">
            <DashboardMenu></DashboardMenu>
            <div className="w-full p-12 h-[100vh] overflow-y-scroll">
                <h1 className='text-4xl font-medium self-start'>Account Settings</h1>
                <p className='border-b border-gray-400 py-5 '>Click on the Send Emails button and log in with your desired sender email to instantly send all emails out.</p>

                <div className='flex border-b mb-10 py-5 border-gray-400'>
                    <Link to="/settings/basicInfo" className={`px-8 p-2 rounded-md border text-sm ${settingName === 'basicInfo' ? 'bg-black text-white' : 'bg-transparent text-black'} hover:bg-black hover:text-white border-black`}>Profile</Link>
                    <Link to="/settings/selectedIndustries" className={`ml-4 px-6 p-2 rounded-md border text-sm ${settingName === 'selectedIndustries' ? 'bg-black text-white' : 'bg-transparent text-black'} hover:bg-black hover:text-white border-black`}>Industries</Link>
                    {/*<Link to="/settings/recruitingEmail" className={`ml-4 px-6 p-2 rounded-md border text-sm ${settingName === 'recruitingEmail' && userParagraphNetwork ? 'bg-black text-white' : !userParagraphNetwork ? 'bg-red-500 text-white border-red-500' : 'bg-transparent text-black'} hover:bg-black hover:text-white border-black hover:border-black`}>Recruiting Email Template</Link>*/}
                    <Link to="/settings/coffeeEmail" className={`ml-4 px-6 p-2 rounded-md border text-sm ${settingName === 'coffeeEmail' && userParagraphCoffeeChat ? 'bg-black text-white' : !userParagraphCoffeeChat ? 'bg-red-500 text-white border-red-500' : 'bg-transparent text-black'} hover:bg-black hover:text-white border-black hover:border-black`}>Email Template</Link>
                    <Link to="/settings/resume" className={`ml-4 px-6 p-2 rounded-md border text-sm ${settingName === 'resume' && resumeFilename ? 'bg-black text-white' : !resumeFilename ? 'bg-red-500 text-white border-red-500' : 'bg-transparent text-black'} hover:bg-black hover:text-white border-black hover:border-black`}>Resume</Link>
                </div>

                {settingName == 'basicInfo' && (
                    <div>
                        <h1 className='text-2xl font-medium self-start'>Basic Information</h1>
                        <p className='py-5'>This information will be used for basic account info and emails.</p>

                        <div className="flex flex-wrap w-[70%]">
                            <div className="w-full md:w-1/2 mb-4 md:pr-2"> {/* Add some padding or margin on the right for medium screens and above */}
                                <input
                                    className="w-full border border-gray-300 rounded-md py-2 px-4"
                                    placeholder="First name" // Assuming `first_name` variable holds the placeholder text, or it's an actual value.
                                    value={first_name}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>

                            <div className="w-full md:w-1/2 mb-4 md:mb-0 md:pl-2"> {/* Optionally add padding on the left for the last name input */}
                                <input
                                    className="w-full border border-gray-300 rounded-md py-2 px-4"
                                    placeholder="Last name"
                                    value={last_name}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                            <div className="w-full mb-4">
                                <input
                                    className="w-full border border-gray-300 rounded-md py-2 px-4"
                                    placeholder="University name"
                                    value={university}
                                    onChange={(e) => setUniversity(e.target.value)}
                                />
                            </div>
                            <div className="w-full mb-4">
                                <select
                                    className="border border-gray-300 rounded-md py-2 px-4 w-full"
                                    aria-label="Year in school"
                                    value={year_in_school}
                                    onChange={(e) => setYearInSchool(e.target.value)}
                                >
                                    <option value="" disabled hidden>Year in school</option>
                                    <option value="freshman">Freshman</option>
                                    <option value="sophomore">Sophomore</option>
                                    <option value="junior">Junior</option>
                                    <option value="senior">Senior</option>
                                </select>
                            </div>
                            <button
                                className="px-8 p-2 bg-black text-white rounded-full border border-transparent hover:border-black hover:bg-[transparent] hover:text-black transition-colors duration-500 ease-in-out"
                                onClick={updateBasicInfo}
                            >
                                Update Profile Info
                            </button>
                        </div>
                    </div>
                )}

                {settingName == 'selectedIndustries' &&
                    <div className="w-full">
                        <h1 className='text-2xl font-medium self-start'>Your Industries</h1>
                        <p className='py-5'>You'll receive position notifications and send recruiting and coffee chat emails for these industries.</p>

                        <div className="space-y-7">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="max-sm:text-xs text-sm max-sm:py-3 hover:cursor-pointer border border-black rounded-lg py-2 flex justify-center items-center" onClick={() => handleJobTypeSelect('Software Engineering')} style={{ backgroundColor: selectedJobTypes.includes('Software Engineering') ? 'black' : 'transparent' }}>
                                    <span className={` ${selectedJobTypes.includes('Software Engineering') ? 'text-white' : 'text-gray-600'}`}>Software Engineering</span>
                                </div>
                                <div className="max-sm:text-xs text-sm max-sm:py-3 hover:cursor-pointer border border-black rounded-lg py- flex justify-center items-center" onClick={() => handleJobTypeSelect('Product Management')} style={{ backgroundColor: selectedJobTypes.includes('Product Management') ? 'black' : 'transparent' }}>
                                    <span className={` ${selectedJobTypes.includes('Product Management') ? 'text-white' : 'text-gray-600'}`}>Product Management</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="max-sm:text-xs text-sm max-sm:py-3 hover:cursor-pointer border border-black rounded-lg py-2 flex justify-center items-center" onClick={() => handleJobTypeSelect('Consulting')} style={{ backgroundColor: selectedJobTypes.includes('Consulting') ? 'black' : 'transparent' }}>
                                    <span className={` ${selectedJobTypes.includes('Consulting') ? 'text-white' : 'text-gray-600'}`}>Consulting</span>
                                </div>
                                <div className="max-sm:text-xs text-sm max-sm:py-3 hover:cursor-pointer border border-black rounded-lg py-2 flex justify-center items-center" onClick={() => handleJobTypeSelect('Investment Banking')} style={{ backgroundColor: selectedJobTypes.includes('Investment Banking') ? 'black' : 'transparent' }}>
                                    <span className={` ${selectedJobTypes.includes('Investment Banking') ? 'text-white' : 'text-gray-600'}`}>Investment Banking</span>
                                </div>
                                <div className="max-sm:text-xs text-sm max-sm:py-3 hover:cursor-pointer border border-black rounded-lg py-2 flex justify-center items-center" onClick={() => handleJobTypeSelect('UI/UX Design')} style={{ backgroundColor: selectedJobTypes.includes('UI/UX Design') ? 'black' : 'transparent' }}>
                                    <span className={` ${selectedJobTypes.includes('UI/UX Design') ? 'text-white' : 'text-gray-600'}`}>UI/UX Design</span>
                                </div>
                                <div className="max-sm:text-xs text-sm max-sm:py-3 hover:cursor-pointer border border-black rounded-lg py-2 flex justify-center items-center" onClick={() => handleJobTypeSelect('Venture Capital')} style={{ backgroundColor: selectedJobTypes.includes('Venture Capital') ? 'black' : 'transparent' }}>
                                    <span className={` ${selectedJobTypes.includes('Venture Capital') ? 'text-white' : 'text-gray-600'}`}>Venture Capital</span>
                                </div>
                            </div>
                            {selectedJobTypes.length > 0 ?
                                <div>
                                    <button className="px-8 p-2 bg-black text-white rounded-full border border-transparent hover:border-black hover:bg-[transparent] hover:text-black transition-colors duration-500 ease-in-out" onClick={submitToDB}> Update Industries</button>
                                </div>
                                : <div></div>}
                        </div>
                    </div>}

                {settingName == 'coffeeEmail' &&
                    <form className="section" onSubmit={handleParagraphSubmitCoffeeChat}>
                        <div className='flex items-center'>
                            {userParagraphCoffeeChat === '' && (
                                <div className="text-red-500 flex items-center text-3xl">
                                    <IoAlertCircle className="mr-2" />
                                </div>
                            )}
                            <h1 className='text-2xl font-medium'>Email Template</h1>
                        </div>

                        <p className='py-5'>Click on the variables below to add custom fields to your clipboard. This template will be sent to recipients that you're looking to coffee chat with.</p>
                        <div className="flex flex-wrap gap-2 my-2">
                            {variables.map((variable, index) => (
                                <button
                                    key={index}
                                    className="flex items-center bg-gray-200 hover:bg-gray-300 text-black rounded px-4 py-2"
                                    onClick={(e) => copyToClipboard(variable.key, variable.key)}
                                    type="button"
                                >
                                    <FiCopy className="ml-2" />
                                    <span className="ml-2 text-sm">{copyStatus[variable.key] ? 'Copied!' : variable.description}</span>
                                </button>
                            ))}
                        </div>

                        <textarea
                            value={userSubjectLine}
                            onChange={(e) => setUserSubjectLine(e.target.value)}
                            placeholder="Type your subject line here..."
                            className="mt-4 p-2 border rounded w-full"
                            style={{ height: '42px' }}
                        />

                        <textarea
                            value={userParagraphCoffeeChat}
                            onChange={(e) => setUserParagraphCoffeeChat(e.target.value)}
                            placeholder="Type your email template here..."
                            className="mt-4 p-2 border rounded w-full"
                            style={{ height: '200px' }}
                        />

                        <button type="submit" className="mt-3 px-8 p-2 bg-black text-white rounded-full border border-transparent hover:border-black hover:bg-[transparent] hover:text-black transition-colors duration-500 ease-in-out">
                            Update Email Template
                        </button>
                    </form>
                }

                {
                    showSuccessMessage ? (
                        <OnSuccessPopup showSuccessMessage={showSuccessMessage} successMessage={'Your profile has been updated.'}></OnSuccessPopup>
                    ) : null
                }

                {settingName == 'recruitingEmail' &&
                    <form className="section" onSubmit={handleParagraphSubmitNetwork}>
                        <div className='flex'>
                            {userParagraphNetwork === '' && (
                                <div className="text-red-500 flex items-center text-3xl">
                                    <IoAlertCircle className="mr-2" />
                                </div>
                            )}
                            <h1 className='text-2xl font-medium self-start'>Recruiting Email</h1>
                        </div>

                        <p className=' border-gray-400 py-5'>Click on the variables below to add custom fields to your clipboard. This template will be sent to recipients that you're looking to recruit for.</p>

                        <div className="flex flex-wrap gap-2 my-2">
                            {variables.map((variable, index) => (
                                <button
                                    key={index}
                                    className="flex items-center bg-gray-200 hover:bg-gray-300 text-black rounded px-4 py-2"
                                    onClick={(e) => copyToClipboard(variable.key, variable.key)}
                                    type="button"
                                >
                                    <FiCopy className="ml-2" />
                                    <span className="ml-2 text-sm">{copyStatus[variable.key] ? 'Copied!' : variable.description}</span>
                                </button>
                            ))}
                        </div>

                        <textarea
                            value={userParagraphNetwork}
                            onChange={(e) => setUserParagraphNetwork(e.target.value)}
                            placeholder="Type your email here..."
                            className="mt-4 p-2 border rounded w-full"
                            style={{ height: '200px' }}
                        />

                        <button type="submit" className="mt-3 px-8 p-2 bg-black text-white rounded-full border border-transparent hover:border-black hover:bg-[transparent] hover:text-black">
                            Update
                        </button>
                    </form>
                }

                {settingName == 'resume' &&
                    <form className="section" onSubmit={handleResumeSubmit} encType="multipart/form-data">
                        <div className='flex'>
                            {resumeFilename === '' && (
                                <div className="text-red-500 flex items-center text-3xl">
                                    <IoAlertCircle className="mr-2" />
                                </div>
                            )}
                            <h1 className='text-2xl font-medium self-start'>Resume Upload</h1>
                        </div>

                        <p className='border-gray-400 py-5'>This resume will be attached to emails that you send out, both for coffee chats and recruiting. It will be a PDF attachment.</p>

                        <div className="mb-3">
                            <label htmlFor="resumeUpload" className="block text-sm font-medium text-gray-700">
                                Upload your resume (PDF only):
                            </label>
                            <input
                                type="file"
                                id="resumeUpload"
                                name="resume"
                                onChange={handleFileChange}
                                accept="application/pdf"
                                className="mt-1 block w-full"
                            />
                        </div>
                        <div className='flex items-center mt-6'>
                            <button type="submit" className="px-8 p-2 bg-black text-white  border-black border rounded-full hover:border-black hover:bg-[transparent] hover:text-black hover:border transition-colors duration-500 ease-in-out">
                                Update Resume
                            </button>
                            <div onClick={viewResume}>
                                {resumeFilename ? (
                                    <div className='bg-transparent py-2 px-10 ml-4 border border-black rounded-lg'>
                                        <button>View Current Resume</button>
                                    </div>
                                ) : (
                                    <p className='ml-4'>No resume currently uploaded.</p>
                                )}
                            </div>

                        </div>
                    </form>
                }
            </div >
        </div >
    );
}