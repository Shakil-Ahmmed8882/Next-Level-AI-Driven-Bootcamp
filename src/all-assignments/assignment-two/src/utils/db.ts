import pool from '../db/index.js';

export const getAllUsers = async (): Promise<any[]> => {
  const result = await pool.query('SELECT id, name, email, role, created_at, updated_at FROM users');
  return result.rows;
};

export const getUserById = async (id: number): Promise<any> => {
  const result = await pool.query(
    'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

export const getUserByEmail = async (email: string): Promise<any> => {
  const result = await pool.query(
    'SELECT id, name, email, password, role, created_at, updated_at FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

export const createUser = async (
  name: string,
  email: string,
  hashedPassword: string,
  role: string
): Promise<any> => {
  const result = await pool.query(
    'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at, updated_at',
    [name, email, hashedPassword, role]
  );
  return result.rows[0];
};

export const createIssue = async (
  title: string,
  description: string,
  type: string,
  reporterId: number
): Promise<any> => {
  const result = await pool.query(
    'INSERT INTO issues (title, description, type, status, reporter_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [title, description, type, 'open', reporterId]
  );
  return result.rows[0];
};

export const getAllIssues = async (): Promise<any[]> => {
  const result = await pool.query(
    'SELECT id, title, description, type, status, reporter_id, created_at, updated_at FROM issues'
  );
  return result.rows;
};

export const getIssueById = async (id: number): Promise<any> => {
  const result = await pool.query(
    'SELECT id, title, description, type, status, reporter_id, created_at, updated_at FROM issues WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

export const updateIssue = async (
  id: number,
  title?: string,
  description?: string,
  type?: string,
  status?: string
): Promise<any> => {
  const fields: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  if (title !== undefined) {
    fields.push(`title = $${paramCount++}`);
    values.push(title);
  }
  if (description !== undefined) {
    fields.push(`description = $${paramCount++}`);
    values.push(description);
  }
  if (type !== undefined) {
    fields.push(`type = $${paramCount++}`);
    values.push(type);
  }
  if (status !== undefined) {
    fields.push(`status = $${paramCount++}`);
    values.push(status);
  }

  if (fields.length === 0) {
    return null;
  }

  fields.push(`updated_at = NOW()`);
  values.push(id);

  const query = `UPDATE issues SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const deleteIssue = async (id: number): Promise<boolean> => {
  const result = await pool.query('DELETE FROM issues WHERE id = $1', [id]);
  return result.rowCount! > 0;
};
