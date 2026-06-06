# DevPulse Development Guide

Guide for local development, testing, and contributing to DevPulse.

---

## Local Development Setup

### Prerequisites

- Node.js 24.x or higher
- PostgreSQL 13+ (local or Docker)
- npm or yarn
- Git

### Installation Steps

1. **Clone repository**
```bash
cd src/all-assignments/assignment-two
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment**
```bash
cp .env.example .env
# Edit .env with your local PostgreSQL credentials
```

Example `.env` for local development:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/devpulse
JWT_SECRET=dev_secret_key_very_insecure_do_not_use_in_prod
JWT_EXPIRY=7d
PORT=5000
NODE_ENV=development
```

4. **Create PostgreSQL database**

Using psql:
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE devpulse;

# Exit
\q

# Initialize schema
psql -U postgres -d devpulse -f src/db/init.sql
```

Or using Docker:
```bash
docker run --name devpulse-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=devpulse \
  -p 5432:5432 \
  postgres:15
```

5. **Start development server**
```bash
npm run dev
```

Server runs on `http://localhost:5000`

---

## Available Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start with hot reload (ts-node) |
| `npm run build` | Build TypeScript to JavaScript |
| `npm start` | Run production build |

---

## Testing the API

### Using cURL

```bash
# Register user
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@localhost.dev",
    "password": "testpass123",
    "role": "contributor"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@localhost.dev",
    "password": "testpass123"
  }'
# Note: Copy token from response

# Create issue (replace TOKEN)
TOKEN="your_token_here"
curl -X POST http://localhost:5000/api/issues \
  -H "Content-Type: application/json" \
  -H "Authorization: $TOKEN" \
  -d '{
    "title": "Test issue",
    "description": "This is a test issue to verify the API is working correctly",
    "type": "bug"
  }'

# Get all issues
curl http://localhost:5000/api/issues

# Get single issue
curl http://localhost:5000/api/issues/1

# Update issue
curl -X PATCH http://localhost:5000/api/issues/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: $TOKEN" \
  -d '{"status": "in_progress"}'

# Delete issue (requires maintainer)
curl -X DELETE http://localhost:5000/api/issues/1 \
  -H "Authorization: $TOKEN"
```

### Using Postman / Thunder Client

1. Create collection named "DevPulse"
2. Add requests:
   - POST `/api/auth/signup`
   - POST `/api/auth/login`
   - POST `/api/issues`
   - GET `/api/issues`
   - GET `/api/issues/:id`
   - PATCH `/api/issues/:id`
   - DELETE `/api/issues/:id`

3. Set environment variables:
   - `base_url`: `http://localhost:5000`
   - `token`: (set after login)

---

## Code Structure Best Practices

### Adding a New Feature

**Example: Add "assignee" field to issues**

1. **Update database schema** (`src/db/init.sql`)
```sql
ALTER TABLE issues ADD COLUMN assignee_id INTEGER;
```

2. **Update database utilities** (`src/utils/db.ts`)
```typescript
export const updateIssueAssignee = async (issueId: number, assigneeId: number) => {
  const result = await pool.query(
    'UPDATE issues SET assignee_id = $1 WHERE id = $2 RETURNING *',
    [assigneeId, issueId]
  );
  return result.rows[0];
};
```

3. **Update service** (`src/modules/issues/issues.service.ts`)
```typescript
export const assignIssue = async (issueId: number, assigneeId: number) => {
  const issue = await updateIssueAssignee(issueId, assigneeId);
  const assignee = await getUserById(assigneeId);
  return { ...issue, assignee };
};
```

4. **Update controller** (`src/modules/issues/issues.controller.ts`)
```typescript
export const assignIssue = async (req: Request, res: Response) => {
  try {
    const { assigneeId } = req.body;
    const issue = await assignIssue(parseInt(req.params.id), assigneeId);
    sendSuccess(res, StatusCode.OK, 'Issue assigned', issue);
  } catch (error) {
    sendError(res, StatusCode.BAD_REQUEST, error.message);
  }
};
```

5. **Add route** (`src/modules/issues/issues.route.ts`)
```typescript
router.post('/:id/assign', authMiddleware, assignIssue);
```

6. **Add validation** (`src/utils/validation.ts`)
```typescript
export const validateUserId = (id: number): boolean => {
  return id > 0;
};
```

---

## TypeScript Guidelines

### Strict Mode

All files must have strict TypeScript. No `any` types allowed.

```typescript
// ❌ Avoid
const getData = (data: any) => {
  return data.id;
};

// ✅ Use
interface User {
  id: number;
  name: string;
}

const getData = (data: User): number => {
  return data.id;
};
```

### Proper Types

