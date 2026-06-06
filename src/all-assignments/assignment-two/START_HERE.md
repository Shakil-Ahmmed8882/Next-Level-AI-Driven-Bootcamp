# 🚀 DevPulse - Start Here!

Welcome! This is your complete assignment 2 project. Everything is ready to go.

---

## ⚡ Quick Start (5 Minutes)

### 1. Install & Start Server
```bash
cd src/all-assignments/assignment-two
npm run dev
```

You should see: `DevPulse server running on port 5000`

### 2. Test Everything (in another terminal)
```bash
bash QUICK_TEST.sh
```

This will test all endpoints automatically ✅

---

## 📖 Documentation Guide

Read these in order:

1. **README.md** - Project overview, tech stack, setup (5 min read)
2. **TESTING.md** - Manual testing with copy-paste commands (10 min read)
3. **API_DOCUMENTATION.md** - All endpoint details with examples (10 min read)
4. **DEPLOYMENT.md** - How to deploy to Vercel (10 min read)

Other docs:
- **ARCHITECTURE.md** - Design patterns and code structure
- **DATABASE.md** - Schema, queries, and data relationships
- **DEVELOPMENT.md** - Local development guide
- **SECURITY.md** - Security implementation details
- **INTERVIEW_NOTES.md** - Answers to 2 tech interview questions
- **CHANGELOG.md** - Version history and roadmap

---

## 🧪 Testing Approach

### Option 1: Automated (Recommended First Time)
```bash
bash QUICK_TEST.sh
```
Runs all tests automatically, shows results with ✅ marks.

### Option 2: Manual Testing
Follow **TESTING.md** - copy-paste curl commands for each endpoint.

### Option 3: One Endpoint
```bash
# Register user
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"test123","role":"contributor"}'
```

---

## 📋 Endpoint Summary

### Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login and get JWT

### Issues (Bug Tracking)
- `POST /api/issues` - Create issue
- `GET /api/issues` - Get all issues
- `GET /api/issues/:id` - Get single issue
- `PATCH /api/issues/:id` - Update issue
- `DELETE /api/issues/:id` - Delete issue

All endpoints documented in **API_DOCUMENTATION.md**

---

## 🔑 Key Features

✅ **JWT Authentication** - Secure token-based auth
✅ **Role-Based Access** - Contributor vs Maintainer
✅ **Bug & Feature Tracking** - Create and manage issues
✅ **TypeScript** - Strict type safety
✅ **PostgreSQL** - Raw SQL, no ORM
✅ **Modular Code** - Service → Controller → Route pattern
✅ **Error Handling** - Clear error messages
✅ **Input Validation** - All fields validated

---

## 📂 Project Structure

```
src/all-assignments/assignment-two/
├── src/
│   ├── modules/
│   │   ├── auth/ (login, signup)
│   │   └── issues/ (CRUD operations)
│   ├── middlewares/ (JWT verification)
│   ├── config/ (environment)
│   ├── db/ (database)
│   └── app.ts, server.ts
├── README.md (overview)
├── TESTING.md (manual tests)
├── API_DOCUMENTATION.md (endpoints)
├── DEPLOYMENT.md (vercel setup)
├── ARCHITECTURE.md (design patterns)
├── DATABASE.md (schema & queries)
├── DEVELOPMENT.md (local setup)
├── SECURITY.md (auth & validation)
├── INTERVIEW_NOTES.md (tech Q&A)
├── CHANGELOG.md (version history)
├── QUICK_TEST.sh (automated tests)
└── START_HERE.md (this file!)
```

---

## 🛠️ Code Pattern (Matches Your Course)

### Service Layer
```typescript
export const authServices = {
  signupUserIntoDB,
  loginUserIntoDB,
}
```

### Controller Layer
```typescript
export const authControllers = {
  signup,
  login,
}
```

### Route Layer
```typescript
export const authRoute = router;
```

All interfaces in `*.interface.ts` files.

---

## 🚀 Deployment Steps

1. **Create GitHub repo** and push code
2. **Set up NeonDB** (PostgreSQL cloud)
3. **Deploy to Vercel**
4. **Set environment variables**: DATABASE_URL, JWT_SECRET

See **DEPLOYMENT.md** for detailed step-by-step guide.

---

## ✅ Testing Checklist

Before deployment, verify:

- [ ] Server starts with `npm run dev`
- [ ] QUICK_TEST.sh runs successfully
- [ ] All endpoints return correct status codes
- [ ] JWT tokens are being issued
- [ ] Users can create issues
- [ ] Permissions are enforced
- [ ] Validation errors work
- [ ] Database is persisting data

---

## 🎓 Interview Questions (Already Answered!)

See **INTERVIEW_NOTES.md** for answers to:

1. **Node.js Event Loop** - How async works without blocking
2. **Express Middleware** - What `next()` does and why it matters

Both explained with examples from DevPulse code.

---

## 🔧 Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
bash QUICK_TEST.sh

# View git history
git log --oneline

# Check TypeScript errors
npm run build
```

---

## 📞 Troubleshooting

**Server won't start?**
- Check PORT 5000 is free
- Check DATABASE_URL in .env
- Make sure PostgreSQL is running

**Tests fail?**
- Wait 5 seconds after server starts
- Check curl is installed
- Verify DATABASE_URL works

**Import errors?**
- Run `npm install`
- Check all imports use `.js` extension

---

## 📊 Project Stats

- **14 Git Commits** - Full development history
- **11 Documentation Files** - 5,000+ lines
- **7 API Endpoints** - Fully functional
- **100% TypeScript** - Strict mode
- **Zero Comments** - Self-documenting code
- **Course Pattern Compliant** - Services, Controllers, Routes

---

## 🎯 Next Steps

1. **Test locally** → Run `QUICK_TEST.sh`
2. **Read docs** → Start with `README.md`
3. **Understand code** → Check `ARCHITECTURE.md`
4. **Deploy** → Follow `DEPLOYMENT.md`
5. **Record interview** → Use `INTERVIEW_NOTES.md` as reference
6. **Submit** → GitHub + Live URL + Interview Video

---

## 📝 Files You'll Use Most

- `TESTING.md` - Copy-paste test commands
- `DEPLOYMENT.md` - How to deploy
- `API_DOCUMENTATION.md` - Endpoint details
- `QUICK_TEST.sh` - Automated testing

---

## 🎉 You're Ready!

Everything is built, tested, and documented.

```bash
# Try this now:
cd src/all-assignments/assignment-two
npm run dev
```

Then in another terminal:
```bash
bash QUICK_TEST.sh
```

See the ✅ marks and you'll know everything works!

---

**Questions?** Check the relevant documentation file listed above.

**Ready to deploy?** Open `DEPLOYMENT.md`

**Want to understand the code?** Read `ARCHITECTURE.md`

Good luck! 🚀
