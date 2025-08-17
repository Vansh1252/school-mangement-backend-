import express from 'express';
import { getoneparents, getparentswithpagination, parentdelete, updateparents } from '../controllers/parentsControllers.js';
import { updateParentValidation } from '../validations/parentvalidations.js';
import { validate } from '../middleware/validate.js';
import { auth } from '../middleware/auth.js';
import { allowAccess } from '../middleware/authorizeRoles.js';
import { roles } from '../constants/mongoosetableconstants.js';

const router = express.Router();

// Route to update a parent by ID (admin and parent only)
router.put('/update/:id', auth, allowAccess(roles.ADMIN, roles.PARENT), updateParentValidation, validate, updateparents);

// Route to get all parents with pagination (admin and teacher only)
router.get('/', auth, allowAccess(roles.ADMIN, roles.TEAHCER), getparentswithpagination);

// Route to get details of a single parent by ID (admin, teacher, and parent only)
router.get('/details/:id', auth, allowAccess(roles.ADMIN, roles.TEAHCER, roles.PARENT), getoneparents)

// Route to delete a parent by ID (admin only)
router.get('/delete/:id', auth, allowAccess(roles.ADMIN), parentdelete);


export default router;
