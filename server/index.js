import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fetch from 'node-fetch';
import chatRoutes from './routes/chat.js';
import professorRoutes from './routes/professor.js';
import scrapingRoutes from './routes/scraping.js';
import './config/pinecone.js';
import './config/googleCloud.js';

global.fetch = fetch;

dotenv.config();

const app = express();

// Apply CORS globally with correct settings
app.use(cors({
  origin: 'https://professera-ai.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Allow cookies to be sent
}));

// Automatically respond to preflight requests
app.options('*', cors());

// Body parser middleware
app.use(express.json());

// Register your routes with proper prefixes
app.use('/api', chatRoutes);
app.use('/api', professorRoutes);
app.use('/api', scrapingRoutes);

export default app;
