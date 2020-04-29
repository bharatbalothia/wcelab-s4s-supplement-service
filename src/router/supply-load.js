const express = require('express');
const auth = require('../middleware/auth');
const { ResourceNotFoundError, InternalError } = require('../util/errors');
const SupplyLoadController = require('./supply-load-controller')
const dbUtil = require('../util/db-util');
const HttpUtil = require('../util/http-util');
const IVCredentialModule = require('./iv-credential-module')
const router = new express.Router();

//Puts/loads the supply data in IV instance
router.put('/s4s/:tenantId/suppliers/:supplierId/supplies', auth, async (req, res) => {

    try {

        var tenantId = req.params.tenantId;
        var supplierId = req.params.supplierId;

        supplySyncResult = await SupplyLoadController.loadSupplierSupply(tenantId, supplierId, req.body)

        res.send(supplySyncResult);
    }
    catch (e) {

        console.log(e);
        

        if (e instanceof ResourceNotFoundError){
            res.status(404).send(e.message);
        } else {
            res.status(500).send(e.message);
        }
    }
    
});

module.exports = router;
