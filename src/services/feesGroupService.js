import { feesgroupsmodel } from '../models/feesgroup.models.js';
import { classesmodel } from '../models/classes.model.js';

/**
 * Service to create a new fees group.
 * Checks if the class already has a fees group assigned.
 * Links the new fees group to the class.
 */
export const createfeesgroupservice = async (req) => {
    const { classId, feeTypes, description } = req.body;
    const userId = req.user?.id;
    if (!userId) throw { statusCode: 401, message: "Unauthorized request" };
    const isameclasses = await classesmodel.findById(classId);
    if (isameclasses) {
        throw { statusCode: 400, message: "feesgroup has been assigned to this class" }
    }

    const newFeesGroup = new feesgroupsmodel({
        objectId_classId: classId,
        arr_feeTypes: feeTypes,
        str_description: description,
        objectId_createdBy: userId
    });

    await newFeesGroup.save();
    const classdata = await classesmodel.findByIdAndUpdate(classId, { objectId_feesGroupId: newFeesGroup._id }, { new: true });
    return { statusCode: 201, message: "Fees Group created successfully" };
};

/**
 * Service to update an existing fees group by ID.
 * Allows updating class, fee types, and description.
 */
export const updatefeesgroupservice = async (feesgroupId, req) => {
    const userId = req.user?.id;
    if (!userId) throw { statusCode: 401, message: "Unauthorized request" };

    // Map frontend fields to model fields
    const updateData = {};
    if (req.body.classId) updateData.objectId_classId = req.body.classId;
    if (req.body.feeTypes) updateData.arr_feeTypes = req.body.feeTypes;
    if (req.body.description) updateData.str_description = req.body.description;

    const updated = await feesgroupsmodel.findByIdAndUpdate(feesgroupId, updateData, { new: true });

    if (!updated) throw { statusCode: 404, message: "Fees Group not found" };
    return { statusCode: 200, message: "Fees Group updated successfully", data: updated };
};

/**
 * Service to soft delete a fees group by ID.
 * Sets isdeleted to true instead of removing the document.
 */
export const deletefeesgroupservice = async (req) => {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) throw { statusCode: 401, message: "Unauthorized request" };

    const deleted = await feesgroupsmodel.findByIdAndUpdate(id, { isdeleted: true }, { new: true });
    if (!deleted) throw { statusCode: 404, message: "Fees Group not found" };
    return { statusCode: 200, message: "Fees Group deleted successfully" };
};

/**
 * Service to get all fees groups with pagination and optional name filter.
 * Populates class name for each fees group.
 */
export const getallfeesgroupservice = async (req) => {
    const { page = 1, limit = 10, name = '' } = req.query;
    const userId = req.user?.id;
    if (!userId) throw { statusCode: 401, message: "Unauthorized request" };

    const currentPage = parseInt(page);
    const itemsPerPage = parseInt(limit);

    const filter = {};
    if (name) {
        filter.str_name = { $regex: name, $options: 'i' };
    }

    const total = await feesgroupsmodel.countDocuments(filter);
    const result = await feesgroupsmodel.find(filter)
        .populate('objectId_classId', 'str_className')
        .select('arr_feeTypes str_description createdAt objectId_classId')
        .skip((currentPage - 1) * itemsPerPage)
        .limit(itemsPerPage)
        .sort({ createdAt: -1 })
        .lean();

    return {
        statusCode: 200,
        feesgroups: result,
        currentPage,
        totalPages: Math.ceil(total / itemsPerPage),
        totalRecords: total
    };
};

/**
 * Service to get a single fees group by ID.
 */
export const getfeesgroupbyidservice = async (feesGroupId, req) => {
    const userId = req.user?.id;
    if (!userId) throw { statusCode: 401, message: "Unauthorized request" };

    const result = await feesgroupsmodel.findById(feesGroupId).lean();
    if (!result) throw { statusCode: 404, message: "Fees Group not found" };
    return { statusCode: 200, data: result };
};
