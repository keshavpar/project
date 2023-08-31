const express = require('express');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/checking-auth', authController.protect, authController.testing);
router.get('/logout', authController.logout);

module.exports = router;