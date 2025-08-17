import { body } from "express-validator";

/**
 * Validation rules for creating a new expense.
 * - name: required, at least 2 characters
 * - expenseType: required
 * - status: required, must be "Unpaid" or "Paid"
 * - amount: required, must be a number
 * - phone: optional, must be a valid mobile phone if provided
 * - email: optional, must be a valid email if provided
 * - dueDate: optional, must be a valid ISO8601 date if provided
 */
export const createExpenseValidator = [
  body("name")
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  
  body("expenseType")
    .notEmpty().withMessage("Expense Type is required"),

  body("status")
    .notEmpty().withMessage("Status is required")
    .isIn(["Unpaid", "Paid"]).withMessage("Invalid status"),

  body("amount")
    .notEmpty().withMessage("Amount is required")
    .isNumeric().withMessage("Amount must be a number"),

  body("phone")
    .optional()
    .isMobilePhone().withMessage("Invalid phone number"),

  body("email")
    .optional()
    .isEmail().withMessage("Invalid email address"),

  body("dueDate")
    .optional()
    .isISO8601().withMessage("Invalid date format")
];

/**
 * Validation rules for updating an existing expense.
 * - name: optional, at least 2 characters if provided
 * - expenseType: optional
 * - status: optional, must be "Unpaid" or "Paid" if provided
 * - amount: optional, must be a number if provided
 * - phone: optional, must be a valid mobile phone if provided
 * - email: optional, must be a valid email if provided
 * - dueDate: optional, must be a valid ISO8601 date if provided
 */
export const updateExpenseValidator = [
  body("name")
    .optional()
    .isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),

  body("expenseType")
    .optional(),

  body("status")
    .optional()
    .isIn(["Unpaid", "Paid"]).withMessage("Invalid status"),

  body("amount")
    .optional()
    .isNumeric().withMessage("Amount must be a number"),

  body("phone")
    .optional()
    .isMobilePhone().withMessage("Invalid phone number"),

  body("email")
    .optional()
    .isEmail().withMessage("Invalid email address"),

  body("dueDate")
    .optional()
    .isISO8601().withMessage("Invalid date format")
];
