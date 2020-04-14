const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const clientSchema = new mongoose.Schema({
    client_name: String,
    client_type: String,
    client_id: String,
    client_secret: String
});

clientSchema.index({ client_name: 1 }, { unique: true });
clientSchema.plugin(uniqueValidator);

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;