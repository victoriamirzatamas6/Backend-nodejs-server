// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    await userService.createUser(username, password);
    res.status(201).send('User created successfully');
  } catch (error) {
    res.status(500).send('Error creating user');
  }
});

module.exports = router;
