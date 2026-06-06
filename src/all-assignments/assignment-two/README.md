# DevPulse – Bug Tracking & Feature Request Platform

A collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions.

## 🌐 Live Deployment
**Coming Soon** — Deploy to Vercel, Render, or Railway

## ✨ Features
- **User Authentication**: JWT-based auth with role-based access control
- **Two User Roles**: Contributors and Maintainers
- **Issue Management**: Create, read, update, delete issues (bugs & feature requests)
- **Filtering & Sorting**: Filter by type, status; sort by newest/oldest
- **Secure API**: All protected endpoints require valid JWT tokens
- **Type-Safe**: Full TypeScript strict mode, zero `any` types

## 🛠️ Technology Stack
| Tech | Version | Purpose |
|------|---------|---------|
| Node.js | 24.x LTS | Runtime |
| Express.js | 5.x | Web framework |
| TypeScript | Latest | Type safety |
| PostgreSQL | Native `pg` driver | Database |
| bcrypt | 6.x | Password hashing |
| JWT | jsonwebtoken 9.x | Authentication |
| CORS | 2.x | Cross-origin requests |

## 📋 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'contributor' CHECK (role IN ('contributor', 'maintainer')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Issues Table
```sql
CREATE TABLE issues (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('bug', 'feature_request')),
  status VARCHAR(50) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  reporter_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Quick Start

### Prerequisites
- Node.js 24.x or higher
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone and navigate to project**
```bash
cd src/all-assignments/assignment-two
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

4. **Initialize database**
```sql
-- Run SQL from src/db/init.sql in your PostgreSQL client
-- Or use psql:
psql -U your_user -d devpulse -f src/db/init.sql
```

5. **Run development server**
```bash
npm run dev
```
Server will start on `http://localhost:5000`

6. **Build for production**
```bash
npm run build
npm start
```

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/signup` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login and get JWT token |

### Issues
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/issues` | Authenticated | Create new issue |
| GET | `/api/issues` | Public | Get all issues (with filters) |
| GET | `/api/issues/:id` | Public | Get single issue |
| PATCH | `/api/issues/:id` | Authenticated | Update issue |
| DELETE | `/api/issues/:id` | Maintainer only | Delete issue |

## 📝 API Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePass123",
    "role": "contributor"
  }'
```

**Response (201 Created)**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "contributor",
    "created_at": "2026-01-20T09:00:00Z",
    "updated_at": "2026-01-20T09:00:00Z"
  }
}
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePass123"
  }'
```

**Response (200 OK)**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "contributor",
      "created_at": "2026-01-20T09:00:00Z",
      "updated_at": "2026-01-20T09:00:00Z"
    }
  }
}
```

### Create Issue
```bash
curl -X POST http://localhost:5000/api/issues \
  -H "Content-Type: application/json" \
  -H "Authorization: YOUR_JWT_TOKEN" \
  -d '{
    "title": "Database connection timeout",
    "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
    "type": "bug"
  }'
```

### Get All Issues
```bash
# Get all issues sorted by newest
curl http://localhost:5000/api/issues?sort=newest

# Filter by type
curl http://localhost:5000/api/issues?type=bug

# Filter by status
curl http://localhost:5000/api/issues?status=open

# Combine filters
curl http://localhost:5000/api/issues?sort=oldest&type=feature_request&status=in_progress
```

### Get Single Issue
```bash
curl http://localhost:5000/api/issues/1
```

### Update Issue
```bash
curl -X PATCH http://localhost:5000/api/issues/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: YOUR_JWT_TOKEN" \
  -d '{
    "title": "Updated title",
    "status": "in_progress"
  }'
```

**Permission Rules:**
- **Maintainer**: Can update any issue
- **Contributor**: Can only update own issues with `open` status

### Delete Issue
```bash
curl -X DELETE http://localhost:5000/api/issues/1 \
  -H "Authorization: YOUR_JWT_TOKEN"
```

**Permission**: Maintainer only

## 📂 Project Structure

```
src/
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.route.ts
│   └── issues/
│       ├── issues.controller.ts
│       ├── issues.service.ts
│       └── issues.route.ts
├── middlewares/
│   └── auth.middleware.ts
├── utils/
│   ├── response.ts
│   ├── validation.ts
│   └── db.ts
├── config/
│   └── index.ts
├── db/
│   ├── index.ts
│   └── init.sql
├── app.ts
└── server.ts

