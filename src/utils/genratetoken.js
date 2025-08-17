import jwt from 'jsonwebtoken';

// token generation 
export const generateToken = (payload) => {
    try {
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        return token;
    } catch (error) {
        throw new Error("Token generation failed");
    }
};

