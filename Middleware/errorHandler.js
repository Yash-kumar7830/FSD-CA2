function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({ message: error.message });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid book ID" });
  }

  if (error.status === 400) {
    return res.status(400).json({ message: error.message });
  }

  console.error("API error:", error);
  return res.status(500).json({ message: "Internal server error" });
}

module.exports = errorHandler;
