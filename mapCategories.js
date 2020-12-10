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
const globalScanParams = config.database.categories_general;

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

async function mapGeneralTable(){
    const authSessionIdDev = await login(config.host.dev, process.env.API_KEY_DEV);
    const source = await util.getAPIData(`${config.host.dev}/dms/r/${config.repoId.dev}/source`, authSessionIdDev);
    const updateGeneralDatasetPromises = [];
    source.categories.forEach((category) => {
        updateGeneralDatasetPromises.push(updateGeneralDataset(category));
    });
   await Promise.all(updateGeneralDatasetPromises);
}

async function updateGeneralDataset(category) {
    globalScanParams.ExpressionAttributeValues = {
        ":a": {
            S: category.key
        }
    };
    globalScanParams.FilterExpression =  "CategoryKey = :a";
    const result = await dynamoDB.scan(globalScanParams).promise();
    delete globalScanParams.ExpressionAttributeValues;
    delete globalScanParams.FilterExpression;
    if(result.Count === 0 || result.Items[0].Displayname.S !== category.displayName) {
        // Create/Update needed
        const uuid = result.Count > 0 ? result.Items[0].CategoryID.S : uuidv4();
        const item = {
            CategoryID: {
                S: uuid
            }, 
            Displayname: {
                S: category.displayName
            }, 
            CategoryKey: {
                S: category.key
            }
        };
        await util.putItem(config.database.categories_general.TableName, item);
        if(result.Count > 0){
            summit.general.changed.push({
                CategoryID: uuid, 
                Displayname: category.displayName,
                CategoryKey : category.key
            });
        } else {
            summit.general.created.push({
                CategoryID: uuid, 
                Displayname: category.displayName,
                CategoryKey : category.key
            });
        }
    } else {
        // No update needed
        summit.general.unchanged.push({
            CategoryID: result.Items[0].CategoryID.S, 
            Displayname: result.Items[0].Displayname.S,
            CategoryKey : result.Items[0].CategoryKey.S
        });
    }     
}

async function mapStageTables(){
    const globalScanParams = config.database.categories_general;
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
    const storeobjdef = await util.getAPIData(`${config.host[stage]}/dms/r/${config.repoId[stage]}/storeobjdef`, authSessionId);
    
    summit[stage] = {
        changed: [],
        unchanged: [],
        created: []
    };
    const updateStageDatasetPromises = [];

    scanResult.Items.forEach((databaseEntry) => {
        updateStageDatasetPromises.push(updateStageDataset(databaseEntry, objdef, storeobjdef, stage));
    });

    await Promise.all(updateStageDatasetPromises);
}

async function updateStageDataset(databaseEntry, objdef, storeobjdef, stage){
    const stageScanParams = config.database[`categories_${stage}`];
    const constructedElement = buildStageDataset(databaseEntry, objdef, storeobjdef);
    const logElement = {
        CategoryID: constructedElement.CategoryID.S, 
        Children: constructedElement.Children.S,
        Parent: constructedElement.Parent.S,
        WriteAccess: constructedElement.WriteAccess.N,
    };
    stageScanParams.ExpressionAttributeValues = {
        ":a": {
            S: databaseEntry.CategoryID.S
        }
    };
    stageScanParams.FilterExpression = "CategoryID = :a";
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

function buildStageDataset(generalEntry, objdef, storeobjdef) {
    const element = {
        CategoryID: {
            S: generalEntry.CategoryID.S
        }, 
        Children: {
            S: ''
        }, 
        Parent: {
            S: ''
        }, 
        WriteAccess: {
            N: ''
        }
    };
    const writeAccess = objdef.objectDefinitions.find((element) => element.id === generalEntry.CategoryKey.S);
    element.WriteAccess.N = writeAccess ? (writeAccess.writeAccess ? '1' : '0') : '0';
    const children = storeobjdef.dossierStorageObjectDefinitions.find((elem) => elem.dossierDefinitionId === generalEntry.CategoryKey.S);
    if (children && children.standard.length > 0) {
        element.Children.S = children.standard[0].id;
    } else if (children && children.hierarchy.length > 0) {
        element.Children.S = children.hierarchy.map((child) => child = child.id).join(',');
    }
    const parents = [];
    storeobjdef.dossierStorageObjectDefinitions.forEach((definition) => {
        if (definition.standard.length > 0) {
            if (definition.standard.find((elem) => elem.id === generalEntry.CategoryKey.S)){
                parents.push(definition.dossierDefinitionId);
            }
        }
        if(definition.hierarchy.length > 0) {
            if(definition.hierarchy.find((elem) => elem.id === generalEntry.CategoryKey.S)){
                parents.push(definition.dossierDefinitionId);
            }
        }

    });
    element.Parent.S = [...new Set(parents)].join(',');
    return element;
}

function checkIfDatasetsAreSame(databaseElement, constructedElement) {
    return databaseElement.CategoryID.S === constructedElement.CategoryID.S &&
    databaseElement.Children.S === constructedElement.Children.S &&
    databaseElement.Parent.S === constructedElement.Parent.S &&
    databaseElement.WriteAccess.N === constructedElement.WriteAccess.N;
}


