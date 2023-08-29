//Importing the Dependency
const express = require("express");
const dotenv = require('dotenv');
dotenv.config({path: './config.env'})
const mongoose = require("mongoose");
const morgan = require('morgan');
const bodyParser = require("body-parser");

const User = require("./models/userModel");
const globalErrorHandler = require('./controllers/errorController');
const CutomError = require('./utils/CustomError');

const authRoutes = require('./routes/authRoutes');

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

app.use(bodyParser.json());

// Development Logging
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}

// Routes
app.use('/api/v1/users', authRoutes);
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //     status: "Failed",
  //     message: `The url with ${req.originalUrl} doesn't exists on the server`
  // })
  // const err = new Error(`The url with ${req.originalUrl} doesn't exists on the server`);
  // err.status = 'Failed';
  // err.statusCode = 404;
  const err = new CustomError(`The url with ${req.originalUrl} doesn't exists on the server`, 404);
  next(err);
});

app.use(globalErrorHandler);











// app.use("/register", async function (req, res) {
//   try {
//     const { username, password } = req.body;
//     const existingUser = await User.findOne({ username });

//     if (existingUser) {
//       return res.status(400).json({ error: "Username already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({
//       username,
//       password: hashedPassword,
//       email: req.body,
//       mobilenumber: req.body,
//       first,
//     });
//     await newUser.save();

//     const token = jwt.sign({ userId: newUser._id }, "Cognizant", {
//       expiresIn: "1h",
//     });
//     res.status(201).json({ token });
//   } catch (error) {
//     res.status(500).json({ error: "Registration failed" });
//   }
// });

// app.use("/guest", authMiddleware, guestRoutes);
// app.use("/auth", authRoutes);
// app.use("/protected", authMiddleware, (req, res) => {
//   res.json({ message: "You have access to this protected route" });
// });

// //Registering the user for the First Time and
// app.post("/register", async (req, res) => {
//   try {
//     const password = req.body.password;
//     const cpassowrd = req.body.confirmpassword;

//     if (password == cpassowrd) {
//       const registerEmployee = new User({
//         firstname: req.body.firstname,
//         lastname: req.body.lastname,
//         email: req.body.email,
//         phone: req.body.phone,
//         password: req.body.password,
//       });
//       const token=await registerEmployee.generateAuthToken();
//       const registerd=await registerEmployee.save();
//       res.status(201).render("index")
//     }
//   } catch (er) {
//     res.setEncoding("Password are not matching");
//   }
// });

//Listening to the Activities on that Port number


app.listen(Port, () => {
  console.log("Listening to Shree always" + Port);
});