const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports.serializeDeserializeUser = (passport) =>{
    passport.serializeUser((user, done) => {
     done(null, user.id);
   });
   passport.deserializeUser(async(id, done) => {
     try {
        const user = await User.findById(id);
        done(null, user);
      } catch (err) {
        done(err, null);
      }
   });
 };

module.exports.passportLocalConfig = async (passport) =>{
 
    // Passport Local Strategy for authentication
passport.use(
    new LocalStrategy(async(username, password, done)=>{
try{
     let user = await User.findOne({ username });
        if (!user){ 
            return done(null, false, { message: 'Username not registered' });
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) return done(err);
          if (!isMatch) return done(null, false, { message: 'Invalid credentials.' });
  
          return done(null, user);
        });
    }catch (err) {
      done(err)
  }
    })
  
  );
  
}