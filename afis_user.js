
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    return User.find();
  })
  .then(users => {
    console.log('Users:', users);
  })
  .catch(err => console.error('Error:', err));
