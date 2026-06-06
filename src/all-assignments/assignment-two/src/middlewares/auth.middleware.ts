import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { sendError } from '../utils/response.js';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        name: string;
        role: string;
      };
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization;

  if (!token) {
    sendError(res, 401, 'Missing authorization token');
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as {
      id: number;
      name: string;
      role: string;
    };
    req.user = decoded;
    next();
  } catch {
    sendError(res, 401, 'Invalid or expired token');
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      sendError(res, 403, 'Insufficient permissions');
      return;
    }
    next();
  };
};
