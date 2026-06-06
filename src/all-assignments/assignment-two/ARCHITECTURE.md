# DevPulse Architecture

## Overview

DevPulse follows a **modular, layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────┐
│   Express.js (HTTP Layer)           │
├─────────────────────────────────────┤
│   Routes (Endpoints)                │
├─────────────────────────────────────┤
│   Controllers (Request Handling)    │
├─────────────────────────────────────┤
│   Services (Business Logic)         │
├─────────────────────────────────────┤
│   Utilities (Database, Response)    │
├─────────────────────────────────────┤
│   PostgreSQL (Data Layer)           │
└─────────────────────────────────────┘
```

---

## Project Structure

```
src/
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts   # Handle signup/login requests
│   │   ├── auth.service.ts      # Verify credentials, hash passwords
│   │   └── auth.route.ts        # Define /api/auth/* routes
│   └── issues/
│       ├── issues.controller.ts # Handle CRUD issue requests
│       ├── issues.service.ts    # Issue business logic
│       └── issues.route.ts      # Define /api/issues/* routes
├── middlewares/
│   └── auth.middleware.ts       # JWT verification, role checking
├── utils/
│   ├── response.ts              # Standard response formatting
│   ├── validation.ts            # Input validation rules
│   └── db.ts                    # Raw SQL query helpers
├── config/
│   └── index.ts                 # Environment variables
├── db/
│   ├── index.ts                 # PostgreSQL connection pool
│   └── init.sql                 # Database schema
├── app.ts                       # Express app configuration
└── server.ts                    # Server entry point
```

---

## Design Patterns

### 1. **MVC (Model-View-Controller) Pattern**

```
Route → Controller → Service → Database
              ↑
           Middleware
```

**Example: Create Issue Flow**

```typescript
// 1. Request hits route
POST /api/issues
  ↓
// 2. Auth middleware verifies JWT
authMiddleware()
  ↓
// 3. Controller validates input
issuesController.createIssue()
  ↓
// 4. Service executes business logic
issuesService.createNewIssue()
  ↓
// 5. Database utilities perform SQL queries
db.createIssue()
  ↓
// 6. Response sent back to client
{ success: true, data: { issue } }
```

### 2. **Middleware Chain Pattern**

Express processes requests through middleware:

```typescript
app.use(express.json());        // Parse JSON
app.use(cors());                // Enable CORS
app.use('/api/auth', authRouter);
app.use('/api/issues', issuesRouter);
```

Protected routes:
```typescript
router.patch('/:id', 
  authMiddleware,               // Verify JWT
  updateIssue                   // Handle update
);
```

### 3. **Service Layer Pattern**

Business logic separated from controllers:

```typescript
// ❌ Bad: Logic in controller
app.get('/users/:id', (req, res) => {
  const user = pool.query(...);
  const posts = pool.query(...);
  res.json(user);
});

// ✅ Good: Logic in service
app.get('/users/:id', async (req, res) => {
  const user = await userService.getUser(req.params.id);
  res.json(user);
});
```

### 4. **Utility Functions Pattern**

Reusable functions for common tasks:

```typescript
// response.ts
sendSuccess(res, 201, 'Created', data);
sendError(res, 400, 'Validation failed', errors);

// validation.ts
validateEmail(email);
validatePassword(password);

// db.ts
createUser(name, email, hashedPassword);
getAllIssues();
```

---

## Data Flow

### Authentication Flow

```
User Input
    ↓
POST /api/auth/login
    ↓
auth.controller.login()
    ├─ Validate email/password required
    └─ Call auth.service.loginUser()
          ├─ Fetch user by email (db.getUserByEmail)
          ├─ Compare password with bcrypt
          ├─ Generate JWT token
          └─ Return token + user
    ↓
Response with token
    ↓
Client stores token
    ↓
Future requests include token in header
```

### Authorization Flow

```
Request with JWT in Authorization header
    ↓
authMiddleware()
    ├─ Extract token from header
    ├─ Verify signature with JWT_SECRET
    ├─ Decode to extract id, name, role
    └─ Attach to req.user
    ↓
Next middleware/route handler
    ├─ Access req.user.id, req.user.role
    └─ Enforce role-based permissions
    ↓
Response
```

### Issue Creation Flow

```
User Input: { title, description, type }
    ↓
POST /api/issues (with JWT)
    ↓
authMiddleware
    └─ Verify token, extract user.id
    ↓
issuesController.createIssue()
    ├─ Validate title (1-150 chars)
    ├─ Validate description (20+ chars)
    ├─ Validate type (bug/feature_request)
    └─ Call issuesService.createNewIssue()
          ├─ Call db.createIssue(title, desc, type, userId)
          ├─ Call db.getUserById(userId) for reporter info
          └─ Return issue with reporter
    ↓
Response with created issue
```

---

## Key Components

### Express Routes

```typescript
// auth.route.ts
router.post('/signup', signup);    // Public
router.post('/login', login);      // Public

