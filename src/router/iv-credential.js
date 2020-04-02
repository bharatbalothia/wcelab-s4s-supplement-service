const express = require('express');
const httpRequest = require('request-promise');
const IVCredential = require('../model/iv-credential');
const Constants = require('../util/constants');
const Base64Util = require('../util/base64util');
const router = new express.Router();

//Create a iv credential for SCBN buyer
router.post('/iv-credential', async (req, res) => {
    const ivCredential = new IVCredential(req.body);
    try{
        await ivCredential.save();
        // console.log("IV Credential Created: ", ivCredential);
        res.status(201).send(ivCredential);
    }catch(e){
        console.log('Save error.', e);
        res.status(400).send(e);
    }
});

//Retrieve the iv credentials for SCBN buyer
router.post('/iv-token', async (req, res) => {
    // console.log(req.body);
    const buyerSCBNId = req.body.buyer_scbn_id;
    const operation = req.body.operation;
    const forceToken = req.body.force_token;

    //Find the iv-credential record for the buyer_scbn_id
    try{
        const ivCredential = await IVCredential.findOne({ buyer_scbn_id: buyerSCBNId });
        // console.log("ivCredential: " + ivCredential);
        if(ivCredential.length == 0){
            return res.status(404).send({ "message": "The SCBN buyer" + buyerSCBNId + " could not be found" });
        }
        // console.log(ivCredential);
        var ivTenantId = ivCredential.iv_tenant_id;
        var ivTenantClientId = ivCredential.iv_tenant_client_id;
        var ivTenantClientSecret = ivCredential.iv_tenant_client_secret;

        //Fetch the current token from memory
        //Check if the current token is valid
        //Fetch the new token from iv oauth2/token service
        var ivAuthTokenBaseURL = Constants.IV_AUTH_TOKEN_BASE_URL;
        var ivAuthTokenTenantURL = ivAuthTokenBaseURL.replace('{tenantId}', ivTenantId);
        // console.log(ivAuthTokenTenantURL);
        // console.log(ivTenantClientId);
        // console.log(ivTenantClientSecret);
        var options = {
            method: 'POST',
            uri: ivAuthTokenTenantURL,
            headers: {
                'Content-Type': Constants.IV_AUTH_TOKEN_CONTENT_TYPE,
                'Authorization': getAuthorizationBearerToken(ivTenantClientId, ivTenantClientSecret)
            },
            body: Constants.IV_AUTH_TOKEN_BODY,
            json: true
        };
        var ivAuthTokenResponse = await httpRequest(options);
        // console.log("ivAuthTokenResponse: " + JSON.stringify(ivAuthTokenResponse));
        // console.log("IV_API_BASE_URL: " + Constants.IV_API_BASE_URL);

        //Return the json response
        var jsonResponse = {};
        jsonResponse['url'] = Constants.IV_API_BASE_URL.replace('{tenantId}', ivTenantId).replace('{operation}', operation);
        jsonResponse['buyer_scbn_id'] = buyerSCBNId;
        jsonResponse['iv_tenant_id'] = ivTenantId;
        jsonResponse['bearer_token'] = ivAuthTokenResponse.access_token;
        jsonResponse['time_to_live'] = ivAuthTokenResponse.expires_in;
        // console.log(JSON.stringify(jsonResponse));
        res.send(jsonResponse);
    }catch(e){
        console.log(e);
        res.status(500).send(e);
    };
});

function getAuthorizationBearerToken(client_id, client_secret){
    return "Basic " + Base64Util.encode(client_id + ":" + client_secret);
}

module.exports = router;