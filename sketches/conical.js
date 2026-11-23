var mic, fft;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  mic = new p5.AudioIn();
  audioGate(mic);

  fft = new p5.FFT(0.90, 64);
  fft.setInput(mic);
}

function draw() {
  background(0);
  var spectrum = fft.analyze();

  // Off-centre by 150, -100 px at 1280x800, scaled to the window.
  var cx = width / 2 + width * 0.1171875;
  var cy = height / 2 - height * 0.125;

  for (var i = 0; i < spectrum.length; i++) {
    var h = map(spectrum[i], 0, 255, 0, 300);
    var sides = map(h, 0, 300, 3, 30);
    var red = ((i + 1) / spectrum.length) * 100;
    stroke(red, 50 + i, 175 - (i * 3));
    rotate((i / spectrum.length) / 30);
    polygon(cx, cy, h, sides);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
