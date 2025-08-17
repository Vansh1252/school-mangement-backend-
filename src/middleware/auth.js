import jwt from 'jsonwebtoken';

/**
 * Authentication middleware to verify JWT token from Authorization header.
 * If valid, attaches decoded user info to req.user and calls next().
 * If invalid or missing, responds with 401 Unauthorized.
 */
export const auth = async (req, res, next) => {
    // Get the Authorization header (should be in format: Bearer <token>)
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Unauthorized, JWT token is required" });
    }

    // Extract token after 'Bearer'
    const token = authHeader.split(' ')[1];

    try {
        // Verify token and attach user info to request
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        // Token is invalid or expired
        return res.status(401).json({ message: "Unauthorized, JWT token is invalid or expired" });
    }
};
