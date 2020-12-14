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

async function scanTableByPropertyID(options, propertyID) {
    verifyDatabase();
    options.ExpressionAttributeValues = {
        ":a": {
            S: propertyID
        }
    };
    options.FilterExpression =  "PropertyID = :a";
    const scanResult = await dynamoDB.scan(options).promise();
    delete options.FilterExpression;
    delete options.ExpressionAttributeValues;
    return scanResult.Items;
}

async function scanTableByCategoryKey(options, categoryKey) {
    verifyDatabase();
    options.ExpressionAttributeValues = {
        ":a": {
            S: categoryKey
        }
    };
    options.FilterExpression =  "CategoryKey = :a";
    const scanResult = await dynamoDB.scan(options).promise();
    delete options.FilterExpression;
    delete options.ExpressionAttributeValues;
    return scanResult.Items;
}

async function scanTableByPropertyKey(options, propertyKey) {
    verifyDatabase();
    options.ExpressionAttributeValues = {
        ":a": {
            N: propertyKey.toString()
        }
    };
    options.FilterExpression =  "PropertyKey = :a";
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
    scanTableByCategoryID,
    scanTableByPropertyID,
    scanTableByCategoryKey,
    scanTableByPropertyKey,
};