import {
    createclasses,
    deleteclasses,
    getclassesservice,
    getoneclasses,
    updateclassesservice,
    getonewithoutpagination
} from '../services/classServices.js';

// Create a new class
export const createclassess = async (req, res) => {
    try {
        const result = await createclasses(req);
        res.status(result.statusCode).json(result);
    } catch (err) {
        // Return 500 for server error
        const status = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        return res.status(status).json({ message });
    }
};

// Update an existing class by ID
export const updateclasses = async (req, res) => {
    try {
        const classesId = req.params.id;
        // Validate ObjectId and update class
        const result = await updateclassesservice(classesId, req);
        res.status(result.statusCode).json(result);
    } catch (err) {
        const status = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        return res.status(status).json({ message });
    }
};

// Get all classes with pagination
export const getclasseswithpagination = async (req, res) => {
    try {
        const result = await getclassesservice(req);
        res.status(result.statusCode).json(result);
    } catch (err) {
        const status = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        return res.status(status).json({ message });
    }
};

// Get one class by ID
export const getoneclassess = async (req, res) => {
    try {
        const classesId = req.params.id;
        const result = await getoneclasses(classesId, req);
        res.status(result.statusCode).json(result);
    } catch (err) {
        const status = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        return res.status(status).json({ message });
    }
};

// Delete class by ID (soft delete)
export const classesdelete = async (req, res) => {
    try {
        const classesId = req.params.id;
        const result = await deleteclasses(classesId, req);
        res.status(result.statusCode).json(result);
    } catch (err) {
        const status = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        return res.status(status).json({ message });
    }
};

// Get all classes without pagination (for dropdowns, etc.)
export const getonewithoutpaginations = async (req, res) => {
    try {
        const result = await getonewithoutpagination(req);
        res.status(result.statusCode).json(result);
    } catch (err) {
        const status = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        return res.status(status).json({ message });
    }
};
