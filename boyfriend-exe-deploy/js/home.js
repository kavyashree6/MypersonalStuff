import { config as C } from './config.js';
import { $, u, sleep, type, show, sky, floaters, fallback, music, reduced } from './common.js';

sky(); floaters(document.body, { n: 6 }); music(C.music);

const BOOT = ['SYSTEM BOOTING…', 'Boyfriend detected. Birthday mode activated.', 'Warning: excessive cuteness ahead.', 'Do you wish to continue?'];
const art = (k) => u(C.art[k]);

async function boot() {
  await show('boot');
  const ps = [...document.querySelectorAll('#term p')];
  for (let i = 0; i < BOOT.length; i++) {
    ps[i].classList.add('cur');
    await type(ps[i], BOOT[i], 32);
    ps[i].classList.remove('cur');
    await sleep(350);
  }
  $('#bootBtns').hidden = false; $('#bootBtns').classList.add('fade-up');
  $('#yes').focus({ preventScroll: true });
}

$('#yes').onclick = toTitle;
$('#fine').onclick = toTitle;
$('#what').onclick = () => { $('#bootBtns').hidden = true; $('#nope').hidden = false; $('#nope').classList.add('fade-up'); $('#fine').focus(); };

function toTitle() {
  $('#tTitle').textContent = C.title; $('#tSub').textContent = C.subtitle; $('#tStatus').textContent = C.missionStatus;
  const i = $('#titleArt'); fallback(i); i.src = art('portrait');
  show('title');
}

$('#toProfile').onclick = () => {
  $('#himName').textContent = (C.him.name || 'SUBJECT: THE BIRTHDAY BOY').toUpperCase() + (C.birthdayDate ? ` · ${new Date(C.birthdayDate + 'T00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'long' })}` : '');
  const a = $('#himArt'); fallback(a, () => a.parentElement.textContent = '💗'); a.src = art('him');
  $('#stats').innerHTML = C.stats.map((s) => `<div class="stat"><div class="top"><b>${s.label}</b><span>${s.note} <span class="pct" data-v="${s.value}">0%</span></span></div><div class="bar"><i data-v="${s.value}"></i></div></div>`).join('');
  $('#jokes').innerHTML = C.insideJokes.map((j) => `<li></li>`).join('');
  [...$('#jokes').children].forEach((li, i) => (li.textContent = C.insideJokes[i]));
  show('profile').then(animateStats);
};

async function animateStats() {
  await sleep(500);
  document.querySelectorAll('.bar i').forEach((b) => (b.style.width = b.dataset.v + '%'));
  document.querySelectorAll('.pct').forEach((p) => {
    const to = +p.dataset.v; if (reduced) return void (p.textContent = to + '%');
    const t0 = performance.now();
    const tick = (t) => { const k = Math.min((t - t0) / 1600, 1); p.textContent = Math.round(to * (1 - (1 - k) ** 3)) + '%'; if (k < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
}

let slide = 0;
function reel() {
  const f = $('#frame'), r = C.reel;
  f.innerHTML = r.map((s) => `<img alt="" data-k="${s.art}">`).join('');
  f.querySelectorAll('img').forEach((i) => { fallback(i); i.src = art(i.dataset.k); });
  $('#dots').innerHTML = r.map(() => '<i></i>').join('');
  show('reel'); paint();
}
function paint() {
  const r = C.reel;
  [...$('#frame').children].forEach((i, n) => i.classList.toggle('on', n === slide));
  [...$('#dots').children].forEach((d, n) => d.classList.toggle('on', n === slide));
  $('#cap').textContent = r[slide].caption;
  $('#next').textContent = slide === r.length - 1 ? 'Case closed →' : 'Next exhibit →';
}
$('#toReel').onclick = reel;
$('#next').onclick = () => { if (slide < C.reel.length - 1) { slide++; paint(); } else show('outro'); };

boot();
