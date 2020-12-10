module.exports = () => {
    return {
        stages: ['dev', 'qas', 'version', 'prod'],
        host: {
            dev: 'https://able-group-dev.d-velop.cloud',
            qas: 'https://able-group-qas.d-velop.cloud',
            version: 'https://able-group-version.d-velop.cloud',
            prod: 'https://able-group.d-velop.cloud',
        },
        repoId: {
            dev: '1a2cde3f-2913-3dc2-4a2e-e623459ac23a',
            qas: '64bdf712-b328-5f46-8fd0-b8e67aaf8bec',
            version: '576583f0-8cd0-5796-bc94-e49426e7bbfb',
            prod: '16d943a8-4683-5ffb-b564-f3bf1903a967',
        },
        database: {
            categories_general: {
                ExpressionAttributeNames: {
                    "#A": "CategoryID",
                    "#B": "Displayname",
                    "#C": "CategoryKey"
                   }, 
                   ProjectionExpression: "#A, #B, #C", 
                   TableName: "d.3_Categories_General"
            },
            categories_dev: {
                ExpressionAttributeNames: {
                    "#A": "CategoryID",
                    "#B": "Children",
                    "#C": "Parent",
                    "#D": "WriteAccess"
                   }, 
                   ProjectionExpression: "#A, #B, #C, #D", 
                   TableName: "d.3_Categories_DEV"
            },
            categories_qas: {
                ExpressionAttributeNames: {
                    "#A": "CategoryID",
                    "#B": "Children",
                    "#C": "Parent",
                    "#D": "WriteAccess"
                   }, 
                   ProjectionExpression: "#A, #B, #C, #D", 
                   TableName: "d.3_Categories_QAS"
            },
            categories_version: {
                ExpressionAttributeNames: {
                    "#A": "CategoryID",
                    "#B": "Children",
                    "#C": "Parent",
                    "#D": "WriteAccess"
                   }, 
                   ProjectionExpression: "#A, #B, #C, #D", 
                   TableName: "d.3_Categories_Version"
            },
            categories_prod: {
                ExpressionAttributeNames: {
                    "#A": "CategoryID",
                    "#B": "Children",
                    "#C": "Parent",
                    "#D": "WriteAccess"
                   }, 
                   ProjectionExpression: "#A, #B, #C, #D", 
                   TableName: "d.3_Categories_PROD"
            },
            properties_general: {
                ExpressionAttributeNames: {
                    "#A": "PropertyID",
                    "#B": "Displayname",
                    "#C": "DatabasePosition",
                    "#D": "CategoryKey"
                   }, 
                   ProjectionExpression: "#A, #B, #C, #D", 
                   TableName: "d.3_Properties_General"
            },
            properties_dev: {
                ExpressionAttributeNames: {
                    "#A": "PropertyID",
                    "#B": "PropertyKey",
                    "#C": "Mandatory",
                    "#D": "Modifiable"
                   }, 
                   ProjectionExpression: "#A, #B, #C, #D", 
                   TableName: "d.3_Properties_DEV"
            },
            properties_qas: {
                ExpressionAttributeNames: {
                    "#A": "PropertyID",
                    "#B": "PropertyKey",
                    "#C": "Mandatory",
                    "#D": "Modifiable"
                   }, 
                   ProjectionExpression: "#A, #B, #C, #D", 
                   TableName: "d.3_Properties_QAS"
            },
            properties_version: {
                ExpressionAttributeNames: {
                    "#A": "PropertyID",
                    "#B": "PropertyKey",
                    "#C": "Mandatory",
                    "#D": "Modifiable"
                   }, 
                   ProjectionExpression: "#A, #B, #C, #D", 
                   TableName: "d.3_Properties_Version"
            },
            properties_prod: {
                ExpressionAttributeNames: {
                    "#A": "PropertyID",
                    "#B": "PropertyKey",
                    "#C": "Mandatory",
                    "#D": "Modifiable"
                   }, 
                   ProjectionExpression: "#A, #B, #C, #D", 
                   TableName: "d.3_Properties_PROD"
            }
        }
    };
}