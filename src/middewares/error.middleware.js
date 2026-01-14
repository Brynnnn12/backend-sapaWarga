const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Terjadi kesalahan internal server";

  // Handle specific error types
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Error validasi data";
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Format ID tidak valid";
  } else if (err.code === "P2002") {
    // Prisma unique constraint error
    statusCode = 409;
    message = "Data sudah ada";
  } else if (err.code === "P2025") {
    // Prisma record not found
    statusCode = 404;
    message = "Data tidak ditemukan";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      error: err.message,
    }),
  });
};

export default errorHandler;
