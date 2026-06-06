import { Request, Response, NextFunction } from 'express';
import { issueServices } from './issues.service.js';

const createIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, type } = req.body || {};

    if (!title || !description || !type) {
      res.status(400).json({ success: false, message: 'Title, description, and type are required' });
      return;
    }

    if (title.length < 1 || title.length > 150) {
      res.status(400).json({ success: false, message: 'Title must be between 1 and 150 characters' });
      return;
    }

    if (description.length < 20) {
      res.status(400).json({ success: false, message: 'Description must be at least 20 characters' });
      return;
    }

    if (type !== 'bug' && type !== 'feature_request') {
      res.status(400).json({ success: false, message: 'Type must be bug or feature_request' });
      return;
    }

    const result = await issueServices.createIssueInDB(title, description, type, req.user!.id);

    res.status(201).json({
      success: true,
      message: 'Issue created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getIssues = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sort = req.query.sort as string | undefined;
    const type = req.query.type as string | undefined;
    const status = req.query.status as string | undefined;

    const result = await issueServices.getAllIssuesFromDB(sort, type, status);

    res.status(200).json({
      success: true,
      message: 'Issues retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getIssueById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const result = await issueServices.getIssueByIdFromDB(id);

    if (!result) {
      res.status(404).json({ success: false, message: 'Issue not found', data: null });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Issue retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { title, description, type, status } = req.body || {};

    if (title && (title.length < 1 || title.length > 150)) {
      res.status(400).json({ success: false, message: 'Title must be between 1 and 150 characters' });
      return;
    }

    if (description && description.length < 20) {
      res.status(400).json({ success: false, message: 'Description must be at least 20 characters' });
      return;
    }

    if (type && type !== 'bug' && type !== 'feature_request') {
      res.status(400).json({ success: false, message: 'Type must be bug or feature_request' });
      return;
    }

    if (status && !['open', 'in_progress', 'resolved'].includes(status)) {
      res.status(400).json({ success: false, message: 'Status must be open, in_progress, or resolved' });
      return;
    }

    const result = await issueServices.updateIssueInDB(
      id,
      req.user!.id,
      req.user!.role,
      title,
      description,
      type,
      status
    );

    res.status(200).json({
      success: true,
      message: 'Issue updated successfully',
      data: result,
    });
  } catch (error: any) {
    if (error.message === 'Issue not found') {
      res.status(404).json({ success: false, message: error.message });
      return;
    }
    if (error.message?.includes('only')) {
      res.status(403).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
};

const deleteIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const result = await issueServices.deleteIssueFromDB(id);

    if (!result) {
      res.status(404).json({ success: false, message: 'Issue not found', data: null });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Issue deleted successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const issueControllers = {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
};
