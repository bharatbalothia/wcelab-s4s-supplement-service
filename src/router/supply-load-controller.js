const ShipNode = require('../model/shipnode');
const dbUtil = require('../util/db-util');
const ProductModule = require('./product-module');
const IVCredentialModule = require('./iv-credential-module')
const { ResourceNotFoundError, InternalError } = require('../util/errors');
const HttpUtil = require('../util/http-util')
const RequestPromise = require('request-promise');


module.exports = {

    getShipNodesForSupplier: async (tenantIdInput, supplierIdInput) => {

        const tenantId = tenantIdInput.toLowerCase();
        const supplierId = supplierIdInput.toUpperCase();

        var supplier = await dbUtil.getSupplier(tenantId, supplierId);

        if (supplier) {

            shipnode = await ShipNode.findOne(
                {
                    tenant_id: tenantId,
                    supplier_id: supplierId,
                    shipnode_id: shipnodeId,
                }
            );

            if (shipnode) {
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
        } else {
            throw new ResourceNotFoundError(`tenant: ${tenantId} supplier: ${supplierId}`,
                'Cannot find the specificed supplier in the tenant.')
        }
    },
}

async function getSupplyForShipnodeItemList(supplier, shipnodeId, itemList) {

    var promises = []

    itemList.forEach(element => {

        // console.log("Need to get supply for ", shipnodeId, element.item_id)

        promises.push(getSupplyForShipnodeItem(supplier, shipnodeId, element.item_id))

    });

    shipnodeCompleteSupply = await Promise.all(promises)
        .then(arrayGetSupplyResponse => {
            var supplyList = []
            arrayGetSupplyResponse.forEach(supplyArray => {
                supplyArray.forEach(supply => {
                    supplyList.push(supply)
                })
            });

            // console.log(`complete list of supply: ${supplyList}`);

            return supplyList
        })
        .catch(error => {
            console.log(`logging error from shipnodeCompleteSupply promise.al ${error}`);
            throw (error)
        })

    return shipnodeCompleteSupply
}

async function getSupplyForShipnodeItem(supplier, shipnodeId, productItemId) {

    const ivOperation = "supplies"

    const getSupplyForShipnodeItemPromise = await HttpUtil.getIVApiPromise(
        supplier, ivOperation, 
        "GET", 
        {
            shipNode: shipnodeId,
            itemId: productItemId,
            unitOfMeasure: "UNIT",
            productClass: "NEW"
        }, 
        null)
    
    // getSupplyForShipnodeItemPromise is an IV request promise. You can use it like
    // supplyList = await getSupplyForShipnodeItemPromise()
    // or 
    // getSupplyForShipnodeItemPromise.then( // do something )

    return getSupplyForShipnodeItemPromise
}

// async function getSupplyForShipnodeItem(supplier, shipnodeId, productItemId) {

//     ivCred = await IVCredentialModule.getIVCredential(supplier.tenant_id)

//     token = await IVCredentialModule.getIVToken(ivCred.buyer_scbn_id, "supplies", supplier.supplier_mailslot_id, false)

//     bearerToken = token['bearer_token']
//     url = token['url']

//     // console.log(`use url ${url} with token of ${bearerToken}`);

//     const getSupplyHttpOption = HttpUtil.getIVHttpOptions(url, bearerToken, "GET",
//         {
//             shipNode: shipnodeId,
//             itemId: productItemId,
//             unitOfMeasure: "UNIT",
//             productClass: "NEW"
//         },
//         null)

//     return RequestPromise(getSupplyHttpOption).then(function (repos) {
//         // console.log('result from IV: ', repos);
//         return repos
//     })
//         .catch(function (err) {
//             throw err
//         });
// }