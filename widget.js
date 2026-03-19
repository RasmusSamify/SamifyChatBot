(function() {
  if (document.getElementById('samify-widget-container')) return; // prevent double-load

  // Fonts
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Montserrat:wght@500;700&display=swap';
  document.head.appendChild(link);

  // CSS
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

  body { font-family: 'DM Sans', sans-serif; background: #e8eaf0; display: flex; align-items: flex-end; justify-content: flex-end; min-height: 100vh; padding: 24px; }

  /* LAUNCHER */
  #launcher {
    position: fixed; bottom: 24px; right: 24px;
    width: 56px; height: 56px; border-radius: 50%;
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

  /* FOOTER */
  .w-footer { padding: 8px 14px; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .w-footer a { font-size: 10.5px; color: #111; text-decoration: none; display: flex; align-items: center; gap: 5px; transition: opacity 0.15s; font-family: 'Montserrat', sans-serif; font-weight: 700; letter-spacing: 0.02em; }
  .w-footer a:hover { opacity: 0.7; }
  .purple-dot { width: 7px; height: 7px; border-radius: 50%; background: #7c3aed; display: inline-block; flex-shrink: 0; }`;
  document.head.appendChild(style);

  // HTML
  var wrap = document.createElement('div');
  wrap.id = 'samify-widget-container';
  wrap.innerHTML = `<button id="launcher" onclick="toggleWidget()" aria-label="Öppna support">
  <svg class="chat-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  <svg class="close-icon" style="display:none" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
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
    <div id="panel-chat" class="tab-panel active">`;
  document.body.appendChild(wrap);

  // JS
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

  // Auto-open for demo
  setTimeout(() => {
    document.getElementById('widget').classList.add('visible');
    document.getElementById('launcher').classList.add('open');
  }, 400);

  setTimeout(function() {
    if (typeof updateTabArrows === 'function') updateTabArrows();
  }, 300);
})();
