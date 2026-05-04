// ── Stock ticker ──────────────────────────────────────────────────────────────
// Symbols to display. Add/remove as desired.
const TICKER_SYMBOLS = [
  'SPY','QQQ','DIA',
  'AAPL','MSFT','GOOGL','AMZN','NVDA','TSLA','META',
  'JPM','GS','BAC',
  'BTC-USD','ETH-USD',
  'GC=F','CL=F',
];

// Shown immediately on every load — replaced with live data if fetch succeeds
const TICKER_FALLBACK = [
  {s:'SPY',   p:'534.21',  pct:'+0.23%', up:true},
  {s:'QQQ',   p:'446.88',  pct:'+0.47%', up:true},
  {s:'DIA',   p:'397.55',  pct:'+0.18%', up:true},
  {s:'AAPL',  p:'212.49',  pct:'-0.41%', up:false},
  {s:'MSFT',  p:'415.32',  pct:'+0.76%', up:true},
  {s:'GOOGL', p:'163.20',  pct:'+0.55%', up:true},
  {s:'NVDA',  p:'878.50',  pct:'+1.43%', up:true},
  {s:'TSLA',  p:'174.60',  pct:'-1.80%', up:false},
  {s:'META',  p:'512.30',  pct:'+0.92%', up:true},
  {s:'JPM',   p:'198.44',  pct:'+0.33%', up:true},
  {s:'BTC',   p:'84,200',  pct:'+1.32%', up:true},
  {s:'ETH',   p:'3,210',   pct:'-0.65%', up:false},
  {s:'GOLD',  p:'3,322',   pct:'+0.25%', up:true},
  {s:'OIL',   p:'82.40',   pct:'-0.88%', up:false},
];

function buildTickerItems(quotes) {
  return quotes.map(q => {
    const color = q.up ? '#4ade80' : '#f87171';
    const arrow = q.up ? '▲' : '▼';
    return `<span class="tick-item"><span class="tick-sym">${q.s}</span><span class="tick-price">${q.p}</span><span class="tick-chg" style="color:${color}">${arrow}&nbsp;${q.pct}</span></span><span class="tick-sep">·</span>`;
  }).join('');
}

function setTickerContent(quotes) {
  const bar = document.getElementById('stock-ticker-bar');
  if (!bar) return;
  // Build items, duplicated for seamless infinite loop
  const items = buildTickerItems(quotes);
  bar.innerHTML = `<div class="ticker-inner" id="ticker-inner">${items}${items}</div>`;
  // Start animation after a short delay so the browser has painted the content
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const inner = document.getElementById('ticker-inner');
      if (!inner) return;
      // Use scrollWidth/2 as the translate distance (one full copy)
      const w = inner.scrollWidth / 2;
      inner.style.setProperty('--ticker-w', w + 'px');
      inner.classList.add('ticker-running');
    });
  });
}

