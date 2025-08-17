import { studentsmodel } from '../models/students.model.js';
import { parentsmodel } from '../models/parents.model.js';
import { usersmodel } from '../models/users.model.js';
import { feesgroupsmodel } from '../models/feesgroup.models.js';
import { classesmodel } from '../models/classes.model.js';
import { collections, roles, statusall } from "../constants/mongoosetableconstants.js";

// Create a new student and associated parent
export const createstudent = async (req) => {
    const {
        name, gender, classId, dateOfBirth, bloodGroup,
        religion, admissionDate, fatherName, motherName,
        email, phoneNumber, fatherOccupation, address, username, password
    } = req.body;

    const userId = req.user?.id;
    if (!userId) {
        throw { statusCode: 401, message: "Unauthorized request" };
    }
    const issameemail = await parentsmodel.findOne({
        $or: [
            { str_email: email },
            { str_phoneNumber: phoneNumber }
        ]
    });
    if (issameemail !== null && issameemail != undefined) {
        throw { statusCode: 400, message: "email or phoneNumber is used...!" };
    }
    const studentphoto = req.file.filename.split('/').pop().split('.').slice(0, -1).join('.');
    const laststudent = await studentsmodel.findOne().sort({ int_idNumber: -1 });
    const nextId = laststudent ? laststudent.int_idNumber + 1 : 1;
    // ✅ Step 1: Get fees group for the selected class
    const classData = await classesmodel.findById(classId);
    if (!classData) {
        throw { statusCode: 404, message: "Class not found" };
    }

    // Assuming class model has a reference like `objectId_feesGroupId`
    const feesGroupId = classData.objectId_feesGroupId;
    if (!feesGroupId) {
        throw { statusCode: 400, message: "No fees group assigned to this class" };
    }

    const feesGroup = await feesgroupsmodel.findById(feesGroupId);
    if (!feesGroup) {
        throw { statusCode: 404, message: "Fees group not found" };
    }

    // ✅ Step 2: Calculate total fees
    const totalFees = feesGroup.arr_feeTypes.reduce((sum, fee) => sum + fee.int_amount, 0);

    // Create parent
    const parent = await parentsmodel.create({
        str_fatherName: fatherName,
        str_motherName: motherName,
        str_email: email,
        str_phoneNumber: phoneNumber,
        str_fatherOccupation: fatherOccupation,
        str_address: address
    });
    const parentuser = new usersmodel({
        str_schoolName: req.user.schoolName,
        str_email: email,
        str_mobileNumber: phoneNumber,
        str_city: req.user.city,
        str_address: address,
        str_username: fatherName,
        str_password: password,
        str_language: "hindi",
        str_role: roles.PARENT,
        objectId_profileId: parent._id
    });
    await parentuser.save();
    // ✅ Step 3: Create student with fee info
    const student = await studentsmodel.create({
        int_idNumber: nextId,
        str_name: name,
        str_gender: gender,
        objectId_classId: classId,
        str_dateOfBirth: new Date(dateOfBirth),
        str_bloodGroup: bloodGroup,
        str_religion: religion,
        date_admissionDate: new Date(admissionDate),
        objectId_parentId: parent._id,
        str_studentPhoto: `/uploads/${studentphoto}.png`,
        objectId_createdBy: userId,
        // ✅ Add these new fields
        objectId_feesGroupId: feesGroupId,
        int_totalFees: totalFees,
        int_paidFees: 0,
        int_remaining_fees: totalFees
    });

    const studentuser = await usersmodel.create({
        str_schoolName: req.user.schoolName,
        str_email: email,
        str_mobileNumber: phoneNumber,
        str_city: req.user.city,
        str_address: address,
        str_username: username,
        str_password: password,
        str_language: "hindi",
        str_role: roles.STUDENT,
        objectId_profileId: student._id
    });
    return {
        statusCode: 201,
        message: "Student and parent created successfully",
    };
};

