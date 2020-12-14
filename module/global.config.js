module.exports = () => {
    return {
        stages: ['dev', 'qas', 'version', 'prod'],
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