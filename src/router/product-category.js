const express = require('express');
const ProductCategory = require('../model/product-category');
const auth = require('../middleware/auth');
const dbUtil = require('../util/db-util');
const router = new express.Router();

//Create a new product category
router.post('/s4s/:tenantId/product/category', auth, async (req, res) => {
    var validationResponse = await dbUtil.validateTenant(req.params.tenantId, req.body);
    if(validationResponse.tenantInvalid){
        return res.status(404).send({ message: "Tenant " + req.params.tenantId + " is not valid"});
    }
    const productCategory = new ProductCategory(validationResponse._body);
    try{
        await productCategory.save();
        res.status(201).send(productCategory);
    }catch(e){
        res.status(400).send(e);
    }
});

//Gets a list of all the product categories
router.get('/s4s/:tenantId/product/categories', auth, async (req, res) => {
    var validationResponse = await dbUtil.validateTenant(req.params.tenantId, req.body);
    if(validationResponse.tenantInvalid){
        return res.status(404).send({ message: "Tenant " + req.params.tenantId + " is not valid"});
    }
    try{
        const productCategories = await ProductCategory.find({ tenant_id: req.params.tenantId });
        res.send(productCategories);
    }catch(e){
        res.status(500).send();
    }
});

module.exports = router;