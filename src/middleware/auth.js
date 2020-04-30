const Client = require('../model/client');

const auth = async (req, res, next) => {

    return next();//TODO Temporarily disabled auth middleware

    if(process.env.DB_ENVIRONMENT == "TEST"){
        return next();
    }

    //Check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }

    //Verify auth credentials
    const base64Credentials = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [client_id, client_secret] = credentials.split(':');
    var clientQuery = { client_id: client_id, client_secret: client_secret };
    if(requiresAdminAccess(req.url)){
        clientQuery.client_type = "ADMIN";
    }

    const client = await Client.findOne(clientQuery);
    if (!client) {
        return res.status(401).json({ message: 'Invalid Authentication Credentials' });
    }

    return next();
}

requiresAdminAccess  = (url) => {
    var adminRoutes = [];
    adminRoutes.push("/tenants");
    if(adminRoutes.includes(url)){
        return true;
    }
    return false;
}

module.exports = auth;