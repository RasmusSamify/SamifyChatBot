const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type',
  'Access-Control-Max-Age': '86400',
}

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS })
  }
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return jsonResponse({ error: 'invalid_json' }, 400)
  }

  const lead = {
    name: trim(body.name, 120),
    company: trim(body.company, 120),
    email: trim(body.email, 200),
    message: trim(body.message, 4000),
    source: 'samifychatbot.netlify.app',
    userAgent: req.headers.get('user-agent')?.slice(0, 300) || null,
    submittedAt: new Date().toISOString(),
  }

  if (!lead.email || !lead.message) {
    return jsonResponse({ error: 'missing_fields' }, 400)
  }

  const webhook = process.env.LEAD_WEBHOOK_URL
  if (!webhook) {
    console.log('LEAD (no webhook configured):', lead)
    return jsonResponse({ ok: true, demo: true })
  }

  try {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(lead),
    })
    if (!res.ok) {
      console.error('Webhook non-OK:', res.status, await res.text().catch(() => ''))
      return jsonResponse({ error: 'webhook_error' }, 502)
    }
    return jsonResponse({ ok: true })
  } catch (err) {
    console.error('lead function crash:', err)
    return jsonResponse({ error: 'crash' }, 500)
  }
}

function trim(v, max) {
  if (typeof v !== 'string') return ''
  return v.trim().slice(0, max)
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...CORS_HEADERS,
    },
  })
}

export const config = { path: ['/api/contact', '/api/lead'] }
