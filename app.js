const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

dotenv.config({ path: './config.env' });
require('./db/conn');

app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(express.json());

app.use('/', userRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
