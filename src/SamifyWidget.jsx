import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  X, Send, ChevronLeft, ChevronRight, ChevronDown, MessageCircle, Users, HelpCircle,
  Calculator, Briefcase, Lightbulb, Mail, Check, FileSearch, TrendingUp, BookOpen,
  Zap, Bot, ArrowUpRight, Loader2, AlertCircle,
} from 'lucide-react'

const API_ORIGIN = 'https://samifychatbot.netlify.app'
const API_CHAT   = `${API_ORIGIN}/api/chat`
const SUPABASE_URL = 'https://axypazcbgcogtdqqimvi.supabase.co'
const API_PULSE  = `${SUPABASE_URL}/functions/v1/widget-pulse`
const API_INTAKE = `${SUPABASE_URL}/functions/v1/widget-intake`
const CONTACT_EMAIL = 'info@samify.se'

const LOGO_BASE = `${API_ORIGIN}/logos`
const CLIENT_LOGOS = [
  { name: 'El-kretsen',     file: 'elkretsen.svg',     alt: 'El-kretsen' },
  { name: 'VVStrygg',       file: 'vvstrygg.png',      alt: 'VVStrygg Norden' },
  { name: 'Nivell System',  file: 'nivell.gif',        alt: 'Nivell System' },
  { name: 'Hönshyltegård',  file: 'honshyltegard.png', alt: 'Hönshyltegård' },
]

/* ── Telemetri ──────────────────────────────────────────────────── */
const SESSION_STORAGE_KEY = 'samify_widget_session'
const eventBuffer = []
let flushTimer = null
let sessionStarted = false

function getSessionKey() {
  try {
    let key = sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (!key) {
      key = (crypto?.randomUUID?.() || `s_${Date.now()}_${Math.random().toString(36).slice(2)}`)
      sessionStorage.setItem(SESSION_STORAGE_KEY, key)
    }
    return key
  } catch {
    return `s_${Date.now()}_${Math.random().toString(36).slice(2)}`
  }
}

function getUTM(search) {
  const p = new URLSearchParams(search || window.location.search)
  return {
    utm_source:   p.get('utm_source')   || null,
    utm_medium:   p.get('utm_medium')   || null,
    utm_campaign: p.get('utm_campaign') || null,
  }
}

async function sendPulse(payload) {
  try {
    await fetch(API_PULSE, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      keepalive: true,
      body: JSON.stringify(payload),
    })
  } catch {
    /* fire-and-forget */
  }
}

function ensureSession() {
  if (sessionStarted) return
  sessionStarted = true
  const session_key = getSessionKey()
  sendPulse({
    session_key,
    session: {
      page_url: window.location.href.slice(0, 500),
      page_host: window.location.hostname.slice(0, 200),
      referrer: document.referrer?.slice(0, 500) || null,
      ...getUTM(),
    },
  })
}

function flush() {
  flushTimer = null
  if (!eventBuffer.length) return
  const batch = eventBuffer.splice(0, eventBuffer.length)
  sendPulse({ session_key: getSessionKey(), events: batch })
}

function track(type, screen, payload) {
  ensureSession()
  eventBuffer.push({
    type,
    screen: screen || null,
    payload: payload || null,
    occurred_at: new Date().toISOString(),
  })
  if (eventBuffer.length >= 8) {
    flush()
  } else if (!flushTimer) {
    flushTimer = setTimeout(flush, 1500)
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', flush)
  window.addEventListener('beforeunload', flush)
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500;1,600&display=swap');

  #samify-widget-root {
    --ink:        #1C1A17;
    --ink-2:      #0E0C0A;
    --ink-3:      #221F1B;
    --bone:       #F6F2EE;
    --bone-2:     #EFE9E2;
    --gold:       #B5844A;
    --gold-soft:  #D4B07A;
    --purple:     #7c3aed;
    --purple-soft:#a78bfa;
    --green:      #34d399;
  }

  #samify-widget-root .font-sans  { font-family: 'Montserrat', system-ui, sans-serif; }

  @keyframes samifyOrbRotate { to { transform: rotate(360deg); } }
  @keyframes samifyOrbRotateSlow { to { transform: rotate(-360deg); } }
  @keyframes samifyPulseSoft { 0%,100% { opacity: .55; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }
  @keyframes samifyBreathe {
    0%,100% { box-shadow: 0 20px 60px -20px rgba(124,58,237,.35), 0 0 0 0 rgba(124,58,237,.5); }
    50%     { box-shadow: 0 30px 80px -20px rgba(124,58,237,.55), 0 0 0 14px rgba(124,58,237,0); }
  }
  @keyframes samifyTypingDot {
    0%,60%,100% { transform: translateY(0); opacity: .4; }
    30%         { transform: translateY(-4px); opacity: 1; }
  }
  @keyframes samifyShimmerText {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }
  @keyframes samifyLivePulse {
    0%,100% { opacity: 1; }
    50%     { opacity: .3; }
  }

  #samify-widget-root .orb-layer-1 {
    background: conic-gradient(from 0deg, #7c3aed 0%, #a78bfa 20%, #B5844A 45%, #1C1A17 60%, #7c3aed 80%, #a78bfa 100%);
    filter: blur(6px);
    animation: samifyOrbRotate 9s linear infinite;
  }
  #samify-widget-root .orb-layer-2 {
    background: conic-gradient(from 180deg, #B5844A 0%, #7c3aed 30%, #D4B07A 55%, #a78bfa 75%, #B5844A 100%);
    animation: samifyOrbRotateSlow 14s linear infinite;
    filter: blur(2px);
  }
  #samify-widget-root .orb-core {
    background:
      radial-gradient(circle at 35% 30%, rgba(255,255,255,.18) 0%, rgba(255,255,255,0) 40%),
      linear-gradient(135deg, #1C1A17 0%, #0E0C0A 100%);
  }

  #samify-widget-root .mesh-bg {
    background:
      radial-gradient(1200px 600px at 10% 10%,  rgba(124,58,237,.18), transparent 55%),
      radial-gradient(900px  500px at 90% 20%, rgba(181,132,74,.14),  transparent 60%),
      radial-gradient(700px  500px at 50% 110%,rgba(124,58,237,.12),  transparent 55%),
      #0E0C0A;
  }

  #samify-widget-root .diag-lines {
    background-image: repeating-linear-gradient(135deg, rgba(246,242,238,.025) 0 1px, transparent 1px 14px);
  }

  #samify-widget-root .hairline       { border: 1px solid rgba(246,242,238,.08); }
  #samify-widget-root .hairline-strong{ border: 1px solid rgba(246,242,238,.14); }

  #samify-widget-root .breathe { animation: samifyBreathe 3.2s ease-in-out infinite; }

  #samify-widget-root .scrollbar-hidden::-webkit-scrollbar { display: none; }
  #samify-widget-root .scrollbar-hidden { -ms-overflow-style: none; scrollbar-width: none; }

  #samify-widget-root .input-ring:focus-within {
    border-color: rgba(167,139,250,.55);
    box-shadow: 0 0 0 4px rgba(124,58,237,.15);
  }

  #samify-widget-root .shimmer-text {
    background: linear-gradient(90deg, rgba(246,242,238,.3) 0%, rgba(246,242,238,1) 45%, rgba(181,132,74,1) 55%, rgba(246,242,238,.3) 100%);
    background-size: 200% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: samifyShimmerText 2.4s linear infinite;
  }

  #samify-widget-root .live-dot {
    animation: samifyLivePulse 1.4s ease-in-out infinite;
  }

  #samify-widget-root input[type="range"] {
    -webkit-appearance: none; appearance: none;
    width: 100%; height: 4px;
    background: rgba(246,242,238,.12);
    border-radius: 999px;
    outline: none;
  }
  #samify-widget-root input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px; height: 18px;
    background: var(--bone);
    border-radius: 50%;
    cursor: pointer;
    border: 3px solid var(--purple);
    transition: transform .15s;
  }
  #samify-widget-root input[type="range"]::-webkit-slider-thumb:hover { transform: scale(1.15); }
  #samify-widget-root input[type="range"]::-moz-range-thumb {
    width: 18px; height: 18px;
    background: var(--bone); border: 3px solid var(--purple);
    border-radius: 50%; cursor: pointer;
  }
