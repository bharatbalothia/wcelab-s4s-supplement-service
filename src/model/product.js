const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const productSchema = new mongoose.Schema({
    item_id: { type: String, uppercase: true, required: true },
    description: String,
    unit_of_measure: { type: String, default: 'UNIT' },
    tags: [String],
    category: String,
    supplier_id: String,
    tenant_id: { type: String, required: true },
    image_url: String
});

productSchema.index({ item_id: 1, unit_of_measure: 1, tenant_id: 1 }, { unique: true });
productSchema.plugin(uniqueValidator);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;