async function fetchQuotes() {
  const symbols = TICKER_SYMBOLS.join(',');
  // corsproxy.io wraps the Yahoo Finance request to bypass browser CORS restrictions
  const yf = `https://query1.finance.yahoo.com/v8/finance/spark?symbols=${encodeURIComponent(symbols)}&range=1d&interval=1d`;
  const proxied = `https://corsproxy.io/?${encodeURIComponent(yf)}`;
  try {
    const res = await fetch(proxied, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error('bad status');
    const json = await res.json();
    const spark = json?.spark?.result || [];
    if (!spark.length) throw new Error('empty');
    return spark.map(r => {
      const sym   = r.symbol || '';
      const resp  = r.response?.[0] || {};
      const meta  = resp.meta || {};
      const price = meta.regularMarketPrice ?? 0;
      const prev  = meta.chartPreviousClose ?? price;
      const chg   = price - prev;
      const pct   = prev ? (chg / prev) * 100 : 0;
      const up    = chg >= 0;
      const label = sym.replace('-USD','').replace('=F','');
      const priceStr = price >= 1000
        ? price.toLocaleString('en-US', {maximumFractionDigits: 0})
        : price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
      const pctStr = (up ? '+' : '') + pct.toFixed(2) + '%';
      return { s: label, p: priceStr, pct: pctStr, up };
    }).filter(q => q.p !== '0.00');
  } catch {
    return null; // signal that fallback should stay
  }
}

async function initStockTicker() {
  // Show fallback immediately so ticker is never blank
  setTickerContent(TICKER_FALLBACK);
  // Then try to fetch live data and swap it in
  const live = await fetchQuotes();
  if (live && live.length) {
    setTickerContent(live);
  }
}

// Call as: renderHeader(root) where root = '../' or '../../' etc.
function renderHeader(root) {
  root = root || '';
  document.getElementById('site-header').innerHTML = `
    <div class="ticker-bar">
      <span class="ticker-label">Markets</span>
      <div id="stock-ticker-bar" class="stock-ticker-wrap">
        <div class="ticker-inner ticker-running">
          <!-- populated by initStockTicker() -->
          <span class="tick-item"><span class="tick-sym">Loading…</span></span>
        </div>
      </div>
    </div>
    <header class="site-header">
      <div class="masthead">
        <div class="masthead-meta">
          <span>Student-Led · Global Finance &amp; Ideas</span>
          <span class="masthead-date">May 2026</span>
        </div>
        <a href="${root}index.html" style="text-decoration:none">
          <div class="masthead-logo">
            <span class="logo-the">The</span>
            <span class="logo-advantage">Advantage</span>
            <span class="logo-journal">Journal</span>
          </div>
        </a>
        <div class="masthead-tagline">Eight Countries. Four Continents. One Publication.</div>
      </div>
      <nav class="main-nav">
        <a href="${root}index.html">Home</a>
        <a href="${root}sections/opinions/index.html">Opinions</a>
        <a href="${root}sections/pop-culture/index.html">Pop Culture</a>
        <a href="${root}sections/community/index.html">Community</a>
        <a href="${root}sections/israel/index.html">Israel</a>
        <a href="${root}sections/business/index.html">Business</a>
        <a href="${root}sections/markets/index.html">Markets &amp; Finance</a>
        <a href="${root}team/index.html">Team</a>
        <a href="${root}contact/index.html">Contact</a>
        <a href="${root}faq/index.html">FAQ</a>
      </nav>
    </header>
  `;
  // Fetch live quotes after header is in the DOM
  initStockTicker();
}

function renderFooter(root) {
  root = root || '';
  document.getElementById('site-footer').innerHTML = `
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <a href="${root}index.html" class="footer-logo">The Advantage Journal</a>
          <p>Student-run · Registered LLC</p>
          <p>Eight countries · Four continents</p>
          <p style="margin-top:0.5rem"><a href="mailto:theadvantagejournal@gmail.com">theadvantagejournal@gmail.com</a></p>
        </div>
        <div>
          <h4>Sections</h4>
          <ul>
            <li><a href="${root}sections/opinions/index.html">Opinions</a></li>
            <li><a href="${root}sections/pop-culture/index.html">Pop Culture</a></li>
            <li><a href="${root}sections/community/index.html">Community</a></li>
            <li><a href="${root}sections/israel/index.html">Israel</a></li>
            <li><a href="${root}sections/business/index.html">Business</a></li>
            <li><a href="${root}sections/markets/index.html">Markets &amp; Finance</a></li>
          </ul>
        </div>
        <div>
          <h4>About</h4>
          <ul>
            <li><a href="${root}team/index.html">Our Team</a></li>
            <li><a href="${root}contact/index.html">Contact Us</a></li>
            <li><a href="${root}faq/index.html">FAQ</a></li>
            <li><a href="https://forms.gle/k3ystKfRZ3frm2xT7" target="_blank">Write for Us</a></li>
          </ul>
        </div>
        <div>
          <h4>Stay Updated</h4>
          <div class="newsletter-box newsletter-form" style="padding:0;background:none">
            <form class="newsletter-form" style="margin-top:0">
              <input type="email" placeholder="your@email.com" style="border-color:rgba(255,255,255,0.2);margin-bottom:0.4rem" />
              <button type="submit">Join Free</button>
            </form>
          </div>
        </div>
      </div>
      <div class="footer-legal">
        © The Advantage Journal. Educational and informational only. Nothing herein constitutes financial, investment, legal, or tax advice. The Advantage Journal is a student-run publication and a registered LLC.
      </div>
    </footer>
  `;
}
