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

exports.protect = async (req, res, next) => {
    try {
        // Checking token from headers and cookies
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        // 1. Checking if token exists with headers
        if (!token) {
            const error = new Error('You are not logged in! :(');
            error.statusCode = 401;
            error.status = 'failed';
            throw error; // Throw the error to be caught by the global error handler
        }

        // 2. Validating Token
        const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR);

        // 3. If the user exists (If the user logged in and after that user got deleted from records)
        const user = await User.findById(decodedToken.id);

        if (!user) {
            const error = new Error('The user with the given token doesn\'t exist! :(');
            error.statusCode = 401;
            error.status = 'failed';
            throw error; // Throw the error to be caught by the global error handler
        }

        // 4. If user changed the password after the token was issued, then must log in (Implement this check as needed)

        // 5. Allow users to access the routes
        req.user = user;
        next();
    } catch (error) {
        // Handle the error here or let it propagate to the global error handler
        next(error);
    }
};


exports.testing = async (req, res, next) => {
    res.status(200).json({
        status: 'success',
        message: 'Check the cookies for the token!',
        data: {
            user: req.user.username
        }
    });
};

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });
    res.status(200).json({ status: 'success' });
};