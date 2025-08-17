// Import the dashboard service function
import { dashboardsevice } from '../services/dashboardService.js';

// Controller to get dashboard data (statistics, counts, etc.)
export const getDashboardData = async (req, res) => {
    try {
        // Call the service to get dashboard data
        const result = await dashboardsevice(req);
        // Send the result with the appropriate status code
        res.status(result.statusCode).json(result);
    } catch (err) {
        // Handle errors and send error response
        const status = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        return res.status(status).json({ message });
    }
};
