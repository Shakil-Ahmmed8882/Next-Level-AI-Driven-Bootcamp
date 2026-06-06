# DevPulse Database Documentation

Comprehensive guide to the DevPulse PostgreSQL database schema, queries, and management.

---

## Database Overview

**Type**: PostgreSQL (Relational)  
**Driver**: Native `pg` npm package (no ORM)  
**Connection**: Pool of 10 connections  
**Schema**: Two tables (users, issues)

---

## Schema Design

### Users Table

**Purpose**: Store user accounts and authentication data

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'contributor' 
    CHECK (role IN ('contributor', 'maintainer')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields Explained:**

| Field | Type | Constraints | Purpose |
|-------|------|-----------|---------|
| **id** | SERIAL | PRIMARY KEY | Unique user identifier (auto-increment) |
| **name** | VARCHAR(255) | NOT NULL | Full display name |
| **email** | VARCHAR(255) | UNIQUE, NOT NULL | Login email (must be unique) |
| **password** | VARCHAR(255) | NOT NULL | Hashed password with bcrypt |
| **role** | VARCHAR(50) | DEFAULT 'contributor' | User role (permissions) |
| **created_at** | TIMESTAMP | DEFAULT NOW() | Account creation time |
| **updated_at** | TIMESTAMP | DEFAULT NOW() | Last profile update time |

**Sample Data:**
```sql
INSERT INTO users (name, email, password, role) VALUES
  ('John Doe', 'john@example.com', '$2b$10$...', 'contributor'),
  ('Alice Smith', 'alice@example.com', '$2b$10$...', 'maintainer');
```

---

### Issues Table

**Purpose**: Store bug reports and feature requests

```sql
CREATE TABLE issues (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(50) NOT NULL 
    CHECK (type IN ('bug', 'feature_request')),
  status VARCHAR(50) NOT NULL DEFAULT 'open' 
    CHECK (status IN ('open', 'in_progress', 'resolved')),
  reporter_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields Explained:**

| Field | Type | Constraints | Purpose |
|-------|------|-----------|---------|
| **id** | SERIAL | PRIMARY KEY | Unique issue identifier |
| **title** | VARCHAR(150) | NOT NULL | Issue headline (max 150 chars) |
| **description** | TEXT | NOT NULL | Detailed description (min 20 chars validated in app) |
| **type** | VARCHAR(50) | CHECK constraint | `bug` or `feature_request` |
| **status** | VARCHAR(50) | DEFAULT 'open' | Workflow state (open → in_progress → resolved) |
| **reporter_id** | INTEGER | NOT NULL | User ID who created the issue |
| **created_at** | TIMESTAMP | DEFAULT NOW() | Issue creation time |
| **updated_at** | TIMESTAMP | DEFAULT NOW() | Last modification time |

**Note**: `reporter_id` references `users.id` but has NO foreign key constraint (validated in app logic per assignment requirements).

**Sample Data:**
```sql
INSERT INTO issues (title, description, type, reporter_id) VALUES
  ('Database timeout', 'Connection pool exhausts after 50+ concurrent queries', 'bug', 1),
  ('Dark mode support', 'Add dark theme toggle in settings', 'feature_request', 2);
```

---

## Indexes

**Performance optimization** for frequently queried columns:

```sql
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_type ON issues(type);
CREATE INDEX idx_issues_reporter_id ON issues(reporter_id);
```

**Why these indexes?**
- `status`: Queries filter by status (GET /issues?status=open)
- `type`: Queries filter by type (GET /issues?type=bug)
- `reporter_id`: Fetch issues by reporter or verify ownership

---

## Common Queries

### Authentication Queries

**Find user by email (for login)**
```sql
SELECT id, name, email, password, role, created_at, updated_at 
FROM users 
WHERE email = $1;
```

Code:
```typescript
const user = await getUserByEmail('john@example.com');
```

**Check if email exists (for signup)**
```sql
SELECT id FROM users WHERE email = $1 LIMIT 1;
```

**Create new user**
```sql
INSERT INTO users (name, email, password, role) 
VALUES ($1, $2, $3, $4) 
RETURNING id, name, email, role, created_at, updated_at;
```

Code:
```typescript
const user = await createUser(name, email, hashedPassword, role);
```

---

### Issue Queries

**Get all issues with optional filters**
```sql
SELECT * FROM issues 
WHERE 1=1 
  AND ($1::text IS NULL OR type = $1)
  AND ($2::text IS NULL OR status = $2)
ORDER BY created_at DESC;
```

Code:
```typescript
const issues = await getAllIssues(type, status);
```

**Get single issue**
```sql
SELECT * FROM issues WHERE id = $1;
```

Code:
```typescript
const issue = await getIssueById(45);
```

**Create new issue**
```sql
INSERT INTO issues (title, description, type, status, reporter_id)
VALUES ($1, $2, $3, 'open', $4)
RETURNING *;
```

Code:
```typescript
const issue = await createIssue(title, description, type, reporterId);
```

**Update issue**
```sql
UPDATE issues 
SET title = COALESCE($1, title),
    description = COALESCE($2, description),
    type = COALESCE($3, type),
    status = COALESCE($4, status),
    updated_at = NOW()
WHERE id = $5
RETURNING *;
```

Code:
```typescript
const issue = await updateIssue(id, title, description, type, status);
```

**Delete issue**
```sql
DELETE FROM issues WHERE id = $1;
```

Code:
```typescript
await deleteIssue(45);
```

---

## Data Relationships

### Reporter Relationship

Issues belong to users (reporter):

```typescript
// Get issue with reporter details
const issue = await getIssueById(45);
const reporter = await getUserById(issue.reporter_id);

return {
  ...issue,
  reporter: {
    id: reporter.id,
    name: reporter.name,
    role: reporter.role
  }
};
```

**Why no JOIN?**
- Assignment requirement: no SQL JOINs
- Flexibility: can fetch additional user details easily
- Clear separation: easier to understand and debug

---

## Connection Pool

### Configuration

```typescript
// src/db/index.ts
const pool = new Pool({
  connectionString: config.database.url,
  // Default: max 10 connections
});

export default pool;
```

### Usage

```typescript
// All queries use the pool
const result = await pool.query(
  'SELECT * FROM users WHERE id = $1',
  [userId]
);

const rows = result.rows;
```

### Benefits

- **Concurrent requests**: Multiple requests share connections
- **Performance**: No overhead of creating connections
- **Resource efficient**: Limited number of active connections
- **Automatic cleanup**: Pool manages connection lifecycle

---

## Transactions

**Not currently used**, but available for complex operations:

```typescript
const client = await pool.connect();
try {
  await client.query('BEGIN');
  
  // Multiple operations
  await client.query('INSERT INTO users ...');
  await client.query('UPDATE issues SET ...');
  
  await client.query('COMMIT');
} catch (e) {
  await client.query('ROLLBACK');
} finally {
  client.release();
}
```

---

## Data Validation

**In Database (Constraints):**
```sql
-- Role must be contributor or maintainer
role VARCHAR(50) CHECK (role IN ('contributor', 'maintainer'))

-- Email must be unique
email VARCHAR(255) UNIQUE NOT NULL

-- Type must be bug or feature_request
type VARCHAR(50) CHECK (type IN ('bug', 'feature_request'))

-- Status must be valid
status VARCHAR(50) CHECK (status IN ('open', 'in_progress', 'resolved'))
```

**In Application (TypeScript):**
```typescript
// Validate before inserting/updating
validateEmail(email);
validatePassword(password);
validateIssueTitle(title);
validateIssueDescription(description);
validateIssueType(type);
validateIssueStatus(status);
```

---

## Security Considerations

### Passwords

- **Never store plaintext**: Hashed with bcrypt (10 rounds)
- **Never return in responses**: Always exclude password field
- **Never log**: Never log passwords or hashes

### SQL Injection Prevention

**Use parameterized queries:**
```typescript
// ✅ Safe: Parameters separated from SQL
pool.query('SELECT * FROM users WHERE id = $1', [userId]);

// ❌ Dangerous: String concatenation
pool.query(`SELECT * FROM users WHERE id = ${userId}`);
```

### Email Uniqueness

Database enforces unique emails:
```sql
email VARCHAR(255) UNIQUE NOT NULL
```

Application also checks before insertion:
```typescript
const existing = await getUserByEmail(email);
if (existing) throw new Error('Email already registered');
```

---

## Backup & Recovery

### PostgreSQL Backup

```bash
# Backup full database
pg_dump -U postgres devpulse > backup.sql

# Backup to compressed format
pg_dump -U postgres -Fc devpulse > backup.dump

# Restore from backup
psql -U postgres devpulse < backup.sql
```

### NeonDB Backup

NeonDB automatically backs up:
- Daily backups (7-day retention on free tier)
- Point-in-time recovery available
- Check NeonDB dashboard for backup status

---

## Migration Path (If Needed)

**Adding new column:**

1. Add column to schema:
```sql
ALTER TABLE issues ADD COLUMN priority VARCHAR(20) DEFAULT 'medium';
```

2. Update application queries to use new field

3. Update API response types

**Renaming table:**

```sql
ALTER TABLE old_name RENAME TO new_name;
```

**Dropping column:**

```sql
ALTER TABLE issues DROP COLUMN old_field;
```

---

## Monitoring & Performance

### Query Performance

Check slow queries in PostgreSQL logs:
```sql
-- Enable query logging
SET log_min_duration_statement = 1000; -- Log queries > 1000ms
```

### Database Size

```sql
-- Check database size
SELECT pg_database.datname, 
       pg_size_pretty(pg_database_size(pg_database.datname)) AS size
FROM pg_database;
```

### Connection Count

```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity;
```

---

## Troubleshooting

### Connection Refused

**Cause**: PostgreSQL not running or wrong credentials

**Solution:**
```bash
# Check service is running
sudo systemctl status postgresql

# Test connection
psql -U postgres -h localhost
```

### Unique Constraint Violation

**Error**: `duplicate key value violates unique constraint "users_email_key"`

**Cause**: Attempt to insert duplicate email

**Solution**: Check for existing email first:
```typescript
const existing = await getUserByEmail(email);
if (existing) return handleDuplicateError();
```

### Connection Pool Exhausted

**Error**: `Client was closed by the server`

**Cause**: Too many concurrent connections

**Solution**: Increase pool size or optimize queries:
```typescript
const pool = new Pool({
  max: 20, // Increase from default 10
});
```

---

## Summary

| Aspect | Details |
|--------|---------|
| **DBMS** | PostgreSQL |
| **Tables** | 2 (users, issues) |
| **Approach** | No ORM, raw SQL + parameterized queries |
| **Connections** | Pooled (10 default) |
| **Security** | Constraints, validation, parameterized queries |
| **Backup** | NeonDB automatic, manual pg_dump available |

This design provides:
- ✅ Simplicity (no ORM overhead)
- ✅ Security (validated queries)
- ✅ Performance (indexes, pooling)
- ✅ Scalability (ready for growth)

---

## Next Steps

1. Initialize schema: `psql -f src/db/init.sql`
2. Seed test data: `psql -f src/db/seed.sql`
3. Monitor with: `SELECT * FROM users; SELECT * FROM issues;`
4. Review queries in `src/utils/db.ts`
5. Scale with indexes as needed
