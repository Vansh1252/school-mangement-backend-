import mongoose from "mongoose";
import { collections, roles, language } from "../constants/mongoosetableconstants.js";
import bcrypt from 'bcrypt';

/**
 * Mongoose schema for the Users collection.
 * - str_schoolName: Name of the school (required)
 * - str_email: User's email address (required)
 * - str_mobileNumber: User's mobile number (required)
 * - str_city: City of the user (required)
 * - str_address: Address of the user (required)
 * - str_username: Unique username (required)
 * - str_password: Hashed password (required)
 * - str_language: Preferred language (enum, required)
 * - str_adminphoto: Path to admin photo (optional)
 * - str_role: User role (enum: admin, teacher, student, parent, required)
 * - objectId_profileId: Reference to the profile document (dynamic refPath)
 * - str_passwordResetToken: Token for password reset (optional)
 * - str_passwordResetExpires: Expiry date for password reset token (optional)
 * - timestamps: Automatically adds createdAt and updatedAt fields
 */
const schema = new mongoose.Schema({
    str_schoolName: {
        type: String,
        required: true
    },
    str_email: {
        type: String,
        required: true
    },
    str_mobileNumber: {
        type: String,
        required: true
    },
    str_city: {
        type: String,
        required: true
    },
    str_address: {
        type: String,
        required: true
    },
    str_username: {
        type: String,
        unique: true,
        required: true
    },
    str_password: {
        type: String,
        required: true
    },
    str_language: {
        type: String,
        enum: [language.ENGLISH, language.FRENCH, language.GUJARATI, language.HINDI],
        required: true
    },
    str_adminphoto: {
        type: String,
    },
    str_role: {
        type: String,
        enum: [roles.ADMIN, roles.TEAHCER, roles.STUDENT, roles.PARENT],
        required: true
    },
    objectId_profileId: {
        type: mongoose.Types.ObjectId,
        refPath: 'str_role'  // Dynamic reference based on role
    },
    str_passwordResetToken: {
        type: String
    },
    str_passwordResetExpires: {
        type: Date
    }
}, { timestamps: true })

// Pre-save hook to hash password if modified
schema.pre("save", async function (next) {
    if (!this.isModified("str_password")) return next();

    this.str_password = await bcrypt.hash(this.str_password, 10)
    next()
});

// Instance method to compare passwords
schema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

// Export the Users model
export const usersmodel = mongoose.model(collections.USERS, schema);