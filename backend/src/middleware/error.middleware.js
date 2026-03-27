import { ZodError } from "zod";

const errorHandler = (err, req, res, next) => {
  console.error("ERROR:", err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.issues.map((e) => ({
        field: e.path[0],
        message: e.message,
      })),
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
    });
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: messages.join(", "),
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicate field value entered",
    });
  }

  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
};

export default errorHandler;
