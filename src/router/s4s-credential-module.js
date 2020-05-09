const TokenMemoryCache = require('../cache/token-cache');
const httpRequest = require('request-promise');
const { ResourceNotFoundError, InternalError } = require('../util/errors');
const IVCredential = require('../model/iv-credential');
const Constants = require('../util/constants');
const Base64Util = require('../util/base64-util');
const Supplier = require('../model/supplier');
const Client = require('../model/client');

module.exports = {

    getS4SCredentials: async (buyerSCBNId, operation, supplierMailslotId) => {
        var ivCredential = await IVCredential.findOne({ buyer_scbn_id: buyerSCBNId });
        if (ivCredential == null) {

            // return res.status(404).send({ "message": "The SCBN buyer " + buyerSCBNId + " could not be found. The buyer first needs to be onboarded in s4s-supplement-service." });
            throw new ResourceNotFoundError("SCBN buyer: " + buyerSCBNId, " SCBN buyer cannot be found. The buyer first needs to be onboarded in s4s-supplement-service.")
        }

        var s4sTenantId = ivCredential.iv_tenant_id;

        const supplier = await Supplier.findOne({ supplier_mailslot_id: supplierMailslotId, tenant_id: s4sTenantId });

        //Return the json response
        var jsonResponse = {};
        jsonResponse['buyer_scbn_id'] = buyerSCBNId;
        if (supplier) {
            jsonResponse['supplier_id'] = supplier.supplier_id;
        } else {
            // res.status(404).send({ message: 'SCBN Buyer Id ' + buyerSCBNId + ' is not valid. The supplier could not be found.' });
            throw new ResourceNotFoundError('SCBN Buyer: ' + buyerSCBNId, 'Buyer SCBN is not valid. The supplier could not be found.')
        }
        jsonResponse['tenant_id'] = s4sTenantId;
        jsonResponse['url'] = getS4SURL (s4sTenantId, operation, supplier.supplier_id);
        jsonResponse['http_method'] = getHTTPMethod(operation);
        try {
            jsonResponse['auth_header'] = await getS4SAuthHeader();
        } catch (error) {
            if (e instanceof ResourceNotFoundError){
                throw new ResourceNotFoundError(`client_name: APP_CONNECT`, 'Cannot find s4s credentials for the specified client.')
            }
        }
        console.log('jsonResponse: ' + JSON.stringify(jsonResponse));

        return jsonResponse;
    },

    getIVCredential: async(ivTenantId) => {
        return await IVCredential.findOne({iv_tenant_id: ivTenantId})
    }
}


function getBasicAuthorization(client_id, client_secret){
    return "Basic " + Base64Util.encode(client_id + ":" + client_secret);
}

function getS4SURL (ivTenantId, operation, supplierId) {
    var env;
    if(process.env.APP_ENVIRONMENT === 'production'){
        env = 'prod';
    }else{
        env = 'dev';
    }
    var baseURL = Constants.S4S_BASE_URL.replace('{env}', env);
    baseURL += '/s4s/' + ivTenantId + '/suppliers/' + supplierId + '/' + operation;
    return baseURL;
}

function getHTTPMethod(operation) {
    var httpMethod;
    switch(operation){
        case 'supplies':
            httpMethod = 'PUT';
            break;
        default:
            httpMethod = 'GET';
    }
    return httpMethod;
}

async function getS4SAuthHeader() {
    const client = await Client.findOne({ client_name: 'APP_CONNECT', client_type: 'SYSTEM' });
    if(client == null){
        throw new ResourceNotFoundError(`client_name: APP_CONNECT`, 'Cannot find s4s credentials for the specified client.')
    }
    return getBasicAuthorization(client.client_id, client.client_secret);
}