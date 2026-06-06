# DevPulse Security Guide

Security implementation, best practices, and threat mitigation.

---

## Security Overview

DevPulse implements multi-layer security:

```
┌─────────────────────────────────────┐
│ HTTPS / TLS (Transport)             │
├─────────────────────────────────────┤
│ CORS (Cross-Origin Protection)      │
├─────────────────────────────────────┤
│ Input Validation (Application)      │
├─────────────────────────────────────┤
│ JWT Authentication & Authorization  │
├─────────────────────────────────────┤
│ Password Hashing (bcrypt)           │
├─────────────────────────────────────┤
│ SQL Parameterization (Injection)    │
├─────────────────────────────────────┤
│ Database Constraints                │
└─────────────────────────────────────┘
```

---

## Authentication Security

### JWT Implementation

**Token Generation:**
```typescript
const token = jwt.sign(
  {
    id: user.id,
    name: user.name,
    role: user.role,
  },
  config.jwt.secret,        // Secret key
  { expiresIn: '7d' }       // Expires in 7 days
);
```

**Token Verification:**
```typescript
try {
  const decoded = jwt.verify(token, config.jwt.secret);
  // Token valid, user authenticated
} catch (error) {
  // Token invalid or expired
  sendError(res, 401, 'Invalid or expired token');
}
```

**Best Practices:**
- ✅ Token signed with secret key (SHA256)
- ✅ 7-day expiry (configurable)
- ✅ Never store sensitive data in payload (it's base64, not encrypted)
- ✅ Always verify signature and expiry
- ✅ Use HTTPS in production to prevent token theft

### Password Security

**Hashing with bcrypt:**
```typescript
const hashedPassword = await bcrypt.hash(password, 10);
// Output: $2b$10$... (168 character hash)
```

**Verification:**
```typescript
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
// Compares without revealing hash
```

**Why bcrypt?**
- ✅ Slow by design (resistant to brute force)
- ✅ Salt built-in (prevents rainbow tables)
- ✅ 10 rounds = ~100ms per hash (balanced security)
- ✅ Industry standard for password hashing

**Never:**
```typescript
// ❌ NEVER store plaintext password
db.query('INSERT INTO users (password) VALUES ($1)', [password]);

// ❌ NEVER use MD5, SHA1, SHA256 for passwords
const hash = crypto.createHash('sha256').update(password).digest();

// ❌ NEVER log passwords
console.log('User password:', password);
```

---

## Authorization Security

### Role-Based Access Control (RBAC)

**Define permissions in code:**
```typescript
interface User {
  id: number;
  role: 'contributor' | 'maintainer';
}

// Only maintainers can delete
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      sendError(res, 403, 'Insufficient permissions');
      return;
    }
    next();
  };
};
```

**Apply to routes:**
```typescript
// Public endpoint
router.get('/issues', getIssues);

// Protected endpoint (any authenticated user)
router.post('/issues', authMiddleware, createIssue);

// Restricted endpoint (maintainers only)
router.delete('/issues/:id', authMiddleware, requireRole(['maintainer']), deleteIssue);
```

**Enforce ownership:**
```typescript
// Contributors can only update their own issues
if (userRole === 'contributor' && issue.reporter_id !== userId) {
  throw new Error('Contributors can only update their own issues');
}
```

---

## Input Validation

### Prevent Invalid Data

**Type validation:**
```typescript
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};
```

**Length validation:**
```typescript
const validateIssueTitle = (title: string): boolean => {
  return title.length > 0 && title.length <= 150;
};

const validateIssueDescription = (description: string): boolean => {
  return description.length >= 20;
};
```

**Enum validation:**
```typescript
const validateIssueType = (type: string): boolean => {
  return type === 'bug' || type === 'feature_request';
};

const validateIssueStatus = (status: string): boolean => {
  return ['open', 'in_progress', 'resolved'].includes(status);
};
```

**Application:**
```typescript
export const createIssue = async (req: Request, res: Response) => {
  const { title, description, type } = req.body;

  // Validate required fields
  if (!title || !description || !type) {
    sendError(res, 400, 'Missing required fields');
    return;
  }

  // Validate format
  if (!validateIssueTitle(title)) {
    sendError(res, 400, 'Title must be 1-150 characters');
    return;
  }

  if (!validateIssueDescription(description)) {
    sendError(res, 400, 'Description must be 20+ characters');
    return;
  }

  if (!validateIssueType(type)) {
    sendError(res, 400, 'Type must be bug or feature_request');
    return;
  }

  // Safe to proceed
  // ...
};
```

---

## SQL Injection Prevention

### Use Parameterized Queries

**Safe (using parameters):**
```typescript
// ✅ Parameter at position $1
const result = await pool.query(
  'SELECT * FROM users WHERE email = $1',
  [userEmail]
);
```

**Dangerous (string concatenation):**
```typescript
// ❌ User input directly in SQL
const result = await pool.query(
  `SELECT * FROM users WHERE email = '${userEmail}'`
);

// Attack: userEmail = "'; DROP TABLE users; --"
// Results in: SELECT * FROM users WHERE email = ''; DROP TABLE users; --'
```

**All DevPulse queries use parameters:**
```typescript
// auth.service.ts
await createUser(name, email, hashedPassword, role);

// db.ts
export const createUser = async (
  name: string,
  email: string,
  hashedPassword: string,
  role: string
) => {
  const result = await pool.query(
    'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING ...',
    [name, email, hashedPassword, role] // Parameters always separated
  );
  return result.rows[0];
};
```

---

## Data Protection

### Sensitive Fields Never Returned

**User password:**
```typescript
// ❌ Wrong: Returning password hash
const user = await getUserByEmail(email);
res.json(user); // Includes password field

// ✅ Correct: Exclude password
export const getUserByEmail = async (email: string) => {
  const result = await pool.query(
    'SELECT id, name, email, role, created_at, updated_at FROM users WHERE email = $1',
    [email]
  );
  // Note: password field NOT selected
  return result.rows[0];
};
```

**Login response:**
```typescript
// ✅ Token and user data, no password
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "contributor"
      // No password, no token secret
    }
  }
}
```

### Protect Sensitive Operations

**Only include needed data in JWT:**
```typescript
// ✅ Minimal data
jwt.sign({
  id: user.id,
  name: user.name,
  role: user.role
}, secret);

// ❌ Too much sensitive data
jwt.sign({
  id: user.id,
  email: user.email,
  password_hash: user.password,
  is_admin: user.role === 'admin'
}, secret);
```

---

## CORS Security

**Allow trusted origins:**
```typescript
import cors from 'cors';

// ✅ In production: specify allowed domains
app.use(cors({
  origin: ['https://example.com', 'https://app.example.com'],
  credentials: true
}));

// In development: allow all
app.use(cors());
```

**Why CORS?**
- Prevents unauthorized cross-origin requests
- Protects against CSRF (Cross-Site Request Forgery)
- Allows legitimate frontend apps to access API

---

## Environment Variable Security

**Never commit secrets:**
```bash
# .gitignore
.env
.env.local
.env.*.local
```

**Use different secrets per environment:**
```
# Development (.env)
JWT_SECRET=dev_secret_key_very_insecure

# Production (.env.production)
JWT_SECRET=<long-random-secure-key>
```

**In code:**
```typescript
// config/index.ts
export const config = {
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_secret',
  },
};
```

---

## Database Security

### Constraints

**Email uniqueness:**
```sql
email VARCHAR(255) UNIQUE NOT NULL
```

**Role validation:**
```sql
role VARCHAR(50) CHECK (role IN ('contributor', 'maintainer'))
```

**Type validation:**
```sql
type VARCHAR(50) CHECK (type IN ('bug', 'feature_request'))
```

**Status validation:**
```sql
status VARCHAR(50) CHECK (status IN ('open', 'in_progress', 'resolved'))
```

### No Sensitive Data in Logs

```typescript
// ❌ Don't log passwords or tokens
console.log('Password:', password);
console.log('Token:', token);

// ✅ Log meaningful, non-sensitive info
console.log('User ID:', user.id);
console.log('Request method:', req.method);
```

---

## Rate Limiting (Future)

Not implemented in v1.0 but recommended for production:

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
});

