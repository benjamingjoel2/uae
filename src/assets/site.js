// Barjeel Journeys — progressive enhancement only. The site works without this file.
(() => {
  const d = document, root = d.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header: solid after the hero, hides on scroll down, returns on scroll up.
  const hd = d.querySelector('.hd');
  const hero = d.querySelector('[data-hero]');
  let lastY = scrollY, ticking = false;
  const onScroll = () => {
    const y = scrollY;
    if (hd) {
      const limit = hero ? Math.max(40, hero.offsetHeight - hd.offsetHeight - 10) : 40;
      hd.classList.toggle('is-solid', y > limit);
      hd.classList.toggle('is-hidden', y > 300 && y > lastY + 4 && !d.body.classList.contains('menu-open'));
      if (y < lastY - 4) hd.classList.remove('is-hidden');
    }
    lastY = y; ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // Menu overlay with focus management.
  const mn = d.getElementById('menu');
  const openBtn = d.querySelector('[data-menu-open]');
  if (mn && openBtn) {
    const closeBtn = mn.querySelector('[data-menu-close]');
    const focusables = () => [...mn.querySelectorAll('a[href], button')];
    const open = () => {
      mn.classList.add('is-open'); mn.removeAttribute('inert'); mn.setAttribute('aria-hidden', 'false');
      d.body.classList.add('menu-open'); openBtn.setAttribute('aria-expanded', 'true');
      setTimeout(() => closeBtn && closeBtn.focus(), 50);
    };
    const close = () => {
      mn.classList.remove('is-open'); mn.setAttribute('inert', ''); mn.setAttribute('aria-hidden', 'true');
      d.body.classList.remove('menu-open'); openBtn.setAttribute('aria-expanded', 'false'); openBtn.focus();
    };
    openBtn.addEventListener('click', open);
    closeBtn && closeBtn.addEventListener('click', close);
    mn.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') {
        const f = focusables(); const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    // Swap menu image on hover over destinations.
    const mImg = mn.querySelector('.mn__img');
    mn.querySelectorAll('[data-img]').forEach((a) => a.addEventListener('mouseenter', () => {
      const tpl = d.getElementById('mi-' + a.dataset.img);
      if (mImg && tpl) mImg.innerHTML = tpl.innerHTML;
    }));
  }

  // Reveal on scroll.
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    d.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
  } else d.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'));

  // Carousels.
  d.querySelectorAll('[data-rail]').forEach((rail) => {
    const track = rail.querySelector('.rail__track');
    const bar = rail.querySelector('.rail__bar span');
    const step = () => (track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width + 24 : 300);
    rail.querySelector('[data-prev]')?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }));
    rail.querySelector('[data-next]')?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }));
    const upd = () => {
      const max = track.scrollWidth - track.clientWidth;
      const vis = track.clientWidth / track.scrollWidth;
      if (bar) { bar.style.width = Math.max(10, vis * 100) + '%'; bar.style.transform = `translateX(${max > 0 ? (track.scrollLeft / max) * ((1 - vis) / vis) * 100 : 0}%)`; }
    };
    track.addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
  });

  // Season planner: open on the current month unless one is chosen in the URL hash.
  const sp = d.querySelector('[data-season]');
  if (sp) {
    const m = /^#m(\d{1,2})$/.exec(location.hash);
    const idx = m ? Math.min(11, Math.max(0, +m[1] - 1)) : new Date().getMonth();
    const input = sp.querySelector(`#m${idx}`); if (input) input.checked = true;
    sp.addEventListener('change', (e) => { if (e.target.name === 'month') history.replaceState(null, '', '#m' + (+e.target.value + 1)); });
  }

  // Enquiry form: send in the background, fall back to a normal POST.
  const form = d.querySelector('[data-enquiry]');
  if (form && 'fetch' in window) {
    const ok = form.querySelector('.msg--ok'), err = form.querySelector('.msg--err');
    const btn = form.querySelector('[type=submit]');
    const q = new URLSearchParams(location.search).get('journey');
    if (q) { const f = form.querySelector('[name=journey]'); if (f) f.value = q; }
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      ok.classList.remove('is-on'); err.classList.remove('is-on');
      const name = form.elements.name, email = form.elements.email, consent = form.elements.consent;
      let msg = '';
      if (!name.value.trim() || !email.value.trim()) msg = form.dataset.errRequired;
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) msg = form.dataset.errEmail;
      else if (!consent.checked) msg = form.dataset.errConsent;
      if (msg) { err.textContent = msg; err.classList.add('is-on'); err.focus(); return; }
      const label = btn.textContent; btn.disabled = true; btn.textContent = form.dataset.sending;
      try {
        const data = new FormData(form);
        const interests = data.getAll('interests'); data.delete('interests'); data.set('interests', interests.join(', '));
        const res = await fetch(form.dataset.ajax, { method: 'POST', headers: { Accept: 'application/json' }, body: data });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || json.success === false || json.success === 'false') throw new Error(json.message || 'send failed');
        form.reset(); ok.classList.add('is-on'); ok.focus();
        setTimeout(() => { location.href = form.dataset.thanks; }, 1600);
      } catch (_) {
        err.textContent = form.dataset.errGeneric; err.classList.add('is-on'); err.focus();
      } finally { btn.disabled = false; btn.textContent = label; }
    });
  }
})();
