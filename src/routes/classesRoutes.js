import express from 'express';
import { 
    classesdelete, 
    createclassess, 
    getclasseswithpagination, 
    getoneclassess, 
    updateclasses, 
    getonewithoutpaginations 
} from '../controllers/classesControllers.js';
import { createClassValidation, updateClassValidation } from '../validations/classesvalidatons.js';
import { validate } from '../middleware/validate.js';
import { auth } from '../middleware/auth.js';
import { allowAccess } from '../middleware/authorizeRoles.js';
import { roles } from '../constants/mongoosetableconstants.js';

const router = express.Router();

// Route to create a new class (admin only)
router.post('/create', auth, allowAccess(roles.ADMIN), createClassValidation, validate, createclassess);

// Route to update an existing class (admin and teacher)
router.put('/update/:id', auth, allowAccess(roles.ADMIN, roles.TEAHCER), updateClassValidation, validate, updateclasses);

// Route to get all classes with pagination (all roles)
router.get('/', auth, allowAccess(roles.ADMIN, roles.TEAHCER, roles.STUDENT, roles.PARENT), getclasseswithpagination);

// Route to get details of a single class by ID (all roles)
router.get('/details/:id', auth, allowAccess(roles.ADMIN, roles.TEAHCER, roles.STUDENT, roles.PARENT), getoneclassess);

// Route to delete a class by ID (admin only)
router.get('/delete/:id', auth, allowAccess(roles.ADMIN), classesdelete);

// Route to get all classes without pagination (for dropdowns, etc.)
router.get('/master', auth, getonewithoutpaginations);

export default router;
