
const Supplier = require('../model/supplier');

module.exports = {

    getListOfSupplier: async(tenantId, listOfSupplierId) => Supplier.find({
        tenant_id: tenantId,
        supplier_id: { $in: listOfSupplierId }
    })

}