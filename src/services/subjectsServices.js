import { subjectsmodel } from '../models/subjects.model.js';
import { collections } from "../constants/mongoosetableconstants.js";

/**
 * Service to create a new subject.
 * Requires subject name, teacher, classes, days, and user ID.
 */
export const createsubject = async (req) => {
    const { subjectName, teacherId, classes, days } = req.body;
    const userId = req.user.id;
    if (!userId) throw ({ message: "unauthorized request...!" });
    const subject = new subjectsmodel({
        str_subjectName: subjectName,
        objectId_teacherId: teacherId,
        arr_classes: classes,
        str_days: days,
        objectId_createdBy: userId
    });
    await subject.save();
    return { statusCode: 201, message: "subject added successfully" };
};

/**
 * Service to update an existing subject by ID.
 * Only allows update if user is authorized.
 */
export const updatesubject = async (subjectId, req) => {
    const { subjectName, teacherId, classes, days } = req.body;
    const userId = req.user.id;
    if (!userId) throw ({ message: "unauthorized request...!" });
    const subject = await subjectsmodel.findById(subjectId);
    if (!subject) {
        throw ({ message: "subject not found...!" });
    }
    subject.str_subjectName = subjectName;
    subject.objectId_teacherId = teacherId;
    subject.arr_classes = classes;
    subject.str_days = days;

    await subject.save();
    return { statusCode: 200, message: "subject updated successfully" };
};

/**
 * Service to get a single subject by ID.
 * Requires user authentication.
 */
export const getonesubject = async (subjectId, req) => {
    const userId = req.user?.id;
    if (!userId) throw { statuscode: 401, message: "unauzthorized>...!" };
    const subject = await subjectsmodel.findById(subjectId);
    if (!subject) throw { statusCode: 404, message: "subject not found" };
    return { statusCode: 200, message: "subject fetched successfully", subject };
}

/**
 * Service to get all subjects with pagination and optional filters.
 * Supports filtering by subject name and class ID.
 */
export const getsubjectservice = async (req) => {
    const { page = 1, limit = 10, name = '', classId = '' } = req.query;
    const userId = req.user?.id;
    if (!userId) {
        throw { message: "unauthorized request...!" };
    }
    const currentPage = parseInt(page);
    const itemsPerPage = parseInt(limit);
    const filter = { isdeleted: false };
    if (name) {
        filter.str_subjectName = { $regex: name, $options: 'i' };
    }
    if (classId) {
        filter.arr_classes = classId;
    }
    const total = await subjectsmodel.countDocuments(filter);
    const getsubjectdata = await subjectsmodel.find(filter)
        .populate('arr_classes', 'int_grade')
        .populate('objectId_teacherId', 'str_firstName')
        .select('str_subjectName objectId_teacherId arr_classes str_days')
        .skip((currentPage - 1) * itemsPerPage)
        .limit(itemsPerPage)
        .sort({ createdAt: -1 })
        .lean();
    return {
        statusCode: 200,
        getsubjectdata,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalRecords: total
    };
}

/**
 * Service to soft delete a subject by ID.
 * Sets isdeleted to true instead of removing the document.
 */
export const deletesubjectservices = async (subjectId, req) => {
    const userId = req.user?.id;
    if (!userId) {
        throw { message: "unauthorized request...!" };
    }
    const subject = await subjectsmodel.findByIdAndUpdate(
        subjectId,
        { isdeleted: true },
        { new: true }
    );
    if (!subject) {
        throw { message: "subject not found...!" };
    }
    return { statusCode: 200, message: "subject deleted successfully" };
};