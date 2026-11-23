// The one audio engine every sketch shares: a single input (a mic, or an
// audio file), FFT analysers cached by their settings, a level reading
// and an input gain. It's started once, so switching sketches never
// re-prompts for the mic.

// Created on first use: p5.sound loads its AudioWorklet modules while the
// p5 instance initialises and holds setup() until they're ready, so the
// input can't be built when this module is first evaluated.
let input;
function mic() {
  if (!input) {
    // The callback stops p5.sound from calling alert() when mediaDevices
    // is missing; start() reports that case instead.
    input = new p5.AudioIn(() => {});
    // p5.sound 1.0.1's level meter expects stereo and stops working when
    // Firefox passes a mono mic through as one channel. Upmixing at the
    // input's output node keeps level() alive in every browser.
    input.output.channelCount = 2;
    input.output.channelCountMode = 'explicit';
  }
  return input;
}

const analysers = new Map();

// Files arrive at line level, while the default sensitivity (+20 dB) is
// tuned for a mic across a room, so file audio is padded by 20 dB before
// the sensitivity gain.
const FILE_PAD = 0.1;

let current = { kind: 'none' };
let file = null;   // { element, nodes }

// Resumes the audio context (it must be called from a user gesture), then
// opens the default mic. Rejects with the getUserMedia error if that fails.
export function start() {
  return p5.prototype.getAudioContext().resume().then(() => useMic(''));
}

// The audio inputs the browser reports, as { id, label }. Labels are empty
// until the page has had mic permission once.
export function inputs() {
  if (!(navigator.mediaDevices && navigator.mediaDevices.enumerateDevices)) return Promise.resolve([]);
  return mic().getSources().then((sources) => sources
    .filter((d) => d.deviceId !== 'default' && d.deviceId !== 'communications')
    .map((d, i) => ({ id: d.deviceId, label: d.label || 'Microphone ' + (i + 1) })));
}

// Switches to a mic: '' is the browser's default, otherwise a device id.
export function useMic(id) {
  if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
    const err = new Error('getUserMedia is not available');
    err.name = 'NoMediaDevices';
    return Promise.reject(err);
  }
  stopFile();
  return mic().getSources().then((sources) => {
    // p5.sound opens inputSources[currentSource]; -1 means the default.
    mic().currentSource = id ? sources.findIndex((d) => d.deviceId === id) : -1;
    return new Promise((resolve, reject) => mic().start(resolve, reject));
  }).then(() => { current = { kind: 'mic', id }; });
}

// Switches to an audio file: it loops, is heard through the speakers, and
// drives the sketches through the same gain and analysers as the mic.
// If the browser blocks playback until a click, onNeedsClick is called and
// the promise resolves after the next click on the page.
export function useFile(blob, onNeedsClick) {
  const ctx = p5.prototype.getAudioContext();
  return ctx.resume().then(() => {
    stopFile();
    mic().stop();
    const element = new Audio();
    element.loop = true;
    element.src = URL.createObjectURL(blob);
    const source = ctx.createMediaElementSource(element);
    const pad = ctx.createGain();
    pad.gain.value = FILE_PAD;
    // Not chained: p5.sound's bundled Tone.js patches AudioNode.connect()
    // to return undefined.
    source.connect(pad);
    pad.connect(mic().output);
    source.connect(ctx.destination);
    file = { element, nodes: [source, pad] };
    current = { kind: 'file', name: blob.name || 'audio file' };
    return element.play().catch((err) => {
      if (err.name !== 'NotAllowedError') throw err;
      if (onNeedsClick) onNeedsClick();
      return new Promise((resolve, reject) => {
        document.addEventListener('pointerdown', () => element.play().then(resolve, reject), { once: true });
      });
    });
  }).catch((err) => {
    stopFile();
    current = { kind: 'none' };
    throw err;
  });
}

// What's feeding the sketches: { kind: 'mic', id }, { kind: 'file', name }
// or { kind: 'none' }.
export function currentInput() {
  return current;
}

function stopFile() {
  if (!file) return;
  file.element.pause();
  for (const node of file.nodes) node.disconnect();
  URL.revokeObjectURL(file.element.src);
  file = null;
}

// A p5.FFT on the input. Sketches asking for the same settings share one.
export function fft(smoothing, bins) {
  const key = smoothing + '/' + bins;
  if (!analysers.has(key)) {
    const analyser = new p5.FFT(smoothing, bins);
    analyser.setInput(mic());
    analysers.set(key, analyser);
  }
  return analysers.get(key);
}

// RMS level of the input, 0–1, after the input gain.
export function level(smoothing) {
  return mic().getLevel(smoothing);
}

// Gain applied before the level meter and every FFT.
export function setGainDb(db) {
  mic().amp(Math.pow(10, db / 20));
}
