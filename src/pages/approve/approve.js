import React, { useState, useMemo, useEffect, useCallback } from 'react';
import DashboardMenu from '../../components/dashboard/dashboardMenu';
import { AiFillDelete } from "react-icons/ai";
import { getUserData, removeItem, updateInfo, updateUserAttribute } from "../../components/awsAuth";
import { useAuth0 } from "@auth0/auth0-react";
import GoogleOAuthSendEmails from './GoogleOAuthSendEmails';
import { useLocation, useParams, Link } from 'react-router-dom';
import OnSuccessPopup from '../../components/OnSuccessPopup';


const { DynamoDBClient, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");


const AWS = require('aws-sdk');

export default function Approve(props) {
    const { user, isAuthenticated } = useAuth0();
    const [emailInfo, setEmailInfo] = useState([]);
    const [selectedEmails, setSelectedEmails] = useState([]);
    const [selectedEmailType, setSelectedEmailType] = useState('coffee');
    const [emailStatusUpdated, setEmailStatusUpdated] = useState(false);
    const [selectAll, setSelectAll] = useState(true);
    const [userParagraphCoffeeChat, setUserParagraphCoffeeChat] = useState('');
    const [userSubjectLine, setUserSubjectLine] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [copyStatus, setCopyStatus] = useState({});

    const awsCredentials = {
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
        region: process.env.REACT_APP_AWS_REGION,
    };

    const dynamoDBClient = new DynamoDBClient({
        credentials: awsCredentials,
        region: awsCredentials.region,
    });

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

    useEffect(() => {
        const fetchEmails = async () => {
            if (user?.email) {
                try {
                    let initialEmails = await getUserData(user?.email);
                    setUserParagraphCoffeeChat(initialEmails.paragraph_coffee_chat)
                    setUserSubjectLine(initialEmails.paragraph_subject_line)
                    initialEmails = initialEmails.emails_to_send;
                    setEmailInfo(initialEmails);
                    setSelectedEmails(initialEmails.filter(email => email.email_status == 'Unconfirmed'));
                } catch (error) {
                    console.log("Failed to fetch emails:", error);
                }
            }
        };
        fetchEmails();
    }, [user?.email]);

    const toggleAllEmails = useCallback(() => {
        if (!selectAll) {
            setSelectedEmails(emailInfo.filter(email => email.email_status === 'Unconfirmed'));
        } else {
            setSelectedEmails([]);
        }
        setSelectAll(!selectAll);
    }, [emailInfo, selectAll]);

    const toggleEmailSelection = (email, isChecked) => {
        if (isChecked) {
            setSelectedEmails(prev => [...prev, email]);
        } else {
            setSelectedEmails(prev => prev.filter(selectedEmail => selectedEmail.company_email !== email.company_email));
        }
    };

    const removeEmail = async (emailToRemove) => {
        setEmailInfo(prev => prev.filter(email => email.company_email !== emailToRemove.company_email));
        setSelectedEmails(prev => prev.filter(selectedEmail => selectedEmail.company_email !== emailToRemove.company_email));
        const clientEmail = user?.email
        removeItem(clientEmail, emailToRemove.company_email)
    };

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

    const SentEmails = ({ emails, title, selectedEmails, toggleEmailSelection, removeEmail }) => (
        <div className='mt-12'>
            <label htmlFor="selectedEmailType" className="mr-2 font-medium text-xl">Emails Sent</label>
            <div className="overflow-x-auto bg-white border-l border-r border-b mt-6">
                <table className="min-w-full leading-normal bg-white border border-gray-300 table-fixed">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '20%' }}>
                                Name
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '20%' }}>
                                Company
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '20%' }}>
                                Email
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '10%' }}>
                                Email Type
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '10%' }}>
                                Date Sent
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {emails
                            .filter(email => email.email_status === 'Sent')
                            .sort((a, b) => new Date(b.day_sent) - new Date(a.day_sent))
                            .map((email, index) => (
                                <tr key={index}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-left">
                                        {email.recipient_name}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-left">
                                        {email.company_name}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-left">
                                        {email.company_email}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-left">
                                        {email.email_type.charAt(0).toUpperCase() + email.email_type.slice(1)}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-left">
                                        {email.day_sent ? (
                                            <>
                                                <div>
                                                    {new Date(email.day_sent).toLocaleDateString('en-US', {
                                                        year: '2-digit', month: 'numeric', day: 'numeric'
                                                    })}
                                                </div>
                                                <div>
                                                    {new Date(email.day_sent).toLocaleTimeString('en-US', {
                                                        hour: 'numeric', minute: '2-digit', hour12: true
                                                    })}
                                                </div>
                                            </>
                                        ) : 'Not Sent'}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const DualEmailTable = React.memo(({ emails, selectedEmails, toggleEmailSelection, removeEmail }) => {
        const memoizedToggleEmailSelection = useCallback((email, isSelected) => {
            toggleEmailSelection(email, isSelected);
        }, [toggleEmailSelection]);

        const memoizedRemoveEmail = useCallback((email) => {
            removeEmail(email);
        }, [removeEmail]);

        return (
            <>
                <div className="mt-6 w-full flex justify-between items-center my-7">
                    <label htmlFor="selectedEmailType" className="mr-2 font-medium text-2xl">Emails to Approve</label>

                    {selectedEmailType !== undefined && selectedEmailType !== null ? (
                        <GoogleOAuthSendEmails
                            userEmail={user?.email}
                            fullName={user?.fullName}
                            allEmails={emailInfo}
                            emailsToUpdate={selectedEmails}
                            numToSend={selectedEmails.length}
                            selectedEmailType={selectedEmailType}
                        />
                    ) : (
                        <button
                            className={`px-8 py-2 rounded-3xl text-black ${selectedEmailType
                                ? 'bg-black text-white'
                                : 'border-black border'
                                }`}
                            onClick={
                                selectedEmailType
                                    ? async () => {
                                    }
                                    : () => {
                                        alert("Please select an email type before confirming.");
                                    }
                            }
                            disabled={!selectedEmailType}
                        >
                            {selectedEmailType ? "Confirm Selection" : "Select an Email Type"}
                        </button>

                    )}
                </div >

                <div className="overflow-x-auto bg-white border-l border-r border-b">
                    <table className="min-w-full bg-white border border-gray-300 table-fixed">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '20%' }}>
                                    Name
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '20%' }}>
                                    Company
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '20%' }}>
                                    Email
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '10%' }}>
                                    Position
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '10%' }}>

                                    <div className='flex'>
                                        <input type="checkbox" className="accent-[black] scale-[1.2] mr-3" checked={selectAll} onChange={toggleAllEmails} />
                                        Approve
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {emails.filter((email) => email.email_status == 'Unconfirmed' || email.email_status === 'Confirmed').map((email, index) => (
                                <tr key={index}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-left">
                                        {email.recipient_name}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-left">
                                        <a href={`https://www${email.company_email.substring(email.company_email.indexOf('@'))}`} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-50">
                                            {email.company_name}
                                        </a>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-left">
                                        {email.company_email}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-left">
                                        {email.role}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-left">
                                        <div className='flex'>
                                            <input
                                                type="checkbox"
                                                className={`accent-[black] scale-[1.2] mr-3 leading-tight checkbox-black-bg ${selectedEmails.some(selectedEmail => selectedEmail.company_email === email.company_email) ? 'checked' : ''}`}
                                                checked={selectedEmails.some(selectedEmail => selectedEmail.company_email === email.company_email)}
                                                onChange={() => memoizedToggleEmailSelection(email, !selectedEmails.some(selectedEmail => selectedEmail.company_email === email.company_email))}
                                            />
                                            <button onClick={() => memoizedRemoveEmail(email)} className="text-red-500 hover:text-red-700 text-2xl">
                                                <AiFillDelete />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div >
            </>
        );
    });

    return (
        <div className="flex min-w-[1200px] h-[100vh]">
            <DashboardMenu />
            <div className="w-full p-12 overflow-y-auto">
                {
                    showSuccessMessage ? (
                        <OnSuccessPopup showSuccessMessage={showSuccessMessage} successMessage={'Your profile has been updated.'}></OnSuccessPopup>
                    ) : null
                }
                <h1 className='text-4xl font-medium self-start border-b border-gray-400 py-5 mb-4'>Send Out Emails</h1>
                <form className="section" onSubmit={handleParagraphSubmitCoffeeChat}>
                    <div className='flex items-center w-full justify-between'>
                        <div>
                            <Link to='/settings/coffeeEmail' className='underline text-md hover:opacity-50'>Edit Email Template</Link>
                            <Link to='/settings/resume' className='underline ml-4 text-md hover:opacity-50'>Edit Resume</Link>
                        </div>
                        <button type="submit" className="mt-3 px-8 p-2 bg-transparent border border-black text-black rounded-full hover:border-black hover:bg-black hover:text-white transition-colors duration-500 ease-in-out">
                            Update Template
                        </button>
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
                        className="mt-2 p-2 border rounded w-full"
                        style={{ height: '140px' }}
                    />
                </form>

                <DualEmailTable
                    emails={emailInfo}
                    selectedEmails={selectedEmails}
                    toggleEmailSelection={toggleEmailSelection}
                    removeEmail={removeEmail}
                />

                <SentEmails
                    emails={emailInfo}
                    selectedEmails={selectedEmails}
                    toggleEmailSelection={toggleEmailSelection}
                    removeEmail={removeEmail}
                ></SentEmails>
            </div>
        </div>
    );
}