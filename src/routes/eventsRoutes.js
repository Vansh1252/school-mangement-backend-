import express from 'express';
import { createEvent, deleteEvent, getAllEventswithpagination, getEventById, updateEvent } from '../controllers/eventsControllers.js';
import { createEventValidation, updateEventValidation } from '../validations/eventvalidations.js';
import { validate } from '../middleware/validate.js';
import { auth } from '../middleware/auth.js';
import { allowAccess } from '../middleware/authorizeRoles.js';
import { roles } from '../constants/mongoosetableconstants.js';

const router = express.Router();

// Route to create a new event (admin and teacher only)
router.post('/create', auth, allowAccess(roles.ADMIN, roles.TEAHCER), createEventValidation, validate, createEvent);

// Route to update an existing event by ID (admin and teacher only)
router.put('/update/:id', auth, allowAccess(roles.ADMIN, roles.TEAHCER), updateEventValidation, validate, updateEvent);

// Route to get all events with pagination (all roles)
router.get('/', auth, allowAccess(roles.ADMIN, roles.TEAHCER, roles.STUDENT, roles.PARENT), getAllEventswithpagination);

// Route to get details of a single event by ID (all roles)
router.get('/details/:id', auth, allowAccess(roles.ADMIN, roles.TEAHCER, roles.STUDENT, roles.PARENT), getEventById)

// Route to delete an event by ID (admin only)
router.get('/delete/:id', auth, allowAccess(roles.ADMIN), deleteEvent);

export default router;
