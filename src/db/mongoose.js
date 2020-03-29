const mongoose = require('mongoose');
const properties = require('../util/properties');

const host = properties.get('mongodb.server.host');
const port = properties.get('mongodb.server.defaultport');
const db = properties.get('mongodb.server.dbname');

mongoose.connect('mongodb://' + host + ':' + port + '/' + db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('DB Connection successful !!');
}).catch(() => {
    console.log('DB Connection FAILURE !!!');
});