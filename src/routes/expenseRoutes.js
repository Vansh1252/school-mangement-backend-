import express from "express";
import { createexpense, deleteexpense, getallexpenseswithpagination, updateexpense, getoneexpense } from "../controllers/expensesControllers.js";
import { createExpenseValidator, updateExpenseValidator } from '../validations/expensevalidations.js';
import { validate } from '../middleware/validate.js';
import { roles } from "../constants/mongoosetableconstants.js";
import { auth } from '../middleware/auth.js';
import { allowAccess } from '../middleware/authorizeRoles.js';

const router = express.Router();

// Route to create a new expense (admin only)
router.post("/create", auth, allowAccess(roles.ADMIN), createExpenseValidator, validate, createexpense);

// Route to get all expenses with pagination (admin only)
router.get("/", auth, allowAccess(roles.ADMIN), getallexpenseswithpagination);

// Route to get details of a single expense by ID (admin only)
router.get("/details/:id", auth, allowAccess(roles.ADMIN), getoneexpense);

// Route to update an expense by ID (admin only)
router.put("/update/:id", auth, allowAccess(roles.ADMIN), updateExpenseValidator, validate, updateexpense);

// Route to delete an expense by ID (admin only)
router.delete("/delete/:id", auth, allowAccess(roles.ADMIN), deleteexpense);

export default router;
