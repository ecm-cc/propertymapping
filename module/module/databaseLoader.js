const AWS = require('aws-sdk'); 
let dynamoDB;

function init(accessKeyId, secretAccessKey) {
    dynamoDB = new AWS.DynamoDB({
        region: 'eu-central-1', 
        accessKeyId: accessKeyId, 
        secretAccessKey: secretAccessKey,
    });
}

async function scanTable(options) {
    verifyDatabase();
    const scanResult = await dynamoDB.scan(options).promise();
    return scanResult.Items;
}

async function scanTableByCategoryID(options, categoryID) {
    verifyDatabase();
    options.ExpressionAttributeValues = {
        ":a": {
            S: categoryID
        }
    };
    options.FilterExpression =  "CategoryID = :a";
    const scanResult = await dynamoDB.scan(options).promise();
    delete options.FilterExpression;
    delete options.ExpressionAttributeValues;
    return scanResult.Items;
}

function verifyDatabase() {
    if(!dynamoDB) {
        throw new Error('Database was not initialized');
    }
}


module.exports = {
    init,
    scanTable,
    scanTableByCategoryID
};