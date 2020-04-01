const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const host = process.env.MONGODB_HOST;
const port = process.env.MONGODB_PORT;
const db = process.env.MONGODB_DBNAME;

//s4s-supplement-service-mongodb
//TODO Need to read this from the VCA_SERVICES json object. Cannot have credentials in git repo.

//TODO Need to read this from the VCA_SERVICES json object. Cannot have credentials in git repo.

// console.log(certFileBuf);

uri = 'mongodb://' + host + ':' + port + '/' + db;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    sslValidate: true,
    sslCA: certFileBuf
}).then(() => {
    console.log('DB Connection successful !!');
}).catch(() => {
    console.log('DB Connection FAILURE !!!');
});

if (process.env.VCAP_SERVICES) {
    var env = JSON.parse(process.env.VCAP_SERVICES);
    console.log("VCAP_SERVICES:" + JSON.stringify(env));
}