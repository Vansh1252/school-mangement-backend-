import { body } from 'express-validator';

/**
 * Validation rules for creating a new fees group.
 * - classId: required
 * - feeTypes: required, must be an array with at least one item
 * - feeTypes.*.str_feeName: required for each fee type
 * - feeTypes.*.int_amount: required for each fee type, must be a number
 */
export const validateCreateFeesGroup = [
  body('classId').notEmpty().withMessage('Class ID is required'),
  body('feeTypes').isArray({ min: 1 }).withMessage('At least one fee type is required'),
  body('feeTypes.*.str_feeName').notEmpty().withMessage('Fee name is required'),
  body('feeTypes.*.int_amount').isNumeric().withMessage('Fee amount must be a number')
];

/**
 * Validation rules for updating an existing fees group.
 * - classId: required
 * - arr_feeTypes: optional, must be an array if provided
 * - arr_feeTypes.*.str_feeName: optional, must not be empty if provided
 * - arr_feeTypes.*.int_amount: optional, must be a number if provided
 */
export const validateUpdateFeesGroup = [
  body('classId').notEmpty().withMessage('Class ID is required'),
  body('arr_feeTypes').optional().isArray(),
  body('arr_feeTypes.*.str_feeName').optional().notEmpty().withMessage('Fee name is required'),
  body('arr_feeTypes.*.int_amount').optional().isNumeric().withMessage('Fee amount must be a number')
];
