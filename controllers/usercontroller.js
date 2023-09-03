const User = require('../models/userModel');
const mongoose = require('mongoose');

exports.addGuests = async (req, res, next) => {
    try {
        const newGuest = req.body; // Assuming req.body.guests is the single guest object
        const userId = req.params.userId;

        // Find the user by ID
        const user = await User.findById(userId).select('+guests');

        if (!user) {
            // If the user with the given ID was not found
            const error = new Error('User not found');
            error.statusCode = 404;
            error.status = 'failed';
            throw error;
        }

        // Add the new guest to the user's guests array
        user.guests.push(newGuest);

        // Save the updated user document
        const updatedUser = await user.save();

        res.status(200).json({
            status: 'success',
            data: {
                user: updatedUser,
            }
        });
    } catch (error) {
        // Handle the error here or let it propagate to the global error handler
        next(error);
    }

};
  

exports.deleteGuest = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const guestId = req.params.guestId;
    
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { guests: { _id: guestId } } },
            { new: true, select: "guests" }
        );
    
        if (!updatedUser) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
    
        res.status(200).json({
            status: 'success',
            data: {
                user: updatedUser,
            },
        });
    } catch (error) {
        // Handle the error here or let it propagate to the global error handler
        next(error);
    }
};
  
exports.guestList = async(req, res, next) => {
    try{
        const user = await User.findById(req.params.userId).select('+guests');

        res.status(200).json({
            status: 'success',
            data: {
                guests: user.guests
            }
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            data: null
        });
    };
}

exports.updateGuest = async (req, res, next) => {
    try {
        // Find the user by their _id and select the 'guests' field
        const user = await User.findById(req.params.userId).select('+guests');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let guestUpdated = false;

        // Use forEach to iterate over the guests array
        user.guests.forEach(guest => {
            // Convert req.params.guestId to ObjectId
            const guestId = new mongoose.Types.ObjectId(req.params.guestId);

            if (guest._id.equals(guestId)) {
                // Update the specific guest with fields from req.body
                Object.keys(req.body).forEach(key => {
                    guest[key] = req.body[key];
                });
                guestUpdated = true;
            }
        });

        if (!guestUpdated) {
            return res.status(404).json({ message: 'Guest not found' });
        }

        // Save the updated user
        await user.save();

        res.status(200).json({ message: 'Guest updated successfully' });
    } catch (error) {
        // Handle errors here
        next(error);
    }
}

