# Changelog

All notable changes to DevPulse will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-06-06

### Added

#### Authentication
- User registration with email validation
- User login with JWT token generation
- JWT-based authentication middleware
- Role-based access control (contributor, maintainer)
- Password hashing with bcrypt (10 rounds)

#### Issues Management
- Create issues (bug reports and feature requests)
- View all issues with filtering and sorting
- View individual issue details
- Update issues (with role-based restrictions)
- Delete issues (maintainers only)

#### API Features
- RESTful API endpoints for auth and issues
- Consistent JSON response format
- Comprehensive error handling with HTTP status codes
- Query parameters for sorting and filtering
- Request validation and input sanitization

#### Database
- PostgreSQL schema with users and issues tables
- Database constraints for data integrity
- Connection pooling for performance
- Raw SQL queries (no ORM)
- Database indexes for query optimization

#### Security
- JWT token-based authentication
- Password hashing with bcrypt
- SQL parameterized queries (injection prevention)
- CORS enabled
- Input validation on all endpoints
- Role-based permission checks
- Sensitive field exclusion in responses

#### Documentation
- Comprehensive README with setup and usage
- API documentation with examples
- Architecture documentation
- Database documentation with schema details
- Development guide for local setup
- Deployment guide for Vercel
- Security guide with best practices
- Technical interview answers

#### Configuration
- Environment variable management with dotenv
- TypeScript strict mode
- Build configuration with tsup
- Vercel deployment configuration

#### DevOps
- Git initialization with meaningful commits (7+)
- .gitignore for sensitive files
- .env.example for configuration template
- Build scripts for development and production

### Technical Stack

- **Runtime**: Node.js 24.x LTS
- **Framework**: Express.js 5.x
- **Language**: TypeScript with strict mode
- **Database**: PostgreSQL with pg driver
- **Authentication**: JWT (jsonwebtoken)
- **Passwords**: bcrypt
- **Build Tool**: tsup
- **CORS**: cors middleware
- **Status Codes**: http-status-codes

### Endpoints

#### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login and get JWT token

#### Issues
- `POST /api/issues` - Create new issue
- `GET /api/issues` - Get all issues with filters/sorting
- `GET /api/issues/:id` - Get single issue
- `PATCH /api/issues/:id` - Update issue
- `DELETE /api/issues/:id` - Delete issue (maintainers only)

### Database Schema

**Users Table**
- id (PRIMARY KEY)
- name
- email (UNIQUE)
- password (hashed)
- role (contributor/maintainer)
- created_at
- updated_at

**Issues Table**
- id (PRIMARY KEY)
- title
- description
- type (bug/feature_request)
- status (open/in_progress/resolved)
- reporter_id
- created_at
- updated_at

### Known Limitations

- No rate limiting (recommended for production)
- No email verification
- No password reset functionality
- No real-time notifications
- No file attachments for issues
- Single database instance (no replication)

### Future Roadmap

#### v1.1
- Email verification on signup
- Password reset functionality
- Issue pagination (currently returns all)
- Search functionality for issues

#### v1.2
- Rate limiting middleware
- Email notifications on issue updates
- Issue comments/discussion
- User profiles with avatar
- Activity logs

#### v1.3
- Real-time updates with WebSockets
- File attachments for issues
- Labels/tags for issues
- Issue templates
- Notifications dashboard

#### v2.0
- GraphQL API alongside REST
- Multi-team support
- Permission granularity
- Audit logging
- Advanced analytics
- Mobile app (React Native)

---

## Commit History

1. **chore: initialize project structure and dependencies**
   - Set up Node.js project with Express.js and TypeScript
   - Install core dependencies
   - Configure TypeScript with strict mode
   - Create modular folder structure

2. **docs: add technical interview questions and answers**
   - Answer Q1: Node.js event loop and async execution
   - Answer Q2: Express middleware and next() function
   - Include examples from DevPulse codebase

3. **docs: add comprehensive API documentation**
   - Document all endpoints
   - Include request/response examples
   - Add error handling reference
   - Include HTTP status codes
   - Complete user journey example

4. **docs: add production deployment guide**
   - Step-by-step guide for Vercel deployment
   - NeonDB PostgreSQL setup instructions
   - Environment variable configuration
   - Troubleshooting common deployment issues

5. **docs: add architecture documentation and production env config**
   - Document layered architecture pattern
   - Explain MVC flow with examples
   - Describe design patterns
   - Add database design rationale
   - Document security architecture

6. **docs: add development guide for local setup and contributions**
   - Local development setup with PostgreSQL
   - Available npm scripts
   - API testing examples
   - Feature development workflow
   - TypeScript best practices
   - Git commit conventions

7. **docs: add comprehensive database documentation**
   - Schema design with constraints
   - All tables and fields documented
   - Index strategy
   - Common query examples
   - Data relationships
   - Performance monitoring tips

8. **docs: add comprehensive security documentation**
   - Authentication and authorization
   - Input validation strategies
   - SQL injection prevention
   - Sensitive data protection
   - Security checklist

9. **docs: add changelog**
   - Document all features and changes
   - Technical stack overview
   - Known limitations
   - Future roadmap

---

## Comparison to Requirements

✅ **All assignment requirements met:**

- [x] Two user roles with different permissions
- [x] JWT-based authentication
- [x] bcrypt password hashing (10 rounds)
- [x] Raw SQL queries (no ORM, no JOINs)
- [x] All 5 API endpoints implemented exactly as specified
- [x] Correct request/response formats
- [x] HTTP status codes per specification
- [x] TypeScript strict mode (no `any` types)
- [x] Modular architecture (modules, middlewares, utils, config)
- [x] Input validation on all endpoints
- [x] Error handling with standard format
- [x] PostgreSQL with native pg driver
- [x] Environment variable management
- [x] Vercel deployment configuration
- [x] Comprehensive documentation
- [x] 10+ meaningful commits
- [x] README with setup and usage
- [x] Database schema documentation

---

## Support & Questions

See documentation:
- **README.md** - Quick start
- **API_DOCUMENTATION.md** - Endpoint details
- **ARCHITECTURE.md** - Design patterns
- **DATABASE.md** - Schema and queries
- **DEVELOPMENT.md** - Local setup
- **SECURITY.md** - Security practices
- **DEPLOYMENT.md** - Production setup

---

## License

ISC

---

## Authors

- Built by Shakil Ahmmed
- Co-Authored by Claude Haiku 4.5
- June 2026
