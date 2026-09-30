const dimension = 48;
const stopWords = new Set(['the', 'and', 'for', 'with', 'your', 'from', 'that', 'this', 'are', 'was', 'were', 'has', 'have', 'patient', 'report', 'result', 'results']);

function hashToken(token: string) {
  let hash = 0;
  for (let index = 0; index < token.length; index += 1) {
    hash = (hash * 31 + token.charCodeAt(index)) >>> 0;
  }
  return hash;
}

export function embedText(text: string) {
  const vector = Array.from({ length: dimension }, () => 0);
  const tokens = text.toLowerCase().match(/[a-z0-9%.]+/g) ?? [];

  for (const token of tokens) {
    if (stopWords.has(token)) {
      continue;
    }
    const index = hashToken(token) % dimension;
    vector[index] += 1;
  }

  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
  return vector.map((value) => value / magnitude);
}

export function cosineSimilarity(left: number[], right: number[]) {
  const length = Math.min(left.length, right.length);
  let dotProduct = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;

  for (let index = 0; index < length; index += 1) {
    dotProduct += left[index] * right[index];
    leftMagnitude += left[index] * left[index];
    rightMagnitude += right[index] * right[index];
  }

  return dotProduct / ((Math.sqrt(leftMagnitude) || 1) * (Math.sqrt(rightMagnitude) || 1));
}
