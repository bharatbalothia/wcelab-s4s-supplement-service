const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    item_id: String,
    description: String,
    unit_of_measure: String,
    tags: [String]
    //TODO category
    //TODO validation for unique item_id and unit_of_measure
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;