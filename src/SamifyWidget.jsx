import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence, useSpring } from 'motion/react'
import {
  Send, Mic, Calendar, Phone, X, Sparkles, ArrowUpRight, Globe, Zap,
  Check, MessageCircle, FileSearch, UserCheck, ChevronRight,
  Clock, MapPin, Command, Paperclip,
} from 'lucide-react'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Montserrat:wght@400;500;600;700&display=swap');

  #samify-widget-root {
    --ink: #1C1A17;
    --ink-2: #0E0C0A;
    --surface: #191714;
    --surface-2: #221F1B;
    --bone: #F6F2EE;
    --bone-2: #EFE9E2;
    --gold: #B5844A;
    --gold-soft: #D4B07A;
    --purple: #7c3aed;
    --purple-soft: #a78bfa;
    --purple-glow: rgba(124, 58, 237, 0.55);
  }

  #samify-widget-root .font-serif { font-family: 'Instrument Serif', serif; font-weight: 400; }
  #samify-widget-root .font-sans  { font-family: 'Montserrat', system-ui, sans-serif; }

  @keyframes samifyOrbRotate { to { transform: rotate(360deg); } }
  @keyframes samifyOrbRotateSlow { to { transform: rotate(-360deg); } }
  @keyframes samifyPulseSoft { 0%,100% { opacity: .55; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }
  @keyframes samifyWaveBar {
    0%, 100% { transform: scaleY(0.35); }
    50%      { transform: scaleY(1); }
  }
  @keyframes samifyGrain {
    0%, 100% { transform: translate(0,0); }
    10% { transform: translate(-2%, -3%); }
    20% { transform: translate(-8%, 2%); }
    30% { transform: translate(5%, -5%); }
    40% { transform: translate(-1%, 3%); }
    50% { transform: translate(-7%, 1%); }
    60% { transform: translate(5%, -3%); }
    70% { transform: translate(3%, 1%); }
    80% { transform: translate(-8%, 2%); }
    90% { transform: translate(4%, -2%); }
  }
  @keyframes samifyShimmerText {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }
  @keyframes samifyBreatheShadow {
    0%, 100% { box-shadow: 0 20px 60px -20px rgba(124,58,237,.35), 0 0 0 0 rgba(124,58,237,.5); }
    50%      { box-shadow: 0 30px 80px -20px rgba(124,58,237,.55), 0 0 0 14px rgba(124,58,237,0); }
  }
  @keyframes samifyTypingDot {
    0%, 60%, 100% { transform: translateY(0); opacity: .4; }
    30% { transform: translateY(-4px); opacity: 1; }
  }

  #samify-widget-root .orb-layer-1 {
    background: conic-gradient(from 0deg,
      #7c3aed 0%, #a78bfa 20%, #B5844A 45%, #1C1A17 60%,
      #7c3aed 80%, #a78bfa 100%);
    filter: blur(6px);
    animation: samifyOrbRotate 9s linear infinite;
  }
  #samify-widget-root .orb-layer-2 {
    background: conic-gradient(from 180deg,
      #B5844A 0%, #7c3aed 30%, #D4B07A 55%, #a78bfa 75%, #B5844A 100%);
    animation: samifyOrbRotateSlow 14s linear infinite;
    filter: blur(2px);
  }
  #samify-widget-root .orb-core {
    background: radial-gradient(circle at 35% 30%,
      rgba(255,255,255,.18) 0%, rgba(255,255,255,0) 40%),
      linear-gradient(135deg, #1C1A17 0%, #0E0C0A 100%);
  }

  #samify-widget-root .noise-overlay {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E");
    background-size: 180px;
    opacity: .5;
    mix-blend-mode: overlay;
  }

  #samify-widget-root .shimmer-text {
    background: linear-gradient(90deg,
      rgba(246,242,238,.3) 0%,
      rgba(246,242,238,1) 45%,
      rgba(181,132,74,1) 55%,
      rgba(246,242,238,.3) 100%);
    background-size: 200% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: samifyShimmerText 2.4s linear infinite;
  }

  #samify-widget-root .breathe-shadow { animation: samifyBreatheShadow 3.2s ease-in-out infinite; }

  #samify-widget-root .mesh-bg {
    background:
      radial-gradient(1200px 600px at 10% 10%, rgba(124,58,237,.18), transparent 55%),
      radial-gradient(900px 500px at 90% 20%, rgba(181,132,74,.14), transparent 60%),
      radial-gradient(700px 500px at 50% 110%, rgba(124,58,237,.12), transparent 55%),
      #0E0C0A;
  }

  #samify-widget-root .hairline { border: 1px solid rgba(246,242,238,.08); }
  #samify-widget-root .hairline-strong { border: 1px solid rgba(246,242,238,.14); }

  #samify-widget-root .chip-magnetic { transition: transform .35s cubic-bezier(.2,.9,.2,1), background .2s, border-color .2s; }

  #samify-widget-root .scrollbar-hidden::-webkit-scrollbar { display: none; }
  #samify-widget-root .scrollbar-hidden { -ms-overflow-style: none; scrollbar-width: none; }

  #samify-widget-root .input-ring:focus-within {
    border-color: rgba(167,139,250,.55);
    box-shadow: 0 0 0 4px rgba(124,58,237,.15);
  }

  #samify-widget-root .rich-card {
    background: linear-gradient(180deg, rgba(246,242,238,.04), rgba(246,242,238,.02));
    border: 1px solid rgba(246,242,238,.08);
    backdrop-filter: blur(6px);
  }

  #samify-widget-root .fold-open {
    transform-origin: bottom right;
  }
