const express = require('express');
const Product = require('../model/product');
const Tenant = require('../model/tenant');
const auth = require('../middleware/auth');
const dbUtil = require('../util/db-util');
const router = new express.Router();

//Create a new item or product
router.post('/s4s/:tenantId/products', auth, async (req, res) => {
    var validationResponse = await dbUtil.validateTenant(req.params.tenantId, req.body);
    if(validationResponse.tenantInvalid){
        return res.status(404).send({ message: "Tenant " + req.params.tenantId + " is not valid"});
    }
    const product = new Product(validationResponse._body);
    try{
        await product.save();
        res.status(201).send(product);
    }catch(e){
        res.status(400).send(e);
    }
});

//Gets the details of all the input items
router.post('/s4s/:tenantId/productslist', auth, async (req, res) => {
    var validationResponse = await dbUtil.validateTenant(req.params.tenantId, req.body);
    if(validationResponse.tenantInvalid){
        return res.status(404).send({ message: "Tenant " + req.params.tenantId + " is not valid"});
    }
    try{
        var productList = req.body.item_id;
        const products = await Product.find({ item_id: { $in: productList }, tenant_id: req.params.tenantId });
        if(!products){
            return res.status(404).send();
        }
        res.send(products);
    }catch(e){
        res.status(500).send();
    }
});

//Gets a list of all the items
router.get('/s4s/:tenantId/products', auth, async (req, res) => {
    var validationResponse = await dbUtil.validateTenant(req.params.tenantId, req.body);
    if(validationResponse.tenantInvalid){
        return res.status(404).send({ message: "Tenant " + req.params.tenantId + " is not valid"});
    }
    try{
        const products = await Product.find({ tenant_id: req.params.tenantId });
        res.send(products);
    }catch(e){
        res.status(500).send();
    }
});

//Gets an item based on id
router.get('/s4s/:tenantId/products/:id', auth, async (req, res) => {
    var validationResponse = await dbUtil.validateTenant(req.params.tenantId, req.body);
    if(validationResponse.tenantInvalid){
        return res.status(404).send({ message: "Tenant " + req.params.tenantId + " is not valid"});
    }
    const _id = req.params.id;
    try{
        const product = await Product.findOne({ item_id: _id, tenant_id: req.params.tenantId });
        if(!product){
            return res.status(404).send();
        }
        res.send(product);
    }catch(e){
        res.status(500).send(e);
    };
});

//Gets products based on a category id
router.get('/s4s/:tenantId/products/category/:id', auth, async (req, res) => {
    var validationResponse = await dbUtil.validateTenant(req.params.tenantId, req.body);
    if(validationResponse.tenantInvalid){
        return res.status(404).send({ message: "Tenant " + req.params.tenantId + " is not valid"});
    }
    const _id = req.params.id;
    try{
        const products = await Product.find({ category: _id, tenant_id: req.params.tenantId });
        if(!products){
            return res.status(404).send();
        }
        res.send(products);
    }catch(e){
        res.status(500).send(e);
    };
});

//Gets an item based on tag
router.get('/s4s/:tenantId/products/tag/:id', auth, async (req, res) => {
    var validationResponse = await dbUtil.validateTenant(req.params.tenantId, req.body);
    if(validationResponse.tenantInvalid){
        return res.status(404).send({ message: "Tenant " + req.params.tenantId + " is not valid"});
    }
    const _tag = String(req.params.id).split('&');
    try{
        const products = await Product.find({ tags: { $in: _tag }, tenant_id: req.params.tenantId });
        if(!products){
            return res.status(404).send();
        }
        res.send(products);
    }catch(e){
        res.status(500).send(e);
    };
});

module.exports = router;