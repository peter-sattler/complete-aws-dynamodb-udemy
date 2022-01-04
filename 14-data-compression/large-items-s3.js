const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1'});

const docClient = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

const faker = require('faker');
const moment = require('moment');

generateNoteItem(item => {
    console.log('Original item:', item);
    putNotesItemS3(item, (err, data) => {
        if(err)
            console.log(err);
        else {
            console.log('Stored item:', item);
            getNotesItemS3({
                user_id: item.user_id,
                timestamp: item.timestamp
            }, (err, data) => {
                if (err)
                    console.log(err);
                else
                    console.log('Retrieved item:', data.Item);
            });
        }
    });
});

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

function putNotesItemS3(item, callback) {
    if (item.content.length > 35) {
        let params = {
            Bucket: 'td-notes-content-sattler22',
            Key: item.user_id + '|' + item.timestamp,
            Body: item.content
        };
        s3.upload(params, (err, data) => {
            if (err)
                callback(err);
            else {
                item.content_s3 = data.Location;
                item.content = undefined;
                docClient.put({
                    TableName: 'global_td_notes',
                    Item: item
                }, callback);
            }
        });
    }
    else {
        docClient.put({
            TableName: 'global_td_notes',
            Item: item
        }, callback);
    }
}

function getNotesItemS3(key, callback) {
    docClient.get({
        TableName: 'global_td_notes',
        Key: key
    }, (err, data) => {
        if (err)
            callback(err);
        else {
            if (data.Item.content)
                callback(null, data);
            else {
                let params = {
                    Bucket: 'td-notes-content-sattler22',
                    Key: key.user_id + '|' + key.timestamp
                };
                s3.getObject(params, (err, content_s3) => {
                    if (err)
                        callback(err);
                    else {
                        data.Item.content = content_s3.Body.toString();
                        data.Item.content_s3 = undefined;
                        callback(null, data);
                    }
                });
            }
        }
    });
}
