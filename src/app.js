const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./db/mongoose');
require('./model/product');
const productRouter = require('./router/product');
const supplierRouter = require('./router/supplier');
const infoRouter = require('./router/info');

const app = express();
const port = process.env.VCAP_APP_PORT || 3000;
const host = process.env.VCAP_APP_HOST || 'localhost';

app.use(express.json());
app.use(cors());
app.use(productRouter);
app.use(supplierRouter);
app.use(infoRouter);

app.listen(port, host, () => {
    console.log('Server is up on ' + host + ':' + port);
});
