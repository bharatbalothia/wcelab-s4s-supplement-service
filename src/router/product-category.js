const express = require('express');
const ProductCategory = require('../model/product-category');
const router = new express.Router();

//Create a new product category
router.post('/product/category', async (req, res) => {
    const productCategory = new ProductCategory(req.body);
    try{
        await productCategory.save();
        console.log("Product category Created: ", productCategory);
        res.status(201).send(productCategory);
    }catch(e){
        console.log('Save error.', e);
        res.status(400).send(e);
    }
});

//Gets a list of all the product categories
router.get('/product/categories', async (req, res) => {
    try{
        const productCategories = await ProductCategory.find({});
        res.send(productCategories);
    }catch(e){
        res.status(500).send();
    }
});

module.exports = router;