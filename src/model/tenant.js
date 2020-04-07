const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const tenantSchema = new mongoose.Schema({
    tenant_id: String,
    tenant_name: String
});

tenantSchema.index({ tenant_id: 1 }, { unique: true });
tenantSchema.plugin(uniqueValidator);

const Tenant = mongoose.model('Tenant', tenantSchema);
// Tenant.ensureIndexes();
// Tenant.on('index', (err) => {
//     if (err) {
//         console.error('User index error: %s', err);
//     }else{
//         console.log('Created Index for User');
//     }
// });

module.exports = Tenant;