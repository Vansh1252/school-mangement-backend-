import { teachersmodel } from '../models/teachers.model.js';
import { collections, roles } from "../constants/mongoosetableconstants.js";
import { usersmodel } from '../models/users.model.js';

/**
 * Service to create a new teacher.
 * Checks for duplicate email or phone number, saves teacher and user records.
 */
export const createteacherservice = async (req) => {
  const {
    username, password,
    firstName, lastName, gender, dateOfBirth, bloodGroup,
    religion, email, phoneNumber, classId,
    address, admissionDate
  } = req.body;

  const userId = req.user?.id;
  if (!userId) throw { statusCode: 401, message: "Unauthorized request" };

  if (!req.file || !req.file.filename) {
    throw { statusCode: 400, message: "Teacher photo is required" };
  }
  const issameemail = await teachersmodel.findOne({
    $or: [
      { str_email: email },
      { str_phoneNumber: phoneNumber }
    ]
  });
  if (issameemail !== null && issameemail != undefined) {
    throw { statusCode: 400, message: "email or phoneNumber is used...!" };
  }
  const teacherPhoto = req.file.filename.split('/').pop().split('.').slice(0, -1).join('.');
  const lastTeacher = await teachersmodel.findOne().sort({ int_idNumber: -1 });
  const nextId = lastTeacher ? lastTeacher.int_idNumber + 1 : 1;

  const teacher = new teachersmodel({
    int_idNumber: nextId,
    str_firstName: firstName,
    str_lastName: lastName,
    str_gender: gender,
    date_dateOfBirth: dateOfBirth,
    str_bloodGroup: bloodGroup,
    str_religion: religion,
    str_email: email,
    str_phoneNumber: phoneNumber,
    objectId_classId: classId,
    str_address: address,
    date_admissionDate: admissionDate,
    str_teacherPhoto: `${teacherPhoto}`,
    objectId_createdBy: userId
  });

  await teacher.save();

  const userteacher = new usersmodel({
    str_schoolName: req.user.schoolName,
    str_email: email,
    str_mobileNumber: phoneNumber,
    str_city: req.user.city,
    str_address: address,
    str_username: username,
    str_password: password,
    str_language: "hindi",
    str_role: roles.TEAHCER,
    objectId_profileId: teacher._id
  });

  await userteacher.save();

  return { statusCode: 201, message: "Teacher added successfully" };
};

/**
 * Service to update a teacher by ID.
 * Checks for duplicate email or phone number, updates teacher fields.
 */
export const updateteacherservice = async (teacherId, req) => {
  const {
    firstName, lastName, gender, dateOfBirth, bloodGroup,
    religion, email, phoneNumber,
    address, admissionDate
  } = req.body;

  const userId = req.user?.id;
  if (!userId) throw { statusCode: 401, message: "Unauthorized request" };
  const issameemail = await teachersmodel.findOne({
    $or: [
      { str_email: email },
      { str_phoneNumber: phoneNumber }
    ],
    _id: { $ne: teacherId }
  });
  if (issameemail !== null && issameemail != undefined) {
    throw { statusCode: 400, message: "email or phoneNumber is used...!" };
  }
  const teacher = await teachersmodel.findById(teacherId);
  if (!teacher) throw { statusCode: 404, message: "Teacher not found" };

  let teacherPhotoPath = teacher.str_teacherPhoto; // keep old photo by default
  if (req.file) {
    const filenameWithoutExt = req.file.filename.split('.').slice(0, -1).join('.');
    teacherPhotoPath = `/uploads/${filenameWithoutExt}.png`;
  }

  Object.assign(teacher, {
    str_firstName: firstName,
    str_lastName: lastName,
    str_gender: gender,
    date_dateOfBirth: dateOfBirth,
    str_bloodGroup: bloodGroup,
    str_religion: religion,
    str_email: email,
    str_phoneNumber: phoneNumber,
    str_address: address,
    date_admissionDate: admissionDate,
    str_teacherPhoto: teacherPhotoPath, // FIXED: no extra `/uploads/`
  });

  await teacher.save();

  return { statusCode: 200, message: "Teacher updated successfully", teacher };
};

/**
 * Service to get all teachers with pagination and optional filters.
 * Supports filtering by first name and class ID.
 */
export const getteacherservice = async (req) => {
  const { page = 1, limit = 10, name = '', classId = '' } = req.query;
  // const userId = req.user?.id;
  // if (!userId) throw { statusCode: 401, message: "Unauthorized request" };

  const currentPage = parseInt(page);
  const itemsPerPage = parseInt(limit);

  const filter = { isdeleted: false };
  if (name) {
    filter.str_firstName = { $regex: name, $options: 'i' };
  }
  if (classId) {
    filter.objectId_classId = classId;
  }

  const total = await teachersmodel.countDocuments(filter);
  const getTeacherData = await teachersmodel.find(filter)
    .populate('objectId_classId', 'int_grade')
    .select('str_firstName str_lastName str_gender str_address str_email str_phoneNumber')
    .skip((currentPage - 1) * itemsPerPage)
    .limit(itemsPerPage)
    .sort({ createdAt: -1 })
    .lean();

  return {
    statusCode: 200,
    getTeacherData,
    currentPage,
    totalPages: Math.ceil(total / itemsPerPage),
    totalRecords: total
  };
};

/**
 * Service to get a single teacher by ID.
 * Requires user authentication.
 */
export const getoneteacher = async (teacherId, req) => {
  const userId = req.user?.id;
  if (!userId) throw { statusCode: 401, message: "Unauthorized request" };

  const teacher = await teachersmodel.findById(teacherId);
  if (!teacher) throw { statusCode: 404, message: "Teacher not found" };

  return { statusCode: 200, data: teacher };
};

/**
 * Service to soft delete a teacher by ID.
 * Sets isdeleted to true instead of removing the document.
 */
export const deleteteacher = async (teacherId, req) => {
  const userId = req.user?.id;
  if (!userId) throw { statusCode: 401, message: "Unauthorized request" };

  const teacher = await teachersmodel.findByIdAndUpdate(
    teacherId,
    { isdeleted: true },
    { new: true }
  );
  if (!teacher) throw { statusCode: 404, message: "Teacher not found" };

  return { statusCode: 200, message: "Teacher deleted successfully" };
};

/**
 * Service to get all teachers without pagination (for dropdowns, etc.).
 * Returns only the first name, sorted by creation date.
 */
export const getonewithoutpagination = async (req) => {
  const userId = req.user?.id;
  if (!userId) {
    throw { statusCode: 401, message: "Unauthorized request" };
  }
  const teacher = await teachersmodel.find().select('str_firstName').sort({ createdAt: -1 })
  if (teacher.length < 1) {
    throw { statusCode: 404, message: "No teaccher found...!" };
  }
  return { statusCode: 200, teacher }
}