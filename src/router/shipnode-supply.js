const express = require('express');
const ShipNode = require('../model/shipnode');
const auth = require('../middleware/auth');
const dbUtil = require('../util/db-util');
const ProductModule = require('./product-module');
const IVCredentialModule = require('./iv-credential-module')
const { ResourceNotFoundError, InternalError } = require('../util/errors');
const HttpUtil = require('../util/http-util')
const RequestPromise = require('request-promise');

const router = new express.Router();


//Gets the supplies in a shipnode
router.get('/s4s/:tenantId/suppliers/:supplierId/shipnodes/:shipNodeId/supplies', auth, async (req, res) => {

    var shipNodeToSearch = (req.params.shipNodeId).toUpperCase()

    if (shipNodeToSearch == null || shipNodeToSearch == '') {
        return res.status(404).send({ message: "Missing required shipnode in parameter" });
    } else {
        var supplier = await dbUtil.getSupplier(req.params.tenantId, (req.params.supplierId).toUpperCase());

        if (supplier) {
            try {
                const supplies = await getSuppliesForShipnode(supplier, shipNodeToSearch)
                
                res.send(supplies)

            } catch (e) {
                if (e instanceof ResourceNotFoundError) {
                    return res.status(404).send(e)
                } else {
                    res.status(500).send();
                }
            }
        } else {
            return res.status(404).send({ message: "Tenant " + req.params.tenantId + " and Supplier " + req.params.supplierId + " combination does not exist." });
        }
    }
});

async function getSuppliesForShipnode(supplier, shipnodeId) {

    const tenantId = supplier.tenant_id
    const supplierId = supplier.supplier_id

    shipnode = await ShipNode.findOne(
        {
            tenant_id: tenantId,
            supplier_id: supplierId,
            shipnode_id: shipnodeId,
        }
    );

    if (shipnode != null) {
        console.log('getting items for: ', tenantId, ",", supplierId)
        
        var products = await ProductModule.getSupplierProduct(tenantId, {}, supplierId)

        console.log("getSupplierProduct result: ", JSON.stringify(products))

        if (Array.isArray(products) && products.length) {
            supplyList = await getSupplyForShipnodeItemList(supplier, shipnodeId, products)

            return supplyList
        }
    } else {
        throw new ResourceNotFoundError(`tenant: ${tenantId} supplier: ${supplierId} shipnode: ${shipnodeId}`,
                    'Cannot find the specificed shipnode for the supplier in tenant.')
    }

    // return shipnode
}

async function getSupplyForShipnodeItemList(supplier, shipnodeId, itemList) {

    var promises = []

    itemList.forEach(element => {

        console.log("Need to get supply for ", shipnodeId, element.item_id)
        
        promises.push(getSupplyForShipnodeItem(supplier, shipnodeId, element.item_id))

    });

    shipnodeCompleteSupply = await Promise.all(promises)
        .then(arrayGetSupplyResponse =>{
            var supplyList=[]
            arrayGetSupplyResponse.forEach(supplyArray => {
                supplyArray.forEach(supply =>{
                    supplyList.push(supply)                    
                })
            });
            
            console.log(`complete list of supply: ${supplyList}`);
            
            return supplyList
        })
        .catch(error => {
            console.log(error);
            throw (error)
        })

    return shipnodeCompleteSupply
}

async function getSupplyForShipnodeItem(supplier, shipnodeId, productItemId) {

    ivCred = await IVCredentialModule.getIVCredential(supplier.tenant_id)

    token = await IVCredentialModule.getIVToken(ivCred.buyer_scbn_id, "supplies", supplier.supplier_mailslot_id, false)

    bearerToken = token['bearer_token']
    url = token['url'] 

    console.log(`use url ${url} with token of ${bearerToken}`);

    const getSupplyHttpOption = HttpUtil.getIVHttpOptions(url, bearerToken, "GET", 
        {
            shipNode: shipnodeId,
            itemId: productItemId,
            unitOfMeasure: "UNIT",
            productClass: "NEW"
        }, 
        null)
    
    return RequestPromise(getSupplyHttpOption).then(function (repos) {
        // console.log('result from IV: ', repos);
        return repos
    })
    .catch(function (err) {
        throw err
    });
    
    // ?itemId=CVS::58887719997169&unitOfMeasure=UNIT&productClass=NEW&shipNode=CVS::CA%20-%20PATTERSON

    
}

module.exports = router;