const mongoose = require('mongoose');

const ivCredentialSchema = new mongoose.Schema({
    buyer_scbn_id: {
        type: String,
        required: true
    },
    iv_tenant_id: {
        type: String,
        required: true
    },
    iv_tenant_client_id: {
        type: String,
        required: true
    },
    iv_tenant_client_secret: {
        type: String,
        required: true
    },
    bearer_token: String,
    token_expiration_datetime: Date
});

const IVCredential = mongoose.model('IVCredential', ivCredentialSchema);

module.exports = IVCredential;