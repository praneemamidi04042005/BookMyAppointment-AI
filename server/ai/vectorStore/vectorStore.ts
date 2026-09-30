import { MedicalKnowledgeModel } from '../../models/MedicalKnowledge.js';
import { cosineSimilarity, embedText } from '../embeddings/simpleEmbedding.js';

export type VectorDocument = {
  title: string;
  category: string;
  content: string;
  tags?: string[];
  source?: string;
};

export async function indexKnowledgeDocuments(documents: VectorDocument[]) {
  for (const document of documents) {
    await MedicalKnowledgeModel.updateOne(
      { title: document.title },
      {
        $set: {
          title: document.title,
          category: document.category,
          content: document.content,
          tags: document.tags ?? [],
          source: document.source ?? 'internal',
          embedding: embedText(document.content),
        },
      },
      { upsert: true },
    );
  }
}

export async function searchKnowledge(query: string, limit = 5) {
  const queryEmbedding = embedText(query);
  const documents = await MedicalKnowledgeModel.find().lean();

  return documents
    .map((document) => ({
      ...document,
      score: cosineSimilarity(queryEmbedding, document.embedding ?? []),
    }))
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
}
