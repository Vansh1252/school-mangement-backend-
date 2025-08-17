import express from 'express';
import {
    createuser, 
    loginUser, 
    forgotPasswordController, 
    logout, 
    resetPasswordController, 
    getalluserdetails, 
    updateProfilePhoto
} from '../controllers/usersControllers.js';
import { createUserValidation } from '../validations/uservalidations.js';
import { validate } from '../middleware/validate.js';
import { auth } from '../middleware/auth.js';
import upload from '../middleware/multermiddleware.js';

const router = express.Router();

// Create a new user (admin registration), requires authentication and photo upload
router.post('/create', auth, upload.single('adminPhoto'), createUserValidation, validate, createuser);

// User login
router.post('/login', loginUser);

// Forgot password (send reset email)
router.post('/forgot-password', forgotPasswordController);

// Reset password using token
router.post('/reset-password/:id/:token', resetPasswordController);

// User logout
router.post('/logout', logout);

// Update profile photo for the logged-in user
router.put('/profile/photo', auth, upload.single('profile_photo'), updateProfilePhoto);

// Get all details of the logged-in user
router.get('/user', auth, getalluserdetails);

export default router;
