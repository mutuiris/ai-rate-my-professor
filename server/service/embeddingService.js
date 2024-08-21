import { pipeline } from '@xenova/transformers';

let model = null;

async function getEmbedding(text) {
  if (!model) {
    model = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  const result = await model(text, { pooling: 'mean', normalize: true });
  return Array.from(result.data);
}

export { getEmbedding };
