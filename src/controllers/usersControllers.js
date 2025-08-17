import { createuserservice, loginuser, forgotPasswordService, resetPasswordService, userdata, getalluserdetail, updateProfilePhotoService } from '../services/userService.js';

// Controller to create a new user (admin registration)
export const createuser = async (req, res) => {
    try {
        const newuser = await createuserservice(req);
        return res.status(newuser.statusCode).json({
            message: newuser.message,
            data: newuser.data
        });
    } catch (err) {
        const statusCode = err.statusCode || 500;
        const message = err.message || "Something went wrong...!";
        return res.status(statusCode).json({ message });
    }
};

// Controller for user login
export const loginUser = async (req, res) => {
    try {
        const result = await loginuser(req);
        return res.status(result.statusCode).json(result);
    } catch (err) {
        const statusCode = err.statusCode || 500;
        const message = err.message || "Something went wrong...!";
        return res.status(statusCode).json({ message });
    }
};

// Controller for user logout
export const logout = async (req, res) => {
    try {
        // If you are storing tokens in cookies, clear the cookie:
        // res.clearCookie('token');

        // Or just send a response indicating logout success:
        res.status(200).json({
            statusCode: 200,
            message: "Logout successful. Please discard your token on client side."
        });
    } catch (err) {
        res.status(500).json({
            statusCode: 500,
            message: "Logout failed.",
            err: err.message
        });
    }
};

// Controller for forgot password (send reset email)
export async function forgotPasswordController(req, res) {
    try {
        const { email } = req.body;
        const result = await forgotPasswordService(email);
        res.status(200).json(result);
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message || 'Something went wrong' });
    }
}

// Controller for resetting password using token
export async function resetPasswordController(req, res) {
    try {
        const { id, token } = req.params;  // from URL: /reset-password/:id/:token
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({ message: 'New password is required.' });
        }

        const result = await resetPasswordService(id, token, newPassword);
        res.status(200).json(result);
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message || 'Something went wrong.' });
    }
}

// Controller to get the currently logged-in user's data
export const getuserdata = async (req, res) => {
    try {
        const result = await userdata(req);
        if (!result) {
            return res.status(400).json(result.message);
        }
        return res.status(200).json(result);
    } catch (err) {
        const statusCode = err.statusCode || 500;
        const message = err.message || "Something went wrong...!";
        return res.status(statusCode).json({ message });
    }
}

// Controller to get all details of the logged-in user (with profile info)
export const getalluserdetails = async (req, res) => {
    try {
        const result = await getalluserdetail(req);
        if (!result) {
            return res.status(400).json(result.message);
        }
        return res.status(200).json(result);
    } catch (err) {
        const statusCode = err.statusCode || 500;
        const message = err.message || "Something went wrong...!";
        return res.status(statusCode).json({ message });
    }
}

// Controller to update the profile photo of the logged-in user
export const updateProfilePhoto = async (req, res) => {
    try {
        const result = await updateProfilePhotoService(req);
        return res.status(result.statusCode).json({
            message: result.message,
            profile_photo: result.profile_photo,
            updatedProfile: result.updatedProfile
        });
    } catch (err) {
        const statusCode = err.statusCode || 500;
        const message = err.message || "Something went wrong...!";
        return res.status(statusCode).json({ message });
    }
};