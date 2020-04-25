const dbUtil = require('../util/db-util');
const Product = require('../model/product');
const { ResourceNotFoundError, InternalError } = require('../util/errors');

module.exports = {

    getSupplierProduct: async (tenantId, requestBody, supplierId) => {

        var validationResponse = await dbUtil.validateTenant(tenantId, requestBody);

        if (validationResponse.tenantInvalid) {
            throw new ResourceNotFoundError("Tenant " + tenantId, " Tenant must exist for supplier product search")
        } else {
            
            const products = await Product.find(
                { supplier_id: supplierId, tenant_id: tenantId },
                function (err, result) {
                    if (err) {
                        throw (err)
                    }
                    if (result) {
                        return result
                    } else {
                        throw new ResourceNotFoundError("product for " + tenandId + " : " + supplierId, "Check if tenand and supplier combination exists")
                    }
                })

            // console.log("got the list of products ", products)

            return products
        }
    }
}