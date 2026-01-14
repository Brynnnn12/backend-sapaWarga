// Utility untuk format response API yang konsisten
export const apiResponse = (
  res,
  statusCode,
  success,
  message,
  data = null,
  meta = null
) => {
  const response = {
    success,
    message,
  };

  if (data !== null && data !== undefined) {
    response.data = data;
  }

  if (meta) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

// Helper untuk response sukses
export const successResponse = (
  res,
  message,
  data = null,
  meta = null,
  statusCode = 200
) => {
  return apiResponse(res, statusCode, true, message, data);
};

// Helper untuk response error
export const errorResponse = (res, message, statusCode = 500, data = null) => {
  return apiResponse(res, statusCode, false, message, data);
};

// Helper untuk response dengan pagination
export const paginatedResponse = (res, message, data, pagination) => {
  const meta = {
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.limit),
    },
  };

  return successResponse(res, message, data, meta);
};

// Helper untuk response validation error
export const validationErrorResponse = (res, errors) => {
  return res.status(422).json({
    success: false,
    message: { errors },
  });
};

// Helper untuk response unauthorized
export const unauthorizedResponse = (res, message = "Unauthorized access") => {
  return errorResponse(res, message, 401);
};

// Helper untuk response forbidden
export const forbiddenResponse = (res, message = "Access forbidden") => {
  return errorResponse(res, message, 403);
};

// Helper untuk response not found
export const notFoundResponse = (res, message = "Resource not found") => {
  return errorResponse(res, message, 404);
};
