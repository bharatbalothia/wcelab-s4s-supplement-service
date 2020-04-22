const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    username: { type: String, uppercase: true, required: true },
    tenant_id: { type: String, required: true },
    buyers: [String],
    suppliers: [String]
});

userSchema.index({ username: 1, tenant_id: 1 }, { unique: true });
userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);

module.exports = User;