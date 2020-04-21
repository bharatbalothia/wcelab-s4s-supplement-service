const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const productCategorySchema = new mongoose.Schema({
    category_id: { type: String, uppercase: true, required: true },
    category_description: String,
    tenant_id: { type: String, required: true }
});

productCategorySchema.index({ category_id: 1, tenant_id: 1 }, { unique: true });
productCategorySchema.plugin(uniqueValidator);

const ProductCategory = mongoose.model('ProductCategory', productCategorySchema);
// ProductCategory.ensureIndexes();
// ProductCategory.on('index', (err) => {
//     if (err) {
//         console.error('ProductCategory index error: %s', err);
//     }else{
//         console.log('Created Index for ProductCategory');
//     }
// });

module.exports = ProductCategory;