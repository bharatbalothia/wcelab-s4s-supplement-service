const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiThings = require('chai-things');
const server = require('../../src/app');
chai.should();
chai.use(chaiHttp);
chai.use(chaiThings);
const expect = chai.expect;

describe('Supplier API', () => {

    /**
     * Test the POST route
     */
    describe('POST /s4s/{tenantId}/suppliers', () => {

        it('should NOT POST the supplier without supplier_id', (done) => {
            chai.request(server)
                .post('/s4s/t10001/suppliers')
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('errors');
                    response.body.errors.should.have.property('supplier_id');
                    response.body.errors.supplier_id.should.have.property('kind').eql('required');
                done();
            });
        });

        it('should POST the supplier', (done) => {
            var supplier = {
                "supplier_id":"HONEYWeLL",
                "description":"Honeywell USA Inc.",
                "supplier_type":"Supplier",
                "address_attributes":[
                    {
                        "name": "address_line_1",
                        "value": "3813 Lombard St"
                    },
                    {
                        "name": "city",
                        "value": "Los Angeles"
                    },
                    {
                        "name": "state",
                        "value": "CA"
                    },
                    {
                        "name": "zipcode",
                        "value": "90014"
                    },
                    {
                        "name": "country",
                        "value": "US"
                    }
                ]
            };
            chai.request(server)
                .post('/s4s/t10001/suppliers')
                .send(supplier)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                done();
            });
        });

        it('should POST another supplier', (done) => {
            var supplier = {
                "supplier_id":"3m",
                "description":"3M USA Inc.",
                "supplier_type":"Supplier",
                "address_attributes":[
                    {
                        "name": "address_line_1",
                        "value": "3471 Paris Av"
                    },
                    {
                        "name": "city",
                        "value": "Dallas"
                    },
                    {
                        "name": "state",
                        "value": "TX"
                    },
                    {
                        "name": "zipcode",
                        "value": "75215"
                    },
                    {
                        "name": "country",
                        "value": "US"
                    }
                ]
            };
            chai.request(server)
                .post('/s4s/t10001/suppliers')
                .send(supplier)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                done();
            });
        });

        it('should NOT POST duplicate supplier', (done) => {
            var supplier = {
                "supplier_id":"3M",
                "description":"3M USA Inc.",
                "supplier_type":"Supplier",
                "address_attributes":[
                    {
                        "name": "address_line_1",
                        "value": "3471 Paris Av"
                    },
                    {
                        "name": "city",
                        "value": "Dallas"
                    },
                    {
                        "name": "state",
                        "value": "TX"
                    },
                    {
                        "name": "zipcode",
                        "value": "75215"
                    },
                    {
                        "name": "country",
                        "value": "US"
                    }
                ]
            };
            chai.request(server)
                .post('/s4s/t10001/suppliers')
                .send(supplier)
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
    describe('GET /s4s/{tenantId}/suppliers', () => {
        it('should GET all the suppliers', (done) => {
            chai.request(server)
                .get('/s4s/t10001/suppliers')
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    expect(response.body).to.have.lengthOf(2);
                done();
            });
        });

        it('should GET product with specific supplier_id', (done) => {
            chai.request(server)
                .get('/s4s/t10001/suppliers/3m')
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('supplier_id', '3M');
                done();
            });
        });

    });

    /**
     * Test the PUT route
     */
    describe('PUT /s4s/{tenantId}/suppliers/:id', () => {
        it('should PUT the supplier', (done) => {

            var supplier = {
                "supplier_id":"3m_3",
                "description":"3M_3 USA Inc.",
                "supplier_type":"Supplier",
                "address_attributes":[
                    {
                        "name": "address_line_1",
                        "value": "3471 Paris Av"
                    },
                    {
                        "name": "city",
                        "value": "Dallas"
                    },
                    {
                        "name": "state",
                        "value": "TX"
                    },
                    {
                        "name": "zipcode",
                        "value": "75215"
                    },
                    {
                        "name": "country",
                        "value": "US"
                    }
                ]
            };
            var modifiedSupplier = {
                "supplier_id":"3M_3",
                "description":"3M_3 USA LLC",
                "supplier_type":"Supplier",
                "address_attributes":[
                    {
                        "name": "address_line_1",
                        "value": "3471 Paris Av"
                    },
                    {
                        "name": "city",
                        "value": "Dallas"
                    },
                    {
                        "name": "state",
                        "value": "TX"
                    },
                    {
                        "name": "zipcode",
                        "value": "75215"
                    },
                    {
                        "name": "country",
                        "value": "US"
                    }
                ]
            };
            chai.request(server)
                .post('/s4s/t10001/suppliers')
                .send(supplier)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');

                    chai.request(server)
                    .get('/s4s/t10001/suppliers/3M_3')
                    .end((err, response) => {
                        response.should.have.status(200);
                        response.body.should.be.a('object');
                        response.body.should.have.property('description', '3M_3 USA Inc.');

                        chai.request(server)
                            .put('/s4s/t10001/suppliers/3M_3')
                            .send(modifiedSupplier)
                            .end((err, response) => {
                                response.should.have.status(200);
                                response.body.should.be.a('object');

                                chai.request(server)
                                    .get('/s4s/t10001/suppliers/3M_3')
                                    .end((err, response) => {
                                        response.should.have.status(200);
                                        response.body.should.have.property('description', '3M_3 USA LLC');
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
    describe('DELETE /s4s/{tenantId}/suppliers/:id', () => {
        it('should DELETE the supplier', (done) => {

            var supplier = {
                "supplier_id":"3M_2",
                "description":"3M_2 USA Inc.",
                "supplier_type":"Supplier",
                "address_attributes":[
                    {
                        "name": "address_line_1",
                        "value": "3471 Paris Av"
                    },
                    {
                        "name": "city",
                        "value": "Dallas"
                    },
                    {
                        "name": "state",
                        "value": "TX"
                    },
                    {
                        "name": "zipcode",
                        "value": "75215"
                    },
                    {
                        "name": "country",
                        "value": "US"
                    }
                ]
            };
            chai.request(server)
                .post('/s4s/t10001/suppliers')
                .send(supplier)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');

                    chai.request(server)
                    .get('/s4s/t10001/suppliers/3m_2')
                    .end((err, response) => {
                        response.should.have.status(200);
                        response.body.should.be.a('object');

                        chai.request(server)
                            .delete('/s4s/t10001/suppliers/3m_2')
                            .end((err, response) => {
                                response.should.have.status(200);
                                response.body.should.be.a('object');

                                chai.request(server)
                                    .get('/s4s/t10001/suppliers/3M_2')
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

