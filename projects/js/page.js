/**
 * page.js — shared logic for all project detail pages
 * Handles: cursor, navbar scroll, hamburger, hero reveal, orb parallax, carousel init
 */

/* ── CURSOR ── */
(function () {
  const cur = document.getElementById('cursor');
  const cf  = document.getElementById('cf');
  if (!cur || !cf) return;
  let mx = 0, my = 0, fx = 0, fy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function tick() {
    cur.style.transform = `translate(${mx}px,${my}px)`;
    fx += (mx - fx) * 0.12; fy += (my - fy) * 0.12;
    cf.style.transform = `translate(${fx}px,${fy}px)`;
    requestAnimationFrame(tick);
  })();
  document.querySelectorAll('a,button').forEach(el => {
    el.addEventListener('mouseenter', () => { cur.classList.add('ch'); cf.classList.add('ch'); });
    el.addEventListener('mouseleave', () => { cur.classList.remove('ch'); cf.classList.remove('ch'); });
  });
})();

/* ── NAVBAR SCROLL ── */
window.addEventListener('scroll', () =>
  document.getElementById('navbar').classList.toggle('scrolled', scrollY > 60)
);

/* ── HAMBURGER ── */
(function () {
  const ham = document.getElementById('ham');
  const mob = document.getElementById('mob');
  if (!ham || !mob) return;
  ham.addEventListener('click', () => { ham.classList.toggle('open'); mob.classList.toggle('open'); });
  mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    ham.classList.remove('open'); mob.classList.remove('open');
  }));
})();

/* ── HERO REVEAL ── */
window.addEventListener('load', () => {
  document.querySelectorAll('.reveal-up').forEach(el => {
    setTimeout(() => el.classList.add('visible'), parseInt(el.style.getPropertyValue('--d')) || 0);
  });
});

/* ── ORB PARALLAX ── */
document.addEventListener('mousemove', e => {
  const px = (e.clientX / window.innerWidth  - 0.5) * 40;
  const py = (e.clientY / window.innerHeight - 0.5) * 40;
  document.querySelectorAll('.orb').forEach((o, i) => {
    const m = (i + 1) * 0.35;
    o.style.transform = `translate(${px * m}px,${py * m}px)`;
  });
});

/* ── CAROUSEL ── */
(function () {
  const track    = document.getElementById('track');
  const dotsWrap = document.getElementById('dots');
  const prevBtn  = document.getElementById('prev');
  const nextBtn  = document.getElementById('next');
  if (!track || !dotsWrap) return;

  const slides    = Array.from(track.children);
  const SLIDE_TIME = 18000;
  let idx = 0, interval;

  slides.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'cdot' + (i === 0 ? ' active' : '');
    d.innerHTML = '<span class="cdot-fill"></span>';
    dotsWrap.appendChild(d);
    d.addEventListener('click', () => { idx = i; reset(); update(); });
  });
  const cdots = Array.from(dotsWrap.children);

  function updateDots() {
    cdots.forEach((d, i) => {
      d.classList.toggle('active', i === idx);
      const f = d.querySelector('.cdot-fill');
      f.style.transition = 'none'; f.style.width = '0%';
      if (i === idx) requestAnimationFrame(() => {
        f.style.transition = `width ${SLIDE_TIME}ms linear`; f.style.width = '100%';
      });
    });
  }

  function updateVideos() {
    slides.forEach((s, i) => {
      const v = s.querySelector('video');
      if (!v) return;
      if (i === idx) { v.currentTime = 0; v.play().catch(() => {}); }
      else           { v.pause(); v.currentTime = 0; }
    });
  }

  function update() {
    track.style.transform = `translateX(-${idx * 100}%)`;
    updateDots(); updateVideos();
  }
  function next()  { idx = (idx + 1) % slides.length; update(); }
  function start() { interval = setInterval(next, SLIDE_TIME); }
  function reset() { clearInterval(interval); start(); }

  if (nextBtn) nextBtn.addEventListener('click', () => { reset(); next(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { reset(); idx = (idx - 1 + slides.length) % slides.length; update(); });

  update(); start();
})();

/* ── SCROLL TO TOP ── */
(function () {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', scrollY >= 400));
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();