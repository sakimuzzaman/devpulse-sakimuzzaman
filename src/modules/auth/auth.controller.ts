import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import { validateSignupInput, validateLoginInput } from './auth.validation.js';
import { registerUser, loginUser } from './auth.service.js';

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const input = validateSignupInput(req.body);
  const user = await registerUser(input);
  return sendSuccess(res, StatusCodes.CREATED, 'User registered successfully', user);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const input = validateLoginInput(req.body);
  const result = await loginUser(input);
  return sendSuccess(res, StatusCodes.OK, 'Login successful', result);
});