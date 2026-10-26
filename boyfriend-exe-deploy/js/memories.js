import { config as C } from './config.js';
import { $, u, sky, floaters, fallback } from './common.js';

sky(); floaters(document.body, { n: 10 });
$('#nextLink').href = u(C.nextAfterMemories);

const list = C.memories, wall = $('#wall'), dlg = $('#dlg');
let idx = 0;
const photo = (m, host) => {
  const i = new Image(); i.alt = m.alt || ''; i.loading = 'lazy';
  fallback(i, () => (host.textContent = 'Photo coming soon 💗'));
  i.src = u(m.src); host.append(i);
};

list.forEach((m, n) => {
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'pol';
  b.style.cssText = `--r:${[-3, 2.5, -1.5, 3][n % 4]}deg;--d:${(n * 0.7) % 4}s`;
  b.setAttribute('aria-label', `Open photo: ${m.caption}`);
  b.innerHTML = '<div class="ph"></div><p></p>';
  b.querySelector('p').textContent = m.caption;
  photo(m, b.querySelector('.ph'));
  b.onclick = () => open(n);
  wall.append(b);
});

function open(n) {
  idx = (n + list.length) % list.length;
  const ph = $('#bigPh'); ph.textContent = ''; photo(list[idx], ph);
  $('#bigCap').textContent = list[idx].caption;
  if (!dlg.open) dlg.showModal();
}
$('#close').onclick = () => dlg.close();
$('#prev').onclick = () => open(idx - 1);
$('#nxt').onclick = () => open(idx + 1);
dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
document.querySelectorAll('#prev,#nxt').forEach((b) => (b.hidden = list.length < 2));
