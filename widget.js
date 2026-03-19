(function() {
  if (document.getElementById('samify-widget-container')) return;

  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Montserrat:wght@500;700&display=swap';
  document.head.appendChild(link);

  var style = document.createElement('style');
  style.textContent = `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --accent: #1a1a2e;
    --accent2: #0f3460;
    --highlight: #e94560;
    --bg: #ffffff;
    --bg2: #f7f7f8;
    --border: #e8e8ec;
    --text: #111118;
    --text2: #6b6b7b;
    --text3: #a0a0b0;
    --radius: 16px;
    --shadow: 0 8px 40px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08);
    --w: 400px;
    --h: 620px;
  }



  /* LAUNCHER */
  #launcher {
    position: fixed; bottom: 24px; right: 24px;
    width: 64px; height: 64px; border-radius: 50%;
    background: var(--accent); border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 20px rgba(0,0,0,0.25);
    transition: transform 0.2s, background 0.2s;
    z-index: 9999;
  }
  #launcher:hover { transform: scale(1.07); background: var(--accent2); }
  #launcher.open svg.chat-icon { display: none; }
  #launcher.open svg.close-icon { display: block !important; }

  /* WIDGET */
  #widget {
    pointer-events: none;
    position: fixed; bottom: 92px; right: 24px;
    width: var(--w); height: var(--h);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    background: var(--bg);
    display: flex; flex-direction: column;
    overflow: hidden;
    transform: scale(0.92) translateY(16px);
    opacity: 0; pointer-events: none;
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease;
    z-index: 9998;
  }
  #widget.visible { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }

  /* HEADER */
  .w-header { background: var(--accent); padding: 16px 18px 0; flex-shrink: 0; }
  .w-header-top { display: flex; align-items: center; margin-bottom: 14px; }
  .w-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--highlight); display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 600; color: #fff; margin-right: 10px; }
  .w-brand-name { font-size: 14px; font-weight: 600; color: #fff; line-height: 1.2; }
  .w-brand-status { font-size: 11px; color: rgba(255,255,255,0.55); display: flex; align-items: center; gap: 4px; }
  .status-dot { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; }

  /* TABS */
  .w-tabs-wrap { display: flex; align-items: stretch; position: relative; }
  .w-tabs { display: flex; gap: 2px; overflow-x: auto; scrollbar-width: none; flex: 1; }
  .w-tabs::-webkit-scrollbar { display: none; }
  .tab-scroll-btn {
    flex-shrink: 0; width: 28px; background: rgba(255,255,255,0.07);
    border: none; cursor: pointer; color: rgba(255,255,255,0.6);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; transition: background 0.15s, color 0.15s;
    padding-bottom: 2px;
  }
  .tab-scroll-btn:hover { background: rgba(255,255,255,0.15); color: #fff; }
  .tab-scroll-btn.hidden { opacity: 0; pointer-events: none; }
  .tab-scroll-left { border-radius: 4px 0 0 0; }
  .tab-scroll-right { border-radius: 0 4px 0 0; }
  .tab-btn {
    flex-shrink: 0; padding: 9px 13px 10px;
    font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500;
    color: rgba(255,255,255,0.5); background: transparent; border: none;
    cursor: pointer; border-bottom: 2px solid transparent;
    transition: color 0.15s, border-color 0.15s; white-space: nowrap;
  }
  .tab-btn:hover { color: rgba(255,255,255,0.8); }
  .tab-btn.active { color: #fff; border-bottom-color: var(--highlight); }

  /* CONTENT */
  .w-content { flex: 1; overflow: hidden; position: relative; }
  .tab-panel { position: absolute; inset: 0; overflow-y: auto; display: none; background: var(--bg2); }
  .tab-panel.active { display: block; }
  #panel-chat { display: none; }
  #panel-chat.active { display: flex; flex-direction: column; }
  #panel-chat zapier-interfaces-chatbot-embed { flex: 1; width: 100% !important; height: 100% !important; border: none; display: block; }

  /* PANEL BODY */
  .panel-body { padding: 18px; }
  .section-title { font-size: 11px; font-weight: 600; color: var(--text3); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 12px; }

  /* FAQ */
  .faq-item { border: 1px solid var(--border); border-radius: 10px; margin-bottom: 8px; overflow: hidden; background: var(--bg); }
  .faq-q { width: 100%; text-align: left; background: none; border: none; padding: 13px 15px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; color: var(--text); transition: background 0.1s; gap: 10px; }
  .faq-q:hover { background: var(--bg2); }
  .faq-q svg { flex-shrink: 0; transition: transform 0.2s; color: var(--text3); }
  .faq-item.open .faq-q svg { transform: rotate(180deg); }
  .faq-a { display: none; padding: 11px 15px 13px; font-size: 12.5px; color: var(--text2); line-height: 1.6; border-top: 1px solid var(--border); }
  .faq-item.open .faq-a { display: block; }

  /* BOOKING */
  .calendly-banner {
    display: flex; align-items: center; gap: 12px;
    background: linear-gradient(135deg, #1a1a2e, #0f3460);
    border-radius: 12px; padding: 16px; margin-bottom: 16px; cursor: pointer;
    transition: opacity 0.15s;
  }
  .calendly-banner:hover { opacity: 0.9; }
  .calendly-icon { width: 40px; height: 40px; border-radius: 10px; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
  .calendly-text strong { display: block; font-size: 13px; font-weight: 600; color: #fff; margin-bottom: 2px; }
  .calendly-text span { font-size: 11.5px; color: rgba(255,255,255,0.55); }
  .calendly-arrow { margin-left: auto; color: rgba(255,255,255,0.4); font-size: 18px; }

  .booking-divider { font-size: 11px; font-weight: 600; color: var(--text3); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 12px; }
  .booking-slots { display: flex; flex-direction: column; gap: 8px; margin-bottom: 18px; }
  .slot { display: flex; align-items: center; justify-content: space-between; border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px; background: var(--bg); }
  .slot-day { font-size: 13px; font-weight: 500; color: var(--text); }
  .slot-time { font-size: 12px; color: var(--text2); margin-top: 2px; }
  .slot-btn { padding: 7px 14px; border-radius: 7px; background: var(--accent); color: #fff; border: none; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; cursor: pointer; transition: background 0.15s; }
  .slot-btn:hover { background: var(--accent2); }
  .slot-btn.full { background: var(--bg2); color: var(--text3); cursor: default; }

  /* CONTACT */
  .contact-card { background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 14px; margin-bottom: 8px; }
  .contact-card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .contact-avatar { width: 38px; height: 38px; border-radius: 50%; background: var(--bg2); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; color: var(--accent); flex-shrink: 0; }
  .contact-name { font-size: 13px; font-weight: 600; color: var(--text); }
  .contact-role { font-size: 11.5px; color: var(--text2); }
  .contact-links { display: flex; flex-direction: column; gap: 6px; }
  .contact-link { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: var(--text2); text-decoration: none; padding: 6px 8px; border-radius: 7px; transition: background 0.1s; }
  .contact-link:hover { background: var(--bg2); color: var(--text); }
  .contact-link svg { flex-shrink: 0; color: var(--text3); }

  /* PRICING */
  .price-toggle { display: flex; background: var(--bg2); border-radius: 8px; padding: 3px; margin-bottom: 16px; gap: 3px; }
  .price-toggle-btn { flex: 1; padding: 7px; border: none; background: transparent; border-radius: 6px; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; color: var(--text2); cursor: pointer; transition: all 0.15s; }
  .price-toggle-btn.active { background: var(--accent); color: #fff; }
  .price-set { display: none; }
  .price-set.active { display: block; }
  .price-card { background: var(--bg); border: 1px solid var(--border); border-radius: 12px; padding: 16px; margin-bottom: 10px; }
  .price-card.featured { border-color: var(--accent); border-width: 1.5px; }
  .price-badge { display: inline-block; font-size: 10px; font-weight: 600; background: var(--highlight); color: #fff; padding: 3px 9px; border-radius: 20px; margin-bottom: 8px; letter-spacing: 0.04em; }
  .price-tier { font-size: 10px; font-weight: 600; color: var(--text3); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 2px; }
  .price-name { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 2px; }
  .price-desc { font-size: 11.5px; color: var(--text2); margin-bottom: 10px; line-height: 1.5; }
  .price-amount { font-size: 20px; font-weight: 700; color: var(--accent); letter-spacing: -0.02em; }
  .price-amount span { font-size: 11px; font-weight: 400; color: var(--text2); }
  .price-features { margin-top: 10px; display: flex; flex-direction: column; gap: 5px; }
  .price-feature { font-size: 12px; color: var(--text2); display: flex; align-items: flex-start; gap: 7px; line-height: 1.4; }
  .price-feature::before { content: '✓'; color: #166534; font-weight: 700; font-size: 11px; flex-shrink: 0; margin-top: 1px; }
  .price-feature strong { color: var(--text); font-weight: 600; }
  .price-cta { display: block; width: 100%; margin-top: 12px; padding: 10px; background: var(--accent); color: #fff; border: none; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; text-align: center; transition: background 0.15s; }
  .price-cta:hover { background: var(--accent2); }
  .price-card.featured .price-cta { background: var(--highlight); }
  .price-card.featured .price-cta:hover { opacity: 0.88; }

  /* STATUS */
  .status-list { display: flex; flex-direction: column; gap: 8px; }
  .status-row { display: flex; align-items: center; justify-content: space-between; padding: 11px 14px; background: var(--bg); border: 1px solid var(--border); border-radius: 10px; }
  .status-label { font-size: 13px; font-weight: 500; color: var(--text); }
  .status-badge { display: flex; align-items: center; gap: 5px; font-size: 11.5px; font-weight: 500; padding: 4px 9px; border-radius: 20px; }
  .status-badge.ok { background: #dcfce7; color: #166534; }
  .status-badge.warn { background: #fef9c3; color: #854d0e; }
  .status-badge .dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
  .status-updated { font-size: 11px; color: var(--text3); margin-top: 14px; text-align: center; }


  /* TOOLTIP BUBBLE */
  #samify-tooltip {
    position: fixed; bottom: 100px; right: 24px;
    background: #1a1a2e; color: #fff;
    padding: 12px 16px; border-radius: 12px 12px 4px 12px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 400;
    line-height: 1.5; max-width: 240px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    pointer-events: all; cursor: pointer;
    opacity: 0; transform: translateY(8px) scale(0.95);
    transition: opacity 0.3s ease, transform 0.3s ease;
    z-index: 9999;
  }
  #samify-tooltip.show { opacity: 1; transform: translateY(0) scale(1); }
  #samify-tooltip::after {
    content: '';
    position: absolute; bottom: -8px; right: 20px;
    width: 0; height: 0;
    border-left: 8px solid transparent;
    border-right: 0px solid transparent;
    border-top: 8px solid #1a1a2e;
  }
  #samify-tooltip-close {
    position: absolute; top: 6px; right: 8px;
    font-size: 14px; color: rgba(255,255,255,0.4);
    cursor: pointer; line-height: 1; background: none; border: none; color: rgba(255,255,255,0.5);
    padding: 0 2px;
  }
  #samify-tooltip-close:hover { color: #fff; }

  /* FOOTER */
  .w-footer { padding: 8px 14px; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .w-footer a { font-size: 10.5px; color: #111; text-decoration: none; display: flex; align-items: center; gap: 5px; transition: opacity 0.15s; font-family: 'Montserrat', sans-serif; font-weight: 700; letter-spacing: 0.02em; }
  .w-footer a:hover { opacity: 0.7; }
  .purple-dot { width: 7px; height: 7px; border-radius: 50%; background: #7c3aed; display: inline-block; flex-shrink: 0; }`;
  document.head.appendChild(style);

  var wrap = document.createElement('div');
  wrap.id = 'samify-widget-container';
  wrap.style.cssText = 'position:fixed;bottom:0;right:0;width:0;height:0;overflow:visible;z-index:9997;';
  wrap.innerHTML = `<button id="launcher" onclick="toggleWidget()" aria-label="Öppna support">
  <svg class="chat-icon" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  <svg class="close-icon" style="display:none" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
</button>

<div id="widget">
  <div class="w-header">
    <div class="w-header-top">
      <div class="w-avatar">S</div>
      <div>
        <div class="w-brand-name">Samify AI</div>
        <div class="w-brand-status"><span class="status-dot"></span> Online nu</div>
      </div>
    </div>
    <div class="w-tabs-wrap">
      <button class="tab-scroll-btn tab-scroll-left hidden" id="tab-left" onclick="tabScroll(-1)" aria-label="Scrolla vänster">&#8249;</button>
      <div class="w-tabs" id="w-tabs">
        <button class="tab-btn active" onclick="switchTab('chat', this)">💬 Chat</button>
        <button class="tab-btn" onclick="switchTab('faq', this)">FAQ</button>
        <button class="tab-btn" onclick="switchTab('booking', this)">Boka möte</button>
        <button class="tab-btn" onclick="switchTab('pricing', this)">Priser</button>
        <button class="tab-btn" onclick="switchTab('contact', this)">Kontakt</button>
        <button class="tab-btn" onclick="switchTab('status', this)">Status</button>
      </div>
      <button class="tab-scroll-btn tab-scroll-right" id="tab-right" onclick="tabScroll(1)" aria-label="Scrolla höger">&#8250;</button>
    </div>
  </div>

  <div class="w-content">

    <!-- CHAT -->
    <div id="panel-chat" class="tab-panel active">
      <script async type="module" src="https://interfaces.zapier.com/assets/web-components/zapier-interfaces/zapier-interfaces.esm.js"></script>
      <zapier-interfaces-chatbot-embed
        is-popup="false"
        chatbot-id="cml7176g80063a6ttccmada8x"
        height="100%"
        width="100%"
      ></zapier-interfaces-chatbot-embed>
    </div>

    <!-- FAQ -->
    <div id="panel-faq" class="tab-panel">
      <div class="panel-body">
        <div class="section-title">Vanliga frågor</div>

        <div class="faq-item">
          <button class="faq-q" onclick="toggleFaq(this)">
            Vad är Samify och vad gör ni?
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="faq-a">Samify är en AI- och automationsbyrå som hjälper svenska SME-företag att effektivisera sina arbetsflöden. Vi bygger skräddarsydda AI-lösningar, chatbotar och integrationer — utan att ni behöver byta system.</div>
        </div>

        <div class="faq-item">
          <button class="faq-q" onclick="toggleFaq(this)">
            Behöver vi byta våra befintliga system?
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="faq-a">Nej — det är hela poängen. Vi kopplar samman det ni redan har: Fortnox, Outlook, webCRM, Google Workspace och 6 000+ andra verktyg. Ni fortsätter jobba som vanligt, vi automatiserar det repetitiva.</div>
        </div>

        <div class="faq-item">
          <button class="faq-q" onclick="toggleFaq(this)">
            Hur snabbt kan vi komma igång?
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="faq-a">Normalt 1–2 veckor från signerat avtal till första lösningen är live. Onboarding och upplärning av AI:n ingår alltid i uppstarten.</div>
        </div>

        <div class="faq-item">
          <button class="faq-q" onclick="toggleFaq(this)">
            Vad kostar en chatbot från Samify?
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="faq-a">Vi har paket från 2 500 kr/mån. Priset beror på antal integrationer, volymer och anpassningsbehov. Boka ett möte så räknar vi ut vad som passar er verksamhet.</div>
        </div>

        <div class="faq-item">
          <button class="faq-q" onclick="toggleFaq(this)">
            Hur tränas chatboten på vår verksamhet?
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="faq-a">Vi laddar upp era dokument, priser, rutiner och vanliga frågor som kunskapskällor. Boten lär sig er röst, era produkter och era processer — och vi finjusterar kontinuerligt baserat på riktiga konversationer.</div>
        </div>

        <div class="faq-item">
          <button class="faq-q" onclick="toggleFaq(this)">
            Vad händer om boten inte vet svaret?
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="faq-a">Boten hänvisar till er mänskliga support och kan automatiskt skicka ett ärende till rätt person. Inget ärende faller mellan stolarna.</div>
        </div>

        <div class="faq-item">
          <button class="faq-q" onclick="toggleFaq(this)">
            Är lösningen GDPR-säker?
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="faq-a">Ja. Vi upprättar alltid ett personuppgiftsbiträdesavtal (DPA) med varje kund. Data behandlas i enlighet med GDPR och lagras inte längre än nödvändigt.</div>
        </div>

        <div class="faq-item">
          <button class="faq-q" onclick="toggleFaq(this)">
            Hur lång är bindningstiden?
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="faq-a">Avtal löper med 3 månaders ömsesidig uppsägningstid. Vi tror på långsiktiga relationer, inte låsningar — ni stannar för att det levererar värde.</div>
        </div>
      </div>
    </div>

    <!-- BOOKING -->
    <div id="panel-booking" class="tab-panel">
      <div class="panel-body">
        <div class="section-title">Boka möte</div>

        <!-- Calendly CTA — byt ut href mot er Calendly-länk -->
        <div class="calendly-banner" onclick="openCalendly()">
          <div class="calendly-icon">📅</div>
          <div class="calendly-text">
            <strong>Boka ett kostnadsfritt möte</strong>
            <span>30 min · Videomöte · Direkt i kalendern</span>
          </div>
          <div class="calendly-arrow">→</div>
        </div>

        <div class="booking-divider">Närmaste lediga tider</div>
        <div class="booking-slots">
          <div class="slot">
            <div>
              <div class="slot-day">Måndag 24 mars</div>
              <div class="slot-time">10:00 – 10:30 · Videomöte</div>
            </div>
            <button class="slot-btn" onclick="openCalendly()">Boka</button>
          </div>
          <div class="slot">
            <div>
              <div class="slot-day">Tisdag 25 mars</div>
              <div class="slot-time">09:00 – 09:30 · Videomöte</div>
            </div>
            <button class="slot-btn" onclick="openCalendly()">Boka</button>
          </div>
          <div class="slot">
            <div>
              <div class="slot-day">Onsdag 26 mars</div>
              <div class="slot-time">13:00 – 13:30 · Videomöte</div>
            </div>
            <button class="slot-btn" onclick="openCalendly()">Boka</button>
          </div>
        </div>
      </div>
    </div>

    <!-- PRICING -->
    <div id="panel-pricing" class="tab-panel">
      <div class="panel-body">
        <div class="section-title">Paket & Priser</div>

        <div class="price-toggle">
          <button class="price-toggle-btn active" onclick="pricingTab('chatbot', this)">💬 Chatbot</button>
          <button class="price-toggle-btn" onclick="pricingTab('automation', this)">⚡ Automatisering</button>
        </div>

        <!-- CHATBOT PRICES -->
        <div id="price-chatbot" class="price-set active">
          <div class="price-card">
            <div class="price-tier">Start</div>
            <div class="price-name">Start</div>
            <div class="price-desc">För mindre team eller enklare kundinteraktioner.</div>
            <div class="price-amount">från 4 995 <span>kr / månad</span></div>
            <div class="price-features">
              <div class="price-feature"><strong>Grundläggande AI</strong> — Tränad på FAQ och vanliga frågor.</div>
              <div class="price-feature"><strong>Extern chatbot</strong> — För hemsida och leadgenerering.</div>
              <div class="price-feature"><strong>Standard-integrationer</strong> — Gmail, Slack, CRM-koppling.</div>
            </div>
            <button class="price-cta" onclick="openCalendly()">Boka demo →</button>
          </div>

          <div class="price-card featured">
            <div class="price-badge">MEST POPULÄR</div>
            <div class="price-tier">Tillväxt</div>
            <div class="price-name">Scale</div>
            <div class="price-desc">För bolag som vill automatisera kundservice och intern support.</div>
            <div class="price-amount">från 9 995 <span>kr / månad</span></div>
            <div class="price-features">
              <div class="price-feature"><strong>Avancerad AI</strong> — Kontextmedveten och lär sig kontinuerligt.</div>
              <div class="price-feature"><strong>Dubbla chatbotar</strong> — Både extern (kunder) och intern (HR/policys).</div>
              <div class="price-feature"><strong>Prioriterad support</strong> — Dedikerad kontaktperson för snabb hjälp.</div>
              <div class="price-feature"><strong>Anpassade arbetsflöden</strong> — Eskalering till rätt person automatiskt.</div>
            </div>
            <button class="price-cta" onclick="openCalendly()">Boka demo →</button>
          </div>

          <div class="price-card">
            <div class="price-tier">Optimal</div>
            <div class="price-name">Custom</div>
            <div class="price-desc">Skräddarsydd AI-lösning för maximal konvertering och effektivitet.</div>
            <div class="price-amount">Offert <span>kontakta oss</span></div>
            <div class="price-features">
              <div class="price-feature"><strong>Chatbot + Automation</strong> — Bot som inte bara pratar, den utför åtgärder direkt i era system.</div>
              <div class="price-feature"><strong>Full integration</strong> — Alla era system kopplade i realtid.</div>
              <div class="price-feature"><strong>Proaktiv förvaltning</strong> — Kontinuerlig optimering och uppdateringar.</div>
            </div>
            <button class="price-cta" onclick="openCalendly()">Kontakta oss →</button>
          </div>
        </div>

        <!-- AUTOMATION PRICES -->
        <div id="price-automation" class="price-set">
          <div class="price-card">
            <div class="price-tier">Start</div>
            <div class="price-name">Start</div>
            <div class="price-desc">För enstaka automatiserade processer och mindre dataflöden.</div>
            <div class="price-amount">från 4 995 <span>kr / månad</span></div>
            <div class="price-features">
              <div class="price-feature"><strong>Enkel komplexitet</strong> — Raka flöden (A till B) utan avancerad logik.</div>
              <div class="price-feature"><strong>Grundautomation</strong> — E-post, notiser, grundläggande dataöverföring.</div>
              <div class="price-feature"><strong>Standard-appar</strong> — Koppling till vanliga verktyg (Gmail, Slack, Trello).</div>
            </div>
            <button class="price-cta" onclick="openCalendly()">Boka demo →</button>
          </div>

          <div class="price-card featured">
            <div class="price-badge">MEST POPULÄR</div>
            <div class="price-tier">Tillväxt</div>
            <div class="price-name">Scale</div>
            <div class="price-desc">För bolag som vill automatisera hela avdelningar eller system.</div>
            <div class="price-amount">från 9 995 <span>kr / månad</span></div>
            <div class="price-features">
              <div class="price-feature"><strong>Medelhög komplexitet</strong> — Flöden med villkor, filter och felhantering.</div>
              <div class="price-feature"><strong>Multi-system</strong> — CRM, ekonomi, projekt – allt synkat automatiskt.</div>
              <div class="price-feature"><strong>Omdömeshantering</strong> — Automatisk insamling och svar via Google/Trustpilot.</div>
              <div class="price-feature"><strong>SOC 2-säkerhet</strong> — Hantering av känslig data enligt standard.</div>
            </div>
            <button class="price-cta" onclick="openCalendly()">Boka demo →</button>
          </div>

          <div class="price-card">
            <div class="price-tier">Optimal</div>
            <div class="price-name">Custom</div>
            <div class="price-desc">Skräddarsydd helhetslösning för maximal tidsbesparing.</div>
            <div class="price-amount">Offert <span>kontakta oss</span></div>
            <div class="price-features">
              <div class="price-feature"><strong>Djupgående analys</strong> — Kartläggning av processer för att hitta varje sparad minut.</div>
              <div class="price-feature"><strong>Full systemintegration</strong> — Sömlös dataöverföring mellan alla affärssystem.</div>
              <div class="price-feature"><strong>Proaktiv förvaltning</strong> — Löpande optimering och dedikerad kontaktperson.</div>
            </div>
            <button class="price-cta" onclick="openCalendly()">Kontakta oss →</button>
          </div>
        </div>

      </div>
    </div>

    <!-- CONTACT -->
    <div id="panel-contact" class="tab-panel">
      <div class="panel-body">
        <div class="section-title">Kontakta oss</div>

        <div class="contact-card">
          <div class="contact-card-header">
            <div class="contact-avatar">S</div>
            <div>
              <div class="contact-name">Samify</div>
              <div class="contact-role">AI & Automationsbyrå · Kalmar</div>
            </div>
          </div>
          <div class="contact-links">
            <a href="mailto:info@samify.se" class="contact-link">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              info@samify.se
            </a>
            <a href="https://samify.se" target="_blank" class="contact-link">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              samify.se
            </a>
            <a href="https://www.linkedin.com/company/samify-ai" target="_blank" class="contact-link">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              LinkedIn
            </a>
          </div>
        </div>

        <div class="contact-card">
          <div class="contact-card-header">
            <div class="contact-avatar" style="background:#f0f0ff;color:#5B2D8E;">ZL</div>
            <div>
              <div class="contact-name">ZicLun AB</div>
              <div class="contact-role">Org.nr: 559XXX-XXXX · Kalmar</div>
            </div>
          </div>
          <div class="contact-links">
            <a href="mailto:info@samify.se" class="contact-link">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              Fakturering & avtal
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- STATUS -->
    <div id="panel-status" class="tab-panel">
      <div class="panel-body">
        <div class="section-title">Systemstatus</div>
        <div class="status-list">
          <div class="status-row"><span class="status-label">Chatbot</span><span class="status-badge ok"><span class="dot"></span> Driftig</span></div>
          <div class="status-row"><span class="status-label">API-integrationer</span><span class="status-badge ok"><span class="dot"></span> Driftig</span></div>
          <div class="status-row"><span class="status-label">E-postautomation</span><span class="status-badge ok"><span class="dot"></span> Driftig</span></div>
          <div class="status-row"><span class="status-label">Automationsplattform</span><span class="status-badge ok"><span class="dot"></span> Driftig</span></div>
          <div class="status-row"><span class="status-label">Dashboard</span><span class="status-badge ok"><span class="dot"></span> Driftig</span></div>
        </div>
        <div class="status-updated">Uppdaterad: idag 08:42</div>
      </div>
    </div>

  </div>

  <div class="w-footer">
    <a href="https://samify.se" target="_blank">
      Powered By Samify AI <span class="purple-dot"></span>
    </a>
  </div>
</div>`;
  document.body.appendChild(wrap);

  // ⬇️ BYT UT MOT ER CALENDLY-LÄNK
  const CALENDLY_URL = 'https://calendly.com/samify'; // <-- ändra här

  function toggleWidget() {
    document.getElementById('widget').classList.toggle('visible');
    document.getElementById('launcher').classList.toggle('open');
  }

  function switchTab(name, btn) {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('panel-' + name).classList.add('active');
    btn.classList.add('active');
  }

  function toggleFaq(btn) {
    btn.closest('.faq-item').classList.toggle('open');
  }

  const tabsEl = document.getElementById('w-tabs');
  const tabLeft = document.getElementById('tab-left');
  const tabRight = document.getElementById('tab-right');

  function updateTabArrows() {
    tabLeft.classList.toggle('hidden', tabsEl.scrollLeft <= 4);
    tabRight.classList.toggle('hidden', tabsEl.scrollLeft + tabsEl.clientWidth >= tabsEl.scrollWidth - 4);
  }

  function tabScroll(dir) {
    tabsEl.scrollBy({ left: dir * 100, behavior: 'smooth' });
    setTimeout(updateTabArrows, 200);
  }

  tabsEl.addEventListener('scroll', updateTabArrows);
  window.addEventListener('load', updateTabArrows);
  setTimeout(updateTabArrows, 500);

  function pricingTab(name, btn) {
    document.querySelectorAll('.price-set').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.price-toggle-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('price-' + name).classList.add('active');
    btn.classList.add('active');
  }

  function openCalendly() {
    window.open(CALENDLY_URL, '_blank');
  }




  // Tooltip
  function closeTooltip() {
    var t = document.getElementById('samify-tooltip');
    if (t) { t.classList.remove('show'); setTimeout(function(){ t.style.display='none'; }, 300); }
  }
  function openFromTooltip() {
    closeTooltip();
    document.getElementById('widget').classList.add('visible');
    document.getElementById('launcher').classList.add('open');
  }
  setTimeout(function() {
    var t = document.getElementById('samify-tooltip');
    if (t) t.classList.add('show');
  }, 5000);

  setTimeout(function() {
    if (typeof updateTabArrows === 'function') updateTabArrows();
  }, 300);
})();
