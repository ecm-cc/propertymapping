const database = require('./module/databaseLoader');
const config = require('./global.config')();
const Category = require('./class/Category');
const Property = require('./class/Property');

function initDatabase(accessKeyId, secretAccessKey) {
    database.init(accessKeyId, secretAccessKey);
}

async function getAllCategories(stage) {
    verifyStage(stage);
    const allCategories = [];
    const generalCategoryTableEntries = await database.scanTable(config.database.categories_general);
    const stageCategoryTableEntries = await database.scanTable(config.database[`categories_${stage}`]);
    generalCategoryTableEntries.forEach((generalEntry) => {
        const stageEntry = stageCategoryTableEntries.find((entry) => entry.CategoryID.S === generalEntry.CategoryID.S);
        allCategories.push(new Category(generalEntry, stageEntry));
    });
    return allCategories;
}

async function getCategory(stage, categoryID = undefined, categoryKey = undefined, displayName = undefined) {
    verifyStage(stage);
    verifyParams([categoryID, categoryKey, displayName]);
    const generalCategoryTableEntries = await database.scanTable(config.database.categories_general);
    const foundEntry = generalCategoryTableEntries.find((generalEntry) => {
        if((categoryID && generalEntry.CategoryID.S === categoryID)
            ||(categoryKey && generalEntry.CategoryKey.S === categoryKey)
            || (displayName && generalEntry.Displayname.S === displayName)) {
            return generalEntry;
        }
    });
    if(foundEntry) {
        const stageEntries = await database.scanTableByCategoryID(config.database[`categories_${stage}`], foundEntry.CategoryID.S);
        return new Category(foundEntry, stageEntries[0]);
    }
    return undefined;    
}

async function getCategoryByParent(stage, categoryID = undefined, categoryKey = undefined, displayName = undefined) {
    verifyStage(stage);
    const parentCategory = await getCategory(stage, categoryID ,categoryKey, displayName);
    if(!parentCategory) {
        return undefined;
    }
    const stageCategoryTableEntries = await database.scanTable(config.database[`categories_${stage}`]);
    const stageEntries = stageCategoryTableEntries.filter((entry) => entry.Parent.S.includes(parentCategory.categoryKey));
    if(stageEntries.length > 0) {
        const categories = [];
        for(let i in stageEntries) {
            const generalEntry = await getCategory(stage, stageEntries[i].CategoryID.S);
            categories.push(generalEntry);
        }
        return categories;
    }
    return undefined;
}

async function getCategoryByChildren(stage, categoryID = undefined, categoryKey = undefined, displayName = undefined) {
    verifyStage(stage);
    const childCategory = await getCategory(stage, categoryID, categoryKey, displayName);
    if(!childCategory) {
        return undefined;
    }
    const stageCategoryTableEntries = await database.scanTable(config.database[`categories_${stage}`]);
    const stageEntries = stageCategoryTableEntries.filter((entry) => entry.Children.S.includes(childCategory.categoryKey));
    if(stageEntries.length > 0) {
        const categories = [];
        for(let i in stageEntries) {
            const generalEntry = await getCategory(stage, stageEntries[i].CategoryID.S);
            categories.push(generalEntry);
        }
        return categories;
    }
    return undefined;    
}

async function getAllProperties(stage) {
    verifyStage(stage);
    const allProperties = [];
    const generalPropertyTableEntries = await database.scanTable(config.database.properties_general);
    const stagePropertyTableEntries = await database.scanTable(config.database[`properties_${stage}`]);
    generalPropertyTableEntries.forEach((generalEntry) => {
        const stageEntry = stagePropertyTableEntries.find((entry) => entry.PropertyID.S === generalEntry.PropertyID.S);
        allProperties.push(new Property(generalEntry, stageEntry));
    });
    return allProperties;
}

async function getProperty(stage, propertyID = undefined, displayName = undefined, databasePosition = undefined, categoryKey = undefined, propertyKey = undefined) {
    verifyStage(stage);
    verifyParams([propertyID, displayName, databasePosition, categoryKey, propertyKey]);
    const generalPropertyTableEntries = await database.scanTable(config.database.properties_general);
    const stagePropertyTableEntries = propertyKey ? await database.scanTableByPropertyKey(config.database[`properties_${stage}`], propertyKey) : null;
    const foundEntry = generalPropertyTableEntries.find((generalEntry) => {
        if((propertyID && generalEntry.PropertyID.S === propertyID)
            ||(categoryKey && databasePosition && generalEntry.CategoryKey.S === categoryKey && generalEntry.DatabasePosition.N === databasePosition.toString())
            || (displayName && generalEntry.DisplayName.S === displayName)) {
            return generalEntry;
        }
        if(propertyKey && stagePropertyTableEntries[0].PropertyID.S === generalEntry.PropertyID.S) {
            return generalEntry;
        }
    });
    if(foundEntry) {
        const stageEntries = await database.scanTableByPropertyID(config.database[`properties_${stage}`], foundEntry.PropertyID.S);
        return new Property(foundEntry, stageEntries[0]);
    }
    return undefined; 
}

async function getPropertiesByCategory(stage, categoryID = undefined, categoryKey = undefined, displayName = undefined) {
    const foundProperties = [];
    const category = await getCategory(stage, categoryID, categoryKey, displayName);
    if(!category) {
        return undefined;
    }
    verifyStage(stage);
    const generalPropertyTableEntries = await database.scanTableByCategoryKey(config.database.properties_general, category.categoryKey);
    for(let i in generalPropertyTableEntries) {
        const stageEntries = await database.scanTableByPropertyID(config.database[`properties_${stage}`], generalPropertyTableEntries[i].PropertyID.S);
        foundProperties.push(new Property(generalPropertyTableEntries[i], stageEntries[0])); 
    }
    return foundProperties;
}

function verifyStage(stage) {
    if(!config.stages.includes(stage)) {
        throw new Error(`Stage "${stage}" is not available. Available stages are ${config.stages.join(', ')}`);
    }
}

function verifyParams(params) {
    if(params.filter(param => param != undefined).length === 0) {
        throw new Error('No params found, provide at least one param to search for');
    }
    if(params.length === 5 && (params[2] && !params[3] || !params[2] && params[3])) {
        throw new Error('CategoryKey and DatabasePosition are required in order to search by them');
    }
}

module.exports = {
    initDatabase,
    getAllCategories,
    getCategory,
    getCategoryByChildren,
    getCategoryByParent,
    getAllProperties,
    getProperty,
    getPropertiesByCategory
};