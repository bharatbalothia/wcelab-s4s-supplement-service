const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    supplier_id: String,
    description: String,
    supplier_type: String,
    address_attributes: [
        {
            name: String,
            value: String
        }
    ]
});

const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;