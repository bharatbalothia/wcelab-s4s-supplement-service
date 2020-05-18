const dbUtil = require('../util/db-util');
const ProductModule = require('./product-module');
const { ResourceNotFoundError, InternalError } = require('../util/errors');
const HttpUtil = require('../util/http-util')
const ShipnodeSupplyController = require('./shipnode-supply-controller')


module.exports = {

    loadSupplierSupply: async (tenantId, supplierId, supply) => {

        return await loadSupply(tenantId, supplierId, supply)

    }
}


async function loadSupply(tenantId, supplierId, supply) {

    //Validate Supplier
    var supplier = await dbUtil.getSupplier(tenantId, supplierId);

    if (supplier == null) {
        throw new ResourceNotFoundError(`tenant: ${tenantId} supplier: ${supplierId}`,
            'Cannot find the specificed supplier for the tenant.')
    }
    else {

        listOfUnknownProducts = await checkProductExist(supplier, supply)

        if (listOfUnknownProducts && listOfUnknownProducts.length) {
            throw new ResourceNotFoundError('supplier product', 
            `Supplier ${supplier.supplier_id} does not have product: ${listOfUnknownProducts.join(', ')}`)
        }

        // ********************************************************
        // Supplier categories: type 1, 2 and 3
        // there will be 3 categories of suppliers:
        // NO_RESET or any value than 2 below: No reset (upload into IV as is)
        // RESET_ONHAND: Reset only onhand (supplier is not providing future inventory and doesn't need the extra call to IV to get future supply for reset. Just reset any missing items from the supplier's item list)
        // RESET_ONHAND_FUTURE: Reset both onhand and future (supplier is providing future inventory and needs Rapid to reset both ONHAND and WIP supplies. Needs get supply call to IV)
        // ********************************************************

        supplierInventoryFeedType = (supplier && supplier.inventory_feed_type) ?
            supplier.inventory_feed_type.toUpperCase() : null

        if (supplierInventoryFeedType == 'RESET_ONHAND' || supplierInventoryFeedType == 'RESET_ONHAND_FUTURE') {

            // Get the list of supplis lines to reset
            return await loadAndResetSupply(supplier, supplierInventoryFeedType, supply)

        }
        else { // If it is not RESET_ONHAND or RESET_ONHAND_FUTURE, we just send the supply update message to IV
            //Make the syncSupplies call to IV and invoke it
            console.log('NO_RESET');
            return await HttpUtil.getIVApiPromise(supplier, "supplies", "PUT", null, supply);
            
        }
    }
}

async function checkProductExist(supplier, supply){

    const products = await ProductModule.getSupplierProduct(supplier.tenant_id, {}, supplier.supplier_id);

    supplierProductList = []

    if (products && products.length) {
        
        

        products.forEach(prd=>{
            supplierProductList.push(prd.item_id)
        })
    }

    all_product_exist = true
    unknown_product_list = []

    if (supply && supply.supplies && supply.supplies.length) {
        supply.supplies.forEach(supplyline => {
            if (supplierProductList.indexOf(supplyline.itemId) < 0){
                all_product_exist = false
                unknown_product_list.push(`${supplyline.itemId.split('::')[1]}`)
            }
        })
    }

    return unknown_product_list

    // if (! all_product_exist){
    //     throw new ResourceNotFoundError('supply product', `Supplier ${supplier.supplier_id} does not have item ${invalid_item_list.join(', ')}`)
    // }
    // } else {
    //     throw new ResourceNotFoundError("product list", `Supplier ${supplier.supplier_id} does not have any product in its product list.`)
    // }
}

// Load supplyupdates and reset the supplies not on supplyUpdates
async function loadAndResetSupply(supplier, resetType, supplyUpdates) {

    
    var shipnodeSupplyUpdates = {};
    
    //Break supplyUpdates into ship nodes
    if (Array.isArray(supplyUpdates.supplies) && supplyUpdates.supplies.length) {

        //Build the inventory feed request into different groups (one group for each ship node)
        supplyUpdates.supplies.forEach(supplyElement => {

            if (!(supplyElement.shipNode in shipnodeSupplyUpdates)) {
                shipnodeSupplyUpdates[supplyElement.shipNode] = []
            }

            shipnodeSupplyUpdates[supplyElement.shipNode].push(supplyElement)

        })
        // console.log('shipNodeSet: ' + shipNodeSet);
        // console.log('shipnodeSupplyUpdates: ' + JSON.stringify(shipnodeSupplyUpdates));

        // get the supplier's product list
        productList = await ProductModule.getSupplierProduct(supplier.tenant_id, {}, supplier.supplier_id)

        ivUpdatePromises = []

        for (shipnodeId in shipnodeSupplyUpdates) {  // Loop through each shipnode to update its supply

            // console.log(`trying to create ${resetType} reset message for ${shipnodeId} `);

            // Create the supply reset message
            shipnodeSupplyReset = await createShipnodeSupplyReset(supplier, productList, shipnodeId, resetType)

            // Merge the incoming supply updates into the reset messages
            supplyLinesToSendToIV = mergeSupplyUpdatesIntoReset(shipnodeSupplyUpdates[shipnodeId], shipnodeSupplyReset)

            console.log(`xxxxxxxxx supplyUpdate xxxxxxxxxx ${JSON.stringify(supplyLinesToSendToIV)}`);

            // create promise to call IV sync supplies
            ivUpdatePromise = HttpUtil.getIVApiPromise(
                supplier, 
                "supplies", 
                "PUT", 
                null, 
                {
                    supplies: supplyLinesToSendToIV
                });
            
            ivUpdatePromises.push(ivUpdatePromise)
        }

        // wait for all IV supply updates to finish then return result
        Promise.all(ivUpdatePromises)
        .then(arrayOfResponses =>{
            return arrayOfResponses;
        })
        .catch(error => {
            throw(error)
        })

    } else {
        throw new InternalError(new Error("supply-load: input doesn't have supplies list or supplies list is empty."))
    }
}


