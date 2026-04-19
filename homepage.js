// ─────────────────────────────────────────────────────────────────────────────
// homepage.js
// Reads articles.json and renders the entire homepage dynamically.
//
// To update the front page: edit articles.json only.
//   - Change "hero": true on the article you want as the lead story
//   - Change "featured": true on articles you want in the hero stack / feature band
//   - Add new entries at the TOP of the array (newest first)
//   - The homepage auto-sorts by date and picks the right articles per section
// ─────────────────────────────────────────────────────────────────────────────

const SECTION_META = {
  opinions:    { label: 'Opinions',        badge: 'badge-opinions',   path: 'sections/opinions/index.html' },
  'pop-culture':{ label: 'Pop Culture',    badge: 'badge-popculture', path: 'sections/pop-culture/index.html' },
  community:   { label: 'Community',       badge: 'badge-community',  path: 'sections/community/index.html' },
  israel:      { label: 'Israel',          badge: 'badge-israel',     path: 'sections/israel/index.html' },
  business:    { label: 'Business',        badge: 'badge-business',   path: 'sections/business/index.html' },
  markets:     { label: 'Markets & Finance', badge: 'badge-markets',  path: 'sections/markets/index.html' },
};

// ── Formatting helpers ────────────────────────────────────────────────────────
function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function badge(section) {
  const m = SECTION_META[section];
  return m ? `<div class="badge ${m.badge}">${m.label}</div>` : '';
}

function metaLine(a) {
  return `${a.author} · ${fmtDate(a.date)}`;
}

// ── Block builders ────────────────────────────────────────────────────────────

function heroLead(a) {
  return `
  <article class="hero-lead">
    <a href="articles/${a.file}">
      <div class="hero-img-wrap">
        <img src="${a.img}" alt="${a.title}" loading="eager" />
        <div class="hero-overlay">
          ${badge(a.section)}
          <h1>${a.title}</h1>
          <p>${a.dek}</p>
          <span class="hero-byline">${metaLine(a)}</span>
        </div>
      </div>
    </a>
  </article>`;
}

function heroStackItem(a) {
  const m = SECTION_META[a.section];
  return `
  <article class="hero-stack-item">
    <a href="articles/${a.file}">
      <img src="${a.img}" alt="${a.title}" loading="lazy" />
      <div class="stack-text">
        ${badge(a.section)}
        <h2>${a.title}</h2>
        <p>${a.dek}</p>
      </div>
    </a>
  </article>`;
}

function mostReadList(articles) {
  // Top 5 most recent featured articles
  const items = articles.slice(0, 5).map(a =>
    `<li><a href="articles/${a.file}">${a.title}</a></li>`
  ).join('');
  return `<ol class="most-read-list">${items}</ol>`;
}

function sidebar(articles) {
  return `
  <aside class="hero-sidebar">
    <div class="sidebar-section">
      <h3 class="sidebar-heading">Most Read</h3>
      ${mostReadList(articles)}
    </div>
    <div class="sidebar-divider"></div>
    <div class="sidebar-section">
      <h3 class="sidebar-heading">Browse Sections</h3>
      <ul class="sections-list">
        <li><a href="sections/opinions/index.html"><span class="section-pill pill-opinions">Opinions</span></a></li>
        <li><a href="sections/pop-culture/index.html"><span class="section-pill pill-popculture">Pop Culture</span></a></li>
        <li><a href="sections/community/index.html"><span class="section-pill pill-community">Community</span></a></li>
        <li><a href="sections/israel/index.html"><span class="section-pill pill-israel">Israel</span></a></li>
        <li><a href="sections/business/index.html"><span class="section-pill pill-business">Business</span></a></li>
        <li><a href="sections/markets/index.html"><span class="section-pill pill-markets">Markets &amp; Finance</span></a></li>
      </ul>
    </div>
    <div class="sidebar-divider"></div>
    <div class="newsletter-box">
      <h4>Get The Briefing</h4>
      <p>Sharp takes on markets, policy &amp; power — written by students.</p>
      <form>
        <input type="email" placeholder="your@email.com" />
        <button type="submit">Join Free</button>
      </form>
    </div>
  </aside>`;
}

function stripCard(a, isLead = false) {
  const cls = isLead ? 'strip-card lead-card' : 'strip-card';
  return `
  <article class="${cls}">
    <a href="articles/${a.file}">
      <img src="${a.img}" alt="${a.title}" loading="lazy" />
      <h3>${a.title}</h3>
      ${isLead ? `<p>${a.dek}</p>` : ''}
      <span class="card-meta">${metaLine(a)}</span>
    </a>
  </article>`;
}

function sectionStrip(section, articles, gridClass) {
  const m = SECTION_META[section];
  if (!m || !articles.length) return '';
  const [lead, ...rest] = articles;
  const cards = stripCard(lead, true) + rest.map(a => stripCard(a, false)).join('');
  return `
  <section class="content-strip">
    <div class="strip-header">
      <h2><a href="${m.path}">${m.label}</a></h2>
      <a href="${m.path}" class="see-all">See all →</a>
    </div>
    <div class="${gridClass}">
      ${cards}
    </div>
  </section>`;
}

