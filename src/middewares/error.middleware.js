const errorHandler = (err, req, res, next) => {
  // Log error untuk debugging
  console.error(err.stack);

  // Default status code
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Jika error dari validasi atau yang lain, sesuaikan
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // Response JSON
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
