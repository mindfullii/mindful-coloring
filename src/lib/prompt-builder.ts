export function buildPrompt({
  description = '',
  emotion = '',
  theme = '',
  complexity = 'medium',
  aspectRatio = '1:1',
}) {
  // 简化的 prompt 构建
  let prompt = 'Coloring Book, A black and white drawing';
  
  if (emotion) {
    prompt += ` with ${emotion} feeling`;
  }

  if (theme) {
    prompt += `, featuring ${theme} elements`;
  }

  if (description) {
    prompt += `. ${description}`;
  }

  return prompt;
} 