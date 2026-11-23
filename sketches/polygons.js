// Falling polygons, one per FFT bin. Louder bins grow larger and fall
// slower; silent ones snap back to the top.
// Inspired by Jason Sigal's FFT particle demo in p5-music-viz
// (https://github.com/therewasaguy/p5-music-viz). This is a rewrite, not his code.

var mic;
var fft;
var BINS = 512;
var shapes = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();

  mic = new p5.AudioIn();
  audioGate(mic);
  fft = new p5.FFT(0.9, BINS);
  fft.setInput(mic);

  for (var i = 0; i < BINS; i++) {
    shapes.push({
      y: random(height / 2),
      fall: random(15),
      grow: random(1),
      alpha: random(200)
    });
  }
}

function draw() {
  background(0, 0, 0, 150);
  var spectrum = fft.analyze();

  // The bins are spread over twice the canvas width, and each shape's
  // rotate() adds to the last, so the field curls across the screen.
  for (var i = 0; i < BINS; i++) {
    var s = shapes[i];
    var level = spectrum[i] / 255;

    s.y += s.fall / (level * 2);
    if (s.y > height) s.y = 0;

    var size = level * 100 * s.grow;
    stroke(255, 0, 0, s.alpha);
    rotate(-0.1);
    polygon(i / BINS * width * 2, s.y, size, map(size, 0, 50, 6, 3));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}
