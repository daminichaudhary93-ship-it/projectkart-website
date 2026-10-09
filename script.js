(() => {
  const WHATSAPP_NUMBER = '918178738277';
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');
  const form = document.getElementById('orderForm');
  const serviceSelect = document.getElementById('serviceSelect');
  const feedback = document.getElementById('formFeedback');
  const deadlineInput = document.getElementById('deadlineInput');

  // Set the minimum selectable date to today, using the visitor's local date.
  if (deadlineInput) {
    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    deadlineInput.min = localDate;
  }

  const closeMenu = () => {
    primaryNav?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    navToggle?.setAttribute('aria-label', 'Open navigation menu');
  };

  navToggle?.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  });

  primaryNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  document.querySelectorAll('.choose-service').forEach((button) => {
    button.addEventListener('click', () => {
      const requestedService = button.dataset.service;
      if (serviceSelect && requestedService) serviceSelect.value = requestedService;
      document.getElementById('order')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(() => serviceSelect?.focus({ preventScroll: true }), 450);
    });
  });

  // Highlight the navigation item whose section is currently in view.
  const navLinks = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));
  const sections = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: '-28% 0px -60% 0px', threshold: 0 });
    sections.forEach((section) => observer.observe(section));
  }

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const details = [
      'Hello ProjectKart, I would like to enquire about a project/assignment.',
      '',
      `Name: ${String(data.get('name') || '').trim()}`,
      `My mobile number: ${String(data.get('mobile') || '').trim()}`,
      `Service: ${String(data.get('service') || '').trim()}`,
      `Class / course: ${String(data.get('classCourse') || 'Not specified').trim() || 'Not specified'}`,
      `Submission date: ${String(data.get('deadline') || 'Not specified').trim() || 'Not specified'}`,
      `Topic & requirements: ${String(data.get('details') || '').trim()}`,
      `Preferred collection: ${String(data.get('delivery') || 'Pickup')}`,
      '',
      'Please confirm the price, expected completion date and availability before starting. Thank you.'
    ].join('\n');

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(details)}`;
    feedback.textContent = 'Your enquiry is ready. WhatsApp will open in a new tab; please review and send the message there.';
    feedback.style.display = 'block';
    const popup = window.open(whatsappUrl, '_blank');
    if (popup) popup.opener = null;
    if (!popup) {
      feedback.textContent = 'Your enquiry is ready, but the browser blocked the new tab. Open WhatsApp using the green contact buttons and send your details there.';
    }
  });

  const year = document.getElementById('currentYear');
  if (year) year.textContent = String(new Date().getFullYear());
})();
