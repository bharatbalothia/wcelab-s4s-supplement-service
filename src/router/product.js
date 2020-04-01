const express = require('express');
// const url = require('url');
const Product = require('../model/product');
const router = new express.Router();

//Create a new item or product
router.post('/product', async (req, res) => {
    const product = new Product(req.body);
    try{
        await product.save();
        console.log("Product Created: ", product);
        res.status(201).send(product);
    }catch(e){
        console.log('Save error.', e);
        res.status(400).send(e);
    }
});

//Gets a list of all the items
router.get('/products', async (req, res) => {
    try{
        const _params = req.params;
        console.log("_params: ", _params);
        const products = await Product.find({});
        res.send(products);
    }catch(e){
        res.status(500).send();
    }
});

//Gets an item based on id
router.get('/product/:id', async (req, res) => {
    const _id = req.params.id;
    try{
        const product = await Product.find({ item_id: _id });
        if(!product){
            return res.status(404).send();
        }
        res.send(product);
    }catch(e){
        console.log(e);
        res.status(500).send(e);
    };
});

//Gets an item based on tag
router.get('/products/tag/:id', async (req, res) => {
    const _tag = String(req.params.id).split('&');
    console.log('tag:' + _tag);
    try{
        const products = await Product.find({ tags: { $in: _tag } });
        if(!products){
            return res.status(404).send();
        }
        res.send(products);
    }catch(e){
        console.log(e);
        res.status(500).send(e);
    };
});

module.exports = router;