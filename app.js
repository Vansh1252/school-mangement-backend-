/**
 * Main entry point for the School Management backend application.
 * Sets up Express app, middleware, routers, error handling, and starts the server.
 */
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import path from 'path'
import createError from 'http-errors';
dotenv.config();
import { connectDB } from './src/utils/db.js';
import userrouter from './src/routes/usersRoutes.js';
import studentrouter from './src/routes/studentRoutes.js';
import teacherrouter from './src/routes/teacherRoutes.js';
import parentrouter from './src/routes/parentsRoutes.js';
import subjectrouter from './src/routes/subjectsRoutes.js';
import classesrouter from './src/routes/classesRoutes.js';
import reminderrouter from './src/routes/remindersRoutes.js';
import eventrouter from './src/routes/eventsRoutes.js';
import expenserouter from './src/routes/expenseRoutes.js';
import feesGrouprouter from './src/routes/feesGroupRoutes.js';
import dashboardrouter from './src/routes/dashboradRoutes.js';
import { rateLimit } from 'express-rate-limit'
import helmet from "helmet";
import cors from 'cors'

const app = express();
const port = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

// Rate limiter to prevent abuse
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
})
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set view engine and views directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware setup
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan('dev'));
app.use(limiter);
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// Check required environment variables
if (!DATABASE_URL || !process.env.JWT_SECRET) {
    console.error("Missing environment variables. Please check DATABASE_URL and JWT_SECRET.");
    process.exit(1);
}

// Connect to MongoDB
connectDB(DATABASE_URL);

// Register routers for different modules
app.use('/', userrouter);
app.use('/student', studentrouter);
app.use('/teacher', teacherrouter);
app.use('/parent', parentrouter);
app.use('/subject', subjectrouter);
app.use('/classes', classesrouter);
app.use('/reminder', reminderrouter);
app.use('/event', eventrouter);
app.use('/expense', expenserouter);
app.use('/feesgroup', feesGrouprouter);
app.use('/dashboard', dashboardrouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// Error handler middleware
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// Start the server
app.listen(port, () => {
    console.log(`server is listening in port ${port}`)
})