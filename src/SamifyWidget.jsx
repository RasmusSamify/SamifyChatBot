import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  X, Send, ChevronLeft, ChevronRight, ChevronDown, MessageCircle, Users, HelpCircle,
  Calculator, Briefcase, Radio, Mail, Check, Sparkles, Clock, MapPin,
  FileSearch, UserCheck, Zap, Globe, GitCommit, GitBranch, Star, ExternalLink,
  ArrowUpRight, Plus, Minus, Send as SendIcon, Loader2, AlertCircle,
} from 'lucide-react'

const API_CHAT = '/api/chat'
const API_LEAD = '/api/lead'
const GITHUB_USER = 'RasmusSamify'
const CONTACT_EMAIL = 'info@samify.se'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Montserrat:wght@400;500;600;700;800&display=swap');

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

  #samify-widget-root .font-serif { font-family: 'Instrument Serif', serif; font-weight: 400; }
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
    roi: 'ROI-kalkylator', projects: 'Projekt', live: 'Live',
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

/* ── Home (tile grid) ───────────────────────────────────────────── */
function Home({ setScreen }) {
  const tiles = [
    { key: 'chat',     icon: MessageCircle, label: 'CHATTA',       sub: 'Prata med Claude' },
    { key: 'about',    icon: Users,         label: 'OM SAMIFY',    sub: 'Vilka vi är' },
    { key: 'faq',      icon: HelpCircle,    label: 'FAQ',          sub: 'Vanliga frågor' },
    { key: 'roi',      icon: Calculator,    label: 'ROI',          sub: 'Räkna besparing' },
    { key: 'projects', icon: Briefcase,     label: 'PROJEKT',      sub: 'Vad vi har byggt' },
    { key: 'live',     icon: Radio,         label: 'LIVE',         sub: 'Senaste aktivitet' },
  ]
  return (
    <div className="h-full flex flex-col text-[var(--bone)]">
      <div className="px-5 pt-1 pb-5">
        <div className="relative rounded-2xl p-4 overflow-hidden hairline-strong bg-gradient-to-br from-[var(--purple)]/20 via-[var(--ink-3)] to-[var(--ink-2)]">
          <div className="absolute inset-0 diag-lines pointer-events-none" />
          <div className="relative">
            <div className="text-[10px] font-bold tracking-[0.22em] uppercase text-[var(--gold-soft)] mb-1.5">
              Propplösare för flaskhalsar
            </div>
            <div className="font-serif text-[22px] leading-[1.05] mb-2">
              Bygg bort ert största <span className="italic text-[var(--gold-soft)]">manuella steg</span>.
            </div>
            <div className="text-[12px] text-[var(--bone)]/65 leading-snug">
              Fråga mig vad som är möjligt, räkna på besparing, eller boka 30 min — allt här i widgeten.
            </div>
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

        <div className="mt-3 pb-3 text-[10.5px] text-[var(--bone)]/45 text-center tracking-wide">
          Krypterat · GDPR-kompatibelt · Drivs av <span className="shimmer-text font-semibold">Samify</span>
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
    try {
      const res = await fetch(API_CHAT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      })
      const data = await res.json()
      if (data.reply) {
        setMessages(m => [...m, { role: 'assistant', content: data.reply }])
      } else {
        setErr(data.error || 'unknown')
      }
    } catch {
      setErr('network')
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
            {busy ? <Loader2 size={14} className="animate-spin" /> : <SendIcon size={14} />}
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
    { k: 'START',   v: '2024' },
    { k: 'FOKUS',   v: 'Svenska SMB' },
    { k: 'STACK',   v: 'React · Supabase · Claude' },
  ]
  const values = [
    { t: 'Koden ni äger',    d: 'Ni behåller all kod och all data. Ingen vendor lock-in.' },
    { t: 'Svenska först',    d: 'Byggt på svenska, för svenska företag. GDPR från dag ett.' },
    { t: 'Snabbhet > process',d: 'Kartläggning på en vecka. Prototyp på tre. Drift innan kvartalet är slut.' },
  ]
  return (
    <div className="h-full overflow-y-auto scrollbar-hidden px-5 pb-5 text-[var(--bone)] space-y-5">
      <div className="rounded-2xl p-5 hairline-strong bg-white/[0.03] relative overflow-hidden">
        <div className="absolute inset-0 diag-lines pointer-events-none" />
        <div className="relative">
          <div className="text-[10px] tracking-[0.22em] uppercase font-bold text-[var(--gold-soft)] mb-1">Samify</div>
          <div className="font-serif text-[26px] leading-[1.05] mb-3">
            AI-kollegor <span className="italic text-[var(--gold-soft)]">byggda</span><br />för svenska SMB.
          </div>
          <p className="text-[12.5px] text-[var(--bone)]/70 leading-relaxed">
            Vi är ett litet teknik-bolag från Kalmar. Vi bygger chatbottar, CRM-system, RAG-lösningar och
            automationer — det är AI-kollegor som tar bort företagets mest irriterande manuella steg.
          </p>
        </div>
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
    { q: 'Vad kostar det?', a: 'Det beror helt på omfattning. Kartläggningen är gratis — efter den har vi en rimlig uppskattning på pris och tid för ert specifika case.' },
    { q: 'Är våra data säkra?', a: 'Ja. Vi bygger GDPR-kompatibelt från dag ett, kör svensk/EU-hosting när det går, och all data ligger i er egen miljö. Ingen "vi skickar till US"-hantering.' },
    { q: 'Hur lång bindningstid?', a: 'Ingen. Ni äger koden, datan, och alla integrationer. Vi fortsätter så länge vi tillför värde — inte för att ett kontrakt säger så.' },
    { q: 'Vad händer om AI:n svarar fel?', a: 'Alla AI-kollegor vi bygger har eskaleringsspår till människa, och månadsvisa rapporter på vad de missar. Vi finjusterar löpande — och ni ser datan.' },
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

/* ── Projects screen ────────────────────────────────────────────── */
function ProjectsScreen({ setScreen }) {
  const cases = [
    {
      tag: 'Kund · El-kretsen',
      title: 'ELvis Hub',
      desc: 'Intranät-AI: söker i policies, svarar med källor, kör compliance-quiz för medarbetare.',
      stack: ['RAG', 'Supabase', 'Quiz', 'GDPR'],
      accent: true,
    },
    {
      tag: 'Internt · Samify',
      title: 'Samify CRM',
      desc: 'Eget CRM byggt i React + Supabase. Ersatte ett gammalt single-file HTML-verktyg.',
      stack: ['React', 'Supabase', 'Automation'],
      accent: true,
    },
    {
      tag: 'Nästa',
      title: 'Ert första projekt',
      desc: 'Vi startar med ert mest irriterande manuella flöde. Kartläggning i vecka 1, prototyp i vecka 3.',
      stack: ['1v kartläggning', '3v prototyp'],
      accent: false,
    },
  ]
  return (
    <div className="h-full overflow-y-auto scrollbar-hidden px-5 pb-5 text-[var(--bone)] space-y-3">
      <div className="text-[12px] text-[var(--bone)]/55 pb-2">
        Tre exempel på vad AI-kollegor gör i verkligheten.
      </div>
      {cases.map((c, i) => (
        <motion.article
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * i }}
          className={`relative rounded-2xl p-4 overflow-hidden ${
            c.accent
              ? 'hairline-strong bg-white/[0.04]'
              : 'border border-dashed border-[var(--bone)]/20 bg-transparent'
          }`}
        >
          {c.accent && <div className="absolute inset-0 diag-lines pointer-events-none" />}
          <div className="relative">
            <div className={`inline-block px-2 py-0.5 rounded-full text-[9.5px] font-bold tracking-[0.18em] uppercase mb-3 ${
              c.accent
                ? 'bg-[var(--gold)]/15 text-[var(--gold-soft)]'
                : 'bg-[var(--bone)]/10 text-[var(--bone)]/60'
            }`}>
              {c.tag}
            </div>
            <div className="font-serif text-[22px] leading-tight mb-1.5">{c.title}</div>
            <div className="text-[12.5px] leading-relaxed text-[var(--bone)]/70 mb-3">{c.desc}</div>
            <div className="flex flex-wrap gap-1.5">
              {c.stack.map((s, j) => (
                <span key={j} className="px-2 py-0.5 rounded-full text-[10.5px] font-medium bg-white/[0.05] hairline text-[var(--bone)]/70">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </motion.article>
      ))}
      <button
        onClick={() => setScreen('contact')}
        className="w-full rounded-2xl py-3 px-4 bg-[var(--bone)] text-[var(--ink-2)] font-bold text-[13px] tracking-wide flex items-center justify-center gap-2 hover:bg-[var(--gold-soft)] transition mt-2"
      >
        <Mail size={14} />
        Diskutera ert case
      </button>
    </div>
  )
}

/* ── Live screen (GitHub feed) ──────────────────────────────────── */
function LiveScreen() {
  const [events, setEvents] = useState(null)
  const [err, setErr] = useState(false)
  const [lastFetch, setLastFetch] = useState(null)

  async function load() {
    try {
      const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/events/public?per_page=20`)
      if (!res.ok) throw new Error('gh')
      const data = await res.json()
      setEvents(data)
      setLastFetch(new Date())
      setErr(false)
    } catch {
      setErr(true)
    }
  }

  useEffect(() => {
    load()
    const i = setInterval(load, 60_000)
    return () => clearInterval(i)
  }, [])

  const interesting = useMemo(() => {
    if (!events) return []
    return events
      .filter(e => ['PushEvent', 'CreateEvent', 'PublicEvent', 'PullRequestEvent', 'ReleaseEvent'].includes(e.type))
      .slice(0, 12)
  }, [events])

  return (
    <div className="h-full flex flex-col text-[var(--bone)]">
      <div className="px-5 pt-1 pb-3 flex items-center gap-2">
        <span className="live-dot w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.7)]" />
        <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-[var(--bone)]/60">Live · GitHub-aktivitet</span>
        {lastFetch && (
          <span className="text-[10.5px] text-[var(--bone)]/40 ml-auto">
            uppdaterad {fmtAgo(lastFetch)}
          </span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hidden px-5 pb-5 space-y-2">
        {!events && !err && (
          <div className="flex items-center gap-2 text-[12px] text-[var(--bone)]/55 pt-2">
            <Loader2 size={14} className="animate-spin" /> Hämtar senaste aktivitet…
          </div>
        )}
        {err && (
          <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-[12px] text-rose-200 flex items-start gap-2">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            Kunde inte nå GitHub just nu.
          </div>
        )}
        {interesting.map((e, i) => (
          <GitHubEventRow key={e.id || i} e={e} delay={i * 0.03} />
        ))}
        {events && interesting.length === 0 && !err && (
          <div className="text-[12px] text-[var(--bone)]/55 pt-2">
            Inga publika events att visa just nu.
          </div>
        )}
      </div>
    </div>
  )
}

function GitHubEventRow({ e, delay }) {
  const icon = {
    PushEvent: GitCommit, CreateEvent: GitBranch, PublicEvent: Star,
    PullRequestEvent: GitBranch, ReleaseEvent: Star,
  }[e.type] || GitCommit
  const Icon = icon

  const detail = useMemo(() => {
    if (e.type === 'PushEvent') {
      const n = e.payload?.commits?.length || 0
      const msg = e.payload?.commits?.[0]?.message?.split('\n')[0] || ''
      return `${n} commit${n === 1 ? '' : 's'}${msg ? ` · "${truncate(msg, 60)}"` : ''}`
    }
    if (e.type === 'CreateEvent') {
      return `skapade ${e.payload?.ref_type || 'ref'} ${e.payload?.ref || ''}`.trim()
    }
    if (e.type === 'PullRequestEvent') {
      return `PR ${e.payload?.action}: ${truncate(e.payload?.pull_request?.title || '', 60)}`
    }
    if (e.type === 'ReleaseEvent') {
      return `release ${e.payload?.release?.tag_name || ''}`
    }
    if (e.type === 'PublicEvent') {
      return 'gjorde repo publikt'
    }
    return e.type
  }, [e])

  const repo = e.repo?.name || 'repo'
  const when = fmtAgo(new Date(e.created_at))
  const url = `https://github.com/${repo}`

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="block rounded-xl p-3 hairline bg-white/[0.02] hover:bg-white/[0.04] transition group"
    >
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg grid place-items-center bg-[var(--purple)]/15 text-[var(--purple-soft)] shrink-0">
          <Icon size={13} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-sans text-[12px] font-bold text-[var(--bone)] truncate">{repo.split('/').pop()}</span>
            <span className="text-[10px] text-[var(--bone)]/40 shrink-0">{when}</span>
          </div>
          <div className="text-[11.5px] text-[var(--bone)]/60 leading-snug">{detail}</div>
        </div>
        <ExternalLink size={11} className="text-[var(--bone)]/25 group-hover:text-[var(--purple-soft)] transition shrink-0 mt-0.5" />
      </div>
    </motion.a>
  )
}

/* ── Contact screen ─────────────────────────────────────────────── */
function ContactScreen() {
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [state, setState] = useState('idle') // idle | sending | ok | error

  async function submit(e) {
    e.preventDefault()
    if (!email.trim() || !message.trim() || state === 'sending') return
    setState('sending')
    try {
      const res = await fetch(API_LEAD, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, company, email, message }),
      })
      const data = await res.json()
      setState(data.ok ? 'ok' : 'error')
    } catch {
      setState('error')
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
            Det gick inte att skicka just nu. Testa igen, eller mejla <a href={`mailto:${CONTACT_EMAIL}`} className="underline font-semibold">{CONTACT_EMAIL}</a>.
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
      className="absolute bottom-20 right-0 w-[280px] rounded-2xl bg-[var(--ink-2)]/95 backdrop-blur hairline-strong text-[var(--bone)] p-3.5 pr-10 shadow-[0_20px_60px_-20px_rgba(0,0,0,.7)]"
    >
      <div className="flex items-start gap-2.5">
        <div className="shrink-0 mt-0.5"><Orb size={24} /></div>
        <div>
          <div className="text-[12.5px] font-semibold">Största tidstjuven just nu?</div>
          <div className="text-[11.5px] text-[var(--bone)]/65 mt-0.5">
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
        className="absolute top-2 right-2 w-6 h-6 grid place-items-center rounded-full text-[var(--bone)]/50 hover:text-[var(--bone)] hover:bg-white/5 transition"
      >
        <X size={12} />
      </button>
      <span className="absolute -bottom-1.5 right-8 w-3 h-3 rotate-45 bg-[var(--ink-2)]/95 hairline-strong border-t-0 border-l-0" />
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
    if (open || nudgeDismissed) return
    const t = setTimeout(() => setNudge(true), 3800)
    return () => clearTimeout(t)
  }, [open, nudgeDismissed])

  // Reset to home on close
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setScreen('home'), 300)
      return () => clearTimeout(t)
    }
  }, [open])

  return (
    <>
      <style>{styles}</style>
      <div className="fixed bottom-6 right-6 z-[2147483647] font-sans">
        <AnimatePresence>
          {nudge && !open && (
            <ProactiveNudge
              onOpen={() => { setOpen(true); setNudge(false) }}
              onClose={() => { setNudge(false); setNudgeDismissed(true) }}
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
              <PanelHeader screen={screen} setScreen={setScreen} onClose={() => setOpen(false)} />
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
                    {screen === 'home'     && <Home setScreen={setScreen} />}
                    {screen === 'chat'     && <ChatScreen setScreen={setScreen} />}
                    {screen === 'about'    && <AboutScreen setScreen={setScreen} />}
                    {screen === 'faq'      && <FaqScreen />}
                    {screen === 'roi'      && <RoiScreen setScreen={setScreen} />}
                    {screen === 'projects' && <ProjectsScreen setScreen={setScreen} />}
                    {screen === 'live'     && <LiveScreen />}
                    {screen === 'contact'  && <ContactScreen />}
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

/* ── utils ──────────────────────────────────────────────────────── */
function truncate(s, n) {
  if (!s) return ''
  return s.length > n ? s.slice(0, n - 1) + '…' : s
}

function fmtAgo(date) {
  const diff = Date.now() - date.getTime()
  const s = Math.floor(diff / 1000)
  if (s < 60) return 'nyss'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m} min sen`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h sen`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d}d sen`
  const mo = Math.floor(d / 30)
  return `${mo}mån sen`
}
