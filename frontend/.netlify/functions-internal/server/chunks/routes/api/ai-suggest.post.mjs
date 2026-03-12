import { d as defineEventHandler, r as readBody, c as createError } from '../../nitro/nitro.mjs';
import Anthropic from '@anthropic-ai/sdk';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const aiSuggest_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { title, context } = body;
  if (!title || title.trim().length < 3) {
    throw createError({ statusCode: 400, statusMessage: "Task title is required." });
  }
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw createError({ statusCode: 503, statusMessage: "AI suggestions are not configured." });
  }
  const client = new Anthropic({ apiKey });
  const prompt = context ? `You are a helpful project management assistant. Given the following task title and project context, write a concise, actionable task description in 1-3 sentences. Be specific and practical.

Project context: ${context}
Task title: "${title}"

Description:` : `You are a helpful project management assistant. Given the following task title, write a concise, actionable task description in 1-3 sentences. Be specific and practical.

Task title: "${title}"

Description:`;
  const message = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 200,
    messages: [{ role: "user", content: prompt }]
  });
  const text = message.content[0].type === "text" ? message.content[0].text.trim() : "";
  return { description: text };
});

export { aiSuggest_post as default };
//# sourceMappingURL=ai-suggest.post.mjs.map
