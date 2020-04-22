const express = require('express');
const User = require('../model/user');
const Buyer = require('../model/buyer');
const auth = require('../middleware/auth');
const dbUtil = require('../util/db-util');
const router = new express.Router();

//Create a new user
router.post('/s4s/:tenantId/users', auth, async (req, res) => {
    var validationResponse = await dbUtil.validateTenant(req.params.tenantId, req.body);
    if(validationResponse.tenantInvalid){
        return res.status(404).send({ message: "Tenant " + req.params.tenantId + " is not valid"});
    }
    const user = new User(validationResponse._body);
    try{
        await user.save();
        res.status(201).send(user);
    }catch(e){
        res.status(400).send(e);
    }
});

//Gets a user based on username
router.get('/s4s/:tenantId/users/:id', auth, async (req, res) => {
    var validationResponse = await dbUtil.validateTenant(req.params.tenantId, req.body);
    if(validationResponse.tenantInvalid){
        return res.status(404).send({ message: "Tenant " + req.params.tenantId + " is not valid"});
    }
    const _id = req.params.id;
    try{
        var user = await User.findOne({ username: _id, tenant_id: req.params.tenantId });
        if(user == null){
            return res.status(404).send();
        }
        var _user = JSON.parse(JSON.stringify(user));
        var sellerList = new Set();
        var i = 0;
        if(user.buyers.length > 0){
            _user['connected_suppliers'] = [];
            for await (const buyer of Buyer.find({ buyer_id: { $in: user.buyers }, tenant_id: req.params.tenantId })) {
                for(let seller of buyer.suppliers){
                    sellerList.add(seller);
                }
            }
            sellerList.forEach(seller => {
                _user['connected_suppliers'].push(seller);
            });
        }
        res.send(_user);
    }catch(e){
        console.log(e);
        res.status(500).send(e);
    };
});

//Modifies a user
router.put('/s4s/:tenantId/users/:id', auth, async (req, res) => {
    var validationResponse = await dbUtil.validateTenant(req.params.tenantId, req.body);
    if(validationResponse.tenantInvalid){
        return res.status(404).send({ message: "Tenant " + req.params.tenantId + " is not valid"});
    }
    try{
        const user = await User.findOneAndUpdate({ username: req.params.id, tenant_id: req.params.tenantId }, req.body, { new : true });
        if(!user){
            const user = new User(validationResponse._body);
            await user.save();
            res.status(201).send(user);
        }
        res.send(user);
    }catch(e){
        res.status(500).send();
    }
});

//Deletes a user
router.delete('/s4s/:tenantId/users/:id', auth, async (req, res) => {
    var validationResponse = await dbUtil.validateTenant(req.params.tenantId, req.body);
    if(validationResponse.tenantInvalid){
        return res.status(404).send({ message: "Tenant " + req.params.tenantId + " is not valid"});
    }
    try{
        const user = await User.findOneAndDelete({ username: req.params.id, tenant_id: req.params.tenantId });
        if(!user){
            return res.status(404).send();
        }
        res.send(user);
    }catch(e){
        res.status(500).send();
    }
});

module.exports = router;