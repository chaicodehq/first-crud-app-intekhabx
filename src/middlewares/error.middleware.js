/**
 * TODO: Handle errors
 *
 * Required error format: { error: { message: "..." } }
 *
 * Handle these cases:
 * 1. Mongoose ValidationError → 400 with combined error messages
 * 2. Mongoose CastError → 400 with "Invalid id format"
 * 3. Other errors → Use err.status (or 500) and err.message
 */
export function errorHandler(err, req, res, next) {
  if(err.name === 'ValidationError'){
    return res.status(400).json({error: {message: err.message}})
  }
  else if(err.name === 'CastError'){
    return res.status(400).json({error: {message: "Invalid id format"}})
  }
  else{
    return res.status(500).json({error: {message: err.message || "Internal Server Error"}})
  }
}
