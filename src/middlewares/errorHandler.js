import { HttpError } from 'http-errors';

export const errorHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
    });
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err.message,
  });
};
