# DevPulse API Documentation

Complete API reference for the DevPulse issue tracking system.

## Base URL

```
http://localhost:5000/api
https://devpulse-api.vercel.app/api  (Production)
```

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: <JWT_TOKEN>
```

Token is obtained from login endpoint and includes:
- `id` (user ID)
- `name` (user name)
- `role` (user role: contributor or maintainer)

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation description",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": {}
}
```

---

## Auth Endpoints

### POST /auth/signup

Register a new user account.

**Access:** Public

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "role": "contributor"
}
```

**Parameters:**
| Field | Type | Required | Rules |
|-------|------|----------|-------|
| name | string | ✅ | Non-empty |
| email | string | ✅ | Valid email format, unique |
| password | string | ✅ | Minimum 6 characters |
| role | string | ❌ | `contributor` or `maintainer` (default: contributor) |

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "contributor",
    "created_at": "2026-01-20T09:00:00Z",
    "updated_at": "2026-01-20T09:00:00Z"
  }
}
```

**Error Responses:**
- **400 Bad Request**: Validation failed, duplicate email, etc.
- **500 Internal Server Error**: Database error

---

### POST /auth/login

Authenticate user and receive JWT token.

**Access:** Public

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Parameters:**
| Field | Type | Required |
|-------|------|----------|
| email | string | ✅ |
| password | string | ✅ |

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZXhwIjoxNjM5MjI0MDAwfQ...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "contributor",
      "created_at": "2026-01-20T09:00:00Z",
      "updated_at": "2026-01-20T09:00:00Z"
    }
  }
}
```

**Error Responses:**
- **400 Bad Request**: Invalid credentials
- **500 Internal Server Error**: Database error

---

## Issues Endpoints

### POST /issues

Create a new issue.

**Access:** Authenticated (contributor, maintainer)

**Headers:**
```
Authorization: <JWT_TOKEN>
```

**Request Body:**
```json
{
  "title": "Database connection timeout under load",
  "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
  "type": "bug"
}
```

**Parameters:**
| Field | Type | Required | Rules |
|-------|------|----------|-------|
| title | string | ✅ | 1-150 characters |
| description | string | ✅ | Minimum 20 characters |
| type | string | ✅ | `bug` or `feature_request` |

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Issue created successfully",
  "data": {
    "id": 45,
    "title": "Database connection timeout under load",
    "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
    "type": "bug",
    "status": "open",
    "reporter_id": 1,
    "created_at": "2026-01-20T10:30:00Z",
    "updated_at": "2026-01-20T10:30:00Z"
  }
}
```

**Error Responses:**
- **400 Bad Request**: Validation failed
- **401 Unauthorized**: Invalid/missing token
- **500 Internal Server Error**: Database error

---

### GET /issues

Retrieve all issues with optional filtering and sorting.

**Access:** Public

**Query Parameters:**
| Param | Type | Values | Default |
|-------|------|--------|---------|
| sort | string | `newest`, `oldest` | `newest` |
| type | string | `bug`, `feature_request` | (none) |
| status | string | `open`, `in_progress`, `resolved` | (none) |

**Examples:**
```
GET /issues?sort=newest
GET /issues?type=bug&status=open
GET /issues?sort=oldest&type=feature_request
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Issues retrived successfully",
  "data": [
    {
      "id": 45,
      "title": "Database connection timeout under load",
      "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
      "type": "bug",
      "status": "open",
      "reporter": {
        "id": 1,
        "name": "John Doe",
        "role": "contributor"
      },
      "created_at": "2026-01-20T10:30:00Z",
      "updated_at": "2026-01-20T10:30:00Z"
    }
  ]
}
```

---

### GET /issues/:id

Retrieve a single issue by ID.

**Access:** Public

