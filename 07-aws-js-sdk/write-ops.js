const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1'});

const docClient = new AWS.DynamoDB.DocumentClient();

docClient.put({
    TableName: 'td_notes_sdk',
    Item: {
        user_id: 'pete12',
        timestamp: 1,
        title: 'my title',
        content: 'my content'
    }
}, (err, data) => {
    if (err)
        console.log(err);
    else
        console.log(data);
});

docClient.update({
    TableName: 'td_notes_sdk',
    Key: {
        user_id: 'pete12',
        timestamp: 1
    },
    UpdateExpression: 'SET #title = :title',
    ExpressionAttributeNames: {
        '#title': 'title'
    },
    ExpressionAttributeValues: {
        ':title': 'Updated title'
    }
}, (err, data) => {
    if (err)
        console.log(err);
    else
        console.log(data);
});

docClient.delete({
    TableName: 'td_notes_sdk',
    Key: {
        user_id: 'pete12',
        timestamp: 1
    }
}, (err, data) => {
    if (err)
        console.log(err);
    else
        console.log(data);
});

docClient.batchWrite({
    RequestItems: {
        'td_notes_sdk': [
            {
                PutRequest: {
                    Item: {
                        user_id: 'pete12',
                        timestamp: 1,
                        title: 'Title One',
                        content: 'Content One'
                    }
                }
            },
            {
                PutRequest: {
                    Item: {
                        user_id: 'fred12',
                        timestamp: 2,
                        title: 'Title Two',
                        content: 'Content Two'
                    }
                }
            }
        ]
    }
}, (err, data) => {
    if (err)
        console.log(err);
    else
        console.log(data);
});
