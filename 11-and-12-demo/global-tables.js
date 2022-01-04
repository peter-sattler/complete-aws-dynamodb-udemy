const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1'});

const docClient = new AWS.DynamoDB.DocumentClient();

const newRegion = 'eu-central-1';
const docClientGermany = new AWS.DynamoDB.DocumentClient({region: newRegion});

docClient.put({
    TableName: 'global_td_notes',
    Item: {
        user_id: 'ABC',
        timestamp: 5,
        title: 'ABC title',
        content: 'ABC content'
    }
}, (err, data) => {
    if (err)
        console.log(err);
    else {
        console.log(data);
        console.log('Put operation successful in AWS region', AWS.config.region);
        setTimeout(() => {
            docClientGermany.get({
                TableName: 'global_td_notes',
                Key: {
                    user_id: 'ABC',
                    timestamp: 5
                }
            }, (err, data) => {
                if (err)
                    console.log(err);
                else {
                    console.log('Getting item from AWS region', newRegion);
                    console.log(data);
                }
            });
        }, 1000);
    }
});
