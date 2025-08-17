// validators/parent.validator.js
import { body } from 'express-validator';

/**
 * Validation rules for updating a parent.
 * - fatherName: required, must be a string
 * - motherName: required, must be a string
 * - email: required, must be a valid email
 * - phoneNumber: required, must be a valid mobile phone
 * - fatherOccupation: optional, must be a string if provided
 * - address: optional, must be a string if provided
 */
export const updateParentValidation = [
    body('fatherName')
        .notEmpty().withMessage('Father name is required')
        .isString().withMessage('Father name must be a string')
        .trim(),

    body('motherName')
        .notEmpty().withMessage('Mother name is required')
        .isString().withMessage('Mother name must be a string')
        .trim(),

    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    body('phoneNumber')
        .notEmpty().withMessage('Phone number is required')
        .isMobilePhone().withMessage('Invalid phone number'),

    body('fatherOccupation')
        .optional()
        .isString().withMessage('Occupation must be a string')
        .trim(),

    body('address')
        .optional()
        .isString().withMessage('Address must be a string')
        .trim()
];

/**
 * Validation rules for creating a new parent.
 * - fatherName: required, must be a string
 * - motherName: required, must be a string
 * - email: required, must be a valid email
 * - phoneNumber: required, must be a valid mobile phone
 * - fatherOccupation: optional, must be a string if provided
 * - address: optional, must be a string if provided
 */
export const createParentValidation = [
    body('fatherName')
        .notEmpty().withMessage('Father name is required')
        .isString().withMessage('Father name must be a string')
        .trim(),

    body('motherName')
        .notEmpty().withMessage('Mother name is required')
        .isString().withMessage('Mother name must be a string')
        .trim(),

    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    body('phoneNumber')
        .notEmpty().withMessage('Phone number is required')
        .isMobilePhone().withMessage('Invalid phone number'),

    body('fatherOccupation')
        .optional()
        .isString().withMessage('Occupation must be a string')
        .trim(),

    body('address')
        .optional()
        .isString().withMessage('Address must be a string')
        .trim()
];