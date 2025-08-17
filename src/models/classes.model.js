import mongoose from "mongoose";
import { collections } from "../constants/mongoosetableconstants.js";

/**
 * Mongoose schema for the Classes collection.
 * - str_className: Name of the class (required)
 * - int_grade: Grade/level of the class (required)
 * - objectId_createdBy: Reference to the user who created the class (required)
 * - objectId_feesGroupId: Reference to the associated fees group
 * - isdeleted: Soft delete flag (default: false)
 * - timestamps: Automatically adds createdAt and updatedAt fields
 */
const schema = new mongoose.Schema({
    str_className: {
        type: String,
        required: true
    },
    int_grade: {
        type: Number,
        required: true
    },
    objectId_createdBy: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    objectId_feesGroupId: {
        type: mongoose.Types.ObjectId,
        ref: collections.FEESGROUP
    },
    isdeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Export the Classes model
export const classesmodel = mongoose.model(collections.CLASSES, schema);
