import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/AppError.js';
import { verifyJwt } from '../utils/jwt.js';


export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header) {
    return next(new AppError('Authentication token is missing', StatusCodes.UNAUTHORIZED));
  }

  // Support both "<token>" and "Bearer <token>"
  const token = header.startsWith('Bearer ')
    ? header.slice(7).trim()
    : header.trim();

  if (!token) {
    return next(new AppError('Authentication token is empty', StatusCodes.UNAUTHORIZED));
  }

  try {
    const decoded = verifyJwt(token);
    req.user = decoded;
    return next();
  } catch {
    return next(new AppError('Invalid or expired token', StatusCodes.UNAUTHORIZED));
  }
}

export function requireRole(...roles: Array<'contributor' | 'maintainer'>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required', StatusCodes.UNAUTHORIZED));
    }
    if (!roles.includes(req.user.role)) {
      return next(new AppError(
        'You do not have permission to perform this action',
        StatusCodes.FORBIDDEN
      ));
    }
    return next();
  };
}