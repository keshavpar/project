const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const util = require('util')
const User = require('./../models/userModel');
const asyncErrorHandler = require('./../utils/asyncErrorHandler');
const CustomError = require('./../utils/CustomError');

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

exports.signup = asyncErrorHandler(async (req, res, next) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    const newUser = await User.create(req.body);

    createSendToken(newUser, 201, res);
});

exports.login = asyncErrorHandler(async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password) {
        const error = new CustomError('Please provide email and passowrd to login!', 400);
        next(error);
    }

    const user = await User.findOne({ email }).select('+password');;

    if(!user || !(user.comparePasswordInDb(password, user.password))) {
        const error = new CustomError('Incorrect email or password! ', 400)
        next(error);
    }

    createSendToken(user, 200, res);
});

exports.protect = asyncErrorHandler(async (req, res, next) => {
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
    if(!token){
        next(new CustomError('You are not logged in! :(', 401));
    }

    // 2. Validating Token
    const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR);

    // 3. If the user exists (If the user logedin and after that user get deleted from records)
    const user = await User.findById(decodedToken.id);

    if(!user){
        const error = new CustomError('The user with the given token doesnt exists! :(', 401);
        next(error);
    }

    // 4. If user changed the password after the token was issued, then must loggedin

    // 5. Allow users to access the routes
    req.user = user;
    next();
});

exports.testing = asyncErrorHandler( async (req, res, next) => {
    console.log('Sahi chal raha authentication :)');
    res.status(200).json({
        status: 'success',
        message: 'Check the cookies for the token!'
    });
});

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });
    res.status(200).json({ status: 'success' });
};