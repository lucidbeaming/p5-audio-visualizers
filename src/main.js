// The player: one p5 instance and one canvas that run whichever sketch the
// URL names (#mountains, or ?sketch=mountains from old links). Sketches are
// swapped inside the instance instead of creating a new one, because
// p5.sound disposes every sound object when an instance is removed, and
// that would take the shared mic down with it.
import * as audio from './audio.js';
import { showGate } from './gate.js';
import { initSensitivity } from './sensitivity.js';
import conical from './sketches/conical.js';
import polygons from './sketches/polygons.js';
import mountains from './sketches/mountains.js';
import coverage from './sketches/coverage.js';

const SKETCHES = { conical, polygons, mountains, coverage };
const NAMES = Object.keys(SKETCHES);

// Picks the sketch from the URL and rewrites the URL to ./#name, so the
// address bar always shows a link that reopens the same sketch.
function sketchFromUrl() {
  const fromHash = location.hash.slice(1);
  const fromQuery = new URLSearchParams(location.search).get('sketch');
  const name = [fromHash, fromQuery].find((n) => n in SKETCHES) || NAMES[0];
  if (location.hash !== '#' + name || location.search) {
    history.replaceState(null, '', location.pathname + '#' + name);
  }
  return name;
}

new p5((p) => {
  let current;

  function use(name) {
    // Back to p5's default styles, so one sketch's settings don't leak
    // into the next.
    p.fill(255);
    p.stroke(0);
    p.strokeWeight(1);
    p.background(0);
    current = SKETCHES[name](p, audio);
    if (current.setup) current.setup();
    document.title = name + ' · p5 audio visualizers';
  }

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    use(sketchFromUrl());
    window.addEventListener('hashchange', () => use(sketchFromUrl()));
    showGate(NAMES, initSensitivity);
  };

  p.draw = () => current.draw();

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    if (current.windowResized) current.windowResized();
  };
});
