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
            TableName: 'td_notes_test',
            Limit: 3
        };
        if (!_.isEmpty(startKey))
            params.ExclusiveStartKey = startKey;
        console.log('iteratee::params:', JSON.stringify(params));
        docClient.scan(params, (err, data) => {
            if (err) {
                console.error(err);
                callback(err, {});
            }
            else {
                if (typeof data.LastEvaluatedKey !== 'undefined')
                    startKey = data.LastEvaluatedKey;
                else
                    startKey = [];
            }
            console.log('iteratee::startKey:', JSON.stringify(startKey));
            if (!_.isEmpty(data.Items))
                results = _.union(results, data.Items);  //Combine the arrays
            pages++;
            console.log('iteratee::results:', JSON.stringify(startKey));
            console.log('iteratee::pages:', pages);
            callback(null, results);                     //Indicates success
        });
    },
    //Truth test:
    //Keep running until an empty start key detected
    (results, callback) => {
        if (_.isEmpty(startKey))
            callback(null, false);
        else
            callback(null, true);
    },
    //Callback:
    (err, data) => {
        if (err)
            console.error(err);
        else {
            console.log(JSON.stringify(data, null, 2));
            console.log('Item count:', data.length);
            console.log('Pages:', pages);
        }
    }
);
