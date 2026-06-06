import express from 'express';
import cors from 'cors';
import { authRoute } from './modules/auth/auth.route.js';
import { issueRoute } from './modules/issues/issues.route.js';
import { globalErrorHandler, notFoundHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoute);
app.use('/api/issues', issueRoute);

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'DevPulse API is running' });
});

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
