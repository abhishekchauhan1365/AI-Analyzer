import { User } from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { AppError } from '../utils/AppError.js';
export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return next(new AppError('User already exists', 400));
        }
        const user = await User.create({
            name,
            email,
            password,
        });
        if (user) {
            generateToken(res, user._id.toString());
            res.status(201).json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            });
        }
        else {
            return next(new AppError('Invalid user data', 400));
        }
    }
    catch (error) {
        next(error);
    }
};
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (user && (await user.comparePassword(password))) {
            generateToken(res, user._id.toString());
            res.json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            });
        }
        else {
            return next(new AppError('Invalid email or password', 401));
        }
    }
    catch (error) {
        next(error);
    }
};
export const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};
export const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user?._id);
        if (user) {
            res.json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            });
        }
        else {
            return next(new AppError('User not found', 404));
        }
    }
    catch (error) {
        next(error);
    }
};
export const updateUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user?._id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            if (req.body.password) {
                user.password = req.body.password;
            }
            const updatedUser = await user.save();
            res.json({
                success: true,
                data: {
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.role,
                }
            });
        }
        else {
            return next(new AppError('User not found', 404));
        }
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=authController.js.map