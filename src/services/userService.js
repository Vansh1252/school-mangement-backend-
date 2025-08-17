import { PasswordResetModel } from '../models/passwordReset.models.js'; // your reset token model
import { usersmodel } from "../models/users.model.js";
import { studentsmodel } from '../models/students.model.js';
import { parentsmodel } from '../models/parents.model.js';
import { teachersmodel } from '../models/teachers.model.js';
import { generateToken } from '../utils/genratetoken.js';
import { sendForgotPasswordEmail } from '../utils/mailer.js';
import bcrypt from 'bcrypt';
import { roles } from '../constants/mongoosetableconstants.js';


// createuserservice service register 
export const createuserservice = async (req) => {
  const {
    schoolName,
    email,
    mobileNumber,
    city,
    address,
    username,
    password,
    language,
  } = req.body;

  // Get admin photo if uploaded
  let adminPhoto = null;
  if (req.file) {
    adminPhoto = req.file.filename; // or req.file.path, depending on your multer config
  }

  // Check if email or username already exists (optional, recommended)
  const existingUser = await usersmodel.findOne({
    $or: [{ str_email: email }, { str_username: username }]
  });
  if (existingUser) {
    throw { statusCode: 409, message: "User already exists with given email or username." };
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  const newuser = new usersmodel({
    str_schoolName: schoolName,
    str_email: email,
    str_mobileNumber: mobileNumber,
    str_city: city,
    str_address: address,
    str_username: username,
    str_password: hashedPassword,
    str_language: language,
    str_roles: roles.ADMIN,
    str_adminphoto: `/uploads/${adminPhoto}` // <-- add this line
  });

  const savedUser = await newuser.save();
  return {
    statusCode: 201,
    message: "User created successfully.",
    data: savedUser
  };
};

// login user service code 
export const loginuser = async (req) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw { statusCode: 400, message: "Username or Email and password are required!" };
  }
  // Find user by email or username
  const user = await usersmodel.findOne({
    $or: [
      { str_email: username },
      { str_username: username }
    ]
  });
  if (!user) {
    throw { statusCode: 404, message: "User not found" };
  }

  // Prepare payload and generate JWT
  const payload = {
    id: user._id,
    role: user.str_role,
    schoolName: user.str_schoolName,
    city: user.str_city
  };
  const token = generateToken(payload);

  let profile_photo;
  let profile;
  switch (user.str_role) {
    case 'student':
      profile = await studentsmodel.findById({ _id: user.objectId_profileId });
      profile_photo = profile?.str_studentPhoto || null;
      break;
    case 'teacher':
      profile = await teachersmodel.findById({ _id: user.objectId_profileId });
      profile_photo = profile?.str_teacherPhoto || null;
      break;
    case 'parent':
      profile = await parentsmodel.findById({ _id: user.objectId_profileId });
      profile_photo = profile?.str_parentPhoto || null;
      break;
    case 'admin':
      profile = null; // Admin has no separate profile
      profile_photo = user.str_adminphoto || null;
      break;
  }
  let userobject = {
    id: user._id,
    username: user.str_username,
    email: user.str_email,
    role: user.str_role,
  }
  return {
    statusCode: 200,
    message: "Login successful!",
    profile,
    userobject,
    profile_photo,
    token
  };
};

// forgot password logic
export async function forgotPasswordService(email) {
  const user = await usersmodel.findOne({ str_email: email });
  if (!user) {
    throw { statusCode: 404, message: 'User with this email not found.' };
  }

  const emailResult = await sendForgotPasswordEmail(user);

  if (!emailResult.success) {
    throw { statusCode: 500, message: emailResult.error };
  }

  return { message: 'Password reset email sent. Please check your inbox.' };
}


