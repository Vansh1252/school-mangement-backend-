import { body } from 'express-validator';

/**
 * Validation rules for creating a new class.
 * - className: required, must be a string
 * - grade: required, must be a positive integer
 */
export const createClassValidation = [
    body('className')
        .notEmpty().withMessage('Class name is required')
        .isString().withMessage('Class name must be a string'),

    body('grade')
        .notEmpty().withMessage('Grade is required')
        .isInt({ min: 1 }).withMessage('Grade must be a positive integer'),
];

/**
 * Validation rules for updating an existing class.
 * - className: optional, must be a string if provided
 * - grade: optional, must be a positive integer if provided
 */
export const updateClassValidation = [
    body('className')
        .optional()
        .isString().withMessage('Class name must be a string'),

    body('grade')
        .optional()
        .isInt({ min: 1 }).withMessage('Grade must be a positive integer'),
];
