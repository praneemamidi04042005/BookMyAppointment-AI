import { searchKnowledge } from '../vectorStore/vectorStore.js';

export async function retrieveMedicalContext(query: string) {
  const results = await searchKnowledge(query, 4);
  return results.map((result) => ({
    title: result.title,
    category: result.category,
    content: result.content,
    score: result.score,
  }));
}
