const axios = require('axios');
const User = require('../model/userSchema');

let token = '';

const generateToken = async () => {
  try {
    const apiKey = process.env.NU_PAY_API_KEY || 'default-api-key';

    const response = await axios.get('https://nupaybiz.com/autonach/Auth/token', {
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
    });

    if (response.status === 200) {
      const data = response.data;
      token = data.token;
      console.log('Generated Token:', token);
      return token;
    } else {
      throw new Error('Token generation failed. Response status: ' + response.status);
    }
  } catch (error) {
    console.error('Error generating token:', error);
    throw error;
  }
};

const sendUserDataToAPI = async (data, apiKey, token) => {
  try {
    const response = await axios.post(
      'https://nupaybiz.com/autonach/api/EMandate/eManadate',
      JSON.stringify(data),
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
          token: token,
        },
      }
    );

    if (response.status === 200) {
      const responseData = response.data;
      return responseData;
    } else {
      const errorData = response.data;
      console.error('Failed to send user data to API. Response status:', response.status);
      console.error('Error:', errorData);
      if (response.status === 403) {
        throw new Error('Forbidden: The request was not authorized.');
      } else {
        throw new Error('Failed to send user data to API. Response status: ' + response.status);
      }
    }
  } catch (error) {
    console.error('Error sending user data to API:', error);
    throw error;
  }
};

const generateLoanNumber = async () => {
  try {
    const lastLoan = await User.findOne({}, {}, { sort: { loan_no: -1 } }); // Retrieve the last loan document based on the loan_no field
    let lastLoanNumber = 0;

    if (lastLoan) {
      const lastLoanNumberStr = lastLoan.loan_no.substring(2); // Extract the numeric part of the loan number
      lastLoanNumber = parseInt(lastLoanNumberStr);
    }

    lastLoanNumber++; // Increment the last loan number

    const loanNumber = `NP${lastLoanNumber.toString().padStart(4, '0')}`; // Format the incremented loan number

    return loanNumber;
  } catch (error) {
    console.error('Error generating loan number:', error);
    throw error;
  }
};

const createSuvico = async (req, res) => {
  try {
    const apiKey = process.env.NU_PAY_API_KEY;
    const data = req.body;

    let loanNumber = await generateLoanNumber();
    
    // Handle potential duplicate key error
    while (true) {
      try {
        data.loan_no = loanNumber;

        const newUser = new User(data);
        const result = await newUser.save();
        console.log('User data saved:', result);

        if (!token || typeof token === 'undefined') {
          token = await generateToken();
        }

        const apiResponse = await sendUserDataToAPI(data, apiKey, token);
        console.log('API Bank response:', apiResponse);

        res.send({ response: data, status: 'passed', bankResponse: apiResponse });
        break; 
      } catch (error) {
        if (error.code === 11000) {
          // Duplicate key error, generate a new loan number and retry
          loanNumber = await generateLoanNumber();
        } else {
          console.error('Error:', error);
          res.status(500).send({ error: 'Internal Server Error' });
          break; // Exit the loop if there's another non-duplicate-key error
        }
      }
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};


const getBankList = async (req, res) => {
  try {
    const apiKey = process.env.NU_PAY_API_KEY || 'default-api-key';

    const response = await axios.get('https://nupaybiz.com/autonach/api/EMandate/getBankList?bank_type=Esign', {
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching bank list:', error.message);
    res.status(500).json({ error: 'Failed to fetch bank list' });
  }
};


const getCategoryList = async (req, res) => {
  try {
    const apiKey = process.env.NU_PAY_API_KEY || 'default-api-key';

    const response = await axios.get('https://nupaybiz.com/autonach/api/EMandate/getCategoryList', {
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching category list:', error.message);
    res.status(500).json({ error: 'Failed to fetch category list' });
  }
};

module.exports = {
  createSuvico,
  getBankList,
  getCategoryList, 
};