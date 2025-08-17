import mongoose from "mongoose";
import { collections } from "../constants/mongoosetableconstants.js";

/**
 * Mongoose schema for the Subjects collection.
 * - str_subjectName: Name of the subject (required)
 * - objectId_teacherId: Reference to the teacher for this subject (required)
 * - arr_classes: Array of class IDs this subject is assigned to (required)
 * - str_days: Days when the subject is taught (required)
 * - objectId_createdBy: Reference to the user who created the subject (required)
 * - isdeleted: Soft delete flag (default: false)
 * - timestamps: Automatically adds createdAt and updatedAt fields
 */
const schema = new mongoose.Schema({
    str_subjectName: {
        type: String,
        required: true
    },
    objectId_teacherId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: collections.TEACHERS
    },
    arr_classes: [
        {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: collections.CLASSES
        }
    ],
    str_days: {
        type: String,
        required: true
    },
    objectId_createdBy: {
        type: mongoose.Types.ObjectId,
        ref: collections.USERS,
        required: true
    },
    isdeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

// Export the Subjects model
export const subjectsmodel = mongoose.model(collections.SUBJECTS, schema);

