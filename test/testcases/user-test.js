const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiThings = require('chai-things');
const server = require('../../src/app');
chai.should();
chai.use(chaiHttp);
chai.use(chaiThings);
const expect = chai.expect;

describe('User API', () => {

    /**
     * Test the POST route
     */
    describe('POST /s4s/{tenantId}/users', () => {

        it('should NOT POST the supplier without username', (done) => {
            chai.request(server)
                .post('/s4s/t10001/users')
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('errors');
                    response.body.errors.should.have.property('username');
                    response.body.errors.username.should.have.property('kind').eql('required');
                done();
            });
        });

        it('should POST the user', (done) => {
            var user = {
                "username": "marriottfrisco",
                "buyers": ["buyer1", "buyer2"],
                "sellers": ["seller1", "seller2"]
            };
            chai.request(server)
                .post('/s4s/t10001/users')
                .send(user)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                done();
            });
        });

        it('should POST another user', (done) => {
            var user = {
                "username": "marriottdallas",
                "buyers": ["buyer1", "buyer2"],
                "sellers": ["seller1", "seller2"]
            };;
            chai.request(server)
                .post('/s4s/t10001/users')
                .send(user)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                done();
            });
        });

        it('should NOT POST duplicate user', (done) => {
            var user = {
                "username": "marriottfrisco",
                "buyers": ["buyer1", "buyer2"],
                "sellers": ["seller1", "seller2"]
            };
            chai.request(server)
                .post('/s4s/t10001/users')
                .send(user)
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
    describe('GET /s4s/{tenantId}/users', () => {
        // it('should GET all the users', (done) => {
        //     chai.request(server)
        //         .get('/s4s/t10001/users')
        //         .end((err, response) => {
        //             response.should.have.status(200);
        //             response.body.should.be.a('array');
        //             expect(response.body).to.have.lengthOf(2);
        //         done();
        //     });
        // });

        it('should GET product with specific supplier_id', (done) => {
            chai.request(server)
                .get('/s4s/t10001/users/marriottdallas')
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('username', 'marriottdallas');
                done();
            });
        });

    });

    /**
     * Test the PATCH route
     */
    describe('PATCH /s4s/{tenantId}/users/:id', () => {
        it('should PATCH the user', (done) => {

            var user = {
                "username": "marriottirving",
                "buyers": ["buyer1", "buyer2"],
                "sellers": ["seller1", "seller2"]
            };
            var patchedUser = {
                "username": "marriottirving",
                "buyers": ["buyer1", "buyer2", "buyer3"],
                "sellers": ["seller1", "seller3"]
            };
            chai.request(server)
                .post('/s4s/t10001/users')
                .send(user)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');

                    chai.request(server)
                    .get('/s4s/t10001/users/marriottirving')
                    .end((err, response) => {
                        response.should.have.status(200);
                        response.body.should.be.a('object');
                        expect(response.body.buyers).to.have.lengthOf(2);

                        chai.request(server)
                            .patch('/s4s/t10001/users/marriottirving')
                            .send(patchedUser)
                            .end((err, response) => {
                                response.should.have.status(200);
                                response.body.should.be.a('object');

                                chai.request(server)
                                    .get('/s4s/t10001/users/marriottirving')
                                    .end((err, response) => {
                                        response.should.have.status(200);
                                        expect(response.body.buyers).to.have.lengthOf(3);
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
    describe('DELETE /s4s/{tenantId}/users/:id', () => {
        it('should DELETE the user', (done) => {

            var user = {
                "username": "marriottplano",
                "buyers": ["buyer1", "buyer2"],
                "sellers": ["seller1", "seller2"]
            };
            chai.request(server)
                .post('/s4s/t10001/users')
                .send(user)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');

                    chai.request(server)
                    .get('/s4s/t10001/users/marriottplano')
                    .end((err, response) => {
                        response.should.have.status(200);
                        response.body.should.be.a('object');

                        chai.request(server)
                            .delete('/s4s/t10001/users/marriottplano')
                            .end((err, response) => {
                                response.should.have.status(200);
                                response.body.should.be.a('object');

                                chai.request(server)
                                    .get('/s4s/t10001/users/marriottplano')
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
