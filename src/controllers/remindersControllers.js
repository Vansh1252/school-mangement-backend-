import {
  createReminderService,
  updateReminderService,
  getAllRemindersService,
  getOneReminderService,
  deleteReminderService
} from '../services/remindersServices.js';

/**
 * Controller to handle creating a new reminder
 */
export const createReminder = async (req, res) => {
  try {
    const result = await createReminderService(req);
    res.status(result.statusCode).json(result);
  } catch (err) {
    // Handles service errors and returns appropriate status/message
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

/**
 * Controller to handle updating a reminder by ID
 */
export const updateReminder = async (req, res) => {
  try {
    const reminderId = req.params.id;
    const result = await updateReminderService(reminderId, req);
    res.status(result.statusCode).json(result);
  } catch (err) {
    // Handles service errors and returns appropriate status/message
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

/**
 * Controller to fetch all reminders
 */
export const getAllReminderswithpagination = async (req, res) => {
  try {
    const result = await getAllRemindersService(req);
    res.status(result.statusCode).json(result);
  } catch (err) {
    // Handles service errors and returns appropriate status/message
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

/**
 * Controller to fetch a single reminder by ID
 */
export const getReminderById = async (req, res) => {
  try {
    const result = await getOneReminderService(req);
    res.status(result.statusCode).json(result);
  } catch (err) {
    // Handles service errors and returns appropriate status/message
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

/**
 * Controller to delete a reminder by ID
 */
export const deleteReminder = async (req, res) => {
  try {
    const result = await deleteReminderService(req);
    res.status(result.statusCode).json(result);
  } catch (err) {
    // Handles service errors and returns appropriate status/message
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};
