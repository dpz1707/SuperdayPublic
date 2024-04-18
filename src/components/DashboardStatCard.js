import React, { useEffect, useState } from 'react';
import { getUserData } from './awsAuth';
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from 'react-router-dom';

const DashboardStatCard = () => {
  const { user, isAuthenticated } = useAuth0();
  const [recruitingEmailsSent, setRecruitingEmailsSent] = useState(0); // Initialize with 0
  const [coffeeEmailsSent, setCoffeeEmailsSent] = useState(0); // Initialize with 0
  const [totalPositionsAlerted, setTotalPositionsAlerted] = useState(0); // Initialize with 0
  const [emailsToSend, setEmailsToSend] = useState(0); // Initialize with 0

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInformation = await getUserData(user.email);
        setCoffeeEmailsSent(userInformation.emails_to_send.filter((email) => email.email_type === 'coffee' && email.email_status === 'Sent').length);
        setRecruitingEmailsSent(userInformation.emails_to_send.filter((email) => email.email_type === 'network' && email.email_status === 'Sent').length);
        setTotalPositionsAlerted(userInformation.total_position_notifications);
        setEmailsToSend(userInformation.emails_to_send.length);
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };
    fetchData();
  }, [user.email]);

  return (
    <>
      {emailsToSend !== 0 && (
        <div className="bg-white p-8 border border-gray-300 h-[220px] min-w-[450px] w-[50%] mr-[40px] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] rounded-lg">
          <div className='flex'>
            <span className="relative flex justify-center items-center">
              <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-red-400 opacity-100"></span>
              <span className="relative inline-flex rounded-full h-8 w-8 bg-red-500 justify-center items-center">
                <h1 className="text-md font-medium text-white">{emailsToSend}</h1>
              </span>
            </span>
            <h1 className="font-medium text-2xl text-left w-full ml-3">
              Send Out Emails
            </h1>
          </div>

          <p className="text-sm leading-6 text-gray-500 mt-3 mb-0">You have {emailsToSend} email credits to use. To get started using these credits and send out emails, click the button below.</p>

          <Link to="/approve/all" className="inline-block text-sm border px-10 py-3 border-black rounded-full bg-black text-white font-medium mt-5 hover:bg-transparent hover:text-black transition-colors duration-500 ease-in-out">
            Send Emails
          </Link>
        </div>
      )}

      {emailsToSend == 0 && (
        <div className="bg-white p-8 border border-gray-300 h-[220px] min-w-[550px] w-[60%] mr-[40px] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] rounded-lg">
          <div className='flex'>
            <h1 className="font-medium text-2xl text-left w-full">
              Out of Emails for Today
            </h1>
          </div>

          <p className="text-sm leading-6 text-gray-500 mt-3 mb-0">You have {emailsToSend} email credits to use. Check back tomorrow for more or try a free week of premium to increase your limit.</p>

          <a href="https://buy.stripe.com/fZe4jK2nU95fauQ000" target='_blank' className="inline-block text-sm border px-10 py-3 border-black rounded-full bg-black text-white font-medium mt-5 hover:bg-transparent hover:text-black">
            Try Premium
          </a>
        </div>)}
    </>


  );
}

export default DashboardStatCard;
