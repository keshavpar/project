const express = require('express');

const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

// Routes

// Fetch all the guests of the user
router.get('/guests/:userId', authController.protect, userController.guestList);

// update-guests/23fhksfelk
router.patch('/update-guests/:userId', authController.protect, userController.addGuests);

// update-guests/user/23fhksfelk/guest/98scjbkak
router.
    route('/update-guests/user/:userId/guest/:guestId')
    .delete(authController.protect, userController.deleteGuest)
    .patch(authController.protect, userController.updateGuest);


module.exports = router;