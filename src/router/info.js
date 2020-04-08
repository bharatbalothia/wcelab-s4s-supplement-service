const express = require('express');
const router = new express.Router();

//Test for REST Endpoint access
router.get('/s4s/info', async (req, res) => {
    res.send({
        "project": "S4S - Sterling 4 Scarce Supply Inventory Visibility",
        "release": "Phase 1",
        "service": "s4s-supplement-service",
        "version": "1.14",
        "environment": "development"
    });
});

module.exports = router;