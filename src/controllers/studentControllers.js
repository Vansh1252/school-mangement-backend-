import mongoose from 'mongoose';
import {
  createstudent,
  updateStudentService,
  getStudentsService,
  deletestudentservices,
  getonestudent,
  getonewithoutpagination,
  promoteStudentService,
  studentfeespaidupdate,
  getStudentFeesDetails
} from '../services/studentServices.js';

/**
 * Controller for creating a new student (and optionally parent)
 */
export const createstudents = async (req, res) => {
  try {
    const result = await createstudent(req);

    // If service fails to create the student or parent
    if (!result) {
      return res.status(400).json({ message: "Student and parent not added..!" });
    }

    // Successful creation
    res.status(result.statusCode).json(result);
  } catch (err) {
    // Handle unexpected errors
    console.log(err)
    const status = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(status).json({ message });
  }
};

/**
 * Controller to update a student by ID
 */
export const updateStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const result = await updateStudentService(studentId, req);

    // If update fails
    if (!result) {
      return res.status(400).json({ message: "Update failed...!" });
    }

    // Return updated result
    res.status(result.statusCode).json(result);
  } catch (err) {
    console.log(err)
    const status = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(status).json({ message });
  }
};

/**
 * Controller to get all students
 */
export const getStudentswithpagination = async (req, res) => {
  try {
    const result = await getStudentsService(req);

    // If no student data is found
    if (!result) {
      return res.status(400).json({ message: "Data not found...!" });
    }

    // Successfully return student data
    res.status(result.statusCode).json(result);
  } catch (err) {
    const status = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(status).json({ message });
  }
};

/**
 * Controller to get a single student by ID
 */
export const getonestudents = async (req, res) => {
  try {
    const studentId = req.params.id;
    const result = await getonestudent(studentId, req);
    // Return the result with status from service 
    res.status(result.statusCode).json(result.data);
  } catch (err) {
    const status = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(status).json({ message });
  }
};

/**
 * Controller to delete a student by ID
 */
export const studentdelete = async (req, res) => {
  try {
    const studentId = req.params.id;
    const result = await deletestudentservices(studentId, req);

    // Return service response
    res.status(result.statusCode).json(result);
  } catch (err) {
    const status = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(status).json({ message });
  }
};

export const getonewithoutpaginations = async (req, res) => {
  try {
    const result = await getonewithoutpagination(req);
    res.status(result.statusCode).json(result);

  } catch (error) {
    const status = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(status).json({ message });
  }
};


export const studentpromtions = async (req, res) => {
  try {
    const result = await promoteStudentService(req);
    res.status(result.statusCode).json(result);
  } catch (err) {
    console.log(err)
    const status = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(status).json({ message }, err);
  }
}

/**
 * Controller to update student fees
 */
export const updateStudentFees = async (req, res) => {
  try {
    const studentId = req.params.id;
    const result = await studentfeespaidupdate(studentId, req);
    res.status(result.statusCode).json(result);
  } catch (err) {
    const status = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(status).json({ message });
  }
};

/**
 * Controller to get student fees details
 */
export const getStudentFeesInfo = async (req, res) => {
  try {
    const studentId = req.params.id;
    const result = await getStudentFeesDetails(studentId, req);
    res.status(result.statusCode).json(result);
  } catch (err) {
    const status = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(status).json({ message });
  }
};