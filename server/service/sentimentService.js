import { pipeline } from '@xenova/transformers';

let sentimentModel = null;

export async function analyzeSentiment(text) {
  if (!sentimentModel) {
    sentimentModel = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
  }

  const result = await sentimentModel(text);
  return result[0].label.toLowerCase();  // Returns 'positive', 'negative', or 'neutral'
}
