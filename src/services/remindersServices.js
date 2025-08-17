import { remindersmodel } from '../models/reminders.model.js';

/**
 * Service to create a new reminder.
 * Requires message, date, color, and user ID from the request.
 */
export const createReminderService = async (req) => {
    const { message, date, color } = req.body;
    const userId = req.user?.id;
    if (!userId) throw { statusCode: 401, message: "Unauthorized" };

    const reminder = new remindersmodel({
        str_message: message,
        date_date: date,
        str_color: color,
        objectId_createdBy: userId
    });
    await reminder.save();

    return { statusCode: 201, message: "Reminder created", reminder };
};

/**
 * Service to update an existing reminder by ID.
 * Only allows update if user is authorized.
 */
export const updateReminderService = async (reminderId, req) => {
    const { date, message, color } = req.body;
    const userId = req.user?.id;
    if (!userId) throw { statusCode: 401, message: "Unauthorized" };
    const reminder = await remindersmodel.findByIdAndUpdate(reminderId, {
        date_date: date,
        str_message: message,
        str_color: color
    });

    if (!reminder) throw { statusCode: 404, message: "Reminder not found" };

    return { statusCode: 200, message: "Reminder updated", reminder };
};

/**
 * Service to get all reminders (not deleted), sorted by date.
 */
export const getAllRemindersService = async (req) => {
    const userId = req.user?.id;
    if (!userId) throw { statusCode: 401, message: "Unauthorized" };
    const reminders = await remindersmodel.find({ isDeleted: false }).sort({ date: 1 });
    return { statusCode: 200, data: reminders };
};

/**
 * Service to get a single reminder by ID.
 */
export const getOneReminderService = async (req) => {
    const userId = req.user?.id;
    if (!userId) throw { statusCode: 401, message: "Unauthorized" };
    const reminder = await remindersmodel.findById(req.params.id);
    if (!reminder) throw { statusCode: 404, message: "Reminder not found" };
    return { statusCode: 200, data: reminder };
};

/**
 * Service to soft delete a reminder by ID.
 * Sets isDeleted to true instead of removing the document.
 */
export const deleteReminderService = async (req) => {
    const userId = req.user?.id;
    if (!userId) throw { statusCode: 401, message: "Unauthorized" };
    const reminder = await remindersmodel.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!reminder) throw { statusCode: 404, message: "Reminder not found" };
    return { statusCode: 200, message: "Reminder deleted" };
};
