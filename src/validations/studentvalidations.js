// validators/student.validator.js
import { body } from 'express-validator';

/**
 * Validation rules for creating a new student.
 * Checks all required student and parent fields.
 */
export const createStudentValidation = [
    // Student fields
    body('name').notEmpty().withMessage('Student name is required'),
    body('gender').isIn(['Male', 'Female']).withMessage('Gender must be Male or Female'),
    body('classId').isMongoId().withMessage('Invalid class ID'),
    body('dateOfBirth').isISO8601().withMessage('Invalid date of birth'),
    body('bloodGroup').notEmpty().withMessage('Blood group is required'),
    body('religion').notEmpty().withMessage('Religion is required'),
    body('admissionDate').isISO8601().withMessage('Invalid admission date'),

    // Parent fields
    body('fatherName').notEmpty().withMessage('Father name is required'),
    body('motherName').notEmpty().withMessage('Mother name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('phoneNumber').isMobilePhone().withMessage('Invalid phone number'),
    body('fatherOccupation').notEmpty().withMessage('Father occupation is required'),
    body('address').notEmpty().withMessage('Address is required'),
];

/**
 * Validation rules for updating an existing student.
 * All fields are optional but validated if provided.
 */
export const updateStudentValidation = [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('gender').optional().isIn(['Male', 'Female']).withMessage('Invalid gender'),
    body('classId').optional().isMongoId().withMessage('Invalid class ID'),
    body('dateOfBirth').optional().isISO8601().withMessage('Invalid date format'),
    body('bloodGroup').optional().notEmpty().withMessage('Blood group is required'),
    body('religion').optional().notEmpty().withMessage('Religion is required'),
    body('admissionDate').optional().isISO8601().withMessage('Admission date format is invalid'),
    body('studentPhoto').optional().isString(),
];

/**
 * Validation rules for promoting a student.
 * Requires studentId, fromClassId, and toClassId as valid Mongo IDs.
 */
export const studentpromotion = [
    body("studentId")
        .notEmpty()
        .withMessage("Student ID is required")
        .isMongoId()
        .withMessage("Invalid Student ID"),

    body("fromClassId")
        .notEmpty()
        .withMessage("From Class ID is required")
        .isMongoId()
        .withMessage("Invalid From Class ID"),

    body("toClassId")
        .notEmpty()
        .withMessage("To Class ID is required")
        .isMongoId()
        .withMessage("Invalid To Class ID"),
];

/**
 * Validation rules for updating student fees.
 * - total_fees: required, must be a non-negative number
 * - paidfees: required, must be a non-negative number and not greater than total_fees
 * - remaining_fees: required, must be a non-negative number
 */
export const updateStudentFeesValidation = [
    body('total_fees')
        .notEmpty().withMessage('Total fees is required')
        .isNumeric().withMessage('Total fees must be a number')
        .custom(value => value >= 0).withMessage('Total fees cannot be negative'),

    body('paidfees')
        .notEmpty().withMessage('Paid fees is required')
        .isNumeric().withMessage('Paid fees must be a number')
        .custom(value => value >= 0).withMessage('Paid fees cannot be negative')
        .custom((value, { req }) => {
            if (value > req.body.total_fees) {
                throw new Error('Paid fees cannot be greater than total fees');
            }
            return true;
        }),

    body('remaining_fees')
        .notEmpty().withMessage('Remaining fees is required')
        .isNumeric().withMessage('Remaining fees must be a number')
        .custom(value => value >= 0).withMessage('Remaining fees cannot be negative'),
];