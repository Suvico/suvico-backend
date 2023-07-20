const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
 loan_no: {
        type: 'string',
        unique: true,
      },
    
account_holder_name:{
    type: 'string',

},

email:{
    type: 'string',


},
mobile_no:{
    type:"number",

},
// address:{
//     type:"string",

// },

// aadharno:{
//     type:"Number",

// },
// panno:{
//     type:"string",

// },

bank_account_no:{
    type:"number",

},
bank_account_no_confirmation:{
    type:"number",

},
ifsc_code:{
    type:"string",

},
colltn_amt:{
    type:"number",

},

// amountwords:{
//     type:"string",

// },
frst_colltn_dt:{
    type:"date",

},
fnl_colltn_dt:{
    type:"date",

},
account_type:{
    type:"string",

},
seq_tp:{
    type:"string",
},
frqcy:{
    type:"string",
},
debit_type:{
    type:"boolean",
},
colltn_until_cncl:{
    type:"boolean",
},
category_id:{
    type:"Number",
},
bank_id:{
    type:"Number",
},
addnl2:{
    type:"string",
},
addnl3:{
    type:"string",
},
addnl4:{
    type:"string",
},
addnl5:{
    type:"string",
},
auth_type: {
    type:"string",
 },
  colltn_until_cncl:{
    type:"string",
  }




},{ timestamps: true });

// userSchema.pre('save', async function (next) {
//     if (this.isNew) {
//       const lastUser = await User.findOne({}, {}, { sort: { createdAt: -1 } });
//       let lastLoanNo = 'NP00000';
//       if (lastUser && lastUser.loan_no) {
//         lastLoanNo = lastUser.loan_no;
//       }
  
//       const currentNumber = parseInt(lastLoanNo.substring(3)) + 1;
//       const newLoanNo = `NP${currentNumber.toString().padStart(5, '0')}`;
//       this.loan_no = newLoanNo;
//     }
  
//     next();
//   });

const User =mongoose.model("USER",userSchema);

module.exports = User;
// module.exports = mongoose.model("User", userSchema);

