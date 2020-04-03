const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./db/mongodb-connection-driver');
require('./model/product');
const productRouter = require('./router/product');
const productCategoryRouter = require('./router/product-category');
const supplierRouter = require('./router/supplier');
const ivCredentialRouter = require('./router/iv-credential');
const infoRouter = require('./router/info');

const app = express();
const port = process.env.VCAP_APP_PORT || 3000;
const host = process.env.VCAP_APP_HOST || 'localhost';

app.use(express.json());
app.use(cors());
app.use(productRouter);
app.use(productCategoryRouter);
app.use(supplierRouter);
app.use(ivCredentialRouter);
app.use(infoRouter);

app.listen(port, host, () => {
    console.log('Server is up on ' + host + ':' + port);
});
