const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const { authMiddleware } = require('../middlewere/authMiddleware');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/change-password', authMiddleware, authController.changePassword);

// Legacy insecure route (kept for compatibility)
router.post('/forgot-password', authController.forgotPassword);

// Secure password reset flow
router.post('/request-password-reset', authController.requestPasswordReset);
router.get('/reset-password/:token', authController.showResetPasswordPage);
router.post('/reset-password', express.urlencoded({ extended: true }), authController.resetPassword);

router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
