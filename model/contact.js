// models/contact.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  message: { type: String, required: true },
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
