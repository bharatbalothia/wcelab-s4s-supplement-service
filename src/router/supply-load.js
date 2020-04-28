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

        //Validate Supplier
        var supplier = await dbUtil.getSupplier(tenantId, supplierId);
        if(supplier == null){
            throw new ResourceNotFoundError(`tenant: ${tenantId} supplier: ${supplierId}`,
                    'Cannot find the specificed supplier for the tenant.')
        }

        //Supplier categories: type 1, 2 and 3
        // there will be 3 categories of suppliers:
        // No reset (upload into IV as is)
        // Reset only onhand (supplier is not providing future inventory and doesn't need the extra call to IV to get future supply for reset. Just reset any missing items from the supplier's item list)
        // Reset both onhand and future (supplier is providing future inventory and needs Rapid to reset both ONHAND and WIP supplies. Needs get supply call to IV)

        var supplierInventoryFeedType = supplier.inventory_feed_type;
        if(supplierInventoryFeedType == 'NO_RESET'){
            //Make the syncSupplies call to IV and invoke it
            console.log('NO_RESET');
            var output = await HttpUtil.getIVApiPromise(supplier, "supplies", "PUT", null, req.body);
            return res.send(output);
        }

        //Break the inputs into different ship nodes
        var shipNodeSet = [];
        var groupedInput = {};
        //Build the inventory feed request into different groups (one group for each ship node)
        for(let supply of req.body.supplies){
            // console.log(supply.shipNode);
            if(shipNodeSet.includes(supply.shipNode)){
                // console.log('shipNodeSet includes ' + supply.shipNode);
            }else{
                // console.log('Adding to shipNodeSet: ' + supply.shipNode);
                shipNodeSet.push(supply.shipNode);
                groupedInput[supply.shipNode] = [];
            }
            groupedInput[supply.shipNode].push(supply);
        }
        // console.log('shipNodeSet: ' + shipNodeSet);
        // console.log('groupedInput: ' + JSON.stringify(groupedInput));

        
        //Get the list of all products for the supplier
        var productList = await dbUtil.getProductsForSupplier(tenantId, supplierId);
        if(productList == null){
            throw new ResourceNotFoundError(`tenant: ${tenantId} supplier: ${supplierId}`,
                    'Cannot find the specificed supplier for the tenant.');
        }
        // console.log(productList);

        if(supplierInventoryFeedType == 'RESET_ONHAND'){
            // console.log('groupedInput: ' + JSON.stringify(groupedInput));
            for(let shipNode of shipNodeSet){
                // console.log('shipNode: ' + shipNode);
                var shipNodeInventoryData = groupedInput[shipNode];
                // console.log('shipNodeInventoryData: ' + JSON.stringify(shipNodeInventoryData));
                var productListClone = JSON.parse(JSON.stringify(productList));
                // console.log('productListClone: ' + JSON.stringify(productListClone));
                for(let inventoryData of shipNodeInventoryData){
                    // console.log('searching for ' + inventoryData.itemId);
                    var foundItem = productListClone.filter(productItem => productItem.item_id !== inventoryData.itemId);
                }
                if(foundItem){
                    // console.log('item found to add: ' + JSON.stringify(foundItem));
                    var tranformedItem = foundItem.map(productItem => productItem.item_id );
                    // console.log('tranformedItem: ' + JSON.stringify(tranformedItem));

                    //Build a zero inventory update document for each such shipnode
                    for(let item of tranformedItem){
                        // console.log(item);
                        groupedInput[shipNode].push({ "eta": "1900-01-01T00:00:00", "itemId": item, "lineReference": " ", 
                        "productClass": "NEW",  "quantity": "0", "reference": " ", "referenceType": " ", "segment": "", "segmentType": "", 
                        "shipByDate": "2500-01-01T00:00:00Z", "shipNode": shipNode, "sourceTs": "", "tagNumber": " ", 
                        "type": "ONHAND", "unitOfMeasure": "UNIT" });
                    }
                }else{
                    // console.log('item not found: ' + foundItem);
                }
            }

        }

        var outputJson = {};
        var consolidatedInventoryFeedArray = [];
        for(let value of Object.values(groupedInput)){
            // console.log('value: ' + JSON.stringify(value));
            consolidatedInventoryFeedArray = consolidatedInventoryFeedArray.concat(value);
        }
        var ivInput = {"supplies": consolidatedInventoryFeedArray};
        // console.log('consolidatedInventoryFeedArray: ' + JSON.stringify(consolidatedInventoryFeedArray));
        var ivOutput = await HttpUtil.getIVApiPromise(supplier, "supplies", "PUT", null, ivInput);
        res.send(ivOutput);
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
