const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const shipNodeSchema = new mongoose.Schema({
    shipnode_id: { type: String, required: true },
    shipnode_name: String,
    supplier_id: { type: String, required: true },
    tenant_id: { type: String, required: true },
    latitude: String,
    longitude: String,
    address_attributes: [
        {
            name: String,
            value: String
        }
    ]
});

shipNodeSchema.index({ shipnode_id: 1, tenant_id: 1, supplier_id: 1 }, { unique: true });
shipNodeSchema.plugin(uniqueValidator);

const ShipNode = mongoose.model('ShipNode', shipNodeSchema);
// SupShipNodeplier.ensureIndexes();
// ShipNode.on('index', (err) => {
//     if (err) {
//         console.error('ShipNode index error: %s', err);
//     }else{
//         console.log('Created Index for ShipNode');
//     }
// });

module.exports = ShipNode;