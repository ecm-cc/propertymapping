const mapProperties = require('./mapProperties');
const mapCategories = require('./mapCategories');
const mail = require('./mail.js');

run().then((result) => {
    console.log(result);
    console.log('Finished');
}).catch((err) => {
    console.error(err);
    console.error('Failed');
});

async function run(){
    const result = {};
    const promiseResults = await Promise.all([mapCategories(), mapProperties()]);
    result.categories = promiseResults[0];
    result.properties = promiseResults[1];
    await mail(result);
    return result;
}