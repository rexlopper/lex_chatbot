var AWS = require('aws-sdk');
const { LexRuntimeV2 } = require("@aws-sdk/client-lex-runtime-v2");

const lexruntime = new LexRuntimeV2({ 
  region: process.env['AWS_REGION'],      // Set your Bot Region
  credentials: new AWS.Credentials({
    accessKeyId: process.env['AWS_IAM_KEY'],        // Add your access IAM accessKeyId
    secretAccessKey: process.env['AWS_IAM_SECRET']      // Add your access IAM secretAccessKey
  })     
});

export default lexruntime;

