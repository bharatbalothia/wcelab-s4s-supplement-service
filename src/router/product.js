const express = require('express');
const Product = require('../model/product');
const Tenant = require('../model/tenant');
const auth = require('../middleware/auth');
const dbUtil = require('../util/db-util');
const ProductModule = require('./product-module');
const { ResourceNotFoundError, InternalError } = require('../util/errors');

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
        if(products == null){
            return res.status(404).send();
        }
        res.send(products);
    }catch(e){
        res.status(500).send();
    }
});

//Gets the details of all the input items
router.get('/s4s/:tenantId/productslist', auth, async (req, res) => {
    var validationResponse = await dbUtil.validateTenant(req.params.tenantId, req.body);
    if(validationResponse.tenantInvalid){
        return res.status(404).send({ message: "Tenant " + req.params.tenantId + " is not valid"});
    }
    try{
        var productList = req.body.item_id;
        const products = await Product.find({ item_id: { $in: productList }, tenant_id: req.params.tenantId });
        if(products == null){
            return res.status(404).send();
        }
        res.send(products);
    }catch(e){
        res.status(500).send();
    }
});

//Gets all productslist entitled for the supplier ids
router.post('/s4s/:tenantId/suppliers/products', auth, async (req, res) => {
    var validationResponse = await dbUtil.validateTenant(req.params.tenantId, req.body);
    if(validationResponse.tenantInvalid){
        return res.status(404).send({ message: "Tenant " + req.params.tenantId + " is not valid"});
    }
    try{
        var supplierList = req.body.supplier_ids;
        const products = await Product.find({ supplier_id: { $in: supplierList }, tenant_id: req.params.tenantId });
        if(products == null){
            return res.status(404).send();
        }
        res.send(products);
    }catch(e){
        res.status(500).send();
    }
});

//Gets all productslist entitled for the supplier ids
router.get('/s4s/:tenantId/suppliers/products', auth, async (req, res) => {
    var validationResponse = await dbUtil.validateTenant(req.params.tenantId, req.body);
    if(validationResponse.tenantInvalid){
        return res.status(404).send({ message: "Tenant " + req.params.tenantId + " is not valid"});
    }
    try{
        var supplierList = req.body.supplier_ids;
        const products = await Product.find({ supplier_id: { $in: supplierList }, tenant_id: req.params.tenantId });
        if(products == null){
            return res.status(404).send();
        }
        res.send(products);
    }catch(e){
        res.status(500).send();
    }
});

//Gets all products entitled for the supplier id
router.get('/s4s/:tenantId/suppliers/:supplierId/products', auth, async (req, res) => {
    
    try {
        
        var products = await ProductModule.getSupplierProduct(    
            req.params.tenantId, req.body, req.params.supplierId)
        
        res.send(products)

    } catch (e) {
        if (e instanceof ResourceNotFoundError){
            res.status(404).send(e.message);
        } else {
            res.status(500).send(e.message);
        }
    }


    // var validationResponse = await dbUtil.validateTenant(req.params.tenantId, req.body);
    // if(validationResponse.tenantInvalid){
    //     return res.status(404).send({ message: "Tenant " + req.params.tenantId + " is not valid"});
    // }
    // try{
    //     const products = await Product.find({ supplier_id: req.params.supplierId, tenant_id: req.params.tenantId });
    //     if(products == null){
    //         return res.status(404).send();
    //     }
    //     res.send(products);
    // }catch(e){
    //     res.status(500).send();
    // }
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
        if(product == null){
            return res.status(404).send();
        }
        res.send(product);
    }catch(e){
        res.status(500).send(e);
    };
});

//Gets products based on a category id
router.get('/s4s/:tenantId/productcategories/:id/products', auth, async (req, res) => {
    var validationResponse = await dbUtil.validateTenant(req.params.tenantId, req.body);
    if(validationResponse.tenantInvalid){
        return res.status(404).send({ message: "Tenant " + req.params.tenantId + " is not valid"});
    }
    const _id = req.params.id;
    try{
        const products = await Product.find({ category: _id, tenant_id: req.params.tenantId });
        if(products == null){
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
        if(products == null){
            return res.status(404).send();
        }
        res.send(products);
    }catch(e){
        res.status(500).send(e);
    };
});

//Deletes a product
router.delete('/s4s/:tenantId/products/:id', auth, async (req, res) => {
    var validationResponse = await dbUtil.validateTenant(req.params.tenantId, req.body);
    if(validationResponse.tenantInvalid){
        return res.status(404).send({ message: "Tenant " + req.params.tenantId + " is not valid"});
    }
    try{
        const product = await Product.findOneAndDelete({ item_id: req.params.id, tenant_id: req.params.tenantId });
        if(product == null){
            return res.status(404).send();
        }
        res.send(product);
    }catch(e){
        res.status(500).send();
    }
});

//Updates/Patches a product
// router.patch('/s4s/:tenantId/products/:id', auth, async (req, res) => {
//     var validationResponse = await dbUtil.validateTenant(req.params.tenantId, req.body);
//     if(validationResponse.tenantInvalid){
//         return res.status(404).send({ message: "Tenant " + req.params.tenantId + " is not valid"});
//     }
//     try{
//         const product = await Product.findOneAndUpdate({ item_id: req.params.id, tenant_id: req.params.tenantId }, req.body, { new : true });
//         if(product == null){
//             return res.status(404).send();
//         }
//         res.send(product);
//     }catch(e){
//         res.status(500).send();
//     }
// });

//Manages a product
router.put('/s4s/:tenantId/products/:id', auth, async (req, res) => {
    var validationResponse = await dbUtil.validateTenant(req.params.tenantId, req.body);
    if(validationResponse.tenantInvalid){
        return res.status(404).send({ message: "Tenant " + req.params.tenantId + " is not valid"});
    }
    try{
        const product = await Product.findOneAndUpdate({ item_id: (req.params.id).toUpperCase(), tenant_id: req.params.tenantId }, req.body, { new : true });
        if(product == null){
            const product = new Product(validationResponse._body);
            await product.save();
            return res.status(201).send(product);
        }
        res.send(product);
    }catch(e){
        res.status(500).send();
    }
});

module.exports = router;