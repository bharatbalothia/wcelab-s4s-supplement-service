const express = require('express');
const ProductCategory = require('../model/product-category');
const auth = require('../middleware/auth');
const dbUtil = require('../util/db-util');
const router = new express.Router();

//Create a new product category
router.post('/s4s/:tenantId/productcategories', auth, async (req, res) => {
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

//Manage a product category
router.put('/s4s/:tenantId/productcategories', auth, async (req, res) => {
    var validationResponse = await dbUtil.validateTenant(req.params.tenantId, req.body);
    if(validationResponse.tenantInvalid){
        return res.status(404).send({ message: "Tenant " + req.params.tenantId + " is not valid"});
    }
    try{
        const productCategory = await ProductCategory.findOneAndUpdate({ category_id: (req.params.categoryId).toUpperCase(), tenant_id: req.params.tenantId });
        if(!productCategory){
            const productCategory = new ProductCategory(validationResponse._body);
            await productCategory.save();
            res.status(201).send(productCategory);
        }
        res.send(productCategory);
    }catch(e){
        res.status(400).send(e);
    }
});

//Gets a list of all the product categories
router.get('/s4s/:tenantId/productcategories', auth, async (req, res) => {
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

//Gets the detail of a product category
router.get('/s4s/:tenantId/productcategories/:categoryId', auth, async (req, res) => {
    var validationResponse = await dbUtil.validateTenant(req.params.tenantId, req.body);
    if(validationResponse.tenantInvalid){
        console.log("tenant %s invalid", eq.params.tenantId);
        return res.status(404).send({ message: "Tenant " + req.params.tenantId + " is not valid"});
    }
    try{
        const productCategory = await ProductCategory.findOne({ category_id: (req.params.categoryId).toUpperCase(), tenant_id: req.params.tenantId });
        if(!productCategory){
            return res.status(404).send();
        }
        res.send(productCategory);
    }catch(e){
        res.status(500).send();
    }
});

//Deletes a product category
router.delete('/s4s/:tenantId/productcategories/:categoryId', auth, async (req, res) => {
    var validationResponse = await dbUtil.validateTenant(req.params.tenantId, req.body);
    if(validationResponse.tenantInvalid){
        return res.status(404).send({ message: "Tenant " + req.params.tenantId + " is not valid"});
    }
    try{
        const productCategory = await ProductCategory.findOneAndDelete({ category_id: (req.params.categoryId).toUpperCase(), tenant_id: req.params.tenantId });
        if(!productCategory){
            return res.status(404).send();
        }
        res.send(productCategory);
    }catch(e){
        res.status(500).send();
    }
});

module.exports = router;