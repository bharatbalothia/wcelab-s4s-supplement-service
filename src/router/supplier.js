const express = require('express');
const Supplier = require('../model/supplier');
const router = new express.Router();

//Create a new supplier
router.post('/supplier', async (req, res) => {
    const supplier = new Supplier(req.body);
    try{
        await supplier.save();
        console.log("Supplier Created: ", supplier);
        res.status(201).send(supplier);
    }catch(e){
        console.log('Save error.', e);
        res.status(400).send(e);
    }
});

//Gets a list of all the suppliers
router.get('/suppliers', async (req, res) => {
    try{
        const suppliers = await Supplier.find({});
        res.send(suppliers);
    }catch(e){
        res.status(500).send();
    }
});

//Gets an item based on id
router.get('/supplier/:id', async (req, res) => {
    const _id = req.params.id;
    try{
        const supplier = await Supplier.find({ supplier_id: _id });
        if(!supplier){
            return res.status(404).send();
        }
        res.send(supplier);
    }catch(e){
        console.log(e);
        res.status(500).send(e);
    };
});

module.exports = router;