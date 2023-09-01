const express = require('express');

const userController = require('./../controllers/usercontroller');
const authController = require('./../controllers/authController');

const router = express.Router();

// Routes

// Fetch all the guests of the user
router.get('/guests/:userId', userController.guestList);/* authController.protect, */

// update-guests/23fhksfelk
router.patch('/update-guests/:userId', userController.addGuests); /* authController.protect */

// update-guests/user/23fhksfelk/guest/98scjbkak
router.
    route('/update-guests/user/:userId/guest/:guestId')
    .delete(userController.deleteGuest) /* authController.protect */
    .patch(userController.updateGuest); /* authController.protect */


module.exports = router;