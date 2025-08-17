import mongoose from "mongoose";

/**
 * Connects to the MongoDB database using Mongoose.
 * Uses the DBNAME from environment variables for the database name.
 * Logs success or exits the process on failure.
 */
const connectDB = async (DATABASE_URL) => {
    try {
        const DB_OPTIONS = { dbname: process.env.DBNAME };
        await mongoose.connect(DATABASE_URL, DB_OPTIONS);
        console.log("Connected successfully to the database.");
    } catch (error) {
        console.error(`Database connection failed: ${error.message}`);
        process.exit(1);
    }
}

export { connectDB };