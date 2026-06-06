# DevPulse Manual Testing Guide

Complete copy-paste commands for testing all API endpoints.

---

## Prerequisites

1. **Start the server locally**
```bash
cd src/all-assignments/assignment-two
npm run dev
```

Server will run on: `http://localhost:5000`

2. **Keep a terminal open** to run the curl commands below

---

## Step 1: Register Users

### Register Contributor User
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "contributor"
  }'
```

**Expected Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "contributor",
    "created_at": "2026-06-06T12:00:00Z",
    "updated_at": "2026-06-06T12:00:00Z"
  }
}
```

---

### Register Maintainer User
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Smith",
    "email": "alice@example.com",
    "password": "password123",
    "role": "maintainer"
  }'
```

---

## Step 2: Login & Get Tokens

### Login as Contributor
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response (200 OK):**
```json
{
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "contributor",
      "created_at": "2026-06-06T12:00:00Z",
      "updated_at": "2026-06-06T12:00:00Z"
    }
  }
}
```

**⚠️ COPY THE TOKEN and use below:**
```
TOKEN_CONTRIBUTOR="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### Login as Maintainer
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "password123"
  }'
```

**⚠️ COPY THE TOKEN:**
```
TOKEN_MAINTAINER="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Step 3: Create Issues

### Create Issue as Contributor
```bash
curl -X POST http://localhost:5000/api/issues \
  -H "Content-Type: application/json" \
  -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "Login page button not working",
    "description": "The submit button on the login page is not responding to clicks. This happens on Chrome browser version 120+. I have tested this on Firefox and it works fine there.",
    "type": "bug"
  }'
```

**Replace `eyJhbGc...` with your ACTUAL TOKEN_CONTRIBUTOR**

**Expected Response (201 Created):**
```json
{
  "message": "Issue created successfully",
  "data": {
    "id": 1,
    "title": "Login page button not working",
    "description": "The submit button on the login page is not responding to clicks. This happens on Chrome browser version 120+. I have tested this on Firefox and it works fine there.",
    "type": "bug",
    "status": "open",
    "reporter_id": 1,
    "created_at": "2026-06-06T12:05:00Z",
    "updated_at": "2026-06-06T12:05:00Z",
    "reporter": {
      "id": 1,
      "name": "John Doe",
      "role": "contributor"
    }
  }
}
```

---

### Create Another Issue as Contributor
```bash
curl -X POST http://localhost:5000/api/issues \
  -H "Content-Type: application/json" \
  -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "Add dark mode support",
    "description": "Users are requesting a dark mode option in the application. This would improve usability for users working in low-light environments and reduce eye strain during night-time usage.",
    "type": "feature_request"
  }'
```

---

## Step 4: Get All Issues

### Get All Issues (No Filters)
```bash
curl http://localhost:5000/api/issues
```

**Expected Response (200 OK):**
```json
{
  "message": "Issues retrived successfully",
  "data": [
    {
      "id": 2,
      "title": "Add dark mode support",
      "description": "Users are requesting a dark mode option...",
      "type": "feature_request",
      "status": "open",
      "reporter": {
        "id": 1,
        "name": "John Doe",
        "role": "contributor"
      },
      "created_at": "2026-06-06T12:06:00Z",
      "updated_at": "2026-06-06T12:06:00Z"
    },
    {
      "id": 1,
      "title": "Login page button not working",
      "description": "The submit button on the login page...",
      "type": "bug",
      "status": "open",
      "reporter": {
        "id": 1,
        "name": "John Doe",
        "role": "contributor"
      },
      "created_at": "2026-06-06T12:05:00Z",
      "updated_at": "2026-06-06T12:05:00Z"
    }
  ]
}
```

---

### Get All Bug Issues Only
```bash
curl http://localhost:5000/api/issues?type=bug
```

---

### Get All Feature Requests Only
```bash
curl http://localhost:5000/api/issues?type=feature_request
```

---

### Get All Open Issues
```bash
curl http://localhost:5000/api/issues?status=open
```

---

