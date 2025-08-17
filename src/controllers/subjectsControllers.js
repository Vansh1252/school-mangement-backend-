import {
    createsubject,
    deletesubjectservices,
    getsubjectservice,
    updatesubject,
    getonesubject
} from '../services/subjectsServices.js';

// Controller to create a new subject
export const savesubject = async (req, res) => {
    try {
        const result = await createsubject(req);
        res.status(result.statusCode).json(result);
    } catch (error) {
        console.log(error)
        const status = error.statusCode || 500;
        const message = error.message || "Internal Server Error";
        return res.status(status).json({ message });
    }
};

// Controller to update an existing subject by ID
export const updatesubjects = async (req, res) => {
    try {
        const subjectId = req.params.id;
        const result = await updatesubject(subjectId, req);
        res.status(result.statusCode).json(result);

    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "Internal Server Error";
        return res.status(status).json({ message });
    }
};

// Controller to get all subjects with pagination
export const getsubjectswithpagination = async (req, res) => {
    try {
        const result = await getsubjectservice(req);
        res.status(result.statusCode).json(result);
    } catch (err) {
        const status = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        return res.status(status).json({ message });
    }
};

// Controller to get a single subject by ID
export const getonesubjects = async (req, res) => {
    try {
        const subjectId = req.params.id;
        const result = await getonesubject(subjectId, req)
        res.status(result.statusCode).json(result);

    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "Internal Server Error";
        return res.status(status).json({ message });
    }
}

// Controller to delete a subject by ID
export const deletesubject = async (req, res) => {
    try {
        const subjectId = req.params.id;
        const result = await deletesubjectservices(subjectId, req);
        res.status(result.statusCode).json(result);

    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "Internal Server Error";
        return res.status(status).json({ message });
    }
};
