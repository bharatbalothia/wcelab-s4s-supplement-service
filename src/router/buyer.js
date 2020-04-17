const express = require('express');
const Buyer = require('../model/buyer');
const auth = require('../middleware/auth');
const dbUtil = require('../util/db-util');
const router = new express.Router();

//Create a new buyer
router.post('/s4s/:tenantId/buyers', auth, async (req, res) => {
    var validationResponse = await dbUtil.validateTenant(req.params.tenantId, req.body);
    if(validationResponse.tenantInvalid){
        return res.status(404).send({ message: "Tenant " + req.params.tenantId + " is not valid"});
    }
    const buyer = new Buyer(validationResponse._body);
    try{
        await buyer.save();
        res.status(201).send(buyer);
    }catch(e){
        res.status(400).send(e);
    }
});

//Gets a list of all the buyers
router.get('/s4s/:tenantId/buyers', auth, async (req, res) => {
    var validationResponse = await dbUtil.validateTenant(req.params.tenantId, req.body);
    if(validationResponse.tenantInvalid){
        return res.status(404).send({ message: "Tenant " + req.params.tenantId + " is not valid"});
    }
    try{
        const buyers = await Buyer.find({ tenant_id: req.params.tenantId });
        res.send(buyers);
    }catch(e){
        res.status(500).send();
    }
});

//Gets a buyer based on id
router.get('/s4s/:tenantId/buyers/:id', auth, async (req, res) => {
    var validationResponse = await dbUtil.validateTenant(req.params.tenantId, req.body);
    if(validationResponse.tenantInvalid){
        return res.status(404).send({ message: "Tenant " + req.params.tenantId + " is not valid"});
    }
    const _id = req.params.id;
    try{
        const buyer = await Buyer.findOne({ buyer_id: _id, tenant_id: req.params.tenantId });
        if(!buyer){
            return res.status(404).send();
        }
        res.send(buyer);
    }catch(e){
        res.status(500).send(e);
    };
});

//Patches a buyer based on id
router.patch('/s4s/:tenantId/buyers/:id', auth, async (req, res) => {
    var validationResponse = await dbUtil.validateTenant(req.params.tenantId, req.body);
    if(validationResponse.tenantInvalid){
        return res.status(404).send({ message: "Tenant " + req.params.tenantId + " is not valid"});
    }
    const _id = req.params.id;
    try{
        const buyer = await Buyer.findOneAndUpdate({ buyer_id: _id, tenant_id: req.params.tenantId }, req.body, { new: true });
        if(!buyer){
            return res.status(404).send();
        }
        res.send(buyer);
    }catch(e){
        res.status(500).send(e);
    };
});

//Deletes a buyer
router.delete('/s4s/:tenantId/buyers/:id', auth, async (req, res) => {
    var validationResponse = await dbUtil.validateTenant(req.params.tenantId, req.body);
    if(validationResponse.tenantInvalid){
        return res.status(404).send({ message: "Tenant " + req.params.tenantId + " is not valid"});
    }
    try{
        const buyer = await Buyer.findOneAndDelete({ buyer_id: req.params.id, tenant_id: req.params.tenantId });
        if(!buyer){
            return res.status(404).send();
        }
        res.send(buyer);
    }catch(e){
        res.status(500).send();
    }
});

module.exports = router;