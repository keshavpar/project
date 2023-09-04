const express = require('express');

const userController = require('./../controllers/usercontroller');
const authController = require('./../controllers/authController');

const router = express.Router();

// Routes

// Fetch all the guests of the user
router.get('/guests/:userId', userController.guestList);

// update-guests/23fhksfelk
router.patch('/update-guests/:userId', userController.addGuests); 

// update-guests/user/23fhksfelk/guest/98scjbkak
router.
    route('/update-guests/user/:userId/guest/:guestId')
    .delete(userController.deleteGuest) 
    .patch(userController.updateGuest); 


module.exports = router;