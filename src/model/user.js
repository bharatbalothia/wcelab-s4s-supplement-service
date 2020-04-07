const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    client_name: String,
    client_type: String,
    client_id: String,
    client_secret: String
});

userSchema.index({ client_name: 1 }, { unique: true });
userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);
// User.ensureIndexes();
// User.on('index', (err) => {
//     if (err) {
//         console.error('User index error: %s', err);
//     }else{
//         console.log('Created Index for User');
//     }
// });

module.exports = User;