// Create a complete reset for a shipnode's existing supply
async function createShipnodeSupplyReset(supplier, productList, shipnode, resetType) {

    
    if (resetType == 'RESET_ONHAND') {
        // console.log('shipnodeSupplyUpdates: ' + JSON.stringify(shipnodeSupplyUpdates));

        shipnodeReset = []

        productList.forEach(product => {

            supplyResetLine =
            {
                eta: "1900-01-01T00:00:00",
                itemId: product.item_id,
                productClass: "NEW",
                quantity: 0,
                shipNode: shipnode,
                type: "ONHAND",
                unitOfMeasure: "UNIT"
            }

            shipnodeReset.push(supplyResetLine)

            supplyResetLine =
            {
                eta: "1900-01-01T00:00:00",
                itemId: product.item_id,
                productClass: "USED",
                quantity: 0,
                shipNode: shipnode,
                type: "ONHAND",
                unitOfMeasure: "UNIT"
            }

            shipnodeReset.push(supplyResetLine)

        })

        shipnodeSupplyReset = shipnodeReset

    } else if (resetType == 'RESET_ONHAND_FUTURE') {

        existingSupply = await ShipnodeSupplyController.getSuppliesForShipnode(
            supplier.tenant_id,
            supplier.supplier_id,
            shipnode,
            productList
        )
        
        if (Array.isArray(existingSupply) && existingSupply.length) {
            
            // Filter out the get supply result with 0 quantity. We don't need to reset them
            nonzeroexistingsupply = existingSupply.filter( supplyLine => Number(supplyLine.quantity) > 0)

            nonzeroexistingsupply.forEach(supplyLine => supplyLine.quantity = 0)
            
            shipnodeSupplyReset = nonzeroexistingsupply
        } else 
        {
            shipnodeSupplyReset = undefined
        }
    }

    return shipnodeSupplyReset
}


function mergeSupplyUpdatesIntoReset(supplyToUpdate, supplyResets) {

    console.log(`>>>>>>>> incoming supply is: ${JSON.stringify(supplyToUpdate)}`);
    console.log(`######## supply to reset is: ${JSON.stringify(supplyResets)}`);

    
    if (!(Array.isArray(supplyToUpdate) && supplyToUpdate.length)) {
        // If supply is blank, throw an exception
        throw new InternalError(new Error("mergeSupplyUpdatesIntoReset shouldn't get a empty supply lines. The logic is wrong."))
    } else if (!(Array.isArray(supplyResets) && supplyResets.length)) {
        // if there is no supply to reset, just return the update message itself
        mergeresult =  supplyToUpdate
    } else {
        // We have both supply to update to and existing supplies in IV. We need to merge
        
        supplyToUpdate.forEach(supplyLine => {
            
            lineToMergeInto = supplyResets.find( resetLineToBeUpdated =>
                resetLineToBeUpdated.itemId == supplyLine.itemId &&
                resetLineToBeUpdated.productClass == supplyLine.productClass &&
                resetLineToBeUpdated.unitOfMeasure == supplyLine.unitOfMeasure &&
                resetLineToBeUpdated.type == supplyLine.type &&
                (
                    resetLineToBeUpdated.type == "ONHAND" ||
                    // TODO: we might need to loose match on eta
                    resetLineToBeUpdated.eta == supplyLine.eta
                )
            )

            if (lineToMergeInto) {
                // It is an update to existing supply line in IV
                lineToMergeInto.quantity = supplyLine.quantity
                lineToMergeInto.shipByDate = supplyLine.shipByDate
            } else {
                // It is a new supply line going to IV
                supplyResets.push(supplyLine)
            }
        })
        mergeresult = supplyResets
    }

    return mergeresult
}