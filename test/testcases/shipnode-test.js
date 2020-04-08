const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiThings = require('chai-things');
const server = require('../../src/app');
chai.should();
chai.use(chaiHttp);
chai.use(chaiThings);
const expect = chai.expect;

describe('ShipNode API', () => {

    /**
     * Test the POST route
     */
    describe('POST /s4s/{tenantId}/supplier/{supplierId}/shipnodes', () => {

        it('should NOT POST the shipnode without valid supplier_id', (done) => {
            chai.request(server)
                .post('/s4s/t10001/supplier/6G/shipnodes')
                .end((err, response) => {
                    response.should.have.status(404);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message');
                done();
            });
        });

        it('should POST the shipnode', (done) => {
            var shipnode = {
                "shipnode_id": "NODE_1",
                "shipnode_name": "Node One",
                "address_attributes": [
                    { "name": "Address Line 1", "value": "123 Bond St" },
                    { "name": "city", "value": "Dallas" }
                ]
            };
            chai.request(server)
                .post('/s4s/t10001/supplier/3M/shipnodes')
                .send(shipnode)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                done();
            });
        });

        it('should POST multiple shipnodes', (done) => {
            var shipnodes = [
                {
                    "shipnode_id": "NODE_2",
                    "shipnode_name": "Node Two",
                    "address_attributes": [
                        { "name": "Address Line 1", "value": "234 Bond St" },
                        { "name": "city", "value": "Irving" }
                    ]
                },
                {
                    "shipnode_id": "NODE_3",
                    "shipnode_name": "Node Three",
                    "address_attributes": [
                        { "name": "Address Line 1", "value": "345 Bond St" },
                        { "name": "city", "value": "Plano" }
                    ]
                },
                {
                    "shipnode_id": "NODE_4",
                    "shipnode_name": "Node Four",
                    "address_attributes": [
                        { "name": "Address Line 1", "value": "456 Bond St" },
                        { "name": "city", "value": "Frisco" }
                    ]
                }
            ];
            chai.request(server)
                .post('/s4s/t10001/supplier/3M/shipnodes')
                .send(shipnodes)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('array');
                done();
            });
        });

        
    });

    /**
     * Test the GET route
     */
    describe('GET /s4s/{tenantId}/supplier/{supplierId}/shipnodes', () => {

        it('should GET ship nodes for a specific supplier_id', (done) => {
            chai.request(server)
                .get('/s4s/t10001/supplier/3M/shipnodes')
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    expect(response.body).to.have.lengthOf(4);
                done();
            });
        });

    });

});

