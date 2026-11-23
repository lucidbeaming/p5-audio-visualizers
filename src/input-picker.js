// Input picker for the overlay: the default mic, any other audio input,
// or an audio file. An audio file dropped anywhere on the page plays too.
import { inputs, useMic, useFile, currentInput } from './audio.js';

const FILE_CHOICE = 'file';

export function createInputPicker() {
  const wrap = document.createElement('div');
  wrap.className = 'hud-input';

  const label = document.createElement('label');
  label.htmlFor = 'input-select';
  label.textContent = 'Input';

  const select = document.createElement('select');
  select.id = 'input-select';

  const chooser = document.createElement('input');
  chooser.type = 'file';
  chooser.accept = 'audio/*';
  chooser.hidden = true;

  const status = document.createElement('p');
  status.className = 'hud-input-status';
  status.setAttribute('role', 'status');

  wrap.append(label, select, chooser, status);

  let selected = '';

  // Rebuilds the options from the device list and marks what's playing.
  function refresh() {
    return inputs().then((devices) => {
      const now = currentInput();
      const options = [['mic:', 'Default microphone']]
        .concat(devices.map((d) => ['mic:' + d.id, d.label]));
      if (now.kind === 'file') options.push(['current-file', 'File: ' + now.name]);
      options.push([FILE_CHOICE, 'Audio file…']);

      select.replaceChildren(...options.map(([value, text]) => new Option(text, value)));
      selected = now.kind === 'file' ? 'current-file' : 'mic:' + (now.id || '');
      if (!options.some(([value]) => value === selected)) selected = 'mic:';
      select.value = selected;
    });
  }

  function playFile(blob) {
    status.textContent = 'Loading ' + blob.name + '…';
    useFile(blob, () => { status.textContent = 'Click anywhere to start the file.'; })
      .then(() => { status.textContent = ''; })
      .catch((err) => { status.textContent = 'Couldn’t play ' + blob.name + ' (' + err.name + ').'; })
      .then(refresh);
  }

  select.addEventListener('change', () => {
    const value = select.value;
    if (value === FILE_CHOICE) {
      select.value = selected;
      chooser.click();
    } else if (value.startsWith('mic:')) {
      status.textContent = '';
      useMic(value.slice(4))
        .catch((err) => { status.textContent = 'Couldn’t open that input (' + err.name + ').'; })
        .then(refresh);
    }
  });

  chooser.addEventListener('change', () => {
    if (chooser.files[0]) playFile(chooser.files[0]);
    chooser.value = '';
  });

  // Drag and drop anywhere on the page.
  document.addEventListener('dragover', (e) => {
    if (e.dataTransfer && Array.from(e.dataTransfer.types).includes('Files')) e.preventDefault();
  });
  document.addEventListener('drop', (e) => {
    const dropped = e.dataTransfer && e.dataTransfer.files[0];
    if (!dropped) return;
    e.preventDefault();
    if (dropped.type.startsWith('audio/') || /\.(mp3|wav|ogg|oga|m4a|aac|flac|webm)$/i.test(dropped.name)) {
      playFile(dropped);
    } else {
      status.textContent = dropped.name + ' isn’t an audio file.';
    }
  });

  if (navigator.mediaDevices && navigator.mediaDevices.addEventListener) {
    navigator.mediaDevices.addEventListener('devicechange', refresh);
  }

  refresh();
  return wrap;
}
