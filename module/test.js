const main = require('./main.js');

main.initDatabase(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);

main.getCategoryByParent('dev', null, null, 'Register (Personal)')
.then((result) => {
    console.log(result);
})
.catch((err) => console.error(err));
