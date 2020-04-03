const express = require('express');
const Product = require('../model/product');
const auth = require('../middleware/auth');
const router = new express.Router();

//Create a new item or product
router.post('/products', auth, async (req, res) => {
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
router.get('/products', auth, async (req, res) => {
    try{
        const products = await Product.find({});
        res.send(products);
    }catch(e){
        res.status(500).send();
    }
});

//Gets an item based on id
router.get('/products/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try{
        const product = await Product.findOne({ item_id: _id });
        if(!product){
            return res.status(404).send();
        }
        res.send(product);
    }catch(e){
        console.log(e);
        res.status(500).send(e);
    };
});

//Gets products based on a category id
router.get('/products/category/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try{
        const product = await Product.find({ category: _id });
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
router.get('/products/tag/:id', auth, async (req, res) => {
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