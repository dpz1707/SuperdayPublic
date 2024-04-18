const AWS = require('aws-sdk');

// Configure AWS credentials
AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_REGION
});


// Create a DynamoDB DocumentClient object
const docClient = new AWS.DynamoDB.DocumentClient();

export const addUser = async (_client_email, _subscription, _industry) => {

    function objectToList(obj) {
        return Object.values(obj).filter(value => typeof value === 'string');
    }

    const params = {
        TableName: "internify",
        Item: {
            client_email: String(_client_email),
            subscription: String(_subscription),
            industry: objectToList(_industry),
            paragraph_coffee_chat: String(''),
            paragraph_network: String(''),
            s3Uri: String(''),
            emails_to_send: [],
            access_token: String(''),
            refresh_token: String('')
        }
    }

    docClient.put(params, (err, data) => {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
            console.log("Put operation completed."); // Add this line for debugging
        }
    });

}


export const getAllData = async () => {
    console.log("Getting data")
    const params = {
        TableName: "internify",
    };

    try {
        const data = await docClient.scan(params).promise();
        console.log("Scan succeeded.");
        console.log("Retrieved items:", JSON.stringify(data.Items, null, 2));
    } catch (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    }
};

export const getUserData = async (_client_email) => {
    console.log(`Getting data for client_email: ${_client_email}`);

    const params = {
        TableName: "internify",
        Key: {
            client_email: String(_client_email),
        }
    };

    try {
        const data = await docClient.get(params).promise();
        console.log("Get operation succeeded.");
        if (data.Item) {
            return (data.Item);
        } else {
            console.log("No item found with the given client_email.");
        }
    } catch (err) {
        console.error("Unable to get the item. Error JSON:", JSON.stringify(err, null, 2));
    }
};

export const addUserIndustries = async (_client_email, _subscription, _industry) => {
    console.log(`Adding or updating industries for client_email: ${_client_email}`);
    const paramsGet = {
        TableName: "internify",
        Key: {
            client_email: _client_email,
        }
    };

    try {
        const data = await docClient.get(paramsGet).promise();
        if (data.Item) {
            // User exists, update their industry list
            console.log("User exists. Updating industry list.");
            const paramsUpdate = {
                TableName: "internify",
                Key: {
                    client_email: _client_email,
                },
                UpdateExpression: "set industry = :i",
                ExpressionAttributeValues: {
                    ":i": _industry,
                },
                ReturnValues: "UPDATED_NEW",
            };

            await docClient.update(paramsUpdate).promise();
            console.log("Updated user industry list.");
        } else {
            // User does not exist, create a new user with the provided details
            console.log("User does not exist. Creating new user with specified industry.");
            await addUser(_client_email, _subscription, _industry);
        }
    } catch (err) {
        console.error("Error accessing or updating the database:", JSON.stringify(err, null, 2));
    }
};

export const updateInfo = async (_client_email, infoToUpdate, infoValue) => {
    console.log('Updating information for ', _client_email);

    try {
        const paramsGet = {
            TableName: "internify",
            Key: {
                client_email: _client_email,
            },
        };

        // Check if the item exists
        const data = await docClient.get(paramsGet).promise();
        if (data.Item) {
            console.log("User exists. Updating the info.");
            const updateExpression = `set ${infoToUpdate} = :value`;
            const paramsUpdate = {
                TableName: "internify",
                Key: {
                    client_email: _client_email,
                },
                UpdateExpression: updateExpression,
                ExpressionAttributeValues: {
                    ":value": infoValue,
                },
                ReturnValues: "UPDATED_NEW",
            };

            // Perform the update
            const updateResult = await docClient.update(paramsUpdate).promise();
            console.log("Updated user info:", updateResult);
        } else {
            console.log("User does not exist. No update performed.");
        }
    } catch (err) {
        console.error("Error accessing or updating the database:", err);
    }
};

export const removeItem = async (_client_email, _infoToUpdate) => {
    try {
        const paramsGet = {
            TableName: "internify",
            Key: {
                client_email: _client_email,
            },
        };
        const data = await docClient.get(paramsGet).promise();

        if (data.Item && data.Item.emails_to_send) {
            // Filter out the email to remove
            const updatedEmailsToSend = data.Item.emails_to_send.filter(email => email.company_email !== _infoToUpdate);

            // Update the item in DynamoDB
            const updateParams = {
                TableName: "internify",
                Key: {
                    client_email: _client_email
                },
                UpdateExpression: "SET emails_to_send = :updatedEmailsToSend",
                ExpressionAttributeValues: {
                    ":updatedEmailsToSend": updatedEmailsToSend
                }
            };

            await docClient.update(updateParams).promise();
            console.log("Email removed successfully.");
        } else {
            console.log("Item not found or no emails to send.");
        }
    } catch (err) {
        console.error("Error accessing or updating the database:", err);
    }
}

