const async = require('async');
const _ = require('underscore');
const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

const docClient = new AWS.DynamoDB.DocumentClient();

let startKey = [];
let results = [];
let pages = 0;
async.doWhilst(
    //Iteratee:
    callback => {
        let params = {
            TableName: 'global_td_notes',
            Limit: 3
        };
        if (!_.isEmpty(startKey))
            params.ExclusiveStartKey = startKey;
        docClient.scan(params, (err, data) => {
            if (err) {
                console.error(err);
                callback(null, {});
            }
            else {
                if (typeof data.LastEvaluatedKey !== 'undefined')
                    startKey = data.LastEvaluatedKey;
                else
                    startKey = [];
            }
            pages++;
            console.log(data.Items, '===> Page:', pages);
            callback(null, results);  //Indicates success
        });
    },
    //Truth test:
    //Keep running until Ctrl-C is pressed
    (results, callback) => {
        callback(null, true);
    },
    //Callback:
    (err, data) => {
        if (err)
            console.error(err);
        else {
            console.log('Pages:', pages);
        }
    }
);
