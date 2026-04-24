/**
 * TODO: Handle 404 errors
 *
 * Return 404: { error: { message: "Route not found" } }
 */
export function notFound(req, res) {
  return res.status(404).json({error: {message: "Route not found"}});
}
