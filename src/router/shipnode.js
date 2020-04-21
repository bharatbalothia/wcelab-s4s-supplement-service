const express = require('express');
const ShipNode = require('../model/shipnode');
const auth = require('../middleware/auth');
const dbUtil = require('../util/db-util');
const router = new express.Router();

//Create a new supplier
router.post('/s4s/:tenantId/suppliers/:supplierId/shipnodes', auth, async (req, res) => {
    var validationResponse = await dbUtil.validateTenantAndSupplier(req.params.tenantId, req.params.supplierId, req.body);
    if(validationResponse.tenantInvalid){
        return res.status(404).send({ message: "Tenant " + req.params.tenantId + " is not valid"});
    }
    if(validationResponse.supplierInvalid){
        return res.status(404).send({ message: "Supplier " + req.params.supplierId + " is not valid"});
    }
    var shipnode;
    try{
        if(Array.isArray(validationResponse._body)){
            for(let _shipnode of validationResponse._body){
                shipnode = new ShipNode(_shipnode);
                await shipnode.save();
            }
        }else{
            shipnode = new ShipNode(validationResponse._body);
            await shipnode.save();
        }
        res.status(201).send(validationResponse._body);
    }catch(e){
        console.log("Save Error: " + e);
        res.status(400).send(e);
    }
});

//Gets a list of all the shipnodes for the supplier
router.get('/s4s/:tenantId/suppliers/:supplierId/shipnodes', auth, async (req, res) => {
    var validationResponse = await dbUtil.validateTenantAndSupplier(req.params.tenantId, req.params.supplierId, req.body);
    if(validationResponse.tenantInvalid){
        return res.status(404).send({ message: "Tenant " + req.params.tenantId + " is not valid"});
    }
    if(validationResponse.supplierInvalid){
        return res.status(404).send({ message: "Supplier " + req.params.supplierId + " is not valid"});
    }
    try{
        const shipnodes = await ShipNode.find({ supplier_id: req.params.supplierId, tenant_id: req.params.tenantId });
        res.send(shipnodes);
    }catch(e){
        res.status(500).send();
    }
});

//Gets the a ship node details for the supplier
router.get('/s4s/:tenantId/suppliers/:supplierId/shipnodes/:shipNodeId', auth, async (req, res) => {
    var validationResponse = await dbUtil.validateTenantAndSupplier(req.params.tenantId, req.params.supplierId, req.body);
    if(validationResponse.tenantInvalid){
        return res.status(404).send({ message: "Tenant " + req.params.tenantId + " is not valid"});
    }
    if(validationResponse.supplierInvalid){
        return res.status(404).send({ message: "Supplier " + req.params.supplierId + " is not valid"});
    }
    try{
        const shipnodes = await ShipNode.find({ supplier_id: (req.params.supplierId).toUpperCase(), shipnode_id: (req.params.shipNodeId).toUpperCase(), tenant_id: req.params.tenantId });
        res.send(shipnodes);
    }catch(e){
        res.status(500).send();
    }
});

//Put a ship node to a supplier
router.put('/s4s/:tenantId/suppliers/:supplierId/shipnodes/:shipNodeId', auth, async (req, res) => {
    var validationResponse = await dbUtil.validateTenantAndSupplier(req.params.tenantId, req.params.supplierId, req.body);
    if(validationResponse.tenantInvalid){
        return res.status(404).send({ message: "Tenant " + req.params.tenantId + " is not valid"});
    }
    if(validationResponse.supplierInvalid){
        return res.status(404).send({ message: "Supplier " + req.params.supplierId + " is not valid"});
    }
    try{
        var shipnode = await ShipNode.findOneAndUpdate({ supplier_id: (req.params.supplierId).toUpperCase(), shipnode_id: (req.params.shipNodeId).toUpperCase(), tenant_id: req.params.tenantId }, req.body, { new : true });
        if(shipnode == null){
            shipnode = new ShipNode(validationResponse._body);
            await shipnode.save();
            return res.status(201).send(shipnode);
        }
        return res.send(shipnode);
    }catch(e){
        console.log(e);
        res.status(500).send();
    }
});

module.exports = router;