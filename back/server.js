const express = require('express');
const mongoose = require('mongoose');

// Environnement variables
require('dotenv').config();

const userRoutes = require('./routes/userRoutes.js');
const catchRoutes = require('./routes/catchRoutes.js');
const dsn = require('./utils/dsn.js')

mongoose.set('strictQuery', true);

mongoose
  .connect(dsn)
  .then(() => {
    console.log('Sucessful connection to MongoDB !');
  })
  .catch(() => {
    console.log('Failed to connect to MongoDB !');
  });

const app = express();
app.use(express.json());

// Used for avoiding CORS errors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());

// Api routes
app.use('/users', userRoutes);
app.use('/catches', catchRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