// Apply to auth endpoints
app.post('/api/auth/login', limiter, loginHandler);
app.post('/api/auth/signup', limiter, signupHandler);
```

---

## Security Checklist

**Before Deployment:**
- [ ] JWT secret is strong (random, 32+ characters)
- [ ] No secrets in .env file committed to git
- [ ] HTTPS configured on production domain
- [ ] CORS allows only trusted origins
- [ ] Passwords hashed with bcrypt
- [ ] No passwords in logs or responses
- [ ] All SQL queries use parameters
- [ ] Input validation on all endpoints
- [ ] Rate limiting configured
- [ ] Database backups automated

**Ongoing:**
- [ ] Monitor for suspicious activity
- [ ] Update dependencies regularly
- [ ] Review JWT tokens for anomalies
- [ ] Audit database access logs
- [ ] Security patches applied promptly

---

## Common Vulnerabilities & Mitigations

| Vulnerability | Risk | Mitigation |
|---|---|---|
| **SQL Injection** | Database breach | Parameterized queries |
| **Password Compromise** | Account takeover | bcrypt hashing |
| **Token Theft** | Session hijacking | HTTPS, short expiry |
| **CSRF** | Unauthorized actions | CORS, SameSite cookies |
| **Brute Force** | Account lockout | Rate limiting |
| **Data Exposure** | Information leak | Exclude sensitive fields |

---

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [bcrypt Documentation](https://www.npmjs.com/package/bcrypt)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/sql-syntax.html)

---

## Report Security Issues

Found a vulnerability? Do not open a public issue.

**Report privately to**: security@devpulse.dev (once deployed)

---

DevPulse prioritizes security in every layer. Stay vigilant! 🛡️
