import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.middleware.js';
import { createIssueHandler, deleteIssueHandler, getIssueHandler, listIssuesHandler, updateIssueHandler, } from './issues.controller.js';
const router = Router();
// GET /api/issues - List all issues (public)
router.get('/', listIssuesHandler);
// GET /api/issues/:id - Get single issue (public)
router.get('/:id', getIssueHandler);
// POST /api/issues - Create issue (authenticated users)
router.post('/', authenticate, createIssueHandler);
// PATCH /api/issues/:id - Update issue (authenticated with permissions)
router.patch('/:id', authenticate, updateIssueHandler);
// DELETE /api/issues/:id - Delete issue (maintainer only)
router.delete('/:id', authenticate, requireRole('maintainer'), deleteIssueHandler);
export default router;
//# sourceMappingURL=issues.routes.js.map