import mongoose from 'mongoose';
import {
    deleteteacher,
    getoneteacher,
    createteacherservice,
    getteacherservice,
    updateteacherservice,
    getonewithoutpagination
} from '../services/teacherServices.js';

// Controller to create a new teacher
export const createteacher = async (req, res) => {
    try {
        const result = await createteacherservice(req);
        res.status(result.statusCode).json(result);
    } catch (err) {
        const status = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        return res.status(status).json({ message });
    }
};

// Controller to update a teacher by ID
export const updateteacher = async (req, res) => {
    try {
        const teacherId = req.params.id;
        const result = await updateteacherservice(teacherId, req);
        res.status(result.statusCode).json(result);
    } catch (err) {
        console.log(err)
        const status = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        return res.status(status).json({ message });
    }
};

// Controller to get all teachers with pagination
export const getteacherwithpagination = async (req, res) => {
    try {
        const result = await getteacherservice(req);
        res.status(result.statusCode).json(result);
    } catch (err) {
        const status = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        return res.status(status).json({ message });
    }
};

// Controller to get a single teacher by ID
export const getoneteachers = async (req, res) => {
    const teacherId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
        return res.status(400).json({ message: "Invalid teacherId" });
    }

    try {
        const result = await getoneteacher(teacherId, req);
        res.status(result.statusCode).json(result);
    } catch (err) {
        const status = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        return res.status(status).json({ message });
    }
};

// Controller to delete a teacher by ID
export const teacherdelete = async (req, res) => {
    const teacherId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
        return res.status(400).json({ message: "Invalid teacherId" });
    }

    try {
        const result = await deleteteacher(teacherId, req);
        res.status(result.statusCode).json(result);
    } catch (err) {
        const status = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        return res.status(status).json({ message });
    }
};

// Controller to get all teachers without pagination (for dropdowns, etc.)
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
