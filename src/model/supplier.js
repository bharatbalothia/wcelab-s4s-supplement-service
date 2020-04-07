const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const supplierSchema = new mongoose.Schema({
    supplier_id: { type: String, required: true },
    description: String,
    supplier_type: String,
    tenant_id: String,
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