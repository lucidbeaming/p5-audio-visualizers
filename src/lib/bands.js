// Averages FFT bins into bands of equal musical width (a fixed fraction
// of an octave), low to high. Each band's top edge is its bottom edge
// times 2^(1/perOctave), but at least one bin wide, so the lowest bands
// are single bins. Bin 0 (DC) is skipped.
export function logBands(spectrum, perOctave) {
  const ratio = Math.pow(2, 1 / perOctave);
  const bands = [];
  let lo = 1;
  while (lo < spectrum.length) {
    const hi = Math.min(spectrum.length, Math.max(lo + 1, Math.round(lo * ratio)));
    let sum = 0;
    for (let b = lo; b < hi; b++) sum += spectrum[b];
    bands.push(sum / (hi - lo));
    lo = hi;
  }
  return bands;
}

// Moving average over `radius` values on each side, clipped at the ends.
export function smoothBands(values, radius) {
  return values.map((_, i) => {
    const from = Math.max(0, i - radius);
    const to = Math.min(values.length - 1, i + radius);
    let sum = 0;
    for (let j = from; j <= to; j++) sum += values[j];
    return sum / (to - from + 1);
  });
}
