const express = require('express');

const User = require('./../models/userModel');

const asyncErrorHandler = require('./../utils/asyncErrorHandler');
// const CustomError = require('./../utils/CustomError');

exports.addGuests = asyncErrorHandler(async(req, res, next) => {

    const newGuests = req.body.guests;

    const updatedUser = await User.findByIdAndUpdate(req.params.userId, {  $push: { guests: { $each: newGuests } } }, { new: true });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
})

exports.deleteGuest = asyncErrorHandler(async (req, res, next) => {
    const userId = req.params.userId;
    const guestId = req.params.guestId;

    const updatedUser = await User.findByIdAndUpdate(userId, { $pull: { guests: { _id: guestId } } }, { new: true });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
})

exports.updateGuest = asyncErrorHandler();
