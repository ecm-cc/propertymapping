const AWS = require('aws-sdk'); 
const login = require('@ablegroup/login');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const config = require('./global.config')();
const util = require('./util.js');

const dynamoDB = new AWS.DynamoDB({
    region: 'eu-central-1', 
    accessKeyId: process.env.DB_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.DB_AWS_SECRET_ACCESS_KEY
});

const globalScanParams = config.database.properties_general;

const summit = {
    general: {
        changed: [],
        unchanged: [],
        created: []
    }
};

module.exports = async () => {
    await mapGeneralTable();
    await mapStageTables();
    return summit;
};

async function mapGeneralTable() {
    const authSessionIdDev = await login(config.host.dev, process.env.API_KEY_DEV);
    const objdef = await util.getAPIData(`${config.host.dev}/dms/r/${config.repoId.dev}/objdef`, authSessionIdDev);
    const updateGeneralDatasetPromises = [];
    objdef.objectDefinitions.forEach((defintion) => {
        defintion.propertyFields.forEach((property) => {
            if(!property.isSystemProperty) {
                updateGeneralDatasetPromises.push(updateGeneralDataset(property, defintion.id));
            }
        });

    });
   await Promise.all(updateGeneralDatasetPromises);
}

async function updateGeneralDataset(property, category) {
    globalScanParams.ExpressionAttributeValues = {
        ":a": {
            N: property.docFieldId.toString()
        },
        ":b": {
            S: category
        }
    };
    globalScanParams.FilterExpression =  "DatabasePosition = :a and CategoryKey = :b";
    const result = await dynamoDB.scan(globalScanParams).promise();
    delete globalScanParams.ExpressionAttributeValues;
    delete globalScanParams.FilterExpression;
    if(result.Count === 0 || result.Items[0].Displayname.S !== property.displayName) {
        // Create/Update needed
        const uuid = result.Count > 0 ? result.Items[0].PropertyID.S : uuidv4();
        const item = {
            PropertyID: {
                S: uuid
            }, 
            Displayname: {
                S: property.displayName
            }, 
            DatabasePosition: {
                N: property.docFieldId.toString()
            },
            CategoryKey: {
                S: category
            }
        };
        await util.putItem(config.database.properties_general.TableName, item);
        if(result.Count > 0){
            summit.general.changed.push({
                PropertyID: uuid, 
                Displayname: property.displayName,
                DatabasePosition : property.docFieldId,
                CategoryKey: category
            });
        } else {
            summit.general.created.push({
                PropertyID: uuid, 
                Displayname: property.displayName,
                DatabasePosition : property.docFieldId,
                CategoryKey: category
            });
        }
    } else {
        // No update needed
        summit.general.unchanged.push({
            PropertyID: result.Items[0].PropertyID.S, 
            Displayname: result.Items[0].Displayname.S,
            DatabasePosition : result.Items[0].DatabasePosition.N,
            CategoryKey: category
        });
    }    
}

async function mapStageTables() {
    const globalScanParams = config.database.properties_general;
    const scanResult = await dynamoDB.scan(globalScanParams).promise();
    const mapStageTablePromises = [];
    config.stages.forEach((stage) => {
        mapStageTablePromises.push(mapStageTable(stage, scanResult))
    });
    await Promise.all(mapStageTablePromises);
}

async function mapStageTable(stage, scanResult) {
    const authSessionId = await login(config.host[stage], process.env[`API_KEY_${stage.toUpperCase()}`]);    
    const objdef = await util.getAPIData(`${config.host[stage]}/dms/r/${config.repoId[stage]}/objdef`, authSessionId);
    
    summit[stage] = {
        changed: [],
        unchanged: [],
        created: []
    };
    const updateStageDatasetPromises = [];

    scanResult.Items.forEach((databaseEntry) => {
        updateStageDatasetPromises.push(updateStageDataset(databaseEntry, objdef, stage));
    });

    await Promise.all(updateStageDatasetPromises);
}

async function updateStageDataset(databaseEntry, objdef, stage){
    const stageScanParams = config.database[`properties_${stage}`];
    const constructedElement = buildStageDataset(databaseEntry, objdef);
    if(constructedElement === -1) {
        return;
    }
    const logElement = {
        PropertyID: constructedElement.PropertyID.S, 
        PropertyKey: constructedElement.PropertyKey.N,
        Mandatory: constructedElement.Mandatory.N,
        Modifiable: constructedElement.Modifiable.N,
    };
    stageScanParams.ExpressionAttributeValues = {
        ":a": {
            S: databaseEntry.PropertyID.S
        }
    };
    stageScanParams.FilterExpression = "PropertyID = :a";
    const scanResult = await dynamoDB.scan(stageScanParams).promise();
        if (scanResult.Count > 0 && checkIfDatasetsAreSame(scanResult.Items[0], constructedElement)) {
            // No update needed
            summit[stage].unchanged.push(logElement);
        } else {
            // Create/Update needed
            await util.putItem(stageScanParams.TableName, constructedElement);
            if(scanResult.Count > 0){
                summit[stage].changed.push(logElement);
            } else {
                summit[stage].created.push(logElement);
            }
        }
}

function buildStageDataset(generalEntry, objdef) {
    const element = {
        PropertyID: {
            S: generalEntry.PropertyID.S
        }, 
        PropertyKey: {
            N: ''
        }, 
        Mandatory: {
            N: ''
        }, 
        Modifiable: {
            N: ''
        }
    };
    const objdefCategory = objdef.objectDefinitions.find((definition) => definition.id === generalEntry.CategoryKey.S);
    if(!objdefCategory) {
        return -1;
    }
    const objdefProperty = objdefCategory.propertyFields.find((property) => property.docFieldId.toString() === generalEntry.DatabasePosition.N);
    if(!objdefProperty) {
        return -1;
    }
    element.PropertyKey.N = objdefProperty.id;
    element.Mandatory.N = objdefProperty.isMandatory ? '1' : '0';
    element.Modifiable.N = objdefProperty.isModifiable ? '1' : '0';
    return element;
}

function checkIfDatasetsAreSame(databaseElement, constructedElement) {
    return databaseElement.PropertyID.S === constructedElement.PropertyID.S &&
    databaseElement.PropertyKey.N === constructedElement.PropertyKey.N &&
    databaseElement.Mandatory.N === constructedElement.Mandatory.N &&
    databaseElement.Modifiable.N === constructedElement.Modifiable.N;
}
