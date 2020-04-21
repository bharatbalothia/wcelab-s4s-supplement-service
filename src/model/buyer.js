const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const buyerSchema = new mongoose.Schema({
    buyer_id: { type: String, uppercase: true, required: true },
    description: String,
    tenant_id: String,
    url: String,
    contact_person: String,
    contact_email: String,
    buyer_twitter: String,
    address_attributes: [
        {
            name: String,
            value: String
        }
    ],
    sellers: [String]
});

buyerSchema.index({ buyer_id: 1, tenant_id: 1 }, { unique: true });
buyerSchema.plugin(uniqueValidator);

const Buyer = mongoose.model('Buyer', buyerSchema);

module.exports = Buyer;