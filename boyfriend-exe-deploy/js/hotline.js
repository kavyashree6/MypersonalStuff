import { config as C } from './config.js';
import { $, u, sky, floaters, fallback } from './common.js';

sky(); floaters(document.body, { n: 8 });
const H = C.hotline;
const her = $('#herArt'); fallback(her, () => her.parentElement.textContent = '💗'); her.src = u(C.art.her);
$('#viz').innerHTML = '<i></i>'.repeat(26);
document.querySelectorAll('#viz i').forEach((b, n) => (b.style.animationDelay = `${(n * 0.13) % 0.9}s`));

// Song button
const song = $('#song'), ok = /^https?:\/\//i.test(H.songUrl);
song.textContent = ok ? H.songLabel : 'Our song is coming soon 🎧';
if (ok) song.href = H.songUrl; else { song.removeAttribute('href'); song.removeAttribute('target'); song.setAttribute('aria-disabled', 'true'); }

// Audio: created paused; never autoplays. Preload metadata so a missing file is noticed early.
const a = new Audio(); a.preload = 'metadata';
const play = $('#play'), seek = $('#seek'), mm = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const missing = () => { $('#soon').hidden = false; $('#viz').hidden = true; document.querySelector('.prog').hidden = true; document.querySelector('.ctrl').hidden = true; };
a.addEventListener('error', missing);
a.src = u(H.audio);
const set = (on) => {
  play.textContent = on ? '❚❚' : '▶'; play.setAttribute('aria-label', on ? 'Pause voice message' : 'Play voice message');
  $('#ring').classList.toggle('playing', on); $('#player').classList.toggle('playing-viz', on);
};
const start = () => a.play().catch(missing);
play.onclick = () => (a.paused ? start() : a.pause());
$('#replay').onclick = () => { a.currentTime = 0; start(); };
a.addEventListener('play', () => set(true)); a.addEventListener('pause', () => set(false));
a.addEventListener('ended', () => set(false));
a.addEventListener('loadedmetadata', () => ($('#dur').textContent = mm(a.duration)));
a.addEventListener('timeupdate', () => { if (a.duration) { seek.value = (a.currentTime / a.duration) * 100; $('#cur').textContent = mm(a.currentTime); } });
seek.oninput = () => { if (a.duration) a.currentTime = (seek.value / 100) * a.duration; };
