import fetch from "node-fetch";
globalThis.fetch = fetch;

import { Pinecone } from "@pinecone-database/pinecone";

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});

export default pc;