const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const passport = require('passport');

module.exports.register = async (req, res) => {
    try {
     
      const { username, password, role } = req.body;
      if(!username || !password || !role) {
          return res.status(400).json({error: 'fill in required fields'})
      }
      const user = await User.findOne({ username });
      if (user) {
        return res.status(401).json({ error: 'username already taken' });
      }
      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({ username, password: hashedPassword, role });
      const savedUser = await newUser.save();
      res.status(201).json({ new_user:  savedUser});
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
  }

  // module.exports.login = passport.authenticate('local', { session: false }), (req, res) => {
  //   // Generate a JWT token for the authenticated user
  //   const token = jwt.sign({ username: req.user.username, role: req.user.role }, 'your-secret-key', {
  //     expiresIn: '1h', // Token expiration time (1 hour in this case)
  //   });
  
  //   res.status(200).json({ token });
  // };



// module.exports.login = async (req, res) => {
//     try {
//       const { username, password } = req.body;
//       if(!username || !password) {
//         return res.status(400).json({error: 'fill in required fields'})
//     }
//       // Find the user in the database based on the username
//       const user = await User.findOne({ username });
//       if (!user) {
//         return res.status(401).json({ error: 'Invalid credentials.' });
//       }
//       console.log({user})
  
//       // Check if the provided password matches the stored hashed password
//       console.log(password, user.password);
//       const isPasswordValid = await bcrypt.compare(password, user.password);
//       if (!isPasswordValid) {
//         return res.status(401).json({ error: 'Invalid credentials.' });
//       }
  
//       // Generate a JWT token for the authenticated user
//       const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET, {
//         expiresIn: '1h', // Token expiration time (1 hour in this case)
//       });
//       res.cookie('token', token, { httpOnly: true });
//       res.status(200).json({ token });
//     } catch (err) {
//       res.status(500).json({ error: 'Internal Server Error', message: err.message, stack: err.stack });
//     }
//   }