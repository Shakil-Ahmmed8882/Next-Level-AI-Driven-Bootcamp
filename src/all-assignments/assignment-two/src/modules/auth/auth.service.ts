import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../../db/index.js';
import { config } from '../../config/index.js';

const signupUserIntoDB = async (name: string, email: string, password: string, role: string) => {
  const existingUser = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );

  if (existingUser.rows[0]) {
    throw new Error('Email already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at, updated_at`,
    [name, email, hashedPassword, role]
  );
  return result.rows[0];
};

const loginUserIntoDB = async (email: string, password: string) => {
  const userResult = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );

  const userData = userResult.rows[0];
  if (!userData) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, userData.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const jwtPayload = {
    id: userData.id,
    name: userData.name,
    role: userData.role,
  };

  const token = jwt.sign(jwtPayload, config.jwt.secret as any, {
    expiresIn: '7d',
  });

  const userResponse = {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    role: userData.role,
    created_at: userData.created_at,
    updated_at: userData.updated_at,
  };

  return { token, user: userResponse };
};

export const authServices = {
  signupUserIntoDB,
  loginUserIntoDB,
};
