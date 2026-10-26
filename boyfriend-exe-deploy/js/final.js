import { config as C } from './config.js';
import { LETTER } from './letter.js';
import { $, u, show, sky, floaters, confetti, fallback, sleep } from './common.js';

sky(); $('#sky').classList.add('slow'); floaters(document.body, { n: 10 }); confetti(document.body, 22);
$('#replayLink').href = u('/');

const cake = $('#cake'); fallback(cake); cake.src = u(C.art.cake);
const end = $('#endArt'); fallback(end); end.src = u(C.art[C.finalScene] || C.art.stargaze);

// The letter is rendered verbatim with textContent; only opacity animates.
$('#letter').replaceChildren(...LETTER.map((line, i) => { const p = document.createElement('p'); p.textContent = line; p.style.setProperty('--i', i); return p; }));

show('intro');
$('#open').onclick = async () => {
  await show('letterScene');
  await sleep(LETTER.length * 1600 + 1500);
  $('#afterLetter').hidden = false;
};
$('#toEnd').onclick = () => show('end');
