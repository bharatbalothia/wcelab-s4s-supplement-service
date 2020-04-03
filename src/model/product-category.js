const mongoose = require('mongoose');

const productCategorySchema = new mongoose.Schema({
    category_id: String,
    category_description: String
});

const ProductCategory = mongoose.model('ProductCategory', productCategorySchema);

module.exports = ProductCategory;