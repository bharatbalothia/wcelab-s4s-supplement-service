const mongoose = require('mongoose');
require('dotenv').config();

const host = process.env.MONGODB_HOST;
const port = process.env.MONGODB_PORT;
const db = process.env.MONGODB_DBNAME;

mongoose.connect('mongodb://' + host + ':' + port + '/' + db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('DB Connection successful !!');
}).catch(() => {
    console.log('DB Connection FAILURE !!!');
});