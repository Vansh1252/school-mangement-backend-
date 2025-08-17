import mongoose from "mongoose";
import { collections } from '../constants/mongoosetableconstants.js';

/**
 * Mongoose schema for the Fees Group collection.
 * - objectId_classId: Reference to the class this fee group belongs to (required)
 * - arr_feeTypes: Array of fee types (each with name and amount, both required)
 * - str_description: Optional description for the fee group
 * - timestamps: Automatically adds createdAt and updatedAt fields
 */
const schema = new mongoose.Schema({
    objectId_classId: {
        type: mongoose.Types.ObjectId,
        ref: collections.CLASSES,
        required: true
    },
    arr_feeTypes: [
        {
            str_feeName: {
                type: String,
                required: true
            },
            int_amount: {
                type: Number,
                required: true
            }
        }
    ],
    str_description: {
        type: String,
    }
}, { timestamps: true });

// Export the Fees Group model
export const feesgroupsmodel = mongoose.model(collections.FEESGROUP, schema);