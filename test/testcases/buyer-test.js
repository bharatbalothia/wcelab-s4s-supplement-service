const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiThings = require('chai-things');
const server = require('../../src/app');
chai.should();
chai.use(chaiHttp);
chai.use(chaiThings);
const expect = chai.expect;

describe('Buyer API', () => {

    /**
     * Test the POST route
     */
    describe('POST /s4s/{tenantId}/buyers', () => {

        it('should NOT POST the buyer without buyer_id', (done) => {
            chai.request(server)
                .post('/s4s/t10001/buyers')
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('errors');
                    response.body.errors.should.have.property('buyer_id');
                    response.body.errors.buyer_id.should.have.property('kind').eql('required');
                done();
            });
        });

        it('should POST the buyer', (done) => {
            var buyer = {
                "buyer_id" : "BAYLOR",
                "description" : "Baylor Hospital Group",
                "address_attributes" : [ 
                    {
                        "name" : "address_line_1",
                        "value" : "134 Salt Av"
                    }, 
                    {
                        "name" : "city",
                        "value" : "Irving"
                    }, 
                    {
                        "name" : "state",
                        "value" : "TX"
                    }, 
                    {
                        "name" : "zipcode",
                        "value" : "75039"
                    }, 
                    {
                        "name" : "contact_person",
                        "value" : "Steve Mark"
                    }, 
                    {
                        "name" : "phone_number",
                        "value" : "1-888-675-9099"
                    }, 
                    {
                        "name" : "country",
                        "value" : "US"
                    }
                ],
                "url" : "https://www.baylor.com/",
                "contact_email" : "help@baylor.com",
                "contact_person" : "Steve Mark",
                "buyer_twitter" : "@baylorus",
                "sellers": ["3M", "HONEYWELL", "CVS"]
            };
            chai.request(server)
                .post('/s4s/t10001/buyers')
                .send(buyer)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                done();
            });
        });

        it('should POST another buyer', (done) => {
            var buyer = {
                "buyer_id" : "BAYLOR2",
                "description" : "Baylor Hospital Group",
                "address_attributes" : [ 
                    {
                        "name" : "address_line_1",
                        "value" : "134 Salt Av"
                    }, 
                    {
                        "name" : "city",
                        "value" : "Irving"
                    }, 
                    {
                        "name" : "state",
                        "value" : "TX"
                    }, 
                    {
                        "name" : "zipcode",
                        "value" : "75039"
                    }, 
                    {
                        "name" : "contact_person",
                        "value" : "Steve Mark"
                    }, 
                    {
                        "name" : "phone_number",
                        "value" : "1-888-675-9099"
                    }, 
                    {
                        "name" : "country",
                        "value" : "US"
                    }
                ],
                "url" : "https://www.baylor.com/",
                "contact_email" : "help@baylor.com",
                "contact_person" : "Steve Mark",
                "buyer_twitter" : "@baylorus",
                "sellers": ["3M", "HONEYWELL", "CVS"]
            };
            chai.request(server)
                .post('/s4s/t10001/buyers')
                .send(buyer)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                done();
            });
        });

        it('should NOT POST duplicate buyer', (done) => {
            var buyer = {
                "buyer_id" : "BAYLOR2",
                "description" : "Baylor Hospital Group",
                "address_attributes" : [ 
                    {
                        "name" : "address_line_1",
                        "value" : "134 Salt Av"
                    }, 
                    {
                        "name" : "city",
                        "value" : "Irving"
                    }, 
                    {
                        "name" : "state",
                        "value" : "TX"
                    }, 
                    {
                        "name" : "zipcode",
                        "value" : "75039"
                    }, 
                    {
                        "name" : "contact_person",
                        "value" : "Steve Mark"
                    }, 
                    {
                        "name" : "phone_number",
                        "value" : "1-888-675-9099"
                    }, 
                    {
                        "name" : "country",
                        "value" : "US"
                    }
                ],
                "url" : "https://www.baylor.com/",
                "contact_email" : "help@baylor.com",
                "contact_person" : "Steve Mark",
                "buyer_twitter" : "@baylorus",
                "sellers": ["3M", "HONEYWELL", "CVS"]
            };
            chai.request(server)
                .post('/s4s/t10001/buyers')
                .send(buyer)
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
    describe('GET /s4s/{tenantId}/buyers', () => {
        it('should GET all the buyers', (done) => {
            chai.request(server)
                .get('/s4s/t10001/buyers')
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    expect(response.body).to.have.lengthOf(2);
                done();
            });
        });

        it('should GET product with specific buyer_id', (done) => {
            chai.request(server)
                .get('/s4s/t10001/buyers/BAYLOR')
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('buyer_id', 'BAYLOR');
                done();
            });
        });

    });

    /**
     * Test the PATCH route
     */
    describe('PATCH /s4s/{tenantId}/buyers/:id', () => {
        it('should PATCH the buyer', (done) => {

            var buyer = {
                "buyer_id" : "BAYLOR3",
                "description" : "Baylor Hospital Group",
                "address_attributes" : [ 
                    {
                        "name" : "address_line_1",
                        "value" : "134 Salt Av"
                    }, 
                    {
                        "name" : "city",
                        "value" : "Irving"
                    }, 
                    {
                        "name" : "state",
                        "value" : "TX"
                    }, 
                    {
                        "name" : "zipcode",
                        "value" : "75039"
                    }, 
                    {
                        "name" : "contact_person",
                        "value" : "Steve Mark"
                    }, 
                    {
                        "name" : "phone_number",
                        "value" : "1-888-675-9099"
                    }, 
                    {
                        "name" : "country",
                        "value" : "US"
                    }
                ],
                "url" : "https://www.baylor.com/",
                "contact_email" : "help@baylor.com",
                "contact_person" : "Steve Mark",
                "buyer_twitter" : "@baylorus",
                "sellers": ["3M", "HONEYWELL", "CVS"]
            };
            var patchedBuyer = {
                "buyer_id" : "BAYLOR3",
                "description" : "Baylor Hospital Group 3",
                "address_attributes" : [ 
                    {
                        "name" : "address_line_1",
                        "value" : "134 Salt Av"
                    }, 
                    {
                        "name" : "city",
                        "value" : "Irving"
                    }, 
                    {
                        "name" : "state",
                        "value" : "TX"
                    }, 
                    {
                        "name" : "zipcode",
                        "value" : "75039"
                    }, 
                    {
                        "name" : "contact_person",
                        "value" : "Steve Mark"
                    }, 
                    {
                        "name" : "phone_number",
                        "value" : "1-888-675-9099"
                    }, 
                    {
                        "name" : "country",
                        "value" : "US"
                    }
                ],
                "url" : "https://www.baylor.com/",
                "contact_email" : "help@baylor.com",
                "contact_person" : "Steve Mark",
                "buyer_twitter" : "@baylorus",
                "sellers": ["3M", "HONEYWELL", "CVS"]
            };
            chai.request(server)
                .post('/s4s/t10001/buyers')
                .send(buyer)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');

                    chai.request(server)
                    .get('/s4s/t10001/buyers/BAYLOR3')
                    .end((err, response) => {
                        response.should.have.status(200);
                        response.body.should.be.a('object');
                        response.body.should.have.property('description', 'Baylor Hospital Group');

                        chai.request(server)
                            .patch('/s4s/t10001/buyers/BAYLOR3')
                            .send(patchedBuyer)
                            .end((err, response) => {
                                response.should.have.status(200);
                                response.body.should.be.a('object');

                                chai.request(server)
                                    .get('/s4s/t10001/buyers/BAYLOR3')
                                    .end((err, response) => {
                                        response.should.have.status(200);
                                        response.body.should.have.property('description', 'Baylor Hospital Group 3');
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
    describe('DELETE /s4s/{tenantId}/buyers/:id', () => {
        it('should DELETE the buyer', (done) => {

            var buyer = {
                "buyer_id" : "BAYLOR4",
                "description" : "Baylor Hospital Group 3",
                "address_attributes" : [ 
                    {
                        "name" : "address_line_1",
                        "value" : "134 Salt Av"
                    }, 
                    {
                        "name" : "city",
                        "value" : "Irving"
                    }, 
                    {
                        "name" : "state",
                        "value" : "TX"
                    }, 
                    {
                        "name" : "zipcode",
                        "value" : "75039"
                    }, 
                    {
                        "name" : "contact_person",
                        "value" : "Steve Mark"
                    }, 
                    {
                        "name" : "phone_number",
                        "value" : "1-888-675-9099"
                    }, 
                    {
                        "name" : "country",
                        "value" : "US"
                    }
                ],
                "url" : "https://www.baylor.com/",
                "contact_email" : "help@baylor.com",
                "contact_person" : "Steve Mark",
                "buyer_twitter" : "@baylorus",
                "sellers": ["3M", "HONEYWELL", "CVS"]
            };
            chai.request(server)
                .post('/s4s/t10001/buyers')
                .send(buyer)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');

                    chai.request(server)
                    .get('/s4s/t10001/buyers/BAYLOR4')
                    .end((err, response) => {
                        response.should.have.status(200);
                        response.body.should.be.a('object');

                        chai.request(server)
                            .delete('/s4s/t10001/buyers/BAYLOR4')
                            .end((err, response) => {
                                response.should.have.status(200);
                                response.body.should.be.a('object');

                                chai.request(server)
                                    .get('/s4s/t10001/buyers/BAYLOR4')
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

