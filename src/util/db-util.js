const Tenant = require('../model/tenant');
const Supplier = require('../model/supplier');
const Product = require('../model/product');

module.exports = {
    validateTenant: async (tenantId, body) => {
        var tenantInvalid = false;
        const tenant = await Tenant.findOne({ tenant_id: tenantId });
        if (!tenant) {
            console.log("Tenant %s NOT found", tenantId);
            tenantInvalid = true;
        }
        var _body = JSON.parse(JSON.stringify(body));
        _body.tenant_id = tenantId;
        return { tenantInvalid: tenantInvalid, _body: _body };
    },

    validateTenantAndSupplier: async (tenantId, supplierId, body) => {
        var tenantInvalid = false;
        var supplierInvalid = false;
        const tenant = await Tenant.findOne({ tenant_id: tenantId });
        const supplier = await Supplier.findOne({ supplier_id: supplierId.toUpperCase() });
        if (!tenant) {
            tenantInvalid = true;
        }
        if (!supplier) {
            supplierInvalid = true;
        }
        var _body;
        if (Array.isArray(body)) {
            for (let _shipnode of body) {
                _shipnode.tenant_id = tenantId;
                _shipnode.supplier_id = supplierId;
            }
            _body = JSON.parse(JSON.stringify(body));
        } else {
            body.tenant_id = tenantId;
            body.supplier_id = supplierId;
            _body = JSON.parse(JSON.stringify(body));
        }
        return { tenantInvalid: tenantInvalid, supplierInvalid: supplierInvalid, _body: _body };
    },

    getSupplier: async (tenantId, supplierId) => {
        
        const tenant = await Tenant.findOne({ tenant_id: tenantId });
        const supplier = await Supplier.findOne({ tenant_id: tenantId, supplier_id: supplierId.toUpperCase() });
        if (tenant, supplier) {
            return supplier
        } else {
            return null
        }
    },

    getProductsForSupplier: async (tenantId, supplierId) => {
        
        const tenant = await Tenant.findOne({ tenant_id: tenantId });
        const supplier = await Supplier.findOne({ tenant_id: tenantId, supplier_id: supplierId.toUpperCase() });
        if (tenant, supplier) {
            return await Product.find({ tenant_id: tenantId, supplier_id: supplierId.toUpperCase() });
        } else {
            return null
        }
    }
}

