import mongoose from "mongoose";
import { collections } from "../constants/mongoosetableconstants.js";

/**
 * Mongoose schema for the Teachers collection.
 * - str_firstName: Teacher's first name (required)
 * - str_lastName: Teacher's last name (required)
 * - str_gender: Gender of the teacher (required, enum: Male/Female)
 * - date_dateOfBirth: Date of birth (required)
 * - str_bloodGroup: Blood group (required)
 * - str_religion: Religion (required)
 * - str_email: Teacher's email address (required)
 * - str_phoneNumber: Teacher's phone number (required)
 * - objectId_classId: Reference to the class the teacher is assigned to (required)
 * - str_address: Address of the teacher (required)
 * - date_admissionDate: Date of joining/admission (required)
 * - str_teacherPhoto: Path to teacher's photo (required)
 * - objectId_createdBy: Reference to the user who created the teacher (required)
 * - isdeleted: Soft delete flag (default: false)
 * - timestamps: Automatically adds createdAt and updatedAt fields
 */
const schema = new mongoose.Schema({
    str_firstName: {
        type: String,
        required: true
    },
    str_lastName: {
        type: String,
        required: true
    },
    str_gender: {
        type: String,
        required: true,
        enum: ["Male", "Female"]
    },
    date_dateOfBirth: {
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
    str_email: {
        type: String,
        required: true
    },
    str_phoneNumber: {
        type: String,
        required: true
    },
    objectId_classId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: collections.CLASSES
    },
    str_address: {
        type: String,
        required: true
    },
    date_admissionDate: {
        type: Date,
        required: true
    },
    str_teacherPhoto: {
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

// Export the Teachers model
export const teachersmodel = mongoose.model(collections.TEACHERS, schema);