`

function Orb({ size = 56, state = 'idle' }) {
  const speed = state === 'thinking' ? '3.5s' : state === 'speaking' ? '5s' : '9s'
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div className="absolute -inset-2 rounded-full opacity-60 orb-layer-1"
           style={{ animationDuration: speed }} />
      <div className="absolute inset-0 rounded-full orb-layer-2"
           style={{ animationDuration: state === 'thinking' ? '6s' : '14s' }} />
      <div className="absolute inset-[14%] rounded-full orb-core" />
      {state === 'thinking' && (
        <div className="absolute inset-0 rounded-full"
             style={{ boxShadow: '0 0 0 2px rgba(167,139,250,.35), 0 0 20px 2px rgba(124,58,237,.4)' }} />
      )}
    </div>
  )
}

function Waveform({ active = false, bars = 22 }) {
  const heights = useMemo(
    () => Array.from({ length: bars }, (_, i) => 0.3 + Math.sin(i * 0.7) * 0.4 + Math.random() * 0.3),
    [bars]
  )
  return (
    <div className="flex items-center gap-[3px] h-6">
      {heights.map((h, i) => (
        <span
          key={i}
          className="w-[2px] rounded-full"
          style={{
            height: `${Math.max(6, h * 22)}px`,
            background: active
              ? `linear-gradient(180deg, var(--purple-soft), var(--gold))`
              : 'rgba(246,242,238,.22)',
            transformOrigin: 'center',
            animation: active ? `samifyWaveBar ${0.6 + (i % 5) * 0.1}s ease-in-out infinite` : 'none',
            animationDelay: `${(i * 40) % 500}ms`,
          }}
        />
      ))}
    </div>
  )
}

function MagneticChip({ children, icon: Icon, onClick }) {
  const ref = useRef(null)
  const x = useSpring(0, { stiffness: 300, damping: 20 })
  const y = useSpring(0, { stiffness: 300, damping: 20 })
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * 0.25)
    y.set((e.clientY - r.top - r.height / 2) * 0.25)
  }
  const onLeave = () => { x.set(0); y.set(0) }
  return (
    <motion.button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{ x, y }}
      className="chip-magnetic group relative overflow-hidden flex items-center gap-2 px-3.5 py-2
                 rounded-full text-[12px] font-medium text-[var(--bone)]
                 bg-white/[0.04] hairline hover:bg-white/[0.08] hover:border-[rgba(167,139,250,.35)]"
    >
      {Icon && <Icon size={13} className="opacity-70 group-hover:opacity-100 group-hover:text-[var(--purple-soft)] transition" />}
      <span>{children}</span>
      <ArrowUpRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition" />
    </motion.button>
  )
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1">
      {[0, 1, 2].map(i => (
        <span key={i}
          className="w-1.5 h-1.5 rounded-full bg-[var(--purple-soft)]"
          style={{ animation: `samifyTypingDot 1.1s ${i * 0.14}s ease-in-out infinite` }} />
      ))}
    </div>
  )
}

function ToolCallRow({ icon: Icon, label, done }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
      className="flex items-center gap-2.5 text-[11.5px] text-[var(--bone)]/70"
    >
      <span className={`w-5 h-5 rounded-md flex items-center justify-center ${done ? 'bg-[var(--purple)]/20 text-[var(--purple-soft)]' : 'bg-white/5 text-[var(--bone)]/50'}`}>
        {done ? <Check size={11} /> : <Icon size={11} />}
      </span>
      <span className={done ? 'line-through opacity-60' : 'shimmer-text font-medium'}>
        {label}
      </span>
    </motion.div>
  )
}

function CalendarInline({ onPick }) {
  const slots = [
    { d: 'Tis 23/4', t: '10:30' },
    { d: 'Tis 23/4', t: '14:00' },
    { d: 'Ons 24/4', t: '09:00' },
    { d: 'Ons 24/4', t: '13:30' },
    { d: 'Tor 25/4', t: '11:00' },
    { d: 'Fre 26/4', t: '15:30' },
  ]
  return (
    <div className="rich-card rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-[var(--gold-soft)]" />
          <span className="text-[12px] font-semibold tracking-wide text-[var(--bone)]">DEMO · 30 min · Google Meet</span>
        </div>
        <span className="text-[10.5px] text-[var(--bone)]/50">Europa/Stockholm</span>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {slots.map((s, i) => (
          <motion.button
            key={i}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onPick?.(s)}
            className="group rounded-xl px-2 py-2 text-left hairline bg-white/[0.02]
                       hover:bg-[var(--purple)]/15 hover:border-[var(--purple-soft)]/40 transition"
          >
            <div className="text-[10px] uppercase tracking-wider text-[var(--bone)]/55 group-hover:text-[var(--purple-soft)]">{s.d}</div>
            <div className="text-[13px] font-semibold text-[var(--bone)]">{s.t}</div>
          </motion.button>
        ))}
      </div>
      <div className="flex items-center gap-3 pt-1 text-[10.5px] text-[var(--bone)]/55">
        <span className="flex items-center gap-1"><Clock size={10} /> Bekräftas direkt</span>
        <span className="flex items-center gap-1"><MapPin size={10} /> Länk mejlas</span>
      </div>
    </div>
  )
}

function CapabilityStrip() {
  const caps = [
    { icon: FileSearch, label: 'Söker i era dokument' },
    { icon: Calendar,  label: 'Bokar möten' },
    { icon: UserCheck, label: 'Kopplar till människa' },
    { icon: Globe,     label: 'Svarar på 34 språk' },
    { icon: Zap,       label: 'Triggar automationer' },
  ]
  return (
    <div className="overflow-hidden">
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hidden px-4 pb-1 pt-0.5">
        {caps.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-medium
                       bg-white/[0.03] hairline text-[var(--bone)]/70"
          >
            <c.icon size={11} className="text-[var(--gold-soft)]" />
            {c.label}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function Message({ m }) {
  const isBot = m.role === 'bot'
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.45, ease: [0.2, 0.9, 0.2, 1] }}
      className={`flex gap-2.5 ${isBot ? '' : 'flex-row-reverse'}`}
    >
      {isBot && (
        <div className="shrink-0 mt-0.5">
          <Orb size={26} state="idle" />
        </div>
      )}
      <div className={`max-w-[82%] ${isBot ? '' : 'items-end'}`}>
        {m.tools && (
          <div className="space-y-1.5 mb-2 pl-1">
            {m.tools.map((t, i) => (
              <ToolCallRow key={i} icon={t.icon} label={t.label} done={t.done} />
            ))}
          </div>
        )}
        {m.text && (
          <div
            className={`rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed ${
              isBot
                ? 'bg-white/[0.04] hairline text-[var(--bone)] rounded-tl-md'
                : 'bg-gradient-to-br from-[var(--purple)] to-[#5b21b6] text-white rounded-tr-md shadow-[0_10px_30px_-10px_rgba(124,58,237,.5)]'
            }`}
          >
            {m.text}
          </div>
        )}
        {m.rich === 'calendar' && (
          <div className="mt-2"><CalendarInline /></div>
        )}
        {m.rich === 'handoff' && (
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="mt-2 rich-card rounded-2xl p-3.5 flex items-center gap-3"
          >
            <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-[var(--gold)] to-[#7a5a2f] grid place-items-center text-[12px] font-bold text-[var(--ink-2)]">
              AR
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[var(--ink-2)]" />
            </div>
            <div className="flex-1">
              <div className="text-[12.5px] font-semibold text-[var(--bone)]">Adnan Redzepagic</div>
              <div className="text-[11px] text-[var(--bone)]/55">Online · svarar typiskt &lt; 2 min</div>
            </div>
            <button className="text-[11.5px] font-semibold px-3 py-1.5 rounded-full bg-[var(--purple)]/20 hover:bg-[var(--purple)]/35 text-[var(--purple-soft)] transition">
              Koppla
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

function ModeSwitcher({ mode, setMode }) {
  const modes = [
    { id: 'chat', label: 'Chatta', icon: MessageCircle },
    { id: 'book', label: 'Boka',   icon: Calendar },
    { id: 'call', label: 'Ring',   icon: Phone },
  ]
  return (
    <div className="relative flex p-1 rounded-full bg-white/[0.03] hairline">
      {modes.map(m => (
        <button
          key={m.id}
          onClick={() => setMode(m.id)}
          className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11.5px] font-semibold transition
            ${mode === m.id ? 'text-[var(--ink-2)]' : 'text-[var(--bone)]/60 hover:text-[var(--bone)]'}`}
        >
          {mode === m.id && (
            <motion.span
              layoutId="mode-pill"
              transition={{ type: 'spring', stiffness: 500, damping: 34 }}
              className="absolute inset-0 rounded-full bg-[var(--bone)] -z-10"
            />
          )}
          <m.icon size={12} />
          {m.label}
        </button>
      ))}
    </div>
  )
}

