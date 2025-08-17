import mongoose from "mongoose";
import { collections } from "../constants/mongoosetableconstants.js";

/**
 * Mongoose schema for the Events collection.
 * - str_title: Title of the event (required)
 * - str_description: Description of the event (optional)
 * - date_date: Date of the event (required)
 * - objectId_createdBy: Reference to the user who created the event (required)
 * - isDeleted: Soft delete flag (default: false)
 * - timestamps: Automatically adds createdAt and updatedAt fields
 */
const schema = new mongoose.Schema({
    str_title: {
        type: String,
        required: true
    },
    str_description: {
        type: String
    },
    date_date: {
        type: Date,
        required: true
    },
    objectId_createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: collections.USERS,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Export the Events model
export const eventsmodel = mongoose.model(collections.EVENTS, schema);

