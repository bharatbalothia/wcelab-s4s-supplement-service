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
    describe('POST /s4s/{tenantId}/product/category', () => {
        it('should NOT POST the product category without category_id', (done) => {
            chai.request(server)
                .post('/s4s/t10001/product/category')
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
                .post('/s4s/t10001/product/category')
                .send(product)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                done();
            });
        });

        it('should POST another product category', (done) => {
            var product = {
                "category_id": "EQUIPMENT",
                "category_description": "Medical Equipments"
            };
            chai.request(server)
                .post('/s4s/t10001/product/category')
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
                .post('/s4s/t10001/product/category')
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
    describe('GET /s4s/{tenantId}/product/categories', () => {
        it('should GET all the product categories', (done) => {
            chai.request(server)
                .get('/s4s/t10001/product/categories')
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    expect(response.body).to.have.lengthOf(2);
                done();
            });
        });

    });

    /**
     * Test the DELETE route
     */
    describe('DELETE /s4s/{tenantId}/product/category/:categoryId', () => {
        it('should DELETE the product category', (done) => {

            var category = {
                "category_id": "OXYGEN",
                "category_description": "Oxygen Cylinders"
            };
            chai.request(server)
                .post('/s4s/t10001/product/category')
                .send(category)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');

                    chai.request(server)
                    .get('/s4s/t10001/product/category/OXYGEN')
                    .end((err, response) => {
                        response.should.have.status(200);
                        response.body.should.be.a('object');

                        chai.request(server)
                            .delete('/s4s/t10001/product/category/OXYGEN')
                            .end((err, response) => {
                                response.should.have.status(200);
                                response.body.should.be.a('object');

                                chai.request(server)
                                    .get('/s4s/t10001/product/category/OXYGEN')
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