`

/* ── Orb ────────────────────────────────────────────────────────── */
function Orb({ size = 44, state = 'idle' }) {
  const speed = state === 'thinking' ? '3.5s' : state === 'speaking' ? '5s' : '9s'
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div className="absolute -inset-2 rounded-full opacity-60 orb-layer-1" style={{ animationDuration: speed }} />
      <div className="absolute inset-0 rounded-full orb-layer-2" style={{ animationDuration: state === 'thinking' ? '6s' : '14s' }} />
      <div className="absolute inset-[14%] rounded-full orb-core" />
      {state === 'thinking' && (
        <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 0 2px rgba(167,139,250,.35), 0 0 20px 2px rgba(124,58,237,.4)' }} />
      )}
    </div>
  )
}

/* ── Header (shared across screens) ─────────────────────────────── */
function PanelHeader({ screen, setScreen, onClose }) {
  const isHome = screen === 'home'
  const titles = {
    home: null,
    chat: 'Chatta', about: 'Om Samify', faq: 'Vanliga frågor',
    roi: 'ROI-kalkylator', areas: 'Branscher', tips: 'Dagens tips',
    contact: 'Kontakt',
  }
  return (
    <div className="relative z-10 px-5 pt-4 pb-3 flex items-center gap-3 hairline-strong border-t-0 border-l-0 border-r-0">
      {isHome ? (
        <>
          <Orb size={36} />
          <div className="flex-1">
            <div className="flex items-baseline gap-1.5">
              <span className="font-sans text-[14px] font-bold tracking-tight text-[var(--bone)]">Samify</span>
              <span className="text-[var(--purple-soft)] text-[14px] leading-none">·</span>
              <span className="font-serif italic text-[14.5px] text-[var(--gold-soft)] leading-none translate-y-[1px]">AI-kollega</span>
            </div>
            <LiveClock />
          </div>
        </>
      ) : (
        <>
          <button
            onClick={() => setScreen('home')}
            className="w-8 h-8 grid place-items-center rounded-full hairline bg-white/[0.02] hover:bg-white/[0.08] transition text-[var(--bone)]"
            aria-label="Tillbaka"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-[0.22em] font-bold text-[var(--bone)]/45">Samify</div>
            <div className="font-serif text-[19px] leading-none text-[var(--bone)] mt-0.5">{titles[screen]}</div>
          </div>
        </>
      )}
      <button
        onClick={onClose}
        className="w-8 h-8 grid place-items-center rounded-full hairline bg-white/[0.02] hover:bg-white/[0.08] transition text-[var(--bone)]"
        aria-label="Stäng"
      >
        <X size={14} />
      </button>
    </div>
  )
}

function LiveClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(i)
  }, [])
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  return (
    <div className="flex items-center gap-1.5 mt-0.5 text-[10.5px] text-[var(--bone)]/55">
      <span className="live-dot w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.7)]" />
      Online · kl {hh}:{mm} · Kalmar
    </div>
  )
}

/* ── Kund-loggor: en strip med små bone-pills, originalfärger ──── */
function ClientLogosStrip({ size = 'sm' }) {
  const h = size === 'lg' ? 'h-11' : 'h-8'
  const maxLogo = size === 'lg' ? 'max-h-7' : 'max-h-5'
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {CLIENT_LOGOS.map(l => (
        <div
          key={l.name}
          title={l.alt}
          className={`rounded-md bg-[var(--bone)] flex items-center justify-center px-2 ${h} transition hover:bg-white`}
        >
          <img
            src={`${LOGO_BASE}/${l.file}`}
            alt={l.alt}
            loading="lazy"
            className={`${maxLogo} max-w-full object-contain`}
          />
        </div>
      ))}
    </div>
  )
}

/* ── Home (tile grid) ───────────────────────────────────────────── */
function Home({ setScreen }) {
  const tiles = [
    { key: 'chat',  icon: MessageCircle, label: 'CHATTA',      sub: 'Prata med Claude' },
    { key: 'about', icon: Users,         label: 'OM SAMIFY',   sub: 'Vilka vi är' },
    { key: 'faq',   icon: HelpCircle,    label: 'FAQ',         sub: 'Vanliga frågor' },
    { key: 'roi',   icon: Calculator,    label: 'ROI',         sub: 'Räkna besparing' },
    { key: 'areas', icon: Briefcase,     label: 'BRANSCHER',   sub: 'Där vi jobbar' },
    { key: 'tips',  icon: Lightbulb,     label: 'DAGENS TIPS', sub: 'Ny insikt varje dag' },
  ]
  return (
    <div className="h-full flex flex-col text-[var(--bone)]">
      <div className="px-5 pt-1 pb-3">
        <div className="relative rounded-2xl p-4 overflow-hidden hairline-strong bg-gradient-to-br from-[var(--purple)]/20 via-[var(--ink-3)] to-[var(--ink-2)]">
          <div className="absolute inset-0 diag-lines pointer-events-none" />
          <div className="relative">
            <div className="text-[10px] font-bold tracking-[0.22em] uppercase text-[var(--gold-soft)] mb-1.5">
              Propplösare för flaskhalsar
            </div>
            <div className="font-serif text-[22px] leading-[1.05] mb-2">
              Bygg bort ert största <span className="italic text-[var(--gold-soft)]">manuella steg</span>.
            </div>
            <div className="text-[12px] text-[var(--bone)]/65 leading-snug mb-3.5">
              Fråga mig vad som är möjligt, räkna på besparing, eller boka 30 min — allt här i widgeten.
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[9px] tracking-[0.22em] uppercase font-bold text-[var(--bone)]/45">I drift hos</span>
              <span className="h-px flex-1 bg-[var(--bone)]/10" />
            </div>
            <ClientLogosStrip />
          </div>
        </div>
      </div>

      <div className="px-5 flex-1 overflow-y-auto scrollbar-hidden">
        <div className="grid grid-cols-2 gap-2">
          {tiles.map((t, i) => (
            <motion.button
              key={t.key}
              onClick={() => setScreen(t.key)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.04 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="group relative rounded-2xl p-4 text-left hairline bg-white/[0.03] hover:bg-white/[0.06] hover:border-[var(--purple-soft)]/40 transition overflow-hidden"
            >
              <div className="w-9 h-9 rounded-xl grid place-items-center bg-[var(--purple)]/15 text-[var(--purple-soft)] mb-3 group-hover:bg-[var(--purple)]/25 transition">
                <t.icon size={18} />
              </div>
              <div className="font-sans text-[13px] font-bold tracking-wide leading-none mb-1">{t.label}</div>
              <div className="text-[10.5px] text-[var(--bone)]/50 uppercase tracking-wider">{t.sub}</div>
              <ArrowUpRight size={14} className="absolute top-3 right-3 text-[var(--bone)]/20 group-hover:text-[var(--purple-soft)] transition" />
            </motion.button>
          ))}
        </div>

        <div className="mt-3 pb-2 text-[10px] text-[var(--bone)]/40 text-center tracking-[0.18em] uppercase">
          Krypterat · GDPR · Drivs av <span className="shimmer-text font-semibold">Samify</span>
        </div>
      </div>

      <motion.button
        onClick={() => setScreen('contact')}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="mx-3 mb-3 rounded-2xl py-3.5 px-4 bg-[var(--bone)] text-[var(--ink-2)] font-bold text-[13px] tracking-wide flex items-center justify-center gap-2 hover:bg-[var(--gold-soft)] transition"
      >
        <Mail size={14} />
        KONTAKTA OSS · 30 min gratis
        <ChevronRight size={14} />
      </motion.button>
    </div>
  )
}

/* ── Chat screen (Claude API) ───────────────────────────────────── */
function ChatScreen({ setScreen }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hej! Jag är Samify — er AI-kollega. Berätta vad ert teams största tidstjuv är just nu, så hjälper jag dig se vad som går att automatisera. (Eller fråga mig vad som helst.)' },
  ])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, busy])

  const suggestions = [
    'Vad kan ni göra åt mejl-inkorgen?',
    'Hur lång tid tar en prototyp?',
    'Vad kostar det?',
  ]

  async function send(text) {
    const content = (text ?? input).trim()
    if (!content || busy) return
    setInput('')
    setErr(null)
    const next = [...messages, { role: 'user', content }]
    setMessages(next)
    setBusy(true)
    track('chat_message', 'chat', { role: 'user', content: content.slice(0, 500) })
    try {
      const res = await fetch(API_CHAT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      })
      const data = await res.json()
      if (data.reply) {
        setMessages(m => [...m, { role: 'assistant', content: data.reply }])
        track('chat_message', 'chat', { role: 'assistant', content: data.reply.slice(0, 500) })
      } else {
        setErr(data.error || 'unknown')
        track('chat_error', 'chat', { reason: data.error || 'unknown' })
      }
    } catch (e) {
      setErr('network')
      track('chat_error', 'chat', { reason: 'network', message: e?.message?.slice(0, 200) })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="h-full flex flex-col text-[var(--bone)]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hidden px-4 py-4 space-y-3.5">
        {messages.map((m, i) => (
          <ChatBubble key={i} m={m} />
        ))}
        {busy && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2.5">
            <Orb size={22} state="thinking" />
            <div className="rounded-2xl rounded-tl-md bg-white/[0.04] hairline px-3 py-2">
              <div className="flex items-center gap-1 px-1">
                {[0, 1, 2].map(i => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--purple-soft)]"
                        style={{ animation: `samifyTypingDot 1.1s ${i * 0.14}s ease-in-out infinite` }} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        {err && (
          <div className="flex items-start gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-[12px] text-rose-200">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <div>
              Kunde inte nå Claude just nu. Testa igen eller ta <button className="underline font-semibold" onClick={() => setScreen('contact')}>Kontakt-fliken</button>.
            </div>
          </div>
        )}
      </div>

      {messages.length <= 1 && !busy && (
        <div className="px-4 pb-3 flex flex-wrap gap-1.5">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => send(s)}
              className="px-3 py-1.5 rounded-full text-[11.5px] font-medium bg-white/[0.04] hairline hover:bg-white/[0.08] hover:border-[var(--purple-soft)]/35 transition text-[var(--bone)]"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="p-3 pt-2">
        <div className="input-ring transition flex items-end gap-2 rounded-2xl bg-white/[0.03] hairline px-3 py-2.5">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Fråga vad som helst…"
            className="flex-1 min-h-[28px] bg-transparent outline-none text-[13.5px] placeholder:text-[var(--bone)]/35 text-[var(--bone)]"
            disabled={busy}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || busy}
            className="shrink-0 w-9 h-9 grid place-items-center rounded-xl bg-gradient-to-br from-[var(--purple)] to-[#5b21b6] text-white shadow-[0_8px_24px_-8px_rgba(124,58,237,.7)] disabled:opacity-30 disabled:shadow-none hover:brightness-110 transition"
            aria-label="Skicka"
          >
            {busy ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          </button>
        </div>
      </div>
    </div>
  )
}

function ChatBubble({ m }) {
  const isBot = m.role === 'assistant'
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.35 }}
      className={`flex gap-2.5 ${isBot ? '' : 'flex-row-reverse'}`}
    >
      {isBot && <div className="shrink-0 mt-0.5"><Orb size={22} /></div>}
      <div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed ${
        isBot
          ? 'bg-white/[0.04] hairline text-[var(--bone)] rounded-tl-md'
          : 'bg-gradient-to-br from-[var(--purple)] to-[#5b21b6] text-white rounded-tr-md shadow-[0_10px_30px_-10px_rgba(124,58,237,.5)]'
      }`}>
        {m.content.split('\n').map((line, i) => <div key={i}>{line || ' '}</div>)}
      </div>
    </motion.div>
  )
}

