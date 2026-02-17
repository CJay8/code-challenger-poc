import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swapRoutes from './routes/swap';
import healthRoutes from './routes/health';
import { swaggerSpec } from './config/swagger';
import { PriceStreamService } from './services/PriceStreamService';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Create HTTP server
const server = createServer(app);

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Terminal OS API Documentation',
}));

// Initialize WebSocket price streaming
const priceStreamService = new PriceStreamService(server);

// Routes
app.use('/api/health', healthRoutes);

// API base
app.get('/api', (_req: Request, res: Response) => {
  res.json({ 
    message: 'Terminal OS API - v1.0.0',
    endpoints: {
      health: '/health',
      swap: '/api/swap/*',
      websocket: '/ws/prices',
      documentation: '/api-docs'
    }
  });
});

// API routes
app.use('/api/swap', swapRoutes);

// Current prices endpoint
app.get('/api/prices', (_req: Request, res: Response) => {
  const prices = priceStreamService.getCurrentPrices();
  res.json({
    success: true,
    data: prices
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔌 WebSocket server running on ws://localhost:${PORT}/ws/prices`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});
  console.log(`📚 API Documentation at http://localhost:${PORT}/api-docs`);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  priceStreamService.stop();
  server.close(() => {
    console.log('HTTP server closed');
  });
});

export { app, server, priceStreamService };
