const mongoose = require('mongoose');

const db = () => {
    mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server after the database connection is successful
   
  })
  .catch((err) => console.error('Error connecting to MongoDB:', err));
}

module.exports = db; 
