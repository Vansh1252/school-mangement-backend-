import { body } from 'express-validator';

/**
 * Validation rules for creating a new reminder.
 * - message: optional, must be a string if provided
 * - date: required, must be a valid ISO8601 date string
 * - color: optional, must be a string if provided
 */
export const createReminderValidation = [
  body('message')
    .optional()
    .isString().withMessage('Reminder message must be a string'),

  body('date')
    .notEmpty().withMessage('Reminder date is required')
    .isISO8601().withMessage('Date must be in YYYY-MM-DD format'),

  body('color')
    .optional()
    .isString().withMessage('Reminder color must be a string')
];

/**
 * Validation rules for updating an existing reminder.
 * - message: optional, must be a string if provided
 * - date: optional, must be a valid ISO8601 date string if provided
 * - color: optional, must be a string if provided
 */
export const updateReminderValidation = [
  body('message')
    .optional()
    .isString().withMessage('Reminder message must be a string'),

  body('date')
    .optional()
    .isISO8601().withMessage('Date must be in YYYY-MM-DD format'),

  body('color')
    .optional()
    .isString().withMessage('Reminder color must be a string')
];
