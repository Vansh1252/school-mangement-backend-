import { eventsmodel } from '../models/events.model.js';

/**
 * Service to create a new event.
 * Requires title, description, date, and user ID from the request.
 */
export const createEventService = async (req) => {
    const { title, description, date } = req.body;
    const userId = req.user?.id;
    if (!userId) throw { statusCode: 401, message: "Unauthorized" };

    const event = new eventsmodel({
        str_title: title,
        str_description: description,
        date_date: date,
        objectId_createdBy: userId
    });

    await event.save();
    return { statusCode: 201, message: "Event created", event };
};

/**
 * Service to update an existing event by ID.
 * Only allows update if user is authorized.
 */
export const updateEventService = async (eventId, req) => {
    const { title, description, date } = req.body;
    const userId = req.user?.id;
    if (!userId) {
        throw { statusCode: 401, message: "Unauthorized request" };
    }
    const event = await eventsmodel.findByIdAndUpdate(eventId, {
        str_title: title,
        str_description: description,
        date_date: date
    });
    if (!event) throw { statusCode: 404, message: "Event not found" };

    return { statusCode: 200, message: "Event updated", event };
};

/**
 * Service to get all events (not deleted), sorted by date.
 */
export const getAllEventsService = async (req) => {
    const userId = req.user?.id;
    if (!userId) throw { statusCode: 401, message: "Unauthorized" };

    const events = await eventsmodel.find({ isDeleted: false }).sort({ date: 1 });
    return { statusCode: 200, data: events };
};

/**
 * Service to get a single event by ID.
 */
export const getOneEventService = async (req) => {
    const userId = req.user?.id;
    if (!userId) {
        throw { statusCode: 401, message: "Unauthorized request" };
    }
    const event = await eventsmodel.findById(req.params.id);
    if (!event) throw { statusCode: 404, message: "Event not found" };
    return { statusCode: 200, data: event };
};

/**
 * Service to soft delete an event by ID.
 * Sets isDeleted to true instead of removing the document.
 */
export const deleteEventService = async (req) => {
    const userId = req.user?.id;
    if (!userId) {
        throw { statusCode: 401, message: "Unauthorized request" };
    }
    const event = await eventsmodel.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!event) throw { statusCode: 404, message: "Event not found" };
    return { statusCode: 200, message: "Event deleted" };
};