// issues.route.ts
router.post('/', authMiddleware, createIssue);
router.get('/', getIssues);        // Public
router.get('/:id', getIssueById);  // Public
router.patch('/:id', authMiddleware, updateIssue);
router.delete('/:id', authMiddleware, requireRole(['maintainer']), deleteIssue);
```

### Controllers

- **Responsibility**: Parse request, validate input, call services
- **Example**: `auth.controller.signup` validates email format, checks password length
- **Response**: Calls `sendSuccess()` or `sendError()`

### Services

- **Responsibility**: Core business logic
- **Example**: `auth.service.loginUser` compares passwords, generates JWT
- **Database**: Calls utility functions from `db.ts`

### Utilities

- **response.ts**: Standard success/error responses
- **validation.ts**: Input validation rules
- **db.ts**: Raw SQL queries (no ORM)

### Middleware

- **auth.middleware.ts**: JWT verification, role checking
- Protects routes and extracts user information

---

## Database Design

### No ORMs, No JOINs

**Why?**
- Direct control over queries
- No hidden performance issues
- Clear understanding of what's executing
- Lightweight, fast responses

**How we handle relationships:**

```typescript
// ❌ Would use JOIN (not allowed)
SELECT issues.*, users.name FROM issues 
  JOIN users ON issues.reporter_id = users.id;

// ✅ We do separate queries
const issue = await getIssueById(id);              // 1 query
const reporter = await getUserById(issue.reporter_id); // 1 query
return { ...issue, reporter };
```

### Connection Pooling

```typescript
// db/index.ts
const pool = new Pool({
  connectionString: config.database.url,
  // Reuses connections instead of creating new ones
});

// Usage
const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
```

**Benefits:**
- Multiple concurrent requests share connections
- Faster than creating new connection per request
- Reduces database load

---

## Type Safety

### TypeScript Strict Mode

```typescript
// ❌ Not allowed
const getData = (data: any) => { }

// ✅ Required
const getData = (data: User) => { }
```

### Request/Response Types

```typescript
interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
}
```

---

## Security Architecture

### Password Security

```typescript
// Never store plaintext
const hashedPassword = await bcrypt.hash(password, 10);

// Verify against hash
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
```

### JWT Authentication

```typescript
// Generated on login, includes user data
const token = jwt.sign(
  { id: user.id, name: user.name, role: user.role },
  JWT_SECRET,
  { expiresIn: '7d' }
);

// Verified on protected routes
jwt.verify(token, JWT_SECRET);
```

### Input Validation

All endpoints validate input before processing:

```typescript
if (!email || !validateEmail(email)) {
  sendError(res, 400, 'Invalid email');
  return;
}
```

### Role-Based Access Control

```typescript
// Only maintainers can delete
router.delete('/:id', 
  authMiddleware,
  requireRole(['maintainer']),
  deleteIssue
);
```

---

## Error Handling

### Centralized Response Format

```typescript
// Success
{ success: true, message: "...", data: { ... } }

// Error
{ success: false, message: "...", errors: { ... } }
```

### HTTP Status Codes

- **200**: OK (successful GET/PATCH/DELETE)
- **201**: Created (successful POST)
- **400**: Bad Request (validation failed)
- **401**: Unauthorized (invalid JWT)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **500**: Server Error

---

## Performance Considerations

### Database Indexes

```sql
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_type ON issues(type);
CREATE INDEX idx_issues_reporter_id ON issues(reporter_id);
```

Speeds up queries filtering by these fields.

### Connection Pooling

Pool of 10 connections (default) shared across requests.

### Response Caching

Not implemented in v1.0 but can be added:
```typescript
app.get('/issues/:id', cache('5 minutes'), getIssueById);
```

---

## Scalability Path

### Current (v1.0)
- Single PostgreSQL database
- 1 Vercel instance
- No caching

### Future Improvements
- Redis caching for frequently accessed issues
- Read replicas for database scaling
- Multi-region deployment
- GraphQL API alongside REST
- WebSocket for real-time updates
- Rate limiting middleware

---

## Testing Architecture (Future)

```typescript
// Unit tests
describe('auth.service', () => {
  test('loginUser returns token on valid credentials', () => {});
});

// Integration tests
describe('POST /api/auth/login', () => {
  test('responds with 200 and token', () => {});
});

// E2E tests
describe('Complete flow', () => {
  test('user can register, login, create issue', () => {});
});
```

---

## Summary

**Key Principles:**
1. ✅ Separation of concerns (routes → controllers → services → db)
2. ✅ Type safety (strict TypeScript)
3. ✅ Security (JWT + bcrypt + validation)
4. ✅ Performance (pooling, indexes)
5. ✅ Maintainability (modular, DRY, clear naming)

This architecture scales from small to medium projects and provides a solid foundation for future growth.
