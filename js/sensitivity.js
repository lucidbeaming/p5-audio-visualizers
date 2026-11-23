// Input sensitivity: a gain on the p5.AudioIn, which the level meter and
// every FFT read from. The mic is opened raw (no browser auto-gain), so
// the default boosts it (+20 dB, set by ear with music in a room). + / = raise it, - lowers it, 2 dB per press.
// The setting is remembered across sketches.
var SENSITIVITY_KEY = 'p5-audio-visualizers.sensitivityDb';
var SENSITIVITY_DEFAULT_DB = 20;
var SENSITIVITY_MIN_DB = -12;
var SENSITIVITY_MAX_DB = 36;
var SENSITIVITY_STEP_DB = 2;

function sensitivity(input) {
  var db = loadDb();
  var label = document.createElement('div');
  label.className = 'sensitivity';
  label.setAttribute('role', 'status');
  document.body.appendChild(label);
  var hideTimer;

  apply();

  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var step = (e.key === '+' || e.key === '=') ? 1 : e.key === '-' ? -1 : 0;
    if (!step) return;
    db = Math.min(SENSITIVITY_MAX_DB, Math.max(SENSITIVITY_MIN_DB, db + step * SENSITIVITY_STEP_DB));
    apply();
    show();
    try { localStorage.setItem(SENSITIVITY_KEY, String(db)); } catch (err) { /* private mode */ }
  });

  function apply() {
    input.amp(Math.pow(10, db / 20));
  }

  function show() {
    var gain = Math.pow(10, db / 20);
    label.textContent = 'Sensitivity ×' + (gain < 10 ? gain.toFixed(1) : Math.round(gain)) +
      ' (' + (db > 0 ? '+' : '') + db + ' dB)';
    label.classList.add('visible');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () { label.classList.remove('visible'); }, 1500);
  }

  function loadDb() {
    try {
      var saved = parseFloat(localStorage.getItem(SENSITIVITY_KEY));
      if (saved >= SENSITIVITY_MIN_DB && saved <= SENSITIVITY_MAX_DB) return saved;
    } catch (err) { /* private mode */ }
    return SENSITIVITY_DEFAULT_DB;
  }
}
