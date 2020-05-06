const express = require('express');
const router = new express.Router();
const pjson = require('../../package.json');

router.get('/', async (req, res) => {
    res.send(getAPIInfo());
});

router.get('/s4s', async (req, res) => {
    res.send(getAPIInfo());
});

function getAPIInfo() {
    return {
        "project": "S4S - Sterling 4 Scarce Supply Inventory Visibility",
        "release": "Phase 1",
        "service": "s4s-supplement-service",
        "version": pjson.version,
        "environment": process.env.APP_ENVIRONMENT
    };
}

module.exports = router;