import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
export const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: (process.env.JWT_EXPIRES_IN || '7d'),
    });
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: true, // MUST be true for sameSite: 'none'
        sameSite: 'none', // Required for cross-origin cookies (Vercel -> Render)
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return token;
};
//# sourceMappingURL=jwt.js.map