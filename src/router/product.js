const express = require('express');
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
        const product = await Product.findById(_id);
        if(!product){
            return res.status(404).send();
        }
        res.send(product);
    }catch(e){
        console.log(e);
        res.status(500).send(e);
    };
});

//Test for REST Endpoint access
router.get('/hello', async (req, res) => {
    res.send({
        "message": "Hello World !!!"
    });
});

module.exports = router;