import pool from '../../db/index.js';

const createIssueInDB = async (title: string, description: string, type: string, reporterId: number) => {
  const result = await pool.query(
    `INSERT INTO issues (title, description, type, status, reporter_id)
     VALUES ($1, $2, $3, 'open', $4)
     RETURNING *`,
    [title, description, type, reporterId]
  );

  const issue = result.rows[0];
  const reporterResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = $1`,
    [reporterId]
  );

  return {
    ...issue,
    reporter: reporterResult.rows[0],
  };
};

const getAllIssuesFromDB = async (sort?: string, type?: string, status?: string) => {
  let query = 'SELECT * FROM issues WHERE 1=1';
  const params: any[] = [];

  if (type) {
    query += ` AND type = $${params.length + 1}`;
    params.push(type);
  }

  if (status) {
    query += ` AND status = $${params.length + 1}`;
    params.push(status);
  }

  query += sort === 'oldest' ? ' ORDER BY created_at ASC' : ' ORDER BY created_at DESC';

  const result = await pool.query(query, params);
  const issues = result.rows;

  const issuesWithReporter = await Promise.all(
    issues.map(async (issue) => {
      const reporterResult = await pool.query(
        `SELECT id, name, role FROM users WHERE id = $1`,
        [issue.reporter_id]
      );
      return {
        ...issue,
        reporter: reporterResult.rows[0],
      };
    })
  );

  return issuesWithReporter;
};

const getIssueByIdFromDB = async (id: number) => {
  const result = await pool.query(
    `SELECT * FROM issues WHERE id = $1`,
    [id]
  );

  const issue = result.rows[0];
  if (!issue) {
    return null;
  }

  const reporterResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = $1`,
    [issue.reporter_id]
  );

  return {
    ...issue,
    reporter: reporterResult.rows[0],
  };
};

const updateIssueInDB = async (
  id: number,
  userId: number,
  userRole: string,
  title?: string,
  description?: string,
  type?: string,
  status?: string
) => {
  const issueResult = await pool.query(
    `SELECT * FROM issues WHERE id = $1`,
    [id]
  );

  const issue = issueResult.rows[0];
  if (!issue) {
    throw new Error('Issue not found');
  }

  if (userRole === 'contributor' && issue.reporter_id !== userId) {
    throw new Error('Contributors can only update their own issues');
  }

  if (userRole === 'contributor' && issue.status !== 'open') {
    throw new Error('Contributors can only update issues with open status');
  }

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
    throw new Error('No fields to update');
  }

  fields.push(`updated_at = NOW()`);
  values.push(id);

  const query = `UPDATE issues SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
  const updateResult = await pool.query(query, values);

  const updatedIssue = updateResult.rows[0];
  const reporterResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = $1`,
    [updatedIssue.reporter_id]
  );

  return {
    ...updatedIssue,
    reporter: reporterResult.rows[0],
  };
};

const deleteIssueFromDB = async (id: number) => {
  const result = await pool.query(
    `DELETE FROM issues WHERE id = $1 RETURNING *`,
    [id]
  );

  return result.rows[0] || null;
};

export const issueServices = {
  createIssueInDB,
  getAllIssuesFromDB,
  getIssueByIdFromDB,
  updateIssueInDB,
  deleteIssueFromDB,
};
