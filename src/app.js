const express = require('express');
const cors = require('cors');
require('./db/mongoose');
require('./model/product');
const productRouter = require('./router/product');
require('dotenv').config();

const app = express();
const port = process.env.VCAP_APP_PORT || 3000;
const host = process.env.VCAP_APP_HOST || 'localhost';

app.use(express.json());
app.use(cors());
app.use(productRouter);

app.listen(port, host, () => {
    console.log('Server is up on ' + host + ':' + port);
});
