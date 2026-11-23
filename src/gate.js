// The start overlay. Browsers keep audio suspended until a user gesture,
// so the mic is opened from this button's click. It also lists the
// sketches; picking one switches the sketch running behind the overlay.
import { start } from './audio.js';

export function showGate(names, onStarted) {
  const gate = document.createElement('div');
  gate.className = 'audio-gate';

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Click to start audio';

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

  gate.append(button, message, nav);
  document.body.appendChild(gate);
  markCurrent();
  window.addEventListener('hashchange', markCurrent);
  button.focus();

  button.addEventListener('click', () => {
    button.disabled = true;
    message.textContent = 'Waiting for microphone permission…';
    start().then(() => {
      window.removeEventListener('hashchange', markCurrent);
      gate.remove();
      onStarted();
    }, (err) => {
      message.textContent = err.name === 'NoMediaDevices'
        ? 'This browser can’t capture audio. Serve the page over HTTPS or from localhost.'
        : err.name === 'NotAllowedError'
          ? 'Microphone access was blocked. Allow it in the browser’s site settings, then try again.'
          : 'No microphone could be opened (' + (err.name || 'unknown error') + ').';
      button.disabled = false;
      button.textContent = 'Try again';
    });
  });

  function markCurrent() {
    for (const link of list.querySelectorAll('a')) {
      if (link.hash === (location.hash || '#' + names[0])) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
  }
}
