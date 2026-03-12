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

  const prompt = context
    ? `You are a helpful project management assistant. Given the following task title and project context, write a concise, actionable task description in 1-3 sentences. Be specific and practical.\n\nProject context: ${context}\nTask title: "${title}"\n\nDescription:`
    : `You are a helpful project management assistant. Given the following task title, write a concise, actionable task description in 1-3 sentences. Be specific and practical.\n\nTask title: "${title}"\n\nDescription:`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw createError({ statusCode: 502, statusMessage: `Claude API error: ${err}` })
  }

  const data = await response.json() as {
    content: Array<{ type: string; text: string }>
  }

  const text = data.content?.[0]?.type === 'text' ? data.content[0].text.trim() : ''

  return { description: text }
})
