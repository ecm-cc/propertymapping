const main = require('./main.js');
require('dotenv').config();

main.initDatabase(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);

main.getPropertiesByCategory('dev', null, 'XAPER')
.then((result) => {
    console.log(result);
})
.catch((err) => console.error(err));
