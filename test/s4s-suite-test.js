const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiThings = require('chai-things');
const server = require('../src/app');
chai.should();
chai.use(chaiHttp);
chai.use(chaiThings);
const expect = chai.expect;

importTestSet = (path) => {
    require(path);
};

describe("S4S Test Suite", () => {

    before((done) => {
        console.log("Initiating initial data set up ...");
        var tenant = {
            "tenant_id": "t10001",
            "tenant_name": "Organization 10001"
         };
        chai.request(server)
            .post('/s4s/tenants')
            .send(tenant)
            .end((err, response) => {
                console.log("Tenant %s created.", tenant.tenant_id);
            done();
        });
        console.log("... data set up complete !!!");
    });

    importTestSet('./testcases/product-category-test');
    importTestSet('./testcases/product-test');
    importTestSet('./testcases/supplier-test');
    importTestSet('./testcases/shipnode-test');

    after(() => {
        console.log("... ending S4S Test Suite !!!");
    });

});

