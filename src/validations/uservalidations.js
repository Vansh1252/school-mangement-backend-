import { body } from 'express-validator';

/**
 * Validation rules for creating a new user (school admin).
 * - schoolName: required
 * - email: required, must be a valid email
 * - mobileNumber: required, must be a valid mobile number
 * - city: required
 * - address: required
 * - username: required
 * - password: required, must meet complexity requirements
 * - language: required
 * - adminphoto: required if role is admin (checked via custom validator)
 */
export const createUserValidation = [
    body('schoolName').notEmpty().withMessage('School name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('mobileNumber').isMobilePhone().withMessage('Invalid mobile number'),
    body('city').notEmpty().withMessage('City is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('username').notEmpty().withMessage('Username is required'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
        .matches(/[^A-Za-z0-9]/).withMessage('Password must contain at least one special character'),
    body('language').notEmpty().withMessage('Language is required'),
    // Validate that a file is present for adminphoto (optional: only for admin role)
    body().custom((value, { req }) => {
        if (req.body.role === 'admin' && !req.file) {
            throw new Error('Admin photo is required for admin users');
        }
        return true;
    }),
];

/**
 * Validation rules for updating a user profile.
 * All fields are optional but validated if provided.
 */
export const updateUserValidation = [
    body('schoolName').optional().notEmpty().withMessage('School name cannot be empty'),
    body('email').optional().isEmail().withMessage('Invalid email'),
    body('mobileNumber').optional().isMobilePhone().withMessage('Invalid mobile number'),
    body('city').optional().notEmpty().withMessage('City cannot be empty'),
    body('address').optional().notEmpty().withMessage('Address cannot be empty'),
    body('username').optional().notEmpty().withMessage('Username cannot be empty'),
    body('password')
        .optional()
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
        .matches(/[^A-Za-z0-9]/).withMessage('Password must contain at least one special character'),
    body('language').optional().notEmpty().withMessage('Language cannot be empty'),
];
