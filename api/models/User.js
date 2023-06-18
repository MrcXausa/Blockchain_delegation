const mongoose = require('mongoose')
const { Schema } = mongoose;

const userSchema = new Schema({
  name:  String,
  surname: String,
  taxcode: String,
  email: String,
  password: String,
  address:String
}, {
    collection: 'users'
});

const User = mongoose.model('User', userSchema);

module.exports = User;