const mongoose = require('mongoose');
const fs = require('fs');
const base64Util = require('../util/base64-util');
require('dotenv').config();

var uri;
var certFileBuf;
var dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}
var dbEnvironment = process.env.DB_ENVIRONMENT || "NULL";

if(process.env.DB_ENVIRONMENT == "DEV"){
    const host = process.env.MONGODB_HOST;
    const port = process.env.MONGODB_PORT;
    const db = process.env.MONGODB_DBNAME;
    uri = 'mongodb://' + host + ':' + port + '/' + db;
    console.log("uri: " + uri);
}else if(process.env.DB_ENVIRONMENT == "IBM_CLOUD"){
    var cloudDBConnectionFile = fs.readFileSync('cloud_db_connection.json');
    process.env.VCAP_SERVICES = JSON.stringify(JSON.parse(cloudDBConnectionFile));
}

if (process.env.VCAP_SERVICES) {
    process.env.DB_ENVIRONMENT = "DEFAULT";
    var env = JSON.parse(process.env.VCAP_SERVICES);
    uri = env["databases-for-mongodb"][0]["credentials"]["connection"]["mongodb"]["composed"][0];
    certFileBuf = base64Util.decode(env["databases-for-mongodb"][0]["credentials"]["connection"]["mongodb"]["certificate"]["certificate_base64"]);
    dbOptions.ssl = true;
    dbOptions.sslValidate = true;
    dbOptions.sslCA = certFileBuf;
}

console.log("DB_ENVIRONMENT: " + dbEnvironment);

mongoose.connect(uri, dbOptions).then(() => {
    console.log('DB Connection successful !!');
}).catch(() => {
    console.log('DB Connection FAILURE !!!');
});
