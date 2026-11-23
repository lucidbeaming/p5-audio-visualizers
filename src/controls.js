// Performance controls: keys for switching sketches, fullscreen, hiding the
// UI and freezing the frame, plus a small overlay with the sketch name, an
// input level meter and the key hints. The overlay fades after a few
// seconds without mouse movement or a key press; H hides it (and the
// cursor) until H is pressed again.
import { level } from './audio.js';

const IDLE_MS = 3000;
const METER_FLOOR_DB = -60;

const KEY_HINTS = [
  ['← →', 'previous / next sketch'],
  ['1–4', 'jump to a sketch'],
  ['F', 'fullscreen'],
  ['H', 'hide the UI and cursor'],
  ['Space', 'freeze the frame'],
  ['+ −', 'sensitivity'],
];

// player: { names, current(), select(name), toggleFreeze() → frozen }
export function initControls(player) {
  const hud = document.createElement('section');
  hud.className = 'hud';
  hud.setAttribute('aria-label', 'Player');

  const name = document.createElement('h1');
  name.className = 'hud-name';

  const meter = document.createElement('div');
  meter.className = 'hud-level';
  meter.setAttribute('aria-hidden', 'true');
  const bar = document.createElement('div');
  meter.appendChild(bar);

  const frozen = document.createElement('p');
  frozen.className = 'hud-frozen';
  frozen.textContent = 'Frozen';
  frozen.hidden = true;

  const keys = document.createElement('dl');
  keys.className = 'hud-keys';
  for (const [key, action] of KEY_HINTS) {
    const dt = document.createElement('dt');
    dt.textContent = key;
    const dd = document.createElement('dd');
    dd.textContent = action;
    keys.append(dt, dd);
  }

  hud.append(name, meter, frozen, keys);
  document.body.appendChild(hud);

  let idleTimer;
  function wake() {
    hud.classList.remove('idle');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (!hud.contains(document.activeElement)) hud.classList.add('idle');
    }, IDLE_MS);
  }

  function showName() {
    name.textContent = player.current();
  }

  // The meter reads the level after the sensitivity gain, in dBFS from
  // METER_FLOOR_DB to 0 (red at 0 or above: turn the sensitivity down),
  // and keeps running while the frame is frozen.
  function updateMeter() {
    const db = 20 * Math.log10(Math.max(level(), 1e-6));
    const fraction = Math.min(1, Math.max(0, 1 - db / METER_FLOOR_DB));
    bar.style.width = (fraction * 100).toFixed(1) + '%';
    meter.classList.toggle('clipping', db >= 0);
    requestAnimationFrame(updateMeter);
  }

  // Steps from the URL rather than player.current(): hashchange is async,
  // so quick repeated presses would otherwise all start from the same sketch.
  function step(offset) {
    const fromHash = location.hash.slice(1);
    const i = player.names.indexOf(player.names.includes(fromHash) ? fromHash : player.current());
    const n = player.names.length;
    player.select(player.names[(i + offset + n) % n]);
  }

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target.closest && e.target.closest('button, a, input, select, textarea, [contenteditable]')) return;

    const digit = parseInt(e.key, 10);
    if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
    else if (digit >= 1 && digit <= player.names.length) player.select(player.names[digit - 1]);
    else if ((e.key === 'f' || e.key === 'F') && !e.repeat) toggleFullscreen();
    else if ((e.key === 'h' || e.key === 'H') && !e.repeat) document.body.classList.toggle('hide-ui');
    else if (e.key === ' ' && !e.repeat) frozen.hidden = !player.toggleFreeze();
    else return;
    e.preventDefault();
    wake();
  });

  window.addEventListener('hashchange', () => {
    showName();
    frozen.hidden = true;
  });
  document.addEventListener('mousemove', wake);
  hud.addEventListener('focusin', wake);

  showName();
  wake();
  requestAnimationFrame(updateMeter);
}

function toggleFullscreen() {
  const doc = document;
  const root = doc.documentElement;
  if (doc.fullscreenElement || doc.webkitFullscreenElement) {
    (doc.exitFullscreen || doc.webkitExitFullscreen).call(doc);
  } else {
    const request = root.requestFullscreen || root.webkitRequestFullscreen;
    const result = request && request.call(root);
    if (result && result.catch) result.catch(() => { /* refused, e.g. not from a key press */ });
  }
}