// resetpassword service 
export async function resetPasswordService(userId, token, newPassword) {
  const resetRecord = await PasswordResetModel.findOne({ userId });
  if (!resetRecord) {
    throw { statusCode: 400, message: 'Invalid or expired password reset token.' };
  }
  // Check if token expired
  if (resetRecord.expiresAt < Date.now()) {
    await PasswordResetModel.deleteOne({ userId });
    throw { statusCode: 400, message: 'Password reset token expired.' };
  }
  const isValidToken = await bcrypt.compare(token, resetRecord.resetToken);
  if (!isValidToken) {
    throw { statusCode: 400, message: 'Invalid password reset token.' };
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update user password
  await usersmodel.findByIdAndUpdate(userId, { str_password: hashedPassword });

  // Delete used reset token record
  await PasswordResetModel.deleteOne({ userId });

  return { message: 'Password successfully reset.' };
}

export const userdata = async (req) => {
  const userId = req.user?.id;
  if (!userId) {
    throw { statusCode: 401, message: "Unauthorized request" };
  }
  const userdata = await usersmodel.findById(userId);
  if (!userdata) {
    throw { statusCode: 400, message: "resgister admin" };
  }
  return { statusCode: 200, message: "users fetched successfully", userdata };

}

export const getalluserdetail = async (req) => {
  const userId = req.user?.id;
  if (!userId) {
    throw { statusCode: 401, message: "Unauthorized request" };
  }

  // Find the user in the users collection
  const user = await usersmodel.findById(userId).lean();
  if (!user) {
    throw { statusCode: 404, message: "User not found" };
  }

  let profile = null;
  let profile_photo = null;

  // Fetch profile details and photo based on role
  switch (user.str_role) {
    case 'student':
      profile = await studentsmodel.findById(user.objectId_profileId).populate('objectId_classId', 'int_grade').lean();
      profile_photo = profile?.str_studentPhoto || null;
      break;
    case 'teacher':
      profile = await teachersmodel.findById(user.objectId_profileId).populate('objectId_classId', 'int_grade').lean();
      profile_photo = profile?.str_teacherPhoto || null;
      break;
    case 'parent':
      profile = await parentsmodel.findById(user.objectId_profileId).populate('objectId_classId', 'int_grade').lean();
      profile_photo = profile?.str_parentPhoto || null;
      break;
    case 'admin':
      // For admin, photo is in the user document
      profile_photo = user.str_adminphoto || null;
      break;
    default:
      throw { statusCode: 400, message: "Invalid user role" };
  }
  // Combine user and profile info, and add profile_photo
  return {
    statusCode: 200,
    message: "User details fetched successfully",
    user: {
      ...user,
      profile,
      profile_photo
    }
  };
}

export const updateProfilePhotoService = async (req) => {
  const userId = req.user?.id;
  if (!userId) {
    throw { statusCode: 401, message: "Unauthorized request" };
  }
  if (!req.file) {
    throw { statusCode: 400, message: "No photo uploaded" };
  }

  // Get the filename or path as per your multer config
  const photoPath = `/uploads/${req.file.filename}`;

  // Find the user and check role
  const user = await usersmodel.findById(userId);
  if (!user) {
    throw { statusCode: 404, message: "User not found" };
  }

  let updatedProfile = null;

  switch (user.str_role) {
    case 'student':
      updatedProfile = await studentsmodel.findByIdAndUpdate(
        user.objectId_profileId,
        { str_studentPhoto: photoPath },
        { new: true }
      );
      break;
    case 'teacher':
      updatedProfile = await teachersmodel.findByIdAndUpdate(
        user.objectId_profileId,
        { str_teacherPhoto: photoPath },
        { new: true }
      );
      break;
    case 'admin':
      updatedProfile = await usersmodel.findByIdAndUpdate(
        userId,
        { str_adminphoto: photoPath },
        { new: true }
      );
      break;
    default:
      throw { statusCode: 400, message: "Invalid user role" };
  }

  return {
    statusCode: 200,
    message: "Profile photo updated successfully",
    profile_photo: photoPath,
    updatedProfile
  };
};

