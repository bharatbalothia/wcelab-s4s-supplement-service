const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./db/mongodb-connection-driver');
require('./model/product');
const productRouter = require('./router/product');
const productCategoryRouter = require('./router/product-category');
const supplierRouter = require('./router/supplier');
const buyerRouter = require('./router/buyer');
const shipNodeRouter = require('./router/shipnode');
const ivCredentialRouter = require('./router/iv-credential');
const tenantRouter = require('./router/tenant');
const userRouter = require('./router/user');
const infoRouter = require('./router/info');
const shipNodeSupplyRouter = require('./router/shipnode-supply');
const supplyLoadRouter = require('./router/supply-load');

const app = express();
const port = process.env.VCAP_APP_PORT || 3000;
const host = process.env.VCAP_APP_HOST || 'localhost';

app.use(express.json());
app.use(cors());
app.use(productRouter);
app.use(productCategoryRouter);
app.use(supplierRouter);
app.use(buyerRouter);
app.use(shipNodeRouter);
app.use(tenantRouter);
app.use(userRouter);
app.use(ivCredentialRouter);
app.use(infoRouter);
app.use(shipNodeSupplyRouter);
app.use(supplyLoadRouter);

var server = app.listen(port, host, () => {
    console.log('Server is up on ' + host + ':' + port);
});

module.exports = server;