### Get All In-Progress Issues
```bash
curl http://localhost:5000/api/issues?status=in_progress
```

---

### Get Sorted by Oldest First
```bash
curl http://localhost:5000/api/issues?sort=oldest
```

---

### Combine Multiple Filters
```bash
curl http://localhost:5000/api/issues?type=bug&status=open&sort=newest
```

---

## Step 5: Get Single Issue

### Get Issue by ID
```bash
curl http://localhost:5000/api/issues/1
```

**Expected Response (200 OK):**
```json
{
  "message": "Issue retrived successfully",
  "data": {
    "id": 1,
    "title": "Login page button not working",
    "description": "The submit button on the login page...",
    "type": "bug",
    "status": "open",
    "reporter": {
      "id": 1,
      "name": "John Doe",
      "role": "contributor"
    },
    "created_at": "2026-06-06T12:05:00Z",
    "updated_at": "2026-06-06T12:05:00Z"
  }
}
```

---

## Step 6: Update Issue

### Update Own Issue (Contributor)
```bash
curl -X PATCH http://localhost:5000/api/issues/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "Login page button not responding - URGENT",
    "status": "in_progress"
  }'
```

**Replace token with TOKEN_CONTRIBUTOR**

**Expected Response (200 OK):**
```json
{
  "message": "Issue updated successfully",
  "data": {
    "id": 1,
    "title": "Login page button not responding - URGENT",
    "description": "The submit button on the login page...",
    "type": "bug",
    "status": "in_progress",
    "reporter_id": 1,
    "created_at": "2026-06-06T12:05:00Z",
    "updated_at": "2026-06-06T12:10:00Z",
    "reporter": {
      "id": 1,
      "name": "John Doe",
      "role": "contributor"
    }
  }
}
```

---

### Maintainer Can Update Any Issue
```bash
curl -X PATCH http://localhost:5000/api/issues/2 \
  -H "Content-Type: application/json" \
  -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "status": "in_progress"
  }'
```

**Replace token with TOKEN_MAINTAINER**

---

## Step 7: Test Permission Restrictions

### Test: Contributor Cannot Update Other User's Issue
```bash
curl -X PATCH http://localhost:5000/api/issues/2 \
  -H "Content-Type: application/json" \
  -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "Changed by someone else"
  }'
```

**Expected Response (403 Forbidden):**
```json
{
  "message": "Contributors can only update their own issues"
}
```

---

### Test: Contributor Cannot Update Resolved Issue
First, change issue status to resolved (as maintainer), then try:

```bash
curl -X PATCH http://localhost:5000/api/issues/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "Try to update resolved issue"
  }'
```

**Replace token with TOKEN_CONTRIBUTOR**

**Expected Response (403 Forbidden):**
```json
{
  "message": "Contributors can only update issues with open status"
}
```

---

### Test: Only Maintainer Can Delete
```bash
curl -X DELETE http://localhost:5000/api/issues/2 \
  -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Replace token with TOKEN_CONTRIBUTOR**

**Expected Response (403 Forbidden):**
```json
{
  "message": "Insufficient permissions"
}
```

---

## Step 8: Delete Issue (Maintainer Only)

### Delete as Maintainer
```bash
curl -X DELETE http://localhost:5000/api/issues/2 \
  -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Replace token with TOKEN_MAINTAINER**

**Expected Response (200 OK):**
```json
{
  "message": "Issue deleted successfully",
  "data": {
    "id": 2,
    "title": "Add dark mode support",
    "description": "Users are requesting a dark mode option...",
    "type": "feature_request",
    "status": "open",
    "reporter_id": 1,
    "created_at": "2026-06-06T12:06:00Z",
    "updated_at": "2026-06-06T12:06:00Z"
  }
}
```

---

## Step 9: Test Validation Errors

### Test: Missing Required Fields
```bash
curl -X POST http://localhost:5000/api/issues \
  -H "Content-Type: application/json" \
  -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "Missing description"
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "message": "Title, description, and type are required"
}
```

---

