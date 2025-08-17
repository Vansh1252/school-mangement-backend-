// MongoDB collection names used throughout the project
export const collections = {
    USERS: "cl_users",
    CLASSES: "cl_classes",
    PARENT: "cl_parent",
    REMINDER: "cl_reminder",
    TEACHERS: "cl_teachers",
    SUBJECTS: "cl_subjects",
    STUDENTS: "cl_students",
    EVENTS: "cl_events",
    PASSWORDRESET: "cl_passwordreset",
    EXPENSES: "cl_expenses",
    FEESGROUP: "cl_feesgroups",
    FEESCOLLECTION: 'cl_feescollections'
};

// User roles used for authentication and authorization
export const roles = {
    ADMIN: "admin",
    PARENT: "parent",
    STUDENT: "student",
    TEAHCER: "teacher", // Note: Typo, should be TEACHER
}

// Status values for fees/payment
export const statusall = {
    UNPAID: 'Unpaid',
    PAID: 'Paid',
}

// Supported languages for the application
export const language = {
    ENGLISH: 'english',
    HINDI: 'hindi',
    GUJARATI: 'gujarati',
    FRENCH: 'french'
}