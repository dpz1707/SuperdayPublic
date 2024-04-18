const { S3 } = require('aws-sdk');
const { DynamoDBClient, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const { GetCommand } = require("@aws-sdk/lib-dynamodb");

const dynamoDBClient = new DynamoDBClient({ region: "us-east-1" });
const s3 = new S3();

export async function addUserParagraph(email, paragraph) {
  const params = {
    TableName: "internify",
    Key: {
      client_email: { S: email }
    },
    UpdateExpression: "set paragraph = :p",
    ExpressionAttributeValues: {
      ":p": { S: paragraph }
    },
    ReturnValues: "UPDATED_NEW"
  };

  try {
    const command = new UpdateItemCommand(params);
    const response = await dynamoDBClient.send(command);
    console.log("Success", response);
  } catch (error) {
    console.error(error);
  }
}

// Example usage
//const email = "sb7671@nyu.edu";
//const paragraph = "Hi, my name is Sean Balakhanei and I'm a recent graduate from New York University.";
//addUserParagraph(email, paragraph);

export async function addUserResume(email, file, fileName) {
    
    // 1. Upload resume PDF to S3 and get S3 URI
    const params_s3 = {
        Bucket: 'internify-resumes',
        Key: fileName,
        Body: file,
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
                client_email: { S: email },
            },
            UpdateExpression: 'set s3Uri = :s',
            ExpressionAttributeValues: {
                ':s': { S: s3Uri },
            },
            ReturnValues: 'ALL_NEW',
        };

        const command = new UpdateItemCommand(params_dynamoDB);
        const response = await dynamoDBClient.send(command);
        console.log("UpdateItem succeeded:", JSON.stringify(response, null, 2));
    } catch (err) {
        console.error("Error:", err);
    }
}

// Example usage
//const resumeFilePath = path.join(__dirname, 'exampleResume.pdf');
//const fileName = 'exampleResume.pdf';
//addUserResume("sb7671@nyu.edu", resumeFilePath, fileName);

export async function getParagraphByEmail(email) {
  const params = {
    TableName: "internify",
    Key: { client_email: email },
  };

  try {
    const data = await dynamoDBClient.send(new GetCommand(params));
    
    if (data.Item) {
      console.log("Item found:", data.Item.paragraph);
      return data.Item.paragraph; 
    } else {
      console.log("No item found with the email:", email);
      return null;
    }
  } catch (error) {
    console.error("Error fetching item:", error);
    throw error; 
  }
}

// Example usage
//getParagraphByEmail("sb7671@nyu.edu");