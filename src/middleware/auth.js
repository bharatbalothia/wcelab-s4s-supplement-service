const User = require('../model/user');

const auth = async (req, res, next) => {

    //Check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }

    //Verify auth credentials
    const base64Credentials = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [client_id, client_secret] = credentials.split(':');
    const user = await User.findOne({ client_id: client_id, client_secret: client_secret });
    if (!user) {
        return res.status(401).json({ message: 'Invalid Authentication Credentials' });
    }

    req.user = user;
    next();
}

module.exports = auth;