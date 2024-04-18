import { Link } from 'react-router-dom';
import { useState } from 'react';
import { MdMailOutline, MdClose } from 'react-icons/md';

const EmailsToSendPopup = ({ emailsAvailable }) => {
    const [showEmailsToSendPopup, setShowEmailsToSendPopup] = useState(true);

    const handleClose = () => {
        setShowEmailsToSendPopup(false);
    };

    if (!showEmailsToSendPopup) {
        return null;
    }

    return (
        <div style={{ backgroundColor: 'rgba(0,0,0,0.3)' }} className="z-[999] h-[100vh] w-[100vw] fixed left-0 flex justify-center items-center flex-col">
            <div className="bg-white border border-gray-300 rounded-lg pt-10 pb-8 px-16 shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] flex flex-col items-center relative">
                <MdMailOutline className='text-[90px] mb-3'></MdMailOutline>
                <h1 className="font-medium text-2xl">
                    You have {emailsAvailable} Emails to Send
                </h1>
                <p className={`text-sm leading-6 text-gray-500 mt-3 mb-0 text-center max-w-[400px]`}>
                    Use your credits to send out emails. Click the button below to get started.
                </p>
                <Link to="/approve" rel="noopener noreferrer" className="inline-block text-sm border px-20 py-3 mt-6 mb-3 border-black rounded-full bg-black text-white font-medium hover:bg-transparent hover:text-black transition-colors duration-500 ease-in-out">
                    Send Emails
                </Link>
                <MdClose className="text-gray-400 absolute top-0 right-0 cursor-pointer text-[20px] mt-6 mr-6 hover:bg-transparent hover:opacity-50" onClick={handleClose} />
            </div>
        </div>
    );
};

export default EmailsToSendPopup;
