// The one audio engine every sketch shares: a single mic input, FFT
// analysers cached by their settings, a level reading and an input gain.
// It's started once, so switching sketches never re-prompts for the mic.

// Created on first use: p5.sound loads its AudioWorklet modules while the
// p5 instance initialises and holds setup() until they're ready, so the
// input can't be built when this module is first evaluated.
let input;
function mic() {
  if (!input) {
    input = new p5.AudioIn();
    // p5.sound 1.0.1's level meter expects stereo and stops working when
    // Firefox passes a mono mic through as one channel. Upmixing at the
    // input's output node keeps level() alive in every browser.
    input.output.channelCount = 2;
    input.output.channelCountMode = 'explicit';
  }
  return input;
}

const analysers = new Map();

// Resumes the audio context (it must be called from a user gesture), then
// opens the mic. Rejects with the getUserMedia error if that fails.
export function start() {
  if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
    const err = new Error('getUserMedia is not available');
    err.name = 'NoMediaDevices';
    return Promise.reject(err);
  }
  return p5.prototype.getAudioContext().resume()
    .then(() => new Promise((resolve, reject) => mic().start(resolve, reject)));
}

// A p5.FFT on the mic. Sketches asking for the same settings share one.
export function fft(smoothing, bins) {
  const key = smoothing + '/' + bins;
  if (!analysers.has(key)) {
    const analyser = new p5.FFT(smoothing, bins);
    analyser.setInput(mic());
    analysers.set(key, analyser);
  }
  return analysers.get(key);
}

// RMS level of the mic, 0–1, after the input gain.
export function level(smoothing) {
  return mic().getLevel(smoothing);
}

// Gain applied before the level meter and every FFT.
export function setGainDb(db) {
  mic().amp(Math.pow(10, db / 20));
}
