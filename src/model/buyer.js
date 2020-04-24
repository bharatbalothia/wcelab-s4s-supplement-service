const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const buyerSchema = new mongoose.Schema({
    tenant_id: String,
    buyer_id: { type: String, uppercase: true, required: true },
    enabled: Boolean,
    description: String,
    url: String,
    buyer_twitter: String,
    contact: {
        name: string,
        address_line_1: string,
        address_line_2: string,
        address_line_3: string,
        city: string,
        state: string,
        zipcode: string,
        country: { type: String, uppercase: true },
        phone_number: string,
        email: string
    },
    suppliers: [String],
    deprecated_elelements_after_this: Number,
    contact_person: String,
    contact_email: String,
    address_attributes: [
        {
            name: String,
            value: String
        }
    ]
});

buyerSchema.index({ buyer_id: 1, tenant_id: 1 }, { unique: true });
buyerSchema.plugin(uniqueValidator);

const Buyer = mongoose.model('Buyer', buyerSchema);

module.exports = Buyer;