/* ── About screen ───────────────────────────────────────────────── */
function AboutScreen({ setScreen }) {
  const facts = [
    { k: 'BAS',     v: 'Kalmar, Sverige' },
    { k: 'MODELL',  v: 'Bygger + driver' },
    { k: 'FOKUS',   v: 'Svenska SMB' },
    { k: 'STACK',   v: 'React · Supabase · Claude' },
  ]
  const values = [
    { t: 'Skräddarsytt — inte hyllvara',  d: 'Varje lösning byggs runt just era flöden. Ingen generisk SaaS att tvinga in företaget i.' },
    { t: 'Drift som tjänst',              d: 'Vi bygger OCH driver. Månadsavgift täcker servrar, AI-kostnad, övervakning och vidareutveckling. Ni äger datan, vi sköter resten.' },
    { t: 'Svenska först',                 d: 'Byggt på svenska, för svenska företag. GDPR från dag ett, EU-hosting när det går.' },
    { t: 'Snabbhet > process',            d: 'Kartläggning på en vecka. Prototyp på tre. I drift innan kvartalet är slut.' },
  ]
  return (
    <div className="h-full overflow-y-auto scrollbar-hidden px-5 pb-5 text-[var(--bone)] space-y-5">
      <div className="rounded-2xl p-5 hairline-strong bg-white/[0.03] relative overflow-hidden">
        <div className="absolute inset-0 diag-lines pointer-events-none" />
        <div className="relative">
          <div className="text-[10px] tracking-[0.22em] uppercase font-bold text-[var(--gold-soft)] mb-1">Samify</div>
          <div className="font-serif text-[26px] leading-[1.05] mb-3">
            AI-kollegor <span className="italic text-[var(--gold-soft)]">byggda och drivna</span><br />för svenska SMB.
          </div>
          <p className="text-[12.5px] text-[var(--bone)]/70 leading-relaxed">
            Vi är ett litet teknik-bolag från Kalmar. Vi bygger chatbottar, CRM-system, RAG-lösningar och
            automationer — och driver dem åt er. Inget överlämnat projekt; en kollega som finns kvar.
          </p>
        </div>
      </div>

      <div className="rounded-2xl p-4 hairline bg-white/[0.02]">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="h-px w-6 bg-[var(--bone)]/15" />
          <span className="text-[10px] tracking-[0.22em] uppercase font-bold text-[var(--bone)]/55">I drift hos</span>
          <span className="h-px w-6 bg-[var(--bone)]/15" />
        </div>
        <ClientLogosStrip size="lg" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {facts.map(f => (
          <div key={f.k} className="rounded-xl p-3 hairline bg-white/[0.02]">
            <div className="text-[9.5px] tracking-[0.22em] uppercase font-bold text-[var(--bone)]/50 mb-1">{f.k}</div>
            <div className="font-serif text-[16.5px] leading-tight text-[var(--bone)]">{f.v}</div>
          </div>
        ))}
      </div>

      <div>
        <div className="text-[10px] tracking-[0.22em] uppercase font-bold text-[var(--purple-soft)] mb-3">Vad vi står för</div>
        <div className="space-y-2">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="rounded-xl p-3.5 hairline bg-white/[0.02]"
            >
              <div className="font-sans font-bold text-[13px] mb-1 text-[var(--bone)]">{v.t}</div>
              <div className="text-[12px] text-[var(--bone)]/65 leading-snug">{v.d}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-[10px] tracking-[0.22em] uppercase font-bold text-[var(--purple-soft)] mb-3">Metoden</div>
        <div className="space-y-1.5">
          {[
            { n: '01', t: 'Kartläggning', s: '1 vecka · workshop + flaskhalsar' },
            { n: '02', t: 'Prototyp',     s: '2-3 veckor · körbar MVP ni testar' },
            { n: '03', t: 'Driftsättning',s: '1-2 veckor · prod + SLA + löpande' },
          ].map(s => (
            <div key={s.n} className="flex items-center gap-3 rounded-xl p-3 hairline bg-white/[0.02]">
              <div className="font-serif text-[20px] text-[var(--gold-soft)] italic leading-none w-8">{s.n}</div>
              <div className="flex-1">
                <div className="font-sans text-[13px] font-bold text-[var(--bone)] leading-none">{s.t}</div>
                <div className="text-[11px] text-[var(--bone)]/55 mt-1">{s.s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setScreen('contact')}
        className="w-full rounded-2xl py-3 px-4 bg-[var(--bone)] text-[var(--ink-2)] font-bold text-[13px] tracking-wide flex items-center justify-center gap-2 hover:bg-[var(--gold-soft)] transition"
      >
        <Mail size={14} />
        Kom igång · Boka 30 min
      </button>
    </div>
  )
}

/* ── FAQ screen ─────────────────────────────────────────────────── */
function FaqScreen() {
  const qa = [
    { q: 'Hur snabbt kan ni leverera?', a: 'Kartläggning på 1 vecka, en körbar prototyp på 2-3 veckor, och driftsatt lösning innan kvartalet är slut. Vi siktar på värde från första sprinten — inte på 40-sidors förstudier.' },
    { q: 'Vad kostar det?', a: 'Vi tar månadsavgift som täcker drift, AI-kostnad, övervakning och vidareutveckling — storleken beror på case. Kartläggningen är gratis och ger en konkret offert efter en vecka.' },
    { q: 'Får vi källkoden?', a: 'Lösningen drivs som tjänst — ni äger datan och kan exportera när som helst, men driften (servrar, AI-modeller, övervakning, uppdateringar) sköts av oss. Ni slipper alltså få hem ett system att underhålla själva.' },
    { q: 'Är våra data säkra?', a: 'Ja. GDPR-kompatibelt från dag ett, EU-hosting när det går, krypterat in transit och at rest. Datan är er — ni kan begära export eller radering när som helst.' },
    { q: 'Hur lång bindningstid?', a: 'Tre månader initialt så vi hinner driftsätta ordentligt, sedan rullande månadsvis. Ingen 24-månaderscell. Slutar vi tillföra värde — då slutar ni betala.' },
    { q: 'Vad händer om AI:n svarar fel?', a: 'Alla AI-kollegor vi bygger har eskaleringsspår till människa, och månadsvisa rapporter på vad de missar. Vi finjusterar löpande — det är en del av månadsavgiften, inget sidoprojekt.' },
    { q: 'Jobbar ni på plats eller remote?', a: 'Både och. Kartläggningsworkshopen kör vi gärna på plats hos er. Utveckling är remote, med demos varje vecka.' },
    { q: 'Vilka system kan ni koppla ihop?', a: 'Det mesta: Fortnox, HubSpot, Zapier, Google Workspace, Teams, Slack, Supabase, egna REST-APIs, webhooks. Om det har ett API — då kan vi koppla.' },
  ]
  const [open, setOpen] = useState(0)
  return (
    <div className="h-full overflow-y-auto scrollbar-hidden px-5 pb-5 text-[var(--bone)] space-y-2">
      <div className="text-[12px] text-[var(--bone)]/55 pb-2">
        Om svaret inte finns här — ta <span className="font-semibold text-[var(--purple-soft)]">Chatta</span>-fliken så svarar Claude direkt.
      </div>
      {qa.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={i} className="rounded-xl hairline bg-white/[0.02] overflow-hidden">
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-white/[0.04] transition"
            >
              <span className="text-[13px] font-semibold text-[var(--bone)]">{item.q}</span>
              <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={16} className="text-[var(--bone)]/50 shrink-0" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-3.5 text-[12.5px] leading-relaxed text-[var(--bone)]/75">
                    {item.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

/* ── ROI calculator ─────────────────────────────────────────────── */
function RoiScreen({ setScreen }) {
  const [emails, setEmails] = useState(40)
  const [minPer, setMinPer] = useState(4)
  const [salary, setSalary] = useState(42000)
  const automationRate = 0.65
  const workDays = 22

  const monthlyMinutes = emails * minPer * automationRate * workDays
  const monthlyHours = monthlyMinutes / 60
  const hourlyCost = salary / 160
  const monthlySavings = Math.round(monthlyHours * hourlyCost)
  const yearly = monthlySavings * 12

  useEffect(() => {
    const t = setTimeout(() => {
      track('roi_change', 'roi', { emails, minPer, salary, monthlySavings })
    }, 700)
    return () => clearTimeout(t)
  }, [emails, minPer, salary, monthlySavings])

  return (
    <div className="h-full overflow-y-auto scrollbar-hidden px-5 pb-5 text-[var(--bone)]">
      <div className="text-[12px] text-[var(--bone)]/55 pb-4">
        En grov uppskattning på vad ni kan spara om AI hanterar ca 65% av er repetitiva mejl-volym.
      </div>

      <div className="space-y-4 mb-5">
        <Slider label="Mejl / dag"          value={emails} set={setEmails} min={5}     max={200}   step={5}    suffix="st" />
        <Slider label="Minuter per mejl"    value={minPer} set={setMinPer} min={1}     max={15}    step={1}    suffix="min" />
        <Slider label="Snittlön per månad"  value={salary} set={setSalary} min={28000} max={80000} step={1000} suffix="kr" format={v => v.toLocaleString('sv-SE')} />
      </div>

      <div className="rounded-2xl p-5 hairline-strong bg-gradient-to-br from-[var(--purple)]/15 via-[var(--ink-3)] to-[var(--ink-2)] relative overflow-hidden">
        <div className="absolute inset-0 diag-lines pointer-events-none" />
        <div className="relative">
          <div className="text-[10px] tracking-[0.22em] uppercase font-bold text-[var(--gold-soft)] mb-1.5">Uppskattad besparing</div>
          <div className="flex items-baseline gap-2 mb-1">
            <motion.div
              key={monthlySavings}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-[44px] leading-none text-[var(--bone)]"
            >
              {monthlySavings.toLocaleString('sv-SE')}
            </motion.div>
            <div className="font-sans text-[14px] font-bold text-[var(--bone)]/55">kr / mån</div>
          </div>
          <div className="text-[11.5px] text-[var(--bone)]/55">
            ≈ {Math.round(monthlyHours)} timmar/mån · {yearly.toLocaleString('sv-SE')} kr/år
          </div>
        </div>
      </div>

      <button
        onClick={() => setScreen('contact')}
        className="mt-5 w-full rounded-2xl py-3 px-4 bg-[var(--bone)] text-[var(--ink-2)] font-bold text-[13px] tracking-wide flex items-center justify-center gap-2 hover:bg-[var(--gold-soft)] transition"
      >
        <Mail size={14} />
        Räkna på ert faktiska case
      </button>

      <div className="text-[10.5px] text-[var(--bone)]/40 mt-3 leading-relaxed text-center">
        Baserat på {workDays} arbetsdagar och en automationsgrad på {Math.round(automationRate * 100)}%. Siffrorna är en fingervisning — verkliga projekt varierar.
      </div>
    </div>
  )
}

function Slider({ label, value, set, min, max, step, suffix, format }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-[var(--bone)]/60">{label}</div>
        <div className="font-sans text-[15px] font-bold text-[var(--bone)]">
          {format ? format(value) : value} <span className="text-[11px] font-medium text-[var(--bone)]/55">{suffix}</span>
        </div>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => set(Number(e.target.value))} />
    </div>
  )
}

/* ── Areas screen (branscher + kompetenser) ─────────────────────── */
const AREAS = [
  {
    icon: MessageCircle,
    title: 'Kundservice & support',
    desc: 'AI-triage, chatbottar med handoff, RAG-FAQ. För e-handel, tjänsteföretag, SaaS och alla med en supportinbox som svämmar över.',
    tags: ['Triage', 'Chatbot', 'Handoff'],
  },
  {
    icon: TrendingUp,
    title: 'Sälj & CRM',
    desc: 'Lead-scoring, säljarassistenter, CRM-automation. För SMB med säljorganisation som vill lägga tid på kunder, inte på admin.',
    tags: ['CRM', 'Lead-scoring', 'Supabase'],
  },
  {
    icon: BookOpen,
    title: 'Intern AI & intranät',
    desc: 'Policy-sök, compliance-RAG, HR-bottar, utbildnings-quiz. För återvinning, produktion, teknikhandel, och HR-tunga verksamheter.',
    tags: ['RAG', 'Compliance', 'Quiz'],
  },
  {
    icon: Zap,
    title: 'Automationer & integrationer',
    desc: 'Zapier, Fortnox, HubSpot, Google Workspace, egna API:er. För alla med fler än två system som ska prata med varandra.',
    tags: ['Zapier', 'API', 'Webhooks'],
  },
  {
    icon: FileSearch,
    title: 'Kunskap & RAG',
    desc: 'Vektor-sök, källhänvisning, GDPR-säkert. För regelverk, handböcker, offerter och compliance-tunga branscher där svaren måste kunna granskas.',
    tags: ['pgvector', 'GDPR', 'Källor'],
  },
  {
    icon: Bot,
    title: 'AI-agenter',
    desc: 'Röst, verktygsanvändning, human-in-the-loop. Nästa generations assistenter som inte bara svarar — de bokar, triggar, eskalerar.',
    tags: ['Agent', 'Voice', 'Tools'],
  },
]

function AreasScreen({ setScreen }) {
  return (
    <div className="h-full overflow-y-auto scrollbar-hidden px-5 pb-5 text-[var(--bone)] space-y-2.5">
      <div className="text-[12px] text-[var(--bone)]/60 pb-2 leading-snug">
        Områden där vi byggt — eller håller på att bygga — AI-kollegor. Känner ni igen er bransch eller er flaskhals? Då är det bara att boka.
      </div>
      {AREAS.map((a, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 * i }}
          className="rounded-xl p-3.5 hairline bg-white/[0.02]"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg grid place-items-center bg-[var(--purple)]/15 text-[var(--purple-soft)] shrink-0">
              <a.icon size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-sans text-[13.5px] font-bold text-[var(--bone)] mb-1 leading-tight">{a.title}</div>
              <div className="text-[12px] text-[var(--bone)]/65 leading-snug mb-2">{a.desc}</div>
              <div className="flex flex-wrap gap-1">
                {a.tags.map((t, j) => (
                  <span key={j} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/[0.04] hairline text-[var(--bone)]/60">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
      <button
        onClick={() => setScreen('contact')}
        className="w-full rounded-2xl py-3 px-4 bg-[var(--bone)] text-[var(--ink-2)] font-bold text-[13px] tracking-wide flex items-center justify-center gap-2 hover:bg-[var(--gold-soft)] transition mt-3"
      >
        <Mail size={14} />
        Känner ni igen er? Kontakta oss
      </button>
    </div>
  )
}

/* ── Tips screen (dagens roterande insikt) ──────────────────────── */
const TIPS = [
  { kat: 'Automation',    title: 'AI-triage sparar 4-6h/vecka per supportperson.',                 body: 'AI sorterar, taggar, skickar vidare. Människan svarar bara på det som faktiskt kräver hjärna. Resten försvinner aldrig — det blir bara bättre sorterat.' },
  { kat: 'Leverans',      title: 'Börja med ETT flöde. Inte alla.',                                body: 'De som försöker AI-ifiera hela verksamheten samtidigt hinner aldrig i mål. Välj er värsta flaskhals, bygg där, skala efter.' },
  { kat: 'RAG',           title: 'Alltid källhänvisningar — aldrig svar från ingenstans.',         body: 'En RAG som citerar kan granskas. En som bara "svarar" hallucinerar obemärkt. Källor är inte en detalj — det är skillnaden mellan användbart och farligt.' },
  { kat: 'Produkt',       title: 'Kontext > modell-kvalitet.',                                     body: 'Den billigaste modellen med rätt kontext slår den dyraste utan. Lägg 80% av tiden på data, prompts och tool-design — inte på att byta modell.' },
  { kat: 'Agent',         title: 'Human-in-the-loop som default.',                                 body: 'Agenter ska aldrig skicka mejl, fakturor eller binda företag utan mänsklig approval. Inte än. Kanske aldrig, för vissa beslut.' },
  { kat: 'Säkerhet',      title: 'Hosta i EU. Kryptera on-rest. GDPR från dag ett.',               body: 'Svenska SMB har inte råd att krånglas in i transatlantisk data-debatt. Bygg så det aldrig är en fråga — EU-hosting, tydliga DPA:er, minimal datalagring.' },
  { kat: 'Metod',         title: 'Inga 40-sidors förstudier.',                                     body: 'Ingen kund ändrar beslut av en 40-sidors rapport. De ändrar beslut av en körbar prototyp. Kartläggning → prototyp → drift, 5 veckor, inte 5 månader.' },
  { kat: 'ROI',           title: 'Ett AI-svar kostar under 1 öre. Ett manuellt 5-500 kr.',         body: 'Räkna kostnad per interaktion, inte licens-total. Ett Claude-svar: ~0,3 öre. En människa som skriver samma: flera minuter och lönesekunder.' },
  { kat: 'Svenska',       title: 'Nyanser spelar roll.',                                           body: 'En AI tränad på engelska men körd på svensk input missar dialekter, formalitet och bransch-jargong. Testa på riktiga svenska dokument innan ni skarp-köper.' },
  { kat: 'Chatbot',       title: 'Chatbot ≠ AI-agent.',                                            body: 'En chatbot svarar. En agent agerar. Båda har sin plats — men blanda inte ihop när ni specar. Fel val kostar tre veckors arbete.' },
  { kat: 'Data',          title: 'Data-hygien före AI.',                                           body: 'Har ni 3 CRM, 2 kalkylblad och en SharePoint där gammal data bor? Städa först. Annars hallucinerar AI:n på er röra istället för att hjälpa.' },
  { kat: 'Cache',         title: 'Prompt caching = snabbare + billigare.',                         body: 'Anthropics prompt caching sänker kostnaden med upp till 90% för återkommande system-prompts. Slå på från dag ett — gratis vinst, direkt.' },
  { kat: 'Säljprocess',   title: 'Säljande chat ≠ kladdig telemarketing.',                         body: 'Den bästa säljbotten frågar mer än den pitchar. Hjälp besökaren förstå sitt problem. Erbjudandet kommer när det är dags — inte i första meningen.' },
  { kat: 'Integration',   title: 'Zapier + Claude = MVP på en dag.',                               body: 'Ni behöver inte kod för allt. En Zapier-webhook till Claude API är ofta nog för första versionen — validera idén där, kodifiera sen.' },
  { kat: 'Utvärdering',   title: 'Mät innan. Mät efter. Mät igen.',                                body: 'Utan före-siffror har ni inget att jämföra AI-förbättringen med. Dokumentera nuläge (tid, felfrekvens, NPS) innan ni driftsätter.' },
  { kat: 'Test',          title: 'Testa med riktiga kunder så tidigt som möjligt.',                body: 'Interna testare är vänliga. Riktiga kunder är ärliga. Kör intern prototyp vecka 1, extern betatest vecka 2.' },
  { kat: 'Ägarskap',      title: 'Datan är er. Alltid.',                                            body: 'Lösningen drivs som tjänst, men datan är er — exporterbar när som helst, krypterad i EU. Ni slipper underhålla en kodbas; vi slipper bygga "lösningen som ändå inte används om sex månader".' },
  { kat: 'Transparens',   title: 'Visa när AI:n svarar. Inte efteråt.',                            body: 'Användare som vet att de pratar med AI är tacksamma. De som tror de pratar med en människa blir förbannade när de inser. Bygg det öppet.' },
  { kat: 'Fel',           title: 'Planera för felaktiga svar — det KOMMER hända.',                 body: 'Error-budget, eskaleringsvägar, månadsvisa rapporter på missar. Perfektion finns inte. Förbättringshastighet gör det.' },
  { kat: 'Support',       title: '80% av supportfrågorna är repetitiva.',                          body: 'Låt AI ta dem. Frigör människan till de 20% som faktiskt bygger kundrelation. 80/20 gäller även här.' },
  { kat: 'Skala',         title: 'En AI-kollega skalar utan pausregler.',                          body: 'Klockan 03:00 en söndag svarar AI:n lika snabbt som måndag 10:00. Ingen semester, ingen sjukskrivning. Det är skalningsfördelen ni köper.' },
  { kat: 'SMB',           title: 'Små företag har störst vinst per AI-krona.',                     body: 'En stor bank sparar 0,01% av sin budget. Ett 15-mans tjänsteföretag sparar 10% av sin tid. Procenten finns där ni är små. Agera nu.' },
  { kat: 'Onboarding',    title: 'Onboarda AI-kollegan som en människa.',                          body: 'En ny medarbetare lär sig verksamheten på 3 veckor. Ge AI:n samma: dokument, kontext, bakgrundshistoria. Inte bara en snabb prompt.' },
  { kat: 'Output',        title: 'Begränsa output-format — annars blir det bara prat.',            body: 'Säg åt AI:n: "svara i JSON med dessa fält", "max 3 meningar", "inga bullets". Fria svar → pratbubblor. Strukturerade svar → data ni kan använda.' },
  { kat: 'Vector',        title: 'pgvector räcker längre än ni tror.',                             body: 'Ni behöver troligen inte Pinecone, inte Weaviate. Postgres + pgvector hanterar miljoner dokument utan problem — och ni har redan en Postgres.' },
  { kat: 'Prompt',        title: 'System-prompten är där magin sitter.',                           body: 'Bra prompts är långa och specifika — "du är X, tonen är Y, aldrig Z". Spendera tid här, inte på runtime-formuleringar.' },
  { kat: 'Volym',         title: 'Mät interaktioner, inte användare.',                             body: 'En chatbot som 100 användare pratar med 5 gånger vardera har mer värde än en som 1000 trycker på en gång. Engagemang slår registreringar.' },
  { kat: 'Start',         title: 'Börja med det mest irriterande.',                                body: 'Den där uppgiften alla klagar på varje måndag? Som ingen vill göra? Det är där AI-kollegan ska börja sitt liv. Direkt värde, direkt buy-in.' },
  { kat: 'Stack',         title: 'React + Supabase + Anthropic räcker långt.',                     body: 'Vår default-stack för AI-kollegor. 95% av fallen täcks. Enkel stack, snabb leverans, inga exotiska beroenden ni måste förklara för revisorn.' },
  { kat: 'Fokus',         title: 'Sluta bygga features. Börja lösa problem.',                      body: 'En AI-tjänst som säger "vi har 47 integrationer" vinner inget. En som säger "vi löste problemet på 3 veckor" vinner kontraktet.' },
]

function dayOfYearIndex() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const day = Math.floor((now - start) / 86400000)
  return day
}

function TipsScreen() {
  const [offset, setOffset] = useState(0)
  const base = dayOfYearIndex()
  const idx = (((base + offset) % TIPS.length) + TIPS.length) % TIPS.length
  const tip = TIPS[idx]
  const isToday = offset === 0

  useEffect(() => {
    track('tip_view', 'tips', { idx, kat: tip.kat })
  }, [idx])

  const label = isToday
    ? 'Dagens tips'
    : offset < 0
      ? `${Math.abs(offset)} dag${Math.abs(offset) === 1 ? '' : 'ar'} tidigare`
      : `${offset} dag${offset === 1 ? '' : 'ar'} framåt`

  return (
    <div className="h-full flex flex-col text-[var(--bone)]">
      <div className="px-5 pt-1 pb-3 flex items-center gap-2">
        <Lightbulb size={13} className="text-[var(--gold-soft)]" />
        <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-[var(--bone)]/60">{label}</span>
        <span className="text-[10.5px] text-[var(--bone)]/40 ml-auto">{idx + 1} / {TIPS.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hidden px-5 pb-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="relative rounded-2xl p-5 hairline-strong bg-gradient-to-br from-[var(--purple)]/15 via-[var(--ink-3)] to-[var(--ink-2)] overflow-hidden"
          >
            <div className="absolute inset-0 diag-lines pointer-events-none" />
            <div className="relative">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--gold)]/15 mb-4">
                <span className="w-1 h-1 rounded-full bg-[var(--gold-soft)]" />
                <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[var(--gold-soft)]">{tip.kat}</span>
              </div>
              <div className="font-sans text-[19px] font-extrabold leading-[1.2] tracking-tight mb-3 text-[var(--bone)]">
                {tip.title}
              </div>
              <div className="text-[13px] text-[var(--bone)]/72 leading-relaxed">
                {tip.body}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="text-[10.5px] text-[var(--bone)]/40 mt-3 text-center tracking-wide">
          — Samify-insikter
        </div>
      </div>

      <div className="p-3 pt-2 flex items-center gap-2">
        <button
          onClick={() => setOffset(o => o - 1)}
          className="flex-1 rounded-xl py-2.5 hairline bg-white/[0.03] hover:bg-white/[0.06] text-[12px] font-bold tracking-wide flex items-center justify-center gap-1.5 text-[var(--bone)]/75 hover:text-[var(--bone)] transition"
        >
          <ChevronLeft size={14} /> Föregående
        </button>
        {!isToday && (
          <button
            onClick={() => setOffset(0)}
            className="rounded-xl py-2.5 px-3 hairline bg-white/[0.03] hover:bg-white/[0.06] text-[11px] font-semibold text-[var(--bone)]/75 hover:text-[var(--bone)] transition"
          >
            Idag
          </button>
        )}
        <button
          onClick={() => setOffset(o => o + 1)}
          className="flex-1 rounded-xl py-2.5 hairline bg-white/[0.03] hover:bg-white/[0.06] text-[12px] font-bold tracking-wide flex items-center justify-center gap-1.5 text-[var(--bone)]/75 hover:text-[var(--bone)] transition"
        >
          Nästa <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

/* ── Contact screen ─────────────────────────────────────────────── */
function ContactScreen() {
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [state, setState] = useState('idle') // idle | sending | ok | error
  const [errDetail, setErrDetail] = useState('')

  async function submit(e) {
    e.preventDefault()
    if (!email.trim() || !message.trim() || state === 'sending') return
    setState('sending')
    setErrDetail('')
    track('contact_attempt', 'contact', { hasName: !!name, hasCompany: !!company })
    try {
      const res = await fetch(API_INTAKE, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          session_key: getSessionKey(),
          page_url: window.location.href,
          name, company, email, message,
        }),
      })
      let data = null
      try { data = await res.json() } catch {}
      if (res.ok && data?.ok) {
        setState('ok')
        track('contact_success', 'contact')
        flush()
      } else {
        const reason = data?.error || `HTTP ${res.status}`
        console.error('[Samify] kontakt-POST misslyckades:', API_INTAKE, res.status, data)
        setErrDetail(reason)
        setState('error')
        track('contact_error', 'contact', { reason })
      }
    } catch (err) {
      console.error('[Samify] kontakt-POST nätverksfel:', API_INTAKE, err)
      setErrDetail(err?.message || 'network')
      setState('error')
      track('contact_error', 'contact', { reason: 'network', message: err?.message?.slice(0, 200) })
    }
  }

  if (state === 'ok') {
    return (
      <div className="h-full flex flex-col items-center justify-center px-6 text-center text-[var(--bone)]">
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 16 }}
          className="w-16 h-16 rounded-full bg-emerald-400/20 grid place-items-center mb-5 ring-4 ring-emerald-400/10"
        >
          <Check size={30} className="text-emerald-400" strokeWidth={3} />
        </motion.div>
        <div className="font-serif text-[28px] leading-tight mb-2">Tack!</div>
        <div className="text-[13px] text-[var(--bone)]/65 max-w-[260px] leading-relaxed">
          Vi hör av oss inom 24 timmar — oftast snabbare. Tills dess: ta en runda i widgeten.
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="h-full flex flex-col text-[var(--bone)]">
      <div className="flex-1 overflow-y-auto scrollbar-hidden px-5 pt-1 pb-4 space-y-3">
        <div className="text-[12px] text-[var(--bone)]/60 pb-1">
          Skriv ett par rader om vad ni vill lösa. Vi hör av oss inom 24h och bokar en halvtimme gratis.
        </div>
        <Field label="Namn"      value={name}    set={setName}    placeholder="Anna Andersson" />
        <Field label="Företag"   value={company} set={setCompany} placeholder="Företaget AB" />
        <Field label="E-post"    value={email}   set={setEmail}   placeholder="anna@foretaget.se" type="email" required />
        <FieldArea label="Vad vill ni lösa?" value={message} set={setMessage} placeholder="Vår mejl-inkorg är full. Kundservice är överbelastad. Vi har policies som ingen hittar i…" required />

        {state === 'error' && (
          <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-[12px] text-rose-200 flex items-start gap-2">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <div>
              Det gick inte att skicka just nu. Testa igen, eller mejla <a href={`mailto:${CONTACT_EMAIL}`} className="underline font-semibold text-[var(--purple-soft)] hover:text-[var(--bone)] transition">{CONTACT_EMAIL}</a>.
              {errDetail && (
                <div className="mt-1.5 text-[10.5px] text-rose-300/70 font-mono tracking-tight">
                  fel: {errDetail}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="p-3 pt-2 flex items-center gap-2">
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="shrink-0 text-[11.5px] text-[var(--bone)]/50 hover:text-[var(--bone)] underline-offset-4 hover:underline px-2"
        >
          eller mejla direkt
        </a>
        <button
          type="submit"
          disabled={!email.trim() || !message.trim() || state === 'sending'}
          className="ml-auto flex items-center gap-2 rounded-xl py-2.5 px-4 bg-gradient-to-br from-[var(--purple)] to-[#5b21b6] text-white font-bold text-[12.5px] tracking-wide disabled:opacity-40 hover:brightness-110 transition"
        >
          {state === 'sending' ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          {state === 'sending' ? 'Skickar…' : 'Skicka'}
        </button>
      </div>
    </form>
  )
}

function Field({ label, value, set, placeholder, type = 'text', required }) {
  return (
    <label className="block">
      <div className="text-[10.5px] font-bold tracking-[0.18em] uppercase text-[var(--bone)]/55 mb-1.5">{label}</div>
      <input
        type={type}
        required={required}
        value={value}
        onChange={e => set(e.target.value)}
        placeholder={placeholder}
        className="input-ring w-full rounded-xl bg-white/[0.03] hairline px-3 py-2.5 text-[13px] text-[var(--bone)] placeholder:text-[var(--bone)]/30 outline-none transition"
      />
    </label>
  )
}
function FieldArea({ label, value, set, placeholder, required }) {
  return (
    <label className="block">
      <div className="text-[10.5px] font-bold tracking-[0.18em] uppercase text-[var(--bone)]/55 mb-1.5">{label}</div>
      <textarea
        required={required}
        value={value}
        onChange={e => set(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="input-ring w-full rounded-xl bg-white/[0.03] hairline px-3 py-2.5 text-[13px] text-[var(--bone)] placeholder:text-[var(--bone)]/30 outline-none resize-none transition"
      />
    </label>
  )
}

/* ── Launcher + Nudge ───────────────────────────────────────────── */
function Launcher({ open, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className={`relative flex items-center gap-2.5 pl-2 pr-4 py-2 rounded-full bg-[var(--ink-2)] text-[var(--bone)] ${open ? '' : 'breathe'} border border-white/10`}
      style={{ minHeight: 48 }}
    >
      <Orb size={34} />
      <span className="font-sans font-bold text-[13.5px] tracking-tight relative">
        Samify
        <span className="inline-block w-1 h-1 rounded-full bg-[var(--purple)] ml-[2px] translate-y-[-3px]"
              style={{ animation: 'samifyPulseSoft 2.2s ease-in-out infinite' }} />
      </span>
    </motion.button>
  )
}

function ProactiveNudge({ onOpen, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="absolute bottom-20 right-0 w-[280px] rounded-2xl hairline-strong p-3.5 pr-10 shadow-[0_20px_60px_-20px_rgba(0,0,0,.7)]"
      style={{ background: '#0E0C0A', color: '#F6F2EE' }}
    >
      <div className="flex items-start gap-2.5">
        <div className="shrink-0 mt-0.5"><Orb size={24} /></div>
        <div>
          <div className="text-[12.5px] font-semibold text-[var(--bone)]">Största tidstjuven just nu?</div>
          <div className="text-[11.5px] text-[var(--bone)]/80 mt-0.5">
            Räkna besparing, chatta med Claude, eller boka 30 min. Allt här.
          </div>
          <button
            onClick={onOpen}
            className="mt-2.5 inline-flex items-center gap-1 text-[11.5px] font-semibold text-[var(--purple-soft)] hover:text-white transition"
          >
            Öppna widgeten <ChevronRight size={12} />
          </button>
        </div>
      </div>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 w-6 h-6 grid place-items-center rounded-full text-[var(--bone)]/60 hover:text-[var(--bone)] hover:bg-white/5 transition"
      >
        <X size={12} />
      </button>
      <span className="absolute -bottom-1.5 right-8 w-3 h-3 rotate-45 hairline-strong border-t-0 border-l-0" style={{ background: '#0E0C0A' }} />
    </motion.div>
  )
}

/* ── Main Widget ────────────────────────────────────────────────── */
export default function SamifyWidget() {
  const [open, setOpen] = useState(false)
  const [screen, setScreen] = useState('home')
  const [nudge, setNudge] = useState(false)
  const [nudgeDismissed, setNudgeDismissed] = useState(false)

  useEffect(() => {
    ensureSession()
  }, [])

  useEffect(() => {
    if (open || nudgeDismissed) return
    const t = setTimeout(() => {
      setNudge(true)
      track('nudge_shown')
    }, 3800)
    return () => clearTimeout(t)
  }, [open, nudgeDismissed])

  // Reset to home on close
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setScreen('home'), 300)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    if (open) track('open', screen)
  }, [open])

  useEffect(() => {
    if (open) track('screen_view', screen)
  }, [open, screen])

  return (
    <>
      <style>{styles}</style>
      <div className="fixed bottom-6 right-6 z-[2147483647] font-sans">
        <AnimatePresence>
          {nudge && !open && (
            <ProactiveNudge
              onOpen={() => { setOpen(true); setNudge(false) }}
              onClose={() => { setNudge(false); setNudgeDismissed(true); track('nudge_dismissed') }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.92, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 20, scale: 0.94, filter: 'blur(4px)' }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              className="absolute bottom-20 right-0 w-[400px] h-[680px] max-sm:fixed max-sm:inset-0 max-sm:w-screen max-sm:h-[100dvh] max-sm:rounded-none rounded-[28px] overflow-hidden mesh-bg text-[var(--bone)] shadow-[0_40px_100px_-20px_rgba(0,0,0,.65)] hairline-strong flex flex-col"
              style={{ transformOrigin: 'bottom right' }}
            >
              <PanelHeader screen={screen} setScreen={setScreen} onClose={() => { track('close', screen); setOpen(false) }} />
              <div className="flex-1 min-h-0 relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={screen}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.22 }}
                    className="absolute inset-0"
                  >
                    {screen === 'home'    && <Home setScreen={setScreen} />}
                    {screen === 'chat'    && <ChatScreen setScreen={setScreen} />}
                    {screen === 'about'   && <AboutScreen setScreen={setScreen} />}
                    {screen === 'faq'     && <FaqScreen />}
                    {screen === 'roi'     && <RoiScreen setScreen={setScreen} />}
                    {screen === 'areas'   && <AreasScreen setScreen={setScreen} />}
                    {screen === 'tips'    && <TipsScreen />}
                    {screen === 'contact' && <ContactScreen />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative flex justify-end">
          <Launcher open={open} onClick={() => { setOpen(o => !o); setNudge(false) }} />
        </div>
      </div>
    </>
  )
}

