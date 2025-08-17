import { body } from 'express-validator';

/**
 * Validation rules for creating a new subject.
 * - subjectName: required, must be a string
 * - teacherId: required, must be a valid Mongo ID
 * - classes: required, must be an array with at least one class
 * - days: required, must be a string
 */
export const createSubjectValidation = [
  body('subjectName')
    .notEmpty().withMessage('Subject name is required')
    .isString().withMessage('Subject name must be a string'),

  body('teacherId')
    .notEmpty().withMessage('Teacher ID is required')
    .isMongoId().withMessage('Invalid teacher ID'),

  body('classes')
    .notEmpty().withMessage('Classes are required')
    .isArray({ min: 1 }).withMessage('Classes must be an array with at least one class'),

  body('days')
    .notEmpty().withMessage('Days are required')
    .isString().withMessage('Days must be a string (e.g., "Mon, Wed, Fri")')
];

/**
 * Validation rules for updating an existing subject.
 * - subjectName: optional, must be a string if provided
 * - teacherId: optional, must be a valid Mongo ID if provided
 * - classes: optional, must be an array if provided
 * - days: optional, must be a string if provided
 */
export const updateSubjectValidation = [
  body('subjectName')
    .optional()
    .isString().withMessage('Subject name must be a string'),

  body('teacherId')
    .optional()
    .isMongoId().withMessage('Invalid teacher ID'),

  body('classes')
    .optional()
    .isArray().withMessage('Classes must be an array'),

  body('days')
    .optional()
    .isString().withMessage('Days must be a string')
];
