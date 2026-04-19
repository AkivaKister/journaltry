// ── Stock ticker ──────────────────────────────────────────────────────────────
// Symbols to display. Add/remove as desired.
const TICKER_SYMBOLS = [
  'SPY','QQQ','DIA',          // major indices
  'AAPL','MSFT','GOOGL','AMZN','NVDA','TSLA','META',  // megacap tech
  'JPM','GS','BAC',           // financials
  'BTC-USD','ETH-USD',        // crypto
  'GC=F','CL=F',              // gold, oil futures
];

// Fallback static data shown while/if fetch fails
const TICKER_FALLBACK = [
  {s:'SPY',  p:'534.21', c:'+1.23', pct:'+0.23%', up:true},
  {s:'QQQ',  p:'446.88', c:'+2.10', pct:'+0.47%', up:true},
  {s:'AAPL', p:'212.49', c:'-0.88', pct:'-0.41%', up:false},
  {s:'MSFT', p:'415.32', c:'+3.15', pct:'+0.76%', up:true},
  {s:'NVDA', p:'878.50', c:'+12.40',pct:'+1.43%', up:true},
  {s:'TSLA', p:'174.60', c:'-3.20', pct:'-1.80%', up:false},
  {s:'BTC-USD',p:'84200',c:'+1100',pct:'+1.32%',  up:true},
  {s:'GC=F', p:'3322.10',c:'+8.40',pct:'+0.25%', up:true},
];

function buildTickerHTML(quotes) {
  const items = quotes.map(q => {
    const color = q.up ? '#4ade80' : '#f87171';
    const arrow = q.up ? '▲' : '▼';
    return `<span class="tick-item">
      <span class="tick-sym">${q.s}</span>
      <span class="tick-price">${q.p}</span>
      <span class="tick-chg" style="color:${color}">${arrow} ${q.pct}</span>
    </span><span class="tick-sep">·</span>`;
  }).join('');
  // duplicate for seamless loop
  return `<div class="ticker-inner">${items}${items}</div>`;
}

async function fetchQuotes() {
  // Uses Yahoo Finance v8 (public, no key required).
  // Fetches each symbol; gracefully falls back on error.
  const symbols = TICKER_SYMBOLS.join(',');
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbols)}&fields=symbol,regularMarketPrice,regularMarketChange,regularMarketChangePercent`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error('bad response');
    const json = await res.json();
    const results = json?.quoteResponse?.result || [];
    if (!results.length) throw new Error('empty');
    return results.map(r => {
      const chg = r.regularMarketChange ?? 0;
      const pct = r.regularMarketChangePercent ?? 0;
      const up = chg >= 0;
      const price = r.regularMarketPrice?.toLocaleString('en-US', {maximumFractionDigits: 2}) ?? '—';
      const chgStr = (up ? '+' : '') + chg.toFixed(2);
      const pctStr = (up ? '+' : '') + pct.toFixed(2) + '%';
      return { s: r.symbol.replace('-USD','').replace('=F',' Futures'), p: price, c: chgStr, pct: pctStr, up };
    });
  } catch {
    return TICKER_FALLBACK;
  }
}

async function initStockTicker() {
  const bar = document.getElementById('stock-ticker-bar');
  if (!bar) return;
  const quotes = await fetchQuotes();
  bar.innerHTML = buildTickerHTML(quotes);
  // Kick off animation after content loads
  const inner = bar.querySelector('.ticker-inner');
  if (inner) {
    const totalW = inner.scrollWidth / 2;
    inner.style.setProperty('--ticker-w', totalW + 'px');
    inner.classList.add('ticker-running');
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
          <span class="masthead-date">April 2026</span>
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
