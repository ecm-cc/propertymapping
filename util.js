const getHTTPOptions = require('@ablegroup/httpoptions');
const axios = require('axios');
const AWS = require('aws-sdk'); 
const dynamoDB = new AWS.DynamoDB({
    region: 'eu-central-1', 
    accessKeyId: process.env.DB_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.DB_AWS_SECRET_ACCESS_KEY
});

async function putItem(TableName, Item){
    const params = {
        Item, 
        TableName
       };
    const result = await dynamoDB.putItem(params).promise();
    return result;
}

async function getAPIData(endpoint, authSessionId) {
    const options = getHTTPOptions();
    options.headers.Authorization = `Bearer ${authSessionId}`;
    options.url = endpoint;
    const response = await axios(options);
    return response.data;
}

module.exports = {
    putItem,
    getAPIData
};