export const updateUserAttribute = async (client_email, attributeName, newValue) => {
    console.log(`Updating ${attributeName} for client_email: ${client_email} with new value: ${newValue}`);

    const params = {
        TableName: "internify",
        Key: {
            client_email: client_email,
        },
        UpdateExpression: `set ${attributeName} = :newValue`,
        ExpressionAttributeValues: {
            ":newValue": newValue,
        },
        ReturnValues: "UPDATED_NEW",
    };

    try {
        const result = await docClient.update(params).promise();
        console.log(`Successfully updated ${attributeName} for ${client_email}.`, JSON.stringify(result, null, 2));
    } catch (err) {
        console.error(`Error updating ${attributeName} for ${client_email}:`, JSON.stringify(err, null, 2));
    }
};


export const upsertUser = async (_client_email, attributes) => {
    console.log(`Upserting user with email: ${_client_email}`);

    const apiGatewayEndpointOnboard = "https://4jm67j0ms1.execute-api.us-east-2.amazonaws.com/default/onboarding1"

    const item = {
        client_email: _client_email,
        ...attributes
    };

    const params = {
        TableName: "internify",
        Item: item
    };

    try {
        await docClient.put(params).promise();
        console.log("Successfully upserted user:", JSON.stringify(item, null, 2));
    } catch (err) {
        console.error("Error upserting user:", JSON.stringify(err, null, 2));
    }

    try {
        const onboardResponse = await fetch(apiGatewayEndpointOnboard, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_email: _client_email
            })
        });

        if (!onboardResponse.ok) throw new Error('Onboard email sending failed');

        const responseData = await onboardResponse.json();
        console.log("Onboard email successfully sent:", responseData);
    } catch (error) {
        console.error("Error sending onboard email:", error);
    }
};

export const getRandomCompanies = async (industry) => {
    const companiesParams = {
      TableName: 'internify_companies',
      FilterExpression: 'industry = :industry',
      ExpressionAttributeValues: { ':industry': industry },
    };
  
    try {
      // Scan the table for companies in the given industry
      const companiesResponse = await docClient.scan(companiesParams).promise();
      const companies = companiesResponse.Items || [];
  
      // Shuffle the array and pick the first 10
      const selectedCompanies = companies.sort(() => 0.5 - Math.random()).slice(0, 5);
  
      // Map the selected companies into a simplified format
      const companyArray = selectedCompanies.map(company => {
        return {
          company_email: company.employee_email,
          company_name: company.company_name,
          industry: company.industry,
          recipient_name: company.employee_name,
          email_type: "coffee",
          email_status: "Unconfirmed",
          email_to_send: "https://example",
          day_sent: "timestamp",
          role: company.role,
        };
      });

  
      return companyArray;
  
    } catch (error) {
      console.error('Error retrieving random companies:', error);
      throw new Error('Error retrieving random companies.');
    }
  };

export const addToUserAttribute = async (client_email, attributeName, addedValue) => {
    console.log(`Incrementing ${attributeName} for client_email: ${client_email} by value: ${addedValue}`);

    const params = {
        TableName: "internify",
        Key: {
            client_email: client_email,
        },
        UpdateExpression: `set ${attributeName} = if_not_exists(${attributeName}, :startValue) + :addedValue`,
        ExpressionAttributeValues: {
            ":addedValue": addedValue,
            ":startValue": 0, // This sets the attribute to 0 if it does not exist
        },
        ReturnValues: "UPDATED_NEW",
    };

    try {
        const result = await docClient.update(params).promise();
        console.log(`Successfully incremented ${attributeName} for ${client_email}.`, JSON.stringify(result, null, 2));
        return result.Attributes; // Returns the updated attributes of the item
    } catch (err) {
        console.error(`Error incrementing ${attributeName} for ${client_email}:`, JSON.stringify(err, null, 2));
        throw err; // Rethrow the error to handle it in the calling function
    }
};