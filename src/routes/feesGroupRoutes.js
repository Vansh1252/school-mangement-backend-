import express from "express";
import { createFeesGroup, deleteFeesGroup, getAllFeesGroupswithpagination, getFeesGroupById, updateFeesGroup } from "../controllers/feesgroupControllers.js";
import { validateCreateFeesGroup, validateUpdateFeesGroup } from '../validations/feesGroupvalidation.js';
import { validate } from '../middleware/validate.js';
import { roles } from "../constants/mongoosetableconstants.js";
import { auth } from '../middleware/auth.js';
import { allowAccess } from '../middleware/authorizeRoles.js';

const router = express.Router();

// Route to create a new fees group (admin only)
router.post("/create", auth, allowAccess(roles.ADMIN), validateCreateFeesGroup, validate, createFeesGroup);

// Route to get all fees groups with pagination (admin only)
router.get("/", auth, allowAccess(roles.ADMIN), getAllFeesGroupswithpagination);

// Route to update a fees group by ID (admin only)
router.put("/update/:id", auth, allowAccess(roles.ADMIN), validateUpdateFeesGroup, validate, updateFeesGroup);

// Route to get a single fees group by ID (admin only)
router.post('/:id', auth, allowAccess(roles.ADMIN), getFeesGroupById)

// Route to delete a fees group by ID (admin only)
router.delete("/delete/:id", auth, allowAccess(roles.ADMIN), deleteFeesGroup);

export default router;
