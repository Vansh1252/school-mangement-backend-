import { classesmodel } from '../models/classes.model.js';
import { feesgroupsmodel } from '../models/feesgroup.models.js'; // make sure to import this

/**
 * Service to create a new class entry.
 * Checks authorization, then creates and saves a new class document.
 */
export const createclasses = async (req) => {
    const { className, grade } = req.body;
    const userId = req.user?.id;

    // Check authorization
    if (!userId) {
        throw { statusCode: 401, message: "Unauthorized request" };
    }

    // Create new class document
    const classes = new classesmodel({
        str_className: className,
        int_grade: grade,
        objectId_createdBy: userId
    });

    await classes.save();
    return { statusCode: 201, message: "Class created successfully" };
};

/**
 * Service to update a class by ID.
 * Checks authorization, finds the class, updates fields, and saves.
 */
export const updateclassesservice = async (classId, req) => {
    const { className, grade } = req.body;
    const userId = req.user?.id;
    // Check authorization
    if (!userId) {
        throw { statusCode: 401, message: "Unauthorized request" };
    }
    const classes = await classesmodel.findById(classId);
    console.log(classes)
    if (!classes) {
        throw { statusCode: 404, message: "Class not found" };
    }
    // Update fields
    classes.str_className = className;
    classes.int_grade = grade;
    await classes.save();

    return { statusCode: 200, message: "Class updated successfully", classes };
};

/**
 * Service to get a paginated list of classes with optional filters.
 * Supports filtering by class name and class ID.
 */
export const getclassesservice = async (req) => {
    const { page = 1, limit = 10, name = '', classId = '' } = req.query;
    const userId = req.user?.id;
    if (!userId) {
        throw { statusCode: 401, message: "Unauthorized request" };
    }
    const currentPage = parseInt(page);
    const itemsPerPage = parseInt(limit);
    const filter = { isdeleted: false };
    // Filter by class name if provided
    if (name) {
        filter.str_className = { $regex: name, $options: 'i' };
    }
    // Filter by class ID if provided
    if (classId) {
        filter._id = classId;
    }
    const total = await classesmodel.countDocuments(filter);
    const getclassesData = await classesmodel.find(filter)
        .select('str_className int_grade ')
        .skip((currentPage - 1) * itemsPerPage)
        .limit(itemsPerPage)
        .sort({ createdAt: -1 })
        .lean();
    return {
        statusCode: 200,
        getclassesData,
        currentPage,
        totalPages: Math.ceil(total / itemsPerPage),
        totalRecords: total
    };
};

/**
 * Service to get a single class by ID.
 * Checks authorization and returns the class data.
 */
export const getoneclasses = async (classesId, req) => {
    const userId = req.user?.id;
    if (!userId) {
        throw { statusCode: 401, message: "Unauthorized request" };
    }

    const classesdata = await classesmodel.findById(classesId);
    if (!classesdata) {
        throw { statusCode: 404, message: "Class not found" };
    }

    return { statusCode: 200, data: classesdata };
};

/**
 * Service to soft delete a class by ID.
 * Sets isdeleted to true instead of removing the document.
 */
export const deleteclasses = async (classesId, req) => {
    const userId = req.user?.id;
    if (!userId) {
        throw { statusCode: 401, message: "Unauthorized request" };
    }
    const classesdata = await classesmodel.findByIdAndUpdate(
        classesId,
        { isdeleted: true },
        { new: true }
    );
    if (!classesdata) {
        throw { statusCode: 404, message: "Class not found" };
    }
    return { statusCode: 200, message: "Class deleted successfully" };
};

/**
 * Service to get all classes without pagination (for dropdowns, etc.).
 * Returns only the grade field, sorted by creation date.
 */
export const getonewithoutpagination = async (req) => {
    const userId = req.user?.id;
    if (!userId) {
        throw { statusCode: 401, message: "Unauthorized request" };
    }
    const classes = await classesmodel.find().select('int_grade').sort({ createdAt: -1 })
    if (classes.length < 1) {
        throw { statusCode: 404, message: "No student found...!" };
    }
    return { statusCode: 200, classes }
}