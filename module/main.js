const database = require('./module/databaseLoader');
const config = require('./global.config')();
const Category = require('./class/Category');

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

async function getCategory(stage, categoryID = false, categoryKey = false, displayname = false) {
    verifyStage(stage);
    verifyParams([categoryID, categoryKey, displayname]);
    const generalCategoryTableEntries = await database.scanTable(config.database.categories_general);
    const foundEntry = generalCategoryTableEntries.find((generalEntry) => {
        if((categoryID && generalEntry.CategoryID.S === categoryID)
            ||(categoryKey && generalEntry.CategoryKey.S === categoryKey)
            || (displayname && generalEntry.Displayname.S === displayname)) {
            return generalEntry;
        }
    });
    if(foundEntry) {
        const stageEntries = await database.scanTableByCategoryID(config.database[`categories_${stage}`], foundEntry.CategoryID.S);
        return new Category(foundEntry, stageEntries[0]);
    }
    return undefined;    
}

async function getCategoryByParent(stage, categoryID = false, categoryKey = false, displayname = false) {
    verifyStage(stage);
    const parentCategory = await getCategory(stage, categoryID ,categoryKey, displayname);
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

async function getCategoryByChildren(stage, categoryID = false, categoryKey = false, displayname = false) {
    verifyStage(stage);
    const childCategory = await getCategory(stage, categoryID ,categoryKey, displayname);
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

function verifyStage(stage) {
    if(!config.stages.includes(stage)) {
        throw new Error(`Stage "${stage}" is not available. Available stages are ${config.stages.join(', ')}`);
    }
}

function verifyParams(params) {
    if(params.filter(param => param !== false).length === 0) {
        throw new Error('No params found, provide at least one param to search for');
    }
}

module.exports = {
    initDatabase,
    getAllCategories,
    getCategory,
    getCategoryByChildren,
    getCategoryByParent
};