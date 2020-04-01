const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    supplier_id: String,
    description: String,
    supplier_type: String,
    additional_attributes: [
        {
            name: String,
            value: String
        }
    ]
    // contact_address: {
    //     first_name: String,
    //     last_name: String,
    //     address_line_1: String,
    //     address_line_2: String,
    //     address_line_3: String,
    //     phone: String,
    //     city: String,
    //     state: String,
    //     country: String,
    //     zipcode: String
    // }
});

const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;