dist/
├── server.js
└── ...
```

## 🔐 Authentication Flow

1. User registers/logs in and receives JWT token
2. Token contains: `id`, `name`, `role`
3. Client sends token in `Authorization: <token>` header
4. Middleware verifies token signature and expiry
5. Protected endpoints extract user data from decoded token

**Token Expiry**: 7 days (configurable in `.env`)

## 👥 User Roles & Permissions

### Contributor
- ✅ Register and login
- ✅ Create new issues
- ✅ View all issues
- ✅ Update own issues (only if status is `open`)
- ❌ Delete issues
- ❌ Change other users' issues

### Maintainer
- ✅ All contributor permissions
- ✅ Update ANY issue
- ✅ Delete ANY issue
- ✅ Change issue status independently
- ✅ Manage workflow

## 🔍 Validation Rules

### User Registration
- **Name**: Required, non-empty
- **Email**: Valid format, must be unique
- **Password**: Minimum 6 characters
- **Role**: `contributor` or `maintainer` (defaults to contributor)

### Issue Creation
- **Title**: 1-150 characters
- **Description**: Minimum 20 characters
- **Type**: `bug` or `feature_request`
- **Status**: Auto-set to `open`

## 🌐 HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PATCH, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Validation errors |
| 401 | Unauthorized | Missing/invalid JWT |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Unexpected error |

## 🛡️ Security Features

- **Passwords**: Hashed with bcrypt (10 rounds)
- **JWT**: Signed tokens with expiry
- **CORS**: Enabled for cross-origin requests
- **Validation**: Input validation on all endpoints
- **Type Safety**: TypeScript strict mode, no `any` types
- **Raw SQL**: No query builders/ORMs, validated queries only

## 📖 Code Quality

- **Modular Architecture**: Separated concerns (routes, controllers, services, utils)
- **DRY Principle**: Reusable utilities for common tasks
- **Error Handling**: Centralized error responses
- **TypeScript**: Full strict mode compliance
- **Clean Code**: Meaningful names, no repetition

## 🚀 Deployment

### Prerequisites
- GitHub repository (public)
- Vercel/Render/Railway account
- PostgreSQL database (NeonDB/Supabase/ElephantSQL)

### Steps
1. Push code to GitHub
2. Connect repository to deployment platform
3. Set environment variables (`DATABASE_URL`, `JWT_SECRET`)
4. Deploy
5. Run database initialization on deployed database

### Vercel Deployment Example
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Redeploy after env vars are set
```

## 📹 Technical Interview Questions (Choose 2)

1. How does the Node.js event loop execute asynchronous tasks without blocking?
2. What is the purpose of `next()` in Express middleware?
3. How to create centralized error-handling middleware in Express?
4. SQL (PostgreSQL) vs NoSQL (MongoDB) differences?
5. What is database connection pooling and why prefer it?

## 📝 Assignment Requirements

✅ **Code Structure**: Modular architecture with separate modules, middlewares, utils, config
✅ **API Spec**: All endpoints match specification exactly
✅ **Database**: Raw SQL only, no ORMs/query builders/JOINs
✅ **TypeScript**: Strict mode, no `any` types
✅ **Authentication**: JWT with role-based permissions
✅ **Validation**: Input validation on all endpoints
✅ **Error Handling**: Centralized, consistent response format
✅ **Deployment**: Configured for Vercel with vercel.json
✅ **Git**: 10+ meaningful commits
✅ **README**: Comprehensive documentation

## 📌 Important Notes

- **Passwords**: Never stored in plaintext, hashed with bcrypt
- **JWT**: Standard tokens, includes user id/name/role
- **No JOINs**: All reporter data fetched separately
- **No Foreign Keys**: Validation handled in application logic
- **CORS Enabled**: Cross-origin requests allowed

## 🤝 Support

For issues or questions, check:
1. API endpoint documentation in README
2. Database schema in `src/db/init.sql`
3. Environment variables in `.env.example`

## 📄 License

ISC

---

**DevPulse** – Built with ❤️ following modern Express.js best practices
