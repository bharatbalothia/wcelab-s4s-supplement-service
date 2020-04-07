const express = require('express');
const Tenant = require('../model/tenant');
const auth = require('../middleware/auth');
const router = new express.Router();

//Create a new tenant
router.post('/s4s/tenants', auth, async (req, res) => {
    const tenant = new Tenant(req.body);
    try{
        await tenant.save();
        res.status(201).send(tenant);
    }catch(e){
        res.status(400).send(e);
    }
});

//Gets a list of tenants
router.get('/s4s/tenants', auth, async (req, res) => {
    try{
        const tenants = await Tenant.find({});
        res.send(tenants);
    }catch(e){
        res.status(500).send();
    }
});

//Gets an tenant based on id
router.get('/s4s/tenants/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try{
        const tenant = await Tenant.findOne({ tenant_id: _id });
        if(!tenant){
            return res.status(404).send();
        }
        res.send(tenant);
    }catch(e){
        res.status(500).send(e);
    };
});

module.exports = router;