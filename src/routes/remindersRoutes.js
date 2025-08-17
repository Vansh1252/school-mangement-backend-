import express from 'express';
import { createReminder, deleteReminder, getAllReminderswithpagination, getReminderById, updateReminder } from '../controllers/remindersControllers.js';
import { createReminderValidation, updateReminderValidation } from '../validations/remindervalidations.js';
import { validate } from '../middleware/validate.js';
import { auth } from '../middleware/auth.js';
import { allowAccess } from '../middleware/authorizeRoles.js';
import { roles } from '../constants/mongoosetableconstants.js';

const router = express.Router();

// Route to create a new reminder (admin and teacher only)
router.post('/create', auth, allowAccess(roles.ADMIN, roles.TEAHCER), createReminderValidation, validate, createReminder);

// Route to update an existing reminder by ID (admin and teacher only)
router.put('/update/:id', auth, allowAccess(roles.ADMIN, roles.TEAHCER), updateReminderValidation, validate, updateReminder);

// Route to get all reminders with pagination (all roles)
router.get('/', auth, allowAccess(roles.ADMIN, roles.TEAHCER, roles.STUDENT, roles.PARENT), getAllReminderswithpagination);

// Route to get details of a single reminder by ID (all roles)
router.get('/details/:id', auth, allowAccess(roles.ADMIN, roles.TEAHCER, roles.STUDENT, roles.PARENT), getReminderById)

// Route to delete a reminder by ID (admin only)
router.get('/delete/:id', auth, allowAccess(roles.ADMIN), deleteReminder);

export default router;
