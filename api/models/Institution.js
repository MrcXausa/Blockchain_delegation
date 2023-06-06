const mongoose = require('mongoose')
const { Schema } = mongoose;

const institutionSchema = new Schema({
  name:  String,
  piva: String,
  email: String,
  password:String
}, {
    collection: 'institutions'
});

const Institution = mongoose.model('Institution', institutionSchema);

module.exports = Institution;