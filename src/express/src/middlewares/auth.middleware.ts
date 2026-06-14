import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";

type JwtPayload = {
  id: number;
  email: string;
};

const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
  GUEST: "guest"
} as const;
type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized: No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1]??"";

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, config.jwt.access) as unknown as JwtPayload;
    } catch {
      res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
      return;
    }

    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [decoded.email]);
    const user = result.rows[0];

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!user.is_active) {
      res.status(403).json({ message: "Forbidden: User account is inactive" });
      return;
    }
    if (roles.length > 0 && !roles.includes(user.role)) {
      res.status(403).json({ message: "Forbidden: Insufficient permissions" });
      return;
    }
    req.user = user;
    next();
  };
};
