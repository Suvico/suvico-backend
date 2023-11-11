const mongoose = require('mongoose');

const upiTransactionSchema = new mongoose.Schema({
  refNo: String,
  virtualAddress: String,
  name: String,
  mobileNumber: String,
  email: String,
  loan_no: String,
  amount: String,
  pattern: String,
  startDate: String,
  endDate: String,
  additionalInfo: {
    add1: String,
    add2: String,
    add3: String,
    add4: String,
  },
  responseData: Object,
}, { timestamps: true });

module.exports = mongoose.model('UpiTransaction', upiTransactionSchema);
