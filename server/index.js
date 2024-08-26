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

export default app;
