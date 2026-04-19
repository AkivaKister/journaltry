// Active nav link
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  document.querySelectorAll('.main-nav a').forEach(a => {
    if (a.getAttribute('href') && path.includes(a.getAttribute('href').replace('/journaltry','')) && a.getAttribute('href') !== '/journaltry/') {
      a.classList.add('active');
    }
    if (path === '/journaltry/' || path === '/journaltry/index.html') {
      document.querySelector('.main-nav a[href="/journaltry/"]')?.classList.add('active');
    }
  });

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (btn) {
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    }
  });

  // Newsletter forms
  document.querySelectorAll('.newsletter-box form, .newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn = form.querySelector('button');
      if (input && input.value) {
        btn.textContent = 'Thanks! ✓';
        btn.style.background = '#15803d';
        input.value = '';
        input.disabled = true;
        btn.disabled = true;
      }
    });
  });
});
