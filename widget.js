(function() {
  if (document.getElementById('samify-widget-container')) return;

  // Load Zapier chatbot script
  var zapierScript = document.createElement('script');
  zapierScript.type = 'module';
  zapierScript.src = 'https://interfaces.zapier.com/assets/web-components/zapier-interfaces/zapier-interfaces.esm.js';
  document.head.appendChild(zapierScript);

  // Fonts
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap';
  document.head.appendChild(link);

  // CSS
  var style = document.createElement('style');
  style.textContent = `
    #samify-widget-container * { font-family: 'Montserrat', sans-serif !important; box-sizing: border-box; }

    #samify-launcher {
      position: fixed; bottom: 24px; right: 24px;
      width: 64px; height: 64px; border-radius: 50%;
      background: #1a1a2e; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.25);
      transition: transform 0.2s, background 0.2s;
      z-index: 9999;
    }
    #samify-launcher:hover { transform: scale(1.07); background: #0f3460; }
    #samify-launcher.open .si-chat { display: none; }
    #samify-launcher.open .si-close { display: block !important; }

    #samify-widget {
      position: fixed; bottom: 100px; right: 24px;
      width: 380px; height: 620px;
      border-radius: 18px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.16), 0 2px 8px rgba(0,0,0,0.08);
      background: #fff;
      display: flex; flex-direction: column;
      overflow: hidden;
      transform: scale(0.92) translateY(16px);
      opacity: 0; pointer-events: none;
      transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease, width 0.3s ease, height 0.3s ease, bottom 0.3s ease;
      z-index: 9998;
    }
    #samify-widget.visible { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }
    #samify-widget.expanded { width: 520px; height: 780px; bottom: 24px; }
    @media (max-width: 580px) { #samify-widget.expanded { width: calc(100vw - 16px); height: calc(100vh - 100px); right: 8px; } }

    .sw-header {
      background: #1a1a2e; padding: 16px 18px;
      display: flex; align-items: center; gap: 12px;
      flex-shrink: 0;
    }
    .sw-back {
      background: rgba(255,255,255,0.1); border: none; cursor: pointer;
      width: 28px; height: 28px; border-radius: 50%;
      display: none; align-items: center; justify-content: center;
      color: #fff; font-size: 16px; transition: background 0.15s;
      flex-shrink: 0;
    }
    .sw-back.show { display: flex; }
    .sw-back:hover { background: rgba(255,255,255,0.2); }
    .sw-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: #e94560; display: flex; align-items: center; justify-content: center;
      font-size: 14px; font-weight: 700; color: #fff; flex-shrink: 0;
    }
    .sw-title { font-size: 14px; font-weight: 700; color: #fff; }
    .sw-status { font-size: 11px; color: rgba(255,255,255,0.5); display: flex; align-items: center; gap: 4px; margin-top: 2px; }
    .sw-dot { width: 5px; height: 5px; border-radius: 50%; background: #4ade80; }

    .sw-content { flex: 1; overflow: hidden; position: relative; }
    .sw-screen { position: absolute; inset: 0; overflow-y: auto; background: #f7f7f8; display: none; flex-direction: column; }
    .sw-screen.active { display: flex; }

    /* HOME */
    .home-body { padding: 16px; }
    .home-greeting {
      font-size: 12.5px; font-weight: 400; color: #6b6b7b;
      line-height: 1.6; margin-bottom: 14px;
      background: #fff; border-radius: 12px; padding: 12px 14px;
      border: 1px solid #e8e8ec;
    }
    .home-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .home-card {
      background: #fff; border: 1px solid #e8e8ec;
      border-radius: 12px; padding: 14px 12px;
      display: flex; flex-direction: column; align-items: center;
      gap: 7px; cursor: pointer; text-align: center;
      transition: background 0.15s, border-color 0.15s, transform 0.1s;
    }
    .home-card:hover { background: #f0f0f8; border-color: #1a1a2e; transform: translateY(-1px); }
    .home-card:active { transform: scale(0.97); }
    .home-card.wide {
      grid-column: span 2; flex-direction: row;
      justify-content: flex-start; gap: 14px;
      padding: 14px 16px; text-align: left;
      background: #1a1a2e; border-color: #1a1a2e;
    }
    .home-card.wide:hover { background: #0f3460; border-color: #0f3460; }
    .home-card.wide .card-label { color: #fff; }
    .home-card.wide .card-sub { color: rgba(255,255,255,0.55); }
    .home-card.wide .card-icon-wrap {
      width: 40px; height: 40px; border-radius: 10px;
      background: rgba(255,255,255,0.12);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .home-card .card-icon-wrap {
      width: 38px; height: 38px; border-radius: 10px;
      background: #f0f0f8;
      display: flex; align-items: center; justify-content: center;
    }
    .card-icon { font-size: 20px; }
    .card-icon-wrap svg { stroke: #6b6b7b; }
    .home-card.wide .card-icon-wrap svg { stroke: rgba(255,255,255,0.85); }
    .card-label { font-size: 12px; font-weight: 700; color: #111118; }
    .card-sub { font-size: 10.5px; color: #a0a0b0; font-weight: 400; }
    .wide-arrow { margin-left: auto; color: rgba(255,255,255,0.4); font-size: 20px; font-weight: 300; }

    /* INNER SCREENS */
    .inner-body { padding: 16px; flex: 1; }
    .inner-title { font-size: 13px; font-weight: 700; color: #111118; margin-bottom: 12px; }

    /* CHAT */
    #sw-chat { display: none; flex-direction: column; }
    #sw-chat.active { display: flex; }
    #sw-chat zapier-interfaces-chatbot-embed { flex: 1; width: 100% !important; height: 100% !important; border: none; display: block; }

    /* FAQ */
    .faq-item { border: 1px solid #e8e8ec; border-radius: 10px; margin-bottom: 8px; overflow: hidden; background: #fff; }
    .faq-q { width: 100%; text-align: left; background: none; border: none; padding: 13px 15px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; font-size: 12.5px; font-weight: 600; color: #111118; transition: background 0.1s; gap: 10px; }
    .faq-q:hover { background: #f7f7f8; }
    .faq-chevron { flex-shrink: 0; transition: transform 0.2s; color: #a0a0b0; font-size: 14px; }
    .faq-item.open .faq-chevron { transform: rotate(180deg); }
    .faq-a { display: none; padding: 0 15px 13px; font-size: 12px; font-weight: 400; color: #6b6b7b; line-height: 1.65; border-top: 1px solid #e8e8ec; padding-top: 11px; }
    .faq-item.open .faq-a { display: block; }

    /* BOOKING / CALENDLY */
    #sw-booking { padding: 0; }
    #sw-booking .inner-body { padding: 0; height: 100%; display: flex; flex-direction: column; }
    .calendly-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; gap: 10px; color: #a0a0b0; font-size: 12px; }
    .calendly-spinner { width: 26px; height: 26px; border-radius: 50%; border: 3px solid #e8e8ec; border-top-color: #1a1a2e; animation: sw-spin 0.8s linear infinite; }
    @keyframes sw-spin { to { transform: rotate(360deg); } }

    /* PRICING */
    .price-toggle { display: flex; background: #ebebeb; border-radius: 8px; padding: 3px; margin-bottom: 14px; gap: 3px; }
    .price-toggle-btn { flex: 1; padding: 7px; border: none; background: transparent; border-radius: 6px; font-size: 11.5px; font-weight: 600; color: #6b6b7b; cursor: pointer; transition: all 0.15s; }
    .price-toggle-btn.active { background: #1a1a2e; color: #fff; }
    .price-set { display: none; }
    .price-set.active { display: block; }
    .price-card { background: #fff; border: 1px solid #e8e8ec; border-radius: 12px; padding: 14px; margin-bottom: 10px; }
    .price-card.featured { border-color: #1a1a2e; border-width: 1.5px; }
    .price-badge { display: inline-block; font-size: 9.5px; font-weight: 700; background: #e94560; color: #fff; padding: 3px 9px; border-radius: 20px; margin-bottom: 8px; letter-spacing: 0.05em; }
    .price-tier { font-size: 9.5px; font-weight: 700; color: #a0a0b0; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 2px; }
    .price-name { font-size: 16px; font-weight: 700; color: #111118; margin-bottom: 6px; }
    .price-amount { font-size: 19px; font-weight: 700; color: #1a1a2e; letter-spacing: -0.02em; }
    .price-amount span { font-size: 11px; font-weight: 400; color: #a0a0b0; }
    .price-features { margin-top: 10px; display: flex; flex-direction: column; gap: 5px; }
    .price-feature { font-size: 11.5px; font-weight: 400; color: #6b6b7b; display: flex; align-items: flex-start; gap: 7px; line-height: 1.4; }
    .price-feature::before { content: '✓'; color: #166534; font-weight: 700; font-size: 11px; flex-shrink: 0; margin-top: 1px; }
    .price-cta { display: block; width: 100%; margin-top: 12px; padding: 10px; background: #1a1a2e; color: #fff; border: none; border-radius: 8px; font-size: 12.5px; font-weight: 700; cursor: pointer; text-align: center; transition: background 0.15s; }
    .price-cta:hover { background: #0f3460; }
    .price-card.featured .price-cta { background: #e94560; }
    .price-card.featured .price-cta:hover { opacity: 0.88; }

    /* CONTACT */
    .contact-card { background: #fff; border: 1px solid #e8e8ec; border-radius: 10px; padding: 14px; margin-bottom: 8px; }
    .contact-head { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
    .contact-av { width: 38px; height: 38px; border-radius: 50%; background: #f0f0f8; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #1a1a2e; flex-shrink: 0; }
    .contact-name { font-size: 13px; font-weight: 700; color: #111118; }
    .contact-role { font-size: 11px; color: #a0a0b0; }
    .contact-links { display: flex; flex-direction: column; gap: 4px; }
    .contact-link { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #6b6b7b; text-decoration: none; padding: 7px 8px; border-radius: 7px; transition: background 0.1s; }
    .contact-link:hover { background: #f7f7f8; color: #111118; }

    /* KOM IGÅNG */
    .start-steps { display: flex; flex-direction: column; margin-bottom: 16px; }
    .start-step { display: flex; gap: 14px; padding: 16px 0; border-bottom: 1px solid #e8e8ec; }
    .start-step:last-child { border-bottom: none; }
    .start-num { width: 30px; height: 30px; border-radius: 50%; background: #1a1a2e; color: #fff; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
    .start-step-title { font-size: 13px; font-weight: 700; color: #111118; margin-bottom: 3px; }
    .start-step-desc { font-size: 11.5px; font-weight: 400; color: #6b6b7b; line-height: 1.55; }
    .start-cta-box { background: #1a1a2e; border-radius: 12px; padding: 16px; text-align: center; }
    .start-cta-box p { font-size: 12px; color: rgba(255,255,255,0.6); margin-bottom: 10px; }
    .start-cta-btn { padding: 10px 22px; background: #e94560; color: #fff; border: none; border-radius: 8px; font-size: 12.5px; font-weight: 700; cursor: pointer; transition: opacity 0.15s; }
    .start-cta-btn:hover { opacity: 0.88; }

    /* TOOLTIP */
    #samify-tooltip {
      position: fixed; bottom: 100px; right: 24px;
      background: #1a1a2e; color: #fff;
      padding: 16px 20px 16px 16px; border-radius: 16px 16px 4px 16px;
      font-size: 14px; font-weight: 500; line-height: 1.6;
      max-width: 260px; cursor: pointer;
      box-shadow: 0 4px 20px rgba(0,0,0,0.18);
      opacity: 0; transform: translateY(8px) scale(0.95);
      transition: opacity 0.3s ease, transform 0.3s ease;
      z-index: 9999; pointer-events: all;
    }
    #samify-tooltip.show { opacity: 1; transform: translateY(0) scale(1); }
    #samify-tooltip::after {
      content: ''; position: absolute; bottom: -8px; right: 20px;
      border-left: 8px solid transparent; border-right: 8px solid transparent;
      border-top: 8px solid #1a1a2e;
    }
    #samify-tooltip-close { position: absolute; top: 6px; right: 8px; background: none; border: none; color: rgba(255,255,255,0.4); cursor: pointer; font-size: 13px; line-height: 1; padding: 0; }
    #samify-tooltip-close:hover { color: #fff; }

    /* FOOTER */
    .sw-footer { padding: 10px 14px; border-top: 1px solid #e8e8ec; display: flex; align-items: center; justify-content: center; flex-shrink: 0; background: #fff; }
    .sw-footer a { font-size: 12px; color: #111; text-decoration: none; display: flex; align-items: center; gap: 5px; font-weight: 700; letter-spacing: 0.02em; transition: opacity 0.15s; }
    .sw-footer a:hover { opacity: 0.65; }
    .sw-pdot { width: 6px; height: 6px; border-radius: 50%; background: #7c3aed; display: inline-block; }
  `;
  document.head.appendChild(style);

  // HTML
  var wrap = document.createElement('div');
  wrap.id = 'samify-widget-container';
  wrap.style.cssText = 'position:fixed;bottom:0;right:0;width:0;height:0;overflow:visible;z-index:9997;';
  wrap.innerHTML = `
    <button id="samify-launcher" onclick="swToggle()" aria-label="Öppna support">
      <svg class="si-chat" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <svg class="si-close" style="display:none" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>

    <div id="samify-widget">
      <div class="sw-header" id="sw-header">
        <button class="sw-back" id="sw-back" onclick="swGoHome()">‹</button>
        <div class="sw-avatar">S</div>
        <div>
          <div class="sw-title" id="sw-header-title">Samify AI</div>
          <div class="sw-status"><span class="sw-dot"></span> Online nu</div>
        </div>
      </div>

      <div class="sw-content">

        <!-- HOME -->
        <div class="sw-screen active" id="sw-home">
          <div class="home-body">
            <div class="home-greeting">Hej! Hur kan vi hjälpa dig idag? Välj ett alternativ eller chatta direkt med oss. </div>
            <div class="home-grid">
              <div class="home-card wide" onclick="swNav('sw-chat','Chatta med oss')">
                <div class="card-icon-wrap"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#ffffff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
                <div>
                  <div class="card-label">Chatta med oss</div>
                  <div class="card-sub">Svar direkt från vår AI</div>
                </div>
                <div class="wide-arrow">›</div>
              </div>
              <div class="home-card" onclick="swNav('sw-faq','Vanliga frågor')">
                <div class="card-icon-wrap"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
                <div class="card-label">Vanliga frågor</div>
                <div class="card-sub">Snabba svar</div>
              </div>
              <div class="home-card" onclick="swNav('sw-booking','Boka möte')">
                <div class="card-icon-wrap"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
                <div class="card-label">Boka möte</div>
                <div class="card-sub">30 min, gratis</div>
              </div>
              <div class="home-card" onclick="swNav('sw-pricing','Priser')">
                <div class="card-icon-wrap"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
                <div class="card-label">Priser</div>
                <div class="card-sub">Från 4 995 kr/mån</div>
              </div>
              <div class="home-card" onclick="swNav('sw-contact','Kontakt')">
                <div class="card-icon-wrap"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.36a2 2 0 0 1 2-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>
                <div class="card-label">Kontakt</div>
                <div class="card-sub">info@samify.se</div>
              </div>
            </div>
          </div>
        </div>

        <!-- CHAT -->
        <div class="sw-screen" id="sw-chat">
          <zapier-interfaces-chatbot-embed
            is-popup="false"
            chatbot-id="cml7176g80063a6ttccmada8x"
            height="100%"
            width="100%"
          ></zapier-interfaces-chatbot-embed>
        </div>

        <!-- FAQ -->
        <div class="sw-screen" id="sw-faq">
          <div class="inner-body">
            <div class="inner-title">Vanliga frågor</div>
            <div class="faq-item">
              <button class="faq-q" onclick="swFaq(this)">Vad är Samify och vad gör ni? <svg class="faq-chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></button>
              <div class="faq-a">Samify är en AI- och automationsbyrå som hjälper svenska SME-företag att effektivisera sina arbetsflöden med skräddarsydda AI-lösningar och integrationer.</div>
            </div>
            <div class="faq-item">
              <button class="faq-q" onclick="swFaq(this)">Behöver vi byta befintliga system? <svg class="faq-chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></button>
              <div class="faq-a">Nej — vi kopplar samman det ni redan har: Fortnox, Outlook, webCRM, Google Workspace och 6 000+ verktyg. Ni fortsätter jobba som vanligt.</div>
            </div>
            <div class="faq-item">
              <button class="faq-q" onclick="swFaq(this)">Hur snabbt kan vi komma igång? <svg class="faq-chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></button>
              <div class="faq-a">Normalt 1–2 veckor från signerat avtal till första lösningen är live. Onboarding ingår alltid.</div>
            </div>
            <div class="faq-item">
              <button class="faq-q" onclick="swFaq(this)">Vad kostar det? <svg class="faq-chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></button>
              <div class="faq-a">Vi har paket från 4 995 kr/mån. Priset beror på integrationer och anpassningsbehov. Boka ett möte så tar vi fram ett förslag.</div>
            </div>
            <div class="faq-item">
              <button class="faq-q" onclick="swFaq(this)">Hur tränas chatboten på vår verksamhet? <svg class="faq-chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></button>
              <div class="faq-a">Vi laddar upp era dokument, priser och rutiner som kunskapskällor. Boten lär sig er röst och vi finjusterar löpande.</div>
            </div>
            <div class="faq-item">
              <button class="faq-q" onclick="swFaq(this)">Är lösningen GDPR-säker? <svg class="faq-chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></button>
              <div class="faq-a">Ja. Vi upprättar alltid ett personuppgiftsbiträdesavtal (DPA) och all data behandlas enligt GDPR.</div>
            </div>
            <div class="faq-item">
              <button class="faq-q" onclick="swFaq(this)">Hur lång är bindningstiden? <svg class="faq-chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></button>
              <div class="faq-a">Avtal löper med 3 månaders ömsesidig uppsägningstid. Ni stannar för att det levererar värde — inte för att ni måste.</div>
            </div>
          </div>
        </div>

        <!-- BOOKING -->
        <div class="sw-screen" id="sw-booking">
          <div class="inner-body" style="display:flex;flex-direction:column;gap:12px;">
            <div class="inner-title">Boka möte</div>
            <div style="background:#fff;border:1px solid #e8e8ec;border-radius:12px;padding:18px;text-align:center;">
              <div style="width:48px;height:48px;border-radius:12px;background:#f0f0f8;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#1a1a2e" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <div style="font-size:14px;font-weight:700;color:#111118;margin-bottom:6px;">Boka ett kostnadsfritt möte</div>
              <div style="font-size:12px;color:#6b6b7b;margin-bottom:16px;line-height:1.6;">30 minuter · Videomöte · Välj en tid som passar dig direkt i vår kalender.</div>
              <button onclick="swOpenCalendlyPopup()" style="width:100%;padding:12px;background:#1a1a2e;color:#fff;border:none;border-radius:9px;font-size:13px;font-weight:700;cursor:pointer;transition:background 0.15s;" onmouseover="this.style.background='#0f3460'" onmouseout="this.style.background='#1a1a2e'">
                Öppna kalender →
              </button>
            </div>
            <div style="background:#fff;border:1px solid #e8e8ec;border-radius:12px;padding:14px;">
              <div style="font-size:11px;font-weight:700;color:#a0a0b0;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:10px;">Vad ingår i mötet?</div>
              <div style="display:flex;flex-direction:column;gap:8px;">
                <div style="display:flex;align-items:center;gap:10px;font-size:12px;color:#6b6b7b;">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#166534" stroke-width="2" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Genomgång av era nuvarande processer
                </div>
                <div style="display:flex;align-items:center;gap:10px;font-size:12px;color:#6b6b7b;">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#166534" stroke-width="2" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Demo av vad AI kan göra för er
                </div>
                <div style="display:flex;align-items:center;gap:10px;font-size:12px;color:#6b6b7b;">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#166534" stroke-width="2" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Prisindikation utan bindning
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- PRICING -->
        <div class="sw-screen" id="sw-pricing">
          <div class="inner-body">
            <div class="inner-title">Paket & Priser</div>
            <div class="price-toggle">
              <button class="price-toggle-btn active" onclick="swPricingTab('chatbot',this)">Chatbot</button>
              <button class="price-toggle-btn" onclick="swPricingTab('automation',this)">Automatisering</button>
            </div>
            <div id="sw-price-chatbot" class="price-set active">
              <div class="price-card">
                <div class="price-tier">Start</div>
                <div class="price-name">Start</div>
                <div class="price-amount">från 4 995 <span>kr / månad</span></div>
                <div class="price-features">
                  <div class="price-feature">Grundläggande AI tränad på er verksamhet</div>
                  <div class="price-feature">Extern chatbot för hemsida & leads</div>
                  <div class="price-feature">Gmail, Slack & CRM-koppling</div>
                </div>
                <button class="price-cta" onclick="swOpenCalendly()">Boka demo →</button>
              </div>
              <div class="price-card featured">
                <div class="price-badge">MEST POPULÄR</div>
                <div class="price-tier">Tillväxt</div>
                <div class="price-name">Scale</div>
                <div class="price-amount">från 9 995 <span>kr / månad</span></div>
                <div class="price-features">
                  <div class="price-feature">Avancerad AI — lär sig kontinuerligt</div>
                  <div class="price-feature">Extern + intern bot (kunder & HR)</div>
                  <div class="price-feature">Dedikerad kontaktperson</div>
                  <div class="price-feature">Automatisk eskalering & arbetsflöden</div>
                </div>
                <button class="price-cta" onclick="swOpenCalendly()">Boka demo →</button>
              </div>
              <div class="price-card">
                <div class="price-tier">Optimal</div>
                <div class="price-name">Custom</div>
                <div class="price-amount">Offert <span>kontakta oss</span></div>
                <div class="price-features">
                  <div class="price-feature">Bot som agerar direkt i era system</div>
                  <div class="price-feature">Full integration i realtid</div>
                  <div class="price-feature">Löpande optimering & förvaltning</div>
                </div>
                <button class="price-cta" onclick="swOpenCalendly()">Kontakta oss →</button>
              </div>
            </div>
            <div id="sw-price-automation" class="price-set">
              <div class="price-card">
                <div class="price-tier">Start</div>
                <div class="price-name">Start</div>
                <div class="price-amount">från 4 995 <span>kr / månad</span></div>
                <div class="price-features">
                  <div class="price-feature">Enkla flöden från A till B</div>
                  <div class="price-feature">E-post, notiser & dataöverföring</div>
                  <div class="price-feature">Gmail, Slack & Trello</div>
                </div>
                <button class="price-cta" onclick="swOpenCalendly()">Boka demo →</button>
              </div>
              <div class="price-card featured">
                <div class="price-badge">MEST POPULÄR</div>
                <div class="price-tier">Tillväxt</div>
                <div class="price-name">Scale</div>
                <div class="price-amount">från 9 995 <span>kr / månad</span></div>
                <div class="price-features">
                  <div class="price-feature">Flöden med villkor, filter & felhantering</div>
                  <div class="price-feature">CRM, ekonomi & projekt synkat</div>
                  <div class="price-feature">Google & Trustpilot-omdömen automatiskt</div>
                  <div class="price-feature">SOC 2-säker datahantering</div>
                </div>
                <button class="price-cta" onclick="swOpenCalendly()">Boka demo →</button>
              </div>
              <div class="price-card">
                <div class="price-tier">Optimal</div>
                <div class="price-name">Custom</div>
                <div class="price-amount">Offert <span>kontakta oss</span></div>
                <div class="price-features">
                  <div class="price-feature">Kartläggning & analys av era processer</div>
                  <div class="price-feature">Sömlös integration mellan alla system</div>
                  <div class="price-feature">Löpande optimering & dedikerad kontakt</div>
                </div>
                <button class="price-cta" onclick="swOpenCalendly()">Kontakta oss →</button>
              </div>
            </div>
          </div>
        </div>

        <!-- CONTACT -->
        <div class="sw-screen" id="sw-contact">
          <div class="inner-body">
            <div class="inner-title">Kontakta oss</div>
            <div class="contact-card">
              <div class="contact-head">
                <div class="contact-av">S</div>
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
                <a href="mailto:info@samify.se" class="contact-link">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  Fakturering & avtal
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="sw-footer">
        <a href="https://samify.se" target="_blank" style="flex-direction:row;align-items:center;gap:6px;">
          <span style="font-size:11px;font-weight:700;color:#a0a0b0;letter-spacing:0.03em;">Powered By</span>
          <img src="https://samify.se/wp-content/uploads/go-x/u/7c566770-2e09-4b98-98b8-c4afcbbeeeaa/image-160x62.png" alt="Samify" style="height:18px;width:auto;display:block;" />
          <span class="sw-pdot"></span>
        </a>
      </div>
    </div>

    <div id="samify-tooltip" onclick="swOpenFromTooltip()">
      <button id="samify-tooltip-close" onclick="event.stopPropagation();swCloseTooltip()">✕</button>
      Hej! Kul att du hittat till Samify — ställ gärna några frågor till mig om du undrar över något! 
    </div>
  `;
  document.body.appendChild(wrap);

  // ⬇️ BYT UT MOT ER CALENDLY-LÄNK
  var CALENDLY_URL = 'https://calendly.com/samify-info';

  function swToggle() {
    document.getElementById('samify-widget').classList.toggle('visible');
    document.getElementById('samify-launcher').classList.toggle('open');
    swCloseTooltip();
  }

  function swGoHome() {
    document.querySelectorAll('.sw-screen').forEach(function(s) { s.classList.remove('active'); });
    document.getElementById('sw-home').classList.add('active');
    document.getElementById('sw-back').classList.remove('show');
    document.getElementById('sw-header-title').textContent = 'Samify AI';
    document.getElementById('samify-widget').classList.remove('expanded');
  }

  var expandScreens = ['sw-chat', 'sw-pricing'];

  function swNav(screenId, title) {
    document.querySelectorAll('.sw-screen').forEach(function(s) { s.classList.remove('active'); });
    document.getElementById(screenId).classList.add('active');
    document.getElementById('sw-back').classList.add('show');
    document.getElementById('sw-header-title').textContent = title;
    var widget = document.getElementById('samify-widget');
    if (expandScreens.indexOf(screenId) !== -1) {
      widget.classList.add('expanded');
    } else {
      widget.classList.remove('expanded');
    }
  }

  function swOpenCalendlyPopup() {
    // Load Calendly popup widget
    if (!window.Calendly) {
      var s = document.createElement('script');
      s.src = 'https://assets.calendly.com/assets/external/widget.js';
      s.onload = function() {
        var l = document.createElement('link');
        l.rel = 'stylesheet';
        l.href = 'https://assets.calendly.com/assets/external/widget.css';
        document.head.appendChild(l);
        window.Calendly.initPopupWidget({ url: CALENDLY_URL });
      };
      document.head.appendChild(s);
    } else {
      window.Calendly.initPopupWidget({ url: CALENDLY_URL });
    }
  }

  function swFaq(btn) { btn.closest('.faq-item').classList.toggle('open'); }

  function swPricingTab(name, btn) {
    document.querySelectorAll('.price-set').forEach(function(s) { s.classList.remove('active'); });
    document.querySelectorAll('.price-toggle-btn').forEach(function(b) { b.classList.remove('active'); });
    document.getElementById('sw-price-' + name).classList.add('active');
    btn.classList.add('active');
  }

  function swOpenCalendly() { swOpenCalendlyPopup(); }

  function swCloseTooltip() {
    var t = document.getElementById('samify-tooltip');
    if (t) { t.classList.remove('show'); setTimeout(function() { t.style.display = 'none'; }, 300); }
  }

  function swOpenFromTooltip() {
    swCloseTooltip();
    document.getElementById('samify-widget').classList.add('visible');
    document.getElementById('samify-launcher').classList.add('open');
  }

  setTimeout(function() {
    var t = document.getElementById('samify-tooltip');
    if (t) t.classList.add('show');
  }, 400);

  window.swToggle = swToggle;
  window.swGoHome = swGoHome;
  window.swNav = swNav;
  window.swFaq = swFaq;
  window.swPricingTab = swPricingTab;
  window.swOpenCalendly = swOpenCalendly;
  window.swOpenCalendlyPopup = swOpenCalendlyPopup;
  window.swCloseTooltip = swCloseTooltip;
  window.swOpenFromTooltip = swOpenFromTooltip;
})();
