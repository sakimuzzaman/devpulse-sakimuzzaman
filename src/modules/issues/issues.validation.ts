import { StatusCodes } from 'http-status-codes';
import { AppError } from '../../utils/AppError.js';
import {
  CreateIssueInput,
  IssueStatus,
  IssueType,
  ListIssuesQuery,
  SortOrder,
  UpdateIssueInput,
} from './issues.types.js';

const VALID_TYPES: IssueType[] = ['bug', 'feature_request'];
const VALID_STATUSES: IssueStatus[] = ['open', 'in_progress', 'resolved'];
const VALID_SORTS: SortOrder[] = ['newest', 'oldest'];

export function validateIdParam(raw: string): number {
  const id = Number(raw);
  
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError('Invalid issue ID:', StatusCodes.BAD_REQUEST);
  }
  
  return id;
}

export function validateCreateIssueInput(body: unknown): CreateIssueInput {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new AppError('Request body must be a valid JSON object', StatusCodes.BAD_REQUEST);
  }

  const input = body as Record<string, unknown>;
  const errors: string[] = [];

  // Validate title
  if (typeof input.title !== 'string' || input.title.trim().length === 0) {
    errors.push('Title is required');
  } else if (input.title.trim().length > 150) {
    errors.push('Title must not exceed 150 characters');
  }

  // Validate description
  if (typeof input.description !== 'string') {
    errors.push('Description is required');
  } else if (input.description.trim().length < 20) {
    errors.push('Description must be at least 20 characters');
  }

  // Validate type
  if (typeof input.type !== 'string' || !VALID_TYPES.includes(input.type as IssueType)) {
    errors.push('Type must be either "bug" or "feature_request"');
  }

  if (errors.length > 0) {
    throw new AppError('Validation failed', StatusCodes.BAD_REQUEST, errors);
  }

  return {
    title: (input.title as string).trim(),
    description: (input.description as string).trim(),
    type: input.type as IssueType,
  };
}

export function validateUpdateIssueInput(body: unknown): UpdateIssueInput {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new AppError('Request body must be a valid JSON object', StatusCodes.BAD_REQUEST);
  }

  const input = body as Record<string, unknown>;
  const errors: string[] = [];
  const result: UpdateIssueInput = {};

  // Optional title
  if (input.title !== undefined) {
    if (typeof input.title !== 'string' || input.title.trim().length === 0) {
      errors.push('Title must be a non-empty string');
    } else if (input.title.trim().length > 150) {
      errors.push('Title must not exceed 150 characters');
    } else {
      result.title = input.title.trim();
    }
  }

  // Optional description
  if (input.description !== undefined) {
    if (typeof input.description !== 'string') {
      errors.push('Description must be a string');
    } else if (input.description.trim().length < 20) {
      errors.push('Description must be at least 20 characters');
    } else {
      result.description = input.description.trim();
    }
  }

  // Optional type
  if (input.type !== undefined) {
    if (typeof input.type !== 'string' || !VALID_TYPES.includes(input.type as IssueType)) {
      errors.push('Type must be either "bug" or "feature_request"');
    } else {
      result.type = input.type as IssueType;
    }
  }

  // Optional status
  if (input.status !== undefined) {
    if (typeof input.status !== 'string' || !VALID_STATUSES.includes(input.status as IssueStatus)) {
      errors.push('Status must be one of: "open", "in_progress", "resolved"');
    } else {
      result.status = input.status as IssueStatus;
    }
  }

  if (errors.length > 0) {
    throw new AppError('Validation failed', StatusCodes.BAD_REQUEST, errors);
  }

  if (Object.keys(result).length === 0) {
    throw new AppError('At least one field must be provided to update', StatusCodes.BAD_REQUEST);
  }

  return result;
}

export function validateListIssuesQuery(query: unknown): ListIssuesQuery {
  const q = (query || {}) as Record<string, unknown>;
  const errors: string[] = [];

  // Validate sort (default: newest)
  const sortRaw = (q.sort as string) || 'newest';
  if (!VALID_SORTS.includes(sortRaw as SortOrder)) {
    errors.push('Sort must be either "newest" or "oldest"');
  }

  // Validate optional type filter
  let type: IssueType | undefined;
  if (q.type !== undefined) {
    if (typeof q.type !== 'string' || !VALID_TYPES.includes(q.type as IssueType)) {
      errors.push('Type filter must be either "bug" or "feature_request"');
    } else {
      type = q.type as IssueType;
    }
  }

  // Validate optional status filter
  let status: IssueStatus | undefined;
  if (q.status !== undefined) {
    if (typeof q.status !== 'string' || !VALID_STATUSES.includes(q.status as IssueStatus)) {
      errors.push('Status filter must be one of: "open", "in_progress", "resolved"');
    } else {
      status = q.status as IssueStatus;
    }
  }

  if (errors.length > 0) {
    throw new AppError('Invalid query parameters', StatusCodes.BAD_REQUEST, errors);
  }

  return {
    sort: sortRaw as SortOrder,
    type,
    status,
  };
}