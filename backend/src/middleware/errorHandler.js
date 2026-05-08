export function errorHandler(err, _req, res, _next) {
  const status = err.status || err.statusCode || 500;
  const isDev = process.env.NODE_ENV !== "production";
  console.error("[" + new Date().toISOString() + "] " + status + " — " + err.message);
  res.status(status).json({
    error: err.message || "Internal server error",
    ...(isDev && { stack: err.stack }),
  });
}
