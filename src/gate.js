// The start screen: a gallery of the sketches. Browsers keep audio
// suspended until a user gesture, so the mic is opened from a click here:
// on a sketch's card (which also picks it) or on the start button (for the
// sketch already picked, e.g. from a #name link). Without a mic, an audio
// file can be played instead.
import { start, useFile } from './audio.js';

const PREVIEWS = 'assets/previews/';

// sketches: [{ name, description }]
export function showGate(sketches, onStarted) {
  const names = sketches.map((s) => s.name);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const gate = document.createElement('div');
  gate.className = 'audio-gate';
  // A labelled section rather than <main>: p5 already wraps its canvas in one.
  const inner = document.createElement('section');
  inner.setAttribute('aria-labelledby', 'gate-title');
  inner.className = 'gate-inner';

  const title = document.createElement('h1');
  title.id = 'gate-title';
  title.textContent = 'p5 audio visualizers';
  const intro = document.createElement('p');
  intro.className = 'gate-intro';
  intro.textContent = 'Fullscreen sketches that react to sound. Pick one to start; your browser will ask to use the microphone.';

  const list = document.createElement('ul');
  list.className = 'gallery';
  list.setAttribute('aria-label', 'Sketches');
  for (const { name, description } of sketches) {
    const item = document.createElement('li');
    const card = document.createElement('a');
    card.className = 'card';
    card.href = '#' + name;

    const video = document.createElement('video');
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = reduceMotion ? 'none' : 'auto';
    video.poster = PREVIEWS + name + '-still.webp';
    video.src = PREVIEWS + name + '.mp4';
    video.setAttribute('aria-hidden', 'true');
    if (!reduceMotion) {
      video.autoplay = true;
      video.play().catch(() => { /* the poster stays */ });
    }

    const label = document.createElement('span');
    label.className = 'card-name';
    label.textContent = name;
    const text = document.createElement('span');
    text.className = 'card-description';
    text.textContent = description;

    card.append(video, label, text);
    // The link updates the hash (which switches the sketch), and the click
    // is the gesture that lets the mic start.
    card.addEventListener('click', () => startMic());
    item.appendChild(card);
    list.appendChild(item);
  }

  const button = document.createElement('button');
  button.type = 'button';

  const fileButton = document.createElement('button');
  fileButton.type = 'button';
  fileButton.className = 'secondary';
  fileButton.textContent = 'Play an audio file instead';

  const actions = document.createElement('div');
  actions.className = 'gate-actions';
  actions.append(button, fileButton);

  const chooser = document.createElement('input');
  chooser.type = 'file';
  chooser.accept = 'audio/*';
  chooser.hidden = true;

  const message = document.createElement('p');
  message.setAttribute('role', 'alert');

  inner.append(title, intro, list, actions, chooser, message);
  gate.appendChild(inner);
  document.body.appendChild(gate);
  markCurrent();
  window.addEventListener('hashchange', markCurrent);
  button.focus({ preventScroll: true });

  function finish() {
    window.removeEventListener('hashchange', markCurrent);
    gate.remove();
    onStarted();
  }

  let starting = false;
  function startMic() {
    if (starting) return;
    starting = true;
    button.disabled = true;
    message.textContent = 'Waiting for microphone permission…';
    start().then(finish, (err) => {
      starting = false;
      message.textContent = err.name === 'NoMediaDevices'
        ? 'This browser can’t capture audio. Serve the page over HTTPS or from localhost, or play an audio file instead.'
        : err.name === 'NotAllowedError'
          ? 'Microphone access was blocked. Allow it in the browser’s site settings and try again, or play an audio file instead.'
          : 'No microphone could be opened (' + (err.name || 'unknown error') + '). You can play an audio file instead.';
      button.disabled = false;
    });
  }

  button.addEventListener('click', startMic);

  // The audio context is resumed here, inside the click, because the file
  // chooser's change event may come too late to count as a user gesture.
  fileButton.addEventListener('click', () => {
    p5.prototype.getAudioContext().resume();
    chooser.click();
  });

  chooser.addEventListener('change', () => {
    const chosen = chooser.files[0];
    chooser.value = '';
    if (!chosen) return;
    message.textContent = 'Loading ' + chosen.name + '…';
    useFile(chosen, () => { message.textContent = 'Click anywhere to start the file.'; })
      .then(finish, (err) => {
        message.textContent = 'Couldn’t play ' + chosen.name + ' (' + err.name + ').';
      });
  });

  function markCurrent() {
    const current = names.includes(location.hash.slice(1)) ? location.hash.slice(1) : names[0];
    for (const card of list.querySelectorAll('a')) {
      if (card.hash === '#' + current) card.setAttribute('aria-current', 'true');
      else card.removeAttribute('aria-current');
    }
    button.textContent = 'Start ' + current + ' with the microphone';
  }
}
