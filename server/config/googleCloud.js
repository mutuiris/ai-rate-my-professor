import dotenv from "dotenv";
import { Storage } from '@google-cloud/storage';

dotenv.config();

const storage = new Storage ({
  keyFilename: process.env.GOOGLE_CLOUD_CREDENTIALS,
});

export default storage;