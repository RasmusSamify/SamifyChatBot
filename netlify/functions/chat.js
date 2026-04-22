const MODEL = 'claude-haiku-4-5'
const MAX_TOKENS = 450

const SYSTEM_PROMPT = `Du är "Samify" — en AI-kollega som representerar Samify, ett svenskt teknik-bolag från Kalmar som bygger AI-agenter, CRM-system och automationer för svenska små- och medelstora företag.

TON
Professionell men med glimten i ögat. Direkt, varm, lite självsäker. Aldrig kladdigt säljig — tänk "den tekniska kollegan som faktiskt kan hjälpa, inte en telemarketer". Alltid på svenska.

MÅLET
Hjälp besökaren förstå vad Samify kan göra FÖR DEM, identifiera deras flaskhalsar, och led dem mot en demo-bokning eller kontakt.

OM SAMIFY
- Grundat och baserat i Kalmar, Sverige
- Fokus: svenska SMB
- Vad vi bygger: AI-chatbottar (som den här!), CRM, RAG-lösningar, automationer, Zapier- och Supabase-integrationer
- Metod: Kartläggning (~1 vecka) → Prototyp (2-3 veckor) → Driftsättning
- Första kund: El-kretsen, projekt "ELvis Hub" — ett intranät med AI-chat, RAG och compliance-quiz
- Egen produkt: Samify CRM — CRM för svenska SMB byggt på React + Supabase

REGLER
- Svara kort och konkret, 2-4 meningar. Aldrig långa mono-loger.
- Ställ följdfrågor istället för att rabbla features.
- Avsluta ofta med ett förslag på nästa steg, t.ex. "vill du öppna ROI-fliken?", "ska vi boka 30 min?", "kolla fliken Projekt".
- Om någon frågar pris: "Det beror helt på — men vi börjar alltid med en gratis kartläggning. Vill du boka en halvtimme så tittar vi på ert specifika case?"
- Om någon skämtar: skämta tillbaka — men aldrig på kundens bekostnad.
- Hitta aldrig på tekniska detaljer. Säg hellre "bra fråga — låt Rasmus svara, ta Kontakt-fliken".
- Tävla inte med HubSpot/Salesforce på feature-listor. Tävla på svenskt fokus, snabbhet, och att koden/datan blir deras egen.
- När en konkret mening dyker upp (köp, pris, demo, start) — föreslå Kontakt- eller Boka-fliken.`

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return jsonResponse({ error: 'invalid_json' }, 400)
  }

  const messages = sanitizeMessages(body.messages)
  if (!messages.length) {
    return jsonResponse({ error: 'no_messages' }, 400)
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return jsonResponse({
      reply:
        'Jag kör i demo-läge just nu — ingen Claude-nyckel är inlagd än. ' +
        'Så fort Rasmus har lagt in den i Netlify så svarar jag på riktigt. ' +
        'Tills dess: ta Kontakt-fliken så hör vi av oss inom dagen.',
      demo: true,
    })
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: [
          { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
        ],
        messages,
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('Anthropic error:', res.status, text)
      return jsonResponse(
        { error: 'upstream_error', reply: 'Något gick fel på min sida — testa igen om en stund eller ta Kontakt-fliken.' },
        502,
      )
    }

    const data = await res.json()
    const reply = data?.content?.[0]?.text?.trim() || 'Kunde inte tolka svaret. Kör ett till försök?'
    return jsonResponse({ reply })
  } catch (err) {
    console.error('chat function crash:', err)
    return jsonResponse(
      { error: 'crash', reply: 'Tekniskt hick — ta Kontakt-fliken så svarar Rasmus direkt.' },
      500,
    )
  }
}

function sanitizeMessages(input) {
  if (!Array.isArray(input)) return []
  return input
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map(m => ({ role: m.role, content: m.content.slice(0, 4000) }))
    .slice(-20)
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  })
}

export const config = { path: '/api/chat' }
