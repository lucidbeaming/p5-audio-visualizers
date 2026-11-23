// Falling polygons, one per FFT bin. Louder bins grow larger and fall
// slower; silent ones snap back to the top.
// Inspired by Jason Sigal's FFT particle demo in p5-music-viz
// (https://github.com/therewasaguy/p5-music-viz). This is a rewrite, not his code.
import { polygon } from '../lib/polygon.js';

const BINS = 512;

export default function polygons(p, audio) {
  const fft = audio.fft(0.9, BINS);
  const shapes = [];

  return {
    setup() {
      p.noFill();
      for (let i = 0; i < BINS; i++) {
        shapes.push({
          y: p.random(p.height / 2),
          fall: p.random(15),
          grow: p.random(1),
          alpha: p.random(200),
        });
      }
    },

    draw() {
      p.background(0, 0, 0, 150);
      const spectrum = fft.analyze();

      // The bins are spread over twice the canvas width, and each shape's
      // rotate() adds to the last, so the field curls across the screen.
      for (let i = 0; i < BINS; i++) {
        const s = shapes[i];
        const level = spectrum[i] / 255;

        s.y += s.fall / (level * 2);
        if (s.y > p.height) s.y = 0;

        const size = level * 100 * s.grow;
        p.stroke(255, 0, 0, s.alpha);
        p.rotate(-0.1);
        polygon(p, i / BINS * p.width * 2, s.y, size, p.map(size, 0, 50, 6, 3));
      }
    },

    windowResized() {
      p.background(0);
    },
  };
}
