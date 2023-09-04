//Importing the Dependency
const express = require("express");
const dotenv = require('dotenv');
dotenv.config({path: './config.env'})
const mongoose = require("mongoose");
const morgan = require('morgan');
const bodyParser = require("body-parser");
const helmet = require('helmet');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const usersRoutes = require('./routes/userRoutes');

const app = express();

app.use(express.json());

console.log(process.env.NODE_ENV);


//Connection with the Mongo DB databasse
mongoose
  .connect(process.env.DB_connection_String)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.error("Error connecting to the database /n" + err);
  });


//setting the Port number to 5000
const Port = 5000;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Development Logging
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}

app.use(cors({'origin': 'http://localhost:4200'}))

// Set Security HTTP Headers
app.use(helmet());

// Test Middleware
app.use((req, res, next) => { 
    req.requestedAt = new Date().toISOString();
    //console.log(req.headers);
    next();
})

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.all('*', (req, res, next) => {
  const err = new Error(`The url with ${req.originalUrl} doesn't exists on the server`);
  err.status = 'failed';
  err.statusCode = 404;
  next(err);
});

app.use((error, req, res, next) => {
  console.log('working Global error handler')
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';
  res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
  });
})

//Listening to the Activities on that Port number
app.listen(Port, () => {
  console.log("Listening to Port Number" + Port);
});
