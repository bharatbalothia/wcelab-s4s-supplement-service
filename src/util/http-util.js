const IVCredentialModule = require('../router/iv-credential-module')
const Constants = require('./constants')
const RequestPromise = require('request-promise')
// const Promise = require('promise')

module.exports = {
    
    getIVApiPromise: async (supplier, ivOperation, httpMethod, requestParameters, jsonInput) => {

        //TODO: there is an issue with the logic when a tenant_id have multiple network id (buyer scbn id)
        // Calling this with the assumption that supplier is already been validated
        ivCred = await IVCredentialModule.getIVCredential(supplier.tenant_id);

        // This doesn't need to await for the result. It is returning a promise not the result of the promise.
        return requestWithRetry(ivCred.buyer_scbn_id, 
            supplier, ivOperation, httpMethod, requestParameters, jsonInput,
            false, 1, Constants.IV_API_FAIL_TOKEN_RETRY_ATTEMPT)
    },
}

// Get a promise for a http request. 
async function requestWithRetry(
    network_id, supplier, ivOperation, 
    httpMethod, requestParameters, jsonBody,
    forceNewToken, currentTries, retryLimit) {

    // const ivOperation = "supplies"
    // const forceNewToken = false

    token = await IVCredentialModule.getIVToken(
        network_id, 
        ivOperation,
        supplier.supplier_mailslot_id, 
        forceNewToken)
    

    const apiOptions = getIVHttpOptions(token['url'], 
        // currentTries > 4 ? token['bearer_token'] : 'BADTOKEN',  // use this line to test bad token retry
        token['bearer_token'],
        httpMethod, requestParameters, jsonBody)

    
    return new Promise((resolve, reject) => {

        const timeout = Math.pow(8, currentTries - 1) * 1000;
        
        RequestPromise(apiOptions)
            .then(resolve)
            .catch((error) => {
                
                // console.log(`error is ${error}`);

                if (Constants.IV_STATUS_CODE_FOR_RETRY.indexOf(error.statusCode) >= 0  && currentTries <= retryLimit) {
                    setTimeout(() => {
                        console.log(`!!!! Token failed!!!!! waiting ${timeout} ms before retry with a new token for ${currentTries} of ${retryLimit} times.`);
                        requestWithRetry(network_id, supplier, ivOperation, 
                            httpMethod, requestParameters, jsonBody,
                            true, currentTries+1, retryLimit)
                            .then(resolve)
                            .catch( e=> {reject(e)}); // We just reject the error here otherwise the execption won't bubble up the recursion
                    }, timeout);
                } else {
                    // console.log(`***** Rejecting error ${error}`)
                    reject(error)
                }
            });
    });
}

function getIVHttpOptions(urlPath, bearerToken, httpMethod, requestParameters, jsonInput) {
   
    var authorizationHeader = "Bearer " + bearerToken
    var options = {
        method: httpMethod,
        uri: urlPath,
        qs: requestParameters ? requestParameters : null,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authorizationHeader  
        },
        json: true,
        body: httpMethod == "GET" ? null : jsonInput
    };

    // console.log(`option is: ${JSON.stringify(options)}`);
    
    return options;
}
