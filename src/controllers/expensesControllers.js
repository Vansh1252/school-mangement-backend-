import { 
    createexpenseservice, 
    deleteexpenseservice, 
    getallexpensesservice, 
    updateexpenseservice, 
    getoneExpenese 
} from "../services/expensesService.js";

// Controller to create a new expense
export const createexpense = async (req, res) => {
    try {
        const result = await createexpenseservice(req);
        res.status(result.statusCode).json(result);
    } catch (err) {
        const status = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        return res.status(status).json({ message });
    }
};

// Controller to get all expenses with pagination
export const getallexpenseswithpagination = async (req, res) => {
    try {
        const result = await getallexpensesservice(req);
        res.status(result.statusCode).json(result);
    } catch (err) {
        const status = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        return res.status(status).json({ message });
    }
};

// Controller to get a single expense by ID
export const getoneexpense = async (req, res) => {
    try {
        const expenseId = req.params.id;
        const result = await getoneExpenese(expenseId, req);
        res.status(result.statusCode).json(result);
    } catch (err) {
        const status = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        return res.status(status).json({ message });
    }
}

// Controller to update an expense
export const updateexpense = async (req, res) => {
    try {
        const result = await updateexpenseservice(req);
        res.status(result.statusCode).json(result);
    } catch (err) {
        const status = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        return res.status(status).json({ message });
    }
};

// Controller to delete an expense
export const deleteexpense = async (req, res) => {
    try {
        const result = await deleteexpenseservice(req);
        res.status(result.statusCode).json(result);
    } catch (err) {
        const status = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        return res.status(status).json({ message });
    }
};
