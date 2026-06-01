# quickclipai
This is a great website to make viral short clips with AI's help! AI will do everything for you, and make you go viral on social media FAST!
// Main application server - backend for AI Shorts Creator
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { stripeRouter } from './routes/stripe';
import { videoRouter } from './routes/video';
import { authRouter } from './routes/auth';
import { userRouter } from './routes/user';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/stripe', stripeRouter);
app.use('/api/video', videoRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'AI Shorts Creator is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
