// A spectrum ridge that scrolls down the screen each frame, leaving a
// range of fading ridgelines behind it.
// Inspired by Jason Sigal's "Unknown Pleasures" demo in p5-music-viz
// (https://github.com/therewasaguy/p5-music-viz). This is a rewrite, not his code.

var source, fft, cnv;
var SCROLL = 12;          // px the old ridges move down per frame
var BANDS_PER_OCTAVE = 6;

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  background(0);
  noFill();
  stroke(255, 220);

  source = new p5.AudioIn();
  audioGate(source);
  fft = new p5.FFT(0.6, 1024);
  fft.setInput(source);
}

function draw() {
  var bands = smoothBands(logBands(fft.analyze(), BANDS_PER_OCTAVE), 2);
  var base = height / 2;

  background(0, 30, 0, 10);
  copy(cnv, 0, 0, width, height, 0, SCROLL, width, height);

  beginShape();
  curveVertex(0, base);
  for (var i = 0; i < bands.length; i++) {
    curveVertex(i / (bands.length - 1) * width, base - bands[i] / 255 * base);
  }
  curveVertex(width, base);
  endShape();
}

// Averages FFT bins into bands of equal musical width (a fixed fraction
// of an octave), low to high. Each band's top edge is its bottom edge
// times 2^(1/perOctave), but at least one bin wide, so the lowest bands
// are single bins. Bin 0 (DC) is skipped.
function logBands(spectrum, perOctave) {
  var ratio = Math.pow(2, 1 / perOctave);
  var bands = [];
  var lo = 1;
  while (lo < spectrum.length) {
    var hi = Math.min(spectrum.length, Math.max(lo + 1, Math.round(lo * ratio)));
    var sum = 0;
    for (var b = lo; b < hi; b++) sum += spectrum[b];
    bands.push(sum / (hi - lo));
    lo = hi;
  }
  return bands;
}

// Moving average over `radius` values on each side, clipped at the ends.
function smoothBands(values, radius) {
  return values.map(function (_, i) {
    var from = Math.max(0, i - radius);
    var to = Math.min(values.length - 1, i + radius);
    var sum = 0;
    for (var j = from; j <= to; j++) sum += values[j];
    return sum / (to - from + 1);
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}
