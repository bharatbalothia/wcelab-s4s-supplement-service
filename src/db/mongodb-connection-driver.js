const mongoose = require('mongoose');
const fs = require('fs');
const base64Util = require('../util/base64-util');
require('dotenv').config();
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;

var uri;
var certFileBuf;
var dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}
var dbEnvironment = process.env.DB_ENVIRONMENT || "NULL";

if(dbEnvironment == "DEV"){
    const host = process.env.MONGODB_HOST;
    const port = process.env.MONGODB_PORT;
    const db = process.env.MONGODB_DBNAME;
    uri = 'mongodb://' + host + ':' + port + '/' + db;
    console.log("uri: " + uri);
}else if(dbEnvironment == "TEST"){
    const host = process.env.MONGODB_HOST;
    const port = process.env.MONGODB_PORT;
    const db = process.env.MONGODB_TEST_DBNAME;
    uri = 'mongodb://' + host + ':' + port + '/' + db;
    console.log("uri: " + uri);
}else if(dbEnvironment == "IBM_CLOUD"){
    var cloudDBConnectionFile = fs.readFileSync('cloud_db_connection.json');
    process.env.VCAP_SERVICES = JSON.stringify(JSON.parse(cloudDBConnectionFile));
}

if (process.env.VCAP_SERVICES) {
    if(dbEnvironment != "IBM_CLOUD"){
        dbEnvironment = "DEFAULT";
    }
    var env = JSON.parse(process.env.VCAP_SERVICES);
    uri = env["databases-for-mongodb"][0]["credentials"]["connection"]["mongodb"]["composed"][0];
    certFileBuf = base64Util.decode(env["databases-for-mongodb"][0]["credentials"]["connection"]["mongodb"]["certificate"]["certificate_base64"]);
    dbOptions.ssl = true;
    dbOptions.sslValidate = true;
    dbOptions.sslCA = certFileBuf;
}

console.log("DB_ENVIRONMENT: " + dbEnvironment);

if(dbEnvironment == "NULL"){
    console.log('No DB connections details available to the server !!! Refer to .env_sample file for dev db connection.');
}else{
    mongoose.connect(uri, dbOptions).then(() => {
        console.log('DB Connection successful !!');
        if(dbEnvironment == "TEST"){
            mongoose.connection.db.dropDatabase();
        }
    }).catch(() => {
        console.log('DB Connection FAILURE !!!');
    });

    // mongoose.set('debug', true);
}
