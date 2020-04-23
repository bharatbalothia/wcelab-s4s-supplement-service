const express = require('express');
const router = new express.Router();
const pjson = require('../../package.json');

//Test for REST Endpoint access
router.get('/', async (req, res) => {
    res.send({
        "project": "S4S - Sterling 4 Scarce Supply Inventory Visibility",
        "release": "Phase 1",
        "service": process.env.CF_APP,
        "version": pjson.version,
        "environment": process.env.APP_ENVIRONMENT
    });
});

module.exports = router;