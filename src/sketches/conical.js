// Rotating FFT polygons that spiral out from an off-centre point.
import { polygon } from '../lib/polygon.js';

export default function conical(p, audio) {
  const fft = audio.fft(0.9, 64);

  return {
    setup() {
      p.noFill();
    },

    draw() {
      p.background(0);
      const spectrum = fft.analyze();

      // Off-centre by 150, -100 px at 1280x800, scaled to the window.
      const cx = p.width / 2 + p.width * 0.1171875;
      const cy = p.height / 2 - p.height * 0.125;

      for (let i = 0; i < spectrum.length; i++) {
        const h = p.map(spectrum[i], 0, 255, 0, 300);
        const sides = p.map(h, 0, 300, 3, 30);
        const red = ((i + 1) / spectrum.length) * 100;
        p.stroke(red, 50 + i, 175 - (i * 3));
        p.rotate((i / spectrum.length) / 30);
        polygon(p, cx, cy, h, sides);
      }
    },
  };
}
