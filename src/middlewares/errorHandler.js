// src/middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || 'Something went wrong';

  res.status(statusCode).json({
    status: statusCode,
    message: message,
    data: err.details || {},
  });
};

export default errorHandler;
