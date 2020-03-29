const express = require('express');
const cors = require('cors');
require('./db/mongoose');
require('./model/product');
const productRouter = require('./router/product');
const properties = require('./util/properties');

const app = express();
const port = process.env.PORT || properties.get('app.server.defaultport');

app.use(express.json());
app.use(cors());
app.use(productRouter);

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});