function listItem(a) {
  return `
  <article class="list-item">
    <a href="articles/${a.file}">
      <img src="${a.img}" alt="${a.title}" loading="lazy" />
      <div>
        <h3>${a.title}</h3>
        <span class="card-meta">${metaLine(a)}</span>
      </div>
    </a>
  </article>`;
}

function listStrip(section, articles) {
  const m = SECTION_META[section];
  if (!m || !articles.length) return '';
  return `
  <section class="content-strip">
    <div class="strip-header">
      <h2><a href="${m.path}">${m.label}</a></h2>
      <a href="${m.path}" class="see-all">See all →</a>
    </div>
    <div class="list-stack">
      ${articles.map(listItem).join('')}
    </div>
  </section>`;
}

function featureCard(a) {
  return `
  <article class="feature-card">
    <a href="articles/${a.file}">
      <div class="feature-img-wrap">
        <img src="${a.img}" alt="${a.title}" loading="lazy" />
        <div class="feature-overlay">
          ${badge(a.section)}
          <h2>${a.title}</h2>
          <p>${a.dek}</p>
          <span class="card-meta">${metaLine(a)}</span>
        </div>
      </div>
    </a>
  </article>`;
}

function missionBand() {
  return `
  <section class="mission-band">
    <p class="mission-quote">"The world moves fast. Ideas are filtered, flattened, and fed back to us in fragments: clever but hollow, viral but void of thought."</p>
    <p class="mission-body">The Advantage Journal exists to push back. A student-led publication with contributors across eight countries and four continents.</p>
    <a href="faq/index.html" class="mission-cta">Learn More →</a>
  </section>`;
}

// ── Main render function ──────────────────────────────────────────────────────
async function renderHomepage(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let data;
  try {
    const res = await fetch('articles.json');
    data = await res.json();
  } catch (e) {
    container.innerHTML = '<p style="padding:2rem;color:#7a7068">Could not load articles. Make sure you\'re running on a server or GitHub Pages (not opened as a local file).</p>';
    return;
  }

  // Sort all articles newest-first
  const all = [...data.articles].sort((a, b) => new Date(b.date) - new Date(a.date));

  // ── Slot articles into roles ──────────────────────────────────────────────

  // Hero lead: first article with hero:true, or just the newest
  const heroArticle = all.find(a => a.hero) || all[0];

  // Hero stack: next 3 featured articles that aren't the hero lead
  const heroStack = all
    .filter(a => a.featured && a.file !== heroArticle.file)
    .slice(0, 3);

  // Most read sidebar: 5 most recent (excluding hero)
  const mostRead = all.filter(a => a.file !== heroArticle.file).slice(0, 5);

  // Section strips: latest N articles per section (excluding anything already used above)
  const usedFiles = new Set([heroArticle.file, ...heroStack.map(a => a.file)]);

  function bySection(section, limit) {
    return all.filter(a => a.section === section && !usedFiles.has(a.file)).slice(0, limit);
  }

  const popCulture  = bySection('pop-culture', 4);
  const business    = bySection('business', 3);
  const markets     = bySection('markets', 3);
  const opinions    = bySection('opinions', 3);

  // Feature band: 2 featured articles from israel/community not yet used
  const featureBand = all
    .filter(a => ['israel','community'].includes(a.section) && !usedFiles.has(a.file))
    .slice(0, 2);

  // ── Build HTML ────────────────────────────────────────────────────────────
  let html = '';

  // Hero grid
  html += `<section class="hero-grid">
    ${heroLead(heroArticle)}
    <div class="hero-stack">${heroStack.map(heroStackItem).join('')}</div>
    ${sidebar(mostRead)}
  </section>`;

  // Pop Culture strip (4-col)
  if (popCulture.length) html += sectionStrip('pop-culture', popCulture, 'strip-grid-4');

  // Business + Markets dual strip
  if (business.length || markets.length) {
    html += `<div class="dual-strip">
      ${listStrip('business', business)}
      ${listStrip('markets', markets)}
    </div>`;
  }

  // Feature band
  if (featureBand.length) {
    html += `<section class="feature-band">${featureBand.map(featureCard).join('')}</section>`;
  }

  // Opinions strip (3-col)
  if (opinions.length) html += sectionStrip('opinions', opinions, 'strip-grid-3');

  // Mission
  html += missionBand();

  container.innerHTML = html;

  // Re-run newsletter handler for newly rendered forms
  document.querySelectorAll('.newsletter-box form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn   = form.querySelector('button');
      if (input && input.value) {
        btn.textContent = 'Thanks! ✓';
        btn.style.background = '#15803d';
        input.value = '';
        input.disabled = true;
        btn.disabled = true;
      }
    });
  });
}
