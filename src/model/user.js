const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    client_name: String,
    client_type: String,
    client_id: String,
    client_secret: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;