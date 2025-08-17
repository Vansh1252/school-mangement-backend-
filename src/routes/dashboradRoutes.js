import express from 'express';
import { getDashboardData } from '../controllers/dashboardControllers.js';
import { auth } from '../middleware/auth.js';  // Your auth middleware
import { allowAccess } from '../middleware/authorizeRoles.js';
import { roles } from '../constants/mongoosetableconstants.js';
const router = express.Router();

// Protected route for dashboard data
router.get('/', auth, allowAccess(roles.ADMIN), getDashboardData);

export default router;
