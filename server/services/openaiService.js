const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const MODEL = 'gpt-4o-mini';

/**
 * Generate a list of interview questions for a given role and difficulty.
 */
async function generateQuestions(role, difficulty = 'Intermediate', count = 5) {
  const systemPrompt = `You are an expert technical interviewer. Generate realistic, role-specific interview questions.
Return ONLY valid JSON, no markdown, no extra text, in this exact shape:
{ "questions": ["question 1", "question 2", ...] }`;

  const userPrompt = `Generate ${count} realistic interview questions for the role of "${role}" at a "${difficulty}" difficulty level.
Mix technical, behavioral, and situational questions appropriate for this role. Keep each question concise (1-3 sentences).`;

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.8,
    response_format: { type: 'json_object' }
  });

  const content = response.choices[0].message.content;
  const parsed = JSON.parse(content);
  return parsed.questions || [];
}

/**
 * Evaluate a user's answer to a given interview question.
 */
async function evaluateAnswer(role, question, answer) {
  const systemPrompt = `You are an expert technical interviewer evaluating a candidate's response.
Assess the answer based on clarity, relevance, and depth.
Return ONLY valid JSON, no markdown, no extra text, in this exact shape:
{
  "clarity": <number 0-10>,
  "relevance": <number 0-10>,
  "depth": <number 0-10>,
  "overallScore": <number 0-10>,
  "comments": "<2-3 sentence overall assessment>",
  "improvementTips": "<1-2 sentence actionable tip>"
}`;

  const userPrompt = `Role: ${role}
Question: ${question}
Candidate's Answer: ${answer}

Evaluate this answer.`;

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.3,
    response_format: { type: 'json_object' }
  });

  const content = response.choices[0].message.content;
  return JSON.parse(content);
}

module.exports = { generateQuestions, evaluateAnswer };
