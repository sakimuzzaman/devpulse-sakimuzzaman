import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import { AppError } from '../../utils/AppError.js';
import {
  validateCreateIssueInput,
  validateIdParam,
  validateListIssuesQuery,
  validateUpdateIssueInput,
} from './issues.validation.js';
import {
  createIssue,
  deleteIssue,
  getIssueById,
  listIssues,
  updateIssue,
} from './issues.service.js';


function getValidatedId(id: string | string[] | undefined): number {
  if (!id || Array.isArray(id)) {
    throw new AppError('Invalid issue ID', StatusCodes.BAD_REQUEST);
  }

  return validateIdParam(id);
}


export const createIssueHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', StatusCodes.UNAUTHORIZED);
  }

  const input = validateCreateIssueInput(req.body);
  const issue = await createIssue(input, req.user.id);

  return sendSuccess(
    res,
    StatusCodes.CREATED,
    'Issue created successfully',
    issue
  );
});


export const listIssuesHandler = asyncHandler(async (req: Request, res: Response) => {
  const query = validateListIssuesQuery(req.query);
  const issues = await listIssues(query);

  return sendSuccess(
    res,
    StatusCodes.OK,
    'Issues retrieved successfully',
    issues
  );
});


export const getIssueHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = getValidatedId(req.params.id);

  const issue = await getIssueById(id);

  return sendSuccess(
    res,
    StatusCodes.OK,
    'Issue retrieved successfully',
    issue
  );
});


export const updateIssueHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', StatusCodes.UNAUTHORIZED);
  }

  const id = getValidatedId(req.params.id);
  const input = validateUpdateIssueInput(req.body);

  const updatedIssue = await updateIssue(
    id,
    input,
    req.user
  );

  return sendSuccess(
    res,
    StatusCodes.OK,
    'Issue updated successfully',
    updatedIssue
  );
});


export const deleteIssueHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = getValidatedId(req.params.id);

  await deleteIssue(id);

  return sendSuccess(
    res,
    StatusCodes.OK,
    'Issue deleted successfully'
  );
});