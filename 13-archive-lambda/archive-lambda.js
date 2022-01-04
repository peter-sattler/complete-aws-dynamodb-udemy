'use strict';

const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

//Use low-level client since JSON will be in DynamoDB format:
const dynamodb = new AWS.DynamoDB();

exports.handler = async (event, context, callback) => {
    for (const record of event.Records) {
        console.log('Event: %s %s %j', record.eventID, record.eventName, record.dynamodb);
        if(record.eventName === 'REMOVE') {
            console.log('Copy to archive table: %j', record.dynamodb.OldImage);
            let params = {
                TableName: "td_notes_archive",
                Item: record.dynamodb.OldImage
            }; 
            await dynamodb.putItem(params, (err, data)=>{
                if(err)
                    console.log(err);
                else
                    console.log(data);
             });    
        }
    }
    return `Successfully processed ${event.Records.length} records.`;
};

