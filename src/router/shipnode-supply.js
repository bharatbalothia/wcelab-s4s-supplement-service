const express = require('express');
const auth = require('../middleware/auth');
const { ResourceNotFoundError, InternalError } = require('../util/errors');
const ShipnodeSupplyController = require('./shipnode-supply-controller')

const router = new express.Router();


//Gets the supplies in a shipnode
router.get('/s4s/:tenantId/suppliers/:supplierId/shipnodes/:shipNodeId/supplies', auth, async (req, res) => {

    try {
        
        supply = await ShipnodeSupplyController.getSuppliesForShipnode(
            req.params.tenantId,
            req.params.supplierId,
            req.params.shipNodeId
        )

        res.send(supply)
    }
    catch (e) {
        if (e instanceof ResourceNotFoundError){
            res.status(404).send(e.message);
        } else {
            res.status(500).send(e.message);
        }
    }
    
});

module.exports = router;