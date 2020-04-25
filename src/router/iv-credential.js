const express = require('express');
const httpRequest = require('request-promise');
const IVCredential = require('../model/iv-credential');
const Supplier = require('../model/supplier');
const Constants = require('../util/constants');
const Base64Util = require('../util/base64-util');
const DateTimeUtil = require('../util/datetime-util');
const TokenMemoryCache = require('../cache/token-cache');
const auth = require('../middleware/auth');
const router = new express.Router();
const IVCredentialModule = require('./iv-credential-module')
const { ResourceNotFoundError, InternalError } = require('../util/errors');

// var tokenMemoryCache;

//Create a iv credential for SCBN buyer
router.post('/s4s/iv-credential', auth, async (req, res) => {
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
router.post('/s4s/iv-token', auth, async (req, res) => {
    // console.log(req.body);
    const buyerSCBNId = req.body.buyer_scbn_id;
    const operation = req.body.operation;
    const supplierMailslotId = req.body.supplier_mailslot_id;
    var forceToken = (req.body.force_token == "true");
    // console.log("forceToken: " + forceToken);
    
    try{
        //Fetch the current token from memory
        // var bearerToken;
        // var cacheTokenInvalid = true;
        // var ivCredential;
        // var ivTenantId;
        // var ivTTLRemaining;
        // tokenMemoryCache = new TokenMemoryCache().getInstance();
        // // tokenMemoryCache.printCache();

        // if(forceToken){
        //     console.log("Forcing new token for " + buyerSCBNId);
        // }
        // if (!forceToken && tokenMemoryCache.foundInCache(buyerSCBNId)){
        //     cachedData = tokenMemoryCache.getFromCache(buyerSCBNId);
        //     // console.log("tokenMemoryCache: " + JSON.stringify(cachedData));
        //     //Check if the current cache token has expired
        //     var cacheTokenExpirationDate = cachedData.token_expiration_datetime;
        //     // console.log("cacheTokenExpirationDate: " + cacheTokenExpirationDate);
        //     var currentTime = new Date();
        //     // console.log("currentTime: " + currentTime);
        //     if(new Date(cacheTokenExpirationDate) > currentTime){
        //         console.log("Token for " + buyerSCBNId + " has not expired yet");
        //         ivTenantId = cachedData.tenant_id;
        //         bearerToken = cachedData.bearer_token;
        //         ivTTLRemaining = DateTimeUtil.getTimeDifferenceInSeconds(cacheTokenExpirationDate, currentTime);
        //         cacheTokenInvalid = false;
        //     }else{
        //         console.log("Token for " + buyerSCBNId + " has expired.");
        //         cacheTokenInvalid = true;
        //     }
        // }

        // if(cacheTokenInvalid){
        //     // console.log("cacheTokenInvalid: " + cacheTokenInvalid);
        //     //Find the iv-credential record for the buyer_scbn_id
        //     ivCredential = await IVCredential.findOne({ buyer_scbn_id: buyerSCBNId });
        //     // console.log("ivCredential: " + ivCredential);
        //     if(ivCredential == null){
        //         return res.status(404).send({ "message": "The SCBN buyer " + buyerSCBNId + " could not be found. The buyer first needs to be onboarded in s4s-supplement-service." });
        //     }
        //     //Make the API call to fetch the new token from IV token service
        //     console.log("Fetching new token from IV for " + buyerSCBNId);
        //     var ivAuthTokenResponse = await httpRequest(getIVHTTPOptions(ivCredential));
        //     bearerToken = ivAuthTokenResponse.access_token;
        //     // console.log("ivAuthTokenResponse: " + JSON.stringify(ivAuthTokenResponse));
        //     ivTenantId = ivCredential.iv_tenant_id;
        //     var ivCredentialDBId = ivCredential._id;
        //     // console.log("ivCredentialDBId: " + ivCredentialDBId);
        //     ivCredential = await updateTokenAndExpirationDateInDB(ivCredentialDBId, ivAuthTokenResponse);
        //     // console.log("new ivCredential: " + JSON.stringify(ivCredential));
        //     updateTokenAndExpirationDateInCache(buyerSCBNId, ivCredential);
        //     ivTTLRemaining = getTTLFromIVResponse(ivAuthTokenResponse);
        //     // console.log("Added token in cache");
        //     // tokenMemoryCache.printCache();
        // }

        // const supplier = await Supplier.findOne({ supplier_mailslot_id: supplierMailslotId, tenant_id: ivTenantId });
                
        // //Return the json response
        // var jsonResponse = {};
        // jsonResponse['url'] = Constants.IV_API_BASE_URL.replace('{tenantId}', ivTenantId).replace('{operation}', operation);
        // jsonResponse['buyer_scbn_id'] = buyerSCBNId;
        // if(supplier){
        //     jsonResponse['supplier_id'] = supplier.supplier_id;
        // }else{
        //     res.status(404).send({ message: 'SCBN Buyer Id ' + buyerSCBNId + ' is not valid. The supplier could not be found.' });
        // }
        // jsonResponse['iv_tenant_id'] = ivTenantId;
        // jsonResponse['bearer_token'] = bearerToken;
        // jsonResponse['time_to_live'] = ivTTLRemaining;

        jsonResponse = await IVCredentialModule.getIVToken(
            buyerSCBNId, operation, supplierMailslotId, forceToken)
        res.send(jsonResponse);
    }catch(e){
        if (e instanceof ResourceNotFoundError) {
            console.log(e);
            res.status(400).send(e);
        } else {
            console.log(e);
            res.status(500).send(e);
        }
    };
});



module.exports = router;