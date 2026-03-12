import Anthropic from '@anthropic-ai/sdk'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { title, context } = body as { title?: string; context?: string }

  if (!title || title.trim().length < 3) {
    throw createError({ statusCode: 400, statusMessage: 'Task title is required.' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw createError({ statusCode: 503, statusMessage: 'AI suggestions are not configured.' })
  }

  const client = new Anthropic({ apiKey })

  const prompt = context
    ? `You are a helpful project management assistant. Given the following task title and project context, write a concise, actionable task description in 1-3 sentences. Be specific and practical.\n\nProject context: ${context}\nTask title: "${title}"\n\nDescription:`
    : `You are a helpful project management assistant. Given the following task title, write a concise, actionable task description in 1-3 sentences. Be specific and practical.\n\nTask title: "${title}"\n\nDescription:`

  const message = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 200,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text.trim() : ''

  return { description: text }
})
