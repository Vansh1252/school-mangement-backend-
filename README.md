<h1 align="center">School Management System – Backend</h1>

<p align="center">
  REST API that powers a school management dashboard: students, teachers, parents, classes, subjects, fees, expenses, events and reminders.
</p>

<p align="center">
  <a href="https://school-mangement-backend.vercel.app"><img src="https://img.shields.io/badge/Live_API-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white"/></a>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white"/>
</p>

> Frontend: [school-management-frontend](https://github.com/Vansh1252/school-management-frontend)

---

## Features

- **Authentication:** user sign-up and login with JWT, hashed passwords (bcrypt) and email-based password reset
- **Role-based access:** middleware restricts routes by user role
- **Students:** create, update, list and view students, manage their fees and promote them to the next class
- **Teachers and parents:** full profiles with create, update, list and detail views
- **Academics:** classes and subjects, with "master" lists for dropdowns
- **Finance:** fee groups, student fee tracking and school expenses
- **Events and reminders:** a school calendar and reminders
- **Dashboard:** summary stats for the admin home screen
- **Security:** Helmet headers, rate limiting, CORS and request validation with express-validator
- **File uploads:** Multer for profile photos and documents, served from /uploads

## Tech stack

| Layer | Tools |
|---|---|
| Runtime | Node.js |
| Framework | Express |
| Database | MongoDB with Mongoose |
| Auth | JSON Web Tokens, bcrypt |
| Security | Helmet, express-rate-limit, CORS, express-validator |
| Uploads and email | Multer, Nodemailer |
| Hosting | Vercel |

## API modules

| Base path | Module | Main endpoints |
|---|---|---|
| `/` | Users and auth | `POST /create`, `POST /login`, password reset |
| `/student` | Students | CRUD, `/master`, `/fees/:id`, `/promtion` |
| `/teacher` | Teachers | CRUD, `/master` |
| `/parent` | Parents | CRUD |
| `/classes` | Classes | CRUD, `/master` |
| `/subject` | Subjects | CRUD |
| `/feesgroup` | Fee groups | CRUD |
| `/expense` | Expenses | CRUD |
| `/event` | Events | CRUD |
| `/reminder` | Reminders | CRUD |
| `/dashboard` | Dashboard | `GET /` summary stats |

Each CRUD module follows the same pattern: `POST /create`, `GET /`, `GET /details/:id`, `PUT /update/:id` and a delete route.

## Project structure

~~~text
├── app.js                 # Express setup, middleware and route mounting
└── src/
    ├── constants/         # Shared constants
    ├── controllers/       # Business logic for each module
    ├── middleware/        # auth, authorizeRoles, multer, validate
    ├── models/            # Mongoose schemas
    └── routes/            # Express routers
~~~

## Getting started

**Prerequisites:** Node.js 18+ and a MongoDB database (local or Atlas)

~~~bash
git clone https://github.com/Vansh1252/school-mangement-backend-.git
cd school-mangement-backend-
npm install
~~~

Create a `.env` file in the project root:

~~~env
PORT=5000
DATABASE_URL=mongodb+srv://<user>:<password>@<cluster>/
DBNAME=school_management
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:5173
AUTH_EMAIL=your_email@gmail.com
AUTH_PASS=your_email_app_password
~~~

Run the server:

~~~bash
npm run dev     # with nodemon
npm start       # production
~~~

## Author

**Vansh Jain**: [GitHub](https://github.com/Vansh1252) · sanklechav65@gmail.com
