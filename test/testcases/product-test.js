const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiThings = require('chai-things');
const server = require('../../src/app');
chai.should();
chai.use(chaiHttp);
chai.use(chaiThings);
const expect = chai.expect;

describe('Product API', () => {

    /**
     * Test the POST route
     */
    describe('POST /s4s/{tenantId}/products', () => {
        it('should NOT POST the product without item_id', (done) => {
            chai.request(server)
                .post('/s4s/t10001/products')
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('errors');
                    response.body.errors.should.have.property('item_id');
                    response.body.errors.item_id.should.have.property('kind').eql('required');
                done();
            });
        });

        it('should POST the product', (done) => {
            var product = {
                "tags": [
                    "equipment"
                ],
                "item_id": "VENTILaTOR-3M-2000G",
                "description": "3M 2000G Ventilator",
                "unit_of_measure": "EACH",
                "supplier_id": "3M",
                "category": "EQUIPMENT"
            };
            chai.request(server)
                .post('/s4s/t10001/products')
                .send(product)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                done();
            });
        });

        it('should POST another product', (done) => {
            var product = {
                "tags": [
                    "ppe",
                    "mask",
                    "medical"
                ],
                "item_id": "N95-L-100-mASK",
                "description": "N95 Mask Size Large Pack of 100",
                "unit_of_measure": "EACH",
                "supplier_id": "CVS",
                "category": "PPE"
            };
            chai.request(server)
                .post('/s4s/t10001/products')
                .send(product)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                done();
            });
        });

        it('should NOT POST duplicate product', (done) => {
            var product = {
                "tags": [
                    "ppe",
                    "mask",
                    "medical"
                ],
                "item_id": "N95-L-100-MASK",
                "description": "N95 Mask Size Large Pack of 100",
                "unit_of_measure": "EACH",
                "supplier_id": "3M",
                "category": "PPE"
            };
            chai.request(server)
                .post('/s4s/t10001/products')
                .send(product)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                done();
            });
        });

    });

    /**
     * Test the GET route
     */
    describe('GET /s4s/{tenantId}/products', () => {
        it('should GET all the products', (done) => {
            chai.request(server)
                .get('/s4s/t10001/products')
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    expect(response.body).to.have.lengthOf(2);
                done();
            });
        });

        it('should GET product with specific item_id', (done) => {
            chai.request(server)
                .get('/s4s/t10001/products/VENTILATOR-3M-2000G')
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('item_id', 'VENTILATOR-3M-2000G');
                done();
            });
        });

        it('should GET product with specific category', (done) => {
            chai.request(server)
                .get('/s4s/t10001/productcategories/EQUIPMENT/products')
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    response.body.should.all.have.property('category', 'EQUIPMENT');
                done();
            });
        });

        it('should GET product with specific tags', (done) => {
            chai.request(server)
                .get('/s4s/t10001/products/tag/equipment')
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    for(i of response.body){
                        expect(i).to.contain.a.property('tags').that.contain('equipment');
                    }
                done();
            });
        });

    });

    /**
     * Test the POST route for multiple product search
     */
    describe('POST /s4s/{tenantId}/productslist', () => {
        it('should search all the products with item_id in the input', (done) => {
            chai.request(server)
                .post('/s4s/t10001/productslist')
                .send({ item_id: ["VENTILATOR-3M-2000G", "N95-L-100-MASK"] })
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    expect(response.body).to.have.lengthOf(2);
                done();
            });
        });
    });

        /**
     * Test the POST route for products entitled by the passed suppliers
     */
    describe('POST /s4s/{tenantId}/suppliers/products', () => {
        it('should search all the products with item_id in the input', (done) => {
            chai.request(server)
                .post('/s4s/t10001/suppliers/products')
                .send({ supplier_ids: ["3M", "CVS"] })
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    expect(response.body).to.have.lengthOf(2);
                done();
            });
        });
    });

    /**
     * Test the PUT route
     */
    describe('PUT /s4s/{tenantId}/products/:id', () => {
        it('should PUT the product', (done) => {

            var product = {
                "tags": [
                    "ppe",
                    "mask",
                    "medical"
                ],
                "item_id": "N95-L-2000-MASK",
                "description": "N95 Mask Size Large Pack of 2000",
                "unit_of_measure": "EACH",
                "category": "PPE"
            };
            var modifiedProduct = {
                "item_id": "N95-L-2000-MASK",
                "description": "N95 Mask Size Large Pack of 2000 Model 2"
            };
            chai.request(server)
                .post('/s4s/t10001/products')
                .send(product)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');

                    chai.request(server)
                    .get('/s4s/t10001/products/N95-L-2000-MASK')
                    .end((err, response) => {
                        response.should.have.status(200);
                        response.body.should.be.a('object');
                        response.body.should.have.property('description', 'N95 Mask Size Large Pack of 2000');

                        chai.request(server)
                            .put('/s4s/t10001/products/n95-L-2000-MASK')
                            .send(modifiedProduct)
                            .end((err, response) => {
                                response.should.have.status(200);
                                response.body.should.be.a('object');

                                chai.request(server)
                                    .get('/s4s/t10001/products/N95-L-2000-MASK')
                                    .end((err, response) => {
                                        response.should.have.status(200);
                                        response.body.should.be.a('object');
                                        response.body.should.have.property('description', 'N95 Mask Size Large Pack of 2000 Model 2');
                                    done();
                                });
                            });
                    });
                });
        });

    });

    /**
     * Test the DELETE route
     */
    describe('DELETE /s4s/{tenantId}/products/:id', () => {
        it('should DELETE the product', (done) => {

            var product = {
                "tags": [
                    "ppe",
                    "mask",
                    "medical"
                ],
                "item_id": "N95-L-3000-MASK",
                "description": "N95 Mask Size Large Pack of 3000",
                "unit_of_measure": "EACH",
                "category": "PPE"
            };
            chai.request(server)
                .post('/s4s/t10001/products')
                .send(product)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');

                    chai.request(server)
                    .get('/s4s/t10001/products/N95-L-3000-MASK')
                    .end((err, response) => {
                        response.should.have.status(200);
                        response.body.should.be.a('object');

                        chai.request(server)
                            .delete('/s4s/t10001/products/N95-L-3000-MASK')
                            .end((err, response) => {
                                response.should.have.status(200);
                                response.body.should.be.a('object');

                                chai.request(server)
                                    .get('/s4s/t10001/products/N95-L-3000-MASK')
                                    .end((err, response) => {
                                        response.should.have.status(404);
                                    done();
                                });
                            });
                    });
                });
        });

    });

});

