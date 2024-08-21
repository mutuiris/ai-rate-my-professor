import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import chatRoutes from './routes/chat.js';

dotenv.config();

app.use(cors());

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/', chatRoutes);

app.listen(port, () => {
  console.log(`Professor rating app listening at http://localhost:${port}`);
});