const DEMO_CONVERSATION = [
  {
    role: 'bot',
    text: 'Hej! Jag är Samify — er AI-kollega. Jag kan söka i era dokument, boka möten, koppla till rätt människa, eller trigga flöden i ert CRM. Vad vill du utforska?',
  },
]

function SamifyChat({ onClose }) {
  const [messages, setMessages] = useState(DEMO_CONVERSATION)
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [mode, setMode] = useState('chat')
  const scrollRef = useRef(null)
  const typing = input.length > 0

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, thinking])

  const runDemo = (prompt, scenario) => {
    setMessages(prev => [...prev, { role: 'user', text: prompt }])
    setThinking(true)

    if (scenario === 'docs') {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'bot',
          tools: [
            { icon: FileSearch, label: 'Söker i Samify-dokumentation…', done: true },
            { icon: FileSearch, label: 'Hittar 3 relevanta källor', done: true },
          ],
          text: 'Samify bygger AI-kollegor för svenska SMB — chatbottar, CRM, integrationer och automationer. Vi jobbar i tre steg: Kartläggning, Prototyp, Driftsättning. Vill du se ett case?',
        }])
        setThinking(false)
      }, 1600)
    } else if (scenario === 'book') {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'bot',
          tools: [
            { icon: Calendar, label: 'Kollar lediga tider…', done: true },
            { icon: Calendar, label: 'Synkar mot Google Calendar', done: true },
          ],
          text: 'Här är lediga 30 min-slots den här veckan — välj en så mejlar jag bekräftelsen direkt:',
          rich: 'calendar',
        }])
        setThinking(false)
      }, 1400)
    } else if (scenario === 'human') {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'bot',
          tools: [
            { icon: UserCheck, label: 'Matchar mot rätt expert…', done: true },
          ],
          text: 'Adnan är tillgänglig just nu. Jag kan koppla dig direkt — vill du?',
          rich: 'handoff',
        }])
        setThinking(false)
      }, 1100)
    }
  }

  const send = () => {
    if (!input.trim()) return
    setMessages(prev => [...prev, { role: 'user', text: input }])
    setInput('')
    setThinking(true)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: 'Bra fråga! Det här är en demo — den riktiga widgeten är kopplad till era egna Zapier/Supabase-flöden.',
      }])
      setThinking(false)
    }, 1400)
  }

  const suggestions = [
    { label: 'Vad är Samify?',   icon: Sparkles,  scenario: 'docs',  prompt: 'Vad är Samify egentligen?' },
    { label: 'Boka demo',        icon: Calendar,  scenario: 'book',  prompt: 'Jag vill boka en demo.' },
    { label: 'Prata med Adnan',  icon: UserCheck, scenario: 'human', prompt: 'Kan jag prata med någon på riktigt?' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: 20, scale: 0.92, filter: 'blur(6px)' }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="fold-open absolute bottom-20 right-0 w-[400px] h-[640px] rounded-[28px] overflow-hidden
                 mesh-bg text-[var(--bone)] shadow-[0_40px_100px_-20px_rgba(0,0,0,.65)]
                 hairline-strong flex flex-col"
    >
      <div className="pointer-events-none absolute inset-0 noise-overlay" style={{ animation: 'samifyGrain 6s steps(3) infinite' }} />

      <div className="relative px-5 pt-5 pb-3 flex items-center gap-3">
        <Orb size={44} state={thinking ? 'thinking' : 'idle'} />
        <div className="flex-1">
          <div className="flex items-baseline gap-1.5">
            <span className="font-sans text-[14px] font-bold tracking-tight">Samify</span>
            <span className="text-[var(--purple-soft)] text-[14px] leading-none">·</span>
            <span className="font-serif italic text-[15px] text-[var(--gold-soft)] leading-none translate-y-[1px]">AI-kollega</span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5 text-[10.5px] text-[var(--bone)]/55">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.7)]" />
            {thinking ? 'Tänker…' : 'Online · svarar direkt'}
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 grid place-items-center rounded-full hairline bg-white/[0.02] hover:bg-white/[0.08] transition"
          aria-label="Stäng"
        >
          <X size={14} />
        </button>
      </div>

      <CapabilityStrip />

      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hidden px-4 py-4 space-y-4">
        {messages.map((m, i) => (
          <Message key={i} m={m} />
        ))}
        {thinking && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-center gap-2.5"
          >
            <Orb size={26} state="thinking" />
            <div className="rounded-2xl rounded-tl-md bg-white/[0.04] hairline px-3 py-2">
              <TypingDots />
            </div>
          </motion.div>
        )}
      </div>

      {messages.length <= 2 && (
        <div className="px-4 pb-3 flex flex-wrap gap-1.5">
          {suggestions.map((s, i) => (
            <MagneticChip key={i} icon={s.icon} onClick={() => runDemo(s.prompt, s.scenario)}>
              {s.label}
            </MagneticChip>
          ))}
        </div>
      )}

      <div className="px-4 pb-2 flex items-center justify-between">
        <ModeSwitcher mode={mode} setMode={setMode} />
        <div className="flex items-center gap-1.5 text-[10px] text-[var(--bone)]/45 font-medium tracking-wide">
          <Command size={10} /> K för kommandon
        </div>
      </div>

      <div className="p-3 pt-2">
        <div className="input-ring transition flex items-end gap-2 rounded-2xl bg-white/[0.03] hairline px-3 py-2.5">
          <button className="shrink-0 w-7 h-7 grid place-items-center rounded-lg text-[var(--bone)]/50 hover:text-[var(--bone)] hover:bg-white/5 transition">
            <Paperclip size={14} />
          </button>
          <div className="flex-1 min-h-[28px] flex items-center">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Fråga vad som helst, eller tryck på mic…"
              className="w-full bg-transparent outline-none text-[13.5px] placeholder:text-[var(--bone)]/35 font-sans"
            />
          </div>
          <Waveform active={typing} />
          <button
            onClick={send}
            disabled={!input.trim()}
            className="shrink-0 w-9 h-9 grid place-items-center rounded-xl transition
                       bg-gradient-to-br from-[var(--purple)] to-[#5b21b6] text-white
                       shadow-[0_8px_24px_-8px_rgba(124,58,237,.7)]
                       disabled:opacity-30 disabled:shadow-none hover:brightness-110"
          >
            {input.trim() ? <Send size={14} /> : <Mic size={14} />}
          </button>
        </div>
        <div className="flex items-center justify-between pt-2 px-1">
          <div className="text-[10px] text-[var(--bone)]/35 tracking-wide">
            Krypterat · GDPR-kompatibelt
          </div>
          <div className="text-[10px] text-[var(--bone)]/45 font-medium">
            Drivs av <span className="shimmer-text font-semibold">Samify</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function Launcher({ open, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className={`relative flex items-center gap-2.5 pl-2 pr-4 py-2 rounded-full
                  bg-[var(--ink-2)] text-[var(--bone)] ${open ? '' : 'breathe-shadow'}
                  border border-white/10`}
      style={{ minHeight: 48 }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-full noise-overlay opacity-40" />
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
      className="absolute bottom-20 right-0 w-[280px] rounded-2xl bg-[var(--ink-2)]/95 backdrop-blur
                 hairline-strong text-[var(--bone)] p-3.5 pr-10
                 shadow-[0_20px_60px_-20px_rgba(0,0,0,.7)]"
    >
      <div className="flex items-start gap-2.5">
        <div className="shrink-0 mt-0.5"><Orb size={24} /></div>
        <div>
          <div className="text-[12.5px] font-semibold">Funderar du på automation?</div>
          <div className="text-[11.5px] text-[var(--bone)]/65 mt-0.5">
            Fråga mig vad Samify kan göra åt er inkorg — på 30 sekunder.
          </div>
          <button
            onClick={onOpen}
            className="mt-2.5 inline-flex items-center gap-1 text-[11.5px] font-semibold text-[var(--purple-soft)] hover:text-white transition"
          >
            Starta chatten <ChevronRight size={12} />
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

export default function SamifyWidget() {
  const [open, setOpen] = useState(false)
  const [nudge, setNudge] = useState(false)
  const [nudgeDismissed, setNudgeDismissed] = useState(false)

  useEffect(() => {
    if (open || nudgeDismissed) return
    const t = setTimeout(() => setNudge(true), 3200)
    return () => clearTimeout(t)
  }, [open, nudgeDismissed])

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
          {open && <SamifyChat onClose={() => setOpen(false)} />}
        </AnimatePresence>

        <div className="relative flex justify-end">
          <Launcher open={open} onClick={() => { setOpen(o => !o); setNudge(false) }} />
        </div>
      </div>
    </>
  )
}