export const updateStudentService = async (studentId, req) => {
    const {
        str_name, str_gender, objectId_classId, str_dateOfBirth,
        str_bloodGroup, str_religion, date_admissionDate
    } = req.body;

    const userId = req.user?.id;
    if (!userId) {
        throw { statusCode: 401, message: "Unauthorized request" };
    }
    const student = await studentsmodel.findById(studentId);
    if (!student) {
        throw { statusCode: 404, message: "Student not found" };
    }

    // Update required fields
    student.str_name = str_name;
    student.str_gender = str_gender;
    student.objectId_classId = objectId_classId;
    student.str_dateOfBirth = str_dateOfBirth;
    student.str_bloodGroup = str_bloodGroup;
    student.str_religion = str_religion;
    student.date_admissionDate = date_admissionDate;

    // Update photo only if new file uploaded in req.file (handled by multer)
    if (req.file) {
        // Assume file is saved with correct path and extension
        const filenameWithoutExt = req.file.filename.split('.').slice(0, -1).join('.');
        student.str_studentPhoto = `/uploads/${filenameWithoutExt}.png`;
    }
    // else keep old photo as is

    await student.save();

    return { statusCode: 200, message: "Student updated successfully", student };
};

// Get all students with filters and pagination
export const getStudentsService = async (req) => {
    const { page = 1, limit = 10, name = '', classId = '', status = '' } = req.query;

    const userId = req.user?.id;
    if (!userId) {
        throw { statusCode: 401, message: "Unauthorized request" };
    }

    const currentPage = parseInt(page);
    const itemsPerPage = parseInt(limit);

    const filter = { isdeleted: false };
    if (name) {
        filter.str_name = { $regex: name, $options: 'i' };
    }
    if (classId) {
        filter.objectId_classId = classId;
    }
    if (status) {
        filter.str_feesStatus = status;
    }

    const total = await studentsmodel.countDocuments(filter);

    const getstudentdata = await studentsmodel.find(filter)
        .populate("objectId_parentId", 'str_fatherName str_phoneNumber str_address str_email')
        .populate('objectId_classId', 'int_grade')
        .select('int_idNumber str_name str_gender objectId_classId str_dateOfBirth int_totalFees str_feesStatus')
        .skip((currentPage - 1) * itemsPerPage)
        .limit(itemsPerPage)
        .sort({ createdAt: 1 })
        .lean();

    return {
        statusCode: 200,
        getstudentdata,
        currentPage,
        totalPages: Math.ceil(total / itemsPerPage),
        totalRecords: total
    };
};

// Get single student by ID
export const getonestudent = async (studentId, req) => {
    try {
        // Validate the student ID
        if (!studentId) {
            return {
                statusCode: 400,
                data: { message: "Student ID is required" }
            };
        }
        // Find the student by ID and populate related data
        const student = await studentsmodel.findById(studentId)
            .populate('objectId_classId', 'int_grade name')
            .populate('objectId_parentId', 'str_fatherName str_motherName')
            .lean();
        // Check if student exists
        if (!student) {
            return {
                statusCode: 404,
                data: { message: "Student not found" }
            };
        }
        // Return success response
        return {
            statusCode: 200,
            data: {
                data: student,
                message: "Student details retrieved successfully"
            }
        };
    } catch (error) {
        console.error('Error in getonestudent service:', error);
        throw {
            statusCode: error.statusCode || 500,
            message: error.message || "Error fetching student details"
        };
    }
};

// Soft delete a student
export const deletestudentservices = async (studentId, req) => {
    const userId = req.user?.id;
    if (!userId) {
        throw { statusCode: 401, message: "Unauthorized request" };
    }

    const student = await studentsmodel.findByIdAndUpdate(
        studentId,
        { isdeleted: true },
        { new: true }
    );

    if (!student) {
        throw { statusCode: 404, message: "Student not found" };
    }

    return { statusCode: 200, message: "Student deleted successfully" };
};


// student list without pagination
export const getonewithoutpagination = async (req) => {
    const userId = req.user?.id;
    if (!userId) {
        throw { statusCode: 401, message: "Unauthorized request" };
    }
    const studentname = await studentsmodel.find().select('str_name').sort({ createdAt: -1 })
    if (studentname.length < 1) {
        throw { statusCode: 404, message: "No student found...!" };
    }
    return { statusCode: 200, message: "Student fetched successfully", studentname }
}

// student promtion service code 

