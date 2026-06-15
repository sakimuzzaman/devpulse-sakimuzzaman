import { StatusCodes } from 'http-status-codes';
import { AppError } from '../../utils/AppError.js';
import { JwtPayload } from '../../utils/jwt.js';
import {
  CreateIssueInput,
  IssueRecord,
  IssueWithReporter,
  ListIssuesQuery,
  ReporterInfo,
  UpdateIssueInput,
} from './issues.types.js';
import pool from '../../db/index.js';



async function fetchReportersByIds(
  ids: number[]
): Promise<Map<number, ReporterInfo>> {
  const reporterMap = new Map<number, ReporterInfo>();

  if (ids.length === 0) return reporterMap;

  const placeholders = ids.map((_, index) => `$${index + 1}`).join(', ');

  const result = await pool.query<ReporterInfo>(
    `SELECT id, name, role FROM users WHERE id IN (${placeholders})`,
    ids
  );

  for (const row of result.rows) {
    reporterMap.set(row.id, row);
  }

  return reporterMap;
}

function attachReporter(
  issue: IssueRecord,
  reporter: ReporterInfo | undefined
): IssueWithReporter {
  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: reporter ?? null,
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };
}



export async function createIssue(
  input: CreateIssueInput,
  reporterId: number
): Promise<IssueRecord> {
  const userExists = await pool.query<{ id: number }>(
    'SELECT id FROM users WHERE id = $1',
    [reporterId]
  );

  if ((userExists.rowCount ?? 0) === 0) {
    throw new AppError(
      'Reporter account no longer exists',
      StatusCodes.UNAUTHORIZED
    );
  }

  const result = await pool.query<IssueRecord>(
    `INSERT INTO issues (title, description, type, status, reporter_id)
     VALUES ($1, $2, $3, 'open', $4)
     RETURNING id, title, description, type, status, reporter_id, created_at, updated_at`,
    [input.title, input.description, input.type, reporterId]
  );

  const issue = result.rows[0];

  if (!issue) {
    throw new AppError(
      'Failed to create issue',
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  return issue;
}

export async function listIssues(
  query: ListIssuesQuery
): Promise<IssueWithReporter[]> {
  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 0;

  if (query.type) {
    paramIndex++;
    params.push(query.type);
    conditions.push(`type = $${paramIndex}`);
  }

  if (query.status) {
    paramIndex++;
    params.push(query.status);
    conditions.push(`status = $${paramIndex}`);
  }

  const whereClause =
    conditions.length > 0
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

  const orderDirection =
    query.sort === 'oldest'
      ? 'ASC'
      : 'DESC';

  const result = await pool.query<IssueRecord>(
    `SELECT id, title, description, type, status, reporter_id, created_at, updated_at
     FROM issues
     ${whereClause}
     ORDER BY created_at ${orderDirection}`,
    params
  );

  const issues = result.rows;

  const uniqueReporterIds = Array.from(
    new Set(issues.map((issue) => issue.reporter_id))
  );

  const reporterMap = await fetchReportersByIds(uniqueReporterIds);

  return issues.map((issue) =>
    attachReporter(issue, reporterMap.get(issue.reporter_id))
  );
}

export async function getIssueById(
  id: number
): Promise<IssueWithReporter> {
  const issueResult = await pool.query<IssueRecord>(
    `SELECT id, title, description, type, status, reporter_id, created_at, updated_at
     FROM issues
     WHERE id = $1`,
    [id]
  );

  if ((issueResult.rowCount ?? 0) === 0) {
    throw new AppError('Issue not found', StatusCodes.NOT_FOUND);
  }

  const issue = issueResult.rows[0];

  if (!issue) {
    throw new AppError('Issue not found', StatusCodes.NOT_FOUND);
  }

  const reporterResult = await pool.query<ReporterInfo>(
    `SELECT id, name, role FROM users WHERE id = $1`,
    [issue.reporter_id]
  );

  const reporter = reporterResult.rows[0];

  return attachReporter(issue, reporter);
}

export async function updateIssue(
  id: number,
  input: UpdateIssueInput,
  requester: JwtPayload
): Promise<IssueRecord> {
  const existingResult = await pool.query<IssueRecord>(
    `SELECT id, title, description, type, status, reporter_id, created_at, updated_at
     FROM issues
     WHERE id = $1`,
    [id]
  );

  if ((existingResult.rowCount ?? 0) === 0) {
    throw new AppError('Issue not found', StatusCodes.NOT_FOUND);
  }

  const existingIssue = existingResult.rows[0];

  if (!existingIssue) {
    throw new AppError('Issue not found', StatusCodes.NOT_FOUND);
  }

  if (requester.role === 'contributor') {
    if (existingIssue.reporter_id !== requester.id) {
      throw new AppError(
        'You can only update your own issues',
        StatusCodes.FORBIDDEN
      );
    }

    if (existingIssue.status !== 'open') {
      throw new AppError(
        'You can only update issues that are in "open" status',
        StatusCodes.CONFLICT
      );
    }

    if (input.status !== undefined) {
      throw new AppError(
        'Contributors are not allowed to change issue status',
        StatusCodes.FORBIDDEN
      );
    }
  }

  const setClauses: string[] = [];
  const updateParams: unknown[] = [];
  let paramCounter = 0;

  if (input.title !== undefined) {
    paramCounter++;
    updateParams.push(input.title);
    setClauses.push(`title = $${paramCounter}`);
  }

  if (input.description !== undefined) {
    paramCounter++;
    updateParams.push(input.description);
    setClauses.push(`description = $${paramCounter}`);
  }

  if (input.type !== undefined) {
    paramCounter++;
    updateParams.push(input.type);
    setClauses.push(`type = $${paramCounter}`);
  }

  if (input.status !== undefined) {
    paramCounter++;
    updateParams.push(input.status);
    setClauses.push(`status = $${paramCounter}`);
  }

  setClauses.push(`updated_at = CURRENT_TIMESTAMP`);

  paramCounter++;
  updateParams.push(id);

  const updateSql = `
    UPDATE issues
    SET ${setClauses.join(', ')}
    WHERE id = $${paramCounter}
    RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
  `;

  const updatedResult = await pool.query<IssueRecord>(
    updateSql,
    updateParams
  );

  const updatedIssue = updatedResult.rows[0];

  if (!updatedIssue) {
    throw new AppError(
      'Failed to update issue',
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  return updatedIssue;
}

export async function deleteIssue(id: number): Promise<void> {
  const existingResult = await pool.query<{ id: number }>(
    'SELECT id FROM issues WHERE id = $1',
    [id]
  );

  if ((existingResult.rowCount ?? 0) === 0) {
    throw new AppError('Issue not found', StatusCodes.NOT_FOUND);
  }

  await pool.query(
    'DELETE FROM issues WHERE id = $1',
    [id]
  );
}