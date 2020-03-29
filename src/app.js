const express = require('express');
const cors = require('cors');
require('./db/mongoose');
require('./model/product');
const productRouter = require('./router/product');
require('dotenv').config();

const app = express();
const port = process.env.APP_PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(productRouter);

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});
