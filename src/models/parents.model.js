import mongoose from "mongoose";
import { collections } from "../constants/mongoosetableconstants.js";

/**
 * Mongoose schema for the Parents collection.
 * - str_fatherName: Father's name (required)
 * - str_motherName: Mother's name (required)
 * - str_email: Parent's email address (required)
 * - str_phoneNumber: Parent's phone number (required)
 * - str_fatherOccupation: Father's occupation (required)
 * - str_address: Parent's address (required)
 * - isdeleted: Soft delete flag (default: false)
 * - timestamps: Automatically adds createdAt and updatedAt fields
 */
const schema = new mongoose.Schema({
    str_fatherName: {
        type: String,
        required: true
    },
    str_motherName: {
        type: String,
        required: true
    },
    str_email: {
        type: String,
        required: true
    },
    str_phoneNumber: {
        type: String,
        required: true
    },
    str_fatherOccupation: {
        type: String,
        required: true
    },
    str_address: {
        type: String,
        required: true
    },
    isdeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

// Export the Parents model
export const parentsmodel = mongoose.model(collections.PARENT, schema);

