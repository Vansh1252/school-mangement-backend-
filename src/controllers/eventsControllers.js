import {
    createEventService,
    updateEventService,
    getAllEventsService,
    getOneEventService,
    deleteEventService
} from '../services/eventsServices.js';

/**
 * Controller to handle creating a new event
 */
export const createEvent = async (req, res) => {
    try {
        const result = await createEventService(req);
        res.status(result.statusCode).json(result);
    } catch (err) {
        // Handle unexpected errors
        const status = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        return res.status(status).json({ message });
    }
};

/**
 * Controller to handle updating an existing event by ID
 */
export const updateEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const result = await updateEventService(eventId, req);
        res.status(result.statusCode).json(result);
    } catch (err) {
        // Handle unexpected errors
        const status = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        return res.status(status).json({ message });
    }
};

/**
 * Controller to retrieve all events with pagination
 */
export const getAllEventswithpagination = async (req, res) => {
    try {
        const result = await getAllEventsService(req);
        res.status(result.statusCode).json(result);
    } catch (err) {
        // Handle unexpected errors
        const status = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        return res.status(status).json({ message });
    }
};

/**
 * Controller to retrieve a single event by ID
 */
export const getEventById = async (req, res) => {
    try {
        const result = await getOneEventService(req);
        res.status(result.statusCode).json(result);
    } catch (err) {
        // Handle unexpected errors
        const status = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        return res.status(status).json({ message });
    }
};

/**
 * Controller to delete an event by ID
 */
export const deleteEvent = async (req, res) => {
    try {
        const result = await deleteEventService(req);
        res.status(result.statusCode).json(result);
    } catch (err) {
        // Handle unexpected errors
        const status = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        return res.status(status).json({ message });
    }
};
