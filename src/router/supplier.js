const express = require('express');
const Supplier = require('../model/supplier');
const auth = require('../middleware/auth');
const dbUtil = require('../util/db-util');
const router = new express.Router();

//Create a new supplier
router.post('/s4s/:tenantId/suppliers', auth, async (req, res) => {
    var validationResponse = await dbUtil.validateTenant(req.params.tenantId, req.body);
    if(validationResponse.tenantInvalid){
        return res.status(404).send({ message: "Tenant " + req.params.tenantId + " is not valid"});
    }
    const supplier = new Supplier(validationResponse._body);
    try{
        await supplier.save();
        res.status(201).send(supplier);
    }catch(e){
        res.status(400).send(e);
    }
});

//Gets a list of all the suppliers
router.get('/s4s/:tenantId/suppliers', auth, async (req, res) => {
    var validationResponse = await dbUtil.validateTenant(req.params.tenantId, req.body);
    if(validationResponse.tenantInvalid){
        return res.status(404).send({ message: "Tenant " + req.params.tenantId + " is not valid"});
    }
    try{
        const suppliers = await Supplier.find({});
        res.send(suppliers);
    }catch(e){
        res.status(500).send();
    }
});

//Gets an item based on id
router.get('/s4s/:tenantId/suppliers/:id', auth, async (req, res) => {
    var validationResponse = await dbUtil.validateTenant(req.params.tenantId, req.body);
    if(validationResponse.tenantInvalid){
        return res.status(404).send({ message: "Tenant " + req.params.tenantId + " is not valid"});
    }
    const _id = req.params.id;
    try{
        const supplier = await Supplier.findOne({ supplier_id: _id });
        if(!supplier){
            return res.status(404).send();
        }
        res.send(supplier);
    }catch(e){
        res.status(500).send(e);
    };
});

module.exports = router;