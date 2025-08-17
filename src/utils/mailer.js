// Utility for sending password reset emails using Nodemailer and bcrypt

import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PasswordResetModel } from '../models/passwordReset.models.js'; // your reset token model
import dotenv from 'dotenv';
dotenv.config();

/**
 * Nodemailer transporter configuration using Gmail.
 * Uses AUTH_EMAIL and AUTH_PASS from environment variables.
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error('Nodemailer error:', error);
  } else if (success) {
    console.log('Nodemailer ready to send emails');
  }
});

/**
 * Sends a password reset email to the user.
 * - Generates a unique reset token and saves it (hashed) in the database.
 * - Sends an email with a reset link to the user's email address.
 * @param {Object} user - The user object (must contain _id and str_email)
 * @returns {Object} Result of the email sending operation
 */
export async function sendForgotPasswordEmail(user) {
  const { _id, str_email } = user;
  const resetUrl = process.env.CORS_ORIGIN || 'http://localhost:3000/';
  const resetToken = uuidv4() + _id;

  try {
    const hashedToken = await bcrypt.hash(resetToken, 10);

    const newReset = new PasswordResetModel({
      userId: _id,
      resetToken: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 1 * 60 * 60 * 1000, // 1 hour expiry
    });

    await newReset.save();

    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: str_email,
      subject: 'Reset Your Password',
      html: `
        <p>You requested to reset your password.</p>
        <p>This link <b>expires in 1 hour</b>.</p>
        <p><a href="${resetUrl}/reset-password/${_id}/${resetToken}">Click here</a>to reset your password.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return { success: true };
  } catch (error) {
    console.error('sendForgotPasswordEmail error:', error);
    return { success: false, error: 'Failed to send password reset email.' };
  }
}
