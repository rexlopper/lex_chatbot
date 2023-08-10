// const AWS = require('aws-sdk');
import AWS from 'aws-sdk';
import uniqid from 'uniqid';
import { LexRuntimeV2} from "@aws-sdk/client-lex-runtime-v2";
import dotenv from "dotenv";
dotenv.config({ silent: process.env.NODE_ENV === 'production' });


class AmazonLexV2 {
constructor() {
    this.botName = process.env['APP_BOT_ID'];
    this.alias = process.env['APP_BOT_ALIAS'];
    this.region = process.env['AWS_REGION'];
    this.locale = process.env['APP_LANGUAGE_CODE'];

    console.log(this.botName)
    console.log(this.alias)

    this.lexruntime = new LexRuntimeV2({
        region: process.env['AWS_REGION'],
        connectTimeout: 120000 * 10,
        timeout: 120000 * 10,
        credentials: new AWS.Credentials({
            accessKeyId: process.env['AWS_IAM_KEY'], 
            secretAccessKey: process.env['AWS_IAM_SECRET'],
            expired: false
        }),
        logger: 'error'
    })

}

async sendTextMessageToAWS(textMessage, sessionId) {
    return new Promise((resolve, reject) => {
        this.lexruntime.recognizeText({
            botAliasId: this.alias,
            botId: this.botName,
            text: textMessage,
            localeId: this.locale,
            sessionId: (sessionId) ? sessionId : uniqid()
        }, (err, response) => {
            if (err && err.message === "The session has been destroyed") {
                resolve(err.message);
            } else if (err) reject(err);        
            else {
                console.log(JSON.stringify(response, undefined, 2));
                resolve(response);
            }
        })
    })
}
}


var test = new AmazonLexV2();
import promptSync from 'prompt-sync';
const prompt = promptSync()
const message = prompt("Enter your message: ")
await test.sendTextMessageToAWS(message, "10000").then(data => {
    console.log(data)}
)

