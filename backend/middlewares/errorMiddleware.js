import { AppError } from '../utils/AppError.js';
export const notFound = (req, res, next) => {
    const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
    next(error);
};
export const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;
    if (err instanceof AppError) {
        statusCode = err.statusCode;
    }
    // Handle Mongoose bad ObjectId
    if (err.name === 'CastError') {
        message = `Resource not found`;
        statusCode = 404;
    }
    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};
//# sourceMappingURL=errorMiddleware.js.map