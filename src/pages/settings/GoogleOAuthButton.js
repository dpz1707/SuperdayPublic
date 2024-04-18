import { React, useState} from 'react';
import { GoogleLogin } from '@leecheuk/react-google-login';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const CLIENT_ID = "271206359168-68u3c65gfra9h808s04ceorjp56iredj.apps.googleusercontent.com";

const awsCredentials = {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_REGION,
};


const GoogleOAuthButton = ({ userEmail }) => {

    let navigate = useNavigate();
    const [state] = useState(uuidv4());
    const redirectUri = window.location.origin;

    const dynamoDbClient = new DynamoDBClient({
        credentials: awsCredentials,
        region: awsCredentials.region,
    });

    // Then correctly create the DynamoDB Document Client
    const docClient = DynamoDBDocumentClient.from(dynamoDbClient);
      
    const onSuccess = (response) => {
        console.log("Login Successful:");

        if (response.code) {
            console.log("Authorization Code:", response.code);
            console.log("State:", state);
            console.log("Redirect URI: ", redirectUri);

            const apiGatewayEndpoint = "https://ylqm1lgeud.execute-api.us-east-1.amazonaws.com/dev/token-exchange"
            
            fetch(apiGatewayEndpoint, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  code: response.code,
                  state: state,
                  redirect_uri: redirectUri,
                  email: userEmail
                })
              }).then(response => response.json())
                .then(data => console.log(data))
                .catch((error) => console.error('Error:', error));
              

            console.log("Authorization successful.");
        } else {
            console.log("No authorization code found in the response.");
        }
    };
    
    
    

    const onFailure = (response) => {
        console.error("Login Failed:", response);
    };

    return (
        <div>
            <GoogleLogin
                clientId={CLIENT_ID}
                buttonText="Login with Google"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                scope="https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid"
                isSignedIn={true}
                responseType="code" // Request an authorization code instead of tokens
                accessType="offline" // Necessary for obtaining a refresh token
                prompt="consent" // Force the prompt to ensure you get a refresh token
                redirectUri={redirectUri}
                render={renderProps => (
                    <button onClick={renderProps.onClick} disabled={renderProps.disabled}>Authorize Emails with Google</button>
                )}
                state={state}
            />
        </div>
    );
};

export default GoogleOAuthButton;
