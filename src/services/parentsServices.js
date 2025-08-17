import { parentsmodel } from "../models/parents.model.js";

/**
 * Update parent data by ID.
 * Checks for duplicate email or phone number, then updates parent fields.
 */
export const updateparent = async (parentId, req) => {
    const { fatherName, motherName, email, phoneNumber, fatherOccupation, address } = req.body;
    const userId = req.user.id;
    if (!userId) throw ({ message: "unauthorized request...!" });
    const issameemail = await parentsmodel.findOne({
        $or: [
            { str_email: email },
            { str_phoneNumber: phoneNumber }
        ],
        _id: { $ne: parentId } 
    });
    if (issameemail !== null && issameemail != undefined) {
        throw { statusCode: 400, message: "email or phoneNumber is used...!" };
    }
    const parentdata = await parentsmodel.findById(parentId);
    if (!parentdata) {
        throw { statusCode: 404, message: "Parent not found" };
    }

    // Update parent fields
    parentdata.str_fatherName = fatherName;
    parentdata.str_motherName = motherName;
    parentdata.str_email = email;
    parentdata.str_phoneNumber = phoneNumber;
    parentdata.str_fatherOccupation = fatherOccupation;
    parentdata.str_address = address;

    await parentdata.save();

    return { statusCode: 200, message: "Parent updated successfully" };
};

/**
 * Get a single parent by ID.
 * Requires user authentication.
 */
export const getoneparent = async (parentId, req) => {
    const userId = req.user?.id;
    if (!userId) {
        throw { statusCode: 401, message: "Unauthorized request" };
    }

    const parentdata = await parentsmodel.findById(parentId);
    if (!parentdata) {
        throw { statusCode: 404, message: "Parent not found" };
    }

    return { statusCode: 200, data: parentdata };
};

/**
 * Get a paginated list of parents.
 * Supports filtering by father's name and class ID.
 */
export const getparent = async (req) => {
    const { page = 1, limit = 10, name = '', classId = '' } = req.query;
    // const userId = req.user.id;
    // if (!userId) throw ({ message: "unauthorized request...!" });
    const currentPage = parseInt(page);
    const itemsPerPage = parseInt(limit);

    const filter = { isdeleted: false };

    if (name) {
        filter.str_fatherName = { $regex: name, $options: 'i' };
    }

    if (classId) {
        filter.objectId_classId = classId;
    }

    const total = await parentsmodel.countDocuments(filter);

    const getparentdata = await parentsmodel.find(filter)
        .select('str_fatherName str_motherName str_fatherOccupation str_email str_phoneNumber str_address')
        .skip((currentPage - 1) * itemsPerPage)
        .limit(itemsPerPage)
        .sort({ createdAt: -1 })
        .lean();

    return {
        statusCode: 200,
        getparentdata,
        currentPage,
        totalPages: Math.ceil(total / itemsPerPage),
        totalRecords: total
    };
};

/**
 * Soft delete a parent by ID.
 * Sets isdeleted to true instead of removing the document.
 */
export const deleteparentservices = async (parentId, req) => {
    const userId = req.user?.id;
    if (!userId) {
        throw { statusCode: 401, message: "Unauthorized request" };
    }

    const parent = await parentsmodel.findByIdAndUpdate(
        parentId,
        { isdeleted: true },
        { new: true }
    );

    if (!parent) {
        throw { statusCode: 404, message: "Parent not found" };
    }

    return { statusCode: 200, message: "Parent deleted successfully" };
};
