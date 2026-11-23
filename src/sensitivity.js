// Input sensitivity. The mic is opened raw (no browser auto-gain), so the
// default boosts it: +20 dB, set by ear with music played to a mic across
// a room. + / = raise it and - lowers it, 2 dB per press. The setting is
// remembered between visits.
import { setGainDb } from './audio.js';

const STORAGE_KEY = 'p5-audio-visualizers.sensitivityDb';
const DEFAULT_DB = 20;
const MIN_DB = -12;
const MAX_DB = 36;
const STEP_DB = 2;

export function initSensitivity() {
  let db = loadDb();
  const label = document.createElement('div');
  label.className = 'sensitivity';
  label.setAttribute('role', 'status');
  document.body.appendChild(label);
  let hideTimer;

  setGainDb(db);

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const step = (e.key === '+' || e.key === '=') ? 1 : e.key === '-' ? -1 : 0;
    if (!step) return;
    db = Math.min(MAX_DB, Math.max(MIN_DB, db + step * STEP_DB));
    setGainDb(db);
    show();
    try { localStorage.setItem(STORAGE_KEY, String(db)); } catch (err) { /* private mode */ }
  });

  function show() {
    const gain = Math.pow(10, db / 20);
    label.textContent = 'Sensitivity ×' + (gain < 10 ? gain.toFixed(1) : Math.round(gain)) +
      ' (' + (db > 0 ? '+' : '') + db + ' dB)';
    label.classList.add('visible');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => label.classList.remove('visible'), 1500);
  }
}

function loadDb() {
  try {
    const saved = parseFloat(localStorage.getItem(STORAGE_KEY));
    if (saved >= MIN_DB && saved <= MAX_DB) return saved;
  } catch (err) { /* private mode */ }
  return DEFAULT_DB;
}
