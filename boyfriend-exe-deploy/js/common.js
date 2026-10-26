// Shared helpers: starfield, typewriter, scene switching, hearts, image fallback.
export const $ = (s, r = document) => r.querySelector(s);
// Site base: '/' at a domain root, '/repo/' on GitHub project pages.
const BASE = location.pathname.replace(/(memories|hotline|final)(\/(index\.html)?)?$/, '').replace(/index\.html$/, '');
export const u = (p) => (p ? BASE + p.replace(/^\//, '') : p);
export const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const sleep = (ms) => new Promise((r) => setTimeout(r, reduced ? 0 : ms));

// Typewriter. Tapping `skipEl` finishes the line instantly.
export async function type(el, text, speed = 34) {
  el.textContent = '';
  if (reduced) { el.textContent = text; return; }
  for (const ch of text) { el.textContent += ch; await sleep(speed); }
}

// Fade one <section class="scene"> out and the next in.
let current = null;
export async function show(id) {
  const next = document.getElementById(id);
  if (current) { current.classList.remove('in'); await sleep(450); current.hidden = true; }
  next.hidden = false;
  void next.offsetWidth;
  next.classList.add('in');
  current = next;
  next.querySelector('h1,h2,[tabindex="-1"]')?.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

// Twinkling starfield + a few drifting glow particles on #sky.
export function sky() {
  const cv = $('#sky'); if (!cv) return;
  const ctx = cv.getContext('2d');
  let w, h, stars, dust, raf;
  const col = ['255,179,209', '201,168,255', '255,217,138'];
  const setup = () => {
    const d = Math.min(devicePixelRatio || 1, 2);
    w = cv.width = innerWidth * d; h = cv.height = innerHeight * d; cv.getContext('2d').setTransform(1, 0, 0, 1, 0, 0);
    const n = Math.round((innerWidth * innerHeight) / 5500);
    stars = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, r: (0.4 + Math.random() * 1.3) * d, p: Math.random() * 6.28, s: 0.4 + Math.random() * 1.2 }));
    dust = Array.from({ length: 18 }, () => ({ x: Math.random() * w, y: Math.random() * h, r: (2 + Math.random() * 5) * d, v: (0.08 + Math.random() * 0.2) * d, c: col[(Math.random() * 3) | 0] }));
  };
  const draw = (t) => {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      ctx.globalAlpha = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(t / 1000 * s.s + s.p));
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.28); ctx.fill();
    }
    for (const p of dust) {
      p.y -= p.v; if (p.y < -20) { p.y = h + 20; p.x = Math.random() * w; }
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
      g.addColorStop(0, `rgba(${p.c},.35)`); g.addColorStop(1, `rgba(${p.c},0)`);
      ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3, 0, 6.28); ctx.fill();
    }
    if (!reduced) raf = requestAnimationFrame(draw);
  };
  setup(); draw(0);
  addEventListener('resize', () => { setup(); if (reduced) draw(0); });
  document.addEventListener('visibilitychange', () => { cancelAnimationFrame(raf); if (!document.hidden && !reduced) raf = requestAnimationFrame(draw); });
}

// Sparse floating hearts / confetti pieces appended to `host`.
export function floaters(host, { n = 8, glyph = '💗', cls = 'heart' } = {}) {
  if (reduced) return;
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span');
    s.className = cls; s.setAttribute('aria-hidden', 'true');
    s.textContent = glyph;
    s.style.cssText = `left:${Math.random() * 100}%;font-size:${12 + Math.random() * 16}px;animation-duration:${9 + Math.random() * 9}s;animation-delay:${-Math.random() * 14}s`;
    host.append(s);
  }
}
export function confetti(host, n = 28) {
  if (reduced) return;
  const cols = ['#ffb3d1', '#c9a8ff', '#ffd98a', '#8fb4ff'];
  for (let i = 0; i < n; i++) {
    const s = document.createElement('i');
    s.className = 'confetti'; s.setAttribute('aria-hidden', 'true');
    s.style.cssText = `left:${Math.random() * 100}%;background:${cols[i % 4]};animation-duration:${8 + Math.random() * 8}s;animation-delay:${-Math.random() * 12}s`;
    host.append(s);
  }
}

// Hide a broken image; optionally mark its container.
export function fallback(img, onFail) {
  img.addEventListener('error', () => { img.hidden = true; onFail?.(); }, { once: true });
}

// Optional background music: off until he taps the button. Never autoplays.
export function music(cfg) {
  if (!cfg.src) return;
  const a = new Audio(cfg.src); a.loop = true; a.volume = cfg.volume;
  const b = document.createElement('button');
  b.className = 'music'; b.type = 'button'; b.textContent = '🎵'; b.setAttribute('aria-label', 'Turn background music on'); b.setAttribute('aria-pressed', 'false');
  b.onclick = async () => {
    const on = a.paused;
    try { on ? await a.play() : a.pause(); } catch { return; }
    b.setAttribute('aria-pressed', String(on)); b.setAttribute('aria-label', on ? 'Turn background music off' : 'Turn background music on'); b.classList.toggle('on', on);
  };
  document.body.append(b);
}
