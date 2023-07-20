var request = require('request');
var options = {
  'method': 'POST',
  'url': 'https://nupaybiz.com/uat/api/EMandate/eManadate',
  'headers': {
    'api-key': 'NmVlMmQzYmVlZWI3NTQyODFkMzFmNTljZDc1OTlkYzM=',
    'Token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6Ik5tVmxNbVF6WW1WbFpXSTNOVFF5T0RGa016Rm1OVGxqWkRjMU9UbGtZek09IiwidGltZXN0YW1wIjoxNjg3Nzc5MjY0fQ.LfP1l4T--tkyA5w41HWxSPEnQ_ifhrimUHE0CqnNAtc',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "loan_no": "NP00003",
    "seq_tp": "RCUR",
    "frqcy": "ADHO",
    "frst_colltn_dt": "2023-06-28",
    "fnl_colltn_dt": "2023-09-08",
    // "colltn_until_cncl": true,
    "colltn_amt": 100,
    "debit_type": false,
    "mobile_no": "9699891420",
    // "tel_no": "",
    "email": "dabhihitesh77@gmail.com",
    "category_id": 7,
    "account_holder_name": "Sushant Dabhi",
    "bank_id": 7,
    // "auth_type": "",
    "account_type": "Savings",
    "ifsc_code": "ICIC0001234",
    "bank_account_no": "0151177111",
    "bank_account_no_confirmation": "0151177111",
    // "addnl2": "NUPAY123",
    // "addnl3": "NUPAY123",
    // "addnl4": "NUPAY123",
    // "addnl5": "NUPAY123"
  })

};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});




