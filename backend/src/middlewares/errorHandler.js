function errorHandler(err, req, res, next) {
  console.error(" Error Handler Caught:", err);

  let statusCode = 500;
  let message = "Server Error";

  
  if (err.code === "23505") {
    statusCode = 400;
    message = "Duplicate value entered. " + (err.detail || "");
  }

  
  if (err.code === "23503") {
    statusCode = 400;
    message = "Invalid reference: " + (err.detail || "");
  }

  
  if (err.code === "23502") {
    statusCode = 400;
    message = `Missing field: ${err.column}`;
  }

  if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message || message;
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    code: err.code, 
  });
}

export default errorHandler;
