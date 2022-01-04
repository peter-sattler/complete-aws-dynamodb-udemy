const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1'});

const docClient = new AWS.DynamoDB.DocumentClient();

docClient.update({
    TableName: 'td_notes_sdk',
    Key: {
        user_id: 'ABC',
        timestamp: 1
    },
    UpdateExpression: 'set #views = #views + :increment',
    ExpressionAttributeNames: {
        '#views': 'views'
    },
    ExpressionAttributeValues: {
        ':increment': 1
    }
}, (err, data) => {
    if (err)
        console.log(err);
    else
        console.log(data);
});