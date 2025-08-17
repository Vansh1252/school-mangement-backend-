import express from 'express';
import { createteacher, getoneteachers, getteacherwithpagination, teacherdelete, updateteacher, getonewithoutpaginations } from '../controllers/teacherControllers.js';
import { createTeacherValidation, updateTeacherValidation } from '../validations/teachervalidations.js';
import { validate } from '../middleware/validate.js';
import upload from '../middleware/multermiddleware.js';
import { auth } from '../middleware/auth.js';
import { allowAccess } from '../middleware/authorizeRoles.js';
import { roles } from '../constants/mongoosetableconstants.js';

const router = express.Router();

// Route to create a new teacher (admin only)
router.post('/create', auth, allowAccess(roles.ADMIN), upload.single('str_teacherPhoto'), createTeacherValidation, validate, createteacher);

// Route to update a teacher by ID (admin only)
router.put('/update/:id', auth, allowAccess(roles.ADMIN), upload.single('str_teacherPhoto'), updateTeacherValidation, validate, updateteacher);

// Route to get all teachers with pagination (admin only)
router.get('/', auth, allowAccess(roles.ADMIN), getteacherwithpagination);

// Route to get details of a single teacher by ID (admin only)
router.get('/details/:id', auth, allowAccess(roles.ADMIN), getoneteachers);

// Route to delete a teacher by ID (admin only)
router.get('/delete/:id', auth, allowAccess(roles.ADMIN), teacherdelete);

// Route to get all teachers without pagination (for dropdowns, etc.)
router.get('/master', auth, getonewithoutpaginations);

export default router;
