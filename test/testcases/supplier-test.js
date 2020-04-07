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
                "supplier_id":"HONEYWELL",
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
                .get('/s4s/t10001/suppliers/3M')
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('supplier_id', '3M');
                done();
            });
        });

    });

});

