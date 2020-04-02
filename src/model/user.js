const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    client_id: String,
    client_key: String,
    client_name: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;