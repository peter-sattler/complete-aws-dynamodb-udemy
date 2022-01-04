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

exports.handler = (event, context, callback) => {
    dax.getItem({
        TableName: 'td_notes_test',
        Key: {
            user_id: {
                S: event.user_id.toString()    //JSON format requires text
            },
            timestamp: {
                N: event.timestamp.toString()  //JSON format requires text
            }
        }
    }, (err, data) => {
        if (err)
            callback(err);
        else
            callback(null, data);
    });
};
