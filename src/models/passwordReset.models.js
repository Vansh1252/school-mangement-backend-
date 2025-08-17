import mongoose from 'mongoose';
import { collections } from '../constants/mongoosetableconstants.js';

/**
 * Mongoose schema for the Password Reset collection.
 * - userId: Reference to the user requesting password reset (required)
 * - resetToken: The token sent to the user for password reset (required)
 * - createdAt: When the reset token was created (required, defaults to now)
 * - expiresAt: When the reset token expires (required)
 * 
 * The schema uses a TTL index on expiresAt to automatically remove expired tokens.
 */
const passwordResetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    resetToken: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
});

// TTL index to automatically delete expired password reset tokens
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Export the PasswordReset model
export const PasswordResetModel = mongoose.model(collections.PASSWORDRESET, passwordResetSchema);

