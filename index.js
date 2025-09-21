import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import userRoutes from './src/routes/userRoutes.js';
import pollRoutes from './src/routes/pollRoutes.js';
import pollAnswerRoutes from './src/routes/pollAnswerRoutes.js';
import sessionRoutes from "./src/routes/sessionRoutes.js";

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use('/users', userRoutes);          // /users/register, /users/login
app.use('/polls', pollRoutes);          // /polls (create poll)
app.use('/polls', pollAnswerRoutes);
app.use("/sessions", sessionRoutes);    // /polls/answer (submit answer)

// Global error handler
app.use((err, req, res, next) => {
  console.error("💥 Global Error:", err);
  res.status(500).json({ error: err.message, stack: err.stack });
});

// Test endpoint
app.get('/', (req, res) => res.send('API running...'));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
