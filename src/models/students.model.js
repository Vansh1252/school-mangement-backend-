import mongoose from "mongoose";
import { collections, statusall } from "../constants/mongoosetableconstants.js";

/**
 * Mongoose schema for the Students collection.
 * - int_idNumber: Unique student ID number (required)
 * - str_name: Student's full name (required)
 * - str_gender: Gender of the student (required, enum: Male/Female)
 * - objectId_classId: Reference to the class the student belongs to (required)
 * - str_dateOfBirth: Date of birth (required)
 * - str_bloodGroup: Blood group (required)
 * - str_religion: Religion (required)
 * - date_admissionDate: Admission date (required)
 * - objectId_parentId: Reference to the parent (required)
 * - str_studentPhoto: Path to student photo (required)
 * - objectId_createdBy: Reference to the user who created the student (required)
 * - objectId_feesGroupId: Reference to the associated fees group (required)
 * - int_totalFees: Total fees for the student (required)
 * - int_paidFees: Total paid fees (default: 0)
 * - int_remaining_fees: Remaining fees to be paid (required)
 * - str_feesStatus: Status of fees (enum: Unpaid/Paid, default: Unpaid)
 * - isdeleted: Soft delete flag (default: false)
 * - timestamps: Automatically adds createdAt and updatedAt fields
 */
const schema = new mongoose.Schema({
    int_idNumber: {
        type: Number,
        required: true,
    },
    str_name: {
        type: String,
        required: true
    },
    str_gender: {
        type: String,
        required: true,
        enum: ["Male", "Female"]
    },
    objectId_classId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: collections.CLASSES
    },
    str_dateOfBirth: {
        type: Date,
        required: true
    },
    str_bloodGroup: {
        type: String,
        required: true
    },
    str_religion: {
        type: String,
        required: true
    },
    date_admissionDate: {
        type: Date,
        required: true
    },
    objectId_parentId: {
        type: mongoose.Types.ObjectId,
        ref: collections.PARENT,
        required: true,
    },
    str_studentPhoto: {
        type: String,
        required: true
    },
    objectId_createdBy: {
        type: mongoose.Types.ObjectId,
        ref: collections.USERS,
        required: true
    },
    objectId_feesGroupId: {
        type: mongoose.Types.ObjectId,
        ref: collections.FEESGROUP,
        required: true
    },
    int_totalFees: {
        type: Number,
        required: true
    },
    int_paidFees: {
        type: Number,
        default: 0
    },
    int_remaining_fees: {
        type: Number,
        required: true
    },
    str_feesStatus: {
        type: String,
        enum: [statusall.UNPAID, statusall.PAID],
        default: statusall.UNPAID,
    },
    isdeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

// Export the Students model
export const studentsmodel = mongoose.model(collections.STUDENTS, schema);

