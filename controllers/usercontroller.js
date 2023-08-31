const express = require('express');

const User = require('./../models/userModel');

exports.addGuests = async(req, res, next) => {

    const newGuests = req.body.guests;
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {  $push: { guests: { $each: newGuests } } }, { new: true });

        res.status(200).json({
            status: 'success',
            data: {
                user: updatedUser
            }
        });
    } catch (error) {

    }
    
}

exports.deleteGuest = async (req, res, next) => {
    try{
        const userId = req.params.userId;
        const guestId = req.params.guestId;

        const updatedUser = await User.findByIdAndUpdate(userId, { $pull: { guests: { _id: guestId } } }, { new: true });

        res.status(200).json({
            status: 'success',
            data: {
                user: updatedUser
            }
        });
    } catch (error) {

    }
    
}

exports.updateGuest = asyncErrorHandler();
