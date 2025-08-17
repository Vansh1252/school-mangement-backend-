import mongoose from "mongoose";
import { collections } from "../constants/mongoosetableconstants.js";

/**
 * Mongoose schema for the Reminders collection.
 * - date_date: Date of the reminder (required)
 * - str_message: Reminder message (required)
 * - str_color: Color code for the reminder (optional)
 * - objectId_createdBy: Reference to the user who created the reminder (required)
 * - isDeleted: Soft delete flag (default: false)
 * - timestamps: Automatically adds createdAt and updatedAt fields
 */
const schema = new mongoose.Schema({
    date_date: {
        type: Date,
        required: true
    },
    str_message: {
        type: String,
        required: true
    },
    str_color: {
        type: String
    },
    objectId_createdBy: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: collections.USERS,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

// Export the Reminders model
export const remindersmodel = mongoose.model(collections.REMINDER, schema);

