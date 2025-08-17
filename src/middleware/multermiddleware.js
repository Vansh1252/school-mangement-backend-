import multer from "multer";
import path from 'path';

/**
 * Multer storage configuration for handling file uploads.
 * - destination: sets the upload directory.
 * - filename: generates a unique filename using timestamp and random number.
 */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = './uploads/';
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

/**
 * File filter to allow only image files (jpeg, jpg, png).
 * Rejects other file types.
 */
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/; // Accept only image files
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png).')); // Reject invalid files
    }
};

/**
 * Multer middleware instance with custom storage and file filter.
 * Use this as middleware in your routes for file uploads.
 */
const upload = multer({
    storage,
    fileFilter
});

export default upload;