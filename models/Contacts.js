const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  contact_name: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  position: {
    type: String
  },
  email: {
    type: String
  },
  phone: {
    type: String
  },
  notes: {
    type: String
  }
});

module.exports = Contact = mongoose.model('contact', ContactSchema);
