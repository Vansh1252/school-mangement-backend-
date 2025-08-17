import express from 'express';
import { deletesubject, getsubjectswithpagination, savesubject, updatesubjects, getonesubjects } from '../controllers/subjectsControllers.js';
import { createSubjectValidation, updateSubjectValidation } from '../validations/subjectvalidations.js';
import { validate } from '../middleware/validate.js';
import { auth } from '../middleware/auth.js';
import { allowAccess } from '../middleware/authorizeRoles.js';
import { roles } from '../constants/mongoosetableconstants.js';

const router = express.Router();

// Route to create a new subject (admin only)
router.post('/create', auth, allowAccess(roles.ADMIN), createSubjectValidation, validate, savesubject);

// Route to update a subject by ID (admin and teacher only)
router.put('/update/:id', auth, allowAccess(roles.ADMIN, roles.TEAHCER), updateSubjectValidation, validate, updatesubjects);

// Route to get a single subject by ID (admin only)
router.get('/:id', auth, allowAccess(roles.ADMIN), getonesubjects);

// Route to get all subjects with pagination (all roles)
router.get('/', auth, getsubjectswithpagination);

// Route to delete a subject by ID (admin only)
router.get('/delete/:id', auth, allowAccess(roles.ADMIN), deletesubject);

export default router;
