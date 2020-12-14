class Property {
    constructor(generalDatabaseElement, stageDatabaseElement) {
        this.propertyID = generalDatabaseElement.PropertyID.S;
        this.displayname = generalDatabaseElement.Displayname.S;
        this.databasePosition = parseInt(generalDatabaseElement.DatabasePosition.N);
        this.categoryKey = generalDatabaseElement.CategoryKey.S;
        this.mandatory = stageDatabaseElement.Mandatory.N === '1' ? true : false;
        this.modifiable = stageDatabaseElement.Modifiable.N === '1' ? true : false;
        this.propertyKey = parseInt(stageDatabaseElement.PropertyKey.N);
    }
};

module.exports = Property;