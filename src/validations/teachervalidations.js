import { body } from 'express-validator';

/**
 * Validation rules for creating a new teacher.
 * - firstName: required
 * - lastName: required
 * - gender: required, must be "Male" or "Female"
 * - dateOfBirth: required, must be a valid ISO8601 date
 * - bloodGroup: required
 * - religion: required
 * - email: required, must be a valid email
 * - phoneNumber: required, must be a valid mobile phone
 * - classId: required, must be a valid Mongo ID
 * - address: required
 * - admissionDate: required, must be a valid ISO8601 date
 */
export const createTeacherValidation = [
    body('firstName').notEmpty().withMessage('firstname is required'),
    body('lastName').notEmpty().withMessage('lastName is required'),
    body('gender').isIn(['Male', 'Female']).withMessage('Gender must be Male or Female'),
    body('dateOfBirth').isISO8601().withMessage('Invalid date of birth'),
    body('bloodGroup').notEmpty().withMessage('Blood group is required'),
    body('religion').notEmpty().withMessage('Religion is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body("phoneNumber").isMobilePhone().withMessage("Invalid phone number"),
    body('classId').isMongoId().withMessage('Invalid class ID'),
    body('address').notEmpty().withMessage('Address is required'),
    body('admissionDate').isISO8601().withMessage('Invalid admission date'),
];

/**
 * Validation rules for updating an existing teacher.
 * All fields are required and validated.
 */
export const updateTeacherValidation = [
    body('firstName').notEmpty().withMessage('firstname is required'),
    body('lastName').notEmpty().withMessage('lastName is required'),
    body('gender').isIn(['Male', 'Female']).withMessage('Gender must be Male or Female'),
    body('dateOfBirth').isISO8601().withMessage('Invalid date of birth'),
    body('bloodGroup').notEmpty().withMessage('Blood group is required'),
    body('religion').notEmpty().withMessage('Religion is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('phoneNumber').isMobilePhone().withMessage('Invalid phone number'),
    body('address').notEmpty().withMessage('Address is required'),
    body('admissionDate').isISO8601().withMessage('Invalid admission date'),
];
