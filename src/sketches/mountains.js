// A spectrum ridge that scrolls down the screen each frame, leaving a
// range of fading ridgelines behind it.
// Inspired by Jason Sigal's "Unknown Pleasures" demo in p5-music-viz
// (https://github.com/therewasaguy/p5-music-viz). This is a rewrite, not his code.
import { logBands, smoothBands } from '../lib/bands.js';

const SCROLL = 12;          // px the old ridges move down per frame
const BANDS_PER_OCTAVE = 6;

export const description = 'A spectrum ridge that scrolls down the screen, leaving a range of ridgelines behind it.';

export default function mountains(p, audio) {
  const fft = audio.fft(0.6, 1024);

  return {
    setup() {
      p.background(0);
      p.noFill();
      p.stroke(255, 220);
    },

    draw() {
      const bands = smoothBands(logBands(fft.analyze(), BANDS_PER_OCTAVE), 2);
      const base = p.height / 2;

      p.background(0, 30, 0, 10);
      // With no source image, copy() reads from the canvas itself.
      p.copy(0, 0, p.width, p.height, 0, SCROLL, p.width, p.height);

      p.beginShape();
      p.curveVertex(0, base);
      for (let i = 0; i < bands.length; i++) {
        p.curveVertex(i / (bands.length - 1) * p.width, base - bands[i] / 255 * base);
      }
      p.curveVertex(p.width, base);
      p.endShape();
    },

    windowResized() {
      p.background(0);
    },
  };
}
