const axios = require('axios');
const UpiTransaction = require('../model/upiTransaction');
require('dotenv').config();

// Function to get the token
async function getToken() {
    const apiKey = process.env.API_KEY;
  
    try {
      const response = await axios.get('https://upi-uat.nupaybiz.com/Auth/token', {
        headers: {
          'api-key': apiKey, // Include the API key in the headers
        },
      });
      return response.data.token;
    } catch (error) {
      console.error('Token Request Error:', error);
      throw new Error('Failed to retrieve the token');
    }
  }
  

// Function to create a new UPI transaction
exports.createTransaction = async (req, res) => {
    try {
      // Get the token
      const token = await getToken();
  
      // Generate a unique reference number with NP followed by 8 digits
      const latestTransaction = await UpiTransaction.findOne().sort({ refNo: -1 }).exec();
      let refNo = 'NP00000001';
      if (latestTransaction) {
        const lastRefNo = parseInt(latestTransaction.refNo.substring(2), 10);
        refNo = 'NP' + ('00000000' + (lastRefNo + 1)).slice(-8);
      }
  
      // Generate a unique loan number starting from NPL followed by 8 digits
      const latestLoanTransaction = await UpiTransaction.findOne().sort({ loan_no: -1 }).exec();
      let loan_no = 'NPL00000001';
      if (latestLoanTransaction) {
        const lastLoanNo = parseInt(latestLoanTransaction.loan_no.substring(3), 10);
        loan_no = 'NPL' + ('00000000' + (lastLoanNo + 1)).slice(-8);
      }
  
      const apiKey = process.env.API_KEY;
  
      // Prepare the UPI transaction data
      const upiTransactionData = {
        refNo,
        virtualAddress: req.body.virtualAddress,
        name: req.body.name,
        mobileNumber: req.body.mobileNumber,
        email: req.body.email,
        loan_no,
        amount: req.body.amount,
        pattern: req.body.pattern,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        additionalInfo: req.body.additionalInfo,
       
      };
  
      // Send a POST request with both headers
      const createMandateResponse = await axios.post('https://upi-uat.nupaybiz.com/api/CreateMandate/mandate', upiTransactionData, {
        headers: {
          'api-key': apiKey,
          'Token': token,
        },
      });
  
      // Save the transaction to the database
      // const upiTransaction = new UpiTransaction(upiTransactionData);
      const upiTransaction = new UpiTransaction({
        ...upiTransactionData,
        responseData: createMandateResponse.data, 
      });
      const savedTransaction = await upiTransaction.save();
  
      res.status(201).json({
        message: 'Transaction created successfully',
        token: token,
        response: createMandateResponse.data,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  };
  


  exports.checkMandateStatus = async (req, res) => {
    try {
      const apiKey = process.env.API_KEY;
      const token = await getToken(); // Assume you have a getToken function
  
      const { refNo, umn } = req.body;
  
      const response = await axios.post(
        'https://upi-uat.nupaybiz.com/api/CreateMandate/getMandateStatus',
        { refNo, umn },
        {
          headers: {
            'api-key': apiKey,
            'Token': token,
          },
        }
      );
  
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error checking mandate status:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };