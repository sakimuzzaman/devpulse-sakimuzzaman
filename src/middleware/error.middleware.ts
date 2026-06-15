
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/AppError.js";
import { sendError } from "../utils/response.js";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Custom App Error
  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.message, err.details);
  }

  // Invalid JSON Error
  if (err.type === "entity.parse.failed") {
    return sendError(
      res,
      StatusCodes.BAD_REQUEST,
      "Invalid JSON request"
    );
  }

  // Server Error
  console.error(err);

  return sendError(
    res,
    StatusCodes.INTERNAL_SERVER_ERROR,
    err.message || "Internal Server Error"
  );
};