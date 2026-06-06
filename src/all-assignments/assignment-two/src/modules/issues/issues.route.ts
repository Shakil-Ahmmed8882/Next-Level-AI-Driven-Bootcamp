import { Router } from 'express';
import { authMiddleware, requireRole } from '../../middlewares/auth.middleware.js';
import { issueControllers } from './issues.controller.js';

const router = Router();

router.post('/', authMiddleware, issueControllers.createIssue);
router.get('/', issueControllers.getIssues);
router.get('/:id', issueControllers.getIssueById);
router.patch('/:id', authMiddleware, issueControllers.updateIssue);
router.delete('/:id', authMiddleware, requireRole(['maintainer']), issueControllers.deleteIssue);

export const issueRoute = router;
