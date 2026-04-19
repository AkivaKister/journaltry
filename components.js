// Call as: renderHeader(root) where root = '../' or '../../' etc.
function renderHeader(root) {
  root = root || '';
  document.getElementById('site-header').innerHTML = `
    <div class="ticker-bar">
      <span class="ticker-label">Latest</span>
      <div class="ticker-track">
        <span>Bitcoin's volatile spring &nbsp;·&nbsp; MLB money gap debate &nbsp;·&nbsp; Israel's tech sector leads global innovation &nbsp;·&nbsp; Hersh's Fridge opens in Chicago &nbsp;·&nbsp; National debt hits new milestone &nbsp;·&nbsp; AI tutors reshape the classroom &nbsp;·&nbsp; Think Sweet: values over profit &nbsp;·&nbsp;</span>
        <span aria-hidden="true">Bitcoin's volatile spring &nbsp;·&nbsp; MLB money gap debate &nbsp;·&nbsp; Israel's tech sector leads global innovation &nbsp;·&nbsp; Hersh's Fridge opens in Chicago &nbsp;·&nbsp; National debt hits new milestone &nbsp;·&nbsp; AI tutors reshape the classroom &nbsp;·&nbsp; Think Sweet: values over profit &nbsp;·&nbsp;</span>
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
