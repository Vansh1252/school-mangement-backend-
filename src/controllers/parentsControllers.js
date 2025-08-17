import mongoose from 'mongoose';
import {
    deleteparentservices,
    getoneparent,
    getparent,
    updateparent
} from '../services/parentsServices.js';

// Update parent
export const updateparents = async (req, res) => {
    try {
        const parentId = req.params.id;
        const result = await updateparent(parentId, req);
        res.status(result.statusCode).json(result);

    } catch (err) {
        const status = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        return res.status(status).json({ message });
    }
};

// Get all parents with pagination
export const getparentswithpagination = async (req, res) => {
    try {
        console.log(req.query)
        const result = await getparent(req);
        res.status(result.statusCode).json(result);

    } catch (err) {
        const status = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        console.log(err)
        return res.status(status).json({ message }, err);
    }
};

// Get one parent by ID
export const getoneparents = async (req, res) => {
    try {
        const parentId = req.params.id;
        const result = await getoneparent(parentId, req);
        res.status(result.statusCode).json(result);

    } catch (err) {
        const status = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        return res.status(status).json({ message });
    }
};

// Delete parent (soft delete)
export const parentdelete = async (req, res) => {
    try {
        const parentId = req.params.id;
        const result = await deleteparentservices(parentId, req);
        res.status(result.statusCode).json(result);

    } catch (err) {
        const status = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        return res.status(status).json({ message });
    }
};
