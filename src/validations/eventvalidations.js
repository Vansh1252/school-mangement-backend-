import { body } from 'express-validator';

/**
 * Validation rules for creating a new event.
 * - title: required, must be a string
 * - description: optional, must be a string if provided
 * - date: required, must be a valid ISO8601 date string
 */
export const createEventValidation = [
  body('title')
    .notEmpty().withMessage('Event title is required')
    .isString().withMessage('Event title must be a string'),

  body('description')
    .optional()
    .isString().withMessage('Event description must be a string'),

  body('date')
    .notEmpty().withMessage('Event date is required')
    .isISO8601().withMessage('Date must be in YYYY-MM-DD format')
];

/**
 * Validation rules for updating an existing event.
 * - title: optional, must be a string if provided
 * - description: optional, must be a string if provided
 * - date: optional, must be a valid ISO8601 date string if provided
 */
export const updateEventValidation = [
  body('title')
    .optional()
    .isString().withMessage('Event title must be a string'),

  body('description')
    .optional()
    .isString().withMessage('Event description must be a string'),

  body('date')
    .optional()
    .isISO8601().withMessage('Date must be in YYYY-MM-DD format')
];
