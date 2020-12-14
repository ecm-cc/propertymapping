class Category {
    constructor(generalDatabaseElement, stageDatabaseElement) {
        this.categoryID = generalDatabaseElement.CategoryID.S;
        this.categoryKey = generalDatabaseElement.CategoryKey.S;
        this.displayname = generalDatabaseElement.Displayname.S;
        this.writeAccess = stageDatabaseElement.WriteAccess.N === '1' ? true : false;
        this.children = stageDatabaseElement.Children.S.split(',');
        this.parent = stageDatabaseElement.Parent.S.split(',');
    }
};

module.exports = Category;