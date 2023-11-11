const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const cors = require('cors');

// Import userRoutes and contactRoutes
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');
const upiTransactionRoutes = require('./routes/upiTransactionRoutes');



dotenv.config({ path: './config.env' });
require('./db/conn');

app.use(cors({
  origin: ['http://localhost:3000', 'http://suvicosolutions.com']
}));

app.use(express.json());

// Mount userRoutes at the root path
app.use('/', userRoutes);
app.use('/api', upiTransactionRoutes);


// Mount contactRoutes at the /contact path
app.use('/contact', contactRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
