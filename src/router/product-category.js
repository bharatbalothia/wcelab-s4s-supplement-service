const express = require('express');
const ProductCategory = require('../model/product-category');
const auth = require('../middleware/auth');
const router = new express.Router();

//Create a new product category
router.post('/s4s/product/category', auth, async (req, res) => {
    const productCategory = new ProductCategory(req.body);
    try{
        await productCategory.save();
        res.status(201).send(productCategory);
    }catch(e){
        res.status(400).send(e);
    }
});

//Gets a list of all the product categories
router.get('/s4s/product/categories', auth, async (req, res) => {
    try{
        const productCategories = await ProductCategory.find({});
        res.send(productCategories);
    }catch(e){
        res.status(500).send();
    }
});

module.exports = router;