export const promoteStudentService = async (req) => {
    const { studentId, fromClassId, toClassId } = req.body;
    const userId = req.user?.id;
    if (!userId) {
        throw { statusCode: 401, message: "Unauthorized request" };
    }
    const student = await studentsmodel.findOne({ _id: studentId, isdeleted: false });
    if (!student) throw { statusCode: 404, message: "Student not found" };

    // Check if student is in the correct class
    if (student.objectId_classId.toString() !== fromClassId) {
        throw { statusCode: 400, message: "Student is not in the given current class" };
    }

    // Fetch current and target class details
    const fromClass = await classesmodel.findById(fromClassId).lean();
    const toClass = await classesmodel.findById(toClassId).lean();

    if (!fromClass || !toClass) {
        throw { statusCode: 404, message: "Class not found" };
    }

    // Prevent promotion to a lower or same class
    if (toClass.int_grade <= fromClass.int_grade) {
        throw { statusCode: 400, message: "Cannot promote to the same or a lower class." };
    }

    // Check if all fees are paid for the current class
    if (student.int_remaining_fees > 0) {
        throw { statusCode: 400, message: "Student has not paid full fees. Promotion not allowed." };
    }

    // Get new class's fee group
    if (!toClass.objectId_feesGroupId) {
        throw { statusCode: 404, message: "New class fee group not found" };
    }
    const newFeeGroup = await feesgroupsmodel.findById(toClass.objectId_feesGroupId).lean();
    if (!newFeeGroup || !newFeeGroup.arr_feeTypes) {
        throw { statusCode: 404, message: "New class fee group not found" };
    }

    // Calculate new total fees
    const newTotalFees = newFeeGroup.arr_feeTypes.reduce((sum, fee) => sum + (fee.int_amount || 0), 0);

    // Promote student and reset fees
    student.objectId_classId = toClassId;
    student.objectId_feesGroupId = toClass.objectId_feesGroupId;
    student.int_totalFees = newTotalFees;
    student.int_paidFees = 0;
    student.int_remaining_fees = newTotalFees;
    student.str_feesStatus = statusall.UNPAID;
    await student.save();

    return { statusCode: 200, message: "Student promoted successfully." };
};


// Update student fees
export const studentfeespaidupdate = async (studentId, req) => {
    const userId = req.user?.id;
    const { total_fees, paidfees, remaining_fees, status } = req.body;
    console.log(`total fees : ${total_fees}`);
    console.log(`paid fees : ${paidfees}`);
    
    // Validate request
    if (!userId) {
        throw { statusCode: 401, message: "Unauthorized request" };
    }

    // Validate fees amounts
    if (remaining_fees > total_fees) {
        throw { statusCode: 400, message: "Remaining fees cannot be greater than total fees" };
    }

    if (paidfees > total_fees) {
        throw { statusCode: 400, message: "Paid fees cannot be greater than total fees" };
    }

    if (total_fees < 0 || paidfees < 0 || remaining_fees < 0) {
        throw { statusCode: 400, message: "Fees amounts cannot be negative" };
    }

    // Update student fees
    const student = await studentsmodel.findByIdAndUpdate(
        studentId,
        {
            int_totalFees: total_fees,
            int_paidFees: paidfees,
            int_remaining_fees: remaining_fees,
            str_feesStatus: status
        },
        { new: true } // Return updated document
    );

    if (!student) {
        throw { statusCode: 404, message: "Student not found" };
    }

    return {
        statusCode: 200,
        message: "Student fees updated successfully",
        data: {
            totalFees: student.int_totalFees,
            paidFees: student.int_paidFees,
            remainingFees: student.int_remaining_fees,
            status: student.str_feesStatus
        }
    };
};

/**
 * Get student fees details by student ID.
 * Returns student name, class, fees details, and fees group.
 */
export const getStudentFeesDetails = async (studentId, req) => {
    const userId = req.user?.id;

    if (!userId) {
        throw { statusCode: 401, message: "Unauthorized request" };
    }

    // Find student and populate class and fees group details
    const student = await studentsmodel.findById(studentId)
        .populate('objectId_classId', 'str_name int_grade')
        .populate('objectId_feesGroupId', 'str_name arr_feeTypes')
        .select('int_totalFees  int_remaining_fees str_feesStatus str_name')
        .lean();

    if (!student) {
        throw { statusCode: 404, message: "Student not found" };
    }

    return {
        statusCode: 200,
        data: {
            studentName: student.str_name,
            class: student.objectId_classId,
            feesDetails: {
                totalFees: student.int_totalFees,
                remainingFees: student.int_remaining_fees,
                status: student.str_feesStatus
            },
            feesGroup: student.objectId_feesGroupId,
        },
        message: "Student fees details retrieved successfully"
    };
};