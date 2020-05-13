// const dbUtil = require('../util/db-util');
const User = require('../model/user');
const Buyer = require('../model/buyer');
const ProductModule = require('./product-module')
const { ResourceNotFoundError, InternalError } = require('../util/errors');


module.exports = {

    // Get an user by user id
    getUserByUserId: async (tenantId, userId) => {

        return await getUserDetail(tenantId, userId)

    },
        
    getUserConnectedProductList: async (tenantId, userId) => {
        
        user = await getUserDetail(tenantId, userId)

        if (user && user.connected_suppliers && user.connected_suppliers.length) {
            
            const connected_supplier_products = await ProductModule.getListOfSupplierProduct(tenantId, user.connected_suppliers)
            
            // console.log(`user ${userId} can see the products:  ${JSON.stringify(connected_supplier_products)}`);

            return connected_supplier_products

            // console.log(`get user with connected supplier products: ${JSON.stringify(user)}`);
            
        } else {
            return undefined
        }
    },

    getUserSupplierProductList: async (tenantId, userId) => {
        
        user = await getUserDetail(tenantId, userId)

        if (user && user.suppliers && user.suppliers.length) {
            
            const ownProductList = await ProductModule.getListOfSupplierProduct(tenantId, user.suppliers)
            
            console.log(`[getUserSupplierProductList] user ${userId} can see the products:  ${JSON.stringify(ownProductList)}`);

            return ownProductList

            // console.log(`get user with connected supplier products: ${JSON.stringify(user)}`);
            
        } else {
            return undefined
        }
    }
}


async function getUserDetail (tenantId, userId) {

    var userFromDB = await User.findOne({ username: userId, tenant_id: tenantId });
    if (userFromDB == null) {
        throw new ResourceNotFoundError(`tenant: ${tenantId} user: ${userId}`,
            'Cannot find the specificed user in tenant.')
    }
    var user = JSON.parse(JSON.stringify(userFromDB));
    // var supplierList = new Set();
    var i = 0;
    if (user.buyers.length > 0) {

        // console.log('** loading suppliers connected to user through its buyers **');

        user.connected_suppliers = [];

        buyerObjectList = await Buyer.find({ tenant_id: tenantId, buyer_id: {$in: user.buyers } })

        buyerObjectList.forEach(buyerObj => {
            if (buyerObj && buyerObj.suppliers && buyerObj.suppliers.length) {
                buyerObj.suppliers.forEach(supplier => {
                    // console.log(`pushing ${supplier} into ${userId} connected_suppliers list`);
                    user.connected_suppliers.push(supplier)
                })
            }
        })
    }
    // console.log(`** returning user object for ${userId} now. \n ${JSON.stringify(user)} **`);
    
    return user
}