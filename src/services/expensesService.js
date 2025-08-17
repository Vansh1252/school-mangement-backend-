import { expensemodel } from '../models/expense.models.js';
import { collections, statusall } from "../constants/mongoosetableconstants.js";

/**
 * Service to create a new expense.
 * Requires user authentication and expense details in the request body.
 */
export const createexpenseservice = async (req) => {
    const { name, expenseType, status, amount, phone, email, dueDate } = req.body;
    const userId = req.user?.id;
    if (!userId) {
        throw { statusCode: 401, message: "Unauthorized request" };
    }
    const newExpense = new expensemodel({
        str_name: name,
        str_expenseType: expenseType,
        str_status: status,
        num_amount: amount,
        str_phone: phone,
        str_email: email,
        date_dueDate: dueDate,
        objectId_createdBy: userId
    });

    await newExpense.save();
    return { statusCode: 201, message: "Expense created successfully" };
};

/**
 * Service to update an existing expense by ID.
 * Requires user authentication and updated expense details in the request body.
 */
export const updateexpenseservice = async (req) => {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) {
        throw { statusCode: 401, message: "Unauthorized request" };
    }
    const { amount, dueDate, email, expenseType, name, phone, status } = req.body;
    const updated = await expensemodel.findByIdAndUpdate(id, {
        num_amount: amount,
        str_email: email,
        date_dueDate: dueDate,
        str_expenseType: expenseType,
        str_status: status,
        str_name: name,
        str_phone: phone,
    }, { new: true });
    if (!updated) throw { statusCode: 404, message: "Expense not found" };
    return { statusCode: 200, message: "Expense updated successfully" };
};

/**
 * Service to get all expenses with pagination and optional filters.
 * Supports filtering by name, expense type, and status.
 */
export const getallexpensesservice = async (req) => {
    const { page = 1, limit = 10, name = '', expenseType = '', status } = req.query;

    const userId = req.user?.id;
    if (!userId) {
        throw { statusCode: 401, message: "Unauthorized request" };
    }
    const currentPage = parseInt(page);
    const itemsPerPage = parseInt(limit);

    const filter = { isdeleted: false };
    if (name) {
        filter.str_name = { $regex: name, $options: 'i' };
    }
    if (expenseType) {
        filter.str_expenseType = { $regex: expenseType, $options: 'i' };
    }
    if (status) {
        filter.str_status = status;
    }
    const total = await expensemodel.countDocuments(filter);
    const expenses = await expensemodel.find(filter)
        .select('str_name str_expenseType str_status num_amount str_phone str_email date_dueDate')
        .skip((currentPage - 1) * itemsPerPage)
        .limit(itemsPerPage)
        .sort({ createdAt: -1 })
        .lean();
    return {
        statusCode: 200,
        expenses,
        currentPage,
        totalPages: Math.ceil(total / itemsPerPage),
        totalRecords: total
    };
};

/**
 * Service to get a single expense by ID.
 * Requires user authentication.
 */
export const getoneExpenese = async (expenseId, req) => {
    const userId = req.user?.id;
    if (!userId) {
        throw { statusCode: 401, message: "Unauthorized request" };
    }
    const expensedetails = await expensemodel.findById(expenseId);
    if (!expensedetails) {
        throw { statusCode: 400, message: "expense not found" }
    }
    return { statusCode: 200, expensedetails };
};

/**
 * Service to soft delete an expense by ID.
 * Sets isdeleted to true instead of removing the document.
 */
export const deleteexpenseservice = async (req) => {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) {
        throw { statusCode: 401, message: "Unauthorized request" };
    }
    const deleted = await expensemodel.findByIdAndUpdate(id, { isdeleted: true }, { new: true });
    if (!deleted) throw { statusCode: 404, message: "Expense not found" };
    return { statusCode: 200, message: "Expense deleted successfully" };
};