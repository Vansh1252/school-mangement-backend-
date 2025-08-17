import { eventsmodel } from '../models/events.model.js';
import { expensemodel } from '../models/expense.models.js';
import { teachersmodel } from '../models/teachers.model.js';
import { studentsmodel } from '../models/students.model.js';
import { parentsmodel } from '../models/parents.model.js';
import { remindersmodel } from '../models/reminders.model.js';

/**
 * Service to gather dashboard statistics and analytics.
 * - Returns total counts for students, teachers, parents, and expenses for the current month.
 * - Returns upcoming events and reminders.
 * - Returns graph data: expenses for the last 3 months, male/female student counts, and fees for the last 7 days.
 */
export const dashboardsevice = async (req) => {
    const userId = req.user?.id;
    if (!userId) throw { statusCode: 401, message: "Unauthorized request" };

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Calculate dates for last 3 months for graph
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const startOfLast7Days = new Date(now);
    startOfLast7Days.setDate(now.getDate() - 6); // last 7 days including today

    const [
        studentsCount,
        teachersCount,
        parentsCount,
        totalExpensesThisMonth,
        events,
        reminders,
        expensesLast3Months,
        maleFemaleCount,
        feesLast7Days
    ] = await Promise.all([
        studentsmodel.countDocuments({ isdeleted: false }),
        teachersmodel.countDocuments({ isdeleted: false }),
        parentsmodel.countDocuments({ isdeleted: false }),
        expensemodel.aggregate([
            {
                $match: {
                    isdeleted: false,
                    createdAt: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            { $group: { _id: null, total: { $sum: "$int_amount" } } }
        ]),
        eventsmodel.find({ date_date: { $gte: now } }).sort({ date: 1 }).limit(3).lean(),
        remindersmodel.find({ date_date: { $gte: now } }).sort({ date: 1 }).limit(3).lean(),

        // 1) Expenses last 3 months grouped by month
        expensemodel.aggregate([
            {
                $match: {
                    isdeleted: false,
                    createdAt: { $gte: threeMonthsAgo, $lte: now }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    total: { $sum: "$num_amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]),

        // 2) Male and Female students count
        studentsmodel.aggregate([
            {
                $match: { isdeleted: false }
            },
            {
                $group: {
                    _id: "$str_gender",
                    count: { $sum: 1 }
                }
            }
        ]),
    ]);
    // Format maleFemaleCount to an object { male: X, female: Y }
    const genderCounts = { male: 0, female: 0 };
    maleFemaleCount.forEach(g => {
        if (g._id?.toLowerCase() === 'male') genderCounts.male = g.count;
        else if (g._id?.toLowerCase() === 'female') genderCounts.female = g.count;
    });

    return {
        statusCode: 200,
        data: {
            totalStudents: studentsCount,
            totalTeachers: teachersCount,
            totalParents: parentsCount,
            totalExpenses: totalExpensesThisMonth[0]?.total || 0,
            upcomingEvents: events,
            upcomingReminders: reminders,

            // Graph data
            expensesLast3Months, // array of { _id: { year, month }, total }
            maleFemaleCount: genderCounts, // { male: X, female: Y }
            feesLast7Days // array of { _id: { year, month, day }, total }
        }
    };
};
