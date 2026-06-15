import { StatusCodes } from 'http-status-codes';
import { LoginInput, SignupInput, UserRole } from './auth.types.js';
import { AppError } from '../../utils/AppError.js';


const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_ROLES: UserRole[] = ['contributor', 'maintainer'];

export function validateSignupInput(body: unknown): SignupInput {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new AppError('Request body must be a valid JSON object', StatusCodes.BAD_REQUEST);
  }

  const input = body as Record<string, unknown>;
  const errors: string[] = [];

  // Validate name
  if (typeof input.name !== 'string' || input.name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string');
  }

  // Validate email
  if (typeof input.email !== 'string' || !EMAIL_REGEX.test(input.email.trim())) {
    errors.push('A valid email address is required');
  }

  // Validate password
  if (typeof input.password !== 'string' || input.password.length < 6) {
    errors.push('Password is required and must be at least 6 characters long');
  }

  // Validate role
  if (typeof input.role !== 'string' || !VALID_ROLES.includes(input.role as UserRole)) {
    errors.push('Role must be either "contributor" or "maintainer"');
  }

  if (errors.length > 0) {
    throw new AppError('Validation failed', StatusCodes.BAD_REQUEST, errors);
  }

  return {
    name: (input.name as string).trim(),
    email: (input.email as string).trim().toLowerCase(),
    password: input.password as string,
    role: input.role as UserRole,
  };
}

export function validateLoginInput(body: unknown): LoginInput {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new AppError('Request body must be a valid JSON object', StatusCodes.BAD_REQUEST);
  }

  const input = body as Record<string, unknown>;
  const errors: string[] = [];

  // Validate email
  if (typeof input.email !== 'string' || !EMAIL_REGEX.test(input.email.trim())) {
    errors.push('A valid email address is required');
  }

  // Validate password
  if (typeof input.password !== 'string' || input.password.length === 0) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    throw new AppError('Validation failed', StatusCodes.BAD_REQUEST, errors);
  }

  return {
    email: (input.email as string).trim().toLowerCase(),
    password: input.password as string,
  };
}