const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiThings = require('chai-things');
const server = require('../../src/app');
chai.should();
chai.use(chaiHttp);
chai.use(chaiThings);
const expect = chai.expect;

describe('Product Category API', () => {

    /**
     * Test the POST route
     */
    describe('POST /s4s/{tenantId}/productcategories', () => {
        it('should NOT POST the product category without category_id', (done) => {
            chai.request(server)
                .post('/s4s/t10001/productcategories')
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('errors');
                    response.body.errors.should.have.property('category_id');
                    response.body.errors.category_id.should.have.property('kind').eql('required');
                done();
            });
        });

        it('should POST the product category', (done) => {
            var product = {
                "category_id": "PPE",
                "category_description": "Person Protection Equipment"
            };
            chai.request(server)
                .post('/s4s/t10001/productcategories')
                .send(product)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                done();
            });
        });

        it('should POST another product category', (done) => {
            var product = {
                "category_id": "equipment",
                "category_description": "Medical Equipments"
            };
            chai.request(server)
                .post('/s4s/t10001/productcategories')
                .send(product)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                done();
            });
        });

        it('should NOT POST duplicate product category', (done) => {
            var product = {
                "category_id": "EQUIPMENT",
                "category_description": "Medical Equipments"
            };
            chai.request(server)
                .post('/s4s/t10001/productcategories')
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
    describe('GET /s4s/{tenantId}/productcategories', () => {
        it('should GET all the product categories', (done) => {
            chai.request(server)
                .get('/s4s/t10001/productcategories')
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    expect(response.body).to.have.lengthOf(2);
                done();
            });
        });

    });

    /**
     * Test the PUT Route
     */
    describe('PUT /s4s/{tenantId}/productcategories/:categoryId', () => {
        it('should PUT the product category', (done) => {
            var product_3 = {
                "category_id": "AVG",
                "category_description": "Person Protection Equipment AVG"
            };

            var modifiedProduct_3 = {
                "category_id": "AVG",
                "category_description": "Person Protection Equipment AVG 2"
            };
            chai.request(server)
                .put('/s4s/t10001/productcategories/AVg')
                .send(product_3)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('category_description', 'Person Protection Equipment AVG');

                    chai.request(server)
                    .get('/s4s/t10001/productcategories/AvG')
                    .end((err, response) => {
                        response.should.have.status(200);
                        response.body.should.be.a('object');

                        chai.request(server)
                        .put('/s4s/t10001/productcategories/aVG')
                        .send(modifiedProduct_3)
                        .end((err, response) => {
                            response.should.have.status(200);
                            response.body.should.be.a('object');
                            response.body.should.have.property('category_description', 'Person Protection Equipment AVG 2');

                            chai.request(server)
                                .get('/s4s/t10001/productcategories/avg')
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.body.should.have.property('category_description', 'Person Protection Equipment AVG 2');
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
    describe('DELETE /s4s/{tenantId}/productcategories/:categoryId', () => {
        it('should DELETE the product category', (done) => {

            var category = {
                "category_id": "OXYGEN",
                "category_description": "Oxygen Cylinders"
            };
            chai.request(server)
                .post('/s4s/t10001/productcategories')
                .send(category)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');

                    chai.request(server)
                    .get('/s4s/t10001/productcategories/OXYGEN')
                    .end((err, response) => {
                        response.should.have.status(200);
                        response.body.should.be.a('object');

                        chai.request(server)
                            .delete('/s4s/t10001/productcategories/OXYGEN')
                            .end((err, response) => {
                                response.should.have.status(200);
                                response.body.should.be.a('object');

                                chai.request(server)
                                    .get('/s4s/t10001/productcategories/OXYGEN')
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

