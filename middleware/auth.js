
// Middleware to check if the user is logged in (Authentication)
module.exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).json({ error: 'Unauthorized. Please login.' });
  }
};

// Middleware to check if the logged-in user is an admin (Authorization)
module.exports.isAdmin = (req, res, next) => {
  console.log(req.isAuthenticated(), req?.user);
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  } else {
    return res.status(403).json({ error: 'Forbidden. Access restricted to admin users.' });
  }
};

// module.exports.verifyToken = (req, res, next) => {
//     const token = req.header('Authorization');
//     if (!token) {
//       return res.status(401).json({ error: 'Unauthorized. Please login.' });
//     }
  
//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//       if (err) {
//         return res.status(401).json({ error: 'Invalid token. Please login again.' });
//       }
  
//       req.user = decoded;
//       next();
//     });
//   };
  
//   // Middleware to check if the logged-in user is an admin (Authorization)
// module.exports.isAdmin = (req, res, next) => {
//     const token = req.header('Authorization');
//     if (!token) {
//       return res.status(401).json({ error: 'Unauthorized. Please login.' });
//     }
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ error: 'Forbidden. Access restricted to admin users.' });
//     }
//     next();
//   };