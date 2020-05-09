const express = require('express');
const auth = require('../middleware/auth');
const router = new express.Router();
const S4SCredentialModule = require('./s4s-credential-module')
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
    // var forceToken = (req.body.force_token == "true");
    // console.log("forceToken: " + forceToken);
    
    try{
        jsonResponse = await S4SCredentialModule.getS4SCredentials(
            buyerSCBNId, operation, supplierMailslotId)
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