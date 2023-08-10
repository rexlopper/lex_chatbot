/**
 * @fileoverview This file contains the class that will be used to communicate with lex
 *              thur the lex runtime.
 * @author Rex Von Brixon Aparece Apa-ap
 * @version 1.0.0
 * @module AmazonLexV2
 */
const AWS = require('aws-sdk');
const uniqid = require('uniqid');
const {LexRuntimeV2} = require('@aws-sdk/client-lex-runtime-v2');

/** This class instantiatiates a connection with LexV2.*/
module.exports = class AmazonLexV2 {
constructor() {
    this.botName = process.env['APP_BOT_ID'];
    this.alias = process.env['APP_BOT_ALIAS'];
    this.region = process.env['AWS_REGION'];
    this.locale = process.env['APP_LANGUAGE_CODE'];
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
/**
 * 
 * @param {String} textMessage Contains the message text that will be sent to lex.
 * @param {Number} sessionId Session ID of the connection.
 * @returns {Promise}
 */
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
                resolve(response);
            }
        })
    })
    }
}



