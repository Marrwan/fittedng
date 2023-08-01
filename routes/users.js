const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authController = require('../controllers/auth');
const passport = require('passport');
const jwt = require('jsonwebtoken');
// Create a new User
router.post('/register', authController.register);

router.post('/login',  passport.authenticate('local', {  failureMessage: true}),
function(req, res) {
  res.json(req.user);
});

module.exports = router;
