import { roles } from '../constants/mongoosetableconstants.js'

/**
 * Middleware to allow access based on user role and resource type.
 * Usage: allowAccess('admin', 'teacher', 'student', 'parent')
 * - Admin: Full access to all resources.
 * - Teacher: Can access student or parent resources, but not teacher resources.
 * - Student: Can only access their own data (GET), not all students.
 * - Parent: Can only access their own data (GET), not all parents.
 */
export const allowAccess = (...resourceRoles) => {
    return (req, res, next) => {
        const { role, id } = req.user;
        const targetId = req.params.id;

        // Admin has full access
        if (role === roles.ADMIN) return next();

        // Teacher access logic
        if (role === roles.TEAHCER) {
            // Allow teacher access to student or parent resources
            if (resourceRoles.some(r => ['student', 'parent'].includes(r))) return next();

            // Deny access to teacher resources
            return res.status(403).json({ message: "Unauthorized access" });
        }

        // Student access logic
        if (role === roles.STUDENT) {
            if (resourceRoles.includes('student')) {
                if (!targetId) {
                    return res.status(403).json({ message: "Students cannot view all data" });
                }
                // Allow student to view their own data (GET only)
                if (id === targetId && req.method === 'GET') {
                    return next();
                }
                return res.status(403).json({ message: "Students can only view their own data" });
            }
            return res.status(403).json({ message: "Unauthorized access" });
        }

        // Parent access logic
        if (role === roles.PARENT) {
            if (resourceRoles.includes('parent')) {
                if (!targetId) {
                    return res.status(403).json({ message: "Parents cannot view all data" });
                }
                // Allow parent to view their own data (GET only)
                if (id === targetId && req.method === 'GET') {
                    return next();
                }
                return res.status(403).json({ message: "Parents can only view their own data" });
            }
            return res.status(403).json({ message: "Unauthorized access" });
        }

        // Default: deny access
        return res.status(403).json({ message: "Access denied" });
    };
};
