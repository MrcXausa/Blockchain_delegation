const mongoose = require('mongoose')
const { Schema } = mongoose;

const institutionSchema = new Schema({
  name:  String,
  vat: String,
  email: String,
  password: String,
  services: [String],
  privatekey: String,
  address:String
}, {
    collection: 'institutions'
});

const Institution = mongoose.model('Institution', institutionSchema);

module.exports = Institution;