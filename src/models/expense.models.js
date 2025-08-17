import mongoose from "mongoose";
import { collections, statusall } from "../constants/mongoosetableconstants.js";

/**
 * Mongoose schema for the Expenses collection.
 * - str_name: Name of the expense (required)
 * - str_expenseType: Type/category of the expense (required)
 * - str_status: Status of the expense (Paid/Unpaid, required, enum)
 * - num_amount: Amount of the expense (required)
 * - str_phone: Contact phone number (required)
 * - str_email: Contact email (required)
 * - date_dueDate: Due date for the expense (required)
 * - objectId_createdBy: Reference to the user who created the expense
 * - isdeleted: Soft delete flag (default: false)
 * - timestamps: Automatically adds createdAt and updatedAt fields
 */
const schema = new mongoose.Schema({
    str_name: {
        type: String,
        required: true
    },
    str_expenseType: {
        type: String,
        required: true
    },
    str_status: {
        type: String,
        required: true,
        enum: [statusall.UNPAID, statusall.PAID]
    },
    num_amount: {
        type: Number,
        required: true
    },
    str_phone: {
        type: String,
        required: true
    },
    str_email: {
        type: String,
        required: true
    },
    date_dueDate: {
        type: Date,
        required: true
    },
    objectId_createdBy: {
        type: mongoose.Types.ObjectId,
        ref: collections.USERS
    },
    isdeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Export the Expenses model
export const expensemodel = mongoose.model(collections.EXPENSES, schema);