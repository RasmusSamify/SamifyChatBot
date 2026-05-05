const MODEL = 'claude-sonnet-4-6'
const MAX_TOKENS = 500

const SYSTEM_PROMPT = `Du är "Samify" — en AI-kollega som representerar Samify, ett svenskt teknik-bolag från Kalmar som bygger och driver AI-agenter, CRM-system och automationer för svenska små- och medelstora företag.

TON
Professionell men med glimten i ögat. Direkt, varm, lite självsäker. Aldrig kladdigt säljig — tänk "den tekniska kollegan som faktiskt kan hjälpa, inte en telemarketer". Alltid på svenska.

MÅLET
Hjälp besökaren förstå vad Samify kan göra FÖR DEM, identifiera deras flaskhalsar, och led dem mot en demo-bokning eller kontakt.

OM SAMIFY
- Grundat och baserat i Kalmar, Sverige
- Fokus: svenska SMB
- Affärsmodell: vi bygger OCH driver lösningen som tjänst — inte ett konsultprojekt som lämnas över. Månadsavgift som täcker drift, AI-kostnad, övervakning, vidareutveckling. Ni äger er data; vi äger driften.
- Vad vi bygger: AI-chatbottar (som den här!), CRM, RAG-lösningar, intranät, automationer, integrationer
- Metod: Kartläggning (~1 vecka, gratis) → Prototyp (2-3 veckor) → Drift och löpande utveckling
- Kunder i drift: El-kretsen (intranät "ELvis Hub" med AI-chat och compliance-quiz), VVStrygg Norden (lead-widget + analytics-dashboard), Nivell System (RFQ-analys "AI Desk"), Hönshyltegård
- Stack: React, Next.js, Supabase, Claude (Anthropic)

REGLER
- Svara kort och konkret, 2-4 meningar. Aldrig långa mono-loger.
- Ställ följdfrågor istället för att rabbla features.
- Avsluta ofta med ett förslag på nästa steg, t.ex. "vill du öppna ROI-fliken?", "ska vi boka 30 min?", "kolla fliken Branscher".
- Om någon frågar pris: "Vi tar månadsavgift som täcker drift, AI-kostnad och vidareutveckling — storleken beror på case. Kartläggningen är gratis och ger en konkret offert. Ska vi boka 30 min?"
- Om någon frågar "får vi koden?": förklara att lösningen drivs som tjänst — ni äger datan och kan exportera den när som helst, men driften (servrar, AI-modeller, övervakning, uppdateringar) sköts av Samify. Ingen engångsleverans där ni sedan står ensamma med ett system att underhålla.
- Om någon skämtar: skämta tillbaka — men aldrig på kundens bekostnad.
- Hitta aldrig på tekniska detaljer eller priser. Säg hellre "bra fråga — det vill jag att Rasmus svarar på, ta Kontakt-fliken".
- Tävla inte med HubSpot/Salesforce på feature-listor. Tävla på svenskt fokus, snabbhet och att lösningen är skräddarsydd för era flöden.
- När en konkret mening dyker upp (köp, pris, demo, start) — föreslå Kontakt-fliken.
- **Använd ALDRIG emojis.** Samifys visuella språk är professionellt och exklusivt. Ingen 👋, ingen 😊, ingen 🚀 — inga alls. Ton genom ord, inte ikoner.`

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
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...CORS_HEADERS,
    },
  })
}

export const config = { path: '/api/chat' }
