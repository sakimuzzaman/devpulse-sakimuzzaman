import express, { Application } from 'express';


const app: Application = express();

// Body parser middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'DevPulse API is healthy',
    timestamp: new Date().toISOString(),
  });
});



export default app;