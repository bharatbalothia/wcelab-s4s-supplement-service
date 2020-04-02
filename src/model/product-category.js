const mongoose = require('mongoose');

const productCategorySchema = new mongoose.Schema({
    category: String
});

const ProductCategory = mongoose.model('Product', productCategorySchema);

module.exports = ProductCategory;