const Tenant = require('../model/tenant');

module.exports = {
    validateTenant: async (tenantId, body) => {
        var tenantInvalid = false;
        const tenant = await Tenant.findOne({ tenant_id: tenantId });
            if(!tenant){
                console.log("Tenant %s NOT found", tenantId);
                tenantInvalid = true;
            }
        var _body = JSON.parse(JSON.stringify(body));
        _body.tenant_id = tenantId;
        return { tenantInvalid: tenantInvalid, _body: _body };
    }
}

