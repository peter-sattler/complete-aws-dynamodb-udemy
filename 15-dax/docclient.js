/*
 * Use a Lambda function since VPC (virtual private cloud) doesn't
 * allow access to access the DAX cluster from code outside the VPC
 */
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1'});

//NOTE: Did not try this one since DAX is not on free tier!!!
const AmazonDaxClient = require('amazon-dax-client');
const dax = new AmazonDaxClient({
    endpoints: ['cluster-name-goes-here'],
    region: 'us-east-1'
});

const docClient = new AWS.DynamoDB.DocumentClient({
    service: dax
});

exports.handler = (event, context, callback) => {
    docClient.get({
        TableName: 'td_notes_test',
        Key: {
            user_id: event.user_id,               //docClient will convert to JSON automatically
            timestamp: parseInt(event.timestamp)  //docClient will convert to JSON automatically
        }
    }, (err, data) => {
        if (err)
            callback(err);
        else
            callback(null, data);
    });
};
