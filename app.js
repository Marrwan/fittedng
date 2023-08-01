require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const db = require('./config/db');
const passport = require('passport');
const { passportLocalConfig, serializeDeserializeUser } = require('./config/passport');
const session = require('express-session');

db()

const app = express();
app.use(session({
    secret: process.env.JWT_SECRET,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
serializeDeserializeUser(passport)
passportLocalConfig(passport)

const taskRouter = require('./routes/task');
const usersRouter = require('./routes/users');
app.use('/v1', taskRouter);
app.use('/v1/auth', usersRouter);

module.exports = app;
