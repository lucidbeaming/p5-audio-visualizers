// The start overlay. Browsers keep audio suspended until a user gesture,
// so the mic is opened from this button's click. Without a mic, an audio
// file can be played instead. It also lists the sketches; picking one
// switches the sketch running behind the overlay.
import { start, useFile } from './audio.js';

export function showGate(names, onStarted) {
  const gate = document.createElement('div');
  gate.className = 'audio-gate';

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Click to start audio';

  const fileButton = document.createElement('button');
  fileButton.type = 'button';
  fileButton.className = 'secondary';
  fileButton.textContent = 'Play an audio file instead';

  const chooser = document.createElement('input');
  chooser.type = 'file';
  chooser.accept = 'audio/*';
  chooser.hidden = true;

  const message = document.createElement('p');
  message.setAttribute('role', 'alert');

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Sketches');
  const list = document.createElement('ul');
  for (const name of names) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = '#' + name;
    link.textContent = name;
    item.appendChild(link);
    list.appendChild(item);
  }
  nav.appendChild(list);

  gate.append(button, fileButton, chooser, message, nav);
  document.body.appendChild(gate);
  markCurrent();
  window.addEventListener('hashchange', markCurrent);
  button.focus();

  function finish() {
    window.removeEventListener('hashchange', markCurrent);
    gate.remove();
    onStarted();
  }

  button.addEventListener('click', () => {
    button.disabled = true;
    message.textContent = 'Waiting for microphone permission…';
    start().then(finish, (err) => {
      message.textContent = err.name === 'NoMediaDevices'
        ? 'This browser can’t capture audio. Serve the page over HTTPS or from localhost, or play an audio file instead.'
        : err.name === 'NotAllowedError'
          ? 'Microphone access was blocked. Allow it in the browser’s site settings and try again, or play an audio file instead.'
          : 'No microphone could be opened (' + (err.name || 'unknown error') + '). You can play an audio file instead.';
      button.disabled = false;
      button.textContent = 'Try again';
    });
  });

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
    for (const link of list.querySelectorAll('a')) {
      if (link.hash === (location.hash || '#' + names[0])) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
  }
}
