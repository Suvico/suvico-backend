const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const cors = require('cors');

// Import userRoutes and contactRoutes
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');
const upiTransactionRoutes = require('./routes/upiTransactionRoutes');
const mandateRoutes =require('./routes/mandateRoutes');
const liveBanksRoutes = require("./routes/liveBankRoutes");


dotenv.config({ path: './config.env' });
require('./db/conn');

app.use(cors({
  origin: ['http://localhost:3000', 'http://suvicosolutions.com','https://suvicosolutions.com','www.suvicosolutions.com','https://www.suvicosolutions.com']
}));

app.use(express.json());
// parse URL-encoded bodies (HDFC sends callback in this format)
app.use(express.urlencoded({ extended: true }));

// test route
app.get("/hi", (req, res) => {
  res.send("Hi from server 👋");
});
// Mount userRoutes at the root path
app.use('/', userRoutes);
app.use('/api', upiTransactionRoutes);


// Mount contactRoutes at the /contact path
app.use('/contact', contactRoutes);
app.use("/emandate", mandateRoutes);
app.use("/bank/live-banks", liveBanksRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
