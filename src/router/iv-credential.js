const express = require('express');
const httpRequest = require('request-promise');
const IVCredential = require('../model/iv-credential');
const Constants = require('../util/constants');
const Base64Util = require('../util/base64-util');
const DateTimeUtil = require('../util/datetime-util');
const TokenMemoryCache = require('../cache/token-cache');
const auth = require('../middleware/auth');
const router = new express.Router();

var tokenMemoryCache;

//Create a iv credential for SCBN buyer
router.post('/iv-credential', auth, async (req, res) => {
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
router.post('/iv-token', auth, async (req, res) => {
    // console.log(req.body);
    const buyerSCBNId = req.body.buyer_scbn_id;
    const operation = req.body.operation;
    var forceToken = (req.body.force_token == "true");
    // console.log("forceToken: " + forceToken);
    
    try{
        //Fetch the current token from memory
        var bearerToken;
        var cacheTokenInvalid = true;
        var ivCredential;
        var ivTenantId;
        var ivTTLRemaining;
        tokenMemoryCache = new TokenMemoryCache().getInstance();
        // tokenMemoryCache.printCache();

        if(forceToken){
            console.log("Forcing new token for " + buyerSCBNId);
        }
        if (!forceToken && tokenMemoryCache.foundInCache(buyerSCBNId)){
            cachedData = tokenMemoryCache.getFromCache(buyerSCBNId);
            // console.log("tokenMemoryCache: " + JSON.stringify(cachedData));
            //Check if the current cache token has expired
            var cacheTokenExpirationDate = cachedData.token_expiration_datetime;
            // console.log("cacheTokenExpirationDate: " + cacheTokenExpirationDate);
            var currentTime = new Date();
            // console.log("currentTime: " + currentTime);
            if(new Date(cacheTokenExpirationDate) > currentTime){
                console.log("Token for " + buyerSCBNId + " has not expired yet");
                ivTenantId = cachedData.tenant_id;
                bearerToken = cachedData.bearer_token;
                ivTTLRemaining = DateTimeUtil.getTimeDifferenceInSeconds(cacheTokenExpirationDate, currentTime);
                cacheTokenInvalid = false;
            }else{
                console.log("Token for " + buyerSCBNId + " has expired.");
                cacheTokenInvalid = true;
            }
        }

        if(cacheTokenInvalid){
            // console.log("cacheTokenInvalid: " + cacheTokenInvalid);
            //Find the iv-credential record for the buyer_scbn_id
            ivCredential = await IVCredential.findOne({ buyer_scbn_id: buyerSCBNId });
            // console.log("ivCredential: " + ivCredential);
            if(ivCredential == null){
                return res.status(404).send({ "message": "The SCBN buyer " + buyerSCBNId + " could not be found. The buyer first needs to be onboarded in s4s-supplement-service." });
            }
            //Make the API call to fetch the new token from IV token service
            console.log("Fetching new token from IV for " + buyerSCBNId);
            var ivAuthTokenResponse = await httpRequest(getIVHTTPOptions(ivCredential));
            bearerToken = ivAuthTokenResponse.access_token;
            // console.log("ivAuthTokenResponse: " + JSON.stringify(ivAuthTokenResponse));
            ivTenantId = ivCredential.iv_tenant_id;
            var ivCredentialDBId = ivCredential._id;
            // console.log("ivCredentialDBId: " + ivCredentialDBId);
            ivCredential = await updateTokenAndExpirationDateInDB(ivCredentialDBId, ivAuthTokenResponse);
            // console.log("new ivCredential: " + JSON.stringify(ivCredential));
            updateTokenAndExpirationDateInCache(buyerSCBNId, ivCredential);
            ivTTLRemaining = getTTLFromIVResponse(ivAuthTokenResponse);
            // console.log("Added token in cache");
            // tokenMemoryCache.printCache();
        }
                
        //Return the json response
        var jsonResponse = {};
        jsonResponse['url'] = Constants.IV_API_BASE_URL.replace('{tenantId}', ivTenantId).replace('{operation}', operation);
        jsonResponse['buyer_scbn_id'] = buyerSCBNId;
        jsonResponse['iv_tenant_id'] = ivTenantId;
        jsonResponse['bearer_token'] = bearerToken;
        jsonResponse['time_to_live'] = ivTTLRemaining;
        res.send(jsonResponse);
    }catch(e){
        console.log(e);
        res.status(500).send(e);
    };
});

function getAuthorizationBearerToken(client_id, client_secret){
    return "Basic " + Base64Util.encode(client_id + ":" + client_secret);
}

function getIVHTTPOptions(ivCredential) {
    // console.log(ivCredential);
    var ivTenantId = ivCredential.iv_tenant_id;
    var ivTenantClientId = ivCredential.iv_tenant_client_id;
    var ivTenantClientSecret = ivCredential.iv_tenant_client_secret;
    
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
    return options;
}

async function updateTokenAndExpirationDateInDB(ivCredentialDBId, ivAuthTokenResponse) {
    var updatedRecord = await IVCredential.findByIdAndUpdate(
        {
            _id: ivCredentialDBId
        },{
            bearer_token: ivAuthTokenResponse.access_token,
            token_expiration_datetime: DateTimeUtil.getTimeAfterSeconds(getTTLFromIVResponse(ivAuthTokenResponse))
            // token_expiration_datetime: DateTimeUtil.getTimeAfterSeconds(120)
        },{
            new: true
        });
    return updatedRecord;
}

function updateTokenAndExpirationDateInCache(buyerSCBNId, ivCredential) {
    tokenMemoryCache.addToCache(buyerSCBNId,
        {
            tenant_id: ivCredential.iv_tenant_id,
            bearer_token: ivCredential.bearer_token,
            token_expiration_datetime: ivCredential.token_expiration_datetime
        });
}

function getTTLFromIVResponse(ivAuthTokenResponse){
    return ivAuthTokenResponse.expires_in - Constants.IV_AUTH_TOKEN_TTL_SAFETY_BUFFER;
}

module.exports = router;