**URL Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| id | number | Issue ID |

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Issue retrived successfully",
  "data": {
    "id": 45,
    "title": "Database connection timeout under load",
    "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
    "type": "bug",
    "status": "open",
    "reporter": {
      "id": 1,
      "name": "John Doe",
      "role": "contributor"
    },
    "created_at": "2026-01-20T10:30:00Z",
    "updated_at": "2026-01-20T10:30:00Z"
  }
}
```

**Error Responses:**
- **404 Not Found**: Issue doesn't exist

---

### PATCH /issues/:id

Update an issue (title, description, type, or status).

**Access:** 
- Maintainer: Can update any issue
- Contributor: Can update own issues with `open` status

**Headers:**
```
Authorization: <JWT_TOKEN>
```

**URL Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| id | number | Issue ID |

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description with more details...",
  "type": "bug",
  "status": "in_progress"
}
```

**Parameters:**
| Field | Type | Required | Rules |
|-------|------|----------|-------|
| title | string | ❌ | 1-150 characters |
| description | string | ❌ | Minimum 20 characters |
| type | string | ❌ | `bug` or `feature_request` |
| status | string | ❌ | `open`, `in_progress`, `resolved` |

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Issue updated successfully",
  "data": {
    "id": 45,
    "title": "Updated title",
    "description": "Updated description with more details...",
    "type": "bug",
    "status": "in_progress",
    "reporter_id": 1,
    "created_at": "2026-01-20T10:30:00Z",
    "updated_at": "2026-01-20T10:40:00Z"
  }
}
```

**Error Responses:**
- **400 Bad Request**: Validation failed
- **401 Unauthorized**: Invalid/missing token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Issue doesn't exist
- **500 Internal Server Error**: Database error

---

### DELETE /issues/:id

Delete an issue permanently.

**Access:** Maintainer only

**Headers:**
```
Authorization: <JWT_TOKEN>
```

**URL Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| id | number | Issue ID |

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Issue deleted successfully"
}
```

**Error Responses:**
- **401 Unauthorized**: Invalid/missing token
- **403 Forbidden**: Only maintainers can delete
- **404 Not Found**: Issue doesn't exist
- **500 Internal Server Error**: Database error

---

## HTTP Status Codes Reference

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET, PATCH, DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Validation errors, invalid input |
| 401 | Unauthorized | Missing, expired, or invalid JWT |
| 403 | Forbidden | Valid JWT but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Unexpected server or database error |

---

## Rate Limiting

Currently no rate limiting. Rate limiting can be added in future updates.

---

## Error Handling

All error responses follow the standard format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": {}
}
```

Common error messages:
- `Missing authorization token` → 401
- `Invalid or expired token` → 401
- `Insufficient permissions` → 403
- `Email already registered` → 400
- `Invalid email or password` → 400
- `Title must be between 1 and 150 characters` → 400

---

## Examples

### Example 1: Complete User Journey

```bash
# 1. Register user
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Smith",
    "email": "alice@example.com",
    "password": "secure123",
    "role": "contributor"
  }'

# Response: { "success": true, "data": { "id": 2, ... } }

# 2. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "secure123"
  }'

# Response: { "success": true, "data": { "token": "...", "user": { ... } } }

# 3. Create issue (use token from login)
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
curl -X POST http://localhost:5000/api/issues \
  -H "Content-Type: application/json" \
  -H "Authorization: $TOKEN" \
  -d '{
    "title": "UI button styling issue",
    "description": "The submit button is not properly styled on mobile devices and appears cut off",
    "type": "bug"
  }'

# 4. Get all bug reports
curl "http://localhost:5000/api/issues?type=bug&sort=newest"

# 5. Update own issue
curl -X PATCH http://localhost:5000/api/issues/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: $TOKEN" \
  -d '{
    "status": "in_progress"
  }'
```

---

## Changelog

- **v1.0.0** (2026-06-06): Initial API release
  - Auth endpoints (signup, login)
  - Issues endpoints (CRUD)
  - Role-based access control
  - Full TypeScript support
