const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const util = require('util')
const User = require('./../models/userModel');

const signToken = id => {
    return jwt.sign({id}, process.env.SECRET_STR, {
        expiresIn: process.env.LOGIN_EXPIRES
    });
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if(process.env.NODE_ENV === 'production'){
        cookieOptions.secure = true
    }

    res.cookie('jwt', token, cookieOptions);

    user.password = undefined;
    
    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user
        }
    });
}

exports.signup = async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;
        const newUser = await User.create(req.body);
    
        createSendToken(newUser, 201, res);
    } catch (error) {
        // Handle the error here or let it propagate to the global error handler
        next(error);
    }
};

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
  
    try {
        if (!email || !password) {
            const error = new Error('Please provide email and password to login!');
            error.statusCode = 400;
            error.status = 'failed';
            throw error; // Throw the error to be caught by the global error handler
        }
    
        const user = await User.findOne({ email }).select('+password');
    
        if (!user || !(await user.comparePasswordInDb(password, user.password))) {
            const error = new Error('Incorrect email or password!');
            error.statusCode = 400;
            error.status = 'failed';
            throw error; // Throw the error to be caught by the global error handler
        }
    
        createSendToken(user, 200, res);
    } catch (error) {
        // Handle the error here or let it propagate to the global error handler
        next(error);
    }
};

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });
    res.status(200).json({ 
        status: 'success',
        token: "loggedout"
    });
};