const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const supplierSchema = new mongoose.Schema({
    tenant_id: String,
    supplier_id: { type: String, uppercase: true, required: true },
    enabled: Boolean,
    description: String,
    supplier_type: String,
    supplier_mailslot_id: String,
    supplier_url: String,
    supplier_twitter: String,
    contact: {
        name: String,
        address_line_1: String,
        address_line_2: String,
        address_line_3: String,
        city: String,
        state: String,
        zipcode: String,
        country: { type: String, uppercase: true },
        phone_number: String,
        email: String
    },
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

supplierSchema.index({ supplier_id: 1, tenant_id: 1 }, { unique: true });
supplierSchema.plugin(uniqueValidator);

const Supplier = mongoose.model('Supplier', supplierSchema);
// Supplier.ensureIndexes();
// Supplier.on('index', (err) => {
//     if (err) {
//         console.error('Supplier index error: %s', err);
//     }else{
//         console.log('Created Index for Supplier');
//     }
// });

module.exports = Supplier;