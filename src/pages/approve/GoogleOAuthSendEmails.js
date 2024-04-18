import React, { useState } from 'react';
import { GoogleLogin } from '@leecheuk/react-google-login';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { getUserData, updateUserAttribute, addToUserAttribute } from '../../components/awsAuth';
import { useAuth0 } from "@auth0/auth0-react";

const CLIENT_ID = "271206359168-68u3c65gfra9h808s04ceorjp56iredj.apps.googleusercontent.com";

const awsCredentials = { accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID, secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY, region: process.env.REACT_APP_AWS_REGION, };


const GoogleOAuthSendEmails = ({ userEmail, fullName, numToSend, emailsToUpdate, selectedEmailType, allEmails }) => {
    let navigate = useNavigate();
    const [state] = useState(uuidv4());
    const [loading, setLoading] = useState(false);
    const redirectUri = window.location.origin;
    const { user, isAuthenticated } = useAuth0();
    
    const dynamoDbClient = new DynamoDBClient({
        credentials: awsCredentials,
        region: awsCredentials.region,
    });

    const docClient = DynamoDBDocumentClient.from(dynamoDbClient);

    const onSuccess = (response) => {
        console.log("Login Successful:", response);
        setLoading(true);

        if (!response.code) {
            console.log("No authorization code found in the response.");
            setLoading(false);
            return;
        }

        const apiGatewayEndpointToken = "https://ylqm1lgeud.execute-api.us-east-1.amazonaws.com/dev/token-exchange";
        const apiGatewayEndpointEmail = "https://ylqm1lgeud.execute-api.us-east-1.amazonaws.com/dev/send-emails";

        (async () => {
            try {
                
                await updateEmails(emailsToUpdate, selectedEmailType, allEmails);

                const tokenResponse = await fetch(apiGatewayEndpointToken, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        code: response.code,
                        state: state,
                        redirect_uri: redirectUri,
                        email: userEmail // Make sure userEmail is correctly determined here
                    })
                });

                if (!tokenResponse.ok) throw new Error('Token exchange failed');
                const tokenData = await tokenResponse.json();
                console.log('Token Data:', tokenData);

                const emailTypes = selectedEmailType === 'all' ? ['coffee', 'network'] : [selectedEmailType];

                for (const type of emailTypes) {
                    const emailResponse = await fetch(apiGatewayEndpointEmail, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email_type: type,
                            full_name: fullName,
                            client_email: userEmail // Again, ensure userEmail is correctly defined
                        })
                    });

                    if (!emailResponse.ok) throw new Error(`Sending ${type} emails failed`);
                    const emailData = await emailResponse.json();
                    console.log(`${type} emails sent successfully:`, emailData);
                }

                setLoading(false);
                window.location.reload();
            } catch (error) {
                console.error('An error occurred:', error);
                setLoading(false);
            }
        })();
    };

    const onFailure = (response) => {
        console.error("Login Failed:", response);
        setLoading(false);
    };

    const updateEmails = async (emailsToUpdate, selectedEmailType, allEmails) => {
        let userEmail = user.email;
        let numConfirmedEmails = 0;

        const selectedEmailsSet = new Set(emailsToUpdate.map(email => email.company_email));

        // Update selected emails to Confirmed
        let updatedEmails = allEmails.map(email => {
            if (email.email_status === 'Sent') {
                // Leave "Sent" emails unchanged
                return email;
            } else if (selectedEmailsSet.has(email.company_email) && email.email_status === 'Unconfirmed') {
                numConfirmedEmails++;
                return {
                    ...email,
                    email_status: 'Confirmed',
                    email_type: selectedEmailType,
                    day_sent: new Date().toISOString()
                };
            } else if (!selectedEmailsSet.has(email.company_email)) {
                return {
                    ...email,
                    email_status: 'Unconfirmed'
                };
            }
            return email;
        });


        await updateUserAttribute(userEmail, 'emails_to_send', updatedEmails);

        // Update number of email sends attempted
        await addToUserAttribute(userEmail, 'email_sends_attempted', 1);

        // Update number of email credits remaining
        await addToUserAttribute(userEmail, 'num_unsent_emails', -numConfirmedEmails);
    };

    return (
        <div>
            {loading ? (
                <p className='text-white px-8 py-2 font-medium text-lg bg-red-500 rounded-full'>Sending... Please do not refresh.</p>
            ) : (
                <GoogleLogin
                    clientId={CLIENT_ID}
                    buttonText="Login with Google"
                    onSuccess={onSuccess}
                    onFailure={onFailure}
                    cookiePolicy={'single_host_origin'}
                    scope="https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid"
                    isSignedIn={true}
                    responseType="code"
                    accessType="offline"
                    prompt="consent"
                    redirectUri={redirectUri}
                    render={renderProps => (
                        <button className='border-black border bg-black px-8 py-2 rounded-3xl text-white hover:bg-transparent hover:text-black transition-colors duration-500 ease-in-out' onClick={renderProps.onClick} disabled={renderProps.disabled}>
                            Send Selected Emails ({numToSend})
                        </button>
                    )}
                    state={state}
                />
            )}
        </div>
    );
};

export default GoogleOAuthSendEmails;
