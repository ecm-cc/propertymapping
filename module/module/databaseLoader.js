const AWS = require('aws-sdk'); 
let dynamoDB;

/**
 * Intializes a DynamoDB to be used further on 
 * @param {String} accessKeyId AWS Access Key ID to be authenticated with
 * @param {String} secretAccessKey AWS Secret Access Key to be authenticated with
 */
function init(accessKeyId, secretAccessKey) {
    dynamoDB = new AWS.DynamoDB({
        region: 'eu-central-1', 
        accessKeyId: accessKeyId, 
        secretAccessKey: secretAccessKey,
    });
}

/**
 * Scans a table for all elements
 * @param {Object} options DynamoDB configuration
 * @returns {Promise<Object[]>} List of found items
 */
async function scanTable(options) {
    verifyDatabase();
    const scanResult = await dynamoDB.scan(options).promise();
    return scanResult.Items;
}

/**
 * Scans a table by a given category ID
 * @param {Object} options DynamoDB configuration
 * @param {String} categoryID Category ID to be searched for
 * @returns {Promise<Object[]>} List of found categories, should contain only one
 */
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

/**
 * Scans a table by a given property ID
 * @param {Object} options DynamoDB configuration
 * @param {String} propertyID Property ID to be searched for
 * @returns {Promise<Object[]>} List of found properties, should contain only one
 */
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

/**
 * Scans a table by a given category key
 * @param {Object} options DynamoDB configuration
 * @param {String} categoryKey Category key to be searched for
 * @returns {Promise<Object[]>} List of found categories, should contain only one
 */
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

/**
 * Scans a table by a given property key
 * @param {Object} options DynamoDB configuration
 * @param {String} propertyKey Property key to be searched for
 * @returns {Promise<Object[]>} List of found properties, should contain only one
 */
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

/**
 * Verifies if a database was intialized
 * @throws Will throw an error if database was not initialized
 */
function verifyDatabase() {
    if(!dynamoDB) {
        throw new Error('Database was not initialized');
    }
}

/**
 * @module module/databaseLoader
 * @desc Provides a connector for DynamoDB
 */
module.exports = {
    init,
    scanTable,
    scanTableByCategoryID,
    scanTableByPropertyID,
    scanTableByCategoryKey,
    scanTableByPropertyKey,
};