```typescript
// Express request/response types
import { Request, Response, NextFunction } from 'express';

const handler = (req: Request, res: Response, next: NextFunction): void => {
  // void return type for middleware
  res.json({ data: 'example' });
};

// Database types
interface UserRow {
  id: number;
  name: string;
  email: string;
}

const user: UserRow = await getUserById(1);
```

---

## Git Commit Guidelines

### Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation
- **style**: Code style (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring
- **test**: Adding tests
- **chore**: Build, dependencies, etc.

### Examples

```bash
# Feature
git commit -m "feat: add issue assignment feature

- Allow maintainers to assign issues to users
- Add assignee field to issues table
- Update issue response with assignee info"

# Bug fix
git commit -m "fix: correct JWT expiry calculation

- Token expiry was calculated incorrectly
- Now properly uses JWT_EXPIRY from config"

# Documentation
git commit -m "docs: update API documentation

- Add assignee endpoint examples
- Update database schema section"
```

---

## Database Management

### Running Migrations

For now, manually update schema in `src/db/init.sql` and run:

```bash
psql -U postgres -d devpulse -f src/db/init.sql
```

Future: Consider migration tools like Flyway or db-migrate.

### Resetting Database

```bash
# Drop and recreate
psql -U postgres -c "DROP DATABASE devpulse;"
psql -U postgres -c "CREATE DATABASE devpulse;"
psql -U postgres -d devpulse -f src/db/init.sql
```

### Seeding Test Data

Create `src/db/seed.sql`:
```sql
INSERT INTO users (name, email, password, role) VALUES
  ('Admin User', 'admin@test.dev', 'hashed_password', 'maintainer'),
  ('Normal User', 'user@test.dev', 'hashed_password', 'contributor');

INSERT INTO issues (title, description, type, reporter_id) VALUES
  ('Test Bug', 'This is a test bug report', 'bug', 1),
  ('Feature Request', 'Request for new feature', 'feature_request', 2);
```

Run:
```bash
psql -U postgres -d devpulse -f src/db/seed.sql
```

---

## Debugging

### Enable Request Logging

Add to `src/app.ts`:
```typescript
import morgan from 'morgan';
app.use(morgan('dev')); // Log all requests
```

### Console Debugging

```typescript
// In any file
console.log('Value:', someValue);
console.error('Error:', error);

// Better: Use debug library
import debug from 'debug';
const log = debug('devpulse:auth');
log('User logged in:', user.id);
```

### Node Debugger

```bash
node --inspect dist/server.js
# Then open chrome://inspect in Chrome
```

---

## Performance Testing

### Check Build Size

```bash
npm run build
ls -lh dist/
```

Aim for < 1MB bundle.

### Test Database Queries

```typescript
const start = Date.now();
const issues = await getAllIssues();
console.log(`Query took ${Date.now() - start}ms`);
```

### Load Testing (Future)

```bash
# Using Apache Bench
ab -n 1000 -c 10 http://localhost:5000/api/issues
```

---

## Code Quality Checklist

Before committing:

- [ ] TypeScript strict mode passes (`npm run build`)
- [ ] No `console.log()` statements left
- [ ] All functions have proper types
- [ ] Input validation on all endpoints
- [ ] Error handling with try/catch
- [ ] Constants extracted to config
- [ ] No hardcoded values
- [ ] Meaningful variable names
- [ ] No dead code

---

## Environment Variables Reference

### Development (.env)
```
DATABASE_URL=postgresql://localhost:5432/devpulse
JWT_SECRET=dev_secret (very insecure)
JWT_EXPIRY=7d
PORT=5000
NODE_ENV=development
```

### Production (.env.production)
```
DATABASE_URL=postgresql://user:password@neon.tech/devpulse
JWT_SECRET=<strong-random-key>
JWT_EXPIRY=7d
PORT=5000
NODE_ENV=production
```

Never commit `.env` files with real secrets!

---

## Troubleshooting

### Port 5000 Already in Use

```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Database Connection Failed

```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Check credentials in .env
echo $DATABASE_URL
```

### TypeScript Build Errors

```bash
# Clear dist folder
rm -rf dist/

# Rebuild
npm run build
```

### Module Not Found Errors

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## Next Steps

1. ✅ Set up local development environment
2. ✅ Create PostgreSQL database
3. ✅ Start dev server with `npm run dev`
4. ✅ Test endpoints with cURL/Postman
5. ✅ Review ARCHITECTURE.md for design patterns
6. ✅ Read API_DOCUMENTATION.md for endpoint details
7. ✅ Make changes, test, commit
8. ✅ Push to GitHub
9. ✅ Deploy to Vercel (see DEPLOYMENT.md)

---

## Questions?

Refer to:
- **README.md** — Project overview
- **API_DOCUMENTATION.md** — Endpoint details
- **ARCHITECTURE.md** — Design patterns
- **DEPLOYMENT.md** — Production setup

Happy coding! 🚀
