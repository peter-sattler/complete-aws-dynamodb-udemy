const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1'});

const faker = require('faker');
const moment = require('moment');

const docClient = new AWS.DynamoDB.DocumentClient();

setInterval(() => {
    let params = {
        TableName: 'global_td_notes'
    };
    generateNoteItem(item => {
        params.Item = item;
        docClient.put(params, (err, data) => {
            if (err)
                console.log(err);
            else
                console.log(data);
        });
    });
}, 300);

function generateNoteItem(callback) {
    callback({
        user_id: faker.random.uuid(),
        timestamp: moment().unix(),
        cat: faker.random.word(),
        title: faker.company.catchPhrase(),
        content: faker.hacker.phrase(),
        note_id: faker.random.uuid(),
        user_name: faker.internet.userName(),
        expires: moment().unix() + 600
    });
}
