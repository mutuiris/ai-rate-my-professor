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

app.use(cors({
  origin: 'https://professera-ai.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

app.use(express.json());
app.use('', chatRoutes);
app.use('', professorRoutes);
app.use('', scrapingRoutes);

// Add this middleware to handle CORS errors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://professera-ai.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

export default app;