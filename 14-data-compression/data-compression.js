const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1'});

const docClient = new AWS.DynamoDB.DocumentClient();

const faker = require('faker');
const moment = require('moment');
const zlib = require('zlib');

generateNoteItem(item => {
    console.log('Uncompressed item:', item);
    putNotesItem(item, (err, data) => {
        if(err)
            console.log(err);
        else {
            console.log('Compressed item:', item);
            getNotesItem({
                user_id: item.user_id,
                timestamp: item.timestamp
            }, (err, data) => {
                if (err)
                    console.log(err);
                else
                    console.log('Uncompressed Read:', data.Item);
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

function putNotesItem(item, callback) {
    if (item.content.length > 35) {
        zlib.gzip(item.content, (err, content_b) => {
            if (err)
                callback(err);
            else {
                item.content_b = content_b;
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

function getNotesItem(key, callback) {
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
                zlib.gunzip(data.Item.content_b, (err, content) => {
                    if (err)
                        callback(err);
                    else {
                        data.Item.content = content.toString();
                        data.Item.content_b = undefined;
                        callback(null, data);
                    }
                });
            }
        }
    });
}
