# Technical Interview Questions & Answers

## Overview
This document contains answers to 2 selected technical interview questions from the DevPulse assignment.

---

## Question 1: How does the Node.js event loop execute asynchronous tasks without blocking the single main thread?

### Answer

The Node.js event loop is the core mechanism that allows JavaScript—a single-threaded language—to handle asynchronous operations without blocking.

**How it Works:**

1. **Call Stack**: When you call a function, it goes onto the call stack. When the function finishes, it pops off.

2. **Web APIs / libuv**: When you use asynchronous APIs (like `fs.readFile`, `setTimeout`, `http.request`, database queries), Node.js doesn't execute them on the main thread. Instead, it hands them to the underlying C++ library called **libuv**, which manages a thread pool.

3. **Callback Queue**: Once an async operation completes (file read done, timer expires, HTTP response received), the callback is placed in the callback queue, NOT executed immediately.

4. **Event Loop**: The event loop continuously checks: "Is the call stack empty?" If yes, it takes the first callback from the callback queue and pushes it onto the call stack to be executed.

**Example:**
```javascript
console.log('Start');

setTimeout(() => {
  console.log('Timeout');
}, 0);

console.log('End');
```

**Execution Flow:**
1. `console.log('Start')` → Executes immediately, prints "Start"
2. `setTimeout` → Registered with libuv, goes to callback queue later
3. `console.log('End')` → Executes immediately, prints "End"
4. Call stack is now empty, event loop picks up the timeout callback
5. `console.log('Timeout')` → Executes, prints "Timeout"

**Output:**
```
Start
End
Timeout
```

**Why This Matters for DevPulse:**
- Database queries (`pool.query()`) are async — they don't block the server
- While waiting for a DB response, the server can handle other requests
- Multiple users can be served simultaneously on a single thread

---

## Question 2: What is the purpose of `next()` in Express middleware, and what happens if it is omitted in a route handler?

### Answer

**What is `next()`?**

`next()` is a function provided by Express to route handlers and middleware. It signals Express to move to the next middleware or route handler in the chain.

**Middleware Execution Flow:**

Express processes requests through a middleware chain. Each middleware receives three parameters:
- `req` (request object)
- `res` (response object)
- `next` (function to continue to the next handler)

When you call `next()`, Express passes control to the next middleware/route handler in the stack.

**Example:**

```typescript
app.use((req, res, next) => {
  console.log('Middleware 1');
  next(); // Pass control to next middleware
});

app.use((req, res, next) => {
  console.log('Middleware 2');
  next();
});

app.get('/test', (req, res) => {
  console.log('Route handler');
  res.send('Done');
});
```

**Output when GET /test is called:**
```
Middleware 1
Middleware 2
Route handler
Done
```

**What Happens if You Omit `next()`?**

If you don't call `next()`, the request chain **stops**. Subsequent middleware and route handlers are **never executed**.

**Example:**

```typescript
app.use((req, res, next) => {
  console.log('Middleware 1');
  // next() is omitted!
});

app.use((req, res, next) => {
  console.log('Middleware 2'); // Never executes
  next();
});

app.get('/test', (req, res) => {
  console.log('Route handler'); // Never executes
  res.send('Done'); // Never sends
});
```

**Behavior:**
- "Middleware 1" is printed
- "Middleware 2" and the route handler are never executed
- The client receives no response (request hangs)

**Common Mistakes:**

```typescript
// ❌ Wrong: next is not called, request hangs
app.get('/user', (req, res) => {
  const user = getUserData();
  // Forgot to send response or call next()
});

// ✅ Correct: Send response to end the chain
app.get('/user', (req, res) => {
  const user = getUserData();
  res.json(user); // Ends the request
});

// ✅ Correct: Call next() to continue chain
app.use((req, res, next) => {
  req.user = extractUser();
  next(); // Pass to next handler
});
```

**How DevPulse Uses This:**

In our auth middleware:
```typescript
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization;

  if (!token) {
    sendError(res, 401, 'Missing authorization token');
    return; // Don't call next(), request ends with 401 error
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next(); // Token valid, continue to route handler
  } catch {
    sendError(res, 401, 'Invalid or expired token');
    // Don't call next(), request ends with 401 error
  }
};
```

**Why It Matters:**
- If token is invalid, we send error and **don't** call `next()` → Request ends
- If token is valid, we call `next()` → Route handler executes
- Controls the request flow and security

---

## Summary

| Concept | Key Point |
|---------|-----------|
| **Event Loop** | Allows single-threaded JS to handle async operations via libuv's thread pool |
| **next() Function** | Passes control to the next middleware/route handler in the chain |
| **Omitting next()** | Stops the request chain; subsequent handlers never execute |

Both concepts are fundamental to building scalable, asynchronous Node.js applications.
