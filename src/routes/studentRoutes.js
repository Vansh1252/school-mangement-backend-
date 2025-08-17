import express from 'express';
import {
    createstudents,
    updateStudent,
    getStudentswithpagination,
    studentdelete,
    getonestudents,
    getonewithoutpaginations,
    studentpromtions,
    getStudentFeesInfo,
    updateStudentFees
} from '../controllers/studentControllers.js';
import {
    createStudentValidation,
    updateStudentValidation,
    studentpromotion,
    updateStudentFeesValidation
} from '../validations/studentvalidations.js';
import { validate } from '../middleware/validate.js';
import upload from '../middleware/multermiddleware.js';
import { auth } from '../middleware/auth.js';
import { allowAccess } from '../middleware/authorizeRoles.js';
import { roles } from '../constants/mongoosetableconstants.js';

const router = express.Router();

// Route to create a new student (admin only)
router.post('/create', auth, allowAccess(roles.ADMIN), upload.single('str_studentPhoto'), createStudentValidation, validate, createstudents);

// Route to update a student by ID (admin and student only)
router.put('/update/:id', auth, allowAccess(roles.ADMIN, roles.STUDENT), upload.single('str_studentPhoto'), updateStudentValidation, validate, updateStudent);

// Route to get all students with pagination (admin, teacher, and student)
router.get('/', auth, allowAccess(roles.ADMIN, roles.TEAHCER, roles.STUDENT), getStudentswithpagination);

// Route to get details of a single student by ID (admin, teacher, parent, and student)
router.get('/details/:id', auth, allowAccess(roles.ADMIN, roles.TEAHCER, roles.PARENT, roles.STUDENT), getonestudents);

// Route to delete a student by ID (admin only)
router.get('/delete/:id', auth, allowAccess(roles.ADMIN), studentdelete);

// Route to get all students without pagination (for dropdowns, etc.)
router.get('/master', auth, getonewithoutpaginations);

// Route to get student fees details by student ID (admin, teacher, parent, and student)
router.get('/fees/:id', auth, allowAccess(roles.ADMIN, roles.TEAHCER, roles.PARENT, roles.STUDENT), getStudentFeesInfo);

// Route to update student fees by student ID (admin only)
router.put('/update/fees/:id', auth, allowAccess(roles.ADMIN), updateStudentFeesValidation, validate, updateStudentFees);

// Route to promote a student (admin only)
router.post('/promtion', auth, allowAccess(roles.ADMIN), studentpromotion, validate, studentpromtions);

export default router;
