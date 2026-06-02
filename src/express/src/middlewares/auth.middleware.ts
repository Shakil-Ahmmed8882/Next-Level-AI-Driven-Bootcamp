import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";

type JwtPayload = {
  id: number;
  email: string;
};

export const auth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized: No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, config.jwtSecret) as unknown as JwtPayload;
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

    (req as any).user = user;
    next();
  };
};