### Test: Title Too Short
```bash
curl -X POST http://localhost:5000/api/issues \
  -H "Content-Type: application/json" \
  -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "",
    "description": "This description is long enough but title is empty",
    "type": "bug"
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "message": "Title must be between 1 and 150 characters"
}
```

---

### Test: Description Too Short
```bash
curl -X POST http://localhost:5000/api/issues \
  -H "Content-Type: application/json" \
  -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "Short description test",
    "description": "Too short",
    "type": "bug"
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "message": "Description must be at least 20 characters"
}
```

---

### Test: Invalid Issue Type
```bash
curl -X POST http://localhost:5000/api/issues \
  -H "Content-Type: application/json" \
  -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "Invalid type test",
    "description": "This is a test with an invalid type that should fail validation",
    "type": "invalid_type"
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "message": "Type must be bug or feature_request"
}
```

---

### Test: Invalid Issue Status
```bash
curl -X PATCH http://localhost:5000/api/issues/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "status": "invalid_status"
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "message": "Status must be open, in_progress, or resolved"
}
```

---

### Test: Missing Authorization Token
```bash
curl -X POST http://localhost:5000/api/issues \
  -H "Content-Type: application/json" \
  -d '{
    "title": "No token provided",
    "description": "This request has no authorization token so it should fail",
    "type": "bug"
  }'
```

**Expected Response (401 Unauthorized):**
```json
{
  "message": "Missing authorization token"
}
```

---

### Test: Invalid Token
```bash
curl -X POST http://localhost:5000/api/issues \
  -H "Content-Type: application/json" \
  -H "Authorization: invalid.token.here" \
  -d '{
    "title": "Invalid token test",
    "description": "This request has an invalid token so it should fail",
    "type": "bug"
  }'
```

**Expected Response (401 Unauthorized):**
```json
{
  "message": "Invalid or expired token"
}
```

---

### Test: Issue Not Found
```bash
curl http://localhost:5000/api/issues/99999
```

**Expected Response (404 Not Found):**
```json
{
  "message": "Issue not found",
  "data": null
}
```

---

## Quick Reference Table

| Test Case | Command | Expected Status |
|-----------|---------|-----------------|
| Register user | POST /api/auth/signup | 201 |
| Login user | POST /api/auth/login | 200 |
| Create issue | POST /api/issues | 201 |
| Get all issues | GET /api/issues | 200 |
| Get single issue | GET /api/issues/:id | 200 |
| Update own issue | PATCH /api/issues/:id | 200 |
| Contributor update other's issue | PATCH /api/issues/:id | 403 |
| Delete as maintainer | DELETE /api/issues/:id | 200 |
| Delete as contributor | DELETE /api/issues/:id | 403 |
| Missing required fields | POST /api/issues | 400 |
| Missing token | POST /api/issues | 401 |
| Invalid token | POST /api/issues | 401 |
| Issue not found | GET /api/issues/99999 | 404 |

---

## Testing Checklist

After running all tests, check:

- [x] All 2xx responses are correct format
- [x] All 4xx error messages are clear
- [x] JWT validation working
- [x] Role-based access control working
- [x] Ownership validation working
- [x] All validations triggering correctly
- [x] Status codes matching spec
- [x] Response data structure correct
- [x] Database persisting correctly
- [x] Reporter information included in responses

---

## Troubleshooting

**Issue: "Cannot POST /api/issues"**
- Make sure server is running with `npm run dev`
- Check URL is correct: `http://localhost:5000`

**Issue: "Missing authorization token"**
- Add the Authorization header with your token
- Token should start with `eyJ`

**Issue: "Invalid or expired token"**
- Get a new token by logging in again
- Copy the full token string (no extra quotes)

**Issue: Database connection error**
- Check `.env` file has DATABASE_URL
- Make sure PostgreSQL is running
- Run `src/db/init.sql` to initialize schema

---

## Next Steps

1. Run all tests above ✅
2. Verify all responses match expected format
3. Check database for inserted data
4. Ready for deployment! 🚀

