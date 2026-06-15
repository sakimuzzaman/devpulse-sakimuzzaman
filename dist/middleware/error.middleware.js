import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/AppError.js";
import { sendError } from "../utils/response.js";
export const errorHandler = (err, _req, res, _next) => {
    // Custom App Error
    if (err instanceof AppError) {
        return sendError(res, err.statusCode, err.message, err.details);
    }
    // Invalid JSON Error
    if (err.type === "entity.parse.failed") {
        return sendError(res, StatusCodes.BAD_REQUEST, "Invalid JSON request");
    }
    // Server Error
    console.error(err);
    return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, err.message || "Internal Server Error");
};
//# sourceMappingURL=error.middleware.js.map