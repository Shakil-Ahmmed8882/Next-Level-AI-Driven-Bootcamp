import type { UserInterface } from "./user.interface";
import { pool } from "../../db";

const createUserIntoDB = async (user: UserInterface) => {
  const result = await pool.query(
    `INSERT INTO users(name, email, is_active, age, password)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [user.name, user.email, user.is_active, user.age, user.password]
  );
  return result.rows[0];
};

const getAllUsersFromDB = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result.rows;
};

const getUserByIdFromDB = async (id: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return result.rows[0] || null;
};

const updateUserInDB = async (id: string, user: Partial<UserInterface>) => {
  const result = await pool.query(
    `UPDATE users
     SET name = COALESCE($1, name),
         email = COALESCE($2, email),
         is_active = COALESCE($3, is_active),
         age = COALESCE($4, age),
         password = COALESCE($5, password),
         updated_at = NOW()
     WHERE id = $6
     RETURNING *`,
    [user.name, user.email, user.is_active, user.age, user.password, id]
  );
  return result.rows[0] || null;
};

const deleteUserFromDB = async (id: string) => {
  const result = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [id]);
  return result.rows[0] || null;
};

export const userServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  getUserByIdFromDB,
  updateUserInDB,
  deleteUserFromDB
};