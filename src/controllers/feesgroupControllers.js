import {
    createfeesgroupservice,
    getfeesgroupbyidservice,
    updatefeesgroupservice,
    deletefeesgroupservice,
    getallfeesgroupservice
} from '../services/feesGroupService.js';

// Controller to create a new fees group
export const createFeesGroup = async (req, res) => {
    try {
        const result = await createfeesgroupservice(req);
        res.status(201).json({ success: true, message: "Fee Group created", result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Controller to get all fees groups with pagination
export const getAllFeesGroupswithpagination = async (req, res) => {
    try {
        const result = await getallfeesgroupservice(req);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Controller to get a single fees group by ID
export const getFeesGroupById = async (req, res) => {
    try {
        const feesGroupId = req.params.id;
        const result = await getfeesgroupbyidservice(feesGroupId, req);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Controller to update a fees group by ID
export const updateFeesGroup = async (req, res) => {
    try {
        const feesgroupId = req.params.id;
        const result = await updatefeesgroupservice(feesgroupId, req);
        res.status(200).json({ success: true, message: "Fee Group updated", data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Controller to delete a fees group by ID
export const deleteFeesGroup = async (req, res) => {
    try {
        const result = await deletefeesgroupservice(req.params.id);
        res.status(200).json({ success: true, message: "Fee Group deleted", data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
